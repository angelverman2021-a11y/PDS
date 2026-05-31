// ─── Roles ───────────────────────────────────────────────
export const ROLES = {
  CITIZEN: 'citizen',
  DEALER: 'dealer',
  ADMIN: 'admin',
};

// ─── Stock Statuses ──────────────────────────────────────
export const STOCK_STATUS = {
  AVAILABLE: 'available',
  LOW: 'low',
  OUT_OF_STOCK: 'out_of_stock',
};

// ─── Allocation Statuses ─────────────────────────────────
export const ALLOCATION_STATUS = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  PARTIAL: 'partial',
  NOT_COLLECTED: 'not_collected',
};

// ─── Complaint Categories ────────────────────────────────
export const COMPLAINT_CATEGORIES = [
  { value: 'stock_diversion', label: 'Stock Diversion' },
  { value: 'overcharging', label: 'Overcharging' },
  { value: 'denial', label: 'Denial of Service' },
  { value: 'fake_entry', label: 'Fake Entry' },
  { value: 'other', label: 'Other' },
];

// ─── Complaint Statuses ──────────────────────────────────
export const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  ASSIGNED: 'assigned',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// ─── Verification Responses ──────────────────────────────
export const VERIFICATION_RESPONSE = {
  RECEIVED: 'received',
  NOT_RECEIVED: 'not_received',
  PARTIAL: 'partial',
};

// ─── Registered Beneficiary Registry ────────────────────
// Demo registry. Production must replace this with authenticated backend records.
export const BENEFICIARY_REGISTRY = {
  'MH-2024-00123': {
    id: 'citizen_001',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    maskedPhone: '98765*****',
    rationCardNo: 'MH-2024-00123',
    role: ROLES.CITIZEN,
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    familySize: 4,
    district: 'Pune',
    taluka: 'Haveli',
    category: 'PHH',           // Priority Household
    aadhaarLinked: true,
    bankLinked: true,
    registeredOn: '2024-01-15',
    verificationStatus: 'verified',
  },
  'MH-2024-00124': {
    id: 'citizen_002',
    name: 'Sunita Devi',
    phone: '9823001122',
    maskedPhone: '98230*****',
    rationCardNo: 'MH-2024-00124',
    role: ROLES.CITIZEN,
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    familySize: 3,
    district: 'Pune',
    taluka: 'Haveli',
    category: 'AAY',           // Antyodaya Anna Yojana
    aadhaarLinked: true,
    bankLinked: false,
    registeredOn: '2024-02-20',
    verificationStatus: 'verified',
  },
  'MH-2024-00125': {
    id: 'citizen_003',
    name: 'Prakash Mane',
    phone: '9765432100',
    maskedPhone: '97654*****',
    rationCardNo: 'MH-2024-00125',
    role: ROLES.CITIZEN,
    shopId: 'shop_002',
    shopName: 'Shivaji Ration Centre',
    familySize: 6,
    district: 'Pune',
    taluka: 'Haveli',
    category: 'PHH',
    aadhaarLinked: true,
    bankLinked: true,
    registeredOn: '2024-03-10',
    verificationStatus: 'verified',
  },
  'MH-2024-00126': {
    id: 'citizen_004',
    name: 'Anita Bhosale',
    phone: '9812345678',
    maskedPhone: '98123*****',
    rationCardNo: 'MH-2024-00126',
    role: ROLES.CITIZEN,
    shopId: 'shop_002',
    shopName: 'Shivaji Ration Centre',
    familySize: 2,
    district: 'Pune',
    taluka: 'Mulshi',
    category: 'NPHH',          // Non-Priority Household
    aadhaarLinked: false,
    bankLinked: true,
    registeredOn: '2024-04-05',
    verificationStatus: 'pending_aadhaar',
  },
};

// ─── Mock Users ──────────────────────────────────────────
export const MOCK_USERS = {
  citizen: BENEFICIARY_REGISTRY['MH-2024-00123'],
  dealer: {
    id: 'dealer_001',
    username: 'suresh.patil',
    name: 'Suresh Patil',
    phone: '9823456789',
    role: ROLES.DEALER,
    shopId: 'shop_001',
    licenseNo: 'FPS-MH-4521',
  },
  admin: {
    id: 'admin_001',
    username: 'sharma.district',
    name: 'District Officer Sharma',
    phone: '9811223344',
    role: ROLES.ADMIN,
    districtId: 'dist_pune',
    district: 'Pune',
  },
};

