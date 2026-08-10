import { Reveal } from "../Reveal";
import { TestimonialCard } from "../TestimonialCard";
import { testimonials } from "../../data/content";

const hasPlaceholders = testimonials.some((t) => t.isPlaceholder);

export function Testimonials() {
  return (
    <section className="section-py border-t border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/30">
      <div className="container-page">
        <Reveal>
          <p className="section-heading">Testimonials</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">What people say</h2>
          {hasPlaceholders && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-ink-400">
              These are placeholder cards, not real quotes — swap them for genuine testimonials in{" "}
              <code className="font-mono">src/data/content.ts</code> when you have them.
            </p>
          )}
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={`${testimonial.name}-${i}`} {...testimonial} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
