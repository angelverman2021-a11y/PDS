import { API_BASE_URL } from '../config/platformConfig';

// ── POST /api/v1/complaints ───────────────────────────────
export async function createComplaint({ shopId, shopName, category, description }) {
  const token = localStorage.getItem('pds_token');
  const res = await fetch(`${API_BASE_URL}/api/v1/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ shopId, shopName, category, description }),
  });
  return res.json(); // { ok, complaint } | { ok: false, error }
}

// ── GET /api/v1/complaints/:id ────────────────────────────
export async function getComplaintById(id) {
  const res = await fetch(`${API_BASE_URL}/api/v1/complaints/${encodeURIComponent(id)}`);
  return res.json(); // { ok, complaint } | { ok: false, error }
}

// ── GET /api/v1/complaints/:id/timeline ──────────────────
export async function getComplaintTimeline(id) {
  const res = await fetch(`${API_BASE_URL}/api/v1/complaints/${encodeURIComponent(id)}/timeline`);
  return res.json(); // { ok, timeline }
}

// ── PATCH /api/v1/complaints/:id/status ──────────────────
export async function transitionComplaintStatus(id, nextStatus, note = '') {
  const token = localStorage.getItem('pds_token');
  const res = await fetch(`${API_BASE_URL}/api/v1/complaints/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ nextStatus, note }),
  });
  return res.json();
}

// ── GET /api/v1/complaints (admin) ───────────────────────
export async function getAllComplaints() {
  const token = localStorage.getItem('pds_token');
  const res = await fetch(`${API_BASE_URL}/api/v1/complaints`, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
  });
  return res.json(); // { ok, complaints }
}
