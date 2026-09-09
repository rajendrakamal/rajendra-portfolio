import { Database, LayoutDashboard, TrendingUp, Users } from "lucide-react";
import { Reveal } from "../Reveal";
import { ServiceCard } from "../ServiceCard";
import { localize, useLanguage } from "../../i18n/language";
import { useStrings } from "../../i18n/strings";
import { skillGroups } from "../../data/content";

/** One icon per skill category, in the same order as content.ts's skillGroups. */
const ICONS = [LayoutDashboard, TrendingUp, Database, Users];

export function Skills() {
  const { language } = useLanguage();
  const s = useStrings();

  return (
    <section
      id="skills"
      className="section-py border-t border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/30"
    >
      <div className="container-page">
        <Reveal>
          <p className="section-heading">{s.skills.kicker}</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">{s.skills.title}</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <ServiceCard
              key={group.category.en}
              icon={ICONS[i]}
              title={localize(group.category, language)}
              description={localize(group.description, language)}
              skills={group.skills}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
