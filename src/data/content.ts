/**
 * Single source of truth for everything on the site.
 *
 * To update the portfolio, edit the values below — no need to touch any
 * component. Fields marked TODO are intentionally left blank/placeholder
 * (no personal contact details are published yet).
 *
 * BILINGUAL CONTENT: most text fields are `Localized` — `{ en: "...", fr:
 * "..." }` — instead of a plain string, so the site can switch between
 * English and French (see src/i18n/language.tsx for the toggle itself).
 * When adding a new entry to any array below (a new job, project, etc.),
 * fill in both `en` and `fr` for every Localized field — TypeScript will
 * error if either is missing. Short technical skill/tag chips (SQL,
 * Tableau, "Cohort Analysis", ...) are deliberately plain strings, not
 * Localized — those stay English in both languages, matching how they're
 * actually used on French-language tech resumes/job postings. Fixed UI
 * labels (button text, form fields, section headings) live in
 * src/i18n/strings.ts instead, not here.
 */

import type { Localized } from "../i18n/language";

export type Profile = {
  name: string;
  role: Localized;
  tagline: Localized;
  location: Localized;
  availability: Localized;
  summary: Localized[];
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
  category: Localized;
  /** One-line "what I do" framing for this specialty, shown above the skill tags. */
  description: Localized;
  /** Tool/skill names — plain strings, not Localized (see file header). */
  skills: string[];
};

export type ExperienceEntry = {
  role: Localized;
  company: Localized;
  location: Localized;
  start: Localized;
  end: Localized;
  highlights: Localized[];
};

export type ProjectEntry = {
  title: Localized;
  description: Localized;
  highlights: Localized[];
  /** Tags — plain strings, not Localized (see file header). */
  tags: string[];
  /** Optional links — leave empty to hide the button. */
  link?: string;
  repo?: string;
};

export type EducationEntry = {
  school: string;
  credential: Localized;
  field: Localized;
  period: string;
};

