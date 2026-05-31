import { APPROVED_DEMO_TEST_NUMBERS, DEMO_MODE, OTP_PROVIDER } from '../config/platformConfig';

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 3;
const otpStore = new Map();

export function normalizePhoneNumber(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return String(phone ?? '').trim();
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp({ phone }) {
  const normalizedPhone = normalizePhoneNumber(phone);

  if (DEMO_MODE) {
    const demoRecord = APPROVED_DEMO_TEST_NUMBERS[normalizedPhone];
    if (!demoRecord) {
      return { ok: false, error: 'DEMO_NUMBER_NOT_APPROVED' };
    }
    return {
      ok: true,
      provider: 'demo',
      verificationId: `demo_${Date.now()}`,
      otp: demoRecord.otp,
      message: 'Demo OTP Mode Enabled. OTP sent only for an approved test number.',
    };
  }

  if (OTP_PROVIDER) {
    return {
      ok: false,
      error: 'SERVER_SIDE_OTP_REQUIRED',
      message: 'Production OTP must be sent from a backend using Twilio Verify, Firebase Phone Auth, or MSG91.',
    };
  }

  const otp = generateOtp();
  otpStore.set(normalizedPhone, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });

  return {
    ok: true,
    provider: 'local',
    verificationId: `local_${Date.now()}`,
    otp,
    message: 'OTP generated locally for verification. Use the OTP from your registered phone number.',
  };
}

export async function verifyOtp({ phone, otp }) {
  const normalizedPhone = normalizePhoneNumber(phone);

  if (DEMO_MODE) {
    const record = APPROVED_DEMO_TEST_NUMBERS[normalizedPhone];
    if (!record) return { ok: false, error: 'DEMO_NUMBER_NOT_APPROVED' };
    return record.otp === String(otp).trim()
      ? { ok: true, provider: 'demo' }
      : { ok: false, error: 'OTP_INVALID' };
  }

  if (OTP_PROVIDER) {
    return {
      ok: false,
      error: 'SERVER_SIDE_OTP_REQUIRED',
      message: 'Production OTP verification must happen on the backend provider callback/session.',
    };
  }

  const record = otpStore.get(normalizedPhone);
  if (!record) {
    return { ok: false, error: 'OTP_EXPIRED' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedPhone);
    return { ok: false, error: 'OTP_EXPIRED' };
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    otpStore.delete(normalizedPhone);
    return { ok: false, error: 'OTP_LOCKED' };
  }

  if (String(record.otp) !== String(otp).trim()) {
    record.attempts += 1;
    otpStore.set(normalizedPhone, record);
    return { ok: false, error: 'OTP_INVALID', attempts: record.attempts };
  }

  otpStore.delete(normalizedPhone);
  return { ok: true, provider: 'local' };
}