export const USER_CREDENTIALS = {
  dealer: {
    username: 'suresh.patil',
    password: 'FPS4521!'
  },
  admin: {
    username: 'sharma.district',
    password: 'Pune2025@'
  },
};

// ─── Mock Shops ──────────────────────────────────────────
export const MOCK_SHOPS = [
  {
    id: 'shop_001',
    name: 'Ram Ration Store',
    dealerName: 'S*** P***',
    address: 'Ward 4, Kasba Peth, Pune - 411011',
    pincode: '411011',
    district: 'Pune',
    licenseNo: 'FPS-MH-4521',
    fpsId: 'FPS-MH-PUN-004521',
    totalBeneficiaries: 312,
    stockStatus: STOCK_STATUS.AVAILABLE,
    lastDelivery: '2025-07-10',
    complaintCount: 2,
    distanceKm: 0.8,
    rating: 4.4,
    reviewCount: 128,
    isOpen: true,
    timings: '8:00 AM - 1:00 PM, 4:00 PM - 7:00 PM',
    dataSource: 'State FPS registry sample + citizen verification signals',
    latitude: 18.5204,
    longitude: 73.8567,
  },
  {
    id: 'shop_002',
    name: 'Shivaji Ration Centre',
    dealerName: 'M*** J***',
    address: 'Plot 12, Hadapsar, Pune - 411028',
    pincode: '411028',
    district: 'Pune',
    licenseNo: 'FPS-MH-3312',
    fpsId: 'FPS-MH-PUN-003312',
    totalBeneficiaries: 278,
    stockStatus: STOCK_STATUS.LOW,
    lastDelivery: '2025-07-08',
    complaintCount: 7,
    distanceKm: 2.4,
    rating: 3.8,
    reviewCount: 91,
    isOpen: true,
    timings: '9:00 AM - 2:00 PM',
    dataSource: 'State FPS registry sample + ePOS stock sync',
    latitude: 18.5089,
    longitude: 73.9259,
  },
  {
    id: 'shop_003',
    name: 'Mahatma Gandhi FPS',
    dealerName: 'P*** D***',
    address: 'Sector 7, Pimpri, Pune - 411017',
    pincode: '411017',
    district: 'Pune',
    licenseNo: 'FPS-MH-2201',
    fpsId: 'FPS-MH-PUN-002201',
    totalBeneficiaries: 445,
    stockStatus: STOCK_STATUS.OUT_OF_STOCK,
    lastDelivery: '2025-06-28',
    complaintCount: 14,
    distanceKm: 5.7,
    rating: 2.9,
    reviewCount: 204,
    isOpen: false,
    timings: 'Temporarily closed for inspection',
    dataSource: 'State FPS registry sample + complaint risk signal',
    latitude: 18.6298,
    longitude: 73.7997,
  },
  {
    id: 'shop_004',
    name: 'Bharat Ration Depot',
    dealerName: 'A*** S***',
    address: 'Lane 3, Kothrud, Pune - 411038',
    pincode: '411038',
    district: 'Pune',
    licenseNo: 'FPS-MH-5567',
    fpsId: 'FPS-MH-PUN-005567',
    totalBeneficiaries: 198,
    stockStatus: STOCK_STATUS.AVAILABLE,
    lastDelivery: '2025-07-12',
    complaintCount: 0,
    distanceKm: 1.2,
    rating: 4.7,
    reviewCount: 73,
    isOpen: true,
    timings: '8:30 AM - 12:30 PM, 5:00 PM - 7:30 PM',
    dataSource: 'State FPS registry sample + citizen reviews',
    latitude: 18.5074,
    longitude: 73.8077,
  },
  {
    id: 'shop_005',
    name: 'Jai Hind Ration Shop',
    dealerName: 'V*** K***',
    address: 'Main Road, Wanowrie, Pune - 411040',
    pincode: '411040',
    district: 'Pune',
    licenseNo: 'FPS-MH-6634',
    fpsId: 'FPS-MH-PUN-006634',
    totalBeneficiaries: 367,
    stockStatus: STOCK_STATUS.LOW,
    lastDelivery: '2025-07-05',
    complaintCount: 5,
    distanceKm: 3.1,
    rating: 4.0,
    reviewCount: 119,
    isOpen: false,
    timings: 'Closed today; opens tomorrow 8:00 AM',
    dataSource: 'State FPS registry sample + shop timing update',
    latitude: 18.4855,
    longitude: 73.8934,
  },
  {
    id: 'shop_006',
    name: 'Sai Krupa FPS',
    dealerName: 'R*** M***',
    address: 'Block B, Bibwewadi, Pune - 411037',
    pincode: '411037',
    district: 'Pune',
    licenseNo: 'FPS-MH-7712',
    fpsId: 'FPS-MH-PUN-007712',
    totalBeneficiaries: 289,
    stockStatus: STOCK_STATUS.AVAILABLE,
    lastDelivery: '2025-07-11',
    complaintCount: 1,
    distanceKm: 1.9,
    rating: 4.5,
    reviewCount: 86,
    isOpen: true,
    timings: '8:00 AM - 2:00 PM',
    dataSource: 'State FPS registry sample + ePOS stock sync',
    latitude: 18.4731,
    longitude: 73.8553,
  },
];

