import { Package, Calendar, Store, Info } from 'lucide-react';
import { MOCK_ALLOCATION, MOCK_USERS } from '../../constants';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const items = [
  { key: 'wheat_kg',     label: 'Wheat',    unit: 'kg'  },
  { key: 'rice_kg',      label: 'Rice',     unit: 'kg'  },
  { key: 'sugar_kg',     label: 'Sugar',    unit: 'kg'  },
  { key: 'kerosene_ltr', label: 'Kerosene', unit: 'ltr' },
];

function getItemStatus(ent, col) {
  if (col >= ent) return 'collected';
  if (col > 0)    return 'partial';
  return 'pending';
}

export default function Allocation() {
  const alloc = MOCK_ALLOCATION;
  const user  = MOCK_USERS.citizen;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm mb-1">Citizen Portal</p>
          <h1 className="text-2xl font-bold">Monthly Allocation</h1>
          <p className="text-green-200 text-sm mt-1">{user.name} · {user.rationCardNo}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">

        {/* Collection Window */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Collection Window</p>
            <p className="font-bold text-blue-900 mt-0.5">{alloc.collectionWindow}</p>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Store size={12} /> {alloc.shopName}
            </p>
          </div>
          <div className="ml-auto shrink-0">
            <Badge status={alloc.status} size="lg" />
          </div>
        </div>

        {/* Allocation Table */}
        <Card className="overflow-hidden !p-0">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Package size={18} className="text-green-600" />
            <h2 className="font-bold text-gray-800">July 2025 Entitlement</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Item</th>
                  <th className="text-center px-5 py-3">Entitlement</th>
                  <th className="text-center px-5 py-3">Collected</th>
                  <th className="text-center px-5 py-3">Remaining</th>
                  <th className="text-center px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(({ key, label, unit }) => {
                  const ent = alloc.entitlement[key];
                  const col = alloc.collected[key];
                  const status = getItemStatus(ent, col);
                  return (
                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{label}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{ent} {unit}</td>
                      <td className="px-5 py-4 text-center font-semibold text-gray-900">{col} {unit}</td>
                      <td className="px-5 py-4 text-center text-gray-500">{ent - col} {unit}</td>
                      <td className="px-5 py-4 text-center"><Badge status={status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {items.map(({ key, label, unit }) => {
              const ent = alloc.entitlement[key];
              const col = alloc.collected[key];
              const status = getItemStatus(ent, col);
              const pct = Math.round((col / ent) * 100);
              return (
                <div key={key} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{label}</span>
                    <Badge status={status} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Collected: <strong className="text-gray-800">{col} {unit}</strong></span>
                    <span>Entitled: <strong className="text-gray-800">{ent} {unit}</strong></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${status === 'collected' ? 'bg-green-500' : status === 'partial' ? 'bg-blue-500' : 'bg-gray-300'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Info Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Rice (5 kg) is pending collection. Visit <strong>{alloc.shopName}</strong> before 31 July 2025 to collect your remaining entitlement.
          </p>
        </div>

      </div>
    </div>
  );
}
