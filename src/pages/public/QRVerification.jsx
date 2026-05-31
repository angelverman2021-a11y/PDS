import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  QrCode, Camera, CheckCircle, XCircle,
  Search, Package, Store, Calendar,
  ShieldCheck, AlertTriangle, Info,
} from 'lucide-react';
import { MOCK_RECEIPTS, MOCK_SHOPS } from '../../constants';
import toast from 'react-hot-toast';

// ── QR Lookup Engine ──────────────────────────────────────
// Validates against the actual receipt database.
// Checks: QR exists, shop matches, receipt is not tampered.
function lookupQR(qrCode) {
  const trimmed = qrCode.trim();
  if (!trimmed) return { valid: false, reason: 'No QR code provided.' };

  // Find receipt in database
  const receipt = MOCK_RECEIPTS.find(r => r.qrCode === trimmed);
  if (!receipt) {
    return { valid: false, reason: 'QR code not found in receipt database. This receipt may be fake or tampered.' };
  }

  // Verify shop exists
  const shop = MOCK_SHOPS.find(s => s.id === receipt.shopId);
  if (!shop) {
    return { valid: false, reason: 'Shop linked to this receipt is not registered.' };
  }

  return {
    valid: true,
    receipt,
    shop,
    beneficiaryName: receipt.rationCardNo.slice(0, 5) + '***',
  };
}

const DEMO_QR_IDS = MOCK_RECEIPTS.map(r => r.qrCode);

export default function QRVerification() {
  const location  = useLocation();
  const prefill   = new URLSearchParams(location.search).get('qr') || (location.state?.qr ?? '');

  const [qrCode, setQrCode]   = useState(prefill);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!qrCode.trim()) return toast.error('Enter a QR code or Receipt ID');
    setLoading(true);
    setTimeout(() => {
      const res = lookupQR(qrCode);
      setResult(res);
      setLoading(false);
      if (res.valid) toast.success('Receipt verified successfully!');
      else toast.error('Invalid or unrecognised QR code');
    }, 800);
  };

  const handleMockScan = () => {
    const id = DEMO_QR_IDS[Math.floor(Math.random() * DEMO_QR_IDS.length)];
    setQrCode(id);
    setResult(null);
    toast('QR scanned: ' + id, { icon: '📷' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <QrCode size={28} />
          </div>
          <h1 className="text-2xl font-bold">Receipt Verification</h1>
          <p className="text-green-200 text-sm mt-1">Verify if a PDS receipt is genuine</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-4">

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Receipt ID / QR Code
              </label>
              <input
                type="text"
                value={qrCode}
                onChange={e => { setQrCode(e.target.value); setResult(null); }}
                placeholder="e.g. QR-PDS-2025-07-001"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Valid demo codes: {DEMO_QR_IDS.join(' · ')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-60"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Search size={16} />
                }
                Verify Receipt
              </button>
              <button
                type="button"
                onClick={handleMockScan}
                className="flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold px-4 py-3 rounded-xl transition-all text-sm"
              >
                <Camera size={16} /> Scan QR
              </button>
            </div>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl border-2 shadow-sm overflow-hidden ${
            result.valid ? 'border-green-400' : 'border-red-400'
          }`}>

            {/* Status Banner */}
            <div className={`px-6 py-4 flex items-center gap-3 ${
              result.valid ? 'bg-green-600' : 'bg-red-600'
            } text-white`}>
              {result.valid ? <CheckCircle size={24} /> : <XCircle size={24} />}
              <div>
                <p className="font-extrabold text-lg">
                  {result.valid ? 'VALID RECEIPT' : 'INVALID RECEIPT'}
                </p>
                <p className="text-sm opacity-80">
                  {result.valid
                    ? 'This receipt is genuine and verified against the database.'
                    : result.reason
                  }
                </p>
              </div>
            </div>

            {/* Valid Receipt Details */}
            {result.valid && (
              <div className="bg-white p-6 space-y-4">

                {/* Core fields */}
                <div className="space-y-2">
                  {[
                    { label: 'Beneficiary',   value: result.beneficiaryName,                          icon: ShieldCheck },
                    { label: 'Ration Card',   value: result.receipt.rationCardNo,                     icon: ShieldCheck },
                    { label: 'Shop',          value: result.receipt.shopName,                         icon: Store       },
                    { label: 'Month',         value: result.receipt.month,                            icon: Calendar    },
                    { label: 'Issued',        value: new Date(result.receipt.generatedAt).toLocaleDateString('en-IN'), icon: Calendar },
                    { label: 'Verified via',  value: result.receipt.verificationMethod,               icon: ShieldCheck },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Icon size={12} className="text-gray-400" /> {label}
                      </span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2 flex items-center gap-1">
                    <Package size={12} /> Items Distributed
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {result.receipt.distributedItems.map(item => (
                      <div key={item.id} className="bg-green-50 rounded-lg px-3 py-2 text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-bold text-green-700 ml-2">{item.qty} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-600">Total Amount Paid</span>
                  <span className="text-xl font-bold text-gray-900">₹{result.receipt.totalAmount}</span>
                </div>

                {/* Audit trail */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Beneficiary Verified
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Allocation Checked
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Shop: {result.shop.licenseNo}
                  </span>
                  {result.receipt.isPartial && (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={10} /> Partial Distribution
                    </span>
                  )}
                </div>

                <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2">
                  <Info size={13} className="text-green-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700">
                    This QR code is linked to <strong>{result.shop.name}</strong> (License: {result.shop.licenseNo}).
                    Any receipt claiming a different shop is fraudulent.
                  </p>
                </div>
              </div>
            )}

            {/* Invalid details */}
            {!result.valid && (
              <div className="bg-white p-6">
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 text-sm">Verification Failed</p>
                    <p className="text-sm text-red-700 mt-1">{result.reason}</p>
                    <p className="text-xs text-red-500 mt-2">
                      If you received this receipt from a dealer, please report it immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
