/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — edit this file to update the site.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Sources (checked 2026-11-20):
 *    • GitHub profile + profile README: https://github.com/Pawanmarke497
 *    • Repository READMEs linked from each project below.
 *
 *  Placeholder convention: any value wrapped in square brackets, e.g.
 *  "[RESUME URL]", is treated as MISSING and is hidden on the rendered page.
 *  Replace it with a real value to make it appear.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Source = 'profile' | 'readme';

export interface Metric {
  value: string;
  label: string;
  /** Who reported the number — always shown next to it. */
  source: Source;
}

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  categories: string[];
  summary: string;
  overview: string;
  goal?: string;
  approach: string[];
  features: string[];
  stack: string[];
  dataNote?: string;
  metrics?: Metric[];
  metricsNote?: string;
  repo: string;
  liveDemo: string; // "[LIVE DEMO URL]" until a verified deployment exists
  sourceLabel: string;
  /** Which original illustration the scene + case study use. */
  visual: 'nids' | 'sales' | 'caption';
}

/** Returns true if a value is a real, filled-in value (not empty or a [PLACEHOLDER]). */
export const isFilled = (v?: string | null): v is string =>
  !!v && v.trim() !== '' && !/^\[.*\]$/.test(v.trim());

export const profile = {
  name: 'Pawan Marke',
  firstName: 'Pawan',
  lastName: 'Marke',
  fullName: 'Pawan Chandrakant Marke',
  monogram: 'PM',
  roles: ['Python Developer', 'Data Analyst', 'Aspiring Software Engineer'],
  headline: 'Data Science · Generative AI · Machine Learning · Power BI · Python · SQL',
  education: 'B.E. Computer Engineering',
  /** Shown as profile-README badges on GitHub (rechecked 2026-11-20). */
  cgpa: '8.30 / 10',
  location: 'Kalyan, Maharashtra',

  /**
   * Portrait: put an approved image in /public (e.g. /portrait.jpg) and set the path here.
   * While this is a placeholder, the About page shows an illustrated stand-in.
   */
  portrait: '[PORTRAIT ASSET]',
  portraitAlt: 'Portrait of Pawan Marke',

  /** Only shown when replaced with a real URL. Never link to a fabricated file. */
  resumeUrl: '[RESUME URL]',

  summary:
    'Pawan is a B.E. Computer Engineering student who works with Python, data analysis and machine learning. His public projects span network-intrusion classification, customer and sales analytics, and image captioning with deep learning.',

  focusAreas: [
    {
      title: 'Programming',
      items: ['Python', 'Object-oriented programming', 'Data structures & algorithms'],
    },
    {
      title: 'Data & BI',
      items: ['Data analysis', 'Statistical modeling', 'Business intelligence', 'Power BI', 'SQL'],
    },
    {
      title: 'Machine learning',
      items: ['Predictive modeling', 'Feature engineering', 'Generative AI'],
    },
    {
      title: 'Backend',
      items: ['Django', 'Flask', 'REST APIs'],
    },
  ],

  currentlyLearning: [
    'Django & Flask',
    'REST API design',
    'React / Angular fundamentals',
    'Cloud deployment basics',
    'Advanced SQL query optimization',
  ],

  experience: [
    {
      role: 'Data Analytics with Python & Power BI — Virtual Intern',
      org: 'EduSkills Academy',
      orgNote: 'in collaboration with AICTE & the National Internship Portal',
      dates: 'Jan – Mar 2026',
      details: [
        '10-week virtual internship.',
        'Data cleaning and exploratory analysis with Pandas and NumPy; Power BI dashboards with DAX and data modeling.',
        'Graded Outstanding (O), as listed on the profile.',
      ],
    },
    {
      role: 'Python Industrial Training Intern',
      org: 'SQuAD Infotech Pvt. Ltd.',
      orgNote: 'Vashi, Navi Mumbai',
      dates: 'Jul – Aug 2022',
      details: ['Six-week hands-on Python training program.'],
    },
  ],

  contact: {
    email: 'markepawan@gmail.com',
    github: 'https://github.com/Pawanmarke497',
    linkedin: 'https://www.linkedin.com/in/pawan-marke-/',
    instagram: 'https://www.instagram.com/marke_pawan',
    facebook: 'https://www.facebook.com/pawan.marke',
  },
};

