import { Link } from 'react-router-dom';
import {
  FileText, QrCode, AlertTriangle, Store,
  Package, CheckCircle, Clock, TrendingUp,
  ArrowRight, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ALLOCATION, MOCK_RECEIPTS, MOCK_COMPLAINTS, MOCK_SHOPS } from '../../constants';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const quickActions = [
  { to: '/allocation',     label: 'Allocation',      icon: FileText,       color: 'green'  },
  { to: '/receipts',       label: 'Receipts',         icon: QrCode,         color: 'blue'   },
  { to: '/complaints/track', label: 'Track Complaint', icon: AlertTriangle,  color: 'amber'  },
  { to: '/shops',          label: 'Shop Finder',      icon: Store,          color: 'purple' },
  { to: '/verify',         label: 'Verify QR',        icon: ShieldCheck,    color: 'teal'   },
];

const recentActivity = [
  { icon: CheckCircle, text: 'Wheat 10kg collected from Ram Ration Store',  time: '3 Jul 2025',  color: 'text-green-600' },
  { icon: QrCode,      text: 'Receipt QR-PDS-2025-07-001 verified',          time: '4 Jul 2025',  color: 'text-blue-600'  },
  { icon: AlertTriangle, text: 'Complaint CMP-2025-00847 submitted',         time: '12 Jul 2025', color: 'text-amber-600' },
];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const shop = MOCK_SHOPS.find(s => s.id === user?.shopId);
  const latestReceipt = MOCK_RECEIPTS[0];
  const activeComplaints = MOCK_COMPLAINTS.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;

  const summaryCards = [
    {
      label: 'Allocation Status',
      value: 'Partial',
      sub: 'Rice pending · July 2025',
      icon: Package,
      color: 'blue',
      to: '/allocation',
    },
    {
      label: 'Last Receipt',
      value: latestReceipt.month,
      sub: `₹${latestReceipt.totalAmount} · ${latestReceipt.shopName}`,
      icon: QrCode,
      color: 'green',
      to: '/receipts',
    },
    {
      label: 'Active Complaints',
      value: activeComplaints,
      sub: activeComplaints > 0 ? 'Under review' : 'No open complaints',
      icon: AlertTriangle,
      color: activeComplaints > 0 ? 'amber' : 'green',
      to: '/complaints/track',
    },
    {
      label: 'Shop Stock',
      value: shop ? (shop.stockStatus === 'available' ? 'Available' : shop.stockStatus === 'low' ? 'Low' : 'Out') : '—',
      sub: shop?.name ?? '—',
      icon: Store,
      color: shop?.stockStatus === 'available' ? 'green' : shop?.stockStatus === 'low' ? 'amber' : 'red',
      to: '/shops',
    },
  ];

  const colorMap = {
    green:  { bg: 'bg-green-50',  icon: 'bg-green-100',  text: 'text-green-700'  },
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100',   text: 'text-blue-700'   },
    amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100',  text: 'text-amber-700'  },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-100',    text: 'text-red-700'    },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-700' },
    teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100',   text: 'text-teal-700'   },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-green-200 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl md:text-3xl font-bold">{user?.name}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-green-100">
            <span>Ration Card: <strong className="text-white">{user?.rationCardNo}</strong></span>
            <span>Family Size: <strong className="text-white">{user?.familySize}</strong></span>
            <span>District: <strong className="text-white">{user?.district}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map(({ label, value, sub, icon: Icon, color, to }) => {
            const c = colorMap[color];
            return (
              <Link key={label} to={to} className={`${c.bg} rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all border border-transparent hover:border-gray-100`}>
                <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={c.text} />
                </div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`text-xl font-extrabold ${c.text} mt-0.5`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {quickActions.map(({ to, label, icon: Icon, color }) => {
              const c = colorMap[color] ?? colorMap.green;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-2 p-3 ${c.bg} rounded-xl hover:shadow-sm transition-all text-center`}
                >
                  <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={c.text} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Allocation Snapshot */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Package size={18} className="text-blue-600" /> July 2025 Allocation
            </h2>
            <Badge status={MOCK_ALLOCATION.status} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(MOCK_ALLOCATION.entitlement).map(([key, ent]) => {
              const col = MOCK_ALLOCATION.collected[key];
              const done = col >= ent;
              return (
                <div key={key} className={`rounded-xl p-3 text-center ${done ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <p className="text-xs text-gray-500 capitalize mb-1">{key.replace('_', ' ')}</p>
                  <p className={`text-lg font-extrabold ${done ? 'text-green-700' : 'text-amber-700'}`}>{col}/{ent}</p>
                  <p className="text-xs text-gray-400">{done ? '✓ Collected' : 'Pending'}</p>
                </div>
              );
            })}
          </div>
          <Link to="/allocation" className="mt-4 flex items-center gap-1 text-sm text-green-700 font-medium hover:underline">
            View full allocation <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gray-500" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map(({ icon: Icon, text, time, color }, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <Icon size={16} className={`${color} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