// ─── Ration Product Catalog ──────────────────────────────
// Each product has a unit, price, and per-person/per-household rate.
// This drives allocation dynamically — add any new item here.
export const RATION_PRODUCTS = [
  {
    id: 'wheat',
    name: 'Wheat',
    unit: 'kg',
    pricePerUnit: 2,
    icon: '🌾',
    allocationType: 'per_person',   // multiplied by family size
    color: 'amber',
  },
  {
    id: 'rice',
    name: 'Rice',
    unit: 'kg',
    pricePerUnit: 3,
    icon: '🍚',
    allocationType: 'per_person',
    color: 'blue',
  },
  {
    id: 'sugar',
    name: 'Sugar',
    unit: 'kg',
    pricePerUnit: 13.5,
    icon: '🧂',
    allocationType: 'per_household', // fixed per household
    color: 'pink',
  },
  {
    id: 'kerosene',
    name: 'Kerosene',
    unit: 'ltr',
    pricePerUnit: 15,
    icon: '🛢️',
    allocationType: 'per_household',
    color: 'gray',
  },
  {
    id: 'dal',
    name: 'Chana Dal',
    unit: 'kg',
    pricePerUnit: 20,
    icon: '🫘',
    allocationType: 'per_household',
    color: 'yellow',
  },
  {
    id: 'salt',
    name: 'Iodised Salt',
    unit: 'kg',
    pricePerUnit: 2,
    icon: '🧂',
    allocationType: 'per_household',
    color: 'gray',
  },
];

// ─── Category Entitlement Rules ───────────────────────────
// Defines how much of each product each category gets.
// per_person: qty × familySize | per_household: fixed qty
// Follows NFSA 2013 guidelines.
export const CATEGORY_ENTITLEMENTS = {
  PHH: {
    // Priority Household — 5kg/person/month
    label: 'Priority Household (PHH)',
    wheat:    { qty: 3,    type: 'per_person'    },
    rice:     { qty: 2,    type: 'per_person'    },
    sugar:    { qty: 1,    type: 'per_household' },
    kerosene: { qty: 2,    type: 'per_household' },
    dal:      { qty: 1,    type: 'per_household' },
    salt:     { qty: 1,    type: 'per_household' },
  },
  AAY: {
    // Antyodaya Anna Yojana — 35kg/household/month
    label: 'Antyodaya Anna Yojana (AAY)',
    wheat:    { qty: 20,   type: 'per_household' },
    rice:     { qty: 15,   type: 'per_household' },
    sugar:    { qty: 2,    type: 'per_household' },
    kerosene: { qty: 3,    type: 'per_household' },
    dal:      { qty: 2,    type: 'per_household' },
    salt:     { qty: 1,    type: 'per_household' },
  },
  NPHH: {
    // Non-Priority Household
    label: 'Non-Priority Household (NPHH)',
    wheat:    { qty: 2,    type: 'per_person'    },
    rice:     { qty: 1,    type: 'per_person'    },
    sugar:    { qty: 0.5,  type: 'per_household' },
    kerosene: { qty: 1,    type: 'per_household' },
    dal:      { qty: 0,    type: 'per_household' },
    salt:     { qty: 1,    type: 'per_household' },
  },
};

