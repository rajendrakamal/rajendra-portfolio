import { Reveal } from "./Reveal";
import type { ExperienceEntry } from "../data/content";

type TimelineItemProps = {
  job: ExperienceEntry;
  delay?: number;
};

/** One role in the Experience timeline — dot marker, role/dates, highlight list. */
export function TimelineItem({ job, delay = 0 }: TimelineItemProps) {
  return (
    <Reveal delay={delay}>
      <li className="relative">
        <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-ink-900 shadow-[0_0_0_4px] shadow-ink-50 sm:-left-[43px] dark:bg-ink-100 dark:shadow-ink-950" />

        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="h3 text-ink-900 dark:text-ink-50">
            {job.role}
            <span className="font-sans text-base font-normal text-ink-500 dark:text-ink-400">
              {" "}
              · {job.company}
            </span>
          </h3>
          <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
            {job.start} — {job.end}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{job.location}</p>

        <ul className="mt-4 space-y-2">
          {job.highlights.map((point) => (
            <li
              key={point}
              className="flex gap-2 text-sm leading-relaxed text-ink-600 sm:text-base dark:text-ink-300"
            >
              <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-900 dark:bg-ink-100" />
              {point}
            </li>
          ))}
        </ul>
      </li>
    </Reveal>
  );
}
