const SUPPORT_FLOW = ['opened', 'triaged', 'assigned', 'escalated', 'resolved', 'closed'];

export function generateSupportId({ channel = 'WEB', date = new Date(), sequence = 1 } = {}) {
  return `SUP-${channel}-${date.getFullYear()}-${String(sequence).padStart(5, '0')}`;
}

export function createSupportTicket({ issueType, description, userPhone, channel = 'WEB', sequence }) {
  if (!issueType) throw new Error('Support issue type is required');
  if (!description || description.trim().length < 10) throw new Error('Support description must be at least 10 characters');

  const now = new Date().toISOString();
  return {
    id: generateSupportId({ channel, sequence }),
    issueType,
    description: description.trim(),
    userPhone: userPhone ? `***${String(userPhone).slice(-4)}` : null,
    status: SUPPORT_FLOW[0],
    priority: issueType === 'biometric_failure' || issueType === 'ration_denied' ? 'high' : 'normal',
    escalationLevel: 0,
    timeline: [
      { status: 'opened', at: now, note: 'Support ticket created.' },
    ],
    createdAt: now,
  };
}

export function getNextSupportStatus(currentStatus) {
  const index = SUPPORT_FLOW.indexOf(currentStatus);
  return SUPPORT_FLOW[index + 1] ?? null;
}
