import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Fingerprint, Menu, X } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = () => setOpen(false);
  const isInvestigation = location.pathname.startsWith('/investigation/');
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" onClick={close} aria-label="AI Mystery Room home">
          <span className="brand-mark"><Fingerprint size={21} strokeWidth={1.5} /></span>
          <span className="brand-name">MYSTERY<span>ROOM</span></span>
        </Link>
        <button className="mobile-menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>The Room</NavLink>
          <NavLink to="/how-to-play" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>How to play</NavLink>
          <NavLink to="/create" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Create a mystery</NavLink>
          <NavLink to="/investigations" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>My investigations</NavLink>
          {!isInvestigation && <Link to="/new" className="nav-start" onClick={close}>Start a case <ArrowUpRight size={14} /></Link>}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link to="/" className="footer-brand">AI MYSTERY ROOM <span>·</span> A CASE FOR THE CURIOUS</Link>
        <span>Every mystery has a secret.</span>
        <Link to="/about">About the room <ArrowUpRight size={13} /></Link>
      </div>
    </footer>
  );
}

export function Eyebrow({ children, icon: Icon }) {
  return <div className="eyebrow">{Icon && <Icon size={13} strokeWidth={1.6} />}<span>{children}</span></div>;
}

export function PageLoading({ label = 'Opening the case file' }) {
  return <main className="loading-page"><div className="loading-mark"><Fingerprint size={28} /></div><span>{label}</span><div className="loading-line"><i /></div></main>;
}

export function ErrorPanel({ message, onRetry, backTo = '/' }) {
  return (
    <section className="error-panel">
      <span className="error-mark">!</span>
      <p className="eyebrow">A momentary interruption</p>
      <h2>The room is quiet.</h2>
      <p>{message}</p>
      <div className="error-actions">
        {onRetry && <button className="button button-dark" onClick={onRetry}>Try again</button>}
        <Link className="text-link" to={backTo}>Return to the room <ArrowUpRight size={14} /></Link>
      </div>
    </section>
  );
}