// ─── Allocation Calculator ────────────────────────────────
// Pure function — computes entitlement for any beneficiary.
// Returns array of { product, entitledQty, unit, price }
export function computeAllocation(category, familySize) {
  const rules = CATEGORY_ENTITLEMENTS[category];
  if (!rules) return [];
  return RATION_PRODUCTS
    .map(product => {
      const rule = rules[product.id];
      if (!rule) return null;
      const qty = rule.type === 'per_person'
        ? rule.qty * familySize
        : rule.qty;
      if (qty === 0) return null;
      return {
        ...product,
        entitledQty: qty,
        totalPrice: +(qty * product.pricePerUnit).toFixed(2),
      };
    })
    .filter(Boolean);
}

// ─── Mock Collected Data (per beneficiary per month) ──────
// In production this comes from ePOS distribution records.
export const MOCK_COLLECTED = {
  'citizen_001': {
    month: '2025-07',
    wheat:    { collected: 12, status: 'collected'     },
    rice:     { collected: 0,  status: 'pending'       },
    sugar:    { collected: 1,  status: 'collected'     },
    kerosene: { collected: 2,  status: 'collected'     },
    dal:      { collected: 0,  status: 'pending'       },
    salt:     { collected: 1,  status: 'collected'     },
  },
  'citizen_002': {
    month: '2025-07',
    wheat:    { collected: 20, status: 'collected'     },
    rice:     { collected: 15, status: 'collected'     },
    sugar:    { collected: 2,  status: 'collected'     },
    kerosene: { collected: 0,  status: 'pending'       },
    dal:      { collected: 2,  status: 'collected'     },
    salt:     { collected: 1,  status: 'collected'     },
  },
  'citizen_003': {
    month: '2025-07',
    wheat:    { collected: 0,  status: 'pending'       },
    rice:     { collected: 0,  status: 'pending'       },
    sugar:    { collected: 0,  status: 'pending'       },
    kerosene: { collected: 0,  status: 'pending'       },
    dal:      { collected: 0,  status: 'pending'       },
    salt:     { collected: 0,  status: 'pending'       },
  },
  'citizen_004': {
    month: '2025-07',
    wheat:    { collected: 4,  status: 'partial'       },
    rice:     { collected: 1,  status: 'partial'       },
    sugar:    { collected: 0,  status: 'pending'       },
    kerosene: { collected: 1,  status: 'collected'     },
    dal:      { collected: 0,  status: 'not_collected' },
    salt:     { collected: 1,  status: 'collected'     },
  },
};

// ─── Mock Allocation (legacy — kept for receipt pages) ────
export const MOCK_ALLOCATION = {
  citizenId: 'citizen_001',
  month: '2025-07',
  shopName: 'Ram Ration Store',
  collectionWindow: '1 July 2025 – 31 July 2025',
  status: ALLOCATION_STATUS.PARTIAL,
  entitlement: { wheat_kg: 12, rice_kg: 8, sugar_kg: 1, kerosene_ltr: 2 },
  collected:   { wheat_kg: 12, rice_kg: 0, sugar_kg: 1, kerosene_ltr: 2 },
};

// ─── Receipt Status ───────────────────────────────────────
export const RECEIPT_STATUS = {
  PENDING:   'pending',    // allocation exists, not yet distributed
  GENERATED: 'generated', // distribution confirmed, receipt issued
  VERIFIED:  'verified',  // citizen confirmed receipt via QR
};

