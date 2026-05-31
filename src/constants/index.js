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
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
  CLOSED: 'closed',
};

// ─── Verification Responses ──────────────────────────────
export const VERIFICATION_RESPONSE = {
  RECEIVED: 'received',
  NOT_RECEIVED: 'not_received',
  PARTIAL: 'partial',
};

// ─── Registered Beneficiary Registry ────────────────────
// Only these ration card numbers are valid in the system.
// Each has a masked phone, OTP, and full profile.
export const BENEFICIARY_REGISTRY = {
  'MH-2024-00123': {
    id: 'citizen_001',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    maskedPhone: '98765*****',
    otp: '4521',
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
    otp: '7834',
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
    otp: '3390',
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
    otp: '6612',
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
    name: 'Suresh Patil',
    phone: '9823456789',
    role: ROLES.DEALER,
    shopId: 'shop_001',
    licenseNo: 'FPS-MH-4521',
  },
  admin: {
    id: 'admin_001',
    name: 'District Officer Sharma',
    phone: '9811223344',
    role: ROLES.ADMIN,
    districtId: 'dist_pune',
    district: 'Pune',
  },
};

// ─── Mock Shops ──────────────────────────────────────────
export const MOCK_SHOPS = [
  {
    id: 'shop_001',
    name: 'Ram Ration Store',
    dealerName: 'S*** P***',
    address: 'Ward 4, Kasba Peth, Pune - 411011',
    district: 'Pune',
    licenseNo: 'FPS-MH-4521',
    totalBeneficiaries: 312,
    stockStatus: STOCK_STATUS.AVAILABLE,
    lastDelivery: '2025-07-10',
    complaintCount: 2,
    latitude: 18.5204,
    longitude: 73.8567,
  },
  {
    id: 'shop_002',
    name: 'Shivaji Ration Centre',
    dealerName: 'M*** J***',
    address: 'Plot 12, Hadapsar, Pune - 411028',
    district: 'Pune',
    licenseNo: 'FPS-MH-3312',
    totalBeneficiaries: 278,
    stockStatus: STOCK_STATUS.LOW,
    lastDelivery: '2025-07-08',
    complaintCount: 7,
    latitude: 18.5089,
    longitude: 73.9259,
  },
  {
    id: 'shop_003',
    name: 'Mahatma Gandhi FPS',
    dealerName: 'P*** D***',
    address: 'Sector 7, Pimpri, Pune - 411017',
    district: 'Pune',
    licenseNo: 'FPS-MH-2201',
    totalBeneficiaries: 445,
    stockStatus: STOCK_STATUS.OUT_OF_STOCK,
    lastDelivery: '2025-06-28',
    complaintCount: 14,
    latitude: 18.6298,
    longitude: 73.7997,
  },
  {
    id: 'shop_004',
    name: 'Bharat Ration Depot',
    dealerName: 'A*** S***',
    address: 'Lane 3, Kothrud, Pune - 411038',
    district: 'Pune',
    licenseNo: 'FPS-MH-5567',
    totalBeneficiaries: 198,
    stockStatus: STOCK_STATUS.AVAILABLE,
    lastDelivery: '2025-07-12',
    complaintCount: 0,
    latitude: 18.5074,
    longitude: 73.8077,
  },
  {
    id: 'shop_005',
    name: 'Jai Hind Ration Shop',
    dealerName: 'V*** K***',
    address: 'Main Road, Wanowrie, Pune - 411040',
    district: 'Pune',
    licenseNo: 'FPS-MH-6634',
    totalBeneficiaries: 367,
    stockStatus: STOCK_STATUS.LOW,
    lastDelivery: '2025-07-05',
    complaintCount: 5,
    latitude: 18.4855,
    longitude: 73.8934,
  },
  {
    id: 'shop_006',
    name: 'Sai Krupa FPS',
    dealerName: 'R*** M***',
    address: 'Block B, Bibwewadi, Pune - 411037',
    district: 'Pune',
    licenseNo: 'FPS-MH-7712',
    totalBeneficiaries: 289,
    stockStatus: STOCK_STATUS.AVAILABLE,
    lastDelivery: '2025-07-11',
    complaintCount: 1,
    latitude: 18.4731,
    longitude: 73.8553,
  },
];

