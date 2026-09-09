import { Reveal } from "../Reveal";
import { localize, useLanguage } from "../../i18n/language";
import { useStrings } from "../../i18n/strings";
import { profile } from "../../data/content";

export function About() {
  const { language } = useLanguage();
  const s = useStrings();

  return (
    <section id="about" className="section-py">
      <div className="container-page grid gap-10 lg:grid-cols-[0.6fr_1fr]">
        <Reveal>
          <p className="section-heading">{s.about.kicker}</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">{s.about.title}</h2>
        </Reveal>

        <div className="space-y-5">
          {profile.summary.map((paragraph, i) => (
            <Reveal key={paragraph.en} delay={i * 0.08}>
              <p className="text-base leading-relaxed text-ink-600 sm:text-lg dark:text-ink-300">
                {localize(paragraph, language)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
