import { useState } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, XCircle, FileSearch, ArrowUpCircle } from 'lucide-react';
import { MOCK_COMPLAINTS, COMPLAINT_STATUS } from '../../constants';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const timelineSteps = [
  { key: COMPLAINT_STATUS.SUBMITTED,    label: 'Submitted',    icon: FileSearch   },
  { key: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under Review', icon: Clock        },
  { key: COMPLAINT_STATUS.ESCALATED,    label: 'Escalated',    icon: ArrowUpCircle },
  { key: COMPLAINT_STATUS.RESOLVED,     label: 'Resolved',     icon: CheckCircle  },
];

function getStepIndex(status) {
  const order = [
    COMPLAINT_STATUS.SUBMITTED,
    COMPLAINT_STATUS.UNDER_REVIEW,
    COMPLAINT_STATUS.ESCALATED,
    COMPLAINT_STATUS.RESOLVED,
  ];
  return order.indexOf(status);
}

export default function ComplaintTracker() {
  const [query, setQuery]       = useState('');
  const [complaint, setComplaint] = useState(null);
  const [notFound, setNotFound]   = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return toast.error('Enter a Complaint ID');
    const found = MOCK_COMPLAINTS.find(
      c => c.complaintNo.toLowerCase() === query.trim().toLowerCase() ||
           c.id.toLowerCase() === query.trim().toLowerCase()
    );
    if (found) {
      setComplaint(found);
      setNotFound(false);
      toast.success('Complaint found!');
    } else {
      setComplaint(null);
      setNotFound(true);
      toast.error('Complaint not found');
    }
  };

  const activeStep = complaint ? getStepIndex(complaint.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-green-200 text-sm mb-1">Citizen Portal</p>
          <h1 className="text-2xl font-bold">Complaint Tracker</h1>
          <p className="text-green-200 text-sm mt-1">Track the status of your filed complaints</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-5">

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setNotFound(false); }}
                placeholder="Enter Complaint ID (e.g. CMP-2025-00847)"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm"
            >
              Track
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">Try: CMP-2025-00847 · CMP-2025-00831 · CMP-2025-00798</p>
        </div>

        {/* Not Found */}
        {notFound && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <XCircle size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-bold text-gray-700">Complaint Not Found</p>
            <p className="text-gray-400 text-sm mt-1">
              No complaint found for <strong>"{query}"</strong>. Please check the ID and try again.
            </p>
          </div>
        )}

        {/* Result */}
        {complaint && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Complaint Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900">{complaint.complaintNo}</p>
                <p className="text-sm text-gray-500 mt-0.5">{complaint.shopName}</p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{complaint.category.replace('_', ' ')}</p>
              </div>
              <Badge status={complaint.status} size="lg" />
            </div>

            {/* Description */}
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
            </div>

            {/* Timeline */}
            <div className="px-5 py-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4">Progress</p>
              <div className="space-y-0">
                {timelineSteps.map(({ key, label, icon: Icon }, idx) => {
                  const done    = idx <= activeStep;
                  const current = idx === activeStep;
                  const isLast  = idx === timelineSteps.length - 1;
                  return (
                    <div key={key} className="flex gap-4">
                      {/* Dot + Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          done
                            ? current
                              ? 'bg-green-700 border-green-700 text-white shadow-md'
                              : 'bg-green-100 border-green-300 text-green-600'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        }`}>
                          <Icon size={16} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 mt-1 ${done && idx < activeStep ? 'bg-green-300' : 'bg-gray-200'}`} />
                        )}
                      </div>

                      {/* Label */}
                      <div className="pb-8 last:pb-0 pt-1.5">
                        <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
                        {current && complaint.assignedTo && (
                          <p className="text-xs text-gray-500 mt-0.5">Assigned to: {complaint.assignedTo}</p>
                        )}
                        {key === COMPLAINT_STATUS.SUBMITTED && (
                          <p className="text-xs text-gray-400 mt-0.5">{complaint.submittedAt}</p>
                        )}
                        {key === COMPLAINT_STATUS.RESOLVED && complaint.resolvedAt && (
                          <p className="text-xs text-gray-400 mt-0.5">{complaint.resolvedAt}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resolution Note */}
            {complaint.resolutionNote && (
              <div className="mx-5 mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-800 mb-0.5">Resolution Note</p>
                  <p className="text-sm text-green-700">{complaint.resolutionNote}</p>
                </div>
              </div>
            )}

            {complaint.status === COMPLAINT_STATUS.ESCALATED && (
              <div className="mx-5 mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  This complaint has been escalated to the District Officer for urgent review.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
