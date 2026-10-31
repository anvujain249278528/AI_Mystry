import { Link } from 'react-router-dom';
import { ArrowRight, BadgeHelp, BookOpen, Eye, Fingerprint, Lightbulb, MessageCircle, Search } from 'lucide-react';
import { Eyebrow } from '../components/SiteChrome.jsx';

const steps = [
  { icon: BookOpen, index: 'I', title: 'Read the briefing', text: 'Get the scene, the timeline, and the people involved. The solution is already fixed, but it is yours to find.' },
  { icon: Eye, index: 'II', title: 'Examine what is there', text: 'Start with the evidence on the board. Search a location to uncover clues that were not obvious at first.' },
  { icon: MessageCircle, index: 'III', title: 'Ask the suspects', text: 'Choose a person and ask what you need to know. Compare their answers with the evidence you have found.' },
  { icon: Lightbulb, index: 'IV', title: 'Use a hint, if needed', text: 'Hints come in steps, from a light nudge to a closer look at the evidence: 2 on Easy, 3 on Medium and Hard. Each hint costs 10 points.' },
  { icon: Fingerprint, index: 'V', title: 'Make your accusation', text: 'Select one suspect when you are ready. Your final accusation is locked, then the full explanation is revealed.' },
];

export default function HowToPlay() {
  return <main className="subpage content-width">
    <div className="subpage-heading"><Eyebrow icon={BadgeHelp}>A field guide</Eyebrow><h1>How to <em>play.</em></h1><p>Take your time. Every answer you need is somewhere in the case.</p></div>
    <div className="steps-list">{steps.map(({ icon: Icon, index, title, text }) => <article className="step-row" key={index}><span className="step-index">{index}</span><div className="step-icon"><Icon size={19} strokeWidth={1.4} /></div><div><h2>{title}</h2><p>{text}</p></div><Search className="step-decoration" size={17} /></article>)}</div>
    <div className="guide-cta"><div><span className="eyebrow">The room is ready</span><h2>Start with a fresh case.</h2></div><Link className="button button-gold" to="/new">Choose a difficulty <ArrowRight size={16} /></Link></div>
  </main>;
}
