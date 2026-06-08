// Server-side beneficiary registry. Phase 6 will replace with DB queries.
export const BENEFICIARY_REGISTRY = {
  'MH-2024-00123': {
    id: 'citizen_001',
    name: 'Ramesh Kumar',
    phone: '+919876543210',
    maskedPhone: '98765*****',
    rationCardNo: 'MH-2024-00123',
    role: 'citizen',
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    familySize: 4,
    district: 'Pune',
    category: 'PHH',
    aadhaarLinked: true,
    bankLinked: true,
  },
  'MH-2024-00124': {
    id: 'citizen_002',
    name: 'Sunita Devi',
    phone: '+919823001122',
    maskedPhone: '98230*****',
    rationCardNo: 'MH-2024-00124',
    role: 'citizen',
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    familySize: 3,
    district: 'Pune',
    category: 'AAY',
    aadhaarLinked: true,
    bankLinked: false,
  },
  'MH-2024-00125': {
    id: 'citizen_003',
    name: 'Prakash Mane',
    phone: '+919765432100',
    maskedPhone: '97654*****',
    rationCardNo: 'MH-2024-00125',
    role: 'citizen',
    shopId: 'shop_002',
    shopName: 'Shivaji Ration Centre',
    familySize: 6,
    district: 'Pune',
    category: 'PHH',
    aadhaarLinked: true,
    bankLinked: true,
  },
  'MH-2024-00126': {
    id: 'citizen_004',
    name: 'Anita Bhosale',
    phone: '+919812345678',
    maskedPhone: '98123*****',
    rationCardNo: 'MH-2024-00126',
    role: 'citizen',
    shopId: 'shop_002',
    shopName: 'Shivaji Ration Centre',
    familySize: 2,
    district: 'Pune',
    category: 'NPHH',
    aadhaarLinked: false,
    bankLinked: true,
  },
};

// Demo OTPs — only active when DEMO_MODE=true
export const DEMO_OTPS = {
  '+919876543210': '123456',
  '+919823001122': '654321',
  '+919765432100': '112233',
  '+919812345678': '998877',
};

export const MOCK_USERS = {
  dealer: {
    id: 'dealer_001',
    name: 'Suresh Patil',
    role: 'dealer',
    shopId: 'shop_001',
    shopName: 'Ram Ration Store',
    licenseNo: 'FPS-MH-4521',
  },
  admin: {
    id: 'admin_001',
    name: 'District Officer Sharma',
    role: 'admin',
    district: 'Pune',
    districtId: 'dist_pune',
  },
};

export function normalizePhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return String(phone ?? '').trim();
}
