import { useExperience } from '../context/Experience';
import { IconPause, IconPlay } from './Icons';

export default function PauseButton({ className = '' }: { className?: string }) {
  const { paused, togglePaused } = useExperience();
  return (
    <button
      type="button"
      className={`round-btn pause-btn ${className}`}
      onClick={togglePaused}
      aria-pressed={paused}
      aria-label={paused ? 'Play scene animation' : 'Pause scene animation'}
      title={paused ? 'Play animation' : 'Pause animation'}
    >
      {paused ? <IconPlay size={18} /> : <IconPause size={18} />}
    </button>
  );
}
