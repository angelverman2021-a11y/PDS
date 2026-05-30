import { useState } from 'react';
import {
  Store, Users, AlertTriangle, TrendingUp,
  ShieldAlert, CheckCircle, XCircle, BarChart2,
  RefreshCw, Download, MapPin,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  MOCK_DISTRICT_DATA, MOCK_SHOPS, MOCK_USERS, STOCK_STATUS,
} from '../../constants';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import StatusIndicator from '../../components/common/StatusIndicator';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#dc2626', '#d97706', '#f59e0b', '#6b7280'];

// ── KPI Card ─────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    green:  { bg: 'bg-green-50',  border: 'border-green-100', icon: 'text-green-600',  val: 'text-green-700'  },
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-100',  icon: 'text-blue-600',   val: 'text-blue-700'   },
    red:    { bg: 'bg-red-50',    border: 'border-red-100',   icon: 'text-red-600',    val: 'text-red-700'    },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-100', icon: 'text-amber-600',  val: 'text-amber-700'  },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100',icon: 'text-purple-600', val: 'text-purple-700' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

// ── Shop Status Grid ──────────────────────────────────────
function ShopStatusGrid() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Shop Status Map</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Low</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Out</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MOCK_SHOPS.map(shop => (
          <button
            key={shop.id}
            onClick={() => setSelected(selected?.id === shop.id ? null : shop)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${
              selected?.id === shop.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-100 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-1 mb-2">
              <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <StatusIndicator status={shop.stockStatus} showLabel={false} />
            </div>
            <p className="text-xs font-semibold text-gray-800 leading-tight">{shop.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{shop.address.split(',')[0]}</p>
            {shop.complaintCount > 0 && (
              <p className="text-xs text-red-500 mt-1">⚠ {shop.complaintCount} complaint{shop.complaintCount > 1 ? 's' : ''}</p>
            )}
          </button>
        ))}
      </div>

      {/* Shop Detail Expand */}
      {selected && (
        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm">
          <div className="flex items-start justify-between mb-2">
            <p className="font-semibold text-purple-900">{selected.name}</p>
            <StatusIndicator status={selected.stockStatus} size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-500">Address: </span><span className="text-gray-800">{selected.address}</span></div>
            <div><span className="text-gray-500">Beneficiaries: </span><span className="font-semibold text-gray-800">{selected.totalBeneficiaries}</span></div>
            <div><span className="text-gray-500">Last Delivery: </span><span className="text-gray-800">{selected.lastDelivery}</span></div>
            <div><span className="text-gray-500">Complaints: </span><span className={`font-semibold ${selected.complaintCount > 5 ? 'text-red-600' : 'text-gray-800'}`}>{selected.complaintCount}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Custom Bar Tooltip ────────────────────────────────────
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      <p className="text-purple-700">Distribution: <strong>{payload[0].value}%</strong></p>
    </div>
  );
}

// ── Custom Pie Tooltip ────────────────────────────────────
function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-800">{payload[0].name}</p>
      <p className="text-gray-600">Count: <strong>{payload[0].value}</strong></p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function DistrictDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const admin = MOCK_USERS.admin;
  const d     = MOCK_DISTRICT_DATA;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Dashboard data refreshed');
    }, 1000);
  };

  const handleExport = () => {
    toast.success('Audit report exported as PDF');
  };

  const stockCounts = {
    available:    MOCK_SHOPS.filter(s => s.stockStatus === STOCK_STATUS.AVAILABLE).length,
    low:          MOCK_SHOPS.filter(s => s.stockStatus === STOCK_STATUS.LOW).length,
    out_of_stock: MOCK_SHOPS.filter(s => s.stockStatus === STOCK_STATUS.OUT_OF_STOCK).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-purple-800 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-purple-300 text-sm">District Dashboard</p>
              <h1 className="text-2xl font-bold mt-0.5">{d.districtName} District</h1>
              <p className="text-purple-300 text-sm mt-1">
                {admin.name} · Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg text-sm transition-all"
              >
                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg text-sm transition-all"
              >
                <Download size={15} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard icon={Store}       label="Total Shops"        value={d.totalShops}           sub="In district"          color="blue"   />
          <KpiCard icon={Users}       label="Beneficiaries"      value={d.totalBeneficiaries.toLocaleString('en-IN')} sub="Registered" color="green"  />
          <KpiCard icon={TrendingUp}  label="Distribution Rate"  value={`${d.distributionRate}%`} sub="This month"         color="purple" />
          <KpiCard icon={AlertTriangle} label="Active Complaints" value={d.activeComplaints}    sub="Pending review"       color="red"    />
          <KpiCard icon={CheckCircle} label="Shops with Stock"   value={d.shopsWithStock}       sub={`of ${d.totalShops}`} color="green"  />
          <KpiCard icon={ShieldAlert} label="Mismatch Rate"      value={`${d.verificationMismatchRate}%`} sub="Citizen vs dealer" color="amber" />
        </div>

        {/* ── Stock Status Summary ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { status: 'available',    label: 'Shops Available',    count: stockCounts.available,    icon: CheckCircle, color: 'text-green-700 bg-green-50 border-green-200' },
            { status: 'low',          label: 'Shops Low Stock',    count: stockCounts.low,          icon: AlertTriangle, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { status: 'out_of_stock', label: 'Shops Out of Stock', count: stockCounts.out_of_stock, icon: XCircle, color: 'text-red-700 bg-red-50 border-red-200' },
          ].map(({ label, count, icon: Icon, color }) => (
            <div key={label} className={`border rounded-xl p-4 flex items-center gap-3 ${color}`}>
              <Icon size={24} className="shrink-0" />
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bar Chart */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={18} className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">Distribution % by Shop</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.shopPerformance} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="distribution" radius={[6, 6, 0, 0]}>
                  {d.shopPerformance.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.distribution >= 90 ? '#16a34a' :
                        entry.distribution >= 70 ? '#7c3aed' : '#dc2626'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-600 inline-block" /> ≥90%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-600 inline-block" /> 70–89%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block" /> &lt;70%</span>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle size={18} className="text-red-500" />
              <h3 className="font-semibold text-gray-800">Complaints by Category</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={d.topComplaintCategories}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {d.topComplaintCategories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 11, color: '#374151' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Shop Status Grid ── */}
        <Card>
          <ShopStatusGrid />
        </Card>

        {/* ── Top Complaint Shops Table ── */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert size={18} className="text-red-500" />
            <h3 className="font-semibold text-gray-800">Shops Requiring Attention</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Shop Name</th>
                  <th className="text-center text-xs font-semibold text-gray-500 pb-3 px-4">Complaints</th>
                  <th className="text-center text-xs font-semibold text-gray-500 pb-3 px-4">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 pb-3 pl-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {d.topComplaintShops.map((shop, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Store size={15} className="text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-800">{shop.shopName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        shop.complaints >= 10 ? 'text-red-600' :
                        shop.complaints >= 5  ? 'text-amber-600' : 'text-gray-700'
                      }`}>
                        {shop.complaints}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge status={shop.status} />
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => toast.success(`Viewing details for ${shop.shopName}`)}
                        className="text-xs text-purple-700 hover:text-purple-900 font-medium hover:underline"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── Mismatch Alert ── */}
        {d.verificationMismatchRate > 10 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert size={22} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">High Verification Mismatch Detected</p>
              <p className="text-sm text-red-700 mt-1">
                {d.verificationMismatchRate}% of citizens reported NOT receiving rations despite dealer records showing distribution.
                This may indicate fraudulent entries. Recommend field investigation.
              </p>
              <button
                onClick={() => toast.success('Flagged for field investigation')}
                className="mt-2 text-xs font-semibold text-red-700 underline hover:text-red-900"
              >
                Flag for Investigation →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
