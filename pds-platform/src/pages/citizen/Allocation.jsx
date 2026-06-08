import { useMemo, useState } from 'react';
import { Package, Calendar, Store, Info, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import {
  computeAllocation, MOCK_COLLECTED,
  CATEGORY_ENTITLEMENTS,
} from '../../constants';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const MONTH_LABEL   = 'July 2025';
const WINDOW        = '1 July 2025 – 31 July 2025';
const LAST_UPDATED  = '10 Jul 2025, 09:14 AM · Dealer ePOS';

function getItemStatus(entitled, collected) {
  if (collected >= entitled) return 'collected';
  if (collected > 0)         return 'partial';
  return 'pending';
}

function computeOverallStatus(rows) {
  if (rows.every(r => r.status === 'collected'))  return 'collected';
  if (rows.some(r => r.status === 'collected' || r.status === 'partial')) return 'partial';
  return 'pending';
}

const colorMap = {
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  bar: 'bg-amber-400'  },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   bar: 'bg-blue-500'   },
  pink:   { bg: 'bg-pink-50',   text: 'text-pink-700',   bar: 'bg-pink-400'   },
  gray:   { bg: 'bg-gray-50',   text: 'text-gray-700',   bar: 'bg-gray-400'   },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-400' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  bar: 'bg-green-500'  },
};

export default function Allocation() {
  const { user } = useAuth();

  // ── Compute entitlement dynamically ──────────────────────
  const category   = user?.category   || 'PHH';
  const familySize = user?.familySize || 4;
  const citizenId  = user?.id         || 'citizen_001';

  const entitlements = useMemo(() => computeAllocation(category, familySize), [category, familySize]);
  const collectedMap = useMemo(() => MOCK_COLLECTED[citizenId] || {}, [citizenId]);

  const [remainingOverrides, setRemainingOverrides] = useState({});

  const rows = useMemo(() => (
    entitlements.map(product => {
      const collected = collectedMap[product.id]?.collected ?? 0;
      const defaultRemaining = Math.max(0, product.entitledQty - collected);
      const remaining = remainingOverrides[product.id] ?? defaultRemaining;
      const adjustedCollected = Math.max(0, product.entitledQty - remaining);
      const status = getItemStatus(product.entitledQty, adjustedCollected);
      const pct = Math.min(100, Math.round((adjustedCollected / product.entitledQty) * 100));
      return {
        ...product,
        collected: adjustedCollected,
        remaining,
        status,
        pct,
      };
    })
  ), [entitlements, collectedMap, remainingOverrides]);

  const handleRemainingChange = (id, nextValue) => {
    const row = rows.find(item => item.id === id);
    if (!row) return;
    const remaining = Math.max(0, Math.min(row.entitledQty, Number(nextValue) || 0));
    setRemainingOverrides(current => ({ ...current, [id]: remaining }));
  };

  const overallStatus = computeOverallStatus(rows);
  const totalEntitled = rows.reduce((s, r) => s + r.totalPrice, 0).toFixed(2);
  const totalPaid     = rows.reduce((s, r) => s + +(r.collected * r.pricePerUnit).toFixed(2), 0).toFixed(2);
  const categoryLabel = CATEGORY_ENTITLEMENTS[category]?.label || category;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm mb-1">Citizen Portal</p>
          <h1 className="text-2xl font-bold">Monthly Allocation</h1>
          <p className="text-green-200 text-sm mt-1">
            {user?.name} · {user?.rationCardNo}
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="bg-white/15 text-xs px-3 py-1 rounded-full">
              Category: <strong>{category}</strong>
            </span>
            <span className="bg-white/15 text-xs px-3 py-1 rounded-full">
              Family Size: <strong>{familySize}</strong>
            </span>
            <span className="bg-white/15 text-xs px-3 py-1 rounded-full">
              {categoryLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">

        {/* Collection Window */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-blue-700" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Collection Window</p>
            <p className="font-bold text-blue-900 mt-0.5">{WINDOW}</p>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Store size={12} /> {user?.shopName || 'Ram Ration Store'}
            </p>
          </div>
          <Badge status={overallStatus} size="lg" />
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Items Entitled',  value: rows.length,                                    color: 'blue'  },
            { label: 'Items Collected', value: rows.filter(r => r.status === 'collected').length, color: 'green' },
            { label: 'Items Pending',   value: rows.filter(r => r.status === 'pending').length,   color: 'amber' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${colorMap[color].bg} rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-bold ${colorMap[color].text}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <Card className="overflow-hidden !p-0">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              <h2 className="font-bold text-gray-800">{MONTH_LABEL} Entitlement</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} /> {LAST_UPDATED}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Item</th>
                  <th className="text-center px-4 py-3">Entitled</th>
                  <th className="text-center px-4 py-3">Collected</th>
                  <th className="text-center px-4 py-3">Remaining</th>
                  <th className="text-center px-4 py-3">Price/Unit</th>
                  <th className="text-center px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{row.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{row.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{row.allocationType.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600 font-medium">
                      {row.entitledQty} {row.unit}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-900">
                      {row.collected} {row.unit}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      <input
                        type="number"
                        min={0}
                        max={row.entitledQty}
                        value={row.remaining}
                        onChange={e => handleRemainingChange(row.id, e.target.value)}
                        className="w-20 mx-auto border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">Remaining {row.unit}</p>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      ₹{row.pricePerUnit}/{row.unit}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-100">
                <tr>
                  <td className="px-5 py-3 font-semibold text-gray-700 text-sm">Total Value</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">₹{totalEntitled}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold text-green-700">₹{totalPaid}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {rows.map(row => {
              const c = colorMap[row.color] || colorMap.gray;
              return (
                <div key={row.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{row.icon}</span>
                      <span className="font-semibold text-gray-900">{row.name}</span>
                    </div>
                    <Badge status={row.status} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Collected: <strong className="text-gray-800">{row.collected} {row.unit}</strong></span>
                    <span>Remaining: <strong className="text-gray-800">{row.remaining} {row.unit}</strong></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${c.bar}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">₹{row.pricePerUnit}/{row.unit} · {row.pct}% collected</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Entitlement Basis Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
          <Info size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 leading-relaxed">
            <strong>How your entitlement is calculated:</strong> You are registered under{' '}
            <strong>{categoryLabel}</strong> with a family of <strong>{familySize} members</strong>.
            Per-person items are multiplied by family size. Per-household items are fixed.
            Governed by the National Food Security Act (NFSA) 2013.
          </div>
        </div>

        {/* Pending alert */}
        {rows.some(r => r.status === 'pending') && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              {rows.filter(r => r.status === 'pending').map(r => r.name).join(', ')} pending collection.
              Visit <strong>{user?.shopName || 'your assigned shop'}</strong> before 31 July 2025.
            </p>
          </div>
        )}

        {/* All collected */}
        {overallStatus === 'collected' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <p className="text-sm text-green-800 font-medium">
              All items collected for {MONTH_LABEL}. See you next month!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
