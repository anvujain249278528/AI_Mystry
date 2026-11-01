import { ArrowLeft } from 'lucide-react';
import { Eyebrow } from './SiteChrome.jsx';

// Small building blocks shared by the setup pages (Difficulty, Create, Briefing).

export function BackRow({ onBack, backLabel = 'Back to the room', children }) {
  return <div className="flex items-center justify-between font-mono text-[8px] tracking-[.16em] text-faint max-[620px]:text-[7px]">
    <button className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent py-[7px] font-mono text-[9px] tracking-[.06em] text-muted hover:text-gold-light" onClick={onBack}><ArrowLeft size={14} /> {backLabel}</button>
    {children && <span className="max-[620px]:hidden [&_i]:px-[5px] [&_i]:not-italic [&_i]:text-gold">{children}</span>}
  </div>;
}

export function PageHeading({ icon, eyebrow, title, children }) {
  return <header className="mx-auto mt-12 mb-[38px] max-w-[680px] text-center max-[620px]:mt-[37px] max-[620px]:mb-7">
    <Eyebrow icon={icon} className="mb-[15px] justify-center">{eyebrow}</Eyebrow>
    <h1 className="m-0 font-serif text-[58px] leading-[.99] font-medium tracking-[-.035em] max-[620px]:text-[49px] [&_em]:font-medium [&_em]:text-gold">{title}</h1>
    <p className="mx-auto mt-[18px] max-w-[510px] text-xs leading-[1.8] text-[#a5a5ad] max-[620px]:text-[10px]">{children}</p>
  </header>;
}

export function InlineError({ message, onRetry }) {
  return <div className="mt-4 flex items-center gap-2.5 border border-[rgba(214,90,90,.32)] bg-red/8 px-3.5 py-[11px] text-[11px] text-error">
    <span className="size-[17px] rounded-full border border-current text-center leading-[15px]">!</span>
    <p className="m-0 flex-1">{message}</p>
    {onRetry && <button className="cursor-pointer border-0 bg-transparent font-mono text-[9px] text-gold-light" onClick={onRetry}>Retry</button>}
  </div>;
}

export function Radio({ checked }) {
  return <span className="grid size-[17px] shrink-0 place-items-center rounded-full border border-paper/30">{checked && <i className="size-[7px] rounded-full bg-gold" />}</span>;
}

// Selected / unselected look for the clickable option cards.
export const optionCard = (selected) => `cursor-pointer border text-left transition ${selected
  ? 'border-gold bg-[#1c1c20] bg-[linear-gradient(140deg,rgba(92,73,40,.34),#1c1c20_80%)] shadow-[0_0_0_1px_rgba(201,164,92,.11)]'
  : 'border-paper/12 bg-[#191a21] hover:border-gold/55'}`;

// Big left-aligned heading used by How to play, About, and My investigations.
export function SubpageHeading({ icon, eyebrow, title, children, className = '' }) {
  return <div className={className || "mb-[55px] max-w-[690px] max-[620px]:mb-[35px]"}>
    <Eyebrow icon={icon} className="mb-[18px]">{eyebrow}</Eyebrow>
    <h1 className="m-0 font-serif text-[clamp(47px,6vw,72px)] leading-[1.04] font-medium tracking-[-.035em] max-[620px]:text-[48px] [&_em]:font-medium [&_em]:text-gold">{title}</h1>
    {children && <p className="mt-[18px] mb-0 max-w-[520px] text-sm leading-[1.8] text-[#a7a7ae] max-[620px]:text-xs">{children}</p>}
  </div>;
}

export const subpage = 'page-width pt-[88px] pb-[108px] max-[620px]:pt-[58px] max-[620px]:pb-[72px]';
