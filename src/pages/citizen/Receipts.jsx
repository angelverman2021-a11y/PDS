import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Download, ShieldCheck, Calendar,
  Store, CheckCircle, Clock, AlertTriangle, Info, Upload,
} from 'lucide-react';
import { MOCK_RECEIPTS, RECEIPT_STATUS } from '../../constants';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  [RECEIPT_STATUS.VERIFIED]:  { label: 'Verified',  color: 'bg-green-100 text-green-700',  icon: ShieldCheck  },
  [RECEIPT_STATUS.GENERATED]: { label: 'Generated', color: 'bg-blue-100 text-blue-700',    icon: QrCode       },
  [RECEIPT_STATUS.PENDING]:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700',  icon: Clock        },
};

function ReceiptCard({ receipt, onDownload, onVerify }) {
  const cfg = STATUS_CONFIG[receipt.status] || STATUS_CONFIG[RECEIPT_STATUS.GENERATED];
  const StatusIcon = cfg.icon;

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
            <p className="text-green-200 text-xs font-mono">{receipt.qrCode}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
          <StatusIcon size={11} /> {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">

        {/* Shop + Date */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Store size={14} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Shop</p>
              <p className="font-medium text-gray-800 text-xs">{receipt.shopName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Issued</p>
              <p className="font-medium text-gray-800 text-xs">
                {new Date(receipt.generatedAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Distributed Items */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Items Distributed</p>
          <div className="flex flex-wrap gap-1.5">
            {receipt.distributedItems.map(item => (
              <span
                key={item.id}
                className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100"
              >
                {item.name}: {item.qty} {item.unit}
              </span>
            ))}
          </div>
        </div>

        {/* Audit Trail Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} /> Beneficiary Verified
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} /> Allocation Checked
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} /> Dealer Confirmed
          </span>
          {receipt.status === RECEIPT_STATUS.VERIFIED && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              <ShieldCheck size={10} /> Citizen Verified
            </span>
          )}
          {receipt.isPartial && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              <AlertTriangle size={10} /> Partial Distribution
            </span>
          )}
        </div>

        {/* Verification method */}
        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
          <Info size={11} />
          Verified via: <strong className="text-gray-600">{receipt.verificationMethod}</strong>
          {receipt.verifiedAt && (
            <> · Citizen confirmed: <strong className="text-gray-600">
              {new Date(receipt.verifiedAt).toLocaleDateString('en-IN')}
            </strong></>
          )}
        </p>

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
              <ShieldCheck size={13} /> Verify QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Receipts() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const fileInputRef = useRef(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  // Filter receipts for logged-in citizen
  const myReceipts = MOCK_RECEIPTS.filter(
    r => r.citizenId === (user?.id || 'citizen_001')
  );

  const handleDownload = (receipt) => {
    toast.success(`Receipt for ${receipt.month} downloaded as PDF`);
  };

  const handleVerify = (receipt) => {
    navigate('/verify', { state: { qr: receipt.qrCode } });
  };

  const handleReceiptUpload = (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0] || event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setReceiptImage(previewUrl);
    setAiLoading(true);
    setAiAnalysis(null);
    setAuditStep(1);

    setTimeout(() => setAuditStep(2), 1200);

    setTimeout(() => {
      setAiLoading(false);
      setAuditStep(0);
      setAiAnalysis({
        extractedText: [
          '50kg Wheat',
          '4kg Rice',
        ],
        digitalText: [
          '50kg Wheat',
          '5kg Rice',
        ],
        warning: '1kg Leakage Detected — physical receipt and state ledger do not match.',
      });
    }, 2500);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleReceiptUpload(event);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleAutoDraftComplaint = () => {
    navigate('/complaints/new', {
      state: {
        prefill: {
          shopId: myReceipts[0]?.shopId,
          category: 'fake_entry',
          description: 'AI receipt audit detected a 1kg rice discrepancy between physical receipt and digital ledger records.',
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm mb-1">Citizen Portal</p>
          <h1 className="text-2xl font-bold">Digital Receipts</h1>
          <p className="text-green-200 text-sm mt-1">
            {myReceipts.length} receipt{myReceipts.length !== 1 ? 's' : ''} found · {user?.rationCardNo}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">

        {/* How receipts are generated note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Receipts are generated automatically after a 4-step verified process:
            Beneficiary OTP verification → Allocation check → Dealer distribution confirmation → System receipt generation.
            No receipt can be created manually.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">AI Receipt OCR & Entitlement Auditor</p>
              <p className="text-xs text-gray-500 mt-2 max-w-2xl">
                Upload a physical receipt and let the simulated AI verify delivery weights against the official ledger.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-800"
            >
              <Upload size={16} /> Upload Physical Receipt for AI Verification
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleReceiptUpload}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`mt-4 rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 shadow-inner'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4">
              <Upload size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-900">Upload Physical Receipt for AI Verification</p>
            <p className="text-xs text-slate-500 mt-2">
              Drag and drop your receipt image here, or click to select a file.
            </p>
          </div>

          {receiptImage && !aiLoading && !aiAnalysis && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500 mb-2">Receipt selected for AI review</p>
              <img
                src={receiptImage}
                alt="Receipt preview"
                className="mx-auto max-h-40 w-full max-w-xl rounded-2xl border border-slate-200 object-contain"
              />
            </div>
          )}

          {aiLoading && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                  <Clock size={20} className="text-emerald-300 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Simulating AI verification...</p>
                  <p className="text-xs text-slate-400 mt-1">This may take a few moments while the receipt is processed.</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <p className={`rounded-2xl px-3 py-2 transition ${auditStep >= 1 ? 'bg-emerald-700/10 text-emerald-100' : 'bg-slate-800 text-slate-500'}`}>
                  Extracting layout using OCR...
                </p>
                <p className={`rounded-2xl px-3 py-2 transition ${auditStep >= 2 ? 'bg-emerald-700/10 text-emerald-100' : 'bg-slate-800 text-slate-500'}`}>
                  Cross-referencing weight metrics with state ledger...
                </p>
              </div>
            </div>
          )}

          {aiAnalysis && (
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_0.85fr]">
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-600 font-semibold">AI Discrepancy Report</p>
                    <p className="mt-2 text-sm text-gray-600">Digital ledger allocation versus OCR-extracted receipt values.</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <AlertTriangle size={12} /> 1kg Leakage Detected
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Digital Ledger Allocated</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      {aiAnalysis.digitalText.map((line) => (
                        <div key={line} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 border border-slate-200">
                          <span>{line.split(' ')[1]} {line.split(' ')[2]}</span>
                          <span className="font-semibold text-slate-900">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">OCR Extracted Text</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      {aiAnalysis.extractedText.map((line) => (
                        <div key={line} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 border border-slate-200">
                          <span>{line.split(' ')[1]} {line.split(' ')[2]}</span>
                          <span className="font-semibold text-slate-900">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-amber-50 border border-amber-100 p-4 text-amber-900">
                  <p className="text-sm font-semibold">{aiAnalysis.warning}</p>
                  <p className="text-xs mt-1 text-amber-800">The AI auditor has flagged an allocation mismatch and generated a compliance escalation recommendation.</p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoDraftComplaint}
                  className="mt-4 w-full rounded-2xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  Auto-Draft & Escalate Transparency Complaint
                </button>
              </div>
            </div>
          )}
        </div>

        {myReceipts.length === 0 ? (
          <div className="text-center py-16">
            <QrCode size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-600">No receipts yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Receipts appear here after your ration is distributed and verified.
            </p>
          </div>
        ) : (
          myReceipts.map(receipt => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              onDownload={handleDownload}
              onVerify={handleVerify}
            />
          ))
        )}
      </div>
    </div>
  );
}
