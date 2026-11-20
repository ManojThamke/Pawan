import { useEffect, useRef } from 'react';
import type { Project } from '../data/portfolio';
import { paintScreen } from '../scene/screenTexture';

const FLOWS: Record<Project['visual'], { title: string; note?: string }[]> = {
  nids: [
    { title: 'Flow records', note: 'CICIDS2018 · 2M+' },
    { title: 'Clean & EDA' },
    { title: 'Imbalance handling' },
    { title: 'Feature engineering' },
    { title: '9 model strategies', note: 'benchmarked' },
    { title: '14-class output', note: 'confusion matrices' },
  ],
  sales: [
    { title: 'Synthetic data', note: '6,000+ orders · 800 customers' },
    { title: 'Clean with Pandas', note: 'nulls & duplicates' },
    { title: 'KPIs' },
    { title: 'RFM segments' },
    { title: 'Cohort retention', note: '6 months' },
    { title: 'Interactive dashboard', note: 'Chart.js' },
  ],
  caption: [
    { title: 'Uploaded image', note: 'Streamlit' },
    { title: 'ResNet50 encoder', note: 'image features' },
    { title: 'Tokenizer + embeddings' },
    { title: 'LSTM decoder', note: 'word by word' },
    { title: 'Caption' },
  ],
};

/** Original pipeline diagram derived from the README/profile description. */
export function PipelineDiagram({ visual }: { visual: Project['visual'] }) {
  const steps = FLOWS[visual];
  return (
    <figure className="pipeline">
      <ol className="pipeline-steps">
        {steps.map((s, i) => (
          <li key={s.title} className={i === steps.length - 1 ? 'is-out' : ''}>
            <span className="pipeline-idx" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="pipeline-title">{s.title}</span>
            {s.note && <span className="pipeline-note">{s.note}</span>}
          </li>
        ))}
      </ol>
      <figcaption>Original diagram of the pipeline described in the source.</figcaption>
    </figure>
  );
}

/** The same original mockup shown on the 3D laptop, as a flat framed image. */
export function ScreenMockup({ visual, label }: { visual: Project['visual']; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const paint = () => paintScreen(c, visual);
    paint();
    document.fonts?.ready.then(paint);
  }, [visual]);
  return (
    <figure className="mockup">
      <div className="mockup-frame">
        <canvas ref={ref} width={960} height={560} role="img" aria-label={`Illustrative interface mockup for ${label}`} />
      </div>
      <figcaption>Illustrative mockup, not a screenshot of the project.</figcaption>
    </figure>
  );
}