export const profile: Profile = {
  name: "Rajendra Dharanikota",
  role: { en: "Data Analyst & Analytics Engineer", fr: "Analyste de données et ingénieur analytique" },
  tagline: {
    en: "I turn large, messy datasets into clear insights and dashboards that leadership teams trust and act on.",
    fr: "Je transforme des ensembles de données volumineux et complexes en informations claires et en tableaux de bord auxquels les équipes de direction font confiance et sur lesquels elles s'appuient pour agir.",
  },
  location: { en: "Ontario, Canada", fr: "Ontario, Canada" },
  availability: {
    en: "Open to Senior / Lead Data Analyst & Analytics Engineer roles",
    fr: "Ouvert aux postes d'analyste de données ou d'ingénieur analytique, senior ou principal",
  },
  summary: [
    {
      en: "Data Analyst and Analytics Engineer with 7+ years of experience driving revenue analytics, customer retention, pricing strategy, and business performance across subscription-based and analytics-driven environments.",
      fr: "Analyste de données et ingénieur analytique avec plus de 7 ans d'expérience en analyse des revenus, fidélisation de la clientèle, stratégie de tarification et performance d'affaires, au sein d'environnements axés sur l'abonnement et l'analytique.",
    },
    {
      en: "Proven track record developing scalable analytical frameworks, KPI reporting systems, and executive dashboards that support revenue growth, customer lifecycle optimization, forecasting, and strategic decision making.",
      fr: "Feuille de route éprouvée dans le développement de cadres analytiques évolutifs, de systèmes de rapports d'indicateurs clés de performance (ICP) et de tableaux de bord exécutifs soutenant la croissance des revenus, l'optimisation du cycle de vie client, la prévision et la prise de décisions stratégiques.",
    },
    {
      en: "Advanced expertise in SQL, Python, Tableau, and Spark, with strong experience analyzing large-scale customer, operational, financial, and product usage datasets to generate actionable business insights.",
      fr: "Expertise avancée en SQL, Python, Tableau et Spark, avec une solide expérience dans l'analyse de vastes ensembles de données clients, opérationnelles, financières et d'utilisation de produits, afin de générer des informations d'affaires exploitables.",
    },
    {
      en: "Strong analytical storyteller — I translate complex data into compelling narratives, scalable reporting solutions, and measurable business outcomes.",
      fr: "Excellent communicateur analytique — je transforme des données complexes en récits convaincants, en solutions de rapports évolutives et en résultats d'affaires mesurables.",
    },
  ],
  socialLinks: {
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
    category: { en: "Analytics & BI Tools", fr: "Analytique et outils de BI" },
    description: {
      en: "I design and build executive dashboards and reporting systems that leadership actually trusts and uses day to day.",
      fr: "Je conçois et bâtis des tableaux de bord exécutifs et des systèmes de rapports auxquels la direction fait réellement confiance et qu'elle utilise au quotidien.",
    },
    skills: ["SQL", "PostgreSQL", "Python", "Spark", "Tableau", "Power BI", "Looker", "dbt", "Airflow", "Excel"],
  },
  {
    category: { en: "Revenue & Strategic Analytics", fr: "Revenus et analytique stratégique" },
    description: {
      en: "I build pricing, retention, and customer lifecycle analytics frameworks — cohort, funnel, and health-scoring models — that inform revenue and forecasting decisions.",
      fr: "Je construis des cadres d'analyse de la tarification, de la fidélisation et du cycle de vie client — modèles de cohortes, d'entonnoirs et de pointage de santé client — qui éclairent les décisions liées aux revenus et aux prévisions.",
    },
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
    category: { en: "Data & Technical Skills", fr: "Données et compétences techniques" },
    description: {
      en: "I build and automate the data pipelines underneath the dashboards — SQL-based ETL, data validation, and reconciliation frameworks that keep reporting accurate at scale.",
      fr: "Je construis et automatise les pipelines de données derrière les tableaux de bord — ETL basé sur SQL, validation des données et cadres de rapprochement qui assurent l'exactitude des rapports à grande échelle.",
    },
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
    category: { en: "Business & Cross-Functional Skills", fr: "Compétences d'affaires et transversales" },
    description: {
      en: "I bring the analysis into the room — partnering with leadership and cross-functional teams, translating findings into decisions, and mentoring the analysts around me.",
      fr: "J'apporte l'analyse à la table de décision — en collaborant avec la direction et les équipes transversales, en traduisant les constats en décisions, et en encadrant les analystes autour de moi.",
    },
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
    // TODO: confirm exact start date once this one is officially underway —
    // set here as "Sep 2026" only because that's when the CARFAX role below
    // ends; adjust if the actual start date differs.
    role: { en: "Senior Data Analyst", fr: "Analyste de données senior" },
    company: { en: "Ciklum (Client: GoodRx)", fr: "Ciklum (Client : GoodRx)" },
    location: { en: "", fr: "" },
    start: { en: "Sep 2026", fr: "sept. 2026" },
    end: { en: "Upcoming", fr: "À venir" },
    highlights: [],
  },
  {
    role: { en: "Sr. Pricing Strategy & Data Analyst", fr: "Analyste senior, stratégie de tarification et données" },
    company: { en: "CARFAX Inc.", fr: "CARFAX Inc." },
    location: { en: "Remote", fr: "Télétravail" },
    start: { en: "Oct 2022", fr: "oct. 2022" },
    end: { en: "Sep 2026", fr: "sept. 2026" },
    highlights: [
      {
        en: "Led strategic analytics initiatives across 3 core B2B subscription products contributing ~80% of company revenue, supporting pricing strategy, retention optimization, forecasting, and executive decision making.",
        fr: "Dirigé des initiatives d'analytique stratégique pour 3 produits d'abonnement B2B essentiels représentant environ 80 % des revenus de l'entreprise, à l'appui de la stratégie de tarification, de l'optimisation de la fidélisation, des prévisions et de la prise de décisions exécutives.",
      },
      {
        en: "Built customer retention and revenue-risk scoring frameworks that improved retention prediction accuracy by 5%, enabling proactive customer preservation and expansion strategies.",
        fr: "Élaboré des cadres de pointage de fidélisation et de risque de revenus ayant amélioré de 5 % la précision des prévisions de fidélisation, permettant des stratégies proactives de rétention et d'expansion de la clientèle.",
      },
      {
        en: "Developed executive KPI dashboards and portfolio reporting frameworks used org-wide to monitor revenue performance, customer health, and lifecycle metrics.",
        fr: "Développé des tableaux de bord d'ICP exécutifs et des cadres de rapports de portefeuille utilisés dans toute l'organisation pour suivre la performance des revenus, la santé client et les indicateurs de cycle de vie.",
      },
      {
        en: "Automated recurring analytics and reporting workflows using SQL and Python, significantly reducing manual effort and improving reporting reliability.",
        fr: "Automatisé les flux de travail analytiques et de rapports récurrents à l'aide de SQL et Python, réduisant considérablement l'effort manuel et améliorant la fiabilité des rapports.",
      },
      {
        en: "Co-developed enterprise Tableau dashboards leveraged by leadership to monitor pricing performance, retention trends, and strategic KPIs.",
        fr: "Co-développé des tableaux de bord Tableau d'entreprise utilisés par la direction pour suivre la performance de la tarification, les tendances de fidélisation et les ICP stratégiques.",
      },
    ],
  },
  {
    role: { en: "Business Data Analyst", fr: "Analyste de données d'affaires" },
    company: { en: "WattsWorth Analysis Inc. & Utilismart Corp", fr: "WattsWorth Analysis Inc. & Utilismart Corp" },
    location: { en: "Ontario, Canada", fr: "Ontario, Canada" },
    start: { en: "Dec 2020", fr: "déc. 2020" },
    end: { en: "Oct 2022", fr: "oct. 2022" },
    highlights: [
      {
        en: "Built and optimized data pipelines using dbt, improving reliability and accessibility of large-scale operational and financial datasets.",
        fr: "Construit et optimisé des pipelines de données avec dbt, améliorant la fiabilité et l'accessibilité de vastes ensembles de données opérationnelles et financières.",
      },
      {
        en: "Automated data ingestion and transformation workflows using Python, reducing manual effort by 40% and improving data refresh reliability.",
        fr: "Automatisé les flux d'ingestion et de transformation des données avec Python, réduisant l'effort manuel de 40 % et améliorant la fiabilité de l'actualisation des données.",
      },
      {
        en: "Developed KPI dashboards and executive reporting solutions that contributed to a 10% increase in sales through insight-driven actions.",
        fr: "Développé des tableaux de bord d'ICP et des solutions de rapports exécutifs ayant contribué à une hausse de 10 % des ventes grâce à des actions fondées sur les données.",
      },
      {
        en: "Created technical documentation for reporting logic, transformation rules, and validation processes to support long-term reporting governance.",
        fr: "Créé de la documentation technique sur la logique de rapport, les règles de transformation et les processus de validation, à l'appui d'une gouvernance des rapports à long terme.",
      },
    ],
  },
  {
    role: { en: "Data Analyst — Lead", fr: "Analyste de données — Chef d'équipe" },
    company: { en: "Ishtriwala", fr: "Ishtriwala" },
    location: { en: "Andhra Pradesh, India", fr: "Andhra Pradesh, Inde" },
    start: { en: "Jul 2019", fr: "juill. 2019" },
    end: { en: "Dec 2020", fr: "déc. 2020" },
    highlights: [
      {
        en: "Built and automated data pipelines using Python and SQL to support customer and operational analytics across B2B and B2C services.",
        fr: "Construit et automatisé des pipelines de données avec Python et SQL pour soutenir l'analytique client et opérationnelle des services B2B et B2C.",
      },
      {
        en: "Designed data validation frameworks that improved data quality and reduced reporting errors by 30%.",
        fr: "Conçu des cadres de validation des données ayant amélioré la qualité des données et réduit les erreurs de rapport de 30 %.",
      },
      {
        en: "Applied NLP techniques (text processing, keyword extraction, sentiment analysis) on customer feedback to detect high-risk interactions and recurring service issues.",
        fr: "Appliqué des techniques de TALN (traitement de texte, extraction de mots-clés, analyse de sentiment) aux commentaires clients pour détecter les interactions à risque élevé et les problèmes de service récurrents.",
      },
      {
        en: "Enabled near real-time reporting by automating ingestion and transformation workflows across multiple data sources.",
        fr: "Permis des rapports en quasi temps réel en automatisant les flux d'ingestion et de transformation à partir de multiples sources de données.",
      },
    ],
  },
  {
    role: { en: "Intern Analyst", fr: "Analyste stagiaire" },
    company: { en: "BHEL (Bharat Heavy Electricals Limited)", fr: "BHEL (Bharat Heavy Electricals Limited)" },
    location: { en: "Telangana, India", fr: "Telangana, Inde" },
    start: { en: "Jun 2017", fr: "juin 2017" },
    end: { en: "Nov 2017", fr: "nov. 2017" },
    highlights: [
      {
        en: "Conducted data analysis using SQL and Tableau to assess performance across power components.",
        fr: "Réalisé des analyses de données avec SQL et Tableau pour évaluer la performance de composants électriques.",
      },
      {
        en: "Developed Tableau dashboards and reports supporting operational monitoring and leadership decision making.",
        fr: "Développé des tableaux de bord et rapports Tableau soutenant le suivi opérationnel et la prise de décisions de la direction.",
      },
    ],
  },
];

