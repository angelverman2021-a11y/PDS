import { Router } from 'express';
import { config } from '../config/index.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    env: config.nodeEnv,
    demoMode: config.demoMode,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
