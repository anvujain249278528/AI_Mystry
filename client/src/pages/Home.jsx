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

      <section className="ticker-strip" aria-label="Investigation details">
        <div className="ticker-inner"><span>NO TWO CASES ALIKE</span><b>✳</b><span>EVERY DETAIL MATTERS</span><b>✳</b><span>THE TRUTH IS IN THERE</span><b>✳</b><span>NO TWO CASES ALIKE</span></div>
      </section>

      <section className="intro-section content-width">
        <div className="intro-label"><Eyebrow icon={Fingerprint}>Inside the room</Eyebrow><span className="small-index">AIMR — 001</span></div>
        <div className="intro-copy"><h2>A story that waits<br />for <em>your questions.</em></h2><p>AI Mystery Room creates an original case with a cast of suspects, a trail of evidence, and one carefully fixed solution. Investigate at your pace. The facts will stay put.</p><Link className="text-link" to="/about">More about the experience <ArrowUpRight size={14} /></Link></div>
        <div className="intro-stamp"><div><Fingerprint size={28} strokeWidth={1.1} /><span>ROOM<br />NO. 01</span></div><small>OPEN CASE · 2025</small></div>
      </section>

      <section className="feature-section">
        <div className="content-width">
          <div className="section-heading"><div><Eyebrow>How the investigation unfolds</Eyebrow><h2>Look closer.<br /><em>Think deeper.</em></h2></div><p>Good detectives don't rush to an answer. They learn what happened, test what they hear, then follow the details that refuse to line up.</p></div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, number, title, body }) => <article className="feature-card" key={number}><div className="feature-card-top"><span>{number}</span><Icon size={20} strokeWidth={1.35} /></div><div><h3>{title}</h3><p>{body}</p></div><span className="feature-line" /></article>)}
          </div>
        </div>
      </section>

      <section className="closing-section content-width">
        <div className="closing-rune"><ShieldCheck size={24} strokeWidth={1.2} /></div>
        <div><Eyebrow>A case is waiting</Eyebrow><h2>Ready to read<br /><em>between the lines?</em></h2></div>
        <div className="closing-actions">
          <Link className="button button-gold" to="/new">Choose your difficulty <ArrowRight size={16} /></Link>
          <Link className="button button-dark" to="/create"><PenLine size={14} /> Write your own case</Link>
        </div>
      </section>
    </main>
  );
}
