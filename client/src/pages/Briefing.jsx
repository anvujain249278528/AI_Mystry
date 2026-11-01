import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock3, Fingerprint, MapPin, UserRound } from 'lucide-react';
import { Eyebrow, ErrorPanel, PageLoading } from '../components/SiteChrome.jsx';
import { BackRow } from '../components/ui.jsx';
import { useGame } from '../hooks/useGame.js';

const smallLabel = 'font-mono text-[8px] tracking-[.15em] text-gold';

function CaseDetail({ icon: Icon, label, value }) {
  return <div className="flex gap-3 border-b border-line py-[17px] text-gold max-[620px]:py-[11px]">
    <Icon size={16} className="shrink-0" />
    <div className="flex flex-col gap-1.5"><span className="font-mono text-[7px] tracking-[.15em] text-[#85858d]">{label}</span><b className="text-[11px] font-medium text-[#e4e1d9]">{value}</b></div>
  </div>;
}

export default function Briefing() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { game, loading, error, refresh } = useGame(sessionId);
  if (loading) return <PageLoading label="Bringing up the case file" />;
  if (error || !game) return <main className="page-width min-h-[55vh]"><ErrorPanel message={error || 'We could not find this investigation.'} onRetry={refresh} backTo="/investigations" /></main>;

  const mystery = game.mystery;
  return <main className="page-width pt-[34px] pb-[88px] max-[620px]:pt-6 max-[620px]:pb-[60px]">
    <BackRow onBack={() => navigate('/new')} backLabel="New case">CASE FILE <i>—</i> 02 / 02</BackRow>
    <div className="grid grid-cols-[minmax(0,1fr)_305px] items-start gap-[88px] px-[4%] pt-[58px] max-[820px]:gap-[35px] max-[820px]:px-0 max-[620px]:grid-cols-1 max-[620px]:gap-[25px] max-[620px]:pt-[39px]">
      <section>
        <Eyebrow icon={Fingerprint} className="mb-[17px]">Case briefing <span className={`difficulty-tag tag-${mystery.difficulty}`}>{mystery.difficulty}</span>{mystery.origin === 'custom' && <span className="difficulty-tag custom-tag">Your story</span>}</Eyebrow>
        <h1 className="m-0 max-w-[720px] font-serif text-[clamp(39px,5vw,60px)] leading-[1.08] font-medium tracking-[-.03em] max-[620px]:text-[41px]">{mystery.title}</h1>
        <div className="mt-[13px] font-mono text-[9px] tracking-[.1em] text-[#9b9ba3] uppercase">{mystery.category} <span className="px-2 text-gold">·</span> {mystery.difficulty} inquiry</div>
        <div className="mt-[34px] mb-[23px] w-14 border-t border-gold" />
        <h2 className="mt-0 mb-[11px] font-serif text-xl font-medium">What we know</h2>
        <p className="m-0 max-w-[660px] font-serif text-[15px] leading-[1.9] text-[#c4c3be] max-[620px]:text-[13px]">{mystery.scenario}</p>
        <div className="mt-[26px] border-l-2 border-gold/55 bg-white/[.035] px-5 py-[18px]"><span className={smallLabel}>INITIAL BRIEFING</span><p className="mt-[9px] mb-0 text-[11px] leading-[1.8] text-[#aaa9a4]">{mystery.briefing}</p></div>
        {mystery.victimDetails && <div className="mt-4 flex items-start gap-[9px] text-[10px] leading-[1.7] text-[#a9a8a1]"><UserRound size={15} className="mt-px shrink-0 text-gold" /><span>{mystery.victimDetails}</span></div>}
        <button className="button button-gold mt-[30px]" onClick={() => navigate(`/investigation/${sessionId}`)}>Enter investigation room <ArrowRight size={16} /></button>
      </section>
      <aside className="border border-line bg-[#191b21] p-5 max-[620px]:-order-1">
        <div className={`flex justify-between border-b border-line pb-[15px] ${smallLabel}`}><span>CASE DETAILS</span><i className="not-italic text-[#777880]">FILED / 01</i></div>
        <CaseDetail icon={MapPin} label="LOCATION" value={mystery.location} />
        <CaseDetail icon={Clock3} label="TIME OF INCIDENT" value={mystery.crimeTime} />
        <CaseDetail icon={UserRound} label="PERSONS OF INTEREST" value={`${mystery.suspects.length} suspects`} />
        <CaseDetail icon={Fingerprint} label="AVAILABLE EVIDENCE" value={`${mystery.clues.length} initial clues · ${game.rules.maxHints} hints`} />
        <div className="flex items-center gap-2 pt-[18px] pb-[11px] font-mono text-[7px] tracking-[.1em] text-[#aaa8a0] max-[620px]:pt-[13px]"><span className="size-[5px] rounded-full bg-gold" /> SOLUTION SEALED UNTIL ACCUSATION</div>
        <Link to="/how-to-play" className="mt-[7px] inline-flex items-center gap-2 font-mono text-[8px] tracking-[.08em] text-gold-light uppercase">How to play this case <ArrowRight size={13} /></Link>
      </aside>
    </div>
  </main>;
}
