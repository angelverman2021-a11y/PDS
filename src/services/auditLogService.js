export const AUDIT_EVENTS = {
  LOGIN: 'login',
  VERIFICATION: 'verification',
  ALLOCATION_VIEWED: 'allocation_viewed',
  RECEIPT_GENERATED: 'receipt_generated',
  COMPLAINT_ACTION: 'complaint_action',
};

export function createAuditLog({ eventType, actorId, actorRole, entityType, entityId, action, metadata = {} }) {
  if (!Object.values(AUDIT_EVENTS).includes(eventType)) {
    throw new Error('Unsupported audit event type');
  }

  return {
    id: `audit_${Date.now()}`,
    eventType,
    actorId,
    actorRole,
    entityType,
    entityId,
    action,
    metadata,
    ipHash: metadata.ipHash ?? 'sha256:demo-redacted',
    createdAt: new Date().toISOString(),
    immutable: true,
  };
}
