import { Reveal } from "../Reveal";
import { ProcessStep } from "../ProcessStep";
import { analyticsProcess } from "../../data/content";

export function AnalyticsProcess() {
  return (
    <section className="section-py">
      <div className="container-page">
        <Reveal>
          <p className="section-heading">How I Work</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">My analytics process</h2>
        </Reveal>

        <div className="relative mt-12">
          <div className="absolute top-5 right-0 left-0 hidden h-px bg-ink-200/70 sm:block dark:bg-ink-800/70" />
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {analyticsProcess.map((step, i) => (
              <ProcessStep
                key={step.title}
                number={i + 1}
                title={step.title}
                description={step.description}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