// ─── Mock Receipts ────────────────────────────────────────
// Receipts are generated ONLY after:
// 1. Beneficiary Verification (OTP)
// 2. Allocation Check (entitlement confirmed)
// 3. Distribution Confirmation (dealer marks distributed)
// 4. Receipt Generation (system auto-generates QR token)
export const MOCK_RECEIPTS = [
  {
    id: 'rcpt_001',
    qrCode: 'QR-PDS-2025-07-001',
    month: 'July 2025',
    monthKey: '2025-07',
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    dealerId: 'dealer_001',
    citizenId: 'citizen_001',
    rationCardNo: 'MH-2024-00123',
    category: 'PHH',
    familySize: 4,
    // Items are dynamically computed — stored as distributed actuals
    distributedItems: [
      { id: 'wheat',    name: 'Wheat',       qty: 12, unit: 'kg',  pricePerUnit: 2,    total: 24  },
      { id: 'sugar',    name: 'Sugar',       qty: 1,  unit: 'kg',  pricePerUnit: 13.5, total: 13.5},
      { id: 'kerosene', name: 'Kerosene',    qty: 2,  unit: 'ltr', pricePerUnit: 15,   total: 30  },
      { id: 'dal',      name: 'Chana Dal',   qty: 1,  unit: 'kg',  pricePerUnit: 20,   total: 20  },
      { id: 'salt',     name: 'Iodised Salt',qty: 1,  unit: 'kg',  pricePerUnit: 2,    total: 2   },
    ],
    totalAmount: 89.5,
    status: RECEIPT_STATUS.VERIFIED,
    generatedAt: '2025-07-03T11:32:00',
    verifiedAt:  '2025-07-04T14:10:00',
    // Audit trail
    verificationMethod: 'OTP',
    dealerConfirmedAt:  '2025-07-03T11:30:00',
    allocationChecked:  true,
    isPartial: false,
  },
  {
    id: 'rcpt_002',
    qrCode: 'QR-PDS-2025-06-001',
    month: 'June 2025',
    monthKey: '2025-06',
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    dealerId: 'dealer_001',
    citizenId: 'citizen_001',
    rationCardNo: 'MH-2024-00123',
    category: 'PHH',
    familySize: 4,
    distributedItems: [
      { id: 'wheat',    name: 'Wheat',       qty: 12, unit: 'kg',  pricePerUnit: 2,    total: 24  },
      { id: 'rice',     name: 'Rice',        qty: 8,  unit: 'kg',  pricePerUnit: 3,    total: 24  },
      { id: 'sugar',    name: 'Sugar',       qty: 1,  unit: 'kg',  pricePerUnit: 13.5, total: 13.5},
      { id: 'kerosene', name: 'Kerosene',    qty: 2,  unit: 'ltr', pricePerUnit: 15,   total: 30  },
      { id: 'dal',      name: 'Chana Dal',   qty: 1,  unit: 'kg',  pricePerUnit: 20,   total: 20  },
      { id: 'salt',     name: 'Iodised Salt',qty: 1,  unit: 'kg',  pricePerUnit: 2,    total: 2   },
    ],
    totalAmount: 113.5,
    status: RECEIPT_STATUS.VERIFIED,
    generatedAt: '2025-06-05T10:15:00',
    verifiedAt:  '2025-06-05T10:20:00',
    verificationMethod: 'OTP',
    dealerConfirmedAt:  '2025-06-05T10:12:00',
    allocationChecked:  true,
    isPartial: false,
  },
  {
    id: 'rcpt_003',
    qrCode: 'QR-PDS-2025-05-001',
    month: 'May 2025',
    monthKey: '2025-05',
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    dealerId: 'dealer_001',
    citizenId: 'citizen_001',
    rationCardNo: 'MH-2024-00123',
    category: 'PHH',
    familySize: 4,
    distributedItems: [
      { id: 'wheat', name: 'Wheat', qty: 12, unit: 'kg', pricePerUnit: 2,  total: 24 },
      { id: 'rice',  name: 'Rice',  qty: 5,  unit: 'kg', pricePerUnit: 3,  total: 15 },
      { id: 'sugar', name: 'Sugar', qty: 1,  unit: 'kg', pricePerUnit: 13.5, total: 13.5 },
      { id: 'salt',  name: 'Iodised Salt', qty: 1, unit: 'kg', pricePerUnit: 2, total: 2 },
    ],
    totalAmount: 54.5,
    status: RECEIPT_STATUS.VERIFIED,
    generatedAt: '2025-05-08T09:45:00',
    verifiedAt:  '2025-05-08T09:50:00',
    verificationMethod: 'Biometric',
    dealerConfirmedAt:  '2025-05-08T09:42:00',
    allocationChecked:  true,
    isPartial: true, // rice was short
  },
];

