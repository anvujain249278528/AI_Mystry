import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Dices, Fingerprint, LoaderCircle, PenLine } from 'lucide-react';
import { BackRow, InlineError, PageHeading, Radio, optionCard } from '../components/ui.jsx';
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

  const counter = (name) => <small className={`shrink-0 font-mono text-[9px] ${form[name].trim().length > LIMITS[name][1] ? 'text-error' : ''}`}>{form[name].trim().length}/{LIMITS[name][1]}</small>;
  const hint = (name, text) => <span className={touched[name] && errors[name] ? 'text-error' : ''}>{touched[name] && errors[name] ? errors[name] : text}</span>;

  // Shared Tailwind class strings for this form.
  const field = 'm-0 mb-[22px] grid min-w-0 gap-[9px] border-0 p-0';
  const label = 'p-0 font-mono text-[9px] tracking-[.14em] text-[#c9c7c0] uppercase [&_b]:font-normal [&_b]:text-gold [&_i]:ml-1.5 [&_i]:not-italic [&_i]:tracking-[.06em] [&_i]:normal-case [&_i]:text-faint';
  const input = 'w-full border border-paper/14 bg-[#14151b] px-3.5 py-[13px] font-sans text-sm leading-[1.6] text-paper outline-0 transition placeholder:text-[#6e6f78] focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,164,92,.12)] disabled:opacity-60';
  const foot = 'flex justify-between gap-3 text-[11px] leading-[1.5] text-faint';
  const panel = 'border border-line bg-[linear-gradient(140deg,#1f212a,#17181e_80%)] p-[22px] max-[620px]:p-4';

  return <main className="page-width min-h-[calc(100vh-143px)] pt-10 pb-16">
    <BackRow onBack={() => navigate('/')}>CUSTOM CASE <i>—</i> YOUR STORY</BackRow>
    <PageHeading icon={PenLine} eyebrow="Write the opening chapter" title={<>Create your own<br /><em>mystery.</em></>}>Give the case a name and an idea. The AI writes the suspects, the evidence, and a hidden solution around it. Even you won't know who did it.</PageHeading>

    <form className="grid grid-cols-[minmax(0,1fr)_330px] items-start gap-[18px] max-[980px]:grid-cols-1" onSubmit={submit} noValidate>
      <div className={panel}>
        <div className="mb-5 flex items-center justify-between border-b border-line pb-[15px] font-mono text-[9px] tracking-[.16em] text-faint max-[620px]:flex-wrap max-[620px]:gap-2.5">
          <span>CASE FILE</span>
          <button type="button" onClick={surprise} disabled={busy} className="inline-flex cursor-pointer items-center gap-[7px] border border-gold/35 bg-transparent px-[11px] py-2 font-mono text-[9px] tracking-[.06em] text-gold-light uppercase hover:enabled:border-gold hover:enabled:bg-gold/8"><Dices size={14} /> Fill with an example</button>
        </div>

        <label className={field}>
          <span className={label}>Case title <b>*</b></span>
          <input className={input} value={form.title} onChange={update('title')} onBlur={blur('title')} maxLength={LIMITS.title[1] + 20} placeholder="e.g. The Midnight Train to Mysore" disabled={busy} />
          <div className={foot}>{hint('title', 'A name for your case file.')}{counter('title')}</div>
        </label>

        <label className={field}>
          <span className={label}>Story idea <b>*</b></span>
          <textarea className={`${input} min-h-[140px] resize-y`} rows={6} value={form.story} onChange={update('story')} onBlur={blur('story')} maxLength={LIMITS.story[1] + 50} placeholder="What happened? Who is involved? What is missing, broken, or wrong?" disabled={busy} />
          <div className={foot}>{hint('story', "A few sentences is plenty. Don't decide the culprit, the AI will.")}{counter('story')}</div>
        </label>

        <label className={field}>
          <span className={label}>Setting <i>optional</i></span>
          <input className={input} value={form.setting} onChange={update('setting')} onBlur={blur('setting')} maxLength={LIMITS.setting[1] + 20} placeholder="e.g. A heritage hotel on a stormy night" disabled={busy} />
          <div className={foot}>{hint('setting', 'Where and when it takes place.')}{counter('setting')}</div>
        </label>

        <fieldset className={field} disabled={busy}>
          <legend className={`${label} mb-[9px]`}>Type of case</legend>
          <div className="flex flex-wrap gap-2">{categories.map((item) => {
            const isSelected = form.category === item.id;
            return <button type="button" key={item.id} aria-pressed={isSelected} onClick={() => choose('category', item.id)}
              className={`cursor-pointer border px-[13px] py-[9px] text-xs transition ${isSelected ? 'border-gold bg-gold/12 text-gold-light' : 'border-paper/16 bg-transparent text-muted hover:enabled:border-gold/55 hover:enabled:text-paper'}`}>{item.label}</button>;
          })}</div>
        </fieldset>

        <fieldset className={`${field} mb-0`} disabled={busy}>
          <legend className={`${label} mb-[9px]`}>Tone</legend>
          <div className="grid grid-cols-5 gap-2 max-[980px]:grid-cols-3 max-[620px]:grid-cols-2">{tones.map((item) => (
            <button type="button" key={item.id} aria-pressed={form.tone === item.id} onClick={() => choose('tone', item.id)} className={`grid gap-[5px] px-[11px] py-3 ${optionCard(form.tone === item.id)}`}>
              <b className="font-serif text-base font-medium text-paper">{item.label}</b><span className="text-[10px] leading-[1.45] text-faint">{item.note}</span>
            </button>
          ))}</div>
        </fieldset>
      </div>

      <aside className={`${panel} sticky top-[18px] grid gap-[18px] max-[980px]:static`}>
        <fieldset className="m-0 grid min-w-0 gap-[9px] border-0 p-0" disabled={busy}>
          <legend className={`${label} mb-[9px]`}>Difficulty</legend>
          <div className="grid gap-2">{levels.map((level) => (
            <button type="button" key={level.id} aria-pressed={form.difficulty === level.id} onClick={() => choose('difficulty', level.id)} className={`flex items-center gap-3 px-[13px] py-3 ${optionCard(form.difficulty === level.id)}`}>
              <Radio checked={form.difficulty === level.id} />
              <div className="grid gap-[3px]"><b className="font-serif text-base font-medium">{level.label}</b><small className="font-mono text-[9px] tracking-[.06em] text-faint">{level.detail}</small></div>
            </button>
          ))}</div>
        </fieldset>

        <div className="border border-gold/25 bg-[#15161c] p-4">
          <span className="font-mono text-[8px] tracking-[.18em] text-gold">PREVIEW</span>
          <h3 className="mt-[9px] mb-[7px] font-serif text-[21px] leading-[1.2] font-medium wrap-anywhere">{form.title.trim() || 'Untitled case'}</h3>
          <p className="m-0 line-clamp-5 text-[11px] leading-[1.65] wrap-anywhere text-[#a3a3aa]">{form.story.trim() || 'Your story idea will appear here.'}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{[categories.find((c) => c.id === form.category)?.label, form.tone, form.difficulty].map((tag) => <span key={tag} className="border border-line px-[7px] py-1 font-mono text-[8px] tracking-[.1em] text-[#c2c0b9] uppercase">{tag}</span>)}</div>
        </div>

        <button type="submit" className="button button-gold w-full" disabled={busy || (!isValid && Object.keys(touched).length > 0)}>
          {busy ? <><LoaderCircle className="spin" size={16} /> Building your case</> : <>Create my mystery <ArrowRight size={16} /></>}
        </button>
        <p className="-mt-1.5 mb-0 flex items-start gap-2 text-[10px] leading-[1.6] text-[#93939b]"><Fingerprint size={14} className="mt-0.5 shrink-0 text-gold" /> {busy ? 'Writing suspects and hiding clues. This takes a few seconds.' : 'The solution is fixed before you start playing.'}</p>
      </aside>
    </form>

    {error && <InlineError message={error} onRetry={submit} />}
  </main>;
}
