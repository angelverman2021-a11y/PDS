import { createSupportTicket, getNextSupportStatus } from '../../services/supportService';

export const SupportController = {
  create({ body }) {
    try {
      const ticket = createSupportTicket(body);
      return { status: 201, body: { ticket } };
    } catch (error) {
      return { status: 400, body: { error: error.message } };
    }
  },

  nextStatus({ params }) {
    const nextStatus = getNextSupportStatus(params.currentStatus);
    return nextStatus
      ? { status: 200, body: { nextStatus } }
      : { status: 422, body: { error: 'NO_NEXT_SUPPORT_STATUS' } };
  },
};
