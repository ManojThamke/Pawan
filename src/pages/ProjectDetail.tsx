import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isFilled, projects } from '../data/portfolio';
import { useExperience } from '../context/Experience';
import PauseButton from '../components/PauseButton';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import { PipelineDiagram, ScreenMockup } from '../components/ProjectVisuals';
import { IconClose, IconExternal, IconGitHub, IconNext, IconPrev } from '../components/Icons';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setActiveProject } = useExperience();
  const i = projects.findIndex((p) => p.slug === slug);
  const tabs = useRef<HTMLOListElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const p = projects[i];

  useEffect(() => {
    if (i >= 0) {
      setActiveProject(i);
      document.title = `${projects[i].title} — Pawan Marke`;
    }
    // keep the active tab visible and start the case study at the top
    const list = tabs.current;
    const active = list?.querySelector<HTMLElement>('.is-active');
    if (list && active) {
      const d = active.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollLeft += d - (list.clientWidth - active.offsetWidth) / 2;
    }
    sheet.current?.scrollTo(0, 0);
  }, [i, setActiveProject]);

  if (!p) return <NotFound />;
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <div className="page page-detail">
      <PauseButton className="corner-pause" />
      <div className="detail-col">
        <nav className="glass detail-bar" aria-label="Project navigation">
          <button type="button" className="round-btn sm" onClick={() => navigate(`/projects/${prev.slug}`)} aria-label={`Previous project: ${prev.title}`}>
            <IconPrev size={18} />
          </button>
          <button type="button" className="round-btn sm" onClick={() => navigate(`/projects/${next.slug}`)} aria-label={`Next project: ${next.title}`}>
            <IconNext size={18} />
          </button>
          <ol className="detail-tabs" ref={tabs}>
            {projects.map((q, n) => (
              <li key={q.slug}>
                <Link to={`/projects/${q.slug}`} aria-current={n === i ? 'page' : undefined} className={n === i ? 'is-active' : ''}>
                  {q.shortTitle}
                </Link>
              </li>
            ))}
          </ol>
          <Link to="/projects" className="round-btn sm" aria-label="Back to all projects">
            <IconClose size={18} />
          </Link>
        </nav>

        <article className="sheet detail-sheet" aria-labelledby="proj-title" tabIndex={0} ref={sheet}>
          <span className="sheet-handle mobile-only" aria-hidden="true" />
          <header className="detail-head">
            <h1 id="proj-title" className="display-lg">
              {p.title}
            </h1>
            <p className="label-caps">{p.categories.join(' • ')}</p>
          </header>
          <hr />
          <p className="lead">{p.summary}</p>

          <div className="detail-grid">
            <section>
              <h2 className="h-sm">Overview</h2>
              <p>{p.overview}</p>
            </section>
            {p.goal && (
              <section>
                <h2 className="h-sm">Goal</h2>
                <p>{p.goal}</p>
              </section>
            )}
          </div>

          <ScreenMockup visual={p.visual} label={p.title} />

          <section>
            <h2 className="display-sm">Approach</h2>
            <ol className="approach">
              {p.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </section>

          <PipelineDiagram visual={p.visual} />

          <section>
            <h2 className="display-sm">Key features</h2>
            <ul className="feature-chips">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          {p.dataNote && (
            <section>
              <h2 className="h-sm">Data</h2>
              <p>{p.dataNote}</p>
            </section>
          )}

          {(p.metrics?.length || p.metricsNote) && (
            <section className="metrics-block">
              {p.metrics && p.metrics.length > 0 && (
                <>
                  <h2 className="display-sm">Reported results</h2>
                  <dl className="metrics">
                    {p.metrics.map((m) => (
                      <div key={m.label}>
                        <dt>{m.label}</dt>
                        <dd>{m.value}</dd>
                        <span className="metric-src">{m.source === 'profile' ? 'Profile-reported' : 'README-reported'}</span>
                      </div>
                    ))}
                  </dl>
                </>
              )}
              {p.metricsNote && <p className="note">{p.metricsNote}</p>}
            </section>
          )}

          <section>
            <h2 className="display-sm">Development stack</h2>
            <ul className="stack">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <section className="detail-links">
            <a className="pill-btn dark" href={p.repo} target="_blank" rel="noreferrer">
              <IconGitHub size={18} /> View on GitHub <span className="sr-only">(opens in a new tab)</span>
            </a>
            {isFilled(p.liveDemo) && (
              <a className="pill-btn" href={p.liveDemo} target="_blank" rel="noreferrer">
                Live demo <IconExternal size={16} />
              </a>
            )}
            <p className="note">{p.sourceLabel}</p>
          </section>

          <nav className="detail-pager" aria-label="More projects">
            <Link to={`/projects/${prev.slug}`} className="pager-link">
              <span className="label-caps">Previous</span>
              <span>{prev.shortTitle}</span>
            </Link>
            <Link to={`/projects/${next.slug}`} className="pager-link right">
              <span className="label-caps">Next</span>
              <span>{next.shortTitle}</span>
            </Link>
          </nav>
          <Footer />
        </article>
      </div>
    </div>
  );
}
