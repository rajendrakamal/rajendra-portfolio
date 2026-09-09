import { Reveal } from "../Reveal";
import { TimelineItem } from "../TimelineItem";
import { useStrings } from "../../i18n/strings";
import { experience } from "../../data/content";

export function Experience() {
  const s = useStrings();

  return (
    <section id="experience" className="section-py">
      <div className="container-page">
        <Reveal>
          <p className="section-heading">{s.experience.kicker}</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">{s.experience.title}</h2>
        </Reveal>

        <div className="relative mt-12 pl-6 sm:pl-10">
          <div className="absolute top-1 bottom-1 left-0 w-px bg-ink-200 dark:bg-ink-800" />

          <ol className="space-y-10">
            {experience.map((job, i) => (
              <TimelineItem
                key={`${job.company.en}-${job.start.en}`}
                job={job}
                delay={i * 0.06}
                defaultOpen={i === 0}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
