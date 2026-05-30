import { useNavigate } from 'react-router-dom';
import { QrCode, Download, ShieldCheck, Package, Calendar, Store } from 'lucide-react';
import { MOCK_RECEIPTS } from '../../constants';
import toast from 'react-hot-toast';

export default function Receipts() {
  const navigate = useNavigate();

  const handleDownload = (receipt) => {
    toast.success(`Receipt for ${receipt.month} downloaded as PDF`);
  };

  const handleVerify = (receipt) => {
    navigate('/verify', { state: { qr: receipt.qrCode } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm mb-1">Citizen Portal</p>
          <h1 className="text-2xl font-bold">Digital Receipts</h1>
          <p className="text-green-200 text-sm mt-1">{MOCK_RECEIPTS.length} receipts found</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {MOCK_RECEIPTS.map(receipt => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            onDownload={handleDownload}
            onVerify={handleVerify}
          />
        ))}
      </div>
    </div>
  );
}

function ReceiptCard({ receipt, onDownload, onVerify }) {
  const itemEntries = Object.entries(receipt.items).filter(([, v]) => v > 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <QrCode size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white">{receipt.month}</p>
            <p className="text-green-200 text-xs">{receipt.qrCode}</p>
          </div>
        </div>
        {receipt.isVerified && (
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs text-white font-medium">
            <ShieldCheck size={12} /> Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Store size={14} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Shop</p>
              <p className="font-medium text-gray-800 text-xs">{receipt.shopName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Issued</p>
              <p className="font-medium text-gray-800 text-xs">{receipt.issuedAt}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2 flex items-center gap-1">
            <Package size={11} /> Items Received
          </p>
          <div className="flex flex-wrap gap-2">
            {itemEntries.map(([key, val]) => (
              <span key={key} className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100">
                {key.replace('_', ' ')}: {val}
              </span>
            ))}
          </div>
        </div>

        {/* Amount + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-xl font-extrabold text-gray-900">₹{receipt.totalAmount}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(receipt)}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium px-3 py-2 rounded-xl transition-all"
            >
              <Download size={13} /> PDF
            </button>
            <button
              onClick={() => onVerify(receipt)}
              className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-medium px-3 py-2 rounded-xl transition-all"
            >
              <ShieldCheck size={13} /> Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
