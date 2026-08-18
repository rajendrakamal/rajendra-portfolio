import { useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Reveal } from "../components/Reveal";
import { trackPageview } from "../lib/analytics";
import { getPostBySlug } from "../lib/posts";
import { profile } from "../data/content";

// GFM tables can be wider than the viewport (see any SCD comparison table).
// The typography plugin doesn't wrap <table> in a scroll container on its
// own, and the site clips horizontal overflow at the page level (see
// index.css), so without this a wide table just gets cut off on mobile
// instead of scrolling. Overriding react-markdown's table renderer to add
// the wrapper is the fix, since raw HTML in the markdown source itself
// isn't rendered (no rehype-raw plugin).
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — ${profile.name}`;
    // See HomePage.tsx's matching effect for why this is tracked here
    // rather than from a shared route-level component.
    trackPageview(`/blog/${post.slug}`, document.title);
  }, [post]);

  if (!post) {
    // Unknown/mistyped slug — send back to the index rather than showing a
    // dead end (this is a client-side-only 404, distinct from GitHub Pages'
    // own 404.html which only handles unknown *routes*, not unknown posts).
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="section-py">
      <div className="container-page max-w-3xl">
        <Reveal>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50"
          >
            <ArrowLeft className="size-3.5" />
            All posts
          </Link>

          {post.date && (
            <p className="mt-6 font-mono text-xs text-ink-500 dark:text-ink-400">
              {formatDate(post.date)}
            </p>
          )}
          <h1 className="h1 mt-2 text-ink-900 dark:text-ink-50">{post.title}</h1>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ink-200/70 px-2.5 py-1 font-mono text-[11px] font-medium text-ink-600 dark:border-ink-700/70 dark:text-ink-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal
          delay={0.1}
          className="prose prose-neutral dark:prose-invert mt-10 max-w-none prose-headings:font-display prose-a:text-ink-900 dark:prose-a:text-ink-50 prose-img:rounded-2xl"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ table: Table }}>
            {post.content}
          </ReactMarkdown>
        </Reveal>
      </div>
    </article>
  );
}