export const projects: ProjectEntry[] = [
  {
    title: { en: "Revenue Risk & Retention Prediction Model", fr: "Modèle de prédiction du risque de revenus et de fidélisation" },
    description: {
      en: "A logistic regression model that predicts customer risk and retention outcomes from behavioural, engagement, adoption, and financial features.",
      fr: "Un modèle de régression logistique prédisant le risque client et les résultats de fidélisation à partir de caractéristiques comportementales, d'engagement, d'adoption et financières.",
    },
    highlights: [
      {
        en: "Engineered customer health indicators and predictive signals for lifecycle analytics and retention simulations.",
        fr: "Conçu des indicateurs de santé client et des signaux prédictifs pour l'analytique du cycle de vie et les simulations de fidélisation.",
      },
      {
        en: "Evaluated model performance with precision/recall optimization and delivered insights to support revenue-preservation initiatives.",
        fr: "Évalué la performance du modèle par l'optimisation précision/rappel et livré des constats à l'appui des initiatives de préservation des revenus.",
      },
    ],
    tags: ["Python", "Logistic Regression", "Retention"],
    link: "",
    repo: "",
  },
  {
    title: { en: "Customer 360 Lifecycle Analytics Framework", fr: "Cadre d'analytique du cycle de vie client à 360 degrés" },
    description: {
      en: "A unified customer analytics model combining product usage, billing, engagement, and lifecycle data into one holistic view of customer behavior.",
      fr: "Un modèle d'analytique client unifié combinant l'utilisation du produit, la facturation, l'engagement et les données de cycle de vie en une vue holistique du comportement client.",
    },
    highlights: [
      {
        en: "Built customer health indicators and retention-risk signals from behavioral, tenure, and adoption patterns.",
        fr: "Construit des indicateurs de santé client et des signaux de risque de fidélisation à partir de comportements, d'ancienneté et de tendances d'adoption.",
      },
      {
        en: "Delivered dashboards and cohort analysis frameworks used to guide retention strategy and lifecycle decisions.",
        fr: "Livré des tableaux de bord et des cadres d'analyse de cohortes utilisés pour orienter la stratégie de fidélisation et les décisions liées au cycle de vie.",
      },
    ],
    tags: ["SQL", "Tableau", "Cohort Analysis"],
    link: "",
    repo: "",
  },
  {
    title: { en: "Funnel & Retention Optimization Analysis", fr: "Analyse d'optimisation de l'entonnoir et de la fidélisation" },
    description: {
      en: "An end-to-end analysis of the customer journey from acquisition to renewal, built to surface where customers drop off.",
      fr: "Une analyse de bout en bout du parcours client, de l'acquisition au renouvellement, conçue pour révéler les points d'abandon des clients.",
    },
    highlights: [
      {
        en: "Built SQL-driven funnel models to measure conversion efficiency across lifecycle stages.",
        fr: "Construit des modèles d'entonnoir basés sur SQL pour mesurer l'efficacité de conversion à chaque étape du cycle de vie.",
      },
      {
        en: "Delivered actionable insights that informed customer engagement and lifecycle marketing strategy.",
        fr: "Livré des constats exploitables ayant orienté la stratégie d'engagement client et de marketing du cycle de vie.",
      },
    ],
    tags: ["SQL", "Funnel Analysis", "Marketing Analytics"],
    link: "",
    repo: "",
  },
];

