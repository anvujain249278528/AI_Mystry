import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

export function createSessionCredentials() {
  return {
    sessionId: randomUUID(),
    token: randomBytes(32).toString('base64url'),
  };
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function tokenMatches(token, storedHash) {
  if (!token || !storedHash) return false;
  const supplied = Buffer.from(hashToken(token), 'hex');
  const expected = Buffer.from(storedHash, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
