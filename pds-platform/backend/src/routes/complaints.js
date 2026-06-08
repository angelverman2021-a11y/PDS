import { Router } from 'express';
import db, { rowToComplaint } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

const STATUS_FLOW = ['submitted', 'under_review', 'assigned', 'resolved', 'closed'];

// ── Prepared statements ───────────────────────────────────
const stmts = {
  getAll:    db.prepare('SELECT * FROM complaints ORDER BY submitted_at DESC'),
  getById:   db.prepare('SELECT * FROM complaints WHERE id = ? OR complaint_no = ? COLLATE NOCASE'),
  insert:    db.prepare(`
    INSERT INTO complaints
      (id, complaint_no, shop_id, shop_name, category, description, status,
       submitted_at, expected_resolution, resolved_at, assigned_to, current_owner,
       evidence_count, resolution_note, timeline)
    VALUES
      (@id,@complaintNo,@shopId,@shopName,@category,@description,@status,
       @submittedAt,@expectedResolution,@resolvedAt,@assignedTo,@currentOwner,
       @evidenceCount,@resolutionNote,@timeline)
  `),
  updateStatus: db.prepare(`
    UPDATE complaints
    SET status = @status, resolution_note = @resolutionNote,
        resolved_at = @resolvedAt, timeline = @timeline
    WHERE id = @id
  `),
};

let sequence = db.prepare('SELECT MAX(CAST(SUBSTR(complaint_no, -5) AS INTEGER)) as max FROM complaints').get().max || 847;

function generateComplaintNo(districtCode = 'PUN') {
  return `CMP-${districtCode}-${new Date().getFullYear()}-${String(++sequence).padStart(5, '0')}`;
}

// ── POST /api/v1/complaints ───────────────────────────────
router.post('/', requireAuth, (req, res) => {
  const { shopId, shopName, category, description } = req.body;
  if (!shopId || !shopName) return res.status(400).json({ ok: false, error: 'shopId and shopName are required' });
  if (!category)            return res.status(400).json({ ok: false, error: 'category is required' });
  if (!description || description.trim().length < 20) {
    return res.status(400).json({ ok: false, error: 'description must be at least 20 characters' });
  }

  const now = new Date();
  const complaintNo = generateComplaintNo();
  const timeline = JSON.stringify([{
    status: 'submitted', label: 'Complaint submitted', at: now.toISOString(),
    note: 'Complaint received and tracking ID generated.',
  }]);

  const row = {
    id: `cmp_${complaintNo.toLowerCase().replaceAll('-', '_')}`,
    complaintNo, shopId, shopName, category, description: description.trim(),
    status: 'submitted', submittedAt: now.toISOString().slice(0, 10),
    expectedResolution: new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10),
    resolvedAt: null, assignedTo: null, currentOwner: 'Complaint intake desk',
    evidenceCount: 0, resolutionNote: null, timeline,
  };

  stmts.insert.run(row);
  res.status(201).json({ ok: true, complaint: rowToComplaint({ ...row, complaint_no: row.complaintNo, shop_id: row.shopId, shop_name: row.shopName, submitted_at: row.submittedAt, expected_resolution: row.expectedResolution, resolved_at: row.resolvedAt, assigned_to: row.assignedTo, current_owner: row.currentOwner, evidence_count: row.evidenceCount, resolution_note: row.resolutionNote }) });
});

// ── GET /api/v1/complaints/:id ────────────────────────────
router.get('/:id', (req, res) => {
  const row = stmts.getById.get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'COMPLAINT_NOT_FOUND' });
  res.json({ ok: true, complaint: rowToComplaint(row) });
});

// ── GET /api/v1/complaints/:id/timeline ──────────────────
router.get('/:id/timeline', (req, res) => {
  const row = stmts.getById.get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'COMPLAINT_NOT_FOUND' });

  const entries = JSON.parse(row.timeline);
  const timeline = STATUS_FLOW.map(status => {
    const entry = entries.find(t => t.status === status);
    return { status, completed: Boolean(entry), label: entry?.label ?? status.replace('_', ' '), at: entry?.at ?? null, note: entry?.note ?? null };
  });
  res.json({ ok: true, timeline });
});

// ── GET /api/v1/complaints ────────────────────────────────
router.get('/', (req, res) => {
  const rows = stmts.getAll.all();
  res.json({ ok: true, complaints: rows.map(rowToComplaint) });
});

// ── PATCH /api/v1/complaints/:id/status ──────────────────
router.patch('/:id/status', requireAuth, requireRole('admin'), (req, res) => {
  const { nextStatus, note } = req.body;
  const row = stmts.getById.get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'COMPLAINT_NOT_FOUND' });

  const currentIndex = STATUS_FLOW.indexOf(row.status);
  const nextIndex    = STATUS_FLOW.indexOf(nextStatus);
  if (nextIndex !== currentIndex + 1) {
    return res.status(422).json({ ok: false, error: 'INVALID_STATUS_TRANSITION' });
  }

  const entries = JSON.parse(row.timeline);
  entries.push({ status: nextStatus, label: nextStatus.replace('_', ' '), at: new Date().toISOString(), note: note || null });

  stmts.updateStatus.run({
    id: row.id,
    status: nextStatus,
    resolutionNote: note || row.resolution_note,
    resolvedAt: nextStatus === 'resolved' ? new Date().toISOString().slice(0, 10) : row.resolved_at,
    timeline: JSON.stringify(entries),
  });

  const updated = stmts.getById.get(row.id, row.id);
  res.json({ ok: true, complaint: rowToComplaint(updated) });
});

export default router;
