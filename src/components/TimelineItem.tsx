import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "./Reveal";
import type { ExperienceEntry } from "../data/content";

type TimelineItemProps = {
  job: ExperienceEntry;
  delay?: number;
  /** Whether this entry starts expanded — Experience.tsx passes this as
      `true` only for the most recent role (index 0), since the list is
      only going to keep growing and showing every bullet for every past
      role by default gets long fast. */
  defaultOpen?: boolean;
};

/** One role in the Experience timeline — dot marker, collapsible role/dates/highlights. */
export function TimelineItem({ job, delay = 0, defaultOpen = false }: TimelineItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasHighlights = job.highlights.length > 0;

  return (
    <Reveal delay={delay}>
      <li className="relative">
        <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-ink-900 shadow-[0_0_0_4px] shadow-ink-50 sm:-left-[43px] dark:bg-ink-100 dark:shadow-ink-950" />

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex w-full flex-col gap-1 text-left transition-opacity hover:opacity-70 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <h3 className="h3 text-ink-900 dark:text-ink-50">
            {job.role}
            <span className="font-sans text-base font-normal text-ink-500 dark:text-ink-400">
              {" "}
              · {job.company}
            </span>
          </h3>
          <span className="flex items-center gap-2 font-mono text-xs whitespace-nowrap text-ink-500 dark:text-ink-400">
            {job.start} — {job.end}
            <ChevronDown
              className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {job.location && (
          <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{job.location}</p>
        )}

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {hasHighlights ? (
                <ul className="mt-4 space-y-2 pb-1">
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
              ) : (
                <p className="mt-4 pb-1 text-sm text-ink-500 italic dark:text-ink-400">
                  Details to follow once this role is underway.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </Reveal>
  );
}
