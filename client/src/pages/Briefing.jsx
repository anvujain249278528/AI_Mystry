import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock3, Fingerprint, MapPin, UserRound } from 'lucide-react';
import { Eyebrow, ErrorPanel, PageLoading } from '../components/SiteChrome.jsx';
import { useGame } from '../hooks/useGame.js';

export default function Briefing() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { game, loading, error, refresh } = useGame(sessionId);
  if (loading) return <PageLoading label="Bringing up the case file" />;
  if (error || !game) return <main className="content-width page-error-wrap"><ErrorPanel message={error || 'We could not find this investigation.'} onRetry={refresh} backTo="/investigations" /></main>;

  const mystery = game.mystery;
  return <main className="briefing-page content-width">
    <div className="back-row"><button className="back-button" onClick={() => navigate('/new')}><ArrowLeft size={14} /> New case</button><span>CASE FILE <i>—</i> 02 / 02</span></div>
    <div className="briefing-grid">
      <section className="briefing-main">
        <Eyebrow icon={Fingerprint}>Case briefing <span className={`difficulty-tag tag-${mystery.difficulty}`}>{mystery.difficulty}</span>{mystery.origin === 'custom' && <span className="difficulty-tag custom-tag">Your story</span>}</Eyebrow>
        <h1>{mystery.title}</h1>
        <div className="briefing-category">{mystery.category} <span>·</span> {mystery.difficulty} inquiry</div>
        <div className="briefing-rule" />
        <h2>What we know</h2>
        <p className="briefing-scenario">{mystery.scenario}</p>
        <div className="briefing-note"><span>INITIAL BRIEFING</span><p>{mystery.briefing}</p></div>
        {mystery.victimDetails && <div className="victim-note"><UserRound size={15} /><span>{mystery.victimDetails}</span></div>}
        <button className="button button-gold briefing-enter" onClick={() => navigate(`/investigation/${sessionId}`)}>Enter investigation room <ArrowRight size={16} /></button>
      </section>
      <aside className="briefing-aside">
        <div className="briefing-aside-label"><span>CASE DETAILS</span><i>FILED / 01</i></div>
        <div className="case-detail"><MapPin size={16} /><div><span>LOCATION</span><b>{mystery.location}</b></div></div>
        <div className="case-detail"><Clock3 size={16} /><div><span>TIME OF INCIDENT</span><b>{mystery.crimeTime}</b></div></div>
        <div className="case-detail"><UserRound size={16} /><div><span>PERSONS OF INTEREST</span><b>{mystery.suspects.length} suspects</b></div></div>
        <div className="case-detail"><Fingerprint size={16} /><div><span>AVAILABLE EVIDENCE</span><b>{mystery.clues.length} initial clues</b></div></div>
        <div className="briefing-aside-foot"><span className="sealed-dot" /> SOLUTION SEALED UNTIL ACCUSATION</div>
        <Link to="/how-to-play" className="briefing-help">How to play this case <ArrowRight size={13} /></Link>
      </aside>
    </div>
  </main>;
}
