# PDS Transparency Platform Backend Architecture

## Scope

The platform should operate as an independent transparency layer. It must not claim government ownership. Current frontend data is mock or seed data. Production data should come from authorized FPS registry feeds, ePOS transaction feeds, public datasets, or consented user submissions.

## Service Layer

### Shop Service

Responsibilities:
- Search registered FPS shops by pincode.
- Validate 6-digit Indian pincodes.
- Calculate distance using latitude/longitude.
- Generate Google Maps links.
- Rank shops by pincode match, open status, stock availability, and distance.

Module:
- `src/services/shopService.js`
- `src/services/geoService.js`

Controller shape:
- `ShopController.search(req, res)`
- `ShopController.getById(req, res)`
- `ShopController.getNearby(req, res)`

API routes:
- `GET /api/v1/shops?pincode=411011&lat=18.52&lng=73.85`
- `GET /api/v1/shops/:fpsId`
- `GET /api/v1/shops/:fpsId/audit`

Validation:
- `pincode`: required for pincode search, regex `^[1-9][0-9]{5}$`
- `lat/lng`: optional, numeric, valid coordinate ranges
- `fpsId`: required, format `FPS-{STATE}-{DISTRICT}-{NUMBER}`

### Complaint Service

Lifecycle:
1. Submitted
2. Under Review
3. Assigned
4. Resolved
5. Closed

Responsibilities:
- Generate complaint IDs such as `CMP-PUN-2025-00001`.
- Create complaint records with evidence count and expected resolution date.
- Enforce one-step status transitions.
- Store full timeline entries with actor, timestamp, and note.

Module:
- `src/services/complaintService.js`

Controller shape:
- `ComplaintController.create(req, res)`
- `ComplaintController.track(req, res)`
- `ComplaintController.transition(req, res)`
- `ComplaintController.assign(req, res)`
- `ComplaintController.close(req, res)`

API routes:
- `POST /api/v1/complaints`
- `GET /api/v1/complaints/:complaintId`
- `GET /api/v1/complaints/:complaintId/timeline`
- `PATCH /api/v1/complaints/:complaintId/status`
- `POST /api/v1/complaints/:complaintId/evidence`

Validation:
- `shopId`: required, must exist in registered FPS collection
- `category`: enum `stock_diversion | overcharging | denial | fake_entry | other`
- `description`: required, min 20 chars, max 2000 chars
- `evidence`: optional, allow image/pdf/video metadata only
- `status`: enum only, transition must follow lifecycle order

### Audit Log Service

Tracks:
- Login
- Verification
- Allocation viewed
- Receipt generated
- Complaint action

Module:
- `src/services/auditLogService.js`

API routes:
- `GET /api/v1/audit-logs?entityType=complaint&entityId=CMP-PUN-2025-00001`
- `GET /api/v1/audit-logs?actorId=user_123`

Validation:
- Append-only records.
- Store `actorId`, `actorRole`, `entityType`, `entityId`, `action`, `metadata`, `ipHash`, `createdAt`.
- No update or delete endpoint in production.

### Data Sources Module

Responsibilities:
- Explain whether each record is mock, seed, or future integration.
- Prevent fake official claims.
- Show production migration path.

Module:
- `src/services/dataSourceService.js`

API routes:
- `GET /api/v1/data-sources`
- `GET /api/v1/data-sources/disclosure`

Production sources:
- State FPS shop master registry.
- ePOS transaction feed.
- Ration card entitlement API where legally permitted.
- Complaint/grievance system integration.
- Citizen-submitted receipt/evidence records.

### Support System

Responsibilities:
- Generate support IDs such as `SUP-WEB-2025-00001`.
- Track support ticket lifecycle.
- Escalate biometric failure, ration denial, and missing receipt issues.

Module:
- `src/services/supportService.js`

API routes:
- `POST /api/v1/support/tickets`
- `GET /api/v1/support/tickets/:supportId`
- `PATCH /api/v1/support/tickets/:supportId/status`
- `POST /api/v1/support/tickets/:supportId/escalate`

Validation:
- `issueType`: required enum
- `description`: required, min 10 chars
- `phone`: optional, masked at rest
- `priority`: derived from issue type

## Database Collections

### `fps_shops`

```json
{
  "_id": "shop_001",
  "fpsId": "FPS-MH-PUN-004521",
  "name": "Ram Ration Store",
  "dealerLicenseNo": "FPS-MH-4521",
  "address": "Ward 4, Kasba Peth, Pune - 411011",
  "pincode": "411011",
  "district": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "stockStatus": "available",
  "isOpen": true,
  "timings": "8:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
  "rating": 4.4,
  "reviewCount": 128,
  "dataSource": "state_fps_registry"
}
```

### `complaints`

```json
{
  "_id": "cmp_001",
  "complaintNo": "CMP-PUN-2025-00847",
  "shopId": "shop_002",
  "category": "stock_diversion",
  "status": "assigned",
  "description": "Dealer refused ration despite stock visibility.",
  "submittedAt": "2025-07-12T10:12:00+05:30",
  "expectedResolution": "2025-07-19",
  "assignedTo": "officer_017",
  "currentOwner": "field_inspection_team",
  "evidenceCount": 2
}
```

### `complaint_timelines`

```json
{
  "_id": "ctl_001",
  "complaintNo": "CMP-PUN-2025-00847",
  "status": "assigned",
  "actorId": "officer_017",
  "actorRole": "field_officer",
  "note": "Assigned for FPS visit and stock register check.",
  "createdAt": "2025-07-13T09:05:00+05:30"
}
```

### `receipts`

Receipts should not be fabricated in production. They should be generated only from verified distribution transactions.

```json
{
  "_id": "receipt_001",
  "receiptNo": "RCT-PUN-2025-00001",
  "sourceTransactionId": "epos_txn_0091",
  "shopId": "shop_001",
  "beneficiaryHash": "sha256:redacted",
  "items": [{ "commodity": "wheat", "quantity": 10, "unit": "kg" }],
  "issuedAt": "2025-07-03T11:32:00+05:30",
  "qrHash": "sha256:receipt-payload"
}
```

### `support_tickets`

```json
{
  "_id": "support_001",
  "supportId": "SUP-WEB-2025-00001",
  "issueType": "biometric_failure",
  "status": "opened",
  "priority": "high",
  "maskedPhone": "***3210",
  "createdAt": "2025-07-12T10:30:00+05:30"
}
```

### `audit_logs`

```json
{
  "_id": "audit_001",
  "eventType": "complaint_action",
  "actorId": "officer_017",
  "actorRole": "field_officer",
  "entityType": "complaint",
  "entityId": "CMP-PUN-2025-00847",
  "action": "assigned",
  "metadata": { "previousStatus": "under_review", "nextStatus": "assigned" },
  "ipHash": "sha256:redacted",
  "createdAt": "2025-07-13T09:05:00+05:30",
  "immutable": true
}
```

## Production Notes

- Keep mock data and seed data clearly labeled.
- Never use fake `.gov` emails or government ownership language.
- Separate public transparency data from personally identifiable beneficiary records.
- Hash ration card numbers and beneficiary identifiers.
- Store evidence files in object storage with signed URLs and malware scanning.
- Make audit logs append-only.
- Use queue workers for SMS, support escalation, receipt generation, and data sync.
