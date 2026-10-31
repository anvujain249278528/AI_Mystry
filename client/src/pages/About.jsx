import { Link } from 'react-router-dom';
import { ArrowRight, Fingerprint, ShieldCheck, Sparkles } from 'lucide-react';
import { Eyebrow } from '../components/SiteChrome.jsx';

export default function About() {
  return <main className="subpage about-page content-width">
    <div className="subpage-heading"><Eyebrow icon={Fingerprint}>About the room</Eyebrow><h1>Stories with a<br /><em>steady truth.</em></h1><p>AI Mystery Room is an interactive detective game built around one simple promise: the answer is decided before the investigation begins.</p></div>
    <div className="about-note"><Sparkles size={19} /><p>Each case is generated with its own cast, timeline, motives, and evidence. The people you question can respond in their own voice, but they cannot change what happened.</p></div>
    <div className="about-columns"><article><ShieldCheck size={22} /><h2>One fixed solution</h2><p>The culprit and explanation are stored before you enter the room. Clues, interviews, and hints are grounded in those established facts.</p></article><article><Fingerprint size={22} /><h2>Your own investigation</h2><p>Cases are saved to the database, while a private browser token lets you return to your investigation and its result.</p></article></div>
    <Link className="button button-gold" to="/new">Enter the room <ArrowRight size={16} /></Link>
  </main>;
}
