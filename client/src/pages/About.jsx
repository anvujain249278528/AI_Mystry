import { Link } from 'react-router-dom';
import { ArrowRight, Fingerprint, ShieldCheck, Sparkles } from 'lucide-react';
import { SubpageHeading, subpage } from '../components/ui.jsx';

const columns = [
  { icon: ShieldCheck, title: 'One fixed solution', text: 'The culprit and explanation are stored before you enter the room. Clues, interviews, and hints are grounded in those established facts.' },
  { icon: Fingerprint, title: 'Your own investigation', text: 'Cases are saved to the database, while a private browser token lets you return to your investigation and its result.' },
];

export default function About() {
  return <main className={subpage}>
    <SubpageHeading className="mb-[55px] max-w-[760px] max-[620px]:mb-[35px]" icon={Fingerprint} eyebrow="About the room" title={<>Stories with a<br /><em>steady truth.</em></>}>AI Mystery Room is an interactive detective game built around one simple promise: the answer is decided before the investigation begins.</SubpageHeading>
    <div className="flex max-w-[830px] gap-4 border-l-2 border-gold bg-[#191b20] p-[23px] text-gold">
      <Sparkles size={19} className="shrink-0" />
      <p className="m-0 font-serif text-[17px] leading-[1.7] font-medium text-[#c5c2ba] max-[620px]:text-sm">Each case is generated with its own cast, timeline, motives, and evidence, or built from your own story idea. The people you question can respond in their own voice, but they cannot change what happened.</p>
    </div>
    <div className="mt-[45px] mb-10 grid max-w-[830px] grid-cols-2 gap-[26px] max-[620px]:grid-cols-1 max-[620px]:gap-[19px]">
      {columns.map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-line pt-5 text-gold"><Icon size={22} /><h2 className="mt-3.5 mb-2 font-serif text-xl font-medium text-paper">{title}</h2><p className="m-0 text-xs leading-[1.8] text-[#a2a2aa]">{text}</p></article>)}
    </div>
    <Link className="button button-gold" to="/new">Enter the room <ArrowRight size={16} /></Link>
  </main>;
}
