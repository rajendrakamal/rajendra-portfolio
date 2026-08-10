import { Reveal } from "../Reveal";
import { TimelineItem } from "../TimelineItem";
import { experience } from "../../data/content";

export function Experience() {
  return (
    <section id="experience" className="section-py">
      <div className="container-page">
        <Reveal>
          <p className="section-heading">Experience</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">Where I've made an impact</h2>
        </Reveal>

        <div className="relative mt-12 pl-6 sm:pl-10">
          <div className="absolute top-1 bottom-1 left-0 w-px bg-ink-200 dark:bg-ink-800" />

          <ol className="space-y-10">
            {experience.map((job, i) => (
              <TimelineItem key={`${job.company}-${job.start}`} job={job} delay={i * 0.06} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
