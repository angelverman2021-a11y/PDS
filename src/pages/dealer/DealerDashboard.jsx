import { useState } from 'react';
import {
  Package, Users, ClipboardList, CheckCircle,
  Truck, TrendingUp, AlertTriangle, QrCode,
} from 'lucide-react';
import {
  MOCK_USERS, MOCK_SHOPS, MOCK_BENEFICIARIES,
  MOCK_DISTRIBUTION_LOGS,
} from '../../constants';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'stock',        label: 'Stock Update',      icon: Package },
  { id: 'distribution', label: 'Distribution',      icon: Users },
  { id: 'logs',         label: 'Logs',              icon: ClipboardList },
];

const QR_CELLS = [
  true, true, true, false, true,
  true, false, true, false, false,
  true, true, false, true, true,
  false, true, false, true, false,
  true, false, true, true, true,
];

// ── Stock Update Tab ─────────────────────────────────────
function StockUpdateTab({ shop }) {
  const [form, setForm] = useState({
    wheat_kg: '', rice_kg: '', sugar_kg: '', kerosene_ltr: '',
  });
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading]     = useState(false);

  const fields = [
    { key: 'wheat_kg',     label: 'Wheat',    unit: 'kg',  color: 'amber' },
    { key: 'rice_kg',      label: 'Rice',     unit: 'kg',  color: 'blue' },
    { key: 'sugar_kg',     label: 'Sugar',    unit: 'kg',  color: 'pink' },
    { key: 'kerosene_ltr', label: 'Kerosene', unit: 'ltr', color: 'gray' },
  ];

  const handleConfirm = () => {
    const hasValue = Object.values(form).some(v => v !== '' && Number(v) > 0);
    if (!hasValue) return toast.error('Enter at least one stock quantity');
    setLoading(true);
    setTimeout(() => {
      setConfirmed(true);
      setLoading(false);
      toast.success('Stock updated successfully! Status set to Available.');
    }, 900);
  };

  const handleReset = () => {
    setForm({ wheat_kg: '', rice_kg: '', sugar_kg: '', kerosene_ltr: '' });
    setConfirmed(false);
  };

  return (
    <div className="space-y-5">
      {/* Current Status Banner */}
      <div className={`rounded-xl p-4 flex items-center gap-3 ${
        confirmed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
      }`}>
        <div className={`w-3 h-3 rounded-full ${confirmed ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
        <div>
          <p className={`font-semibold text-sm ${confirmed ? 'text-green-800' : 'text-amber-800'}`}>
            Stock Status: {confirmed ? 'Available ✓' : 'Pending Update'}
          </p>
          <p className={`text-xs mt-0.5 ${confirmed ? 'text-green-600' : 'text-amber-600'}`}>
            {confirmed
              ? `Updated today · ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
              : `Last delivery: ${shop?.lastDelivery ?? '10 July 2025'} · Enter quantities received today`
            }
          </p>
        </div>
      </div>

      {/* Delivery Confirmation Header */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-1">Enter Quantities Received</h3>
        <p className="text-sm text-gray-500">
          Enter the exact quantities received from the supply truck today. This cannot be backdated.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ key, label, unit }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} <span className="text-gray-400 font-normal">({unit})</span>
            </label>
            <input
              type="number"
              min="0"
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              disabled={confirmed}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        ))}
      </div>

      {/* Confirmed Summary */}
      {confirmed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-green-600" />
            <p className="font-semibold text-green-800 text-sm">Delivery Confirmed</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {fields.map(({ key, label, unit }) =>
              form[key] ? (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-900">{form[key]} {unit}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Audit note */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
        🔒 All stock entries are timestamped and logged in the audit trail. Entries cannot be modified after confirmation.
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!confirmed ? (
          <Button fullWidth loading={loading} onClick={handleConfirm} size="lg">
            <Truck size={18} /> Confirm Delivery Received
          </Button>
        ) : (
          <Button fullWidth variant="outline" onClick={handleReset}>
            Update Again
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Distribution Tab ─────────────────────────────────────
function DistributionTab() {
  const [beneficiaries, setBeneficiaries] = useState(MOCK_BENEFICIARIES);
  const [receiptModal, setReceiptModal]   = useState(null);
  const [filter, setFilter]               = useState('all');

  const stats = {
    total:        beneficiaries.length,
    distributed:  beneficiaries.filter(b => b.status === 'distributed').length,
    pending:      beneficiaries.filter(b => b.status === 'pending').length,
    notCollected: beneficiaries.filter(b => b.status === 'not_collected').length,
  };

  const filtered = filter === 'all'
    ? beneficiaries
    : beneficiaries.filter(b => b.status === filter);

  const updateStatus = (id, newStatus) => {
    setBeneficiaries(prev =>
      prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
    );
    if (newStatus === 'distributed') {
      toast.success('Marked as distributed');
    }
  };

  const generateReceipt = (b) => {
    setReceiptModal(b);
    toast.success(`Receipt generated for ${b.name}`);
  };

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',        value: stats.total,        color: 'gray' },
          { label: 'Distributed',  value: stats.distributed,  color: 'green' },
          { label: 'Pending',      value: stats.pending,      color: 'amber' },
          { label: 'Not Collected',value: stats.notCollected, color: 'red' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className={`text-xs text-${color}-600 mt-0.5`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Distribution Progress</span>
          <span className="font-semibold text-green-700">
            {Math.round((stats.distributed / stats.total) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(stats.distributed / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',           label: 'All' },
          { key: 'pending',       label: 'Pending' },
          { key: 'distributed',   label: 'Distributed' },
          { key: 'not_collected', label: 'Not Collected' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === key
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Beneficiary List */}
      <div className="space-y-2">
        {filtered.map(b => (
          <div
            key={b.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm">{b.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {b.rationCardNo} · Family of {b.familySize}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge status={b.status} />

              {b.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(b.id, 'distributed')}
                >
                  Mark Distributed
                </Button>
              )}

              {b.status === 'distributed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateReceipt(b)}
                >
                  <QrCode size={14} /> Receipt
                </Button>
              )}

              {b.status === 'not_collected' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateStatus(b.id, 'pending')}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setReceiptModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode size={32} className="text-green-700" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Digital Receipt</h3>
              <p className="text-xs text-gray-500 mt-1">July 2025 · Ram Ration Store</p>
            </div>

            {/* Mock QR */}
            <div className="bg-gray-900 rounded-xl p-4 mb-4 flex items-center justify-center">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-sm ${QR_CELLS[i] ? 'bg-white' : 'bg-gray-900'}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Beneficiary</span>
                <span className="font-medium">{receiptModal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ration Card</span>
                <span className="font-medium">{receiptModal.rationCardNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span className="font-medium">Wheat 10kg · Rice 5kg · Sugar 1kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium text-green-700">₹85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">QR Code</span>
                <span className="font-medium text-xs text-blue-600">QR-PDS-2025-07-{receiptModal.id}</span>
              </div>
            </div>

            <Button fullWidth onClick={() => setReceiptModal(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Distribution Logs Tab ────────────────────────────────
function LogsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 mb-1">Distribution History</h3>
        <p className="text-sm text-gray-500">Past month-wise distribution records for your shop.</p>
      </div>

      {/* Summary Chart Bars */}
      <div className="space-y-3">
        {MOCK_DISTRIBUTION_LOGS.map(log => (
          <div key={log.month} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-800 text-sm">{log.month}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                log.completionPct === 100
                  ? 'bg-green-100 text-green-700'
                  : log.completionPct >= 90
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {log.completionPct}%
              </span>
            </div>

            {/* Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  log.completionPct === 100 ? 'bg-green-500' :
                  log.completionPct >= 90  ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${log.completionPct}%` }}
              />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Total',         value: log.total,        color: 'text-gray-700' },
                { label: 'Distributed',   value: log.distributed,  color: 'text-green-700' },
                { label: 'Pending',       value: log.pending,      color: 'text-amber-600' },
                { label: 'Not Collected', value: log.notCollected, color: 'text-red-600' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trend Note */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
        <TrendingUp size={20} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-800">Performance Trend</p>
          <p className="text-xs text-green-700 mt-0.5">
            Your shop maintained above 89% distribution rate over the last 4 months.
            March 2025 achieved 100% — keep it up!
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dealer Dashboard ────────────────────────────────
export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState('stock');
  const dealer = MOCK_USERS.dealer;
  const shop   = MOCK_SHOPS.find(s => s.id === dealer.shopId);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">

      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 text-sm">Dealer Dashboard</p>
              <h1 className="text-2xl font-bold mt-0.5">{dealer.name}</h1>
              <p className="text-blue-200 text-sm mt-1">{shop?.name}</p>
              <p className="text-blue-300 text-xs mt-0.5">{shop?.address}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-300">License No.</p>
              <p className="text-sm font-semibold text-white">{dealer.licenseNo}</p>
              <p className="text-xs text-blue-300 mt-2">Beneficiaries</p>
              <p className="text-sm font-semibold text-white">{shop?.totalBeneficiaries}</p>
            </div>
          </div>

          {/* Quick KPIs */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Stock Status', value: 'Available', sub: 'As of today' },
              { label: 'Distributed', value: '4 / 8',     sub: 'This month' },
              { label: 'Complaints',  value: shop?.complaintCount, sub: 'Open' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-blue-200">{label}</p>
                <p className="text-xs text-blue-300">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 mt-4 p-1 gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {activeTab === 'stock'        && <StockUpdateTab shop={shop} />}
          {activeTab === 'distribution' && <DistributionTab />}
          {activeTab === 'logs'         && <LogsTab />}
        </div>

        {/* Warning Banner */}
        {shop?.complaintCount > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {shop.complaintCount} Active Complaint{shop.complaintCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your shop has open complaints under district review. Ensure all distributions are properly recorded.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
