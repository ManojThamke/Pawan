import { useCallback, useEffect, useRef, useState } from 'react';
import { greetings, profile } from '../data/portfolio';
import { useExperience } from '../context/Experience';

const STEP_MS = 640; // 9 greetings ≈ 5.8 s, then a soft fade into the site

export default function Intro() {
  const { introOpen, closeIntro, reducedMotion } = useExperience();
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    if (!introOpen) return;
    lastFocus.current = document.activeElement;
    setI(0);
    setLeaving(false);
    btn.current?.focus({ preventScroll: true });
    document.body.classList.add('intro-lock');
    return () => document.body.classList.remove('intro-lock');
  }, [introOpen]);

  const enter = useCallback(() => {
    setLeaving((was) => {
      if (was) return was;
      window.setTimeout(
        () => {
          closeIntro();
          const el = lastFocus.current as HTMLElement | null;
          if (el && el !== document.body) el.focus?.({ preventScroll: true });
        },
        reducedMotion ? 0 : 650,
      );
      return true;
    });
  }, [closeIntro, reducedMotion]);

  // auto-advance
  useEffect(() => {
    if (!introOpen || reducedMotion || leaving) return;
    const last = i >= greetings.length - 1;
    const t = window.setTimeout(() => (last ? enter() : setI((n) => n + 1)), last ? STEP_MS + 300 : STEP_MS);
    return () => window.clearTimeout(t);
  }, [i, introOpen, reducedMotion, leaving, enter]);

  // Escape skips; Tab stays on the single control
  useEffect(() => {
    if (!introOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') enter();
      if (e.key === 'Tab') {
        e.preventDefault();
        btn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [introOpen, enter]);

  if (!introOpen) return null;
  const g = greetings[i];

  return (
    <div
      className={`intro${leaving ? ' is-leaving' : ''}${reducedMotion ? ' is-static' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      aria-describedby="intro-desc"
    >
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-arch" aria-hidden="true" />
      <h1 id="intro-title" className="sr-only">
        Welcome to the portfolio of {profile.name}
      </h1>
      <p id="intro-desc" className="sr-only">
        A short, silent greeting in nine languages. Press the button or Escape to enter.
      </p>

      {reducedMotion ? (
        <ul className="intro-static" aria-label="Greetings">
          {greetings.map((x) => (
            <li key={x.lang} lang={x.lang} dir={x.dir}>
              {x.text}
            </li>
          ))}
        </ul>
      ) : (
        <div className="intro-word-wrap" aria-hidden="true">
          <span key={i} className="intro-word" lang={g.lang} dir={g.dir}>
            {g.text}
          </span>
        </div>
      )}

      <div className="intro-meta" aria-hidden="true">
        {!reducedMotion && (
          <div className="intro-progress">
            {greetings.map((x, n) => (
              <span key={x.lang} className={n <= i ? 'on' : ''} />
            ))}
          </div>
        )}
        <span className="intro-name">{profile.name}</span>
      </div>

      <button ref={btn} type="button" className="pill-btn intro-skip" onClick={enter}>
        {reducedMotion ? 'Enter portfolio' : 'Skip intro'}
        <span aria-hidden="true"> →</span>
      </button>
    </div>
  );
}
