import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROLES } from '../constants';
import Button from '../components/common/Button';
import { Truck, User, Store, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { role: ROLES.CITIZEN, label: 'Citizen', icon: User, color: 'green' },
  { role: ROLES.DEALER,  label: 'Dealer',  icon: Store, color: 'blue' },
  { role: ROLES.ADMIN,   label: 'Admin',   icon: ShieldCheck, color: 'purple' },
];

export default function Login() {
  const [activeTab, setActiveTab] = useState(ROLES.CITIZEN);
  const [step, setStep] = useState(1);
  const [rationCard, setRationCard] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const redirectMap = {
    [ROLES.CITIZEN]: '/dashboard',
    [ROLES.DEALER]:  '/dealer',
    [ROLES.ADMIN]:   '/admin/district',
  };

  const handleCitizenStep1 = (e) => {
    e.preventDefault();
    if (!rationCard.trim()) return toast.error('Enter your Ration Card Number');
    toast.success('OTP sent to registered mobile number');
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === ROLES.CITIZEN && otp !== '1234') {
      return toast.error('Invalid OTP. Use 1234 for demo.');
    }
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
                onClick={() => { setActiveTab(role); setStep(1); }}
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
            {/* Demo hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-xs text-amber-800">
              <strong>Demo Mode:</strong>{' '}
              {activeTab === ROLES.CITIZEN && 'Enter any Ration Card No → OTP: 1234'}
              {activeTab === ROLES.DEALER  && 'Username: dealer | Password: dealer123'}
              {activeTab === ROLES.ADMIN   && 'Username: admin | Password: admin123'}
            </div>

            {/* Citizen Form */}
            {activeTab === ROLES.CITIZEN && (
              <form onSubmit={step === 1 ? handleCitizenStep1 : handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ration Card Number</label>
                  <input
                    type="text"
                    value={rationCard}
                    onChange={e => setRationCard(e.target.value)}
                    placeholder="e.g. MH-2024-00123"
                    disabled={step === 2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>
                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="4-digit OTP"
                      maxLength={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest text-center text-lg"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-center">OTP sent to registered mobile</p>
                  </div>
                )}
                <Button type="submit" fullWidth loading={loading} variant={btnVariant[activeTab]} size="lg">
                  {step === 1 ? 'Send OTP' : 'Verify & Login'}
                </Button>
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700">
                    ← Change Ration Card Number
                  </button>
                )}
              </form>
            )}

            {/* Dealer / Admin Form */}
            {(activeTab === ROLES.DEALER || activeTab === ROLES.ADMIN) && (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                {activeTab === ROLES.ADMIN && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">2FA Code</label>
                    <input
                      type="text"
                      value={twoFA}
                      onChange={e => setTwoFA(e.target.value)}
                      placeholder="6-digit code (skip for demo)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
                <Button type="submit" fullWidth loading={loading} variant={btnVariant[activeTab]} size="lg">
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