export const projects: Project[] = [
  {
    slug: 'ml-network-intrusion-detection',
    title: 'ML-Based Network Intrusion Detection System',
    shortTitle: 'Network Intrusion Detection',
    categories: ['Machine Learning', 'Security', 'Classification'],
    summary:
      'An end-to-end pipeline that classifies network flows across 14 attack categories using the CICIDS2018 dataset.',
    overview:
      'A machine-learning pipeline for detecting and classifying network intrusions. It works with the CICIDS2018 dataset — more than 2 million network flow records spanning 14 attack categories — and benchmarks nine model strategies.',
    goal: 'Detect and classify malicious network traffic across many attack categories from flow-level features.',
    approach: [
      'Data cleaning and exploratory analysis of the flow records.',
      'Preprocessing, including missing-value handling and class-imbalance handling.',
      'Feature engineering on network-flow attributes.',
      'Benchmarking of nine model strategies, reported with confusion matrices.',
    ],
    features: [
      'Multi-class classification across 14 attack categories',
      'Class-imbalance handling for rare attack types',
      'Side-by-side benchmark of nine model strategies',
      'Confusion-matrix reporting',
    ],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'LightGBM', 'Pandas'],
    dataNote: 'CICIDS2018 · 2M+ network flow records · 14 attack categories',
    metrics: [
      { value: '99.81%', label: 'Accuracy', source: 'profile' },
      { value: '100%', label: 'Recall', source: 'profile' },
    ],
    metricsNote:
      'Profile-reported results from the GitHub profile README. Not independently verified; no production deployment is implied.',
    repo: 'https://github.com/Pawanmarke497/ML_NIDS',
    liveDemo: '[LIVE DEMO URL]',
    sourceLabel: 'Source: GitHub profile README',
    visual: 'nids',
  },
  {
    slug: 'sales-customer-dashboard',
    title: 'Sales & Customer Data Analysis Dashboard',
    shortTitle: 'Sales & Customer Dashboard',
    categories: ['Data Analysis', 'Dashboard', 'Python'],
    summary:
      'An analytics project on a synthetic e-commerce dataset: cleaning, KPIs, RFM segmentation, cohort retention and an interactive dashboard.',
    overview:
      'An end-to-end analytics project built on a synthetic, generated e-commerce dataset — three years of data with 6,000+ orders and 800 customers. A Python pipeline cleans and analyses the data, and a self-contained HTML dashboard presents the results.',
    goal: 'Turn a raw (synthetic) sales dataset into clear, explorable business metrics.',
    approach: [
      'Generate a three-year synthetic dataset with seasonality and planted data-quality issues (nulls, duplicates).',
      'Clean and analyse it with Pandas and NumPy, calculating KPIs.',
      'Segment customers with RFM (recency, frequency, monetary) analysis.',
      'Measure cohort retention over the first six months.',
      'Present everything in an interactive Chart.js dashboard.',
    ],
    features: [
      'Date, category and region filters',
      'Click-to-filter charts',
      'Animated KPI counters',
      'Searchable, sortable product table',
      'CSV export',
      'Light and dark themes',
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'Chart.js', 'HTML', 'CSS', 'JavaScript'],
    dataNote: 'Synthetic data · 6,000+ orders · 800 customers · 3 years',
    metricsNote:
      'The dataset is synthetic, as stated in the README — findings are illustrative, not real business results.',
    repo: 'https://github.com/Pawanmarke497/Sales-Dashboard-Analysis',
    liveDemo: '[LIVE DEMO URL]',
    sourceLabel: 'Source: repository README',
    visual: 'sales',
  },
  {
    slug: 'ai-image-caption-generator',
    title: 'AI Image Caption Generator',
    shortTitle: 'Image Caption Generator',
    categories: ['Deep Learning', 'Computer Vision', 'NLP'],
    summary:
      'A Streamlit app that captions uploaded images, pairing ResNet50 image features with an LSTM language model.',
    overview:
      'A Python and Streamlit application that generates a caption for an uploaded image. A pretrained ResNet50 extracts visual features, and an LSTM decoder produces the caption word by word. The README lists Flickr8k as the training dataset.',
    goal: 'Automatically describe the contents of an image in natural language.',
    approach: [
      'Extract image features with a pretrained ResNet50 encoder.',
      'Tokenize captions and learn word embeddings.',
      'Train an LSTM decoder to generate captions word by word.',
      'Wrap the model in a Streamlit interface for image upload and captioning.',
    ],
    features: ['Image upload', 'Automatic caption generation', 'Streamlit web interface'],
    stack: ['Python', 'Streamlit', 'TensorFlow', 'Keras', 'NumPy', 'Pandas', 'OpenCV', 'Pillow'],
    dataNote: 'Flickr8k · 8,000 images · 40,000 captions',
    metrics: [
      { value: '91%', label: 'Training accuracy', source: 'readme' },
      { value: '88%', label: 'Validation accuracy', source: 'readme' },
      { value: '0.71', label: 'BLEU score', source: 'readme' },
    ],
    metricsNote: 'README-reported metrics. Not independently validated.',
    repo: 'https://github.com/Pawanmarke497/Ai-image-caption-generation',
    liveDemo: '[LIVE DEMO URL]',
    sourceLabel: 'Source: repository README',
    visual: 'caption',
  },
];

/**
 * Other public repositories. Only add a `description` once it has been checked
 * against the repository's own README.
 */
export const otherRepos: { name: string; url: string; description?: string }[] = [
  {
    name: 'Smart-Expense-Tracker-API',
    url: 'https://github.com/Pawanmarke497/Smart-Expense-Tracker-API',
    description: 'A FastAPI REST API for tracking personal expenses, with a pytest test suite.',
  },
  {
    name: 'binance-trading-bot',
    url: 'https://github.com/Pawanmarke497/binance-trading-bot',
    description: 'A Python CLI for placing orders on the Binance Futures Testnet.',
  },
  { name: 'IPL_POWERBI_DASHBOARD', url: 'https://github.com/Pawanmarke497/IPL_POWERBI_DASHBOARD' },
  { name: 'bug-tracker', url: 'https://github.com/Pawanmarke497/bug-tracker' },
  { name: 'Notes-APP-V2', url: 'https://github.com/Pawanmarke497/Notes-APP-V2' },
  {
    name: 'TNSIF_Pawanmarke_CoreJavaBase',
    url: 'https://github.com/Pawanmarke497/TNSIF_Pawanmarke_CoreJavaBase',
  },
];

export const greetings: { text: string; lang: string; dir?: 'rtl' }[] = [
  { text: 'Hello', lang: 'en' },
  { text: 'नमस्ते', lang: 'hi' },
  { text: 'नमस्कार', lang: 'mr' },
  { text: 'Hola', lang: 'es' },
  { text: 'Bonjour', lang: 'fr' },
  { text: 'こんにちは', lang: 'ja' },
  { text: '你好', lang: 'zh' },
  { text: '안녕하세요', lang: 'ko' },
  { text: 'مرحبًا', lang: 'ar', dir: 'rtl' },
];