export const education: EducationEntry[] = [
  {
    school: "University of Western Ontario",
    credential: { en: "Master of Engineering", fr: "Maîtrise en ingénierie" },
    field: {
      en: "Data Science (Software Engineering specialization)",
      fr: "Science des données (spécialisation en génie logiciel)",
    },
    period: "",
  },
];

export type ProcessStep = {
  title: Localized;
  description: Localized;
};

/** The "My Analytics Process" section — how the roles/highlights above actually get done. */
export const analyticsProcess: ProcessStep[] = [
  {
    title: { en: "Understand the business question", fr: "Comprendre la question d'affaires" },
    description: {
      en: "Partner with leadership, product, and commercial teams to pin down the metrics and decision that actually matter.",
      fr: "Collaborer avec la direction, le produit et les équipes commerciales pour cerner les indicateurs et la décision qui comptent vraiment.",
    },
  },
  {
    title: { en: "Source & validate the data", fr: "Répertorier et valider les données" },
    description: {
      en: "Integrate multi-source customer, financial, and operational data — profiling, reconciliation, and root-cause analysis before any number gets trusted.",
      fr: "Intégrer des données clients, financières et opérationnelles multi-sources — profilage, rapprochement et analyse des causes profondes avant que tout chiffre soit jugé fiable.",
    },
  },
  {
    title: { en: "Build the models & dashboards", fr: "Construire les modèles et tableaux de bord" },
    description: {
      en: "Design SQL-driven analytical frameworks, predictive models, and executive dashboards that scale with the business.",
      fr: "Concevoir des cadres analytiques basés sur SQL, des modèles prédictifs et des tableaux de bord exécutifs qui évoluent avec l'entreprise.",
    },
  },
  {
    title: { en: "Deliver insights & drive decisions", fr: "Livrer les constats et orienter les décisions" },
    description: {
      en: "Translate the analysis into a clear recommendation, plus the reporting automation to keep it current.",
      fr: "Traduire l'analyse en une recommandation claire, avec l'automatisation des rapports pour la garder à jour.",
    },
  },
];

