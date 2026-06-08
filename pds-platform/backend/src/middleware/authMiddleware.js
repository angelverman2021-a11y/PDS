import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  }
  try {
    req.jwtPayload = jwt.verify(header.slice(7), config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'TOKEN_INVALID_OR_EXPIRED' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.jwtPayload || !roles.includes(req.jwtPayload.role)) {
      return res.status(403).json({ ok: false, error: 'FORBIDDEN' });
    }
    next();
  };
}
