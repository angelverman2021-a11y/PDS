import { useState } from 'react';
import {
  ShieldCheck, Package, CheckCircle, QrCode,
  XCircle, ChevronRight, User, CreditCard,
  Users, AlertTriangle,
} from 'lucide-react';
import {
  verifyBeneficiary, checkAllocation,
  confirmDistribution, generateReceipt,
} from '../../services/receiptService';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const QR_CELLS = [
  true, true, true, true, true, false,
  true, false, false, true, false, true,
  true, true, false, true, true, true,
  false, true, true, false, false, true,
  true, false, true, true, false, false,
  true, true, false, true, true, true,
];

const LABELS = {
  steps: {
    verifyBeneficiary: 'Verify Beneficiary',
    checkAllocation:   'Check Allocation',
    confirmItems:      'Confirm Items',
    receipt:           'Receipt',
  },
};

const STEPS = [
  { id: 1, label: LABELS.steps.verifyBeneficiary, icon: ShieldCheck },
  { id: 2, label: LABELS.steps.checkAllocation,   icon: Package     },
  { id: 3, label: LABELS.steps.confirmItems,      icon: CheckCircle },
  { id: 4, label: LABELS.steps.receipt,           icon: QrCode      },
];

// ── Step 1 ────────────────────────────────────────────────
function Step1Verify({ onSuccess }) {
  const [rationCard, setRationCard] = useState('');
  const [otp, setOtp]               = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await verifyBeneficiary(rationCard, otp);
    setLoading(false);
    if (res.success) {
      toast.success('Beneficiary verified');
      onSuccess(res.beneficiary);
    } else {
      setError(res.reason);
    }
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter the beneficiary's ration card number and their registered OTP to begin distribution.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <strong>Demo mode:</strong> beneficiary verification uses only pre-approved test numbers. OTP values are not shown in the UI.
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ration Card Number</label>
        <input
          type="text"
          value={rationCard}
          onChange={e => setRationCard(e.target.value.toUpperCase())}
          placeholder="e.g. MH-2024-00123"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-wide"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary OTP</label>
        <input
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
          placeholder="4-digit OTP"
          maxLength={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg"
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <XCircle size={13} /> {error}
        </p>
      )}
      <Button type="submit" fullWidth loading={loading} variant="secondary">
        Verify Beneficiary <ChevronRight size={16} />
      </Button>
    </form>
  );
}

