import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../Reveal";
import { BlogPostCard } from "../BlogPostCard";
import type { Post } from "../../lib/posts";

const FEATURED_COUNT = 3;

/**
 * Surfaces the latest posts directly on the home page — without this,
 * visitors only find the blog by noticing the nav link and clicking it with
 * intent. Renders nothing if there are no posts yet, so an empty blog
 * doesn't leave a half-built section on the home page.
 *
 * lib/posts.ts eagerly loads the full Markdown text of every post (needed
 * for the individual post pages), so it's imported dynamically here rather
 * than at the top of the file — that keeps it in its own chunk instead of
 * bundling every post's full content into the home page's main JS, which
 * only actually needs the three titles/excerpts shown below.
 */
export function BlogTeaser() {
  const [featured, setFeatured] = useState<Post[] | null>(null);

  useEffect(() => {
    import("../../lib/posts").then(({ posts }) => {
      setFeatured(posts.slice(0, FEATURED_COUNT));
    });
  }, []);

  if (!featured || featured.length === 0) return null;

  return (
    <section className="section-py border-t border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/30">
      <div className="container-page">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-heading">Blog</p>
            <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">Recent writing</h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 hover:underline dark:text-ink-50"
          >
            View all posts
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, i) => (
            <BlogPostCard key={post.slug} post={post} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
