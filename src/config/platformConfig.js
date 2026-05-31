export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const SHOP_DATA_PROVIDER = import.meta.env.VITE_SHOP_DATA_PROVIDER || '';
export const OSM_NOMINATIM_ENDPOINT = import.meta.env.VITE_OSM_NOMINATIM_ENDPOINT || 'https://nominatim.openstreetmap.org/search';

export const REAL_SHOP_PROVIDER_CONFIGURED = Boolean(
  import.meta.env.VITE_GOOGLE_PLACES_API_KEY ||
  OSM_NOMINATIM_ENDPOINT ||
  import.meta.env.VITE_FPS_DATASET_URL
);

export const OTP_PROVIDER = import.meta.env.VITE_OTP_PROVIDER || '';
export const EMAIL_PROVIDER = import.meta.env.VITE_EMAIL_PROVIDER || '';

export const PROJECT_SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@gmail.com';

export const APPROVED_DEMO_TEST_NUMBERS = {
  '+919876543210': { otp: '123456', label: 'Primary citizen demo number' },
  '+919823001122': { otp: '654321', label: 'Secondary citizen demo number' },
};

export function getModeLabel() {
  return DEMO_MODE ? 'Demo OTP Mode Enabled' : 'Production Mode';
}
