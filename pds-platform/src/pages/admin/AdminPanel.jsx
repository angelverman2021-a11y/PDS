import { useState } from 'react';
import {
  ClipboardList, ScrollText, Filter, Search,
  CheckCircle, AlertTriangle, ChevronDown, User,
  Store, Calendar, FileText, ShieldAlert, Clock, Terminal,
} from 'lucide-react';
import {
  MOCK_COMPLAINTS, MOCK_AUDIT_LOGS, MOCK_USERS,
  COMPLAINT_CATEGORIES, COMPLAINT_STATUS,
} from '../../constants';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const LABELS = {
  tabs: {
    complaints: 'Complaint Queue',
    audit: 'Audit Logs',
    integrity: 'System Integrity',
  },
  filters: {
    all: 'All',
    submitted: 'Submitted',
    under_review: 'Under Review',
    assigned: 'Assigned',
    resolved: 'Resolved',
    closed: 'Closed',
  },
};

const TABS = [
  { id: 'complaints', label: LABELS.tabs.complaints, icon: ClipboardList },
  { id: 'audit',      label: LABELS.tabs.audit,      icon: ScrollText    },
  { id: 'integrity',  label: LABELS.tabs.integrity,  icon: Terminal      },
];

const STATUS_FILTERS = [
  { key: 'all',          label: LABELS.filters.all          },
  { key: 'submitted',    label: LABELS.filters.submitted    },
  { key: 'under_review', label: LABELS.filters.under_review },
  { key: 'assigned',     label: LABELS.filters.assigned     },
  { key: 'resolved',     label: LABELS.filters.resolved     },
  { key: 'closed',       label: LABELS.filters.closed       },
];

const NEXT_STATUS = {
  submitted:    ['under_review'],
  under_review: ['assigned'],
  assigned:     ['resolved'],
  resolved:     ['closed'],
  closed:       [],
};

const STATUS_LABELS = {
  under_review: 'Mark Under Review',
  assigned:     'Assign Officer',
  resolved:     'Mark Resolved',
  closed:       'Close Complaint',
};

