import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Clock3, Fingerprint, PenLine, Plus, RotateCcw, Search, X } from 'lucide-react';
import { Eyebrow, PageLoading } from '../components/SiteChrome.jsx';
import { SubpageHeading } from '../components/ui.jsx';
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
  return <main className="page-width min-h-[calc(100vh-142px)] pt-[78px] pb-[90px] max-[620px]:pt-[52px] max-[620px]:pb-[65px]">
    <div className="mb-[38px] flex items-end justify-between gap-[25px] max-[620px]:mb-[26px] max-[620px]:block">
      <SubpageHeading className="m-0 max-w-[690px]" icon={Fingerprint} eyebrow="Your case archive" title={<>My <em>investigations.</em></>}>Return to an active case or revisit a result. Your case files are saved in this browser.</SubpageHeading>
      <div className="flex shrink-0 flex-wrap gap-[11px] max-[620px]:mt-[18px]">
        <Link className="button button-dark" to="/create"><PenLine size={14} /> Write your own</Link>
        <Link className="button button-gold" to="/new"><Plus size={15} /> Start a new case</Link>
      </div>
    </div>
    {!sessions.length
      ? <section className="flex min-h-[300px] flex-col items-center justify-center border border-dashed border-paper/17 text-center">
          <span className="mb-[17px] grid size-12 place-items-center rounded-full border border-gold/35 text-gold"><Search size={22} /></span>
          <Eyebrow className="justify-center">The archive is empty</Eyebrow>
          <h2 className="mt-[9px] mb-1.5 font-serif text-[23px] font-medium">Your first case is waiting.</h2>
          <p className="mt-0 mb-4 max-w-[350px] text-[10px] leading-[1.7] text-[#96969d]">Generated mysteries and completed investigation results will appear here.</p>
          <Link className="button button-gold" to="/new">Choose your difficulty <ArrowRight size={15} /></Link>
        </section>
      : <div className="border-t border-line">{sessions.map((session, index) => {
          const complete = session.status === 'completed';
          const destination = complete ? `/result/${session.sessionId}` : `/case/${session.sessionId}`;
          return <article key={session.sessionId} className={`grid min-h-[116px] grid-cols-[43px_minmax(0,1fr)_105px_35px] items-center gap-4 border-b border-line px-[13px] py-[18px] transition-colors hover:bg-white/[.022] max-[620px]:grid-cols-[25px_minmax(0,1fr)_39px] max-[620px]:gap-[9px] max-[620px]:px-[3px] max-[620px]:py-3.5 ${session.unavailable ? 'opacity-55' : ''}`}>
            <div className="font-mono text-[10px] text-gold">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <span className="font-mono text-[7px] tracking-[.12em] text-[#8c8c94] max-[620px]:text-[6px]">{session.difficulty?.toUpperCase() || 'CASE'} <i className="px-1 not-italic text-gold">·</i> {new Date(session.startedAt).toLocaleDateString()}{session.origin === 'custom' && <> <i className="px-1 not-italic text-gold">·</i> YOUR STORY</>}</span>
              <h2 className="my-1.5 font-serif text-lg font-medium max-[620px]:text-[15px]">{session.title || 'Untitled investigation'}</h2>
              <div className={`flex items-center gap-[5px] text-[8px] ${session.unavailable ? 'text-[#d58b82]' : 'text-[#8fb99c]'}`}>{session.unavailable ? <><X size={12} /> unavailable in this browser</> : complete ? <><Check size={12} /> case complete</> : <><Clock3 size={12} /> active investigation</>}</div>
            </div>
            <div className="flex flex-col gap-[3px] font-mono text-[6px] tracking-[.1em] text-[#81818a] max-[620px]:hidden">{complete
              ? <><span>SCORE</span><b className="font-serif text-[22px] font-medium tracking-normal text-gold-light">{String(session.score ?? 0).padStart(3, '0')}</b><small>{session.isCorrect ? 'SOLVED' : 'UNSOLVED'}</small></>
              : <><BookOpen size={17} className="text-gold" /><span>IN PROGRESS</span></>}</div>
            <Link className="grid size-[31px] place-items-center border border-gold/28 text-gold-light hover:bg-gold hover:text-[#171610] max-[620px]:size-[29px]" to={session.unavailable ? '#' : destination} aria-label={`Open ${session.title || 'case'}`} onClick={(event) => { if (session.unavailable) event.preventDefault(); }}><ArrowRight size={17} /></Link>
          </article>;
        })}</div>}
    <div className="mt-6 flex items-center gap-2 text-gold max-[620px]:items-start"><RotateCcw size={14} className="shrink-0" /><p className="m-0 text-[8px] leading-[1.6] text-[#83838c] max-[620px]:text-[7px]">Investigation records are stored by the game server. This archive keeps the private access token in your browser so only you can reopen them.</p></div>
  </main>;
}
