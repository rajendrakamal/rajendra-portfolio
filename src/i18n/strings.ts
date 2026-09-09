import { useLanguage } from "./language";

/**
 * Every piece of fixed UI chrome (button labels, form fields, section
 * kickers/headings, aria-labels, microcopy) that isn't part of the content
 * data in src/data/content.ts. That file holds bilingual *data* (your name,
 * experience, projects, etc. — see its `Localized` fields); this file holds
 * bilingual *interface labels*.
 *
 * To add a new UI string: add the English value under the matching section
 * below, then add the French value in the `fr` block directly beneath it —
 * TypeScript will error if the two objects' shapes ever drift apart.
 *
 * To use it in a component: `const s = useStrings();` then reference e.g.
 * `s.nav.about`.
 */
const en = {
  nav: {
    about: "About",
    skills: "What I Do",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    contact: "Contact",
    blog: "Blog",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    builtWith: "Built with React, TypeScript & Tailwind",
    emailAria: "Email — send a message from the contact section",
    emailTitle: "Send a message from the contact section",
    phoneAria: "Phone — request in the contact section",
    phoneTitle: "Request phone number in the contact section",
    backToTop: "Back to top",
  },
  scrollTop: {
    aria: "Scroll to top",
  },
  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },
  hero: {
    viewProjects: "View projects",
    getInTouch: "Get in touch",
  },
  atAGlance: {
    kicker: "At a glance",
    title: "A quick snapshot",
    subtitle: "Experience, breadth, and the tools I reach for most.",
    yearsExperience: "Years of experience",
    companiesTeams: "Companies & teams",
    toolsTechniques: "Tools & techniques",
  },
  about: {
    kicker: "About",
    title: "Where analytics meets strategy",
  },
  skills: {
    kicker: "What I Do",
    title: "Where I add the most value",
  },
  process: {
    kicker: "How I Work",
    title: "My analytics process",
  },
  experience: {
    kicker: "Experience",
    title: "Where I've made an impact",
    detailsToFollow: "Details to follow once this role is underway.",
  },
  projects: {
    kicker: "Projects",
    title: "Selected work",
    live: "Live",
    code: "Code",
  },
  blogTeaser: {
    kicker: "Blog",
    title: "Recent writing",
    viewAll: "View all posts",
  },
  blogCard: {
    read: "Read",
  },
  education: {
    kicker: "Education",
    title: "Academic background",
  },
  testimonials: {
    kicker: "Testimonials",
    title: "What people say",
    placeholderNote:
      "These are placeholder cards, not real quotes — swap them for genuine testimonials in",
    placeholderBadge: "Placeholder",
  },
  contact: {
    kicker: "Contact",
    title: "Let's talk about data",
    subtitle:
      "I'm always open to conversations about revenue analytics, pricing strategy, and building reporting that leadership actually trusts.",
    noSpamNote:
      "No inbox spam, promise — messages go straight to me and my number is shared only when there's a reason to.",
    comingSoonPrefix: "Contact details coming soon — add them in",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  contactForm: {
    sendMessage: "Send a message",
    messageSent: "Message sent — thank you!",
    willReply: "I'll get back to you as soon as I can.",
    close: "Close",
    name: "Name",
    yourEmail: "Your email (so I can reply)",
    reason: "Reason",
    selectReason: "Select a reason",
    subject: "Subject",
    message: "Message",
    errorGeneric: "Something went wrong sending that — please try again in a moment.",
    sending: "Sending…",
    send: "Send",
    cancel: "Cancel",
  },
  phone: {
    requestNumber: "Request phone number",
    whatsThisAbout: "What's this regarding?",
    copyAria: "Copy phone number",
  },
  resume: {
    download: "Download resume",
    dialogAria: "Download resume",
    kicker: "Resume",
    allSet: "You're all set",
    quickIntro: "Quick intro first",
    thanksAutoStart: "Thanks — your download should have started automatically.",
    downloadPdf: "Download PDF",
    tellMeABit: "Tell me a bit about who's asking, and the PDF is yours.",
    email: "Email",
    purpose: "Purpose",
    emailPlaceholder: "you@company.com",
    purposePlaceholder: "e.g. Hiring for a Data Analyst role",
    errorInvalidEmail: "Enter a valid email address.",
    errorPurpose: "Let me know what you're looking for the resume for.",
    unlockDownload: "Unlock download",
    close: "Close",
  },
  blogIndex: {
    kicker: "Blog",
    title: "Notes on analytics",
    subtitle: "Thoughts on data, dashboards, and the craft of turning numbers into decisions.",
    noPostsPrefix: "No posts yet — add a Markdown file to",
    noPostsSuffix: "to publish the first one.",
  },
  blogPost: {
    allPosts: "All posts",
  },
  /** Shared by ContactMessageForm and PhoneReveal — `value` stays the
      canonical English string used in form submissions and GoatCounter
      event names regardless of display language, so analytics/inbox data
      stays consistent no matter which language a visitor used. */
  contactReasons: [
    { value: "Job opportunity", label: "Job opportunity" },
    { value: "Consulting / freelance work", label: "Consulting / freelance work" },
    { value: "Speaking or networking", label: "Speaking or networking" },
    { value: "Something else", label: "Something else" },
  ],
};

