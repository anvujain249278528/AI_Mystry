import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export function useGame(sessionId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const payload = await api(`/games/${sessionId}`, { sessionId });
      setGame(payload.game);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { refresh(); }, [refresh]);
  return { game, setGame, loading, error, refresh };
}
