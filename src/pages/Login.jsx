import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { VERIFY_STATE } from '../context/authConstants';
import { ROLES, USER_CREDENTIALS, MOCK_USERS } from '../constants';
import { DEMO_MODE } from '../config/platformConfig';
import Button from '../components/common/Button';
import {
  Truck, User, Store, ShieldCheck,
  CheckCircle, XCircle, AlertTriangle,
  Phone, CreditCard, Users, MapPin, Lock, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const LABELS = {
  tabs: {
    [ROLES.CITIZEN]: 'Citizen',
    [ROLES.DEALER]:  'Dealer',
    [ROLES.ADMIN]:   'Admin',
  },
  category: {
    PHH:  'Priority Household (PHH)',
    AAY:  'Antyodaya Anna Yojana (AAY)',
    NPHH: 'Non-Priority Household (NPHH)',
  },
};

const tabs = [
  { role: ROLES.CITIZEN, label: LABELS.tabs[ROLES.CITIZEN], icon: User,        color: 'green'  },
  { role: ROLES.DEALER,  label: LABELS.tabs[ROLES.DEALER],  icon: Store,       color: 'blue'   },
  { role: ROLES.ADMIN,   label: LABELS.tabs[ROLES.ADMIN],   icon: ShieldCheck, color: 'purple' },
];

const tabColor = {
  [ROLES.CITIZEN]: 'border-green-600 text-green-700',
  [ROLES.DEALER]:  'border-blue-600 text-blue-700',
  [ROLES.ADMIN]:   'border-purple-700 text-purple-700',
};

const btnVariant = {
  [ROLES.CITIZEN]: 'primary',
  [ROLES.DEALER]:  'secondary',
  [ROLES.ADMIN]:   'purple',
};

const CATEGORY_LABELS = LABELS.category;

// ── Beneficiary Profile Card shown after verification ────
function BeneficiaryCard({ beneficiary, onConfirm, loading }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
        <CheckCircle size={20} className="text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">Identity Verified</p>
          <p className="text-xs text-green-600">OTP matched · Beneficiary found in registry</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-green-700 px-4 py-3">
          <p className="text-xs text-green-200 uppercase tracking-wide font-medium">Beneficiary Details</p>
          <p className="text-white font-bold text-lg mt-0.5">{beneficiary.name}</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <CreditCard size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Ration Card</p>
              <p className="font-semibold text-gray-800">{beneficiary.rationCardNo}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Family Size</p>
              <p className="font-semibold text-gray-800">{beneficiary.familySize} members</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Assigned Shop</p>
              <p className="font-semibold text-gray-800 text-xs">{beneficiary.shopName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-semibold text-gray-800 text-xs">{CATEGORY_LABELS[beneficiary.category] ?? beneficiary.category}</p>
            </div>
          </div>
        </div>

        {/* Aadhaar / Bank status */}
        <div className="px-4 pb-4 flex gap-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
            beneficiary.aadhaarLinked
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {beneficiary.aadhaarLinked ? <CheckCircle size={11} /> : <XCircle size={11} />}
            Aadhaar {beneficiary.aadhaarLinked ? 'Linked' : 'Not Linked'}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
            beneficiary.bankLinked
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {beneficiary.bankLinked ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
            Bank {beneficiary.bankLinked ? 'Linked' : 'Pending'}
          </span>
        </div>
      </div>

      {!beneficiary.aadhaarLinked && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          Aadhaar not linked. You can still access the platform but some features may be restricted.
        </div>
      )}

      <Button fullWidth size="lg" loading={loading} onClick={onConfirm}>
        Continue to Dashboard →
      </Button>
    </div>
  );
}

// ── Main Login Page ───────────────────────────────────────
export default function Login() {
  const [activeTab, setActiveTab]   = useState(ROLES.CITIZEN);
  const [rationCard, setRationCard] = useState('');
  const [phone, setPhone]           = useState('');
  const [otp, setOtp]               = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpHint, setOtpHint]       = useState('');
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [confirming, setConfirming] = useState(false);

  const { login, loading, verifyState, pendingBeneficiary,
          validateCitizenCredentials, validateOTP, resetVerification,
          otpAttempts, otpSentAt } = useAuth();
  const navigate = useNavigate();

  // OTP countdown timer
  const [secondsLeft, setSecondsLeft] = useState(0);
  useEffect(() => {
    if (!otpSentAt) return;
    const tick = setInterval(() => {
      const remaining = Math.max(0, 300 - Math.floor((Date.now() - otpSentAt) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, [otpSentAt]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const redirectMap = {
    [ROLES.CITIZEN]: '/dashboard',
    [ROLES.DEALER]:  '/dealer',
    [ROLES.ADMIN]:   '/admin/district',
  };

  // ── Citizen Step 1: validate ration card and registered phone ──
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!rationCard.trim()) return toast.error('Enter your ration card number.');
    if (!phone.trim()) return toast.error('Enter your registered phone number.');

    const res = await validateCitizenCredentials({ rationCardNo: rationCard, phone });
    if (res.success) {
      setMaskedPhone(res.maskedPhone);
      setOtpHint(DEMO_MODE && res.debugOtp
        ? `Demo mode only: use OTP ${res.debugOtp}`
        : 'Check your registered phone for the OTP.');
      toast.success(`OTP sent to ${res.maskedPhone}`);
    } else {
      toast.error('Ration card and phone combination did not match our registry.');
    }
  };

  // ── Citizen Step 2: verify OTP ────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Enter the OTP sent to your phone.');
    const res = await validateOTP(otp);
    if (res.success) {
      toast.success('OTP verified successfully!');
    } else {
      toast.error('OTP verification failed. Please try again.');
      setOtp('');
    }
  };

  // ── Citizen Step 3: confirm and continue ─────────────────
  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleGuestLogin = () => {
    resetVerification();
    login(MOCK_USERS.citizen);
    toast.success('Guest demo login started.');
    setTimeout(() => navigate('/dashboard'), 600);
  };

  // ── Dealer / Admin login ──────────────────────────────────
  const handleStaffLogin = (e) => {
    e.preventDefault();
    const credentials = USER_CREDENTIALS[activeTab];
    if (!credentials?.username || !credentials?.password) {
      return toast.error('Staff login is not configured. Add the required VITE credentials in your environment file.');
    }
    if (!credentials || username.trim() !== credentials.username || password !== credentials.password) {
      return toast.error('Invalid username or password. Please enter your registered credentials.');
    }
    login(MOCK_USERS[activeTab]);
    toast.success(`Welcome back, ${MOCK_USERS[activeTab].name}`);
    setTimeout(() => navigate(redirectMap[activeTab]), 900);
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    resetVerification();
    setRationCard(''); setPhone(''); setOtp(''); setMaskedPhone(''); setOtpHint('');
    setUsername(''); setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-700 rounded-2xl mb-4 shadow-lg">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PDS Platform</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Role Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                onClick={() => handleTabChange(role)}
                className={`flex-1 flex flex-col items-center gap-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === role
                    ? tabColor[role] + ' bg-gray-50'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── CITIZEN FLOW ── */}
            {activeTab === ROLES.CITIZEN && (

              // Step 3: Verified — show profile
              verifyState === VERIFY_STATE.VERIFIED ? (
                <BeneficiaryCard
                  beneficiary={pendingBeneficiary}
                  onConfirm={handleConfirm}
                  loading={confirming}
                />
              ) :

              verifyState === VERIFY_STATE.LOCKED ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Lock size={28} className="text-red-600" />
                    </div>
                    <p className="font-bold text-gray-900">Account Temporarily Locked</p>
                    <p className="text-sm text-gray-500 text-center">
                      Too many incorrect OTP attempts. Please try again after 30 minutes.
                    </p>
                  </div>
                  <Button fullWidth variant="outline" onClick={() => { resetVerification(); setOtp(''); setRationCard(''); }}>
                    Try Different Ration Card
                  </Button>
                </div>
              ) :

              verifyState === VERIFY_STATE.EXPIRED ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock size={28} className="text-amber-600" />
                    </div>
                    <p className="font-bold text-gray-900">OTP Expired</p>
                    <p className="text-sm text-gray-500 text-center">
                      Your OTP has expired. Please request a new one.
                    </p>
                  </div>
                  <Button fullWidth onClick={() => { resetVerification(); setOtp(''); }}>
                    Request New OTP
                  </Button>
                </div>
              ) :

              // Step 2: OTP entry
              verifyState === VERIFY_STATE.OTP_SENT ? (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="shrink-0" />
                      OTP sent to <strong>{maskedPhone}</strong>
                    </div>
                    {otpHint && (
                      <p className="text-xs text-gray-500">{otpHint}</p>
                    )}
                  </div>

                  {/* Countdown */}
                  <div className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${
                    secondsLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> OTP expires in
                    </span>
                    <span className="font-bold font-mono">{mins}:{secs}</span>
                  </div>

                  {/* Attempts */}
                  {otpAttempts > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {3 - otpAttempts} attempt{3 - otpAttempts !== 1 ? 's' : ''} remaining before account lock
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                      placeholder="4-digit OTP"
                      maxLength={4}
                      autoFocus
                      className={`w-full border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 tracking-[0.5em] text-center text-xl font-bold ${
                        verifyState === VERIFY_STATE.INVALID_OTP
                          ? 'border-red-400 focus:ring-red-400 bg-red-50'
                          : 'border-gray-300 focus:ring-green-500'
                      }`}
                    />
                    {verifyState === VERIFY_STATE.INVALID_OTP && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <XCircle size={12} /> Incorrect OTP. Please try again.
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5 text-center">
                      Ration Card: <strong>{rationCard.toUpperCase()}</strong>
                    </p>
                  </div>

                  <Button type="submit" fullWidth loading={loading} size="lg" disabled={secondsLeft === 0}>
                    Verify OTP
                  </Button>
                  <button
                    type="button"
                    onClick={() => { resetVerification(); setOtp(''); }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Change Ration Card Number
                  </button>
                </form>
              ) :

              // Step 1: Ration card entry
              (
                <div className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed">
                    Demo note: this prototype verifies against sample records only. In production, OTP must be sent by a backend SMS provider after checking the ration card and registered mobile number from the official beneficiary registry. This app does not verify email identity.
                  </div>

                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ration Card Number
                      </label>
                      <input
                        type="text"
                        value={rationCard}
                        onChange={e => setRationCard(e.target.value.toUpperCase())}
                        placeholder="e.g. MH-2024-00123"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 uppercase tracking-wide ${
                          verifyState === VERIFY_STATE.INVALID_CARD
                            ? 'border-red-400 focus:ring-red-400 bg-red-50'
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                      />
                      {verifyState === VERIFY_STATE.INVALID_CARD && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <XCircle size={12} /> Ration card and phone number must match the registered record.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registered Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <Button type="submit" fullWidth loading={loading} size="lg">
                      Send OTP
                    </Button>
                  </form>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400">or</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="rounded-xl border border-dashed border-green-200 bg-green-50 p-3">
                    <p className="text-xs text-green-800 mb-3">
                      No ration card right now? Continue with a sample citizen profile for demo access.
                    </p>
                    <Button type="button" fullWidth variant="outline" onClick={handleGuestLogin}>
                      Login as Guest
                    </Button>
                  </div>
                </div>
              )
            )}

            {/* ── DEALER / ADMIN FLOW ── */}
            {(activeTab === ROLES.DEALER || activeTab === ROLES.ADMIN) && (
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                  Enter the registered staff username and password to access the dealer or district administrator portal.
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant={btnVariant[activeTab]}
                  size="lg"
                >
                  Login
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Independent Transparency Platform · Not affiliated with any government agency
        </p>
      </div>
    </div>
  );
}
