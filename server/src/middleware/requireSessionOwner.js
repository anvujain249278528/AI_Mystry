import { GameSession } from '../models/GameSession.js';
import { AppError } from '../utils/errors.js';
import { tokenMatches } from '../utils/sessionTokens.js';

export async function requireSessionOwner(req, _res, next) {
  try {
    const session = await GameSession.findById(req.params.sessionId).select('+ownerTokenHash');
    const token = req.get('x-session-token');
    if (!session || !tokenMatches(token, session.ownerTokenHash)) {
      throw new AppError(404, 'Investigation not found. Check that you are using the browser where it was started.', 'SESSION_NOT_FOUND');
    }
    req.gameSession = session;
    next();
  } catch (error) {
    next(error);
  }
}
