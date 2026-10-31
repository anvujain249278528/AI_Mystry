import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Clock3, Fingerprint, Plus, RotateCcw, Search, X } from 'lucide-react';
import { Eyebrow, PageLoading } from '../components/SiteChrome.jsx';
import { api } from '../lib/api.js';
import { listSessions, updateSession } from '../lib/sessionStore.js';

export default function Investigations() {
  const [sessions, setSessions] = useState(listSessions());
  const [loading, setLoading] = useState(sessions.length > 0);

  useEffect(() => {
    const stored = listSessions();
    setSessions(stored);
    if (!stored.length) { setLoading(false); return undefined; }
    let active = true;
    Promise.all(stored.map(async (session) => {
      try {
        const { game } = await api(`/games/${session.sessionId}`, { sessionId: session.sessionId });
        const updated = { ...session, status: game.status, title: game.mystery.title, difficulty: game.mystery.difficulty };
        if (game.status === 'completed') {
          const result = await api(`/games/${session.sessionId}/result`, { sessionId: session.sessionId });
          updated.score = result.result.finalScore;
          updated.isCorrect = result.result.isCorrect;
        }
        updateSession(session.sessionId, updated);
        return updated;
      } catch { return { ...session, unavailable: true }; }
    })).then((refreshed) => { if (active) setSessions(refreshed); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <PageLoading label="Gathering your case files" />;
  return <main className="history-page content-width">
    <div className="history-heading"><div><Eyebrow icon={Fingerprint}>Your case archive</Eyebrow><h1>My <em>investigations.</em></h1><p>Return to an active case or revisit a result. Your case files are saved in this browser.</p></div><Link className="button button-gold" to="/new"><Plus size={15} /> Start a new case</Link></div>
    {!sessions.length ? <section className="history-empty"><span><Search size={22} /></span><Eyebrow>The archive is empty</Eyebrow><h2>Your first case is waiting.</h2><p>Generated mysteries and completed investigation results will appear here.</p><Link className="button button-gold" to="/new">Choose your difficulty <ArrowRight size={15} /></Link></section> : <div className="history-list">{sessions.map((session, index) => {
      const complete = session.status === 'completed';
      const destination = complete ? `/result/${session.sessionId}` : `/case/${session.sessionId}`;
      return <article className={`history-card ${session.unavailable ? 'unavailable' : ''}`} key={session.sessionId}><div className="history-index">{String(index + 1).padStart(2, '0')}</div><div className="history-main"><span className="history-meta">{session.difficulty?.toUpperCase() || 'CASE'} <i>·</i> {new Date(session.startedAt).toLocaleDateString()}</span><h2>{session.title || 'Untitled investigation'}</h2><div className="history-status">{session.unavailable ? <><X size={12} /> unavailable in this browser</> : complete ? <><Check size={12} /> case complete</> : <><Clock3 size={12} /> active investigation</>}</div></div><div className="history-score">{complete ? <><span>SCORE</span><b>{String(session.score ?? 0).padStart(3, '0')}</b><small>{session.isCorrect ? 'SOLVED' : 'UNSOLVED'}</small></> : <><BookOpen size={17} /><span>IN PROGRESS</span></>}</div><Link className="history-open" to={session.unavailable ? '#' : destination} aria-label={`Open ${session.title || 'case'}`} onClick={(event) => { if (session.unavailable) event.preventDefault(); }}><ArrowRight size={17} /></Link></article>;
    })}</div>}
    <div className="history-note"><RotateCcw size={14} /><p>Investigation records are stored by the game server. This archive keeps the private access token in your browser so only you can reopen them.</p></div>
  </main>;
}
