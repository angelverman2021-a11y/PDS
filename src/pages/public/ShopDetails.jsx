import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, User, Calendar, AlertTriangle, ArrowLeft,
  Store, QrCode, Flag, Package,
} from 'lucide-react';
import { MOCK_SHOPS, STOCK_STATUS } from '../../constants';
import Badge from '../../components/common/Badge';

const statusConfig = {
  [STOCK_STATUS.AVAILABLE]:    { label: 'Stock Available',  color: 'bg-green-500',  ring: 'ring-green-200',  text: 'text-green-700',  bg: 'bg-green-50'  },
  [STOCK_STATUS.LOW]:          { label: 'Low Stock',        color: 'bg-amber-500',  ring: 'ring-amber-200',  text: 'text-amber-700',  bg: 'bg-amber-50'  },
  [STOCK_STATUS.OUT_OF_STOCK]: { label: 'Out of Stock',     color: 'bg-red-500',    ring: 'ring-red-200',    text: 'text-red-700',    bg: 'bg-red-50'    },
};

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = MOCK_SHOPS.find(s => s.id === id);

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <Store size={48} className="text-gray-300" />
        <p className="text-xl font-bold text-gray-700">Shop Not Found</p>
        <p className="text-gray-400 text-sm">The shop you're looking for doesn't exist.</p>
        <Link to="/shops" className="text-green-700 font-medium hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Shop Finder
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[shop.stockStatus];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Store size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{shop.name}</h1>
              <p className="text-green-200 text-sm mt-0.5 flex items-center gap-1">
                <MapPin size={13} /> {shop.address}
              </p>
              <p className="text-green-300 text-xs mt-1">License: {shop.licenseNo}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">

        {/* Large Status Indicator */}
        <div className={`${cfg.bg} border border-${shop.stockStatus === STOCK_STATUS.AVAILABLE ? 'green' : shop.stockStatus === STOCK_STATUS.LOW ? 'amber' : 'red'}-200 rounded-2xl p-6 flex items-center gap-5`}>
          <div className={`w-16 h-16 rounded-full ${cfg.color} ring-4 ${cfg.ring} flex items-center justify-center shadow-lg`}>
            <Package size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Current Stock Status</p>
            <p className={`text-2xl font-extrabold ${cfg.text} mt-0.5`}>{cfg.label}</p>
            <p className="text-xs text-gray-500 mt-1">Last updated: {shop.lastDelivery}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {[
            { icon: User,      label: 'Dealer Name',        value: shop.dealerName },
            { icon: MapPin,    label: 'Address',             value: shop.address },
            { icon: Calendar,  label: 'Last Delivery Date',  value: shop.lastDelivery },
            { icon: AlertTriangle, label: 'Complaint Count', value: `${shop.complaintCount} complaint${shop.complaintCount !== 1 ? 's' : ''}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Beneficiaries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Total Beneficiaries</p>
          <p className="text-3xl font-extrabold text-gray-900">{shop.totalBeneficiaries}</p>
          <p className="text-xs text-gray-400 mt-1">Registered households served by this shop</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/complaints/new"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
          >
            <Flag size={16} /> Report Issue
          </Link>
          <Link
            to="/verify"
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
          >
            <QrCode size={16} /> Verify Receipt
          </Link>
        </div>

        {shop.complaintCount > 5 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This shop has <strong>{shop.complaintCount} complaints</strong> and is under district review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
