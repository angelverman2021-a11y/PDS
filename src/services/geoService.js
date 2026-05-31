const EARTH_RADIUS_KM = 6371;

function toRadians(value) {
  return (Number(value) * Math.PI) / 180;
}

export function calculateDistanceKm(origin, destination) {
  if (!origin || !destination) return null;

  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);
  const deltaLat = toRadians(destination.latitude - origin.latitude);
  const deltaLng = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return Number((EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

export function generateMapsLink({ latitude, longitude, name }) {
  const query = encodeURIComponent(`${name ?? 'FPS Shop'} ${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
