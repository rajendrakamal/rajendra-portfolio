import { ExternalLink } from "lucide-react";
import { GithubIcon } from "../icons/BrandIcons";
import { Reveal } from "../Reveal";
import { trackEvent } from "../../lib/analytics";
import { projects } from "../../data/content";

export function Projects() {
  return (
    <section
      id="projects"
      className="section-py border-t border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/30"
    >
      <div className="container-page">
        <Reveal>
          <p className="section-heading">Projects</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">Selected work</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.08} className="h-full">
              <article className="glass-card flex h-full flex-col p-6 transition-transform hover:-translate-y-1">
                <h3 className="h3 text-ink-900 dark:text-ink-50">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {project.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {project.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-900 dark:bg-ink-100" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-ink-200/70 px-2.5 py-1 font-mono text-[11px] font-medium text-ink-600 dark:border-ink-700/70 dark:text-ink-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {(project.link || project.repo) && (
                  <div className="mt-5 flex items-center gap-4 border-t border-ink-100 pt-4 dark:border-ink-800">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => trackEvent(`project-link:${project.title}:live`)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 hover:underline dark:text-ink-50"
                      >
                        <ExternalLink className="size-3.5" />
                        Live
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => trackEvent(`project-link:${project.title}:code`)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 hover:underline dark:text-ink-50"
                      >
                        <GithubIcon className="size-3.5" />
                        Code
                      </a>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
