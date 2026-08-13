/**
 * Single source of truth for everything on the site.
 *
 * To update the portfolio, edit the values below — no need to touch any
 * component. Fields marked TODO are intentionally left blank/placeholder
 * (no personal contact details are published yet).
 */

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  availability: string;
  summary: string[];
  /** Leave a link empty ("") to hide that icon from the nav/footer. */
  socialLinks: {
    email: string;
    /** E.164-ish display format, e.g. "+1 555 123 4567". Leave empty to hide the phone-reveal button. */
    phone: string;
    linkedin: string;
    github: string;
    resumeUrl: string;
  };
};

export type SkillGroup = {
  category: string;
  /** One-line "what I do" framing for this specialty, shown above the skill tags. */
  description: string;
  skills: string[];
};

export type ExperienceEntry = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
};

export type ProjectEntry = {
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  /** Optional links — leave empty to hide the button. */
  link?: string;
  repo?: string;
};

export type EducationEntry = {
  school: string;
  credential: string;
  field: string;
  period: string;
};

export const profile: Profile = {
  name: "Rajendra Dharanikota",
  role: "Data Analyst & Analytics Engineer",
  tagline:
    "I turn large, messy datasets into clear insights and dashboards that leadership teams trust and act on.",
  location: "Ontario, Canada",
  availability: "Open to Senior / Lead Data Analyst & Analytics Engineer roles",
  summary: [
    "Data Analyst and Analytics Engineer with 7+ years of experience driving revenue analytics, customer retention, pricing strategy, and business performance across subscription-based and analytics-driven environments.",
    "Proven track record developing scalable analytical frameworks, KPI reporting systems, and executive dashboards that support revenue growth, customer lifecycle optimization, forecasting, and strategic decision making.",
    "Advanced expertise in SQL, Python, Tableau, and SparkSQL, with strong experience analyzing large-scale customer, operational, financial, and product usage datasets to generate actionable business insights.",
    "Strong analytical storyteller — I translate complex data into compelling narratives, scalable reporting solutions, and measurable business outcomes.",
  ],
  socialLinks: {
    // TODO: fill phone in when you're ready to publish it.
    email: "d.rajendrakamal4095@gmail.com",
    phone: "",
    linkedin: "https://www.linkedin.com/in/rajendra-dharanikota-m-eng-865389171/",
    github: "",
    resumeUrl: "Rajendra-Dharanikota-Resume.pdf",
  },
};

/**
 * Powers the "Send a message" form in the Contact section — it posts
 * directly to Web3Forms so visitors never see your email address.
 *
 * To turn it on:
 *   1. Go to https://web3forms.com and enter the email you want messages
 *      delivered to. No account/dashboard needed.
 *   2. Copy the Access Key it emails you and paste it below.
 * Leave it blank to hide the form.
 */
export const contactForm = {
  // TEMP preview key so the form is visible for testing — swap for your
  // real Web3Forms Access Key (see instructions above) before publishing.
  web3formsAccessKey: "preview-only-not-a-real-key",
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Analytics & BI Tools",
    description:
      "I design and build executive dashboards and reporting systems that leadership actually trusts and uses day to day.",
    skills: [
      "SQL",
      "PostgreSQL",
      "Python",
      "Spark",
      "Tableau",
      "Power BI",
      "Looker",
      "dbt",
      "Airflow",
      "Excel",
    ],
  },
  {
    category: "Revenue & Strategic Analytics",
    description:
      "I build pricing, retention, and customer lifecycle analytics frameworks — cohort, funnel, and health-scoring models — that inform revenue and forecasting decisions.",
    skills: [
      "Revenue Analytics",
      "Pricing Strategy",
      "Customer Lifecycle Analytics",
      "Retention & Churn Analysis",
      "Cohort Analysis",
      "Funnel Analysis",
      "Customer Segmentation",
      "Forecasting",
      "KPI Development",
      "Customer Health Scoring",
      "Predictive Modeling",
      "Statistical Analysis",
    ],
  },
  {
    category: "Data & Technical Skills",
    description:
      "I build and automate the data pipelines underneath the dashboards — SQL-based ETL, data validation, and reconciliation frameworks that keep reporting accurate at scale.",
    skills: [
      "Advanced SQL",
      "CTEs & Window Functions",
      "Query Optimization",
      "Data Modeling",
      "ETL Concepts",
      "Data Validation & Profiling",
      "Data Reconciliation",
      "Root Cause Analysis",
      "Dashboard Development",
      "Reporting Automation",
    ],
  },
  {
    category: "Business & Cross-Functional Skills",
    description:
      "I bring the analysis into the room — partnering with leadership and cross-functional teams, translating findings into decisions, and mentoring the analysts around me.",
    skills: [
      "Cross-Functional Stakeholder Management",
      "Executive Communication",
      "Business Intelligence",
      "Analytical Problem Solving",
      "Mentoring",
      "Portfolio Management",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Sr. Pricing Strategy & Data Analyst",
    company: "CARFAX Inc.",
    location: "Remote",
    start: "Oct 2022",
    end: "Present",
    highlights: [
      "Led strategic analytics initiatives across 3 core B2B subscription products contributing ~80% of company revenue, supporting pricing strategy, retention optimization, forecasting, and executive decision making.",
      "Built customer retention and revenue-risk scoring frameworks that improved retention prediction accuracy by 5%, enabling proactive customer preservation and expansion strategies.",
      "Developed executive KPI dashboards and portfolio reporting frameworks used org-wide to monitor revenue performance, customer health, and lifecycle metrics.",
      "Automated recurring analytics and reporting workflows using SQL and Python, significantly reducing manual effort and improving reporting reliability.",
      "Co-developed enterprise Tableau dashboards leveraged by leadership to monitor pricing performance, retention trends, and strategic KPIs.",
    ],
  },
  {
    role: "Business Data Analyst",
    company: "WattsWorth Analysis Inc. & Utilismart Corp",
    location: "Ontario, Canada",
    start: "Dec 2020",
    end: "Oct 2022",
    highlights: [
      "Built and optimized data pipelines using dbt, improving reliability and accessibility of large-scale operational and financial datasets.",
      "Automated data ingestion and transformation workflows using Python, reducing manual effort by 40% and improving data refresh reliability.",
      "Developed KPI dashboards and executive reporting solutions that contributed to a 10% increase in sales through insight-driven actions.",
      "Created technical documentation for reporting logic, transformation rules, and validation processes to support long-term reporting governance.",
    ],
  },
  {
    role: "Data Analyst — Lead",
    company: "Ishtriwala",
    location: "Andhra Pradesh, India",
    start: "Jul 2019",
    end: "Dec 2020",
    highlights: [
      "Built and automated data pipelines using Python and SQL to support customer and operational analytics across B2B and B2C services.",
      "Designed data validation frameworks that improved data quality and reduced reporting errors by 30%.",
      "Applied NLP techniques (text processing, keyword extraction, sentiment analysis) on customer feedback to detect high-risk interactions and recurring service issues.",
      "Enabled near real-time reporting by automating ingestion and transformation workflows across multiple data sources.",
    ],
  },
  {
    role: "Intern Analyst",
    company: "BHEL (Bharat Heavy Electricals Limited)",
    location: "Telangana, India",
    start: "Jun 2017",
    end: "Nov 2017",
    highlights: [
      "Conducted data analysis using SQL and Tableau to assess performance across power components.",
      "Developed Tableau dashboards and reports supporting operational monitoring and leadership decision making.",
    ],
  },
];

