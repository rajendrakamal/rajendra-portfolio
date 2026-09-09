import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Language = "en" | "fr";

/** A piece of content with both language versions — see content.ts for how
    this is used across profile text, experience bullets, project copy, etc.
    Short technical skill/tag chips (SQL, Tableau, "Cohort Analysis", ...)
    are deliberately NOT wrapped in this — those stay English-only in both
    languages, matching how they're actually used on French-language tech
    resumes/job postings. */
export type Localized = { en: string; fr: string };

/** Reads whichever language string is active right now. */
export function localize(field: Localized, language: Language): string {
  return field[language];
}

const STORAGE_KEY = "portfolio-lang";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "en") return stored;
  // Fall back to the browser's language only when the visitor has never
  // chosen explicitly — same "respect the OS/browser, but let an explicit
  // choice win" pattern as useTheme.ts uses for light/dark.
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fr")
    ? "fr"
    : "en";
}

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Wraps the whole app (see main.tsx) so any component can read/switch the
    current language via useLanguage() below. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "en" ? "fr" : "en"));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
