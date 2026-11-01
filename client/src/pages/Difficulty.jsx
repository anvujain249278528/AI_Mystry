import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Fingerprint, LoaderCircle, PenLine, Sparkles } from 'lucide-react';
import { BackRow, InlineError, PageHeading, Radio } from '../components/ui.jsx';
import { friendlyError } from '../lib/api.js';
import { startCase } from '../lib/startCase.js';

const levels = [
  { id: 'easy', number: '01', label: 'A first inquiry', suspects: '03 suspects', clues: '05 clues · 2 hints', description: 'A clean trail. Clear motives and contradictions that reward careful observation.', mark: 'THE OPENING CASE' },
  { id: 'medium', number: '02', label: 'A tangled account', suspects: '04 suspects', clues: '07 clues · 3 hints', description: 'More than one story could fit. Separate what feels suspicious from what the evidence proves.', mark: 'THE INVESTIGATOR' },
  { id: 'hard', number: '03', label: 'The finer details', suspects: '05 suspects', clues: '09 clues · 3 hints', description: 'Subtle contradictions, layered motives, and a timeline that asks you to look twice.', mark: 'THE COLD CASE' },
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

  return <main className="page-width min-h-[calc(100vh-143px)] pt-10 pb-[58px] max-[620px]:pt-6 max-[620px]:pb-10">
    <BackRow onBack={() => navigate('/')}>CASE SETUP <i>—</i> 01 / 02</BackRow>
    <PageHeading icon={Sparkles} eyebrow="Set your own pace" title={<>Choose your<br /><em>difficulty.</em></>}>Every case follows the same rule: the truth is there from the start. Choose how much you want to untangle.</PageHeading>
    <div className="grid grid-cols-3 gap-[13px] max-[620px]:grid-cols-1 max-[620px]:gap-2">
      {levels.map((level) => {
        const isSelected = selected === level.id;
        return <button key={level.id} onClick={() => setSelected(level.id)} aria-pressed={isSelected}
          className={`relative flex min-h-[249px] cursor-pointer flex-col justify-between border px-[21px] pt-5 pb-[17px] text-left transition hover:-translate-y-0.5 max-[620px]:min-h-[174px] max-[620px]:p-[15px] ${isSelected
            ? 'border-gold bg-[#1c1c20] bg-[linear-gradient(140deg,rgba(92,73,40,.36),#1c1c20_78%)] shadow-[0_0_0_1px_rgba(201,164,92,.11)]'
            : 'border-paper/10 bg-[#191b22] bg-[linear-gradient(140deg,#22242d,#191b22_75%)] hover:border-gold/55'}`}>
          <div className="flex items-center justify-between"><span className="font-mono text-[9px] text-[#777781]">{level.number}</span><Radio checked={isSelected} /></div>
          <div>
            <span className="font-mono text-[8px] tracking-[.16em] text-gold">{level.mark}</span>
            <h2 className="mt-[11px] mb-2 font-serif text-[23px] font-medium">{level.label}</h2>
            <p className="m-0 max-w-[250px] text-[11px] leading-[1.72] text-[#a3a3aa] max-[620px]:max-w-[430px]">{level.description}</p>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-[13px] font-mono text-[8px] tracking-[.1em] text-[#c2c0b9] uppercase"><span>{level.suspects}</span><span>{level.clues}</span></div>
        </button>;
      })}
    </div>
    <div className="flex items-center justify-between pt-[23px] max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-2.5 max-[620px]:pt-[15px]">
      <p className="flex max-w-[500px] items-center gap-[9px] text-[10px] leading-[1.6] text-[#93939b] max-[620px]:m-0 max-[620px]:text-[9px]"><Fingerprint size={15} className="shrink-0 text-gold" /> Your case is generated when you continue. The solution is fixed before play begins.</p>
      <button className="button button-gold min-w-[196px] max-[620px]:w-full" onClick={begin} disabled={busy}>{busy ? <><LoaderCircle className="spin" size={16} /> Preparing case</> : <>Generate mystery <ArrowRight size={16} /></>}</button>
    </div>
    {error && <InlineError message={error} onRetry={begin} />}
    <Link to="/create" className="mt-7 flex items-center gap-[15px] border border-dashed border-gold/40 bg-gold/4 px-[19px] py-[17px] text-muted transition-colors hover:border-gold hover:bg-gold/8">
      <PenLine size={18} strokeWidth={1.4} className="shrink-0 text-gold" />
      <div className="grid flex-1 gap-1"><b className="font-serif text-[17px] font-medium text-paper">Have a story in mind?</b><span className="text-[11px] leading-[1.6]">Write your own case idea and the AI will build the suspects, clues, and solution around it.</span></div>
      <ArrowRight size={16} />
    </Link>
  </main>;
}
