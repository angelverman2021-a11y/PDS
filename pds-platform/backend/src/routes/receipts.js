import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { BENEFICIARY_REGISTRY, DEMO_OTPS, normalizePhone } from '../data/registry.js';
import db, { rowToReceipt } from '../db/index.js';

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

const MOCK_SHOPS = {
  shop_001: { id: 'shop_001', name: 'Ram Ration Store',      licenseNo: 'FPS-MH-4521' },
  shop_002: { id: 'shop_002', name: 'Shivaji Ration Centre', licenseNo: 'FPS-MH-3312' },
  shop_003: { id: 'shop_003', name: 'Mahatma Gandhi FPS',    licenseNo: 'FPS-MH-2201' },
  shop_004: { id: 'shop_004', name: 'Bharat Ration Depot',   licenseNo: 'FPS-MH-5567' },
  shop_005: { id: 'shop_005', name: 'Jai Hind Ration Shop',  licenseNo: 'FPS-MH-6634' },
  shop_006: { id: 'shop_006', name: 'Sai Krupa FPS',         licenseNo: 'FPS-MH-7712' },
};

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

// ── Prepared statements ───────────────────────────────────
const stmts = {
  getByCitizenId: db.prepare('SELECT * FROM receipts WHERE citizen_id = ? ORDER BY generated_at DESC'),
  getByQr:        db.prepare('SELECT * FROM receipts WHERE qr_code = ?'),
  insert:         db.prepare(`
    INSERT INTO receipts
      (id, qr_code, month, month_key, shop_id, shop_name, dealer_id, citizen_id,
       ration_card_no, category, family_size, distributed_items, total_amount,
       status, generated_at, verified_at, verification_method, dealer_confirmed_at,
       allocation_checked, is_partial)
    VALUES
      (@id,@qrCode,@month,@monthKey,@shopId,@shopName,@dealerId,@citizenId,
       @rationCardNo,@category,@familySize,@distributedItems,@totalAmount,
       @status,@generatedAt,@verifiedAt,@verificationMethod,@dealerConfirmedAt,
       @allocationChecked,@isPartial)
  `),
};

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
  const monthKey   = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const qrCode     = `QR-PDS-${monthKey}-${Math.floor(Math.random() * 9000) + 1000}`;
  const total      = distributedItems.reduce((s, i) => s + i.total, 0);

  const row = {
    id: `rcpt_${Date.now()}`, qrCode, month: monthLabel, monthKey,
    shopId, shopName, dealerId: 'dealer_001',
    citizenId: beneficiary.id, rationCardNo: beneficiary.rationCardNo,
    category: beneficiary.category, familySize: beneficiary.familySize,
    distributedItems: JSON.stringify(distributedItems),
    totalAmount: +total.toFixed(2), status: 'generated',
    generatedAt: now.toISOString(), verifiedAt: null,
    verificationMethod: 'OTP', dealerConfirmedAt: confirmedAt,
    allocationChecked: 1, isPartial: 0,
  };

  stmts.insert.run(row);
  res.status(201).json({ ok: true, success: true, receipt: rowToReceipt({ ...row, qr_code: row.qrCode, month_key: row.monthKey, shop_id: row.shopId, shop_name: row.shopName, dealer_id: row.dealerId, citizen_id: row.citizenId, ration_card_no: row.rationCardNo, family_size: row.familySize, distributed_items: row.distributedItems, total_amount: row.totalAmount, generated_at: row.generatedAt, verified_at: row.verifiedAt, verification_method: row.verificationMethod, dealer_confirmed_at: row.dealerConfirmedAt, allocation_checked: row.allocationChecked, is_partial: row.isPartial }) });
});

// ── GET /api/v1/receipts/citizen/:citizenId ───────────────
router.get('/citizen/:citizenId', (req, res) => {
  const rows = stmts.getByCitizenId.all(req.params.citizenId);
  res.json({ ok: true, receipts: rows.map(rowToReceipt) });
});

// ── GET /api/v1/receipts/verify-qr/:qrCode ───────────────
router.get('/verify-qr/:qrCode', (req, res) => {
  const row = stmts.getByQr.get(req.params.qrCode.trim());
  if (!row) {
    return res.json({ ok: true, valid: false, reason: 'QR code not found in receipt database. This receipt may be fake or tampered.' });
  }

  const shop = MOCK_SHOPS[row.shop_id];
  if (!shop) return res.json({ ok: true, valid: false, reason: 'Shop linked to this receipt is not registered.' });

  res.json({
    ok: true, valid: true,
    receipt: rowToReceipt(row),
    shop,
    beneficiaryName: row.ration_card_no.slice(0, 5) + '***',
  });
});

export default router;