export type Testimonial = {
  quote: Localized;
  name: string;
  title: Localized;
};

/**
 * Real LinkedIn recommendations. To add another, copy its text/name/title
 * from linkedin.com/in/<you>/details/recommendations/ and append an entry
 * below with `isPlaceholder: false` — both `en` and `fr` on `quote`/`title`
 * are required; if you don't have a French version yet, it's reasonable to
 * repeat the English text in `fr` as a temporary stand-in. Setting
 * `isPlaceholder: true` on an entry (or adding a new one with placeholder
 * text) automatically brings back the "placeholder" badge and note — see
 * TestimonialCard.tsx.
 */
export const testimonials: (Testimonial & { isPlaceholder: boolean })[] = [
  {
    quote: {
      en: "I had the pleasure of working with Rajendra for just over a year. Our tasks were plenty in product development, but our focus was always to provide our customers with key data insights to help inform business decisions. Rajendra embodied that focus with ambition, curiosity, and a persistent smile. I am grateful to have had him on my team.",
      fr: "J'ai eu le plaisir de travailler avec Rajendra pendant un peu plus d'un an. Nos tâches étaient nombreuses en développement de produits, mais notre priorité a toujours été d'offrir à nos clients des informations clés issues des données pour éclairer les décisions d'affaires. Rajendra incarnait cette priorité avec ambition, curiosité et un sourire constant. Je suis reconnaissant de l'avoir eu dans mon équipe.",
    },
    name: "Miguel Gil",
    title: {
      en: "Director, Reporting & Analytics, Canaccede Financial Group · former manager",
      fr: "Directeur, Rapports et analytique, Canaccede Financial Group · ancien gestionnaire",
    },
    isPlaceholder: false,
  },
  {
    quote: {
      en: "Rajendra is one of the best creative students I have encountered in my teaching career. He is a smart working guy coupled with good team spirit and leadership qualities. His enthusiasm in upgrading his skills regularly definitely makes him successful in his professional life.",
      fr: "Rajendra est l'un des étudiants les plus créatifs que j'aie rencontrés au cours de ma carrière d'enseignant. C'est quelqu'un qui travaille intelligemment, doté d'un bon esprit d'équipe et de qualités de leadership. Son enthousiasme à perfectionner régulièrement ses compétences contribue assurément à sa réussite professionnelle.",
    },
    name: "Prof. Prabhakar V S V",
    title: {
      en: "Director, Industry Relations & Placements; Professor of AI & Data Science · mentor",
      fr: "Directeur, Relations industrielles et placements; professeur en IA et science des données · mentor",
    },
    isPlaceholder: false,
  },
];
