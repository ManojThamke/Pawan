import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Stage from './components/Stage';
import Intro from './components/Intro';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { useExperience } from './context/Experience';

const TITLES: Record<string, string> = {
  '/': 'Pawan Marke — Python Developer & Data Analyst',
  '/projects': 'Projects — Pawan Marke',
  '/about': 'About — Pawan Marke',
};

export default function App() {
  const { pathname } = useLocation();
  const { introOpen } = useExperience();
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (TITLES[pathname]) document.title = TITLES[pathname];
  }, [pathname]);

  // keep the page behind the welcome screen out of the tab order
  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    if (introOpen) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }, [introOpen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Stage />
      <div className="app-shell" ref={shell} aria-hidden={introOpen || undefined}>
        <Nav />
        <main id="main" key={pathname} className="route">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Intro />
    </>
  );
}
