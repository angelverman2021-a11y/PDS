import { API_BASE_URL } from '../config/platformConfig';

const BASE = `${API_BASE_URL}/api/v1/receipts`;

// ── Step 1: Verify Beneficiary ────────────────────────────
export async function verifyBeneficiary(rationCardNo, otp) {
  const res = await fetch(`${BASE}/verify-beneficiary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rationCardNo, otp }),
  });
  const data = await res.json();
  if (!data.ok) return { success: false, reason: data.reason || data.error };
  return { success: true, beneficiary: data.beneficiary };
}

// ── Step 2: Check Allocation ──────────────────────────────
export async function checkAllocation(beneficiary, month) {
  const res = await fetch(`${BASE}/check-allocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rationCardNo: beneficiary.rationCardNo, month }),
  });
  const data = await res.json();
  if (!data.ok) return { success: false, reason: data.reason || data.error };
  return {
    success: true,
    entitlements: data.entitlements,
    month: data.month,
    collectionWindow: data.collectionWindow,
  };
}

// ── Step 3: Confirm Distribution ─────────────────────────
export async function confirmDistribution(beneficiary, entitlements, distributedItems) {
  const res = await fetch(`${BASE}/confirm-distribution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rationCardNo: beneficiary.rationCardNo, entitlements, distributedItems }),
  });
  const data = await res.json();
  if (!data.ok) return { success: false, reason: data.reason || data.error };
  return { success: true, confirmedAt: data.confirmedAt };
}

// ── Step 4: Generate Receipt ──────────────────────────────
export async function generateReceipt(beneficiary, shopId, shopName, distributedItems, confirmedAt) {
  const token = localStorage.getItem('pds_token');
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ rationCardNo: beneficiary.rationCardNo, shopId, shopName, distributedItems, confirmedAt }),
  });
  const data = await res.json();
  if (!data.ok) return { success: false, reason: data.error };
  return { success: true, receipt: data.receipt };
}

// ── Fetch receipts for a citizen ─────────────────────────
export async function fetchCitizenReceipts(citizenId) {
  const token = localStorage.getItem('pds_token');
  const res = await fetch(`${BASE}/citizen/${citizenId}`, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
  });
  const data = await res.json();
  return data.ok ? data.receipts : [];
}

// ── Verify QR code ────────────────────────────────────────
export async function verifyQRCode(qrCode) {
  const res = await fetch(`${BASE}/verify-qr/${encodeURIComponent(qrCode)}`);
  return res.json();
}
