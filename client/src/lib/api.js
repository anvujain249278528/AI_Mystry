import { getSession } from './sessionStore.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function api(path, { method = 'GET', body, sessionId, headers = {}, signal } = {}) {
  const session = sessionId ? getSession(sessionId) : null;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(session?.token ? { 'X-Session-Token': session.token } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('The server returned an unreadable response. Please try again.');
  }
  if (!response.ok || payload.success === false) {
    const error = new Error(payload.error?.message || 'The request could not be completed.');
    error.code = payload.error?.code;
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function friendlyError(error) {
  if (error?.name === 'TypeError') return 'Could not connect to the investigation server. Check that the API is running and try again.';
  return error?.message || 'Something went wrong. Please try again.';
}
