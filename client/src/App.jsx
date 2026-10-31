import { Navigate, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/SiteChrome.jsx';
import Home from './pages/Home.jsx';
import Difficulty from './pages/Difficulty.jsx';
import CreateMystery from './pages/CreateMystery.jsx';
import Briefing from './pages/Briefing.jsx';
import Investigation from './pages/Investigation.jsx';
import Result from './pages/Result.jsx';
import HowToPlay from './pages/HowToPlay.jsx';
import About from './pages/About.jsx';
import Investigations from './pages/Investigations.jsx';

function NotFound() {
  return <main className="content-width not-found"><span>404 <i>·</i> COLD TRAIL</span><h1>This page left<br /><em>no evidence.</em></h1><p>The address may have changed, or the case file has been closed.</p><a className="button button-gold" href="/">Return to the room</a></main>;
}

export default function App() {
  return <div className="app-shell"><Header /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/new" element={<Difficulty />} />
    <Route path="/create" element={<CreateMystery />} />
    <Route path="/case/:sessionId" element={<Briefing />} />
    <Route path="/investigation/:sessionId" element={<Investigation />} />
    <Route path="/result/:sessionId" element={<Result key={window.location.pathname} />} />
    <Route path="/investigations" element={<Investigations />} />
    <Route path="/how-to-play" element={<HowToPlay />} />
    <Route path="/about" element={<About />} />
    <Route path="/home" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes><Footer /></div>;
}
