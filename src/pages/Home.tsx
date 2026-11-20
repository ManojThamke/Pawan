import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profile, projects } from '../data/portfolio';
import { sceneInput, useExperience } from '../context/Experience';
import PauseButton from '../components/PauseButton';
import Footer from '../components/Footer';
import { IconArrow, IconGitHub, IconMail } from '../components/Icons';

export default function Home() {
  const { setActiveProject } = useExperience();

  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
      sceneInput.scroll = p;
      document.documentElement.style.setProperty('--hero-p', p.toFixed(3));
      (sceneInput as { invalidate?: () => void }).invalidate?.();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      sceneInput.scroll = 0;
      document.documentElement.style.setProperty('--hero-p', '0');
    };
  }, []);

  const scrollToWork = () => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page page-home">
      <section className="hero" aria-labelledby="hero-name">
        <div className="hero-title">
          <h1 id="hero-name" className="hero-name">
            <span className="hero-first">{profile.firstName}</span>
            <span className="hero-row">
              <span className="hero-roles" aria-hidden="true">
                <span>Python Developer</span>
                <span>&amp; Data Analyst</span>
              </span>
              <span className="hero-last">{profile.lastName}</span>
            </span>
          </h1>
          <p className="sr-only">{profile.roles.join(', ')}.</p>
          <p className="hero-sub">Machine learning · Data analysis · Python</p>
        </div>

        <div className="hero-actions-top">
          <a className="round-btn" href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub profile (opens in a new tab)">
            <IconGitHub />
          </a>
          <a className="round-btn" href={`mailto:${profile.contact.email}`} aria-label={`Email ${profile.name}`}>
            <IconMail />
          </a>
        </div>

        <div className="hero-paths">
          <Link to="/projects" className="pill-btn">
            View projects <IconArrow size={16} />
          </Link>
          <Link to="/about" className="pill-btn ghost">
            About Pawan
          </Link>
        </div>

        <PauseButton className="corner-pause" />
        <button type="button" className="scroll-cue" onClick={scrollToWork} aria-label="Scroll to featured projects">
          <span className="scroll-cue-mouse" aria-hidden="true">
            <span />
          </span>
        </button>
      </section>

      <section id="featured" className="sheet sheet-rise home-sheet" aria-labelledby="featured-title">
        <span className="sheet-handle" aria-hidden="true" />
        <p className="eyebrow">Featured work</p>
        <h2 id="featured-title" className="display-md">
          Selected Projects
        </h2>
        <ul className="feature-list">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                className="feature-row"
                onMouseEnter={() => setActiveProject(i)}
                onFocus={() => setActiveProject(i)}
              >
                <span className="feature-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="feature-body">
                  <span className="feature-title">{p.title}</span>
                  <span className="label-caps">{p.categories.join(' • ')}</span>
                  <span className="feature-summary">{p.summary}</span>
                </span>
                <span className="feature-arrow" aria-hidden="true">
                  <IconArrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="home-sheet-foot">
          <Link to="/projects" className="pill-btn dark">
            Browse projects <IconArrow size={16} />
          </Link>
          <Link to="/about" className="pill-btn ghost">
            About &amp; contact
          </Link>
        </div>
        <Footer />
      </section>
    </div>
  );
}
