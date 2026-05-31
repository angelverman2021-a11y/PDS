import { useState } from 'react';
import { AlertTriangle, Store, FileText, Upload, CheckCircle, Copy } from 'lucide-react';
import { MOCK_SHOPS, COMPLAINT_CATEGORIES } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Select Shop',     icon: Store },
  { id: 2, label: 'Category',        icon: AlertTriangle },
  { id: 3, label: 'Describe Issue',  icon: FileText },
  { id: 4, label: 'Evidence',        icon: Upload },
];

function generateComplaintNo() {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `CMP-PUN-2025-${num}`;
}

export default function ComplaintPortal() {
  const [step, setStep]               = useState(1);
  const [shopId, setShopId]           = useState('');
  const [category, setCategory]       = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName]       = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const [complaintNo, setComplaintNo] = useState('');
  const [loading, setLoading]         = useState(false);

  const selectedShop = MOCK_SHOPS.find(s => s.id === shopId);

  // ── Step validators ──────────────────────────────────────
  const canNext = () => {
    if (step === 1) return !!shopId;
    if (step === 2) return !!category;
    if (step === 3) return description.trim().length >= 20;
    return true;
  };

  const next = () => { if (canNext()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const no = generateComplaintNo();
      setComplaintNo(no);
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaintNo);
    toast.success('Complaint number copied!');
  };

  // ── Success Screen ───────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={44} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Complaint Registered!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your complaint has been submitted successfully. Use this tracking ID to follow review, assignment, resolution, and closure.
          </p>

          {/* Complaint Number Box */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-green-700 font-medium mb-1">YOUR COMPLAINT NUMBER</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-green-800 tracking-wider">{complaintNo}</span>
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-green-200 rounded-lg transition-colors"
              >
                <Copy size={18} className="text-green-700" />
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Shop</span>
              <span className="font-medium text-gray-800">{selectedShop?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium text-gray-800">
                {COMPLAINT_CATEGORIES.find(c => c.value === category)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                Submitted
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expected first review</span>
              <span className="font-medium text-gray-800">Within 3 working days</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              fullWidth
              onClick={() => window.location.href = '/complaints/track'}
            >
              Track This Complaint
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setStep(1); setShopId(''); setCategory('');
                setDescription(''); setFileName(''); setSubmitted(false);
              }}
            >
              Submit Another Complaint
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Main Form ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-2xl mb-3">
            <AlertTriangle size={28} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
          <p className="text-gray-500 text-sm mt-1">
            Anonymous reporting · No login required
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map(({ id, label, icon: Icon }, idx) => (
            <div key={id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step > id
                    ? 'bg-green-600 border-green-600 text-white'
                    : step === id
                    ? 'bg-white border-green-600 text-green-600'
                    : 'bg-white border-gray-200 text-gray-300'
                }`}>
                  {step > id
                    ? <CheckCircle size={18} />
                    : <Icon size={18} />
                  }
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  step >= id ? 'text-green-700' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${
                  step > id ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          {/* ── STEP 1: Select Shop ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Which shop are you reporting?</h2>
                <p className="text-sm text-gray-500 mb-4">Select the Fair Price Shop related to your complaint.</p>
              </div>
              <div className="space-y-2">
                {MOCK_SHOPS.map(shop => (
                  <button
                    key={shop.id}
                    onClick={() => setShopId(shop.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      shopId === shop.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{shop.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{shop.address}</p>
                      </div>
                      {shopId === shop.id && (
                        <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                    {shop.complaintCount > 0 && (
                      <p className="text-xs text-red-500 mt-1.5">
                        ⚠ {shop.complaintCount} existing complaint{shop.complaintCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Category ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">What type of issue is this?</h2>
                <p className="text-sm text-gray-500 mb-4">Select the category that best describes your complaint.</p>
              </div>

              {/* Category descriptions */}
              {[
                { value: 'stock_diversion', label: 'Stock Diversion', desc: 'Dealer selling PDS stock in open market', color: 'red' },
                { value: 'overcharging',    label: 'Overcharging',    desc: 'Charged more than the published ration price', color: 'orange' },
                { value: 'denial',          label: 'Denial of Service', desc: 'Refused to give ration or shop was closed', color: 'amber' },
                { value: 'fake_entry',      label: 'Fake Entry',      desc: 'Distribution marked without actually giving ration', color: 'purple' },
                { value: 'other',           label: 'Other Issue',     desc: 'Any other PDS-related complaint', color: 'gray' },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => setCategory(item.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    category === item.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    {category === item.value && (
                      <CheckCircle size={18} className="text-green-600 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 3: Description ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Describe the issue</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Provide as much detail as possible — date, time, what happened, who was involved.
                </p>
              </div>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={6}
                placeholder="e.g. On 12th July 2025, I visited the shop at 10am. The dealer said rice was out of stock but I saw him selling bags to someone outside..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              <div className="flex justify-between items-center">
                <p className={`text-xs ${description.length < 20 ? 'text-red-400' : 'text-green-600'}`}>
                  {description.length < 20
                    ? `Minimum 20 characters (${20 - description.length} more needed)`
                    : `✓ ${description.length} characters`
                  }
                </p>
              </div>

              {/* Privacy note */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                🔒 Your identity is protected. This complaint will be reviewed anonymously by district officers.
              </div>
            </div>
          )}

          {/* ── STEP 4: Evidence ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Upload Evidence <span className="text-gray-400 font-normal text-sm">(Optional)</span></h2>
                <p className="text-sm text-gray-500 mb-4">
                  Photos, videos, or documents that support your complaint. This is optional but helps investigation.
                </p>
              </div>

              {/* File Upload Area */}
              <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                fileName ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,.pdf"
                  onChange={e => setFileName(e.target.files[0]?.name || '')}
                />
                {fileName ? (
                  <div className="text-center">
                    <CheckCircle size={28} className="text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-700">{fileName}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload size={28} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload photo or document</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF, MP4 · Max 10MB</p>
                  </div>
                )}
              </label>

              {/* Complaint Summary before submit */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-700 mb-2">Review Before Submitting</p>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shop</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%]">{selectedShop?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800">
                    {COMPLAINT_CATEGORIES.find(c => c.value === category)?.label}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 shrink-0">Description</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%] line-clamp-2">
                    {description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Evidence</span>
                  <span className="font-medium text-gray-800">{fileName || 'None'}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={back} className="flex-1">
                ← Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={next}
                disabled={!canNext()}
                className="flex-1"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                className="flex-1"
                variant="primary"
              >
                Submit Complaint
              </Button>
            )}
          </div>
        </Card>

        {/* Anonymous note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          No login required · Complaints are reviewed by district officers within 7 working days
        </p>
      </div>
    </div>
  );
}
