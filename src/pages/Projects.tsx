import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { otherRepos, profile, projects } from '../data/portfolio';
import { useExperience } from '../context/Experience';
import PauseButton from '../components/PauseButton';
import Footer from '../components/Footer';
import { IconArrow, IconExternal, IconGitHub, IconNext, IconPrev } from '../components/Icons';

export default function Projects() {
  const { activeProject: idx, setActiveProject } = useExperience();
  const [dir, setDir] = useState<1 | -1>(1);
  const navigate = useNavigate();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const n = projects.length;
  const p = projects[idx] ?? projects[0];

  const go = (to: number, d?: 1 | -1) => {
    const next = (to + n) % n;
    setDir(d ?? (next > idx ? 1 : -1));
    setActiveProject(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowRight') go(idx + 1, 1);
      else if (e.key === 'ArrowLeft') go(idx - 1, -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) go(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  return (
    <div className="page page-projects">
      <section className="browser" aria-labelledby="sel-title" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* tapping the laptop area opens the active project */}
        <button type="button" className="stage-hit" aria-hidden="true" tabIndex={-1} onClick={() => navigate(`/projects/${p.slug}`)} />

        <div className="glass browser-sheet" role="group" aria-roledescription="carousel" aria-label="Selected projects">
          <h1 id="sel-title" className="glass-label">
            Selected Projects
          </h1>

          <div className="slide-viewport" aria-live="polite">
            <article key={p.slug} className={`slide ${dir > 0 ? 'from-right' : 'from-left'}`} aria-roledescription="slide" aria-label={`${idx + 1} of ${n}`}>
              <h2 className="slide-title">
                <Link to={`/projects/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className="label-caps on-glass">{p.categories.join(' • ')}</p>
              <p className="slide-summary">{p.summary}</p>
              <Link to={`/projects/${p.slug}`} className="pill-btn">
                View case study <IconArrow size={16} />
              </Link>
            </article>
          </div>

          <div className="carousel-controls">
            <button type="button" className="round-btn sm" onClick={() => go(idx - 1, -1)} aria-label="Previous project">
              <IconPrev size={18} />
            </button>
            <div className="dots" role="group" aria-label="Choose a project">
              {projects.map((q, i) => (
                <button
                  key={q.slug}
                  type="button"
                  aria-current={i === idx ? 'true' : undefined}
                  aria-label={`${i + 1}: ${q.shortTitle}`}
                  className={`dot${i === idx ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button type="button" className="round-btn sm" onClick={() => go(idx + 1, 1)} aria-label="Next project">
              <IconNext size={18} />
            </button>
          </div>
          <p className="carousel-hint" aria-hidden="true">
            {idx + 1} / {n} · swipe or use ← →
          </p>
        </div>

        <PauseButton className="corner-pause" />
      </section>

      <section className="sheet sheet-rise repo-sheet" aria-labelledby="more-title">
        <span className="sheet-handle" aria-hidden="true" />
        <div className="repo-head">
          <div>
            <p className="eyebrow">Repositories</p>
            <h2 id="more-title" className="display-md">
              More on GitHub
            </h2>
          </div>
          <a className="pill-btn dark" href={profile.contact.github} target="_blank" rel="noreferrer">
            <IconGitHub size={18} /> Pawanmarke497
          </a>
        </div>
        <p className="muted">Other public repositories. Descriptions appear only where the repository README has been checked.</p>
        <ul className="repo-list">
          {otherRepos.map((r) => (
            <li key={r.name}>
              <a href={r.url} target="_blank" rel="noreferrer" className="repo-row">
                <span className="repo-name">{r.name}</span>
                {r.description && <span className="repo-desc">{r.description}</span>}
                <IconExternal size={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <Footer />
      </section>
    </div>
  );
}
