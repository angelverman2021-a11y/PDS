import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import {
  BENEFICIARY_REGISTRY,
  DEMO_OTPS,
  MOCK_USERS,
  normalizePhone,
} from '../data/registry.js';

const router = Router();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;

// In-memory OTP store — Phase 6 will move this to Redis/DB
const otpStore = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

// ── POST /api/v1/auth/send-otp ────────────────────────────
// Validates ration card + phone, then issues OTP
router.post('/send-otp', (req, res) => {
  const { rationCardNo, phone } = req.body;
  if (!rationCardNo || !phone) {
    return res.status(400).json({ ok: false, error: 'rationCardNo and phone are required' });
  }

  const key = rationCardNo.trim().toUpperCase();
  const beneficiary = BENEFICIARY_REGISTRY[key];
  if (!beneficiary || normalizePhone(beneficiary.phone) !== normalizePhone(phone)) {
    return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
  }

  const normalizedPhone = normalizePhone(beneficiary.phone);
  let otp;

  if (config.demoMode) {
    otp = DEMO_OTPS[normalizedPhone];
    if (!otp) return res.status(403).json({ ok: false, error: 'DEMO_NUMBER_NOT_APPROVED' });
  } else {
    otp = generateOtp();
    // TODO Phase 5+: await smsProvider.send(normalizedPhone, otp)
  }

  otpStore.set(normalizedPhone, {
    otp,
    rationCardNo: key,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });

  return res.json({
    ok: true,
    maskedPhone: beneficiary.maskedPhone,
    ...(config.demoMode && { debugOtp: otp }),
  });
});

// ── POST /api/v1/auth/verify-otp ──────────────────────────
// Verifies OTP and returns JWT + beneficiary profile
router.post('/verify-otp', (req, res) => {
  const { rationCardNo, otp } = req.body;
  if (!rationCardNo || !otp) {
    return res.status(400).json({ ok: false, error: 'rationCardNo and otp are required' });
  }

  const key = rationCardNo.trim().toUpperCase();
  const beneficiary = BENEFICIARY_REGISTRY[key];
  if (!beneficiary) {
    return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
  }

  const normalizedPhone = normalizePhone(beneficiary.phone);
  const record = otpStore.get(normalizedPhone);

  if (!record || record.rationCardNo !== key) {
    return res.status(401).json({ ok: false, error: 'OTP_NOT_FOUND' });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedPhone);
    return res.status(401).json({ ok: false, error: 'OTP_EXPIRED' });
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(normalizedPhone);
    return res.status(429).json({ ok: false, error: 'OTP_LOCKED' });
  }
  if (String(record.otp) !== String(otp).trim()) {
    record.attempts += 1;
    otpStore.set(normalizedPhone, record);
    const remaining = MAX_ATTEMPTS - record.attempts;
    return res.status(401).json({ ok: false, error: 'OTP_INVALID', attemptsRemaining: remaining });
  }

  otpStore.delete(normalizedPhone);

  const { phone: _p, ...safeBeneficiary } = beneficiary;
  const token = signToken({ id: beneficiary.id, role: 'citizen', rationCardNo: key });

  return res.json({ ok: true, token, beneficiary: safeBeneficiary });
});

// ── POST /api/v1/auth/staff-login ─────────────────────────
// Username + password login for dealer and admin
router.post('/staff-login', (req, res) => {
  const { role, username, password } = req.body;
  if (!role || !username || !password) {
    return res.status(400).json({ ok: false, error: 'role, username and password are required' });
  }
  if (!['dealer', 'admin'].includes(role)) {
    return res.status(400).json({ ok: false, error: 'role must be dealer or admin' });
  }

  const creds = config.staffCredentials[role];
  if (!creds?.username || !creds?.password) {
    return res.status(503).json({ ok: false, error: 'STAFF_LOGIN_NOT_CONFIGURED' });
  }
  if (username.trim() !== creds.username || password !== creds.password) {
    return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
  }

  const user = MOCK_USERS[role];
  const token = signToken({ id: user.id, role });

  return res.json({ ok: true, token, user });
});

export default router;
