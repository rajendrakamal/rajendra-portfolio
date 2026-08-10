import { Database, LayoutDashboard, TrendingUp } from "lucide-react";
import { Reveal } from "../Reveal";
import { ServiceCard } from "../ServiceCard";
import { skillGroups } from "../../data/content";

/** One icon per skill category, in the same order as content.ts's skillGroups. */
const ICONS = [LayoutDashboard, TrendingUp, Database];

export function Skills() {
  return (
    <section
      id="skills"
      className="section-py border-t border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/30"
    >
      <div className="container-page">
        <Reveal>
          <p className="section-heading">What I Do</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">Where I add the most value</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <ServiceCard
              key={group.category}
              icon={ICONS[i]}
              title={group.category}
              description={group.description}
              skills={group.skills}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
