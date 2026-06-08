import {
  createComplaintRecord,
  getComplaintById,
  getComplaintTimeline,
  canTransitionComplaint,
} from '../../services/complaintService';

export const ComplaintController = {
  create({ body }) {
    try {
      const complaint = createComplaintRecord(body);
      return { status: 201, body: { complaint } };
    } catch (error) {
      return { status: 400, body: { error: error.message } };
    }
  },

  track({ params }) {
    const complaint = getComplaintById(params.complaintId);
    return complaint
      ? { status: 200, body: { complaint } }
      : { status: 404, body: { error: 'COMPLAINT_NOT_FOUND' } };
  },

  timeline({ params }) {
    const timeline = getComplaintTimeline(params.complaintId);
    return timeline
      ? { status: 200, body: { timeline } }
      : { status: 404, body: { error: 'COMPLAINT_NOT_FOUND' } };
  },

  transition({ body }) {
    const allowed = canTransitionComplaint(body.currentStatus, body.nextStatus);
    return allowed
      ? { status: 200, body: { accepted: true, nextStatus: body.nextStatus } }
      : { status: 422, body: { error: 'INVALID_STATUS_TRANSITION' } };
  },
};
