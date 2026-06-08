const sampleAnalysis = {
  parcelId: 'GRIP-PUN-042',
  locationName: 'Pune District, Maharashtra',
  bestUse: 'Utility Scale Solar Farm',
  confidence: 91,
  estimatedRoiYears: 5.4,
  recommendation: 'Proceed to detailed feasibility study',
  summary: 'The land parcel is best suited for a utility scale solar farm because it combines strong solar potential, low environmental risk, and practical grid access.',
  reasons: [
    'Excellent solar irradiance',
    'Low flood risk',
    'Near transmission infrastructure',
    'Flat terrain',
  ],
  scores: {
    suitability: 92,
    environmentalRisk: 18,
    infrastructureAccess: 86,
    solar: 92,
    wind: 75,
    groundwater: 80,
  },
  constraints: [
    'Confirm land ownership and zoning clearance',
    'Run seasonal drainage survey before final design',
    'Validate transmission capacity with local utility',
  ],
  alternatives: [
    { use: 'Agri-solar mixed use', confidence: 78, roiYears: 6.8 },
    { use: 'Wind-assisted hybrid plant', confidence: 72, roiYears: 7.2 },
    { use: 'Groundwater recharge and farm support zone', confidence: 64, roiYears: 9.1 },
  ],
  indicators: [
    { label: 'Solar Irradiance', value: 92, status: 'Excellent' },
    { label: 'Flood Risk', value: 18, status: 'Low risk' },
    { label: 'Grid Proximity', value: 88, status: 'Strong' },
    { label: 'Terrain Flatness', value: 90, status: 'Strong' },
    { label: 'Road Access', value: 82, status: 'Good' },
    { label: 'Water Sensitivity', value: 34, status: 'Manageable' },
  ],
};

export async function getLandAnalysis() {
  const endpoint = import.meta.env.VITE_LAND_ANALYSIS_API_URL;
  if (!endpoint) return sampleAnalysis;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Land analysis API request failed');
  }

  return response.json();
}
