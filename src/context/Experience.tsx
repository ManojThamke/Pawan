import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** Mutable, non-React values the 3D scene reads every frame (no re-renders). */
export const sceneInput = {
  scroll: 0, // 0..1 progress of the home page hero scroll
  pointerX: 0, // -1..1
  pointerY: 0, // -1..1
};

interface ExperienceState {
  paused: boolean;
  togglePaused: () => void;
  reducedMotion: boolean;
  introOpen: boolean;
  openIntro: () => void;
  closeIntro: () => void;
  activeProject: number;
  setActiveProject: (i: number) => void;
  webgl: boolean;
}

const Ctx = createContext<ExperienceState | null>(null);
const INTRO_KEY = 'pm-intro-seen';

function detectWebGL(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has('lite')) return false;
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    // Very low-end devices get the lightweight illustrated fallback.
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    return !(cores <= 2 && mem <= 2);
  } catch {
    return false;
  }
}

function safeSession(get: true): string | null;
function safeSession(get: false, value: string): void;
function safeSession(get: boolean, value?: string) {
  try {
    if (get) return sessionStorage.getItem(INTRO_KEY);
    sessionStorage.setItem(INTRO_KEY, value!);
  } catch {
    return null;
  }
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  const [paused, setPaused] = useState(reducedMotion);
  const [introOpen, setIntroOpen] = useState(() => safeSession(true) !== '1');
  const [activeProject, setActiveProject] = useState(0);
  const [webgl] = useState(detectWebGL);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => {
      setReduced(mq.matches);
      if (mq.matches) setPaused(true);
    };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-paused', paused);
  }, [paused]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      sceneInput.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneInput.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const closeIntro = useCallback(() => {
    safeSession(false, '1');
    setIntroOpen(false);
  }, []);
  const openIntro = useCallback(() => setIntroOpen(true), []);
  const togglePaused = useCallback(() => setPaused((p) => !p), []);

  const value = useMemo(
    () => ({
      paused,
      togglePaused,
      reducedMotion,
      introOpen,
      openIntro,
      closeIntro,
      activeProject,
      setActiveProject,
      webgl,
    }),
    [paused, togglePaused, reducedMotion, introOpen, openIntro, closeIntro, activeProject, webgl],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExperience() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useExperience must be used inside ExperienceProvider');
  return v;
}
