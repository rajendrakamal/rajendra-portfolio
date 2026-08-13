import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import type { Post } from "../lib/posts";

type BlogPostCardProps = {
  post: Post;
  delay?: number;
};

function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** One blog post preview card — used on both the blog index and the home page teaser. */
export function BlogPostCard({ post, delay = 0 }: BlogPostCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="glass-card group flex h-full flex-col p-6 transition-transform hover:-translate-y-1"
      >
        {post.date && (
          <p className="font-mono text-xs text-ink-500 dark:text-ink-400">{formatDate(post.date)}</p>
        )}
        <h3 className="h3 mt-2 text-ink-900 dark:text-ink-50">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
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
  );
}
