import { profile } from '../data/portfolio';
import { useExperience } from '../context/Experience';

export default function Footer() {
  const { openIntro } = useExperience();
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <a href={profile.contact.github} target="_blank" rel="noreferrer">
        GitHub
      </a>
      <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a href={`mailto:${profile.contact.email}`}>Email</a>
      <button type="button" className="link-btn" onClick={openIntro}>
        Replay intro
      </button>
    </footer>
  );
}
