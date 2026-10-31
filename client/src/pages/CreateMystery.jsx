import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Dices, Fingerprint, LoaderCircle, PenLine } from 'lucide-react';
import { Eyebrow } from '../components/SiteChrome.jsx';
import { friendlyError } from '../lib/api.js';
import { startCase } from '../lib/startCase.js';

// Keep in sync with customCaseOptions in server/src/services/mysteryService.js.
const LIMITS = { title: [3, 80], story: [20, 800], setting: [0, 120] };

const categories = [
  { id: 'surprise', label: 'Surprise me' },
  { id: 'theft', label: 'Theft' },
  { id: 'disappearance', label: 'Disappearance' },
  { id: 'forgery', label: 'Forgery' },
  { id: 'sabotage', label: 'Sabotage' },
  { id: 'blackmail', label: 'Blackmail' },
  { id: 'murder', label: 'Murder (non-graphic)' },
];

const tones = [
  { id: 'classic', label: 'Classic', note: 'Old-school whodunit' },
  { id: 'cozy', label: 'Cozy', note: 'Warm, small-town charm' },
  { id: 'noir', label: 'Noir', note: 'Rain, shadows, secrets' },
  { id: 'spooky', label: 'Spooky', note: 'Eerie, but no gore' },
  { id: 'lighthearted', label: 'Lighthearted', note: 'Funny and playful' },
];

const levels = [
  { id: 'easy', label: 'Easy', detail: '3 suspects · 5 clues · 2 hints · 100 pts' },
  { id: 'medium', label: 'Medium', detail: '4 suspects · 7 clues · 3 hints · 150 pts' },
  { id: 'hard', label: 'Hard', detail: '5 suspects · 9 clues · 3 hints · 200 pts' },
];

const examples = [
  { title: 'The Midnight Train to Mysore', story: 'A famous violinist boards the overnight train with a priceless antique violin. By morning the violin case is empty, the train never stopped, and only the passengers in the first-class coach could have reached it.', setting: 'An overnight sleeper train in South India', category: 'theft', tone: 'classic' },
  { title: 'The Last Lecture', story: 'A strict college professor vanishes the night before final exams. The question paper is missing from the locked staff room, and four students were seen near the building after dark.', setting: 'An engineering college campus during exam week', category: 'disappearance', tone: 'noir' },
  { title: 'The Bakery Bake-Off Scandal', story: 'On the morning of the town baking contest, the favourite to win finds her secret recipe book swapped with a fake. Someone wanted her to lose, and every rival baker had a key to the shared kitchen.', setting: 'A small hill-town bakery festival', category: 'sabotage', tone: 'lighthearted' },
  { title: 'Whispers in Room 13', story: 'Guests at an old heritage hotel report a ghost in room 13. When the owner\'s valuable family portrait disappears from that room, the "ghost" becomes the main suspect, but someone very human is behind it.', setting: 'A crumbling heritage hotel on a stormy night', category: 'theft', tone: 'spooky' },
];

const empty = { title: '', story: '', setting: '', category: 'surprise', tone: 'classic', difficulty: 'medium' };

function fieldError(name, value) {
  const [min, max] = LIMITS[name];
  const length = value.trim().length;
  if (name === 'setting' && length === 0) return '';
  if (length < min) return `Write at least ${min} characters.`;
  if (length > max) return `Keep it under ${max} characters.`;
  return '';
}

