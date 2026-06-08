import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: config.frontendOrigin,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ──────────────────────────────────────────
app.use(express.json());

// ── Rate limiting ─────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests, please try again later.' },
}));

// ── Routes ────────────────────────────────────────────────
app.use('/api/v1', healthRouter);
app.use('/api/v1/auth', authRouter);

// ── 404 + Error handlers ──────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`PDS Backend running on http://localhost:${config.port}`);
  console.log(`  ENV:  ${config.nodeEnv}`);
  console.log(`  DEMO: ${config.demoMode}`);
  console.log(`  CORS: ${config.frontendOrigin}`);
});
