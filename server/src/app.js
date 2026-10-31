import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRoutes from './routes/api.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: env.clientUrl.split(',').map((url) => url.trim()),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Session-Token'],
  maxAge: 600,
}));
app.use(express.json({ limit: '25kb' }));
// One shared limit for both /api/v1/... and the /api/cases/... paths.
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment and try again.' } },
}));
app.use('/api/v1', apiRoutes);
// Same routes without the version, so /api/cases/... works as written in SPEC.md.
app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
