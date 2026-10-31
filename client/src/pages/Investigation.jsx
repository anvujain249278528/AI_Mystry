import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BadgeHelp, Check, ChevronRight, Clock3, FileText, Fingerprint,
  Lightbulb, LoaderCircle, LockKeyhole, MapPin, MessageCircle, Search, Send, Shield,
  Sparkles, UserRound, Users, X,
} from 'lucide-react';
import { ErrorPanel, Eyebrow, PageLoading } from '../components/SiteChrome.jsx';
import { useGame } from '../hooks/useGame.js';
import { api, friendlyError } from '../lib/api.js';
import { updateSession } from '../lib/sessionStore.js';

const tabs = [
  { id: 'overview', label: 'Case overview', icon: FileText },
  { id: 'suspects', label: 'Suspects', icon: Users },
  { id: 'evidence', label: 'Evidence board', icon: Search },
  { id: 'interrogation', label: 'Interrogation', icon: MessageCircle },
  { id: 'hints', label: 'Hints', icon: Lightbulb },
  { id: 'accusation', label: 'Final accusation', icon: Fingerprint },
];

function ActionError({ children }) {
  if (!children) return null;
  return <div className="action-error"><span>!</span>{children}</div>;
}

function Overview({ game, changeTab }) {
  const { mystery } = game;
  const progress = Math.min(100, Math.round(((game.discoveredClueIds.length + game.interrogationHistory.length) / Math.max(1, mystery.clues.length + mystery.suspects.length)) * 100));
  return <div className="workspace-content">
    <div className="view-heading"><div><Eyebrow>Case at a glance</Eyebrow><h2>The investigation</h2><p>Keep the facts close. The solution stays sealed until your final accusation.</p></div><span className="status-pill"><i /> ACTIVE CASE</span></div>
    <div className="case-brief-strip"><div className="brief-strip-mark"><Fingerprint size={20} /></div><div><span>OPEN FILE / {mystery.category.toUpperCase()}</span><h3>{mystery.title}</h3><p>{mystery.briefing}</p></div></div>
    <div className="overview-stats">
      <div><span>PERSONS OF INTEREST</span><strong>{mystery.suspects.length.toString().padStart(2, '0')}</strong><small>suspects on file</small></div>
      <div><span>CLUES FOUND</span><strong>{game.discoveredClueIds.length.toString().padStart(2, '0')}<i> / {mystery.clues.length + mystery.hiddenLeads.length}</i></strong><small>pieces of evidence</small></div>
      <div><span>HINTS REQUESTED</span><strong>{game.hintsUsed.length.toString().padStart(2, '0')}<i> / 03</i></strong><small>available in sequence</small></div>
    </div>
    <section className="progress-card"><div className="progress-header"><div><span>FIELD NOTES</span><h3>Investigation in progress</h3></div><b>{progress}%</b></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><p>Examine the evidence and compare what each suspect tells you.</p></section>
    <div className="overview-columns">
      <section className="overview-list"><div className="subsection-title"><h3>People to question</h3><button onClick={() => changeTab('suspects')}>All suspects <ArrowRight size={13} /></button></div>
        {mystery.suspects.slice(0, 3).map((suspect, index) => <button className="overview-person" key={suspect.id} onClick={() => changeTab('interrogation', suspect.id)}><span className="person-index">0{index + 1}</span><span className="person-initial">{suspect.name.charAt(0)}</span><span className="person-copy"><b>{suspect.name}</b><small>{suspect.occupation}</small></span><ChevronRight size={15} /></button>)}
      </section>
      <section className="overview-list"><div className="subsection-title"><h3>On the evidence board</h3><button onClick={() => changeTab('evidence')}>View board <ArrowRight size={13} /></button></div>
        {mystery.clues.slice(0, 3).map((clue, index) => <div className="overview-evidence" key={clue.id}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{clue.title}</b><small>{clue.type}</small></div><FileText size={14} /></div>)}
      </section>
    </div>
    <div className="overview-footer"><Shield size={15} /><span>The case facts and solution are fixed. Your interviews cannot change what happened.</span></div>
  </div>;
}

