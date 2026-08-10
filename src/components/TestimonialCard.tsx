import { Quote, User } from "lucide-react";
import { Reveal } from "./Reveal";
import type { Testimonial } from "../data/content";

type TestimonialCardProps = Testimonial & {
  isPlaceholder: boolean;
  delay?: number;
};

/** One testimonial card — clearly badged when it's still placeholder content. */
export function TestimonialCard({ quote, name, title, isPlaceholder, delay = 0 }: TestimonialCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="glass-card relative flex h-full flex-col p-6">
        {isPlaceholder && (
          <span className="absolute top-4 right-4 rounded-full border border-dashed border-ink-300 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-ink-500 dark:border-ink-600 dark:text-ink-400">
            Placeholder
          </span>
        )}

        <Quote className="size-6 text-accent-300 dark:text-accent-700" />

        <p
          className={`mt-3 flex-1 text-sm leading-relaxed ${
            isPlaceholder
              ? "text-ink-400 italic dark:text-ink-500"
              : "text-ink-600 dark:text-ink-300"
          }`}
        >
          {quote}
        </p>

        <div className="mt-5 flex items-center gap-3 border-t border-ink-200/70 pt-4 dark:border-ink-800/70">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
            <User className="size-5" />
          </span>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold ${
                isPlaceholder ? "text-ink-400 dark:text-ink-500" : "text-ink-900 dark:text-ink-50"
              }`}
            >
              {name}
            </p>
            <p className="text-xs leading-snug text-ink-500 dark:text-ink-400">{title}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
