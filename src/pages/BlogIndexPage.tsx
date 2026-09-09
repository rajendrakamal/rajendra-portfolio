import { useEffect } from "react";
import { Reveal } from "../components/Reveal";
import { BlogPostCard } from "../components/BlogPostCard";
import { trackPageview } from "../lib/analytics";
import { getPosts } from "../lib/posts";
import { useLanguage } from "../i18n/language";
import { useStrings } from "../i18n/strings";
import { profile } from "../data/content";

export function BlogIndexPage() {
  const { language } = useLanguage();
  const s = useStrings();
  const posts = getPosts(language);

  useEffect(() => {
    document.title = `${s.blogIndex.kicker} — ${profile.name}`;
    // See HomePage.tsx's matching effect for why this is tracked here
    // rather than from a shared route-level component.
    trackPageview("/blog", document.title);
  }, [s.blogIndex.kicker]);

  return (
    <section className="section-py">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-heading justify-center">{s.blogIndex.kicker}</p>
          <h1 className="h1 mt-3 text-ink-900 dark:text-ink-50">{s.blogIndex.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-300">
            {s.blogIndex.subtitle}
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 text-center font-mono text-sm text-ink-500 dark:text-ink-400">
            {s.blogIndex.noPostsPrefix} <code>src/content/posts/</code>{" "}
            {s.blogIndex.noPostsSuffix}
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