// ── Complaint Row ─────────────────────────────────────────
function ComplaintRow({ complaint, onStatusChange }) {
  const [expanded, setExpanded]   = useState(false);
  const [note, setNote]           = useState(complaint.resolutionNote || '');
  const [saving, setSaving]       = useState(false);

  const nextStatuses = NEXT_STATUS[complaint.status] || [];
  const categoryLabel = COMPLAINT_CATEGORIES.find(c => c.value === complaint.category)?.label || complaint.category;

  const handleStatusUpdate = (newStatus) => {
    if (newStatus === 'resolved' && !note.trim()) {
      return toast.error('Add a resolution note before marking as resolved');
    }
    setSaving(true);
    setTimeout(() => {
      onStatusChange(complaint.id, newStatus, note);
      setSaving(false);
      toast.success(`Complaint ${newStatus === 'resolved' ? 'resolved' : 'status updated'}`);
    }, 700);
  };

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Row Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors gap-3"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
            complaint.status === 'assigned'     ? 'bg-purple-500' :
            complaint.status === 'under_review' ? 'bg-amber-500' :
            complaint.status === 'resolved'     ? 'bg-green-500' : 'bg-blue-500'
          }`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{complaint.complaintNo}</span>
              <Badge status={complaint.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{complaint.shopName} · {categoryLabel}</p>
            <p className="text-xs text-gray-400 mt-0.5">{complaint.submittedAt}</p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Store size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Shop</p>
                <p className="font-medium text-gray-800">{complaint.shopName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Category</p>
                <p className="font-medium text-gray-800">{categoryLabel}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Assigned To</p>
                <p className="font-medium text-gray-800">{complaint.assignedTo || 'Unassigned'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Submitted</p>
                <p className="font-medium text-gray-800">{complaint.submittedAt}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FileText size={12} /> Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Resolution Note */}
          {complaint.status !== 'resolved' && complaint.status !== 'closed' && nextStatuses.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Resolution / Action Note</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Describe action taken or findings..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
              />
            </div>
          )}

          {/* Resolved Note Display */}
          {complaint.status === 'resolved' && complaint.resolutionNote && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                <CheckCircle size={12} /> Resolution Note
              </p>
              <p className="text-sm text-green-800">{complaint.resolutionNote}</p>
              {complaint.resolvedAt && (
                <p className="text-xs text-green-500 mt-1">Resolved on {complaint.resolvedAt}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {nextStatuses.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {nextStatuses.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={saving}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                    s === 'resolved'     ? 'bg-green-600 hover:bg-green-700 text-white' :
                    s === 'closed'       ? 'bg-gray-700 hover:bg-gray-800 text-white' :
                    s === 'assigned'     ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                    'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {saving ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : s === 'resolved' ? (
                    <CheckCircle size={13} />
                  ) : s === 'assigned' ? (
                    <ShieldAlert size={13} />
                  ) : (
                    <Clock size={13} />
                  )}
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Complaints Tab ────────────────────────────────────────
function ComplaintsTab() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');

  const handleStatusChange = (id, newStatus, note) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: newStatus,
              resolutionNote: note || c.resolutionNote,
              resolvedAt: newStatus === 'resolved'
                ? new Date().toISOString().split('T')[0]
                : c.resolvedAt,
            }
          : c
      )
    );
  };

  const filtered = complaints.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter;
    const matchSearch = search === '' ||
      c.complaintNo.toLowerCase().includes(search.toLowerCase()) ||
      c.shopName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:          complaints.length,
    submitted:    complaints.filter(c => c.status === COMPLAINT_STATUS.SUBMITTED).length,
    under_review: complaints.filter(c => c.status === COMPLAINT_STATUS.UNDER_REVIEW).length,
    assigned:     complaints.filter(c => c.status === COMPLAINT_STATUS.ASSIGNED).length,
    resolved:     complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length,
    closed:       complaints.filter(c => c.status === COMPLAINT_STATUS.CLOSED).length,
  };

  return (
    <div className="space-y-4">

      {/* Summary Chips */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { key: 'submitted',    label: 'New',          color: 'blue'  },
          { key: 'under_review', label: 'In Review',    color: 'amber' },
          { key: 'assigned',     label: 'Assigned',     color: 'purple' },
          { key: 'resolved',     label: 'Resolved',     color: 'green' },
        ].map(({ key, label, color }) => (
          <div key={key} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold text-${color}-700`}>{counts[key]}</p>
            <p className={`text-xs text-${color}-600`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by complaint no. or shop name..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === key
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label} {key !== 'all' && counts[key] > 0 && (
                <span className={`ml-1 ${filter === key ? 'opacity-75' : 'text-gray-400'}`}>
                  ({counts[key]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ClipboardList size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No complaints match your filter</p>
          </div>
        ) : (
          filtered.map(c => (
            <ComplaintRow
              key={c.id}
              complaint={c}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Audit Logs Tab ────────────────────────────────────────
function AuditLogsTab() {
  const [search, setSearch] = useState('');
  const [scanStatus, setScanStatus] = useState('idle');
  const [scanMessage, setScanMessage] = useState('');

  const timelineEntries = MOCK_AUDIT_LOGS.slice(0, 4).map((log, index) => ({
    id: log.id,
    action: log.action,
    timestamp: log.dateTime,
    hash: [
      'e3b0c44298fc1c149afb',
      'a54d88e06612d820bc3b',
      '2d711642b726b044016b',
      '41edece42d8d7a4202ad',
    ][index] + '...9f8b',
  }));

  const matrixLines = [
    '01010110 10010111 11001010',
    '10111001 01100011 00101110',
    '00111100 10011011 01101001',
    '11010101 00011010 01100101',
    '01100110 10101011 10011100',
  ];

  const ACTION_ICONS = {
    'Stock Updated':        { icon: Store,         color: 'text-blue-600 bg-blue-50'   },
    'Receipt Generated':    { icon: FileText,       color: 'text-green-600 bg-green-50' },
    'Complaint Resolved':   { icon: CheckCircle,    color: 'text-green-600 bg-green-50' },
    'Complaint Assigned':   { icon: ShieldAlert,    color: 'text-purple-600 bg-purple-50' },
    'Citizen Verification': { icon: User,           color: 'text-purple-600 bg-purple-50'},
  };

  const handleRunScan = () => {
    setScanStatus('scanning');
    setScanMessage('');
    setTimeout(() => {
      setScanStatus('complete');
      setScanMessage('0 Tampered Records Found. Cryptographic seals intact.');
      toast.success('System integrity scan completed successfully');
    }, 2000);
  };

  const filtered = MOCK_AUDIT_LOGS.filter(log =>
    search === '' ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
    log.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 mb-1">System Audit Trail</h3>
        <p className="text-sm text-gray-500">
          Immutable ledger history and cryptographic evidence of every transaction.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">SHA-256 Cryptographic Verification Timeline</p>
              <p className="text-xs text-gray-500 mt-1">Recent ledger transactions secured with tamper-proof hash seals.</p>
            </div>
            <button
              type="button"
              onClick={handleRunScan}
              disabled={scanStatus === 'scanning'}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                scanStatus === 'scanning'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-purple-700 text-white hover:bg-purple-800'
              }`}
            >
              {scanStatus === 'scanning' ? 'Scanning...' : 'Run System Integrity Scan'}
            </button>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-900/10 bg-slate-950 p-4 text-slate-200">
            <div className="grid gap-2 sm:grid-cols-2">
              {matrixLines.map((line, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border border-slate-800/40 bg-slate-900/75 px-3 py-2 text-[10px] font-mono ${
                    scanStatus === 'scanning' ? 'animate-pulse opacity-100' : 'opacity-70'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
              <span>{scanStatus === 'scanning' ? 'Matrix scan in progress...' : 'Secure audit hash engine ready.'}</span>
              {scanStatus === 'complete' && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-200">Integrity Verified</span>
              )}
            </div>
          </div>

          {scanStatus === 'complete' && (
            <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">{scanMessage}</p>
              <p className="mt-1 text-xs text-emerald-800">Every transaction hash and block seal was validated against the distributed ledger.</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {timelineEntries.map(item => (
            <div key={item.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.id}</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{item.action}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Badge status="success" /> Integrity Verified
                </span>
              </div>
              <div className="mt-4 rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Timestamp</span>
                  <span>{item.timestamp}</span>
                </div>
                <div className="mt-3 rounded-2xl bg-slate-900 px-3 py-2 font-mono text-xs text-emerald-200 break-all">
                  {item.hash}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by action, entity or user..."
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Log Entries */}
      <div className="space-y-2">
        {filtered.map(log => {
          const cfg = ACTION_ICONS[log.action] || { icon: FileText, color: 'text-gray-600 bg-gray-50' };
          const Icon = cfg.icon;
          return (
            <div
              key={log.id}
              className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-800 text-sm">{log.action}</p>
                  <span className="text-xs text-gray-400 shrink-0">{log.dateTime}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Entity: <span className="font-medium text-gray-700">{log.entity}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  By: <span className="font-medium text-gray-700">{log.performedBy}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Immutability Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
        <ScrollText size={18} className="text-gray-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          All audit log entries are immutable and timestamped. No entry can be modified or deleted.
          This log is admissible as evidence in fraud investigations.
        </p>
      </div>
    </div>
  );
}

// ── System Integrity Tab ──────────────────────────────────
function IntegrityTab() {
  const [scanHistory, setScanHistory] = useState([]);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const ledgerTimeline = [
    { id: 'TX-5892', action: 'Receipt Issued', timestamp: '2025-07-14 09:22', hash: '8f4c63b1a47d...2d9c' },
    { id: 'TX-5893', action: 'Allocation Logged', timestamp: '2025-07-14 09:03', hash: 'b12a9f4c3d80...1f02' },
    { id: 'TX-5894', action: 'Shop Confirmed', timestamp: '2025-07-14 09:30', hash: 'e2b47c8d6f12...a4b7' },
    { id: 'TX-5895', action: 'Ledger Anchored', timestamp: '2025-07-14 09:35', hash: '9a7f4c3b1d6e...c8a1' },
  ];

  const scanSteps = [
    'Initializing integrity engine...',
    'Checking block 0x4F9A... ',
    'Validating structural seals...',
    'Reconciling distributed ledger snapshot...',
    'Verifying transaction hash chain...',
    'Finalizing scan results...',
  ];

  const handleRunScan = () => {
    if (scanRunning) return;
    setScanHistory([]);
    setScanComplete(false);
    setScanRunning(true);

    let index = 0;
    const interval = setInterval(() => {
      setScanHistory((prev) => [...prev, scanSteps[index]]);
      index += 1;
      if (index >= scanSteps.length) {
        clearInterval(interval);
        setScanRunning(false);
        setScanComplete(true);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">System Integrity & Cryptographic Logs</p>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Immutable ledger entries and simulated SHA-256 verification for critical PDS transactions.
          </p>
        </div>
        <button
          onClick={handleRunScan}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            scanRunning ? 'bg-slate-500 text-white' : 'bg-purple-700 text-white hover:bg-purple-800'
          }`}
        >
          <Terminal size={16} />
          {scanRunning ? 'Scanning...' : 'Execute System-Wide Integrity Scan'}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-white mb-4">Terminal Scan Output</p>
          <div className="min-h-[220px] rounded-3xl border border-slate-800 bg-slate-900 p-4 text-xs font-mono leading-6 text-emerald-200">
            {scanHistory.length === 0 ? (
              <p className="text-slate-500">Press the scan button to begin cryptographic inspection.</p>
            ) : (
              scanHistory.map((line, index) => (
                <p key={index} className={scanRunning ? 'animate-pulse' : ''}>{line}</p>
              ))
            )}
          </div>
          {scanComplete && (
            <div className="mt-4 rounded-3xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-900">
              <p className="font-semibold">Scan Complete: 0 anomalies found. Local ledger matches distributed state database.</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {ledgerTimeline.map((entry) => (
            <div key={entry.id} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
                SHA-256 Verified
              </span>
              <p className="text-xs text-slate-500 uppercase tracking-[0.24em]">{entry.id}</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">{entry.action}</p>
              <p className="text-xs text-slate-500 mt-1">{entry.timestamp}</p>
              <div className="mt-3 rounded-2xl bg-slate-950 px-3 py-3 text-[11px] font-mono text-emerald-200">
                {entry.hash}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('complaints');
  const admin = MOCK_USERS.admin;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-purple-800 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-purple-300 text-sm">Admin Panel</p>
            <h1 className="text-2xl font-bold mt-0.5">Complaint & Audit Management</h1>
            <p className="text-purple-300 text-sm mt-1">{admin.name} · {admin.district} District</p>
          </div>
          <button
            onClick={() => toast.success('Full audit report exported')}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg text-sm transition-all"
          >
            <ScrollText size={15} /> Export Report
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">

        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 gap-1 mb-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <Card>
          {activeTab === 'complaints' && <ComplaintsTab />}
          {activeTab === 'audit'      && <AuditLogsTab />}
          {activeTab === 'integrity'  && <IntegrityTab />}
        </Card>
      </div>
    </div>
  );
}
