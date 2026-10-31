import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock3, Fingerprint, MapPin, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Eyebrow, ErrorPanel, PageLoading } from '../components/SiteChrome.jsx';
import { api } from '../lib/api.js';
import { updateSession } from '../lib/sessionStore.js';

export default function Result() {
  const { sessionId } = useParams();
  const location = useLocation();
  const [payload, setPayload] = useState(location.state?.payload || null);
  const [loading, setLoading] = useState(!location.state?.payload);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const routedPayload = location.state?.payload;
    if (routedPayload) {
      setPayload(routedPayload);
      updateSession(sessionId, { status: 'completed', score: routedPayload.result.finalScore, isCorrect: routedPayload.result.isCorrect });
      setLoading(false);
      return;
    }
    let active = true;
    setPayload(null);
    setError('');
    setLoading(true);
    api(`/games/${sessionId}/result`, { sessionId }).then((data) => {
      if (!active) return;
      setPayload(data);
      updateSession(sessionId, { status: 'completed', score: data.result.finalScore, isCorrect: data.result.isCorrect });
    }).catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [sessionId, location.key, retryCount]);

  if (loading) return <PageLoading label="Unsealing the case solution" />;
  if (error || !payload) return <main className="content-width page-error-wrap"><ErrorPanel message={error || 'The case result is unavailable.'} onRetry={() => { setError(''); setLoading(true); setRetryCount((count) => count + 1); }} backTo="/investigations" /></main>;

  const { result, solution, mystery } = payload;
  const correct = result.isCorrect;
  return <main className="result-page content-width">
    <div className="result-back"><Link to="/investigations"><ArrowLeft size={14} /> My investigations</Link><span>CASE CLOSED <i>·</i> {new Date(result.completedAt).toLocaleDateString()}</span></div>
    <section className={`result-hero ${correct ? 'solved' : 'unsolved'}`}>
      <div className="result-hero-copy"><Eyebrow icon={correct ? ShieldCheck : Fingerprint}>Final case report <span className={`difficulty-tag tag-${mystery.difficulty}`}>{mystery.difficulty}</span></Eyebrow><div className="result-verdict"><span className="verdict-icon">{correct ? <Check size={23} /> : <X size={23} />}</span><h1>{correct ? <>Case <em>solved.</em></> : <>Case <em>unsolved.</em></>}</h1></div><p>{correct ? 'Your read of the evidence held up. The pieces you followed led to the truth.' : 'The evidence pointed to another person. The full account is now yours to examine.'}</p><div className="result-case-name">{mystery.title} <span>·</span> {mystery.category}</div></div>
      <div className="score-card"><span>INVESTIGATION SCORE</span><strong>{String(result.finalScore).padStart(3, '0')}</strong><small>OUT OF 100 POINTS</small><div className="score-rule"><i style={{ width: `${result.finalScore}%` }} /></div><div className="score-detail"><span>{result.hintsUsed} hints used</span><span>{correct ? `${result.hintsUsed * 10} points deducted` : 'Incorrect accusation'}</span></div></div>
      <div className="result-hero-watermark"><Fingerprint size={165} strokeWidth={0.55} /></div>
    </section>

    <section className="verdict-summary"><div className="verdict-party"><span>YOUR ACCUSATION</span><strong>{result.selectedSuspect.name}</strong><small>{result.selectedSuspect.occupation}</small></div><div className="verdict-arrow"><ArrowRight size={18} /><span>{correct ? 'MATCHED' : 'DID NOT MATCH'}</span></div><div className="verdict-party actual"><span>THE CULPRIT</span><strong>{result.actualCulprit.name}</strong><small>{result.actualCulprit.occupation}</small></div></section>

    <div className="solution-heading"><div><Eyebrow icon={Sparkles}>The sealed solution</Eyebrow><h2>What <em>really</em> happened.</h2><p>The answer, built from the case's fixed timeline and evidence.</p></div><span className="solution-seal"><Check size={14} /> REVEALED</span></div>
    <section className="solution-grid"><article className="solution-card motive"><span>01 / THE MOTIVE</span><h3>Why it happened</h3><p>{solution.motive}</p></article><article className="solution-card method"><span>02 / THE METHOD</span><h3>How it happened</h3><p>{solution.method}</p></article><article className="solution-card timeline"><span>03 / THE TIMELINE</span><h3>When it happened</h3><p>{solution.timeline}</p></article></section>
    <section className="explanation-card"><div><span>THE COMPLETE EXPLANATION</span><h3>Putting the story together</h3></div><p>{solution.explanation}</p></section>
    {!correct && <section className="wrong-accusation-note"><Fingerprint size={17} /><div><span>WHY YOUR ACCUSATION DID NOT FIT</span><p>{solution.whySelectedWasIncorrect}</p></div></section>}

    <section className="decisive-section"><div className="decisive-heading"><div><Eyebrow icon={Fingerprint}>The decisive evidence</Eyebrow><h2>The details that <em>settled it.</em></h2></div><span>{solution.decisiveClues.length} KEY {solution.decisiveClues.length === 1 ? 'CLUE' : 'CLUES'}</span></div><div className="decisive-grid">{solution.decisiveClues.map((clue, index) => <article className="decisive-card" key={clue.id}><span>{clue.id} <i>·</i> KEY EVIDENCE</span><b>0{index + 1}</b><h3>{clue.title}</h3><p>{clue.description}</p><small><MapPin size={12} /> {clue.discoveryLocation}</small></article>)}</div></section>

    <section className="result-summary"><div><Eyebrow icon={Clock3}>Your investigation</Eyebrow><h2>A record of the work.</h2></div><div className="summary-metrics"><div><b>{result.investigationSummary.cluesDiscovered}</b><span>CLUES FOUND</span></div><div><b>{result.investigationSummary.suspectsQuestioned}</b><span>SUSPECTS QUESTIONED</span></div><div><b>{result.investigationSummary.interviews}</b><span>INTERVIEW TURNS</span></div><div><b>{result.hintsUsed}</b><span>HINTS REQUESTED</span></div></div></section>
    <section className="result-actions"><Link className="button button-gold" to="/new"><RotateCcw size={15} /> Start another investigation <ArrowRight size={15} /></Link><Link className="button button-outline" to="/">Return to the room</Link></section>
  </main>;
}
