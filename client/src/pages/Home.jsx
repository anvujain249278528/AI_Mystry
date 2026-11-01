import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Fingerprint, Lightbulb, PenLine, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { Eyebrow } from '../components/SiteChrome.jsx';

const features = [
  { icon: ScanSearch, number: '01', title: 'Follow the evidence', body: 'Every clue belongs to a case. Look closely, connect details, and decide what the facts are telling you.' },
  { icon: BookOpen, number: '02', title: 'Hear every story', body: 'Question each suspect. Their accounts are shaped by the same fixed events, even when they see them differently.' },
  { icon: Lightbulb, number: '03', title: 'Trust your deduction', body: 'Ask for a nudge when you need it, then make one final accusation and see how your reasoning holds up.' },
];

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid" />
        <div className="hero-ambient ambient-one" />
        <div className="hero-ambient ambient-two" />
        <div className="hero-content">
          <Eyebrow icon={Sparkles}>An interactive detective experience</Eyebrow>
          <h1>Every mystery<br />has a <em>secret.</em></h1>
          <p className="hero-copy">A quiet room. A handful of suspects. One truth hiding between the lines. Step inside and see what you can uncover.</p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/new">Start investigation <ArrowRight size={16} /></Link>
            <Link className="button button-dark" to="/create"><PenLine size={14} /> Create your own mystery</Link>
            <Link className="button button-quiet" to="/how-to-play">How to play <ArrowUpRight size={14} /></Link>
          </div>
          <div className="hero-meta"><span><i className="live-dot" /> A new case every time</span><span>01 / 04</span></div>
        </div>
        <div className="hero-scene" aria-hidden="true">
          <div className="scene-orbit orbit-a" /><div className="scene-orbit orbit-b" />
          <div className="scene-moon" />
          <div className="scene-window"><div className="window-pane pane-one" /><div className="window-pane pane-two" /><div className="window-pane pane-three" /><div className="window-pane pane-four" /></div>
          <div className="scene-floor" />
          <div className="scene-desk"><i /><b /><span /><small /></div>
          <div className="scene-lamp"><span /><i /><b /></div>
          <div className="scene-paper paper-a"><small>CASE 004</small><b>11:42 PM</b><i /></div>
          <div className="scene-paper paper-b"><i /><i /><i /></div>
          <div className="scene-caption"><span>THE INVESTIGATION ROOM</span><span>EST. AFTER DARK</span></div>
          <div className="scene-pin pin-a" /><div className="scene-pin pin-b" />
          <div className="scene-thread thread-a" /><div className="scene-thread thread-b" />
        </div>
        <div className="hero-side-note"><span>THE CASE IS YOURS</span><i /></div>
      </section>

      <section className="overflow-hidden border-y border-gold/20 bg-[#171817]" aria-label="Investigation details">
        <div className="mx-auto flex min-h-[43px] w-max items-center gap-[54px] font-mono text-[9px] tracking-[.18em] text-[#98948a] max-[620px]:min-h-[37px] max-[620px]:gap-[25px] max-[620px]:text-[7px] [&_b]:text-xs [&_b]:font-normal [&_b]:text-gold"><span>NO TWO CASES ALIKE</span><b>✳</b><span>EVERY DETAIL MATTERS</span><b>✳</b><span>OR WRITE YOUR OWN</span><b>✳</b><span>THE TRUTH IS IN THERE</span></div>
      </section>

      <section className="page-width grid min-h-[368px] grid-cols-[.7fr_1.6fr_.7fr] items-start gap-[35px] py-[90px] max-[820px]:grid-cols-[1fr_auto] max-[820px]:gap-[18px] max-[820px]:py-[65px] max-[620px]:grid-cols-1 max-[620px]:py-[52px]">
        <div className="flex h-[205px] flex-col justify-between max-[820px]:col-span-full max-[820px]:h-auto max-[820px]:flex-row max-[820px]:items-center max-[620px]:col-span-1"><Eyebrow icon={Fingerprint}>Inside the room</Eyebrow><span className="font-mono text-[8px] tracking-[.16em] text-faint">AIMR — 001</span></div>
        <div className="max-[820px]:col-start-1"><h2 className="m-0 font-serif text-[45px] leading-[1.08] font-medium tracking-[-.025em] [&_em]:font-medium [&_em]:text-gold max-[620px]:text-[37px]">A story that waits<br />for <em>your questions.</em></h2><p className="mt-[17px] mb-[22px] max-w-[545px] text-[13px] leading-[1.9] text-[#a9a9ad] max-[620px]:text-[11px]">AI Mystery Room creates an original case with a cast of suspects, a trail of evidence, and one carefully fixed solution. Bring your own story idea, or let the room surprise you. The facts will stay put.</p><Link className="text-link" to="/about">More about the experience <ArrowUpRight size={14} /></Link></div>
        <div className="flex flex-col items-center gap-4 justify-self-end text-gold max-[820px]:col-start-2 max-[820px]:self-end max-[620px]:hidden"><div className="flex size-[114px] flex-col items-center justify-center gap-1 rounded-full border border-gold/40 max-[820px]:size-[90px]"><Fingerprint size={28} strokeWidth={1.1} /><span className="text-center font-mono text-[7px] leading-[1.5] tracking-[.17em] text-gold-light">ROOM<br />NO. 01</span></div><small className="font-mono text-[7px] tracking-[.12em] text-faint">OPEN CASE · 2026</small></div>
      </section>

      <section className="border-y border-paper/5 bg-[#18191f] pt-[90px] pb-[100px] max-[820px]:py-[65px] max-[620px]:py-[53px]">
        <div className="page-width">
          <div className="mb-[45px] flex items-end justify-between gap-10 max-[620px]:mb-[27px] max-[620px]:block"><div><Eyebrow className="mb-[17px]">How the investigation unfolds</Eyebrow><h2 className="m-0 font-serif text-[45px] leading-[1.08] font-medium tracking-[-.025em] [&_em]:font-medium [&_em]:text-gold text-[47px] max-[620px]:text-[39px]">Look closer.<br /><em>Think deeper.</em></h2></div><p className="mt-0 mb-[5px] max-w-[376px] text-xs leading-[1.9] text-[#a6a6ad] max-[620px]:mt-[13px] max-[620px]:text-[11px]">Good detectives don't rush to an answer. They learn what happened, test what they hear, then follow the details that refuse to line up.</p></div>
          <div className="grid grid-cols-3 border border-line max-[620px]:grid-cols-1">
            {features.map(({ icon: Icon, number, title, body }) => <article className="group relative flex min-h-[206px] flex-col justify-between overflow-hidden border-r border-line p-6 last:border-r-0 max-[620px]:min-h-[165px] max-[620px]:border-r-0 max-[620px]:border-b max-[620px]:p-[18px] max-[620px]:last:border-b-0" key={number}><div className="flex items-center justify-between text-gold"><span className="font-mono text-[9px] text-[#777780]">{number}</span><Icon size={20} strokeWidth={1.35} /></div><div><h3 className="mt-0 mb-[9px] font-serif text-xl font-medium max-[620px]:text-lg">{title}</h3><p className="m-0 max-w-[280px] text-[11px] leading-[1.75] text-[#999aa2]">{body}</p></div><span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-[width] duration-350 group-hover:w-full" /></article>)}
          </div>
        </div>
      </section>

      <section className="page-width grid min-h-[273px] grid-cols-[72px_1fr_auto] items-center gap-[27px] py-[65px] max-[620px]:min-h-0 max-[620px]:grid-cols-[48px_1fr] max-[620px]:gap-[15px] max-[620px]:py-[49px]">
        <div className="grid size-[58px] place-items-center rounded-full border border-gold/30 text-gold max-[620px]:size-[46px]"><ShieldCheck size={24} strokeWidth={1.2} /></div>
        <div><Eyebrow className="mb-[13px]">A case is waiting</Eyebrow><h2 className="m-0 font-serif text-[45px] leading-[1.08] font-medium tracking-[-.025em] [&_em]:font-medium [&_em]:text-gold text-[37px] max-[620px]:text-[29px]">Ready to read<br /><em>between the lines?</em></h2></div>
        <div className="flex flex-wrap gap-[11px] max-[620px]:col-span-full max-[620px]:justify-self-start">
          <Link className="button button-gold" to="/new">Choose your difficulty <ArrowRight size={16} /></Link>
          <Link className="button button-dark" to="/create"><PenLine size={14} /> Write your own case</Link>
        </div>
      </section>
    </main>
  );
}
