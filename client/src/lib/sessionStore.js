const STORAGE_KEY = 'ai-mystery-room:sessions';

function readSessions() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function listSessions() {
  return readSessions().sort((a, b) => new Date(b.updatedAt || b.startedAt) - new Date(a.updatedAt || a.startedAt));
}

export function getSession(sessionId) {
  return readSessions().find((session) => session.sessionId === sessionId) || null;
}

export function saveSession(session) {
  const sessions = readSessions().filter((item) => item.sessionId !== session.sessionId);
  sessions.unshift({ ...session, updatedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 30)));
}

export function updateSession(sessionId, patch) {
  const sessions = readSessions().map((session) => session.sessionId === sessionId
    ? { ...session, ...patch, updatedAt: new Date().toISOString() }
    : session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function removeSession(sessionId) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readSessions().filter((item) => item.sessionId !== sessionId)));
}