// ── Step 2 ────────────────────────────────────────────────
function Step2Allocation({ beneficiary, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState(null);

  const handle = async () => {
    setLoading(true);
    const res = await checkAllocation(beneficiary, '2025-07');
    setLoading(false);
    if (res.success) {
      setData(res);
      toast.success('Allocation confirmed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Beneficiary Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-2">Verified Beneficiary</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400" />
            <span className="font-semibold text-gray-800">{beneficiary.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-gray-400" />
            <span className="text-gray-700">{beneficiary.rationCardNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <span className="text-gray-700">Family of {beneficiary.familySize}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-gray-400" />
            <span className="text-gray-700">{beneficiary.category}</span>
          </div>
        </div>
      </div>

      {!data ? (
        <Button fullWidth loading={loading} variant="secondary" onClick={handle}>
          Check Allocation <ChevronRight size={16} />
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-2">
              Entitlement for {data.collectionWindow}
            </p>
            <div className="space-y-1.5">
              {data.entitlements.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.icon} {item.name}</span>
                  <span className="font-semibold text-gray-900">
                    {item.entitledQty} {item.unit} · ₹{item.totalPrice}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Button fullWidth variant="secondary" onClick={() => onSuccess(data.entitlements)}>
            Proceed to Distribution <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Step 3 ────────────────────────────────────────────────
function Step3Confirm({ beneficiary, entitlements, onSuccess }) {
  const [items, setItems]   = useState(
    entitlements.map(e => ({ ...e, qty: e.entitledQty, total: e.totalPrice }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const updateQty = (id, val) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const qty   = Math.max(0, Math.min(Number(val), item.entitledQty));
      return { ...item, qty, total: +(qty * item.pricePerUnit).toFixed(2) };
    }));
  };

  const handle = async () => {
    setError('');
    setLoading(true);
    const res = await confirmDistribution(beneficiary, entitlements, items);
    setLoading(false);
    if (res.success) {
      toast.success('Distribution confirmed');
      onSuccess(items, res.confirmedAt);
    } else {
      setError(res.reason);
    }
  };

  const grandTotal = items.reduce((s, i) => s + i.total, 0).toFixed(2);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Adjust quantities if partial distribution. Cannot exceed entitlement.
      </p>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">Max: {item.entitledQty} {item.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={item.entitledQty}
                step={0.5}
                value={item.qty}
                onChange={e => updateQty(item.id, e.target.value)}
                className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400 w-6">{item.unit}</span>
              <span className="text-xs font-semibold text-gray-700 w-14 text-right">₹{item.total}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <span className="font-semibold text-gray-700 text-sm">Total Amount</span>
        <span className="text-xl font-bold text-green-700">₹{grandTotal}</span>
      </div>

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle size={13} /> {error}
        </p>
      )}

      <Button fullWidth loading={loading} variant="secondary" onClick={handle}>
        Confirm Distribution <ChevronRight size={16} />
      </Button>
    </div>
  );
}

// ── Step 4 ────────────────────────────────────────────────
function Step4Receipt({ beneficiary, shopId, shopName, distributedItems, confirmedAt, onDone }) {
  const [loading, setLoading]   = useState(false);
  const [receipt, setReceipt]   = useState(null);

  const handle = async () => {
    setLoading(true);
    const res = await generateReceipt(beneficiary, shopId, shopName, distributedItems, confirmedAt);
    setLoading(false);
    if (res.success) {
      setReceipt(res.receipt);
      toast.success('Receipt generated successfully!');
    }
  };

  if (receipt) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <CheckCircle size={24} className="text-green-600 shrink-0" />
          <div>
            <p className="font-bold text-green-800">Receipt Generated</p>
            <p className="text-xs text-green-600 mt-0.5">Distribution complete · Audit log updated</p>
          </div>
        </div>

        {/* Mock QR */}
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col items-center gap-3">
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-sm ${QR_CELLS[i] ? 'bg-white' : 'bg-gray-900'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 font-mono">{receipt.qrCode}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          {[
            { label: 'Beneficiary',  value: beneficiary.name },
            { label: 'Ration Card',  value: receipt.rationCardNo },
            { label: 'Shop',         value: shopName },
            { label: 'Month',        value: receipt.month },
            { label: 'Total Amount', value: `₹${receipt.totalAmount}` },
            { label: 'Verified via', value: receipt.verificationMethod },
            { label: 'Generated at', value: new Date(receipt.generatedAt).toLocaleString('en-IN') },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button fullWidth variant="outline" onClick={onDone}>
            Distribute to Next Beneficiary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-2">Distribution Summary</p>
        {distributedItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm py-1 border-b border-green-100 last:border-0">
            <span className="text-gray-600">{item.icon} {item.name}</span>
            <span className="font-semibold">{item.qty} {item.unit} · ₹{item.total}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold text-green-800 mt-2 pt-2 border-t border-green-200">
          <span>Total</span>
          <span>₹{distributedItems.reduce((s, i) => s + i.total, 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
        🔒 Generating receipt will create an immutable audit log entry. This action cannot be undone.
      </div>

      <Button fullWidth loading={loading} variant="secondary" onClick={handle}>
        <QrCode size={16} /> Generate Digital Receipt
      </Button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function DistributionFlow({ shopId, shopName }) {
  const [step, setStep]                   = useState(1);
  const [beneficiary, setBeneficiary]     = useState(null);
  const [entitlements, setEntitlements]   = useState([]);
  const [distributedItems, setDistributed] = useState([]);
  const [confirmedAt, setConfirmedAt]     = useState('');

  const reset = () => {
    setStep(1); setBeneficiary(null);
    setEntitlements([]); setDistributed([]); setConfirmedAt('');
  };

  return (
    <div className="space-y-5">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map(({ id, label, icon: Icon }, idx) => (
          <div key={id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                step > id  ? 'bg-blue-600 border-blue-600 text-white' :
                step === id ? 'bg-white border-blue-600 text-blue-600' :
                              'bg-white border-gray-200 text-gray-300'
              }`}>
                {step > id ? <CheckCircle size={16} /> : <Icon size={16} />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= id ? 'text-blue-700' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > id ? 'bg-blue-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Step1Verify onSuccess={b => { setBeneficiary(b); setStep(2); }} />
      )}
      {step === 2 && beneficiary && (
        <Step2Allocation
          beneficiary={beneficiary}
          onSuccess={e => { setEntitlements(e); setStep(3); }}
        />
      )}
      {step === 3 && (
        <Step3Confirm
          beneficiary={beneficiary}
          entitlements={entitlements}
          onSuccess={(items, at) => { setDistributed(items); setConfirmedAt(at); setStep(4); }}
        />
      )}
      {step === 4 && (
        <Step4Receipt
          beneficiary={beneficiary}
          shopId={shopId}
          shopName={shopName}
          distributedItems={distributedItems}
          confirmedAt={confirmedAt}
          onDone={reset}
        />
      )}
    </div>
  );
}
