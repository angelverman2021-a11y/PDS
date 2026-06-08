import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dirname, '../../data');
const DB_FILE   = join(DATA_DIR, 'pds.db');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_FILE);

// Enable WAL for better concurrent read performance
db.pragma('journal_mode = WAL');

// ── Receipts table ────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS receipts (
    id                 TEXT PRIMARY KEY,
    qr_code            TEXT UNIQUE NOT NULL,
    month              TEXT NOT NULL,
    month_key          TEXT NOT NULL,
    shop_id            TEXT NOT NULL,
    shop_name          TEXT NOT NULL,
    dealer_id          TEXT NOT NULL,
    citizen_id         TEXT NOT NULL,
    ration_card_no     TEXT NOT NULL,
    category           TEXT NOT NULL,
    family_size        INTEGER NOT NULL,
    distributed_items  TEXT NOT NULL,  -- JSON
    total_amount       REAL NOT NULL,
    status             TEXT NOT NULL DEFAULT 'generated',
    generated_at       TEXT NOT NULL,
    verified_at        TEXT,
    verification_method TEXT,
    dealer_confirmed_at TEXT,
    allocation_checked  INTEGER NOT NULL DEFAULT 1,
    is_partial          INTEGER NOT NULL DEFAULT 0
  )
`);

// ── Shops table ─────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS shops (
    id                  TEXT PRIMARY KEY,
    fps_id              TEXT UNIQUE NOT NULL,
    name                TEXT NOT NULL,
    dealer_name         TEXT NOT NULL,
    address             TEXT NOT NULL,
    pincode             TEXT NOT NULL,
    district            TEXT NOT NULL,
    license_no          TEXT NOT NULL,
    total_beneficiaries INTEGER NOT NULL DEFAULT 0,
    stock_status        TEXT NOT NULL DEFAULT 'available',
    last_delivery       TEXT,
    complaint_count     INTEGER NOT NULL DEFAULT 0,
    distance_km         REAL NOT NULL DEFAULT 0,
    rating              REAL NOT NULL DEFAULT 4.0,
    review_count        INTEGER NOT NULL DEFAULT 0,
    is_open             INTEGER NOT NULL DEFAULT 1,
    timings             TEXT,
    latitude            REAL,
    longitude           REAL
  )
`);

// ── Complaints table ──────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS complaints (
    id                  TEXT PRIMARY KEY,
    complaint_no        TEXT UNIQUE NOT NULL,
    shop_id             TEXT NOT NULL,
    shop_name           TEXT NOT NULL,
    category            TEXT NOT NULL,
    description         TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'submitted',
    submitted_at        TEXT NOT NULL,
    expected_resolution TEXT,
    resolved_at         TEXT,
    assigned_to         TEXT,
    current_owner       TEXT,
    evidence_count      INTEGER NOT NULL DEFAULT 0,
    resolution_note     TEXT,
    timeline            TEXT NOT NULL  -- JSON
  )
