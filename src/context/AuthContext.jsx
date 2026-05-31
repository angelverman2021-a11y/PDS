import { useState } from 'react';
import { BENEFICIARY_REGISTRY, MOCK_USERS } from '../constants';
import { AuthContext } from './AuthContextCore';

// ── Verification States ───────────────────────────────────
export const VERIFY_STATE = {
  IDLE:         'idle',
  OTP_SENT:     'otp_sent',
  VERIFIED:     'verified',
  INVALID_CARD: 'invalid_card',
  INVALID_OTP:  'invalid_otp',
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);

  // Citizen verification state
  const [verifyState, setVerifyState]         = useState(VERIFY_STATE.IDLE);
  const [pendingBeneficiary, setPending]      = useState(null);

  // ── Step 1: Validate ration card ─────────────────────────
  const validateRationCard = (rationCardNo) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const beneficiary = BENEFICIARY_REGISTRY[rationCardNo.trim().toUpperCase()];
        if (!beneficiary) {
          setVerifyState(VERIFY_STATE.INVALID_CARD);
          resolve({ success: false, reason: 'not_found' });
        } else {
          setPending(beneficiary);
          setVerifyState(VERIFY_STATE.OTP_SENT);
          resolve({ success: true, maskedPhone: beneficiary.maskedPhone });
        }
      }, 800);
    });
  };

  // ── Step 2: Validate OTP ─────────────────────────────────
  const validateOTP = (otp) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (!pendingBeneficiary) {
          resolve({ success: false, reason: 'no_pending' });
          return;
        }
        if (otp.trim() !== pendingBeneficiary.otp) {
          setVerifyState(VERIFY_STATE.INVALID_OTP);
          resolve({ success: false, reason: 'wrong_otp' });
        } else {
          setVerifyState(VERIFY_STATE.VERIFIED);
          setUser(pendingBeneficiary);
          resolve({ success: true, beneficiary: pendingBeneficiary });
        }
      }, 800);
    });
  };

  // ── Dealer / Admin login ──────────────────────────────────
  const login = (role) => {
    setLoading(true);
    setTimeout(() => {
      setUser(MOCK_USERS[role]);
      setLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
    setVerifyState(VERIFY_STATE.IDLE);
    setPending(null);
  };

  const resetVerification = () => {
    setVerifyState(VERIFY_STATE.IDLE);
    setPending(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      verifyState, pendingBeneficiary,
      validateRationCard, validateOTP,
      login, logout, resetVerification,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
