import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Fingerprint, Menu, X } from 'lucide-react';

const navLink = ({ isActive }) => `text-xs tracking-[.035em] transition-colors hover:text-paper max-[620px]:py-3 max-[620px]:px-0.5 max-[620px]:border-b max-[620px]:border-paper/5 ${isActive ? 'text-paper' : 'text-muted'}`;

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = () => setOpen(false);
  const isInvestigation = location.pathname.startsWith('/investigation/');
  return (
    <header className="relative z-30 h-[76px] border-b border-paper/[.075] bg-bg max-[620px]:h-[63px]">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-[5.4%] max-[620px]:px-4">
        <Link to="/" className="flex items-center gap-[11px]" onClick={close} aria-label="AI Mystery Room home">
          <span className="grid size-[33px] place-items-center rounded-full border border-gold/40 text-gold"><Fingerprint size={21} strokeWidth={1.5} /></span>
          <span className="font-mono text-[11px] tracking-[.18em] text-paper max-[620px]:text-[10px]">MYSTERY<span className="text-gold">ROOM</span></span>
        </Link>
        <button className="hidden border-0 bg-transparent p-2 text-gold max-[620px]:block" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav aria-label="Main navigation" className={`flex h-full items-center gap-[34px] max-[620px]:absolute max-[620px]:inset-x-0 max-[620px]:top-[62px] max-[620px]:h-auto max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-0 max-[620px]:border-b max-[620px]:border-line max-[620px]:bg-bg-soft max-[620px]:px-4 max-[620px]:pt-2 max-[620px]:pb-[17px] max-[620px]:shadow-[0_15px_24px_rgba(0,0,0,.25)] ${open ? '' : 'max-[620px]:hidden'}`}>
          <NavLink to="/" end onClick={close} className={navLink}>The Room</NavLink>
          <NavLink to="/how-to-play" onClick={close} className={navLink}>How to play</NavLink>
          <NavLink to="/create" onClick={close} className={navLink}>Create a mystery</NavLink>
          <NavLink to="/investigations" onClick={close} className={navLink}>My investigations</NavLink>
          {!isInvestigation && <Link to="/new" onClick={close} className="inline-flex items-center gap-2 border border-gold/60 px-3.5 py-[11px] text-[11px] uppercase tracking-[.07em] text-gold-light transition-colors hover:bg-gold hover:text-[#15140f] max-[620px]:mt-[11px] max-[620px]:justify-center">Start a case <ArrowUpRight size={14} /></Link>}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#111217]">
      <div className="mx-auto flex min-h-[66px] max-w-[1440px] items-center justify-between px-[5.4%] py-[15px] font-mono text-[9px] tracking-[.11em] text-faint max-[620px]:min-h-[60px] max-[620px]:flex-wrap max-[620px]:gap-x-5 max-[620px]:gap-y-2.5 max-[620px]:p-4 max-[620px]:text-[7px]">
        <Link to="/" className="text-[#b6b5ae]">AI MYSTERY ROOM <span className="px-1 text-gold">·</span> A CASE FOR THE CURIOUS</Link>
        <span className="max-[620px]:hidden">Every mystery has a secret.</span>
        <Link to="/about" className="flex items-center gap-1.5 text-muted">About the room <ArrowUpRight size={13} /></Link>
      </div>
    </footer>
  );
}

// Keeps the `eyebrow` class name so older page styles that position it still apply.
export function Eyebrow({ children, icon: Icon, className = '' }) {
  return <div className={`eyebrow flex items-center gap-2 font-mono text-[9px] leading-[1.4] tracking-[.18em] text-gold uppercase ${className}`}>{Icon && <Icon size={13} strokeWidth={1.6} />}<span>{children}</span></div>;
}

export function PageLoading({ label = 'Opening the case file' }) {
  return <main className="flex min-h-[calc(100vh-142px)] flex-col items-center justify-center gap-[13px] font-mono text-[8px] tracking-[.14em] text-[#aaa9a1] uppercase">
    <div className="grid size-[58px] animate-[room-pulse_1.8s_ease-in-out_infinite] place-items-center rounded-full border border-gold/40 text-gold"><Fingerprint size={28} /></div>
    <span>{label}</span>
    <div className="h-px w-[110px] overflow-hidden bg-[#30313a]"><i className="block h-full w-[34%] animate-[room-loading_1.3s_ease-in-out_infinite_alternate] bg-gold" /></div>
  </main>;
}

export function ErrorPanel({ message, onRetry, backTo = '/' }) {
  return (
    <section className="mx-auto my-20 max-w-[510px] border border-line bg-[#191b22] p-[34px] text-center max-[620px]:my-[55px] max-[620px]:px-[18px] max-[620px]:py-[25px]">
      <span className="mx-auto mb-4 grid size-8 place-items-center rounded-full border border-[rgba(214,90,90,.4)] text-[#dd8880]">!</span>
      <Eyebrow className="justify-center">A momentary interruption</Eyebrow>
      <h2 className="my-[9px] font-serif text-[25px] font-medium">The room is quiet.</h2>
      <p className="m-0 text-[11px] leading-[1.8] text-[#a3a2a9]">{message}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        {onRetry && <button className="button button-dark min-h-[39px]" onClick={onRetry}>Try again</button>}
        <Link className="text-link" to={backTo}>Return to the room <ArrowUpRight size={14} /></Link>
      </div>
    </section>
  );
}
