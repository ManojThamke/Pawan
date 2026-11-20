import { isFilled, profile } from '../data/portfolio';
import { useExperience } from '../context/Experience';
import PauseButton from '../components/PauseButton';
import Footer from '../components/Footer';
import { IconGitHub, IconLinkedIn, IconMail } from '../components/Icons';

function Portrait() {
  const has = isFilled(profile.portrait);
  return (
    <div className="portrait-frame">
      <div className="portrait-ring" aria-hidden="true" />
      <div className="portrait-disc">
        {has ? (
          <img src={profile.portrait} alt={profile.portraitAlt} loading="lazy" decoding="async" />
        ) : (
          // Replaceable placeholder — set `portrait` in src/data/portfolio.ts
          <svg viewBox="0 0 200 200" role="img" aria-label="Portrait placeholder" className="portrait-placeholder">
            <defs>
              <linearGradient id="pp-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f0a76b" />
                <stop offset="1" stopColor="#b85c30" />
              </linearGradient>
              <linearGradient id="pp-fig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbe7d4" />
                <stop offset="1" stopColor="#f2d1b5" />
              </linearGradient>
            </defs>
            <rect width="200" height="200" fill="url(#pp-bg)" />
            {[30, 60, 90, 120, 150].map((y) => (
              <rect key={y} x="0" y={y} width="200" height="1.5" fill="#fff" opacity=".12" />
            ))}
            <circle cx="100" cy="86" r="32" fill="url(#pp-fig)" />
            <path d="M38 200 C42 150 68 128 100 128 C132 128 158 150 162 200 Z" fill="url(#pp-fig)" />
          </svg>
        )}
      </div>
      <span className="portrait-glint g1" aria-hidden="true" />
      <span className="portrait-glint g2" aria-hidden="true" />
    </div>
  );
}

export default function About() {
  const { openIntro } = useExperience();
  const c = profile.contact;
  return (
    <div className="page page-about">
      <div className="about-scene">
        <Portrait />
        <PauseButton className="about-pause" />
      </div>

      <section className="sheet about-sheet" aria-labelledby="about-hello">
        <span className="sheet-handle mobile-only" aria-hidden="true" />
        <div className="about-top">
          <p className="about-label">About</p>
          <div className="about-icons">
            <a className="round-btn sm soft" href={c.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)">
              <IconLinkedIn size={18} />
            </a>
            <a className="round-btn sm soft" href={c.github} target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)">
              <IconGitHub size={18} />
            </a>
            {isFilled(profile.resumeUrl) && (
              <a className="pill-btn caps" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
          </div>
        </div>

        <h1 id="about-hello" className="display-lg">
          Hello!
        </h1>
        <p className="about-name">
          {profile.fullName}
          <span>{profile.roles.join(' · ')}</span>
        </p>
        <p>{profile.summary}</p>

        <ul className="badges" aria-label="Profile details">
          <li>{profile.education}</li>
          {isFilled(profile.cgpa) && <li>CGPA {profile.cgpa}</li>}
          {isFilled(profile.location) && <li>{profile.location}</li>}
        </ul>

        <h2 className="display-sm">Experience</h2>
        <ol className="timeline">
          {profile.experience.map((e) => (
            <li key={e.role}>
              <p className="label-caps">{e.dates}</p>
              <h3>{e.role}</h3>
              <p className="tl-org">
                {e.org} <span>— {e.orgNote}</span>
              </p>
              <ul>
                {e.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h2 className="display-sm">Skills &amp; focus areas</h2>
        <div className="skill-groups">
          {profile.focusAreas.map((g) => (
            <div key={g.title}>
              <h3 className="label-caps">{g.title}</h3>
              <ul className="stack">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="display-sm">Currently learning</h2>
        <ul className="feature-chips">
          {profile.currentlyLearning.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2 className="display-sm">Reach me at</h2>
        <ul className="contact-list">
          <li>
            <IconMail size={18} />
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </li>
          <li>
            <IconLinkedIn size={18} />
            <a href={c.linkedin} target="_blank" rel="noreferrer">
              linkedin.com/in/pawan-marke-
            </a>
          </li>
          <li>
            <IconGitHub size={18} />
            <a href={c.github} target="_blank" rel="noreferrer">
              github.com/Pawanmarke497
            </a>
          </li>
        </ul>
        <p className="muted small">
          Also on{' '}
          <a href={c.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>{' '}
          and{' '}
          <a href={c.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          .
        </p>

        <button type="button" className="pill-btn ghost replay" onClick={openIntro}>
          Replay the welcome
        </button>
        <Footer />
      </section>
    </div>
  );
}
