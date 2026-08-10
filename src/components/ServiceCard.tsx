import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  skills: string[];
  delay?: number;
};

/** One "what I do" specialty — icon, framing sentence, and the grounding skill tags. */
export function ServiceCard({ icon: Icon, title, description, skills, delay = 0 }: ServiceCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="glass-card h-full p-6 transition-transform hover:-translate-y-1">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-ink-900 text-ink-50 dark:bg-ink-100 dark:text-ink-900">
          <Icon className="size-5" />
        </span>
        <h3 className="h3 mt-4 text-ink-900 dark:text-ink-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-ink-200/70 bg-ink-50/80 px-3 py-1 text-xs font-medium text-ink-600 dark:border-ink-700/70 dark:bg-ink-800/60 dark:text-ink-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