function Suspects({ mystery, selectedSuspectId, onInterrogate }) {
  return <div className="workspace-content">
    <div className="view-heading"><div><Eyebrow>Persons of interest</Eyebrow><h2>Everyone has a story.</h2><p>Review each account. A motive is not proof, and an alibi is only a claim until it is checked.</p></div><span className="view-count">{String(mystery.suspects.length).padStart(2, '0')} FILES</span></div>
    <div className="suspect-grid">{mystery.suspects.map((suspect, index) => <article className="suspect-card" key={suspect.id}>
      <div className="suspect-card-top"><span>PERSON OF INTEREST / {String(index + 1).padStart(2, '0')}</span><div className="suspect-avatar">{suspect.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div></div>
      <h3>{suspect.name}</h3><div className="suspect-role">{suspect.occupation} <span>·</span> {suspect.age}</div>
      <p className="suspect-background">{suspect.background}</p>
      <div className="suspect-detail"><span>CONNECTION</span><b>{suspect.relationship}</b></div>
      <div className="suspect-detail"><span>POSSIBLE MOTIVE</span><b>{suspect.motive}</b></div>
      <div className="suspect-detail"><span>CLAIMED ALIBI</span><b>{suspect.alibi}</b></div>
      <div className="suspect-quote">“{suspect.openingStatement}”</div>
      <button className={`button ${selectedSuspectId === suspect.id ? 'button-gold' : 'button-outline'} suspect-interrogate`} onClick={() => onInterrogate(suspect.id)}><MessageCircle size={14} /> Ask a question</button>
    </article>)}</div>
  </div>;
}

function Evidence({ mystery, onDiscover, busyId }) {
  const locations = useMemo(() => mystery.hiddenLeads.reduce((groups, lead) => {
    const key = lead.discoveryLocation || 'Unsearched location';
    groups[key] ||= [];
    groups[key].push(lead);
    return groups;
  }, {}), [mystery.hiddenLeads]);
  return <div className="workspace-content">
    <div className="view-heading"><div><Eyebrow>Evidence board</Eyebrow><h2>Details leave a trail.</h2><p>Initial findings and evidence you have uncovered are recorded here. Follow a lead to search a location.</p></div><span className="view-count">{String(mystery.clues.length).padStart(2, '0')} FOUND</span></div>
    <div className="evidence-grid">{mystery.clues.map((clue, index) => <article className="evidence-card" key={clue.id}><div className="evidence-card-top"><span>{clue.id} <i>·</i> {clue.type.toUpperCase()}</span><span className="evidence-found"><Check size={12} /> LOGGED</span></div><div className="evidence-number">{String(index + 1).padStart(2, '0')}</div><h3>{clue.title}</h3><p>{clue.description}</p><div className="evidence-card-foot"><span><MapPin size={12} /> {clue.discoveryLocation}</span><span>DISCOVERED</span></div></article>)}</div>
    {!!Object.keys(locations).length && <section className="locked-evidence"><div className="locked-heading"><div><Eyebrow icon={LockKeyhole}>Unsearched leads</Eyebrow><h3>There is more to find.</h3></div><span>{Object.values(locations).flat().length} SEALED</span></div>
      <div className="lead-list">{Object.entries(locations).map(([location, leads]) => <article className="lead-row" key={location}><span className="lead-lock"><LockKeyhole size={16} /></span><div className="lead-copy"><b>{location}</b><small>{leads.length === 1 ? 'A detail may have been missed.' : `${leads.length} details may have been missed.`}</small></div><div className="lead-actions">{leads.map((lead, index) => <button className="button button-dark" key={lead.id} disabled={busyId === lead.id} onClick={() => onDiscover(lead.id)}>{busyId === lead.id ? <LoaderCircle className="spin" size={14} /> : <Search size={14} />} {leads.length > 1 ? `Search ${index + 1}` : 'Search location'}</button>)}</div></article>)}</div>
    </section>}
  </div>;
}

function Interrogation({ game, suspectId, setSuspectId, onSend, busy }) {
  const { mystery } = game;
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const suspect = mystery.suspects.find((item) => item.id === suspectId) || mystery.suspects[0];
  const turns = game.interrogationHistory.filter((turn) => turn.suspectId === suspect.id);
  const suggestions = mystery.investigationQuestions?.length ? mystery.investigationQuestions.slice(0, 4) : ['Where were you when it happened?', 'Can anyone confirm your alibi?', 'What was your relationship with the victim?'];

  async function submit(event) {
    event.preventDefault();
    setError('');
    const trimmed = question.trim();
    if (!trimmed) { setError('Write a question before sending it.'); return; }
    try { await onSend(suspect.id, trimmed); setQuestion(''); }
    catch (sendError) { setError(friendlyError(sendError)); }
  }

  return <div className="workspace-content">
    <div className="view-heading"><div><Eyebrow>Interrogation room</Eyebrow><h2>Let them speak.</h2><p>Each suspect has their own account. Ask about a detail, then decide what it means.</p></div><span className="view-count">{game.interrogationHistory.length} QUESTIONS ASKED</span></div>
    <div className="interrogation-layout">
      <aside className="interview-suspects"><span className="panel-label">SELECT A SUSPECT</span>{mystery.suspects.map((item, index) => <button key={item.id} className={`interview-person ${suspect.id === item.id ? 'active' : ''}`} onClick={() => setSuspectId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><b>{item.name}</b><small>{item.occupation}</small><ChevronRight size={14} /></button>)}</aside>
      <section className="interview-main"><div className="interview-profile"><div className="interview-avatar">{suspect.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><span>INTERVIEW SUBJECT</span><h3>{suspect.name}</h3><p>{suspect.occupation} <i>·</i> {suspect.relationship}</p></div><span className="interview-time"><Clock3 size={13} /> {mystery.crimeTime}</span></div>
        <div className="interview-opening"><span>OPENING STATEMENT</span><p>“{suspect.openingStatement}”</p></div>
        <div className="conversation-log">{turns.length ? turns.map((turn, index) => <div className="conversation-pair" key={`${turn.createdAt || index}-${index}`}><div className="question-bubble"><span>YOU ASKED</span><p>{turn.question}</p></div><div className="answer-bubble"><div><span>{suspect.name.toUpperCase()}</span><i /></div><p>{turn.response}</p></div></div>) : <div className="conversation-empty"><MessageCircle size={20} /><p>No questions yet. Start with their timeline or ask what they noticed.</p></div>}</div>
        <div className="suggested-questions"><span>QUESTIONS TO CONSIDER</span><div>{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setQuestion(suggestion)}>{suggestion}</button>)}</div></div>
        {error && <ActionError>{error}</ActionError>}
        <form className="question-form" onSubmit={submit}><label htmlFor="interview-question">YOUR QUESTION</label><div><input id="interview-question" maxLength={500} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={`Ask ${suspect.name.split(' ')[0]} something…`} disabled={busy} /><button type="submit" aria-label="Send question" disabled={busy || !question.trim()}>{busy ? <LoaderCircle className="spin" size={17} /> : <Send size={16} />}</button></div><small>{question.length}/500 characters</small></form>
      </section>
    </div>
  </div>;
}

function Hints({ game, onHint, busy }) {
  const hintLevels = [
    { level: 1, name: 'A gentle nudge', detail: 'A broad direction to help you think.' },
    { level: 2, name: 'Investigative direction', detail: 'A closer look at a clue or contradiction.' },
    { level: 3, name: 'The stronger lead', detail: 'A direct connection between evidence and opportunity.' },
  ];
  const nextLevel = game.hintsUsed.length + 1;
  return <div className="workspace-content">
    <div className="view-heading"><div><Eyebrow icon={Lightbulb}>Progressive hints</Eyebrow><h2>A nudge, when you need one.</h2><p>Hints arrive in order and can each be used once. Every hint lowers a correct-case score by 10 points.</p></div><span className="view-count">{game.hintsUsed.length} / 03 USED</span></div>
    <div className="hint-note"><Lightbulb size={17} /><p>Each hint is based on this case's fixed evidence and solution. It will point you toward what to compare without naming a suspect.</p></div>
    <div className="hint-levels">{hintLevels.map((hint) => {
      const used = game.hintsUsed.find((item) => item.level === hint.level);
      const current = !used && hint.level === nextLevel;
      return <article className={`hint-card ${used ? 'used' : ''} ${current ? 'next' : ''}`} key={hint.level}>
        <div className="hint-card-head"><span>HINT / 0{hint.level}</span>{used ? <span className="hint-used"><Check size={12} /> REQUESTED</span> : current ? <span className="hint-next">AVAILABLE</span> : <LockKeyhole size={15} />}</div>
        <div className="hint-level-icon"><Lightbulb size={18} /></div><h3>{hint.name}</h3><p>{hint.detail}</p>
        {used ? <div className="hint-content">“{used.content}”</div> : current ? <button className="button button-dark" disabled={busy} onClick={() => onHint(hint.level)}>{busy ? <LoaderCircle className="spin" size={14} /> : <Sparkles size={14} />} Request hint <ArrowRight size={14} /></button> : <div className="hint-locked"><LockKeyhole size={12} /> Request the previous hint first</div>}
      </article>;
    })}</div>
    <div className="hint-score-note"><span>SCORING NOTE</span><p>Correct accusation: 100 points minus 10 for each hint. An incorrect accusation scores 0.</p></div>
  </div>;
}

function Accusation({ game, selectedId, setSelectedId, onSubmit, busy }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const selected = game.mystery.suspects.find((suspect) => suspect.id === selectedId);
  async function submit() {
    setError('');
    try { await onSubmit(selectedId); }
    catch (submitError) { setError(friendlyError(submitError)); setConfirming(false); }
  }
  return <div className="workspace-content">
    <div className="view-heading"><div><Eyebrow icon={Fingerprint}>The final decision</Eyebrow><h2>Who is responsible?</h2><p>Review what you have learned, then choose the one person you believe committed the crime.</p></div><span className="sealed-label"><LockKeyhole size={12} /> ONE SUBMISSION</span></div>
    <div className="accusation-callout"><Fingerprint size={19} /><p>Your accusation cannot be changed after submission. The full case solution will be revealed as soon as you confirm.</p></div>
    <div className="accusation-grid">{game.mystery.suspects.map((suspect, index) => <button className={`accusation-card ${selectedId === suspect.id ? 'selected' : ''}`} key={suspect.id} onClick={() => setSelectedId(suspect.id)} aria-pressed={selectedId === suspect.id}><span className="accusation-number">PERSON / {String(index + 1).padStart(2, '0')}</span><span className="accusation-avatar">{suspect.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><b>{suspect.name}</b><small>{suspect.occupation}</small><span className="accusation-choice">{selectedId === suspect.id ? <Check size={14} /> : null}</span></button>)}</div>
    {error && <ActionError>{error}</ActionError>}
    <div className="accusation-submit"><p>{selected ? <>Your selection: <b>{selected.name}</b></> : 'Select one suspect to continue.'}</p><button className="button button-gold" disabled={!selectedId || busy} onClick={() => { setError(''); setConfirming(true); }}>Submit final accusation <ArrowRight size={16} /></button></div>
    {confirming && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirming(false); }}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><button className="modal-close" aria-label="Close" onClick={() => setConfirming(false)}><X size={18} /></button><span className="confirm-icon"><Fingerprint size={22} /></span><Eyebrow>Final accusation</Eyebrow><h2 id="confirm-title">Accuse {selected?.name}?</h2><p>This is your one final answer. Once you submit, the investigation will close and the complete solution will be revealed.</p><div className="confirm-actions"><button className="button button-outline" onClick={() => setConfirming(false)} disabled={busy}>Keep investigating</button><button className="button button-gold" onClick={submit} disabled={busy}>{busy ? <LoaderCircle className="spin" size={15} /> : <Check size={15} />} Confirm accusation</button></div></section></div>}
  </div>;
}

