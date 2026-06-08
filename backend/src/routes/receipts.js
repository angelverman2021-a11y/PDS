import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { BENEFICIARY_REGISTRY, DEMO_OTPS, normalizePhone } from '../data/registry.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR   = join(__dirname, '../../data');
const STORE_FILE = join(DATA_DIR, 'receipts.json');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

function loadReceipts() {
  if (!existsSync(STORE_FILE)) return getSeedReceipts();
  try { return JSON.parse(readFileSync(STORE_FILE, 'utf-8')); }
  catch { return getSeedReceipts(); }
}

function saveReceipts(data) {
  writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

function getSeedReceipts() {
  return [
    {
      id: 'rcpt_001', qrCode: 'QR-PDS-2025-07-001', month: 'July 2025', monthKey: '2025-07',
      shopId: 'shop_001', shopName: 'Ram Ration Store', dealerId: 'dealer_001',
      citizenId: 'citizen_001', rationCardNo: 'MH-2024-00123', category: 'PHH', familySize: 4,
      distributedItems: [
        { id: 'wheat', name: 'Wheat', qty: 12, unit: 'kg', pricePerUnit: 2, total: 24, icon: '🌾' },
        { id: 'sugar', name: 'Sugar', qty: 1, unit: 'kg', pricePerUnit: 13.5, total: 13.5, icon: '🧂' },
        { id: 'kerosene', name: 'Kerosene', qty: 2, unit: 'ltr', pricePerUnit: 15, total: 30, icon: '🛢️' },
        { id: 'dal', name: 'Chana Dal', qty: 1, unit: 'kg', pricePerUnit: 20, total: 20, icon: '🫘' },
        { id: 'salt', name: 'Iodised Salt', qty: 1, unit: 'kg', pricePerUnit: 2, total: 2, icon: '🧂' },
      ],
      totalAmount: 89.5, status: 'verified',
      generatedAt: '2025-07-03T11:32:00', verifiedAt: '2025-07-04T14:10:00',
      verificationMethod: 'OTP', dealerConfirmedAt: '2025-07-03T11:30:00',
      allocationChecked: true, isPartial: false,
    },
    {
      id: 'rcpt_002', qrCode: 'QR-PDS-2025-06-001', month: 'June 2025', monthKey: '2025-06',
      shopId: 'shop_001', shopName: 'Ram Ration Store', dealerId: 'dealer_001',
      citizenId: 'citizen_001', rationCardNo: 'MH-2024-00123', category: 'PHH', familySize: 4,
      distributedItems: [
        { id: 'wheat', name: 'Wheat', qty: 12, unit: 'kg', pricePerUnit: 2, total: 24, icon: '🌾' },
        { id: 'rice', name: 'Rice', qty: 8, unit: 'kg', pricePerUnit: 3, total: 24, icon: '🍚' },
        { id: 'sugar', name: 'Sugar', qty: 1, unit: 'kg', pricePerUnit: 13.5, total: 13.5, icon: '🧂' },
        { id: 'kerosene', name: 'Kerosene', qty: 2, unit: 'ltr', pricePerUnit: 15, total: 30, icon: '🛢️' },
        { id: 'dal', name: 'Chana Dal', qty: 1, unit: 'kg', pricePerUnit: 20, total: 20, icon: '🫘' },
        { id: 'salt', name: 'Iodised Salt', qty: 1, unit: 'kg', pricePerUnit: 2, total: 2, icon: '🧂' },
      ],
      totalAmount: 113.5, status: 'verified',
      generatedAt: '2025-06-05T10:15:00', verifiedAt: '2025-06-05T10:20:00',
      verificationMethod: 'OTP', dealerConfirmedAt: '2025-06-05T10:12:00',
      allocationChecked: true, isPartial: false,
    },
  ];
}

const router = Router();

const CATEGORY_ENTITLEMENTS = {
  PHH:  { wheat: { qty: 3, type: 'per_person' }, rice: { qty: 2, type: 'per_person' }, sugar: { qty: 1, type: 'per_household' }, kerosene: { qty: 2, type: 'per_household' }, dal: { qty: 1, type: 'per_household' }, salt: { qty: 1, type: 'per_household' } },
  AAY:  { wheat: { qty: 20, type: 'per_household' }, rice: { qty: 15, type: 'per_household' }, sugar: { qty: 2, type: 'per_household' }, kerosene: { qty: 3, type: 'per_household' }, dal: { qty: 2, type: 'per_household' }, salt: { qty: 1, type: 'per_household' } },
  NPHH: { wheat: { qty: 2, type: 'per_person' }, rice: { qty: 1, type: 'per_person' }, sugar: { qty: 0.5, type: 'per_household' }, kerosene: { qty: 1, type: 'per_household' }, dal: { qty: 0, type: 'per_household' }, salt: { qty: 1, type: 'per_household' } },
};

const RATION_PRODUCTS = [
  { id: 'wheat',    name: 'Wheat',        unit: 'kg',  pricePerUnit: 2,    icon: '🌾' },
  { id: 'rice',     name: 'Rice',         unit: 'kg',  pricePerUnit: 3,    icon: '🍚' },
  { id: 'sugar',    name: 'Sugar',        unit: 'kg',  pricePerUnit: 13.5, icon: '🧂' },
  { id: 'kerosene', name: 'Kerosene',     unit: 'ltr', pricePerUnit: 15,   icon: '🛢️' },
  { id: 'dal',      name: 'Chana Dal',    unit: 'kg',  pricePerUnit: 20,   icon: '🫘' },
  { id: 'salt',     name: 'Iodised Salt', unit: 'kg',  pricePerUnit: 2,    icon: '🧂' },
];

function computeAllocation(category, familySize) {
  const rules = CATEGORY_ENTITLEMENTS[category];
  if (!rules) return [];
  return RATION_PRODUCTS.map(p => {
    const rule = rules[p.id];
    if (!rule) return null;
    const qty = rule.type === 'per_person' ? rule.qty * familySize : rule.qty;
    if (qty === 0) return null;
    return { ...p, entitledQty: qty, totalPrice: +(qty * p.pricePerUnit).toFixed(2) };
  }).filter(Boolean);
}

// JSON-file-backed receipt store — Phase 6 replaces with DB
let receipts = loadReceipts();

// ── POST /api/v1/receipts/verify-beneficiary ──────────────
router.post('/verify-beneficiary', (req, res) => {
  const { rationCardNo, otp } = req.body;
  if (!rationCardNo || !otp) return res.status(400).json({ ok: false, error: 'rationCardNo and otp are required' });

  const key = rationCardNo.trim().toUpperCase();
  const beneficiary = BENEFICIARY_REGISTRY[key];
  if (!beneficiary) return res.status(404).json({ ok: false, reason: 'Ration card not found in registry.' });

  const phone = normalizePhone(beneficiary.phone);
  const expectedOtp = DEMO_OTPS[phone];
  if (!expectedOtp || String(expectedOtp) !== String(otp).trim()) {
    return res.status(401).json({ ok: false, reason: 'Invalid OTP. Please try again.' });
  }

  const { phone: _p, ...safeBeneficiary } = beneficiary;
  res.json({ ok: true, success: true, beneficiary: safeBeneficiary });
});

// ── POST /api/v1/receipts/check-allocation ────────────────
router.post('/check-allocation', (req, res) => {
  const { rationCardNo, month } = req.body;
  if (!rationCardNo) return res.status(400).json({ ok: false, error: 'rationCardNo is required' });

  const beneficiary = BENEFICIARY_REGISTRY[rationCardNo.trim().toUpperCase()];
  if (!beneficiary) return res.status(404).json({ ok: false, error: 'Beneficiary not found' });

  const entitlements = computeAllocation(beneficiary.category, beneficiary.familySize);
  if (!entitlements.length) return res.status(404).json({ ok: false, reason: 'No allocation found.' });

  res.json({
    ok: true, success: true, entitlements, month,
    collectionWindow: `1–31 ${new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}`,
  });
});

// ── POST /api/v1/receipts/confirm-distribution ────────────
router.post('/confirm-distribution', (req, res) => {
  const { rationCardNo, entitlements, distributedItems } = req.body;
  if (!rationCardNo || !entitlements || !distributedItems) {
    return res.status(400).json({ ok: false, error: 'rationCardNo, entitlements and distributedItems are required' });
  }

  const violations = distributedItems.filter(item => {
    const entitled = entitlements.find(e => e.id === item.id);
    return entitled && item.qty > entitled.entitledQty;
  });

  if (violations.length) {
    return res.status(422).json({
      ok: false,
      reason: `Distributed quantity exceeds entitlement for: ${violations.map(v => v.name).join(', ')}`,
    });
  }

  res.json({ ok: true, success: true, confirmedAt: new Date().toISOString() });
});

// ── POST /api/v1/receipts/generate ───────────────────────
router.post('/generate', (req, res) => {
  const { rationCardNo, shopId, shopName, distributedItems, confirmedAt } = req.body;
  if (!rationCardNo || !shopId || !shopName || !distributedItems) {
    return res.status(400).json({ ok: false, error: 'rationCardNo, shopId, shopName and distributedItems are required' });
  }

  const beneficiary = BENEFICIARY_REGISTRY[rationCardNo.trim().toUpperCase()];
  if (!beneficiary) return res.status(404).json({ ok: false, error: 'Beneficiary not found' });

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const qrCode = `QR-PDS-${monthKey}-${Math.floor(Math.random() * 9000) + 1000}`;
  const total = distributedItems.reduce((s, i) => s + i.total, 0);

  const receipt = {
    id: `rcpt_${Date.now()}`, qrCode, month: monthLabel, monthKey,
    shopId, shopName, dealerId: 'dealer_001',
    citizenId: beneficiary.id, rationCardNo: beneficiary.rationCardNo,
    category: beneficiary.category, familySize: beneficiary.familySize,
    distributedItems, totalAmount: +total.toFixed(2),
    status: RECEIPT_STATUS.GENERATED, generatedAt: now.toISOString(),
    verifiedAt: null, verificationMethod: 'OTP',
    dealerConfirmedAt: confirmedAt, allocationChecked: true, isPartial: false,
  };

  receipts.push(receipt);
  saveReceipts(receipts);
  res.status(201).json({ ok: true, success: true, receipt });
});

// ── GET /api/v1/receipts/citizen/:citizenId ───────────────
router.get('/citizen/:citizenId', (req, res) => {
  const myReceipts = receipts.filter(r => r.citizenId === req.params.citizenId);
  res.json({ ok: true, receipts: myReceipts });
});

// ── GET /api/v1/receipts/verify-qr/:qrCode ───────────────
router.get('/verify-qr/:qrCode', (req, res) => {
  const qrCode = req.params.qrCode.trim();
  const receipt = receipts.find(r => r.qrCode === qrCode);
  if (!receipt) {
    return res.json({ ok: true, valid: false, reason: 'QR code not found in receipt database. This receipt may be fake or tampered.' });
  }

  const MOCK_SHOPS = {
    shop_001: { id: 'shop_001', name: 'Ram Ration Store', licenseNo: 'FPS-MH-4521' },
    shop_002: { id: 'shop_002', name: 'Shivaji Ration Centre', licenseNo: 'FPS-MH-3312' },
    shop_003: { id: 'shop_003', name: 'Mahatma Gandhi FPS', licenseNo: 'FPS-MH-2201' },
    shop_004: { id: 'shop_004', name: 'Bharat Ration Depot', licenseNo: 'FPS-MH-5567' },
    shop_005: { id: 'shop_005', name: 'Jai Hind Ration Shop', licenseNo: 'FPS-MH-6634' },
    shop_006: { id: 'shop_006', name: 'Sai Krupa FPS', licenseNo: 'FPS-MH-7712' },
  };

  const shop = MOCK_SHOPS[receipt.shopId];
  if (!shop) return res.json({ ok: true, valid: false, reason: 'Shop linked to this receipt is not registered.' });

  res.json({
    ok: true, valid: true, receipt,
    shop,
    beneficiaryName: receipt.rationCardNo.slice(0, 5) + '***',
  });
});

export default router;
