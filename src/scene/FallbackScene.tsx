/**
 * Lightweight illustrated stand-in for the 3D workspace.
 * Shown while the 3D bundle loads and on devices without (capable) WebGL.
 */
export default function FallbackScene({ loading = false }: { loading?: boolean }) {
  return (
    <div className={`fallback-scene${loading ? ' is-loading' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="fs-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e4b996" />
            <stop offset="1" stopColor="#efd0b4" />
          </linearGradient>
          <radialGradient id="fs-niche" cx="0.5" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#e88a4f" />
            <stop offset="1" stopColor="#9c4a24" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#fs-bg)" />
        <ellipse cx="720" cy="760" rx="640" ry="120" fill="#e6c09f" />
        <ellipse cx="720" cy="740" rx="620" ry="110" fill="#f0d5bc" />
        <rect x="770" y="230" width="520" height="470" rx="8" fill="#f0d3b9" />
        <path d="M955 640 V410 a75 75 0 0 1 150 0 V640 Z" fill="url(#fs-niche)" />
        <path d="M985 330 a46 46 0 0 1 90 0" stroke="#fff1dc" strokeWidth="7" fill="none" strokeLinecap="round" />
        <ellipse cx="460" cy="610" rx="170" ry="40" fill="#e9c7a8" />
        <rect x="290" y="560" width="340" height="56" fill="#f3dcc6" />
        <ellipse cx="460" cy="560" rx="170" ry="40" fill="#f6e4d2" />
        <g transform="rotate(-8 460 470)">
          <rect x="350" y="370" width="230" height="150" rx="10" fill="#f3a865" />
          <rect x="362" y="382" width="206" height="126" rx="4" fill="#3a231a" />
          <rect x="380" y="400" width="70" height="8" rx="4" fill="#c46b3a" />
          <rect x="380" y="418" width="120" height="6" rx="3" fill="#e8b68e" opacity=".6" />
          <path d="M380 490 l25 -20 l20 10 l30 -30 l25 15 l40 -35" stroke="#f3a865" strokeWidth="4" fill="none" />
          <path d="M335 528 h260 l-22 20 h-216 z" fill="#e9965a" />
        </g>
        <rect x="880" y="610" width="260" height="34" rx="14" fill="#f0d5bc" />
        {[60, 95, 75, 130, 105].map((h, i) => (
          <rect key={i} x={900 + i * 46} y={610 - h} width="30" height={h} rx="4" fill={i === 3 ? '#c46b3a' : i % 2 ? '#f3a865' : '#e8b68e'} />
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <circle key={i} cx={(i * 211) % 1440} cy={(i * 137) % 600 + 40} r={i % 4 ? 1.6 : 2.6} fill="#fff6e6" opacity=".85" />
        ))}
      </svg>
    </div>
  );
}
