import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QrCode, Camera, CheckCircle, XCircle, Search, Package } from 'lucide-react';
import { MOCK_QR_DATA } from '../../constants';
import toast from 'react-hot-toast';

const MOCK_IDS = Object.keys(MOCK_QR_DATA);

export default function QRVerification() {
  const location = useLocation();
  const prefill = new URLSearchParams(location.search).get('qr') || (location.state?.qr ?? '');

  const [receiptId, setReceiptId] = useState(prefill);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [verified, setVerified]   = useState(false);

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!receiptId.trim()) return toast.error('Enter a Receipt ID');
    setLoading(true);
    setTimeout(() => {
      const data = MOCK_QR_DATA[receiptId.trim()];
      setResult(data || { valid: false });
      setLoading(false);
      setVerified(true);
      if (data?.valid) toast.success('Receipt verified successfully!');
      else toast.error('Receipt is invalid or not found');
    }, 800);
  };

  const handleMockScan = () => {
    const id = MOCK_IDS[Math.floor(Math.random() * (MOCK_IDS.length - 1))]; // avoid FAKE
    setReceiptId(id);
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt ID / QR Code</label>
              <input
                type="text"
                value={receiptId}
                onChange={e => { setReceiptId(e.target.value); setVerified(false); setResult(null); }}
                placeholder="e.g. QR-PDS-2025-07-001"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">Try: QR-PDS-2025-07-001 or FAKE-QR-999</p>
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

        {/* Result Card */}
        {verified && result && (
          <div className={`rounded-2xl border-2 shadow-sm overflow-hidden ${
            result.valid ? 'border-green-400' : 'border-red-400'
          }`}>
            {/* Status Banner */}
            <div className={`px-6 py-4 flex items-center gap-3 ${result.valid ? 'bg-green-600' : 'bg-red-600'} text-white`}>
              {result.valid
                ? <CheckCircle size={24} />
                : <XCircle size={24} />
              }
              <div>
                <p className="font-extrabold text-lg">{result.valid ? 'VALID RECEIPT' : 'INVALID RECEIPT'}</p>
                <p className="text-sm opacity-80">
                  {result.valid ? 'This receipt is genuine and verified.' : 'This receipt could not be verified.'}
                </p>
              </div>
            </div>

            {result.valid && (
              <div className="bg-white p-6 space-y-3">
                {[
                  { label: 'Beneficiary Name', value: result.beneficiaryName },
                  { label: 'Shop Name',         value: result.shopName },
                  { label: 'Month',             value: result.month },
                  { label: 'Issued Date',       value: result.issuedAt },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}

                {/* Items */}
                <div className="pt-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2 flex items-center gap-1">
                    <Package size={12} /> Items Received
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.items).map(([key, val]) => (
                      <div key={key} className="bg-green-50 rounded-lg px-3 py-2 text-sm">
                        <span className="text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-bold text-green-700 ml-2">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!result.valid && (
              <div className="bg-white p-6 text-center">
                <p className="text-gray-500 text-sm">
                  The receipt ID <strong className="text-gray-700">{receiptId}</strong> was not found in our records.
                  If you believe this is an error, please report it.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
