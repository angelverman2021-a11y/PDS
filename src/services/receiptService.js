import { BENEFICIARY_REGISTRY, computeAllocation, RECEIPT_STATUS } from '../constants';
import { verifyOtp } from './otpService';

// ── Step 1: Verify Beneficiary ────────────────────────────
export function verifyBeneficiary(rationCardNo, otp) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const beneficiary = BENEFICIARY_REGISTRY[rationCardNo?.trim().toUpperCase()];
      if (!beneficiary) {
        resolve({ success: false, reason: 'Ration card not found in registry.' });
        return;
      }
      const otpResult = await verifyOtp({ phone: beneficiary.phone, otp });
      if (!otpResult.ok) {
        resolve({ success: false, reason: 'Invalid OTP. Please try again.' });
        return;
      }
      resolve({ success: true, beneficiary });
    }, 700);
  });
}

// ── Step 2: Check Allocation ──────────────────────────────
export function checkAllocation(beneficiary, month) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entitlements = computeAllocation(beneficiary.category, beneficiary.familySize);
      if (!entitlements.length) {
        resolve({ success: false, reason: 'No allocation found for this beneficiary.' });
        return;
      }
      resolve({
        success: true,
        entitlements,
        month,
        collectionWindow: `1–31 ${new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}`,
      });
    }, 600);
  });
}

// ── Step 3: Confirm Distribution ─────────────────────────
export function confirmDistribution(beneficiary, entitlements, distributedItems) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Validate each distributed item doesn't exceed entitlement
      const violations = distributedItems.filter(item => {
        const entitled = entitlements.find(e => e.id === item.id);
        return entitled && item.qty > entitled.entitledQty;
      });
      if (violations.length) {
        resolve({
          success: false,
          reason: `Distributed quantity exceeds entitlement for: ${violations.map(v => v.name).join(', ')}`,
        });
        return;
      }
      resolve({ success: true, confirmedAt: new Date().toISOString() });
    }, 600);
  });
}

// ── Step 4: Generate Receipt ──────────────────────────────
export function generateReceipt(beneficiary, shopId, shopName, distributedItems, confirmedAt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now       = new Date();
      const monthKey  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      const rcptId    = `rcpt_${Date.now()}`;
      const qrToken   = `QR-PDS-${monthKey}-${Math.floor(Math.random() * 9000) + 1000}`;
      const total     = distributedItems.reduce((s, i) => s + i.total, 0);

      const receipt = {
        id: rcptId,
        qrCode: qrToken,
        month: monthLabel,
        monthKey,
        shopId,
        shopName,
        dealerId: 'dealer_001',
        citizenId: beneficiary.id,
        rationCardNo: beneficiary.rationCardNo,
        category: beneficiary.category,
        familySize: beneficiary.familySize,
        distributedItems,
        totalAmount: +total.toFixed(2),
        status: RECEIPT_STATUS.GENERATED,
        generatedAt: now.toISOString(),
        verifiedAt: null,
        verificationMethod: 'OTP',
        dealerConfirmedAt: confirmedAt,
        allocationChecked: true,
        isPartial: false,
      };

      resolve({ success: true, receipt });
    }, 800);
  });
}
