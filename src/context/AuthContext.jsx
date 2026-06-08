import { useState } from 'react';
import { AuthContext } from './AuthContextCore';
import { VERIFY_STATE } from './authConstants';
import { sendOtp, verifyOtp, staffLogin } from '../services/otpService';
import { DEMO_MODE } from '../config/platformConfig';

const MAX_OTP_TRIES = 3;

export function AuthProvider({ children }) {
  const [user, setUser]                     = useState(null);
  const [loading, setLoading]               = useState(false);
  const [verifyState, setVerifyState]       = useState(VERIFY_STATE.IDLE);
  const [pendingRationCard, setPending]     = useState(null);
  const [pendingBeneficiary, setPendingBeneficiary] = useState(null);
  const [otpSentAt, setOtpSentAt]           = useState(null);
  const [otpAttempts, setOtpAttempts]       = useState(0);

  // ── Citizen Step 1: validate ration card + phone via API ──
  const validateCitizenCredentials = async ({ rationCardNo, phone }) => {
    setLoading(true);
    const result = await sendOtp({ rationCardNo, phone });
    setLoading(false);

    if (!result.ok) {
      setVerifyState(VERIFY_STATE.INVALID_CARD);
      return { success: false, reason: result.error };
    }

    setPending(rationCardNo.trim().toUpperCase());
    setOtpSentAt(Date.now());
    setOtpAttempts(0);
    setVerifyState(VERIFY_STATE.OTP_SENT);
    return {
      success: true,
      maskedPhone: result.maskedPhone,
      debugOtp: DEMO_MODE ? result.debugOtp : undefined,
    };
  };

  // ── Citizen Step 2: verify OTP via API ───────────────────
  const validateOTP = async (otp) => {
    if (!pendingRationCard) return { success: false, reason: 'no_pending' };

    if (otpAttempts >= MAX_OTP_TRIES) {
      setVerifyState(VERIFY_STATE.LOCKED);
      return { success: false, reason: 'Too many attempts.' };
    }

    setLoading(true);
    const result = await verifyOtp({ rationCardNo: pendingRationCard, otp });
    setLoading(false);

    if (!result.ok) {
      if (result.error === 'OTP_EXPIRED') {
        setVerifyState(VERIFY_STATE.EXPIRED);
        return { success: false, reason: 'OTP expired.' };
      }
      if (result.error === 'OTP_LOCKED') {
        setVerifyState(VERIFY_STATE.LOCKED);
        return { success: false, reason: 'Account locked.' };
      }
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      if (newAttempts >= MAX_OTP_TRIES) {
        setVerifyState(VERIFY_STATE.LOCKED);
      } else {
        setVerifyState(VERIFY_STATE.INVALID_OTP);
      }
      return { success: false, reason: `Incorrect OTP. ${MAX_OTP_TRIES - newAttempts} attempt(s) remaining.` };
    }

    localStorage.setItem('pds_token', result.token);
    setVerifyState(VERIFY_STATE.VERIFIED);
    setPendingBeneficiary(result.beneficiary);
    setUser(result.beneficiary);
    return { success: true, beneficiary: result.beneficiary };
  };

  // ── Dealer / Admin login via API ─────────────────────────
  const loginStaff = async ({ role, username, password }) => {
    setLoading(true);
    const result = await staffLogin({ role, username, password });
    setLoading(false);

    if (!result.ok) return { success: false, reason: result.error };

    localStorage.setItem('pds_token', result.token);
    setUser(result.user);
    return { success: true, user: result.user };
  };

  // ── Guest login (demo only) ───────────────────────────────
  const login = (userObject) => {
    setLoading(true);
    setTimeout(() => {
      setUser(userObject);
      setLoading(false);
    }, 400);
  };

  const logout = () => {
    localStorage.removeItem('pds_token');
    setUser(null);
    setVerifyState(VERIFY_STATE.IDLE);
    setPending(null);
    setPendingBeneficiary(null);
    setOtpSentAt(null);
    setOtpAttempts(0);
  };

  const resetVerification = () => {
    setVerifyState(VERIFY_STATE.IDLE);
    setPending(null);
    setPendingBeneficiary(null);
    setOtpSentAt(null);
    setOtpAttempts(0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      verifyState,
      pendingBeneficiary,
      otpAttempts,
      otpSentAt,
      validateCitizenCredentials,
      validateOTP,
      loginStaff,
      login,
      logout,
      resetVerification,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
