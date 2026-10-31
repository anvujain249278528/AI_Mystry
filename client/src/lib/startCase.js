import { api } from './api.js';
import { saveSession } from './sessionStore.js';

// Asks the server for a new case, saves the session in this browser, and returns its id.
export async function startCase(body) {
  const payload = await api('/mysteries/generate', { method: 'POST', body });
  saveSession({
    sessionId: payload.gameSessionId,
    token: payload.sessionToken,
    mysteryId: payload.mystery.id,
    title: payload.mystery.title,
    difficulty: payload.mystery.difficulty,
    origin: payload.mystery.origin,
    status: 'active',
    startedAt: new Date().toISOString(),
  });
  return payload.gameSessionId;
}
