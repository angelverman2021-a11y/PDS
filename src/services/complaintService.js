import { COMPLAINT_STATUS, MOCK_COMPLAINTS } from '../constants';

const STATUS_FLOW = [
  COMPLAINT_STATUS.SUBMITTED,
  COMPLAINT_STATUS.UNDER_REVIEW,
  COMPLAINT_STATUS.ASSIGNED,
  COMPLAINT_STATUS.RESOLVED,
  COMPLAINT_STATUS.CLOSED,
];

export function generateComplaintId({ districtCode = 'PUN', date = new Date(), sequence = 1 } = {}) {
  const year = date.getFullYear();
  const paddedSequence = String(sequence).padStart(5, '0');
  return `CMP-${districtCode}-${year}-${paddedSequence}`;
}

export function getComplaintById(complaintId) {
  return MOCK_COMPLAINTS.find(item => item.complaintNo === complaintId || item.id === complaintId) ?? null;
}

export function getComplaintTimeline(complaintId) {
  const complaint = getComplaintById(complaintId);
  if (!complaint) return null;

  return STATUS_FLOW.map(status => {
    const entry = complaint.timeline?.find(item => item.status === status);
    return {
      status,
      completed: Boolean(entry),
      label: entry?.label ?? status.replace('_', ' '),
      at: entry?.at ?? null,
      note: entry?.note ?? null,
    };
  });
}

export function canTransitionComplaint(currentStatus, nextStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const nextIndex = STATUS_FLOW.indexOf(nextStatus);
  return currentIndex >= 0 && nextIndex === currentIndex + 1;
}

export function createComplaintRecord({ shopId, shopName, category, description, evidence = [], districtCode = 'PUN', sequence }) {
  if (!shopId || !shopName) throw new Error('Shop is required');
  if (!category) throw new Error('Complaint category is required');
  if (!description || description.trim().length < 20) throw new Error('Description must be at least 20 characters');

  const now = new Date();
  const complaintNo = generateComplaintId({ districtCode, date: now, sequence });

  return {
    id: `cmp_${complaintNo.toLowerCase().replaceAll('-', '_')}`,
    complaintNo,
    shopId,
    shopName,
    category,
    description: description.trim(),
    status: COMPLAINT_STATUS.SUBMITTED,
    submittedAt: now.toISOString(),
    expectedResolution: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    assignedTo: null,
    currentOwner: 'Complaint intake desk',
    evidenceCount: evidence.length,
    timeline: [
      {
        status: COMPLAINT_STATUS.SUBMITTED,
        label: 'Complaint submitted',
        at: now.toISOString(),
        note: 'Complaint received and tracking ID generated.',
      },
    ],
  };
}
