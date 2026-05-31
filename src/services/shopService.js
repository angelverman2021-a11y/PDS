import { MOCK_SHOPS } from '../constants';
import { calculateDistanceKm, generateMapsLink } from './geoService';

const PINCODE_COORDINATES = {
  411011: { latitude: 18.5204, longitude: 73.8567 },
  411017: { latitude: 18.6298, longitude: 73.7997 },
  411028: { latitude: 18.5089, longitude: 73.9259 },
  411037: { latitude: 18.4731, longitude: 73.8553 },
  411038: { latitude: 18.5074, longitude: 73.8077 },
  411040: { latitude: 18.4855, longitude: 73.8934 },
};

export function validatePincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(String(pincode ?? '').trim());
}

export function getRegisteredFpsShops() {
  return MOCK_SHOPS.map(shop => ({
    ...shop,
    registered: true,
    mapsLink: generateMapsLink(shop),
  }));
}

export function searchShopsByPincode({ pincode, userLocation, limit = 10 }) {
  if (!validatePincode(pincode)) {
    return { ok: false, error: 'PINCODE_INVALID', shops: [] };
  }

  const origin = userLocation ?? PINCODE_COORDINATES[pincode];
  const exactMatches = getRegisteredFpsShops().filter(shop => shop.pincode === pincode);
  const candidateShops = exactMatches.length ? exactMatches : getRegisteredFpsShops();

  const shops = candidateShops
    .map(shop => ({
      ...shop,
      distanceKm: origin ? calculateDistanceKm(origin, shop) : shop.distanceKm,
      recommendationReason: shop.pincode === pincode
        ? 'Matched beneficiary pincode and registered FPS area'
        : 'Nearby registered FPS fallback because no exact pincode match was found',
    }))
    .sort((a, b) => {
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
      if (a.stockStatus !== b.stockStatus) return a.stockStatus === 'available' ? -1 : 1;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit);

  return { ok: true, pincode, source: 'registered-fps-seed-data', shops };
}
