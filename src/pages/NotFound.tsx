import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page page-404">
      <section className="glass nf-card" aria-labelledby="nf-title">
        <h1 id="nf-title" className="display-lg">
          Lost in the studio
        </h1>
        <p>That page doesn’t exist.</p>
        <Link to="/" className="pill-btn dark">
          Back home
        </Link>
      </section>
    </div>
  );
}
