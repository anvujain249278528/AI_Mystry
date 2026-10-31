import { Router } from 'express';
import mongoose from 'mongoose';
import { requireSessionOwner } from '../middleware/requireSessionOwner.js';
import {
  generateCase, getMystery, getGame, discoverClue, interrogate, requestHint, submitAccusation, getResult,
} from '../controllers/apiController.js';
import { AppError } from '../utils/errors.js';

const router = Router();
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  return res.status(connected ? 200 : 503).json({
    success: connected,
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected',
  });
});

router.post('/mysteries/generate', asyncRoute(generateCase));
router.get('/mysteries/:id', asyncRoute(getMystery));
router.get('/games/:sessionId', requireSessionOwner, asyncRoute(getGame));
router.post('/games/:sessionId/clues/:clueId/discover', requireSessionOwner, asyncRoute(discoverClue));
router.post('/games/:sessionId/interrogate', requireSessionOwner, asyncRoute(interrogate));
router.post('/games/:sessionId/hints', requireSessionOwner, asyncRoute(requestHint));
router.post('/games/:sessionId/accusation', requireSessionOwner, asyncRoute(submitAccusation));
router.get('/games/:sessionId/result', requireSessionOwner, asyncRoute(getResult));

// Same game, with the paths suggested in the project brief (SPEC.md section D).
// :sessionId is the game session id returned when the case is created.
router.post('/cases', asyncRoute(generateCase));
router.get('/cases/:sessionId', requireSessionOwner, asyncRoute(getGame));
router.post('/cases/:sessionId/clues/:clueId/discover', requireSessionOwner, asyncRoute(discoverClue));
router.post('/cases/:sessionId/interrogate', requireSessionOwner, asyncRoute(interrogate));
router.post('/cases/:sessionId/hints', requireSessionOwner, asyncRoute(requestHint));
router.post('/cases/:sessionId/accuse', requireSessionOwner, asyncRoute(submitAccusation));
router.get('/cases/:sessionId/result', requireSessionOwner, asyncRoute(getResult));

router.use((req, _res, next) => next(new AppError(404, `No API route for ${req.method} ${req.path}.`, 'NOT_FOUND')));

export default router;
