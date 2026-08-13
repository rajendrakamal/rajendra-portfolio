import { useEffect } from "react";
import { Reveal } from "../components/Reveal";
import { BlogPostCard } from "../components/BlogPostCard";
import { posts } from "../lib/posts";
import { profile } from "../data/content";

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
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogPostCard key={post.slug} post={post} delay={i * 0.06} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
