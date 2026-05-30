import { useState } from 'react';
import {
  ClipboardList, ScrollText, Filter, Search,
  CheckCircle, AlertTriangle, ChevronDown, User,
  Store, Calendar, FileText, ShieldAlert, Clock,
} from 'lucide-react';
import {
  MOCK_COMPLAINTS, MOCK_AUDIT_LOGS, MOCK_USERS,
  COMPLAINT_CATEGORIES, COMPLAINT_STATUS,
} from '../../constants';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'complaints', label: 'Complaint Queue', icon: ClipboardList },
  { id: 'audit',      label: 'Audit Logs',      icon: ScrollText },
];

const STATUS_FILTERS = [
  { key: 'all',          label: 'All' },
  { key: 'submitted',    label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'resolved',     label: 'Resolved' },
  { key: 'escalated',    label: 'Escalated' },
];

const NEXT_STATUS = {
  submitted:    ['under_review', 'escalated'],
  under_review: ['resolved', 'escalated'],
  escalated:    ['resolved'],
  resolved:     [],
  closed:       [],
};

const STATUS_LABELS = {
  under_review: 'Mark Under Review',
  resolved:     'Mark Resolved',
  escalated:    'Escalate',
};

// ── Complaint Row ─────────────────────────────────────────
function ComplaintRow({ complaint, onStatusChange }) {
  const [expanded, setExpanded]   = useState(false);
  const [dropdown, setDropdown]   = useState(false);
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
      setDropdown(false);
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
            complaint.status === 'escalated'    ? 'bg-red-500' :
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
                    s === 'escalated'    ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {saving ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : s === 'resolved' ? (
                    <CheckCircle size={13} />
                  ) : s === 'escalated' ? (
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
    resolved:     complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length,
    escalated:    complaints.filter(c => c.status === COMPLAINT_STATUS.ESCALATED).length,
  };

  return (
    <div className="space-y-4">

      {/* Summary Chips */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { key: 'submitted',    label: 'New',          color: 'blue'  },
          { key: 'under_review', label: 'In Review',    color: 'amber' },
          { key: 'escalated',    label: 'Escalated',    color: 'red'   },
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

  const ACTION_ICONS = {
    'Stock Updated':        { icon: Store,         color: 'text-blue-600 bg-blue-50'   },
    'Receipt Generated':    { icon: FileText,       color: 'text-green-600 bg-green-50' },
    'Complaint Resolved':   { icon: CheckCircle,    color: 'text-green-600 bg-green-50' },
    'Complaint Escalated':  { icon: ShieldAlert,    color: 'text-red-600 bg-red-50'     },
    'Citizen Verification': { icon: User,           color: 'text-purple-600 bg-purple-50'},
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
          Immutable log of all actions performed across the platform.
        </p>
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
        </Card>
      </div>
    </div>
  );
}