// ─── Mock QR Verification ────────────────────────────────
export const MOCK_QR_DATA = {
  'QR-PDS-2025-07-001': {
    valid: true,
    beneficiaryName: 'R*** K***',
    shopName: 'Ram Ration Store',
    month: 'July 2025',
    items: { wheat_kg: 10, rice_kg: 5, sugar_kg: 1, kerosene_ltr: 2 },
    issuedAt: '2025-07-03',
  },
  'QR-PDS-2025-06-001': {
    valid: true,
    beneficiaryName: 'R*** K***',
    shopName: 'Ram Ration Store',
    month: 'June 2025',
    items: { wheat_kg: 10, rice_kg: 5, sugar_kg: 1, kerosene_ltr: 2 },
    issuedAt: '2025-06-05',
  },
  'FAKE-QR-999': {
    valid: false,
  },
};

// ─── Mock Complaints ─────────────────────────────────────
export const MOCK_COMPLAINTS = [
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
    closedAt: null,
    resolutionNote: null,
    assignedTo: 'Field Officer Desai',
    currentOwner: 'Field inspection team',
    evidenceCount: 2,
    timeline: [
      { status: COMPLAINT_STATUS.SUBMITTED, label: 'Complaint submitted', at: '2025-07-12 10:12', note: 'Citizen submitted denial and stock diversion complaint with two photos.' },
      { status: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under review', at: '2025-07-12 14:40', note: 'Duplicate reports checked; same FPS had 3 similar reports this week.' },
      { status: COMPLAINT_STATUS.ASSIGNED, label: 'Assigned', at: '2025-07-13 09:05', note: 'Assigned to Field Officer Desai for shop visit and stock register verification.' },
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
    closedAt: '2025-07-11',
    resolutionNote: 'Dealer warned and fined ₹5000. Beneficiary refunded.',
    assignedTo: 'Field Officer Kulkarni',
    currentOwner: 'Closed after beneficiary confirmation',
    evidenceCount: 1,
    timeline: [
      { status: COMPLAINT_STATUS.SUBMITTED, label: 'Complaint submitted', at: '2025-07-01 16:20', note: 'Citizen reported overcharging with receipt photo.' },
      { status: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under review', at: '2025-07-02 11:15', note: 'Receipt amount compared with entitlement and price table.' },
      { status: COMPLAINT_STATUS.ASSIGNED, label: 'Assigned', at: '2025-07-03 09:30', note: 'Field Officer Kulkarni assigned for dealer statement.' },
      { status: COMPLAINT_STATUS.RESOLVED, label: 'Resolved', at: '2025-07-09 15:45', note: 'Refund processed and penalty recorded.' },
      { status: COMPLAINT_STATUS.CLOSED, label: 'Closed', at: '2025-07-11 12:10', note: 'Citizen confirmed refund received.' },
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
    closedAt: null,
    resolutionNote: null,
    assignedTo: null,
    currentOwner: 'Complaint review desk',
    evidenceCount: 3,
    timeline: [
      { status: COMPLAINT_STATUS.SUBMITTED, label: 'Complaint submitted', at: '2025-06-28 08:50', note: 'Citizen uploaded shutter photos across three dates.' },
      { status: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under review', at: '2025-06-28 13:25', note: 'Shop timing and distribution calendar being checked.' },
    ],
  },
];

// ─── Mock Beneficiaries (for Dealer) ─────────────────────
export const MOCK_BENEFICIARIES = [
  { id: 'b_001', name: 'R*** K***', rationCardNo: 'MH-2024-00123', familySize: 4, status: 'distributed' },
  { id: 'b_002', name: 'S*** D***', rationCardNo: 'MH-2024-00124', familySize: 3, status: 'pending' },
  { id: 'b_003', name: 'P*** M***', rationCardNo: 'MH-2024-00125', familySize: 6, status: 'distributed' },
  { id: 'b_004', name: 'A*** B***', rationCardNo: 'MH-2024-00126', familySize: 2, status: 'not_collected' },
  { id: 'b_005', name: 'V*** S***', rationCardNo: 'MH-2024-00127', familySize: 5, status: 'pending' },
  { id: 'b_006', name: 'N*** P***', rationCardNo: 'MH-2024-00128', familySize: 4, status: 'distributed' },
  { id: 'b_007', name: 'K*** R***', rationCardNo: 'MH-2024-00129', familySize: 3, status: 'pending' },
  { id: 'b_008', name: 'M*** T***', rationCardNo: 'MH-2024-00130', familySize: 5, status: 'distributed' },
];

// ─── Mock Distribution Logs (for Dealer) ─────────────────
export const MOCK_DISTRIBUTION_LOGS = [
  { month: 'June 2025', total: 312, distributed: 289, pending: 14, notCollected: 9, completionPct: 92.6 },
  { month: 'May 2025', total: 312, distributed: 301, pending: 0, notCollected: 11, completionPct: 96.5 },
  { month: 'April 2025', total: 310, distributed: 278, pending: 0, notCollected: 32, completionPct: 89.7 },
  { month: 'March 2025', total: 310, distributed: 310, pending: 0, notCollected: 0, completionPct: 100 },
];

// ─── Mock Admin District Data ─────────────────────────────
export const MOCK_DISTRICT_DATA = {
  districtName: 'Pune',
  totalShops: 145,
  totalBeneficiaries: 89420,
  distributionRate: 78.4,
  activeComplaints: 23,
  shopsWithStock: 132,
  verificationMismatchRate: 12.3,
  topComplaintCategories: [
    { category: 'Overcharging', count: 9 },
    { category: 'Stock Diversion', count: 8 },
    { category: 'Denial of Service', count: 4 },
    { category: 'Fake Entry', count: 2 },
  ],
  shopPerformance: [
    { name: 'Ram Ration', distribution: 95 },
    { name: 'Shivaji Centre', distribution: 72 },
    { name: 'MG FPS', distribution: 54 },
    { name: 'Bharat Depot', distribution: 98 },
    { name: 'Jai Hind', distribution: 81 },
    { name: 'Sai Krupa', distribution: 88 },
  ],
  topComplaintShops: [
    { shopName: 'Mahatma Gandhi FPS', complaints: 14, status: 'flagged' },
    { shopName: 'Shivaji Ration Centre', complaints: 7, status: 'warning' },
    { shopName: 'Jai Hind Ration Shop', complaints: 5, status: 'warning' },
    { shopName: 'Ram Ration Store', complaints: 2, status: 'normal' },
    { shopName: 'Sai Krupa FPS', complaints: 1, status: 'normal' },
  ],
};

// ─── Mock Audit Logs ─────────────────────────────────────
export const MOCK_AUDIT_LOGS = [
  { id: 'al_001', action: 'Stock Updated', entity: 'shop_001', performedBy: 'Dealer Suresh', dateTime: '2025-07-10 09:14' },
  { id: 'al_002', action: 'Receipt Generated', entity: 'rcpt_001', performedBy: 'Dealer Suresh', dateTime: '2025-07-03 11:32' },
  { id: 'al_003', action: 'Complaint Resolved', entity: 'cmp_002', performedBy: 'Officer Kulkarni', dateTime: '2025-07-09 15:45' },
  { id: 'al_004', action: 'Complaint Assigned', entity: 'cmp_001', performedBy: 'Officer Desai', dateTime: '2025-07-13 09:05' },
  { id: 'al_005', action: 'Stock Updated', entity: 'shop_002', performedBy: 'Dealer Mahesh', dateTime: '2025-07-08 08:55' },
  { id: 'al_006', action: 'Citizen Verification', entity: 'citizen_001', performedBy: 'Ramesh Kumar', dateTime: '2025-07-04 14:10' },
];
