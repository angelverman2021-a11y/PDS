import { API_BASE_URL } from '../config/platformConfig';
import { calculateDistanceKm, generateMapsLink } from './geoService';
import { STOCK_STATUS } from '../constants';

const BASE = `${API_BASE_URL}/api/v1/shops`;

const PINCODE_COORDINATES = {
  411011: { latitude: 18.5204, longitude: 73.8567 },
  411017: { latitude: 18.6298, longitude: 73.7997 },
  411028: { latitude: 18.5089, longitude: 73.9259 },
  411037: { latitude: 18.4731, longitude: 73.8553 },
  411038: { latitude: 18.5074, longitude: 73.8077 },
  411040: { latitude: 18.4855, longitude: 73.8934 },
};

// In-memory cache for ShopDetails fallback
let shopCache = [];

export function validatePincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(String(pincode ?? '').trim());
}

export function cacheShops(shops) {
  shopCache = shops;
}

export function getRegisteredFpsShops() {
  return shopCache;
}

export async function fetchNearbyShops(latitude, longitude, radiusKm = 10) {
  try {
    const res = await fetch(`${BASE}/nearby?lat=${latitude}&lon=${longitude}&radius=${radiusKm}&limit=20`);
    const data = await res.json();
    if (!data.ok) return { ok: false, shops: [] };
    const shops = data.shops.map(shop => ({
      ...shop,
      mapsLink: shop.mapsLink ?? generateMapsLink(shop),
    }));
    cacheShops(shops);
    return { ok: true, source: data.provider, shops };
  } catch {
    return { ok: false, shops: [] };
  }
}

export async function fetchAllShops() {
  try {
    const res = await fetch(BASE);
    const data = await res.json();
    if (!data.ok) return [];
    const shops = data.shops.map(shop => ({
      ...shop,
      mapsLink: shop.mapsLink ?? generateMapsLink(shop),
    }));
    cacheShops(shops);
    return shops;
  } catch { return []; }
}

export async function fetchShopById(id) {
  try {
    const res = await fetch(`${BASE}/${id}`);
    const data = await res.json();
    return data.ok ? data.shop : null;
  } catch { return null; }
}

export async function searchShopsByPincode({ pincode, userLocation, limit = 10 }) {
  if (!validatePincode(pincode)) {
    return { ok: false, error: 'PINCODE_INVALID', shops: [] };
  }

  try {
    const res = await fetch(`${BASE}?pincode=${encodeURIComponent(pincode)}&limit=${limit}`);
    const data = await res.json();
    if (!data.ok && data.provider !== 'maps_redirect') return { ok: false, error: data.error || 'SHOP_FETCH_FAILED', shops: [] };

    if (data.provider === 'maps_redirect') {
      return { ok: true, pincode, source: 'maps_redirect', shops: [], geo: data.geo, mapsSearchUrl: data.mapsSearchUrl };
    }

    const origin = userLocation ?? PINCODE_COORDINATES[Number(pincode)];
    const shops = data.shops
      .map(shop => ({
        ...shop,
        distanceKm: origin && shop.latitude && shop.longitude
          ? calculateDistanceKm(origin, shop)
          : shop.distanceKm ?? 0,
        mapsLink: shop.mapsLink ?? generateMapsLink(shop),
      }))
      .sort((a, b) => {
        if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
        if (a.stockStatus !== b.stockStatus) return a.stockStatus === STOCK_STATUS.AVAILABLE ? -1 : 1;
        return a.distanceKm - b.distanceKm;
      });

    cacheShops(shops);
    return { ok: true, pincode, source: data.provider, shops };
  } catch {
    return { ok: false, error: 'NETWORK_ERROR', shops: [] };
  }
}
