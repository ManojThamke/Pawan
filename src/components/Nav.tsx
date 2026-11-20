import { NavLink, Link } from 'react-router-dom';
import Monogram from './Monogram';

export default function Nav() {
  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Primary">
        <Link to="/" className="nav-mono" aria-label="Pawan Marke, home">
          <Monogram />
        </Link>
        <NavLink to="/projects" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
          Projects
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
          About
        </NavLink>
      </nav>
    </header>
  );
}
