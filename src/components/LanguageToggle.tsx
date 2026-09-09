import { useLanguage } from "../i18n/language";

/** EN/FR switch — same icon-btn treatment as ThemeToggle, shown as a text
    code instead of an icon since there's no universal "language" glyph
    that reads clearly at this size. */
export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const isFrench = language === "fr";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isFrench ? "Switch to English" : "Passer au français"}
      className="icon-btn font-mono text-[11px] font-semibold tracking-wide"
    >
      {isFrench ? "EN" : "FR"}
    </button>
  );
}
