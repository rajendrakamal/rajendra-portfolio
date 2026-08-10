import { Reveal } from "./Reveal";

type ProcessStepProps = {
  number: number;
  title: string;
  description: string;
  delay?: number;
};

/** One numbered step in the "My Analytics Process" strip. */
export function ProcessStep({ number, title, description, delay = 0 }: ProcessStepProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col">
        <span className="font-display text-3xl font-bold text-accent-300 dark:text-accent-700">
          {String(number).padStart(2, "0")}
        </span>
        <h3 className="mt-2 font-display text-base font-semibold text-ink-900 dark:text-ink-50">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{description}</p>
      </div>
    </Reveal>
  );
}
