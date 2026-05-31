import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { VERIFY_STATE } from '../context/AuthContext';
import { ROLES } from '../constants';
import Button from '../components/common/Button';
import {
  Truck, User, Store, ShieldCheck,
  CheckCircle, XCircle, AlertTriangle,
  Phone, CreditCard, Users, MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { role: ROLES.CITIZEN, label: 'Citizen',  icon: User,        color: 'green'  },
  { role: ROLES.DEALER,  label: 'Dealer',   icon: Store,       color: 'blue'   },
  { role: ROLES.ADMIN,   label: 'Admin',    icon: ShieldCheck, color: 'purple' },
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

const CATEGORY_LABELS = {
  PHH:  'Priority Household (PHH)',
  AAY:  'Antyodaya Anna Yojana (AAY)',
  NPHH: 'Non-Priority Household (NPHH)',
};

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
              <p className="font-semibold text-gray-800 text-xs">{beneficiary.category}</p>
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
  const [otp, setOtp]               = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [confirming, setConfirming] = useState(false);

  const { login, loading, verifyState, pendingBeneficiary,
          validateRationCard, validateOTP, resetVerification } = useAuth();
  const navigate = useNavigate();

  const redirectMap = {
    [ROLES.CITIZEN]: '/dashboard',
    [ROLES.DEALER]:  '/dealer',
    [ROLES.ADMIN]:   '/admin/district',
  };

  // ── Citizen Step 1: validate ration card ─────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!rationCard.trim()) return toast.error('Enter your Ration Card Number');
    const res = await validateRationCard(rationCard);
    if (res.success) {
      setMaskedPhone(res.maskedPhone);
      toast.success(`OTP sent to ${res.maskedPhone}`);
    } else {
      toast.error('Ration Card not found in registry. Check the number and try again.');
    }
  };

  // ── Citizen Step 2: validate OTP ─────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Enter the OTP');
    const res = await validateOTP(otp);
    if (res.success) {
      toast.success('OTP verified successfully!');
    } else {
      toast.error('Incorrect OTP. Please try again.');
      setOtp('');
    }
  };

  // ── Citizen Step 3: confirm and go to dashboard ──────────
  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      navigate('/dashboard');
    }, 600);
  };

  // ── Dealer / Admin login ──────────────────────────────────
  const handleStaffLogin = (e) => {
    e.preventDefault();
    if (activeTab === ROLES.DEALER && (username !== 'dealer' || password !== 'dealer123')) {
      return toast.error('Invalid credentials. Use dealer / dealer123');
    }
    if (activeTab === ROLES.ADMIN && (username !== 'admin' || password !== 'admin123')) {
      return toast.error('Invalid credentials. Use admin / admin123');
    }
    login(activeTab);
    toast.success(`Welcome! Logged in as ${activeTab}`);
    setTimeout(() => navigate(redirectMap[activeTab]), 900);
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    resetVerification();
    setRationCard(''); setOtp(''); setMaskedPhone('');
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

              // Step 2: OTP entry
              verifyState === VERIFY_STATE.OTP_SENT ? (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 flex items-center gap-2">
                    <Phone size={14} className="shrink-0" />
                    OTP sent to <strong>{maskedPhone}</strong>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
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

                  <Button type="submit" fullWidth loading={loading} size="lg">
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
                <form onSubmit={handleSendOTP} className="space-y-4">
                  {/* Demo hint */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    <strong>Demo — Valid Ration Cards:</strong>
                    <div className="mt-1.5 space-y-1 font-mono">
                      <p>MH-2024-00123 → OTP: 4521 (Ramesh Kumar)</p>
                      <p>MH-2024-00124 → OTP: 7834 (Sunita Devi)</p>
                      <p>MH-2024-00125 → OTP: 3390 (Prakash Mane)</p>
                      <p>MH-2024-00126 → OTP: 6612 (Anita Bhosale)</p>
                    </div>
                  </div>

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
                        <XCircle size={12} /> Ration Card not found in registry.
                      </p>
                    )}
                  </div>

                  <Button type="submit" fullWidth loading={loading} size="lg">
                    Send OTP
                  </Button>
                </form>
              )
            )}

            {/* ── DEALER / ADMIN FLOW ── */}
            {(activeTab === ROLES.DEALER || activeTab === ROLES.ADMIN) && (
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>Demo:</strong>{' '}
                  {activeTab === ROLES.DEALER
                    ? 'Username: dealer | Password: dealer123'
                    : 'Username: admin | Password: admin123'
                  }
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
          Government of India · PDS Transparency Initiative
        </p>
      </div>
    </div>
  );
}
