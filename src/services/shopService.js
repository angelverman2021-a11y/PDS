import { calculateDistanceKm, generateMapsLink } from './geoService';
import { SHOP_DATA_PROVIDER } from '../config/platformConfig';
import { MOCK_SHOPS, STOCK_STATUS } from '../constants';

const PINCODE_COORDINATES = {
  411011: { latitude: 18.5204, longitude: 73.8567 },
  411017: { latitude: 18.6298, longitude: 73.7997 },
  411028: { latitude: 18.5089, longitude: 73.9259 },
  411037: { latitude: 18.4731, longitude: 73.8553 },
  411038: { latitude: 18.5074, longitude: 73.8077 },
  411040: { latitude: 18.4855, longitude: 73.8934 },
};

const shopCache = [];

export function validatePincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(String(pincode ?? '').trim());
}

export function cacheShops(shops) {
  shopCache.splice(0, shopCache.length, ...shops);
}

export function getRegisteredFpsShops() {
  return shopCache.length > 0 ? shopCache : MOCK_SHOPS;
}

function normalizeShopResult(shop) {
  return {
    id: shop.id || shop.place_id || shop.osm_id || `${shop.latitude}-${shop.longitude}`,
    fpsId: shop.fpsId || shop.place_id || shop.id,
    name: shop.name,
    address: shop.address || shop.formatted_address || shop.display_name || 'Unknown address',
    phone: shop.phone || shop.formatted_phone_number || shop.telephone || 'Not available',
    rating: typeof shop.rating === 'number' ? shop.rating : 4.0,
    reviewCount: shop.user_ratings_total || shop.reviewCount || 10,
    isOpen: typeof shop.isOpen === 'boolean' ? shop.isOpen : true,
    stockStatus: shop.stockStatus || STOCK_STATUS.AVAILABLE,
    latitude: Number(shop.latitude || shop.lat || shop.geometry?.location?.lat || 0),
    longitude: Number(shop.longitude || shop.lon || shop.geometry?.location?.lng || 0),
    mapsLink: shop.mapsLink || generateMapsLink({ latitude: Number(shop.latitude || shop.lat), longitude: Number(shop.longitude || shop.lon) }),
    lastDelivery: shop.lastDelivery || 'Updated recently',
    complaintCount: shop.complaintCount ?? 0,
    totalBeneficiaries: shop.totalBeneficiaries ?? 0,
    timings: shop.timings || (shop.isOpen ? 'Open now' : 'Closed'),
    dealerName: shop.dealerName || shop.name,
    recommendationReason: shop.recommendationReason || 'Matched from real location data',
  };
}

async function searchGooglePlaces({ pincode, limit }) {
  const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!key) {
    return { ok: false, error: 'GOOGLE_PLACES_KEY_NOT_CONFIGURED', shops: [] };
  }

  const query = encodeURIComponent(`ration shop near ${pincode}`);
  const endpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${key}&type=supermarket&language=en&region=in`;

  const result = await fetch(endpoint);
  if (!result.ok) {
    return { ok: false, error: 'GOOGLE_PLACES_REQUEST_FAILED', shops: [] };
  }

  const data = await result.json();
  if (data.status !== 'OK' || !Array.isArray(data.results)) {
    return { ok: false, error: 'GOOGLE_PLACES_NO_RESULTS', shops: [] };
  }

  const shops = data.results.slice(0, limit).map(place => ({
    id: place.place_id,
    name: place.name,
    address: place.formatted_address,
    phone: place.formatted_phone_number || 'Unavailable',
    rating: place.rating ?? 4.0,
    reviewCount: place.user_ratings_total ?? 0,
    isOpen: place.opening_hours?.open_now ?? true,
    stockStatus: place.opening_hours?.open_now ? STOCK_STATUS.AVAILABLE : STOCK_STATUS.LOW,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    mapsLink: place.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
    lastDelivery: 'Updated via Google Places',
    complaintCount: 0,
    totalBeneficiaries: 0,
    recommendationReason: 'Google Places result',
  }));

  return { ok: true, provider: 'google_places', shops };
}

async function searchNominatim({ pincode, limit }) {
  const endpoint = import.meta.env.VITE_OSM_NOMINATIM_ENDPOINT || 'https://nominatim.openstreetmap.org/search';
  const url = `${endpoint}?q=${encodeURIComponent(`ration shop ${pincode}`)}&format=jsonv2&limit=${limit}&addressdetails=1`;
  const result = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!result.ok) {
    return { ok: false, error: 'NOMINATIM_REQUEST_FAILED', shops: [] };
  }

  const data = await result.json();
  if (!Array.isArray(data)) {
    return { ok: false, error: 'NOMINATIM_NO_RESULTS', shops: [] };
  }

  const shops = data.map(place => ({
    id: place.place_id || place.osm_id,
    name: place.display_name.split(',')[0] || 'Ration Shop',
    address: place.display_name,
    phone: 'Not available',
    rating: 4.0,
    reviewCount: 10,
    isOpen: true,
    stockStatus: STOCK_STATUS.AVAILABLE,
    latitude: Number(place.lat),
    longitude: Number(place.lon),
    mapsLink: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`,
    lastDelivery: 'Mapped via OSM',
    complaintCount: 0,
    totalBeneficiaries: 0,
    recommendationReason: 'OpenStreetMap Nominatim result',
  }));

  return { ok: true, provider: 'osm', shops };
}

async function searchExternalShopProvider({ pincode, limit = 10 }) {
  if (!validatePincode(pincode)) {
    return { ok: false, error: 'PINCODE_INVALID', shops: [] };
  }

  const googleCandidate = SHOP_DATA_PROVIDER === 'google_places' || import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (googleCandidate) {
    const googleResult = await searchGooglePlaces({ pincode, limit });
    if (googleResult.ok && googleResult.shops.length > 0) {
      return googleResult;
    }
  }

  const osmResult = await searchNominatim({ pincode, limit });
  if (osmResult.ok && osmResult.shops.length > 0) {
    return osmResult;
  }

  return {
    ok: false,
    error: 'REAL_SHOP_DATA_UNAVAILABLE',
    provider: SHOP_DATA_PROVIDER || 'nominatim',
    shops: [],
    message: 'No real shop results were found for the requested pincode.',
  };
}

export async function searchShopsByPincode({ pincode, userLocation, limit = 10 }) {
  if (!validatePincode(pincode)) {
    return { ok: false, error: 'PINCODE_INVALID', shops: [] };
  }

  const providerResult = await searchExternalShopProvider({ pincode, limit });
  if (!providerResult.ok) return providerResult;

  const origin = userLocation ?? PINCODE_COORDINATES[pincode];
  const shops = providerResult.shops
    .map(shop => normalizeShopResult(shop))
    .map(shop => ({
      ...shop,
      distanceKm: origin ? calculateDistanceKm(origin, shop) : shop.distanceKm,
      mapsLink: shop.mapsLink ?? generateMapsLink(shop),
    }))
    .sort((a, b) => {
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
      if (a.stockStatus !== b.stockStatus) return a.stockStatus === STOCK_STATUS.AVAILABLE ? -1 : 1;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit);

  cacheShops(shops);
  return { ok: true, pincode, source: providerResult.provider, shops };
}
