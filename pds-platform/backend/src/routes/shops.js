import { Router } from 'express';
import { config } from '../config/index.js';
import db, { rowToShop } from '../db/index.js';

const router = Router();

const STOCK_STATUS = { AVAILABLE: 'available', LOW: 'low', OUT_OF_STOCK: 'out_of_stock' };

// ── Prepared statements ───────────────────────────────────
const stmts = {
  getAll:       db.prepare('SELECT * FROM shops ORDER BY distance_km ASC'),
  getByPincode: db.prepare('SELECT * FROM shops WHERE pincode = ? ORDER BY distance_km ASC'),
  getById:      db.prepare('SELECT * FROM shops WHERE id = ? OR fps_id = ?'),
  updateStock:  db.prepare('UPDATE shops SET stock_status = ?, last_delivery = ? WHERE id = ?'),
  incComplaint: db.prepare('UPDATE shops SET complaint_count = complaint_count + 1 WHERE id = ?'),
};

function mapsLink(lat, lon, name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${lat},${lon}`)}`;
}

// ── External providers (keys stay server-side) ────────────
async function fetchFpsDataset(pincode) {
  if (!config.fpsDatasetUrl) return null;
  try {
    const res = await fetch(config.fpsDatasetUrl);
    if (!res.ok) return null;
    const data = await res.json();
    const records = Array.isArray(data) ? data : data.shops || data.records || [];
    const matches = records.filter(s =>
      `${s.pincode || ''} ${s.address || ''} ${s.display_name || ''}`.includes(String(pincode))
    );
    return matches.length ? { provider: 'fps_dataset', shops: matches } : null;
  } catch { return null; }
}

async function fetchGooglePlaces(pincode) {
  if (!config.googlePlacesKey) return null;
  try {
    const query = encodeURIComponent(`ration shop near ${pincode}`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${config.googlePlacesKey}&type=supermarket&language=en&region=in`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'OK' || !Array.isArray(data.results)) return null;
    const shops = data.results.map(p => ({
      id: p.place_id, fpsId: p.place_id, name: p.name,
      address: p.formatted_address, phone: p.formatted_phone_number || 'Unavailable',
      rating: p.rating ?? 4.0, reviewCount: p.user_ratings_total ?? 0,
      isOpen: p.opening_hours?.open_now ?? true,
      stockStatus: p.opening_hours?.open_now ? STOCK_STATUS.AVAILABLE : STOCK_STATUS.LOW,
      latitude: p.geometry.location.lat, longitude: p.geometry.location.lng,
      mapsLink: p.url || mapsLink(p.geometry.location.lat, p.geometry.location.lng, p.name),
      lastDelivery: 'Updated via Google Places', complaintCount: 0,
      totalBeneficiaries: 0, distanceKm: 0,
      timings: p.opening_hours?.open_now ? 'Open now' : 'Closed',
    }));
    return shops.length ? { provider: 'google_places', shops } : null;
  } catch { return null; }
}

async function fetchOsm(pincode) {
  try {
    const url = `${config.osmEndpoint}?q=${encodeURIComponent(`ration shop ${pincode}`)}&format=jsonv2&limit=10&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'PDS-Platform/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    const shops = data.map(p => ({
      id: String(p.place_id || p.osm_id), fpsId: String(p.osm_id || p.place_id),
      name: p.display_name.split(',')[0] || 'Ration Shop', address: p.display_name,
      phone: 'Not available', rating: 4.0, reviewCount: 10, isOpen: true,
      stockStatus: STOCK_STATUS.AVAILABLE,
      latitude: Number(p.lat), longitude: Number(p.lon),
      mapsLink: `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=18/${p.lat}/${p.lon}`,
      lastDelivery: 'Mapped via OSM', complaintCount: 0,
      totalBeneficiaries: 0, distanceKm: 0, timings: 'Open now',
    }));
    return { provider: 'osm', shops };
  } catch { return null; }
}

// ── GET /api/v1/shops?pincode=411011&limit=10 ─────────────
router.get('/', async (req, res) => {
  const { pincode, limit = 10 } = req.query;
  const n = Math.min(parseInt(limit) || 10, 50);

  if (!pincode) {
    // No pincode — return all shops from DB
    const shops = stmts.getAll.all().map(rowToShop);
    return res.json({ ok: true, provider: 'db', shops });
  }

  if (!/^[1-9][0-9]{5}$/.test(String(pincode).trim())) {
    return res.status(400).json({ ok: false, error: 'PINCODE_INVALID' });
  }

  // 1. Try external providers first (real data)
  const external =
    (await fetchFpsDataset(pincode)) ||
    (await fetchGooglePlaces(pincode)) ||
    (await fetchOsm(pincode));

  if (external) {
    return res.json({ ok: true, pincode, provider: external.provider, shops: external.shops.slice(0, n) });
  }

  // 2. Fallback: query DB by pincode, else return all DB shops
  const byPincode = stmts.getByPincode.all(String(pincode)).map(rowToShop);
  const fallback  = byPincode.length ? byPincode : stmts.getAll.all().map(rowToShop);
  return res.json({ ok: true, pincode, provider: 'db', shops: fallback.slice(0, n) });
});

// ── GET /api/v1/shops/:id ─────────────────────────────────
router.get('/:id', (req, res) => {
  const row = stmts.getById.get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'SHOP_NOT_FOUND' });
  res.json({ ok: true, shop: rowToShop(row) });
});

// ── PATCH /api/v1/shops/:id/stock ────────────────────────
router.patch('/:id/stock', (req, res) => {
  const { stockStatus } = req.body;
  const validStatuses = Object.values(STOCK_STATUS);
  if (!validStatuses.includes(stockStatus)) {
    return res.status(400).json({ ok: false, error: 'INVALID_STOCK_STATUS' });
  }
  const row = stmts.getById.get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'SHOP_NOT_FOUND' });

  stmts.updateStock.run(stockStatus, new Date().toISOString().slice(0, 10), row.id);
  const updated = stmts.getById.get(row.id, row.id);
  res.json({ ok: true, shop: rowToShop(updated) });
});

export default router;
