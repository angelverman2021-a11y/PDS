import { API_BASE_URL } from '../config/platformConfig';

export function normalizePhoneNumber(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return String(phone ?? '').trim();
}

// POST /api/v1/auth/send-otp
export async function sendOtp({ rationCardNo, phone }) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rationCardNo, phone }),
  });
  const data = await res.json();
  return data; // { ok, maskedPhone, debugOtp? }
}

// POST /api/v1/auth/verify-otp
export async function verifyOtp({ rationCardNo, otp }) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rationCardNo, otp }),
  });
  const data = await res.json();
  return data; // { ok, token, beneficiary } | { ok: false, error }
}

// POST /api/v1/auth/staff-login
export async function staffLogin({ role, username, password }) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/staff-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, username, password }),
  });
  const data = await res.json();
  return data; // { ok, token, user } | { ok: false, error }
}
