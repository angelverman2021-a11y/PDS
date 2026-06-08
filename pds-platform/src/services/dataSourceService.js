export const DATA_SOURCE_TYPES = {
  MOCK: 'mock',
  SEED: 'seed',
  FUTURE_GOVERNMENT_INTEGRATION: 'future_government_integration',
};

export const DATA_SOURCE_REGISTRY = [
  {
    key: 'shop_directory',
    name: 'Shop Directory',
    sourceName: 'Google Places API / OpenStreetMap / Authorized FPS Dataset',
    type: DATA_SOURCE_TYPES.FUTURE_GOVERNMENT_INTEGRATION,
    owner: 'external_provider_required',
    lastUpdated: 'Not connected',
    verificationStatus: 'Provider not configured',
    description: 'Real shop records must come from external places APIs or authorized FPS datasets. The platform must not invent shops.',
    productionPlan: 'Configure server-side Google Places, OpenStreetMap/Nominatim, or authorized FPS dataset ingestion.',
  },
  {
    key: 'beneficiary_records',
    name: 'Beneficiary Records',
    type: DATA_SOURCE_TYPES.MOCK,
    sourceName: 'Demo Dataset',
    owner: 'demo_fixture',
    lastUpdated: 'Demo only',
    verificationStatus: 'Demo mode only',
    description: 'Seed beneficiary records exist only for demo authentication and sample allocations.',
    productionPlan: 'Replace with a secure backend identity store and consented integrations.',
  },
  {
    key: 'complaint_data',
    name: 'Complaint Data',
    type: 'user_generated',
    sourceName: 'User Generated',
    owner: 'platform_users',
    lastUpdated: 'Real-time when submitted',
    verificationStatus: 'Evidence and reviewer workflow',
    description: 'Complaints are created by users and tracked through Submitted, Under Review, Assigned, Resolved, Closed.',
    productionPlan: 'Persist in complaint database with append-only timeline and audit logs.',
  },
  {
    key: 'transparency_reports',
    name: 'Transparency Reports',
    type: 'platform_records',
    sourceName: 'Platform Records',
    owner: 'platform',
    lastUpdated: 'Generated from audit records',
    verificationStatus: 'Derived from immutable audit events',
    description: 'Reports should be computed from platform audit logs, complaint status history, and verified receipt events.',
    productionPlan: 'Generate from production audit log warehouse.',
  },
];

export function getDataSourceDisclosure() {
  return {
    affiliation: 'Independent Transparency Platform. Not affiliated with any government agency.',
    currentMode: 'Prototype using mock and seed data.',
    sources: DATA_SOURCE_REGISTRY,
  };
}
