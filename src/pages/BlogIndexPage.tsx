import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { posts } from "../lib/posts";
import { profile } from "../data/content";

function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogIndexPage() {
  useEffect(() => {
    document.title = `Blog — ${profile.name}`;
  }, []);

  return (
    <section className="section-py">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-heading justify-center">Blog</p>
          <h1 className="h1 mt-3 text-ink-900 dark:text-ink-50">Notes on analytics</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-300">
            Thoughts on data, dashboards, and the craft of turning numbers into decisions.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 text-center font-mono text-sm text-ink-500 dark:text-ink-400">
            No posts yet — add a Markdown file to{" "}
            <code>src/content/posts/</code> to publish the first one.
          </p>
        ) : (
          <div className="mx-auto mt-16 max-w-3xl space-y-6">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="glass-card group block p-6 transition-transform hover:-translate-y-1"
                >
                  {post.date && (
                    <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
                      {formatDate(post.date)}
                    </p>
                  )}
                  <h2 className="h3 mt-2 text-ink-900 dark:text-ink-50">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-ink-200/70 px-2.5 py-1 font-mono text-[11px] font-medium text-ink-600 dark:border-ink-700/70 dark:text-ink-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 group-hover:underline dark:text-ink-50">
                      Read
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