export const projects: ProjectEntry[] = [
  {
    title: "Revenue Risk & Retention Prediction Model",
    description:
      "A logistic regression model that predicts customer risk and retention outcomes from behavioural, engagement, adoption, and financial features.",
    highlights: [
      "Engineered customer health indicators and predictive signals for lifecycle analytics and retention simulations.",
      "Evaluated model performance with precision/recall optimization and delivered insights to support revenue-preservation initiatives.",
    ],
    tags: ["Python", "Logistic Regression", "Retention"],
    link: "",
    repo: "",
  },
  {
    title: "Customer 360 Lifecycle Analytics Framework",
    description:
      "A unified customer analytics model combining product usage, billing, engagement, and lifecycle data into one holistic view of customer behavior.",
    highlights: [
      "Built customer health indicators and retention-risk signals from behavioral, tenure, and adoption patterns.",
      "Delivered dashboards and cohort analysis frameworks used to guide retention strategy and lifecycle decisions.",
    ],
    tags: ["SQL", "Tableau", "Cohort Analysis"],
    link: "",
    repo: "",
  },
  {
    title: "Funnel & Retention Optimization Analysis",
    description:
      "An end-to-end analysis of the customer journey from acquisition to renewal, built to surface where customers drop off.",
    highlights: [
      "Built SQL-driven funnel models to measure conversion efficiency across lifecycle stages.",
      "Delivered actionable insights that informed customer engagement and lifecycle marketing strategy.",
    ],
    tags: ["SQL", "Funnel Analysis", "Marketing Analytics"],
    link: "",
    repo: "",
  },
];

export const education: EducationEntry[] = [
  {
    school: "University of Western Ontario",
    credential: "Master of Engineering",
    field: "Data Science (Software Engineering specialization)",
    period: "",
  },
];

export type ProcessStep = {
  title: string;
  description: string;
};

/** The "My Analytics Process" section — how the roles/highlights above actually get done. */
export const analyticsProcess: ProcessStep[] = [
  {
    title: "Understand the business question",
    description:
      "Partner with leadership, product, and commercial teams to pin down the metrics and decision that actually matter.",
  },
  {
    title: "Source & validate the data",
    description:
      "Integrate multi-source customer, financial, and operational data — profiling, reconciliation, and root-cause analysis before any number gets trusted.",
  },
  {
    title: "Build the models & dashboards",
    description:
      "Design SQL-driven analytical frameworks, predictive models, and executive dashboards that scale with the business.",
  },
  {
    title: "Deliver insights & drive decisions",
    description:
      "Translate the analysis into a clear recommendation, plus the reporting automation to keep it current.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

/**
 * Real LinkedIn recommendations. To add another, copy its text/name/title
 * from linkedin.com/in/<you>/details/recommendations/ and append an entry
 * below with `isPlaceholder: false`. Setting `isPlaceholder: true` on an
 * entry (or adding a new one with placeholder text) automatically brings
 * back the "placeholder" badge and note — see TestimonialCard.tsx.
 */
export const testimonials: (Testimonial & { isPlaceholder: boolean })[] = [
  {
    quote:
      "I had the pleasure of working with Rajendra for just over a year. Our tasks were plenty in product development, but our focus was always to provide our customers with key data insights to help inform business decisions. Rajendra embodied that focus with ambition, curiosity, and a persistent smile. I am grateful to have had him on my team.",
    name: "Miguel Gil",
    title: "Director, Reporting & Analytics, Canaccede Financial Group · former manager",
    isPlaceholder: false,
  },
  {
    quote:
      "Rajendra is one of the best creative students I have encountered in my teaching career. He is a smart working guy coupled with good team spirit and leadership qualities. His enthusiasm in upgrading his skills regularly definitely makes him successful in his professional life.",
    name: "Prof. Prabhakar V S V",
    title: "Director, Industry Relations & Placements; Professor of AI & Data Science · mentor",
    isPlaceholder: false,
  },
];