`);

// ── Seed shops ──────────────────────────────────────────
const seedShops = () => {
  const count = db.prepare('SELECT COUNT(*) as n FROM shops').get().n;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO shops
      (id, fps_id, name, dealer_name, address, pincode, district, license_no,
       total_beneficiaries, stock_status, last_delivery, complaint_count,
       distance_km, rating, review_count, is_open, timings, latitude, longitude)
    VALUES
      (@id,@fpsId,@name,@dealerName,@address,@pincode,@district,@licenseNo,
       @totalBeneficiaries,@stockStatus,@lastDelivery,@complaintCount,
       @distanceKm,@rating,@reviewCount,@isOpen,@timings,@latitude,@longitude)
  `);

  const rows = [
    { id: 'shop_001', fpsId: 'FPS-MH-PUN-004521', name: 'Ram Ration Store',      dealerName: 'S*** P***', address: 'Ward 4, Kasba Peth, Pune - 411011',      pincode: '411011', district: 'Pune', licenseNo: 'FPS-MH-4521', totalBeneficiaries: 312, stockStatus: 'available',    lastDelivery: '2025-07-10', complaintCount: 2,  distanceKm: 0.8, rating: 4.4, reviewCount: 128, isOpen: 1, timings: '8:00 AM - 1:00 PM, 4:00 PM - 7:00 PM',       latitude: 18.5204, longitude: 73.8567 },
    { id: 'shop_002', fpsId: 'FPS-MH-PUN-003312', name: 'Shivaji Ration Centre', dealerName: 'M*** J***', address: 'Plot 12, Hadapsar, Pune - 411028',         pincode: '411028', district: 'Pune', licenseNo: 'FPS-MH-3312', totalBeneficiaries: 278, stockStatus: 'low',         lastDelivery: '2025-07-08', complaintCount: 7,  distanceKm: 2.4, rating: 3.8, reviewCount: 91,  isOpen: 1, timings: '9:00 AM - 2:00 PM',                        latitude: 18.5089, longitude: 73.9259 },
    { id: 'shop_003', fpsId: 'FPS-MH-PUN-002201', name: 'Mahatma Gandhi FPS',    dealerName: 'P*** D***', address: 'Sector 7, Pimpri, Pune - 411017',          pincode: '411017', district: 'Pune', licenseNo: 'FPS-MH-2201', totalBeneficiaries: 445, stockStatus: 'out_of_stock', lastDelivery: '2025-06-28', complaintCount: 14, distanceKm: 5.7, rating: 2.9, reviewCount: 204, isOpen: 0, timings: 'Temporarily closed for inspection',          latitude: 18.6298, longitude: 73.7997 },
    { id: 'shop_004', fpsId: 'FPS-MH-PUN-005567', name: 'Bharat Ration Depot',   dealerName: 'A*** S***', address: 'Lane 3, Kothrud, Pune - 411038',           pincode: '411038', district: 'Pune', licenseNo: 'FPS-MH-5567', totalBeneficiaries: 198, stockStatus: 'available',    lastDelivery: '2025-07-12', complaintCount: 0,  distanceKm: 1.2, rating: 4.7, reviewCount: 73,  isOpen: 1, timings: '8:30 AM - 12:30 PM, 5:00 PM - 7:30 PM',      latitude: 18.5074, longitude: 73.8077 },
    { id: 'shop_005', fpsId: 'FPS-MH-PUN-006634', name: 'Jai Hind Ration Shop',  dealerName: 'V*** K***', address: 'Main Road, Wanowrie, Pune - 411040',       pincode: '411040', district: 'Pune', licenseNo: 'FPS-MH-6634', totalBeneficiaries: 367, stockStatus: 'low',         lastDelivery: '2025-07-05', complaintCount: 5,  distanceKm: 3.1, rating: 4.0, reviewCount: 119, isOpen: 0, timings: 'Closed today; opens tomorrow 8:00 AM',          latitude: 18.4855, longitude: 73.8934 },
    { id: 'shop_006', fpsId: 'FPS-MH-PUN-007712', name: 'Sai Krupa FPS',         dealerName: 'R*** M***', address: 'Block B, Bibwewadi, Pune - 411037',        pincode: '411037', district: 'Pune', licenseNo: 'FPS-MH-7712', totalBeneficiaries: 289, stockStatus: 'available',    lastDelivery: '2025-07-11', complaintCount: 1,  distanceKm: 1.9, rating: 4.5, reviewCount: 86,  isOpen: 1, timings: '8:00 AM - 2:00 PM',                        latitude: 18.4731, longitude: 73.8553 },
  ];

  const seedAll = db.transaction(() => rows.forEach(r => insert.run(r)));
  seedAll();
};