export default function Investigation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { game, loading, error, refresh } = useGame(sessionId);
  const [tab, setTab] = useState('overview');
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [actionError, setActionError] = useState('');

  async function refreshData() { await refresh(); }
  async function discover(clueId) {
    setBusyId(clueId); setActionError('');
    try { await api(`/games/${sessionId}/clues/${encodeURIComponent(clueId)}/discover`, { method: 'POST', sessionId }); await refreshData(); }
    catch (err) { setActionError(friendlyError(err)); }
    finally { setBusyId(''); }
  }
  async function sendQuestion(suspectId, question) {
    setBusy(true); setActionError('');
    try { await api(`/games/${sessionId}/interrogate`, { method: 'POST', body: { suspectId, question }, sessionId }); await refreshData(); }
    catch (err) { setActionError(friendlyError(err)); throw err; }
    finally { setBusy(false); }
  }
  async function askHint(level) {
    setBusy(true); setActionError('');
    try { await api(`/games/${sessionId}/hints`, { method: 'POST', body: { level }, sessionId }); await refreshData(); }
    catch (err) { setActionError(friendlyError(err)); }
    finally { setBusy(false); }
  }
  async function submitAccusation(suspectId) {
    setBusy(true); setActionError('');
    try {
      const payload = await api(`/games/${sessionId}/accusation`, { method: 'POST', body: { suspectId }, sessionId });
      updateSession(sessionId, { status: 'completed', selectedSuspectId: suspectId, score: payload.result.finalScore, isCorrect: payload.result.isCorrect });
      navigate(`/result/${sessionId}`, { state: { payload } });
    } catch (err) { setActionError(friendlyError(err)); throw err; }
    finally { setBusy(false); }
  }

  if (loading) return <PageLoading label="Returning to the investigation" />;
  if (error || !game) return <main className="content-width page-error-wrap"><ErrorPanel message={error || 'This investigation is unavailable.'} onRetry={refresh} backTo="/investigations" /></main>;
  if (game.status === 'completed') return <Navigate to={`/result/${sessionId}`} replace />;

  function switchTab(nextTab, suspectId) {
    if (suspectId) setSelectedSuspectId(suspectId);
    else if (nextTab === 'interrogation' && !selectedSuspectId) setSelectedSuspectId(game.mystery.suspects[0]?.id || '');
    setActionError(''); setTab(nextTab);
  }

  return <main className="investigation-page">
    <div className="investigation-topbar"><Link to={`/case/${sessionId}`}><ArrowLeft size={14} /> Case briefing</Link><span>INVESTIGATION ROOM <i>/</i> {game.mystery.difficulty.toUpperCase()}</span><span className="active-status"><i /> LIVE</span></div>
    <div className="investigation-layout">
      <aside className="investigation-sidebar"><div className="sidebar-case"><span className="sidebar-file">OPEN CASE / {game.mystery.category.toUpperCase()}</span><h1>{game.mystery.title}</h1><p><MapPin size={12} /> {game.mystery.location}</p><div className="sidebar-meta"><span><Clock3 size={12} /> {game.mystery.crimeTime}</span><span className={`difficulty-tag tag-${game.mystery.difficulty}`}>{game.mystery.difficulty}</span></div></div>
        <nav className="investigation-nav" aria-label="Investigation sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => switchTab(id)}><Icon size={16} strokeWidth={1.55} /><span>{label}</span>{id === 'evidence' && <small>{game.discoveredClueIds.length}</small>}{id === 'hints' && game.hintsUsed.length > 0 && <small>{game.hintsUsed.length}</small>}{tab === id && <ChevronRight size={14} className="tab-chevron" />}</button>)}</nav>
        <div className="sidebar-footer"><Shield size={14} /><span>SOLUTION SEALED<br />UNTIL ACCUSATION</span></div>
      </aside>
      <section className="investigation-main">
        <div className="workspace-tabs">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => switchTab(id)}><Icon size={14} /><span>{label}</span></button>)}</div>
        {actionError && <div className="dashboard-error"><span>!</span>{actionError}<button onClick={() => setActionError('')} aria-label="Dismiss"><X size={14} /></button></div>}
        {tab === 'overview' && <Overview game={game} changeTab={switchTab} />}
        {tab === 'suspects' && <Suspects mystery={game.mystery} selectedSuspectId={selectedSuspectId} onInterrogate={(id) => switchTab('interrogation', id)} />}
        {tab === 'evidence' && <Evidence mystery={game.mystery} onDiscover={discover} busyId={busyId} />}
        {tab === 'interrogation' && <Interrogation game={game} suspectId={selectedSuspectId} setSuspectId={setSelectedSuspectId} onSend={sendQuestion} busy={busy} />}
        {tab === 'hints' && <Hints game={game} onHint={askHint} busy={busy} />}
        {tab === 'accusation' && <Accusation game={game} selectedId={selectedSuspectId} setSelectedId={setSelectedSuspectId} onSubmit={submitAccusation} busy={busy} />}
        <footer className="workspace-foot"><span>AI MYSTERY ROOM</span><span>FIXED CASE · YOUR DEDUCTION</span><Link to="/investigations">My investigations <ArrowRight size={12} /></Link></footer>
      </section>
      <aside className="case-rail"><div className="rail-stamp"><Fingerprint size={22} /><span>CASE<br />FILED</span></div><div className="rail-facts"><span>CRIME LOCATION</span><b>{game.mystery.location}</b></div><div className="rail-facts"><span>TIME OF INCIDENT</span><b>{game.mystery.crimeTime}</b></div><div className="rail-facts"><span>SUSPECTS</span><b>{game.mystery.suspects.length} persons</b></div><div className="rail-rule" /><div className="rail-note"><LockKeyhole size={15} /><p>The solution is stored securely and remains sealed until you submit an accusation.</p></div><button className="rail-help" onClick={() => switchTab('hints')}><BadgeHelp size={14} /> Need a hint?</button></aside>
    </div>
  </main>;
}
