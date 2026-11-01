import { Link } from 'react-router-dom';
import { ArrowRight, BadgeHelp, BookOpen, Eye, Fingerprint, Lightbulb, MessageCircle, Search } from 'lucide-react';
import { Eyebrow } from '../components/SiteChrome.jsx';
import { SubpageHeading, subpage } from '../components/ui.jsx';

const steps = [
  { icon: BookOpen, index: 'I', title: 'Read the briefing', text: 'Get the scene, the timeline, and the people involved. The solution is already fixed, but it is yours to find.' },
  { icon: Eye, index: 'II', title: 'Examine what is there', text: 'Start with the evidence on the board. Search a location to uncover clues that were not obvious at first. Each clue you find this way earns 5 points.' },
  { icon: MessageCircle, index: 'III', title: 'Ask the suspects', text: 'Choose a person and ask what you need to know. Compare their answers with the evidence you have found.' },
  { icon: Lightbulb, index: 'IV', title: 'Use a hint, if needed', text: 'Hints come in steps, from a light nudge to a closer look at the evidence: 2 on Easy, 3 on Medium and Hard. Each hint costs 10 points.' },
  { icon: Fingerprint, index: 'V', title: 'Make your accusation', text: 'Select one suspect when you are ready. A correct accusation scores 100, 150 or 200 points by difficulty. Your choice is locked, then the full explanation is revealed.' },
];

export default function HowToPlay() {
  return <main className={subpage}>
    <SubpageHeading icon={BadgeHelp} eyebrow="A field guide" title={<>How to <em>play.</em></>}>Take your time. Every answer you need is somewhere in the case.</SubpageHeading>
    <div className="border-t border-line">{steps.map(({ icon: Icon, index, title, text }) => (
      <article key={index} className="grid min-h-[125px] grid-cols-[42px_52px_1fr_22px] items-center gap-[21px] border-b border-line px-2 py-6 max-[620px]:grid-cols-[25px_39px_1fr] max-[620px]:gap-3 max-[620px]:px-0.5 max-[620px]:py-[18px]">
        <span className="font-mono text-[11px] text-gold">{index}</span>
        <div className="grid size-[43px] place-items-center rounded-full border border-gold/30 text-gold max-[620px]:size-9"><Icon size={19} strokeWidth={1.4} /></div>
        <div><h2 className="mt-0 mb-1.5 font-serif text-xl font-medium max-[620px]:text-[17px]">{title}</h2><p className="m-0 max-w-[650px] text-xs leading-[1.7] text-[#a1a1aa] max-[620px]:text-[10px]">{text}</p></div>
        <Search className="text-[#676871] max-[620px]:hidden" size={17} />
      </article>
    ))}</div>
    <div className="mt-[55px] flex min-h-[120px] items-center justify-between border border-line bg-[linear-gradient(105deg,rgba(201,164,92,.07),rgba(25,27,35,.22))] px-[30px] py-[25px] max-[620px]:block max-[620px]:p-[19px]">
      <div><Eyebrow>The room is ready</Eyebrow><h2 className="mt-2 mb-0 font-serif text-[25px] font-medium max-[620px]:text-xl">Start with a fresh case.</h2></div>
      <div className="flex flex-wrap gap-[11px] max-[620px]:mt-[18px]">
        <Link className="button button-gold" to="/new">Choose a difficulty <ArrowRight size={16} /></Link>
        <Link className="button button-dark" to="/create">Write your own</Link>
      </div>
    </div>
  </main>;
}