// ── Seed receipts ─────────────────────────────────────────
const seedReceipts = () => {
  const count = db.prepare('SELECT COUNT(*) as n FROM receipts').get().n;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO receipts
      (id, qr_code, month, month_key, shop_id, shop_name, dealer_id, citizen_id,
       ration_card_no, category, family_size, distributed_items, total_amount,
       status, generated_at, verified_at, verification_method, dealer_confirmed_at,
       allocation_checked, is_partial)
    VALUES
      (@id,@qrCode,@month,@monthKey,@shopId,@shopName,@dealerId,@citizenId,
       @rationCardNo,@category,@familySize,@distributedItems,@totalAmount,
       @status,@generatedAt,@verifiedAt,@verificationMethod,@dealerConfirmedAt,
       @allocationChecked,@isPartial)
  `);

  const rows = [
    { id: 'rcpt_001', qrCode: 'QR-PDS-2025-07-001', month: 'July 2025', monthKey: '2025-07', shopId: 'shop_001', shopName: 'Ram Ration Store', dealerId: 'dealer_001', citizenId: 'citizen_001', rationCardNo: 'MH-2024-00123', category: 'PHH', familySize: 4, distributedItems: JSON.stringify([{ id: 'wheat', name: 'Wheat', qty: 12, unit: 'kg', pricePerUnit: 2, total: 24, icon: '🌾' }, { id: 'sugar', name: 'Sugar', qty: 1, unit: 'kg', pricePerUnit: 13.5, total: 13.5, icon: '🧂' }, { id: 'kerosene', name: 'Kerosene', qty: 2, unit: 'ltr', pricePerUnit: 15, total: 30, icon: '🛢️' }, { id: 'dal', name: 'Chana Dal', qty: 1, unit: 'kg', pricePerUnit: 20, total: 20, icon: '🫘' }, { id: 'salt', name: 'Iodised Salt', qty: 1, unit: 'kg', pricePerUnit: 2, total: 2, icon: '🧂' }]), totalAmount: 89.5, status: 'verified', generatedAt: '2025-07-03T11:32:00', verifiedAt: '2025-07-04T14:10:00', verificationMethod: 'OTP', dealerConfirmedAt: '2025-07-03T11:30:00', allocationChecked: 1, isPartial: 0 },
    { id: 'rcpt_002', qrCode: 'QR-PDS-2025-06-001', month: 'June 2025', monthKey: '2025-06', shopId: 'shop_001', shopName: 'Ram Ration Store', dealerId: 'dealer_001', citizenId: 'citizen_001', rationCardNo: 'MH-2024-00123', category: 'PHH', familySize: 4, distributedItems: JSON.stringify([{ id: 'wheat', name: 'Wheat', qty: 12, unit: 'kg', pricePerUnit: 2, total: 24, icon: '🌾' }, { id: 'rice', name: 'Rice', qty: 8, unit: 'kg', pricePerUnit: 3, total: 24, icon: '🍚' }, { id: 'sugar', name: 'Sugar', qty: 1, unit: 'kg', pricePerUnit: 13.5, total: 13.5, icon: '🧂' }, { id: 'kerosene', name: 'Kerosene', qty: 2, unit: 'ltr', pricePerUnit: 15, total: 30, icon: '🛢️' }, { id: 'dal', name: 'Chana Dal', qty: 1, unit: 'kg', pricePerUnit: 20, total: 20, icon: '🫘' }, { id: 'salt', name: 'Iodised Salt', qty: 1, unit: 'kg', pricePerUnit: 2, total: 2, icon: '🧂' }]), totalAmount: 113.5, status: 'verified', generatedAt: '2025-06-05T10:15:00', verifiedAt: '2025-06-05T10:20:00', verificationMethod: 'OTP', dealerConfirmedAt: '2025-06-05T10:12:00', allocationChecked: 1, isPartial: 0 },
  ];

  const seedAll = db.transaction(() => rows.forEach(r => insert.run(r)));
  seedAll();
};

// ── Seed complaints ───────────────────────────────────────
const seedComplaints = () => {
  const count = db.prepare('SELECT COUNT(*) as n FROM complaints').get().n;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO complaints
      (id, complaint_no, shop_id, shop_name, category, description, status,
       submitted_at, expected_resolution, resolved_at, assigned_to, current_owner,
       evidence_count, resolution_note, timeline)
    VALUES
      (@id,@complaintNo,@shopId,@shopName,@category,@description,@status,
       @submittedAt,@expectedResolution,@resolvedAt,@assignedTo,@currentOwner,
       @evidenceCount,@resolutionNote,@timeline)
  `);

  const rows = [
    { id: 'cmp_001', complaintNo: 'CMP-PUN-2025-00847', shopId: 'shop_002', shopName: 'Shivaji Ration Centre', category: 'stock_diversion', description: 'Dealer refused to give rice saying stock is empty but shop was open and selling to others.', status: 'assigned', submittedAt: '2025-07-12', expectedResolution: '2025-07-19', resolvedAt: null, assignedTo: 'Field Officer Desai', currentOwner: 'Field inspection team', evidenceCount: 2, resolutionNote: null, timeline: JSON.stringify([{ status: 'submitted', label: 'Complaint submitted', at: '2025-07-12 10:12', note: 'Citizen submitted denial and stock diversion complaint.' }, { status: 'under_review', label: 'Under review', at: '2025-07-12 14:40', note: 'Duplicate reports checked.' }, { status: 'assigned', label: 'Assigned', at: '2025-07-13 09:05', note: 'Assigned to Field Officer Desai.' }]) },
    { id: 'cmp_002', complaintNo: 'CMP-PUN-2025-00831', shopId: 'shop_003', shopName: 'Mahatma Gandhi FPS', category: 'overcharging', description: 'Charged ₹120 extra for wheat. Official price is ₹2/kg but dealer charged ₹14/kg.', status: 'closed', submittedAt: '2025-07-01', expectedResolution: '2025-07-08', resolvedAt: '2025-07-09', assignedTo: 'Field Officer Kulkarni', currentOwner: 'Closed after beneficiary confirmation', evidenceCount: 1, resolutionNote: 'Dealer warned and fined ₹5000. Beneficiary refunded.', timeline: JSON.stringify([{ status: 'submitted', label: 'Complaint submitted', at: '2025-07-01 16:20', note: 'Citizen reported overcharging with receipt photo.' }, { status: 'under_review', label: 'Under review', at: '2025-07-02 11:15', note: 'Receipt amount compared with entitlement.' }, { status: 'assigned', label: 'Assigned', at: '2025-07-03 09:30', note: 'Field Officer Kulkarni assigned.' }, { status: 'resolved', label: 'Resolved', at: '2025-07-09 15:45', note: 'Refund processed and penalty recorded.' }, { status: 'closed', label: 'Closed', at: '2025-07-11 12:10', note: 'Citizen confirmed refund received.' }]) },
    { id: 'cmp_003', complaintNo: 'CMP-PUN-2025-00798', shopId: 'shop_003', shopName: 'Mahatma Gandhi FPS', category: 'denial', description: 'Shop was closed for 3 consecutive distribution days without notice.', status: 'under_review', submittedAt: '2025-06-28', expectedResolution: '2025-07-05', resolvedAt: null, assignedTo: null, currentOwner: 'Complaint review desk', evidenceCount: 3, resolutionNote: null, timeline: JSON.stringify([{ status: 'submitted', label: 'Complaint submitted', at: '2025-06-28 08:50', note: 'Citizen uploaded shutter photos.' }, { status: 'under_review', label: 'Under review', at: '2025-06-28 13:25', note: 'Shop timing and distribution calendar being checked.' }]) },
  ];

  const seedAll = db.transaction(() => rows.forEach(r => insert.run(r)));
  seedAll();
};

