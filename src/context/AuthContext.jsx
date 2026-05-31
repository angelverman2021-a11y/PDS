import { useState } from 'react';
import { BENEFICIARY_REGISTRY } from '../constants';
import { AuthContext } from './AuthContextCore';
import { VERIFY_STATE } from './authConstants';
import { normalizePhoneNumber, sendOtp, verifyOtp } from '../services/otpService';

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_OTP_TRIES = 3;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyState, setVerifyState] = useState(VERIFY_STATE.IDLE);
  const [pendingBeneficiary, setPending] = useState(null);
  const [otpSentAt, setOtpSentAt] = useState(null);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const validateCitizenCredentials = ({ rationCardNo, phone }) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(async () => {
        setLoading(false);
        const beneficiary = BENEFICIARY_REGISTRY[rationCardNo.trim().toUpperCase()];
        if (!beneficiary || normalizePhoneNumber(beneficiary.phone) !== normalizePhoneNumber(phone)) {
          setVerifyState(VERIFY_STATE.INVALID_CARD);
          resolve({ success: false, reason: 'invalid_credentials' });
        } else {
          const delivery = await sendOtp({ phone: beneficiary.phone });
          if (!delivery.ok) {
            setVerifyState(VERIFY_STATE.INVALID_OTP);
            resolve({ success: false, reason: delivery.error });
            return;
          }
          setPending(beneficiary);
          setOtpSentAt(Date.now());
          setOtpAttempts(0);
          setVerifyState(VERIFY_STATE.OTP_SENT);
          resolve({ success: true, maskedPhone: beneficiary.maskedPhone, debugOtp: delivery.otp });
        }
      }, 800);
    });
  };

  const validateOTP = (otp) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(async () => {
        setLoading(false);

        if (!pendingBeneficiary) {
          resolve({ success: false, reason: 'no_pending' });
          return;
        }

        if (Date.now() - otpSentAt > OTP_EXPIRY_MS) {
          setVerifyState(VERIFY_STATE.EXPIRED);
          resolve({ success: false, reason: 'OTP expired. Please request a new one.' });
          return;
        }

        if (otpAttempts >= MAX_OTP_TRIES) {
          setVerifyState(VERIFY_STATE.LOCKED);
          resolve({ success: false, reason: 'Too many attempts. Please try again after 30 minutes.' });
          return;
        }

        const verification = await verifyOtp({ phone: pendingBeneficiary.phone, otp });

        if (!verification.ok) {
          const newAttempts = otpAttempts + 1;
          setOtpAttempts(newAttempts);
          if (newAttempts >= MAX_OTP_TRIES) {
            setVerifyState(VERIFY_STATE.LOCKED);
            resolve({ success: false, reason: `Account locked after ${MAX_OTP_TRIES} failed attempts.` });
          } else {
            setVerifyState(VERIFY_STATE.INVALID_OTP);
            resolve({ success: false, reason: `Incorrect OTP. ${MAX_OTP_TRIES - newAttempts} attempt(s) remaining.` });
          }
        } else {
          setVerifyState(VERIFY_STATE.VERIFIED);
          setUser(pendingBeneficiary);
          resolve({ success: true, beneficiary: pendingBeneficiary });
        }
      }, 800);
    });
  };

  const login = (userObject) => {
    setLoading(true);
    setTimeout(() => {
      setUser(userObject);
      setLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
    setVerifyState(VERIFY_STATE.IDLE);
    setPending(null);
    setOtpSentAt(null);
    setOtpAttempts(0);
  };

  const resetVerification = () => {
    setVerifyState(VERIFY_STATE.IDLE);
    setPending(null);
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
      login,
      logout,
      resetVerification,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