const fr: typeof en = {
  nav: {
    about: "À propos",
    skills: "Ce que je fais",
    experience: "Expérience",
    projects: "Projets",
    education: "Formation",
    contact: "Contact",
    blog: "Blogue",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  footer: {
    builtWith: "Créé avec React, TypeScript et Tailwind",
    emailAria: "Courriel — envoyer un message depuis la section Contact",
    emailTitle: "Envoyer un message depuis la section Contact",
    phoneAria: "Téléphone — en faire la demande dans la section Contact",
    phoneTitle: "Demander le numéro de téléphone dans la section Contact",
    backToTop: "Retour en haut",
  },
  scrollTop: {
    aria: "Faire défiler vers le haut",
  },
  theme: {
    toLight: "Passer au mode clair",
    toDark: "Passer au mode sombre",
  },
  hero: {
    viewProjects: "Voir les projets",
    getInTouch: "Me contacter",
  },
  atAGlance: {
    kicker: "En un coup d'œil",
    title: "Aperçu rapide",
    subtitle: "Expérience, étendue des compétences et outils que j'utilise le plus.",
    yearsExperience: "Années d'expérience",
    companiesTeams: "Entreprises et équipes",
    toolsTechniques: "Outils et techniques",
  },
  about: {
    kicker: "À propos",
    title: "Où l'analytique rencontre la stratégie",
  },
  skills: {
    kicker: "Ce que je fais",
    title: "Là où j'apporte le plus de valeur",
  },
  process: {
    kicker: "Ma méthode",
    title: "Mon processus d'analyse",
  },
  experience: {
    kicker: "Expérience",
    title: "Là où j'ai eu un impact",
    detailsToFollow: "Détails à venir une fois ce poste débuté.",
  },
  projects: {
    kicker: "Projets",
    title: "Travaux sélectionnés",
    live: "En ligne",
    code: "Code",
  },
  blogTeaser: {
    kicker: "Blogue",
    title: "Écrits récents",
    viewAll: "Voir tous les articles",
  },
  blogCard: {
    read: "Lire",
  },
  education: {
    kicker: "Formation",
    title: "Parcours académique",
  },
  testimonials: {
    kicker: "Témoignages",
    title: "Ce que les gens disent",
    placeholderNote:
      "Ces cartes sont des espaces réservés, pas de vraies citations — remplacez-les par de véritables témoignages dans",
    placeholderBadge: "Espace réservé",
  },
  contact: {
    kicker: "Contact",
    title: "Parlons de données",
    subtitle:
      "Je suis toujours ouvert aux échanges sur l'analyse des revenus, la stratégie de tarification et la création de rapports auxquels la direction fait vraiment confiance.",
    noSpamNote:
      "Aucun pourriel, promis — les messages me sont transmis directement, et mon numéro n'est partagé que lorsqu'il y a une bonne raison.",
    comingSoonPrefix: "Coordonnées à venir — ajoutez-les dans",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  contactForm: {
    sendMessage: "Envoyer un message",
    messageSent: "Message envoyé — merci !",
    willReply: "Je vous répondrai dès que possible.",
    close: "Fermer",
    name: "Nom",
    yourEmail: "Votre courriel (pour que je puisse répondre)",
    reason: "Motif",
    selectReason: "Choisir un motif",
    subject: "Objet",
    message: "Message",
    errorGeneric: "Une erreur est survenue lors de l'envoi — veuillez réessayer dans un instant.",
    sending: "Envoi en cours…",
    send: "Envoyer",
    cancel: "Annuler",
  },
  phone: {
    requestNumber: "Demander le numéro de téléphone",
    whatsThisAbout: "De quoi s'agit-il ?",
    copyAria: "Copier le numéro de téléphone",
  },
  resume: {
    download: "Télécharger le CV",
    dialogAria: "Télécharger le CV",
    kicker: "CV",
    allSet: "C'est fait",
    quickIntro: "Une brève présentation d'abord",
    thanksAutoStart: "Merci — votre téléchargement devrait avoir démarré automatiquement.",
    downloadPdf: "Télécharger le PDF",
    tellMeABit: "Dites-m'en un peu plus sur qui le demande, et le PDF est à vous.",
    email: "Courriel",
    purpose: "Motif",
    emailPlaceholder: "vous@entreprise.com",
    purposePlaceholder: "p. ex. Recrutement pour un poste d'analyste de données",
    errorInvalidEmail: "Entrez une adresse courriel valide.",
    errorPurpose: "Précisez la raison pour laquelle vous souhaitez consulter le CV.",
    unlockDownload: "Débloquer le téléchargement",
    close: "Fermer",
  },
  blogIndex: {
    kicker: "Blogue",
    title: "Notes sur l'analytique",
    subtitle: "Réflexions sur les données, les tableaux de bord et l'art de transformer les chiffres en décisions.",
    noPostsPrefix: "Aucun article pour le moment — ajoutez un fichier Markdown dans",
    noPostsSuffix: "pour publier le premier.",
  },
  blogPost: {
    allPosts: "Tous les articles",
  },
  contactReasons: [
    { value: "Job opportunity", label: "Offre d'emploi" },
    { value: "Consulting / freelance work", label: "Consultation / travail autonome" },
    { value: "Speaking or networking", label: "Conférence ou réseautage" },
    { value: "Something else", label: "Autre raison" },
  ],
};

const strings = { en, fr };

/** Returns the UI-chrome string dictionary for the current language — see
    the module doc comment above for how to add new strings. */
export function useStrings() {
  const { language } = useLanguage();
  return strings[language];
}
