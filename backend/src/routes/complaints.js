import { Router } from 'express';
import { BENEFICIARY_REGISTRY } from '../data/registry.js';

const router = Router();

const COMPLAINT_STATUS = {
  SUBMITTED:    'submitted',
  UNDER_REVIEW: 'under_review',
  ASSIGNED:     'assigned',
  RESOLVED:     'resolved',
  CLOSED:       'closed',
};

const STATUS_FLOW = [
  COMPLAINT_STATUS.SUBMITTED,
  COMPLAINT_STATUS.UNDER_REVIEW,
  COMPLAINT_STATUS.ASSIGNED,
  COMPLAINT_STATUS.RESOLVED,
  COMPLAINT_STATUS.CLOSED,
];

// In-memory store — Phase 6 replaces with DB
const complaints = [
  {
    id: 'cmp_001',
    complaintNo: 'CMP-PUN-2025-00847',
    shopId: 'shop_002',
    shopName: 'Shivaji Ration Centre',
    category: 'stock_diversion',
    description: 'Dealer refused to give rice saying stock is empty but shop was open and selling to others.',
    status: COMPLAINT_STATUS.ASSIGNED,
    submittedAt: '2025-07-12',
    expectedResolution: '2025-07-19',
    resolvedAt: null,
    assignedTo: 'Field Officer Desai',
    currentOwner: 'Field inspection team',
    evidenceCount: 2,
    resolutionNote: null,
    timeline: [
      { status: COMPLAINT_STATUS.SUBMITTED,    label: 'Complaint submitted', at: '2025-07-12 10:12', note: 'Citizen submitted denial and stock diversion complaint.' },
      { status: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under review',        at: '2025-07-12 14:40', note: 'Duplicate reports checked.' },
      { status: COMPLAINT_STATUS.ASSIGNED,     label: 'Assigned',            at: '2025-07-13 09:05', note: 'Assigned to Field Officer Desai.' },
    ],
  },
  {
    id: 'cmp_002',
    complaintNo: 'CMP-PUN-2025-00831',
    shopId: 'shop_003',
    shopName: 'Mahatma Gandhi FPS',
    category: 'overcharging',
    description: 'Charged ₹120 extra for wheat. Official price is ₹2/kg but dealer charged ₹14/kg.',
    status: COMPLAINT_STATUS.CLOSED,
    submittedAt: '2025-07-01',
    expectedResolution: '2025-07-08',
    resolvedAt: '2025-07-09',
    assignedTo: 'Field Officer Kulkarni',
    currentOwner: 'Closed after beneficiary confirmation',
    evidenceCount: 1,
    resolutionNote: 'Dealer warned and fined ₹5000. Beneficiary refunded.',
    timeline: [
      { status: COMPLAINT_STATUS.SUBMITTED,    label: 'Complaint submitted', at: '2025-07-01 16:20', note: 'Citizen reported overcharging with receipt photo.' },
      { status: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under review',        at: '2025-07-02 11:15', note: 'Receipt amount compared with entitlement.' },
      { status: COMPLAINT_STATUS.ASSIGNED,     label: 'Assigned',            at: '2025-07-03 09:30', note: 'Field Officer Kulkarni assigned.' },
      { status: COMPLAINT_STATUS.RESOLVED,     label: 'Resolved',            at: '2025-07-09 15:45', note: 'Refund processed and penalty recorded.' },
      { status: COMPLAINT_STATUS.CLOSED,       label: 'Closed',              at: '2025-07-11 12:10', note: 'Citizen confirmed refund received.' },
    ],
  },
  {
    id: 'cmp_003',
    complaintNo: 'CMP-PUN-2025-00798',
    shopId: 'shop_003',
    shopName: 'Mahatma Gandhi FPS',
    category: 'denial',
    description: 'Shop was closed for 3 consecutive distribution days without notice.',
    status: COMPLAINT_STATUS.UNDER_REVIEW,
    submittedAt: '2025-06-28',
    expectedResolution: '2025-07-05',
    resolvedAt: null,
    assignedTo: null,
    currentOwner: 'Complaint review desk',
    evidenceCount: 3,
    resolutionNote: null,
    timeline: [
      { status: COMPLAINT_STATUS.SUBMITTED,    label: 'Complaint submitted', at: '2025-06-28 08:50', note: 'Citizen uploaded shutter photos.' },
      { status: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under review',        at: '2025-06-28 13:25', note: 'Shop timing and distribution calendar being checked.' },
    ],
  },
];

let sequence = 848;

function generateComplaintNo(districtCode = 'PUN') {
  const year = new Date().getFullYear();
  return `CMP-${districtCode}-${year}-${String(sequence++).padStart(5, '0')}`;
}

// ── POST /api/v1/complaints ───────────────────────────────
router.post('/', (req, res) => {
  const { shopId, shopName, category, description } = req.body;
  if (!shopId || !shopName) return res.status(400).json({ ok: false, error: 'shopId and shopName are required' });
  if (!category)            return res.status(400).json({ ok: false, error: 'category is required' });
  if (!description || description.trim().length < 20) {
    return res.status(400).json({ ok: false, error: 'description must be at least 20 characters' });
  }

  const now = new Date();
  const complaintNo = generateComplaintNo();
  const complaint = {
    id: `cmp_${complaintNo.toLowerCase().replaceAll('-', '_')}`,
    complaintNo,
    shopId,
    shopName,
    category,
    description: description.trim(),
    status: COMPLAINT_STATUS.SUBMITTED,
    submittedAt: now.toISOString().slice(0, 10),
    expectedResolution: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    resolvedAt: null,
    assignedTo: null,
    currentOwner: 'Complaint intake desk',
    evidenceCount: 0,
    resolutionNote: null,
    timeline: [{
      status: COMPLAINT_STATUS.SUBMITTED,
      label: 'Complaint submitted',
      at: now.toISOString(),
      note: 'Complaint received and tracking ID generated.',
    }],
  };

  complaints.push(complaint);
  res.status(201).json({ ok: true, complaint });
});

// ── GET /api/v1/complaints/:id ────────────────────────────
router.get('/:id', (req, res) => {
  const found = complaints.find(
    c => c.complaintNo.toLowerCase() === req.params.id.toLowerCase() ||
         c.id.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!found) return res.status(404).json({ ok: false, error: 'COMPLAINT_NOT_FOUND' });
  res.json({ ok: true, complaint: found });
});

// ── GET /api/v1/complaints/:id/timeline ──────────────────
router.get('/:id/timeline', (req, res) => {
  const found = complaints.find(
    c => c.complaintNo.toLowerCase() === req.params.id.toLowerCase() ||
         c.id.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!found) return res.status(404).json({ ok: false, error: 'COMPLAINT_NOT_FOUND' });

  const timeline = STATUS_FLOW.map(status => {
    const entry = found.timeline?.find(t => t.status === status);
    return { status, completed: Boolean(entry), label: entry?.label ?? status.replace('_', ' '), at: entry?.at ?? null, note: entry?.note ?? null };
  });
  res.json({ ok: true, timeline });
});

// ── GET /api/v1/complaints ────────────────────────────────
// Admin: get all complaints (protected by role in Phase 6)
router.get('/', (req, res) => {
  res.json({ ok: true, complaints });
});

// ── PATCH /api/v1/complaints/:id/status ──────────────────
router.patch('/:id/status', (req, res) => {
  const { nextStatus, note } = req.body;
  const found = complaints.find(c => c.id === req.params.id || c.complaintNo === req.params.id);
  if (!found) return res.status(404).json({ ok: false, error: 'COMPLAINT_NOT_FOUND' });

  const currentIndex = STATUS_FLOW.indexOf(found.status);
  const nextIndex    = STATUS_FLOW.indexOf(nextStatus);
  if (nextIndex !== currentIndex + 1) {
    return res.status(422).json({ ok: false, error: 'INVALID_STATUS_TRANSITION' });
  }

  found.status = nextStatus;
  if (note) found.resolutionNote = note;
  if (nextStatus === COMPLAINT_STATUS.RESOLVED) found.resolvedAt = new Date().toISOString().slice(0, 10);

  found.timeline.push({
    status: nextStatus,
    label: nextStatus.replace('_', ' '),
    at: new Date().toISOString(),
    note: note || null,
  });

  res.json({ ok: true, complaint: found });
});

export default router;
