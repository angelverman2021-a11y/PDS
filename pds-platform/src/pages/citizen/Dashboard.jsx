import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, QrCode, AlertTriangle, Store,
  Package, Clock, TrendingUp,
  ArrowRight, ShieldCheck, ClipboardList, LocateFixed,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { computeAllocation, ALLOCATION_STATUS, MOCK_SHOPS } from '../../constants';
import { fetchCitizenReceipts } from '../../services/receiptService';
import { fetchShopById } from '../../services/shopService';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import { SkeletonSummaryCards } from '../../components/common/Skeleton';

const quickActions = [
  { to: '/allocation',       label: 'Allocation',      icon: FileText,      color: 'green'  },
  { to: '/receipts',         label: 'Receipts',         icon: QrCode,        color: 'blue'   },
  { to: '/complaints/track', label: 'Track Complaint',  icon: AlertTriangle, color: 'amber'  },
  { to: '/shops',            label: 'Shop Finder',      icon: Store,         color: 'purple' },
  { to: '/diary',            label: 'Ration Diary',     icon: ClipboardList, color: 'teal'   },
  { to: '/verify',           label: 'Verify QR',        icon: ShieldCheck,   color: 'teal'   },
];

const colorMap = {
  green:  { bg: 'bg-green-50',  icon: 'bg-green-100',  text: 'text-green-700'  },
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100',   text: 'text-blue-700'   },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100',  text: 'text-amber-700'  },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-100',    text: 'text-red-700'    },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-700' },
  teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100',   text: 'text-teal-700'   },
};

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [shop, setShop]         = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    const mockFallback = MOCK_SHOPS.find(s => s.id === user.shopId) ?? null;
    Promise.all([
      fetchCitizenReceipts(user.id),
      fetchShopById(user.shopId),
    ]).then(([r, s]) => {
      setReceipts(r);
      setShop(s ?? mockFallback);
      setLoading(false);
    }).catch(() => {
      setShop(mockFallback);
      setLoading(false);
    });
  }, [user]);

  const entitlements  = user ? computeAllocation(user.category, user.familySize) : [];
  const latestReceipt = receipts[0] ?? null;
  const now           = new Date();
  const currentMonth  = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const monthKey      = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonth     = receipts.find(r => r.monthKey === monthKey);
  const allocStatus   = thisMonth
    ? (thisMonth.isPartial ? ALLOCATION_STATUS.PARTIAL : ALLOCATION_STATUS.COLLECTED)
    : ALLOCATION_STATUS.PENDING;

  const recentActivity = receipts.slice(0, 3).map(r => ({
    icon: QrCode,
    text: `Receipt ${r.qrCode} — ${r.shopName}`,
    time: new Date(r.generatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    color: 'text-blue-600',
  }));

  const summaryCards = [
    {
      label: 'Allocation Status',
      value: allocStatus === ALLOCATION_STATUS.COLLECTED ? 'Collected'
           : allocStatus === ALLOCATION_STATUS.PARTIAL   ? 'Partial' : 'Pending',
      sub: `${entitlements.length} items · ${currentMonth}`,
      icon: Package,
      color: allocStatus === ALLOCATION_STATUS.COLLECTED ? 'green'
           : allocStatus === ALLOCATION_STATUS.PARTIAL   ? 'amber' : 'blue',
      to: '/allocation',
    },
    {
      label: 'Last Receipt',
      value: latestReceipt ? latestReceipt.month : '—',
      sub: latestReceipt ? `₹${latestReceipt.totalAmount} · ${latestReceipt.shopName}` : 'No receipts yet',
      icon: QrCode,
      color: 'green',
      to: '/receipts',
    },
    {
      label: 'Total Receipts',
      value: receipts.length,
      sub: receipts.length > 0 ? 'View all receipts' : 'No receipts yet',
      icon: AlertTriangle,
      color: receipts.length > 0 ? 'blue' : 'green',
      to: '/receipts',
    },
    {
      label: 'Shop Stock',
      value: loading ? '…'
           : shop ? (shop.stockStatus === 'available' ? 'Available'
                   : shop.stockStatus === 'low'       ? 'Low' : 'Out') : '—',
      sub: shop?.name ?? '—',
      icon: Store,
      color: shop?.stockStatus === 'available' ? 'green'
           : shop?.stockStatus === 'low'       ? 'amber' : 'red',
      to: '/shops',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

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

        {loading ? (
          <SkeletonSummaryCards />
        ) : (
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
        )}

        <Card>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickActions.map(({ to, label, icon: Icon, color }) => {
              const c = colorMap[color] ?? colorMap.green;
              return (
                <Link key={to} to={to} className={`flex flex-col items-center gap-2 p-3 ${c.bg} rounded-xl hover:shadow-sm transition-all text-center`}>
                  <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={c.text} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <LocateFixed size={18} className="text-green-600" /> Find Nearby Ration Shops
              </p>
              <p className="text-xs text-gray-500 mt-2 max-w-2xl">
                Use your device location to discover registered FPS shops near you, sorted by distance.
              </p>
            </div>
            <Link to="/shops" className="inline-flex items-center gap-2 rounded-2xl bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/10 hover:bg-green-800 transition shrink-0">
              Open Shop Finder <ArrowRight size={14} />
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> AI Receipt OCR Audit
              </p>
              <p className="text-xs text-gray-500 mt-2 max-w-2xl">
                Validate your physical receipt against digital state allocations using the simulated AI audit in Receipts.
              </p>
            </div>
            <Link to="/receipts" className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-800 transition">
              Open AI Audit <ArrowRight size={14} />
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Package size={18} className="text-blue-600" /> {currentMonth} Allocation
            </h2>
            <Badge status={allocStatus} />
          </div>
          {entitlements.length === 0 ? (
            <p className="text-sm text-gray-400">No entitlements found for your card category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {entitlements.map(item => (
                <div key={item.id} className="rounded-xl p-3 text-center bg-blue-50">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                  <p className="text-lg font-extrabold text-blue-700">{item.entitledQty} {item.unit}</p>
                  <p className="text-xs text-gray-400">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>
          )}
          <Link to="/allocation" className="mt-4 flex items-center gap-1 text-sm text-green-700 font-medium hover:underline">
            View full allocation <ArrowRight size={14} />
          </Link>
        </Card>

        <Card>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gray-500" /> Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">No recent activity yet.</p>
          ) : (
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
          )}
        </Card>

      </div>
    </div>
  );
}
