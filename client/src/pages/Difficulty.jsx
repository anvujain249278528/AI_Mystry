import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Fingerprint, LoaderCircle, PenLine, Sparkles } from 'lucide-react';
import { Eyebrow } from '../components/SiteChrome.jsx';
import { friendlyError } from '../lib/api.js';
import { startCase } from '../lib/startCase.js';

const levels = [
  { id: 'easy', number: '01', label: 'A first inquiry', suspects: '03 suspects', clues: '04—05 clues', description: 'A clean trail. Clear motives and contradictions that reward careful observation.', mark: 'THE OPENING CASE' },
  { id: 'medium', number: '02', label: 'A tangled account', suspects: '04 suspects', clues: '06—08 clues', description: 'More than one story could fit. Separate what feels suspicious from what the evidence proves.', mark: 'THE INVESTIGATOR' },
  { id: 'hard', number: '03', label: 'The finer details', suspects: '05 suspects', clues: '09—12 clues', description: 'Subtle contradictions, layered motives, and a timeline that asks you to look twice.', mark: 'THE COLD CASE' },
];

export default function Difficulty() {
  const [selected, setSelected] = useState('medium');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function begin() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const sessionId = await startCase({ difficulty: selected });
      navigate(`/case/${sessionId}`);
    } catch (generateError) {
      setError(friendlyError(generateError));
    } finally {
      setBusy(false);
    }
  }

  return <main className="difficulty-page content-width">
    <div className="back-row"><button className="back-button" onClick={() => navigate('/')}><ArrowLeft size={14} /> Back to the room</button><span>CASE SETUP <i>—</i> 01 / 02</span></div>
    <header className="difficulty-heading"><Eyebrow icon={Sparkles}>Set your own pace</Eyebrow><h1>Choose your<br /><em>difficulty.</em></h1><p>Every case follows the same rule: the truth is there from the start. Choose how much you want to untangle.</p></header>
    <div className="difficulty-grid">
      {levels.map((level) => <button key={level.id} className={`difficulty-card ${selected === level.id ? 'selected' : ''}`} onClick={() => setSelected(level.id)} aria-pressed={selected === level.id}>
        <div className="difficulty-card-top"><span>{level.number}</span><span className="difficulty-radio">{selected === level.id && <i />}</span></div>
        <div className="difficulty-card-middle"><span className="difficulty-mark">{level.mark}</span><h2>{level.label}</h2><p>{level.description}</p></div>
        <div className="difficulty-card-bottom"><span>{level.suspects}</span><span>{level.clues}</span></div>
      </button>)}
    </div>
    <div className="difficulty-footer"><p><Fingerprint size={15} /> Your case is generated when you continue. The solution is fixed before play begins.</p><button className="button button-gold generate-button" onClick={begin} disabled={busy}>{busy ? <><LoaderCircle className="spin" size={16} /> Preparing case</> : <>Generate mystery <ArrowRight size={16} /></>}</button></div>
    {error && <div className="inline-error"><span>!</span><p>{error}</p><button onClick={begin}>Retry</button></div>}
    <Link className="create-own-banner" to="/create"><PenLine size={18} strokeWidth={1.4} /><div><b>Have a story in mind?</b><span>Write your own case idea and the AI will build the suspects, clues, and solution around it.</span></div><ArrowRight size={16} /></Link>
  </main>;
}
