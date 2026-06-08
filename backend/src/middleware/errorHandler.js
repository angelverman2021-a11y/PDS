export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ ok: false, error: message });
}

export function notFound(req, res) {
  res.status(404).json({ ok: false, error: `Route ${req.method} ${req.path} not found` });
}