export default function CreateMystery() {
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const errors = { title: fieldError('title', form.title), story: fieldError('story', form.story), setting: fieldError('setting', form.setting) };
  const isValid = !errors.title && !errors.story && !errors.setting;
  const update = (name) => (event) => setForm({ ...form, [name]: event.target.value });
  const choose = (name, value) => setForm({ ...form, [name]: value });
  const blur = (name) => () => setTouched({ ...touched, [name]: true });

  function surprise() {
    const pick = examples[Math.floor(Math.random() * examples.length)];
    setForm({ ...form, ...pick });
    setTouched({});
  }

  async function submit(event) {
    event.preventDefault();
    setTouched({ title: true, story: true, setting: true });
    if (!isValid || busy) return;
    setBusy(true);
    setError('');
    try {
      const { difficulty, ...custom } = form;
      const sessionId = await startCase({ difficulty, custom });
      navigate(`/case/${sessionId}`);
    } catch (createError) {
      setError(friendlyError(createError));
    } finally {
      setBusy(false);
    }
  }

  const counter = (name) => <small className={form[name].trim().length > LIMITS[name][1] ? 'over' : ''}>{form[name].trim().length}/{LIMITS[name][1]}</small>;
  const showError = (name) => touched[name] && errors[name] && <span className="field-error">{errors[name]}</span>;

  return <main className="create-page content-width">
    <div className="back-row"><button className="back-button" onClick={() => navigate('/')}><ArrowLeft size={14} /> Back to the room</button><span>CUSTOM CASE <i>—</i> YOUR STORY</span></div>
    <header className="difficulty-heading"><Eyebrow icon={PenLine}>Write the opening chapter</Eyebrow><h1>Create your own<br /><em>mystery.</em></h1><p>Give the case a name and an idea. The AI writes the suspects, the evidence, and a hidden solution around it. Even you won't know who did it.</p></header>

    <form className="create-form" onSubmit={submit} noValidate>
      <div className="create-form-main">
        <div className="create-toolbar"><span>CASE FILE</span><button type="button" className="surprise-button" onClick={surprise} disabled={busy}><Dices size={14} /> Fill with an example</button></div>

        <label className="create-field">
          <span className="create-label">Case title <b>*</b></span>
          <input value={form.title} onChange={update('title')} onBlur={blur('title')} maxLength={LIMITS.title[1] + 20} placeholder="e.g. The Midnight Train to Mysore" disabled={busy} />
          <div className="field-foot">{showError('title') || <span>A name for your case file.</span>}{counter('title')}</div>
        </label>

        <label className="create-field">
          <span className="create-label">Story idea <b>*</b></span>
          <textarea rows={6} value={form.story} onChange={update('story')} onBlur={blur('story')} maxLength={LIMITS.story[1] + 50} placeholder="What happened? Who is involved? What is missing, broken, or wrong?" disabled={busy} />
          <div className="field-foot">{showError('story') || <span>A few sentences is plenty. Don't decide the culprit, the AI will.</span>}{counter('story')}</div>
        </label>

        <label className="create-field">
          <span className="create-label">Setting <i>optional</i></span>
          <input value={form.setting} onChange={update('setting')} onBlur={blur('setting')} maxLength={LIMITS.setting[1] + 20} placeholder="e.g. A heritage hotel on a stormy night" disabled={busy} />
          <div className="field-foot">{showError('setting') || <span>Where and when it takes place.</span>}{counter('setting')}</div>
        </label>

        <fieldset className="create-field" disabled={busy}>
          <legend className="create-label">Type of case</legend>
          <div className="chip-row">{categories.map((item) => <button type="button" key={item.id} className={`chip ${form.category === item.id ? 'selected' : ''}`} aria-pressed={form.category === item.id} onClick={() => choose('category', item.id)}>{item.label}</button>)}</div>
        </fieldset>

        <fieldset className="create-field" disabled={busy}>
          <legend className="create-label">Tone</legend>
          <div className="tone-grid">{tones.map((item) => <button type="button" key={item.id} className={`tone-card ${form.tone === item.id ? 'selected' : ''}`} aria-pressed={form.tone === item.id} onClick={() => choose('tone', item.id)}><b>{item.label}</b><span>{item.note}</span></button>)}</div>
        </fieldset>
      </div>

      <aside className="create-side">
        <fieldset className="create-field" disabled={busy}>
          <legend className="create-label">Difficulty</legend>
          <div className="level-list">{levels.map((level) => <button type="button" key={level.id} className={`level-option ${form.difficulty === level.id ? 'selected' : ''}`} aria-pressed={form.difficulty === level.id} onClick={() => choose('difficulty', level.id)}><span className="difficulty-radio">{form.difficulty === level.id && <i />}</span><div><b>{level.label}</b><small>{level.detail}</small></div></button>)}</div>
        </fieldset>

        <div className="create-preview">
          <span className="create-preview-label">PREVIEW</span>
          <h3>{form.title.trim() || 'Untitled case'}</h3>
          <p>{form.story.trim() || 'Your story idea will appear here.'}</p>
          <div className="create-preview-tags"><span>{categories.find((c) => c.id === form.category)?.label}</span><span>{form.tone}</span><span>{form.difficulty}</span></div>
        </div>

        <button type="submit" className="button button-gold generate-button create-submit" disabled={busy || (!isValid && Object.keys(touched).length > 0)}>
          {busy ? <><LoaderCircle className="spin" size={16} /> Building your case</> : <>Create my mystery <ArrowRight size={16} /></>}
        </button>
        <p className="create-note"><Fingerprint size={14} /> {busy ? 'Writing suspects and hiding clues. This takes a few seconds.' : 'The solution is fixed before you start playing.'}</p>
      </aside>
    </form>

    {error && <div className="inline-error"><span>!</span><p>{error}</p><button onClick={submit}>Retry</button></div>}
  </main>;
}