// ─── Mock Allocation ─────────────────────────────────────
export const MOCK_ALLOCATION = {
  citizenId: 'citizen_001',
  month: '2025-07',
  shopName: 'Ram Ration Store',
  collectionWindow: '1 July 2025 – 31 July 2025',
  status: ALLOCATION_STATUS.PARTIAL,
  entitlement: {
    wheat_kg: 10,
    rice_kg: 5,
    sugar_kg: 1,
    kerosene_ltr: 2,
  },
  collected: {
    wheat_kg: 10,
    rice_kg: 0,
    sugar_kg: 1,
    kerosene_ltr: 2,
  },
};

// ─── Mock Receipts ───────────────────────────────────────
export const MOCK_RECEIPTS = [
  {
    id: 'rcpt_001',
    qrCode: 'QR-PDS-2025-07-001',
    month: 'July 2025',
    shopName: 'Ram Ration Store',
    items: { wheat_kg: 10, rice_kg: 5, sugar_kg: 1, kerosene_ltr: 2 },
    totalAmount: 85,
    issuedAt: '2025-07-03',
    isVerified: true,
  },
  {
    id: 'rcpt_002',
    qrCode: 'QR-PDS-2025-06-001',
    month: 'June 2025',
    shopName: 'Ram Ration Store',
    items: { wheat_kg: 10, rice_kg: 5, sugar_kg: 1, kerosene_ltr: 2 },
    totalAmount: 85,
    issuedAt: '2025-06-05',
    isVerified: true,
  },
  {
    id: 'rcpt_003',
    qrCode: 'QR-PDS-2025-05-001',
    month: 'May 2025',
    shopName: 'Ram Ration Store',
    items: { wheat_kg: 10, rice_kg: 3, sugar_kg: 1, kerosene_ltr: 0 },
    totalAmount: 62,
    issuedAt: '2025-05-08',
    isVerified: true,
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
    complaintNo: 'CMP-2025-00847',
    shopId: 'shop_002',
    shopName: 'Shivaji Ration Centre',
    category: 'stock_diversion',
    description: 'Dealer refused to give rice saying stock is empty but shop was open and selling to others.',
    status: COMPLAINT_STATUS.UNDER_REVIEW,
    submittedAt: '2025-07-12',
    resolvedAt: null,
    resolutionNote: null,
    assignedTo: 'Field Officer Desai',
  },
  {
    id: 'cmp_002',
    complaintNo: 'CMP-2025-00831',
    shopId: 'shop_003',
    shopName: 'Mahatma Gandhi FPS',
    category: 'overcharging',
    description: 'Charged ₹120 extra for wheat. Official price is ₹2/kg but dealer charged ₹14/kg.',
    status: COMPLAINT_STATUS.RESOLVED,
    submittedAt: '2025-07-01',
    resolvedAt: '2025-07-09',
    resolutionNote: 'Dealer warned and fined ₹5000. Beneficiary refunded.',
    assignedTo: 'Field Officer Kulkarni',
  },
  {
    id: 'cmp_003',
    complaintNo: 'CMP-2025-00798',
    shopId: 'shop_003',
    shopName: 'Mahatma Gandhi FPS',
    category: 'denial',
    description: 'Shop was closed for 3 consecutive distribution days without notice.',
    status: COMPLAINT_STATUS.ESCALATED,
    submittedAt: '2025-06-28',
    resolvedAt: null,
    resolutionNote: null,
    assignedTo: 'District Officer Sharma',
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
  { id: 'al_004', action: 'Complaint Escalated', entity: 'cmp_003', performedBy: 'Officer Desai', dateTime: '2025-07-02 10:20' },
  { id: 'al_005', action: 'Stock Updated', entity: 'shop_002', performedBy: 'Dealer Mahesh', dateTime: '2025-07-08 08:55' },
  { id: 'al_006', action: 'Citizen Verification', entity: 'citizen_001', performedBy: 'Ramesh Kumar', dateTime: '2025-07-04 14:10' },
];
