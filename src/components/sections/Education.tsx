import { GraduationCap } from "lucide-react";
import { Reveal } from "../Reveal";
import { education } from "../../data/content";

export function Education() {
  return (
    <section id="education" className="section-py">
      <div className="container-page">
        <Reveal>
          <p className="section-heading">Education</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">Academic background</h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {education.map((entry, i) => (
            <Reveal key={entry.school} delay={i * 0.08}>
              <div className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-ink-50 dark:bg-ink-100 dark:text-ink-900">
                  <GraduationCap className="size-5" />
                </span>
                <div>
                  <h3 className="h3 text-ink-900 dark:text-ink-50">
                    {entry.credential} — {entry.field}
                  </h3>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                    {entry.school}
                    {entry.period ? ` · ${entry.period}` : ""}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
