export const DATA_SOURCE_TYPES = {
  MOCK: 'mock',
  SEED: 'seed',
  FUTURE_GOVERNMENT_INTEGRATION: 'future_government_integration',
};

export const DATA_SOURCE_REGISTRY = [
  {
    key: 'fps_registry_seed',
    type: DATA_SOURCE_TYPES.SEED,
    owner: 'platform_seed',
    description: 'Curated sample FPS records with realistic IDs, pincodes, coordinates, timings, and review signals.',
    productionPlan: 'Replace with state FPS registry or authorized public distribution shop master data.',
  },
  {
    key: 'epos_transaction_mock',
    type: DATA_SOURCE_TYPES.MOCK,
    owner: 'demo_fixture',
    description: 'Mock ePOS-like stock, receipt, and distribution events used only for hackathon demonstration.',
    productionPlan: 'Integrate with state ePOS transaction feed through approved API or scheduled secure data export.',
  },
  {
    key: 'complaint_seed',
    type: DATA_SOURCE_TYPES.SEED,
    owner: 'platform_seed',
    description: 'Seed complaint records with lifecycle status history and evidence counts.',
    productionPlan: 'Replace with complaint service database and district grievance integration where legally permitted.',
  },
];

export function getDataSourceDisclosure() {
  return {
    affiliation: 'Independent Transparency Platform. Not affiliated with any government agency.',
    currentMode: 'Prototype using mock and seed data.',
    sources: DATA_SOURCE_REGISTRY,
  };
}