seedShops();
seedReceipts();
seedComplaints();

// ── Helper: map DB row → JS object ───────────────────────
export function rowToReceipt(row) {
  if (!row) return null;
  return {
    id: row.id,
    qrCode: row.qr_code,
    month: row.month,
    monthKey: row.month_key,
    shopId: row.shop_id,
    shopName: row.shop_name,
    dealerId: row.dealer_id,
    citizenId: row.citizen_id,
    rationCardNo: row.ration_card_no,
    category: row.category,
    familySize: row.family_size,
    distributedItems: JSON.parse(row.distributed_items),
    totalAmount: row.total_amount,
    status: row.status,
    generatedAt: row.generated_at,
    verifiedAt: row.verified_at,
    verificationMethod: row.verification_method,
    dealerConfirmedAt: row.dealer_confirmed_at,
    allocationChecked: Boolean(row.allocation_checked),
    isPartial: Boolean(row.is_partial),
  };
}

export function rowToShop(row) {
  if (!row) return null;
  return {
    id: row.id,
    fpsId: row.fps_id,
    name: row.name,
    dealerName: row.dealer_name,
    address: row.address,
    pincode: row.pincode,
    district: row.district,
    licenseNo: row.license_no,
    totalBeneficiaries: row.total_beneficiaries,
    stockStatus: row.stock_status,
    lastDelivery: row.last_delivery,
    complaintCount: row.complaint_count,
    distanceKm: row.distance_km,
    rating: row.rating,
    reviewCount: row.review_count,
    isOpen: Boolean(row.is_open),
    timings: row.timings,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

export function rowToComplaint(row) {
  if (!row) return null;
  return {
    id: row.id,
    complaintNo: row.complaint_no,
    shopId: row.shop_id,
    shopName: row.shop_name,
    category: row.category,
    description: row.description,
    status: row.status,
    submittedAt: row.submitted_at,
    expectedResolution: row.expected_resolution,
    resolvedAt: row.resolved_at,
    assignedTo: row.assigned_to,
    currentOwner: row.current_owner,
    evidenceCount: row.evidence_count,
    resolutionNote: row.resolution_note,
    timeline: JSON.parse(row.timeline),
  };
}

export default db;
