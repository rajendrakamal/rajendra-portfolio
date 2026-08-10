import { motion } from "framer-motion";
import { CountUp } from "../CountUp";
import { Reveal } from "../Reveal";
import { experience, skillGroups } from "../../data/content";

const totalSkills = skillGroups.reduce((sum, group) => sum + group.skills.length, 0);

const stats = [
  { label: "Years of experience", value: 7, suffix: "+" },
  { label: "Companies & teams", value: experience.length, suffix: "" },
  { label: "Tools & techniques", value: totalSkills, suffix: "+" },
];

export function AtAGlance() {
  return (
    <section className="section-py border-t border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/30">
      <div className="container-page grid gap-10 lg:grid-cols-[0.6fr_1fr] lg:items-center">
        <Reveal>
          <p className="section-heading">At a glance</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">A quick snapshot</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-300">
            Experience, breadth, and the tools I reach for most.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-bold text-ink-900 sm:text-4xl dark:text-ink-50">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-1 text-sm text-ink-500 dark:text-ink-400">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-x-8 gap-y-3 border-t border-ink-200/70 pt-6 sm:grid-cols-2 dark:border-ink-800/70">
            {skillGroups[0].skills.slice(0, 6).map((skill, i) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate font-mono text-xs text-ink-500 dark:text-ink-400">
                  {skill}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${82 - i * 6}%` }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full bg-ink-900 dark:bg-ink-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
