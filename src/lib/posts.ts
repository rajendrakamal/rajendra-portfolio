/**
 * Loads every post from src/content/posts/*.md at build time (via Vite's
 * import.meta.glob) and parses its frontmatter — no build step or CMS
 * needed. To publish a new post: add a new .md file to that folder with the
 * frontmatter shape below, then commit + push. It shows up automatically,
 * newest first.
 *
 * Frontmatter fields:
 *   title:   post title (string, required)
 *   date:    "YYYY-MM-DD" (string, required — controls sort order)
 *   excerpt: one or two sentences shown on the blog index card (required)
 *   tags:    [comma, separated, list] (optional)
 *
 * Example file (src/content/posts/2026-08-15-example.md):
 *
 *   ---
 *   title: What Cohort Analysis Actually Tells You
 *   date: 2026-08-15
 *   excerpt: A short summary shown on the blog index page.
 *   tags: [Cohort Analysis, SQL, Retention]
 *   ---
 *
 *   Your post body in Markdown — **bold**, *italic*, [links](https://x.com),
 *   and ![images](./some-image.png) all work.
 *
 * BILINGUAL POSTS: to add a French translation of a post, create a second
 * file with the same name plus a `.fr.md` suffix right before `.md` — e.g.
 * `2026-08-15-example.md` + `2026-08-15-example.fr.md`. They're matched up
 * by that shared filename (their "slug"), so the French file needs its own
 * complete frontmatter block too. A post with no `.fr.md` file yet just
 * falls back to showing its English version while the site is in French
 * mode — nothing breaks, it just won't be translated until you add one.
 */

import type { Language } from "../i18n/language";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
};

type Frontmatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
};

/**
 * Minimal hand-rolled frontmatter parser (deliberately not a full YAML
 * parser — the schema above is simple enough not to need one, and this
 * avoids pulling in a Node-oriented library like gray-matter that isn't
 * built for the browser bundle this ends up in).
 */
function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, frontmatterBlock, content] = match;
  const data: Record<string, string | string[]> = {};

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      data[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }

  return { data, content: content.trim() };
}

function parsePost(path: string, raw: string): Post {
  const filename = path.split("/").pop()!;
  const slug = filename.replace(/\.fr\.md$/, "").replace(/\.md$/, "");
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    content,
  };
}

// The "!" pattern excludes *.fr.md from the English glob — without it,
// "*.md" would match French files too (they end in .md).
const enModules = import.meta.glob(
  ["/src/content/posts/*.md", "!/src/content/posts/*.fr.md"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const frModules = import.meta.glob("/src/content/posts/*.fr.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const enBySlug = new Map<string, Post>();
for (const [path, raw] of Object.entries(enModules)) {
  const post = parsePost(path, raw);
  enBySlug.set(post.slug, post);
}

const frBySlug = new Map<string, Post>();
for (const [path, raw] of Object.entries(frModules)) {
  const post = parsePost(path, raw);
  frBySlug.set(post.slug, post);
}

const allSlugs = new Set([...enBySlug.keys(), ...frBySlug.keys()]);

/** Every slug resolved to both languages, French falling back to English
    when no translation exists yet for that post. */
const bundles = new Map<string, { en: Post; fr: Post }>();
for (const slug of allSlugs) {
  const en = enBySlug.get(slug);
  const fr = frBySlug.get(slug);
  if (!en && !fr) continue;
  // In the unlikely case a post exists only as a .fr.md file with no
  // English original, fall back the other direction so neither language
  // ever renders a missing post.
  bundles.set(slug, { en: en ?? fr!, fr: fr ?? en! });
}

/** All posts in the given language, newest first. */
export function getPosts(language: Language): Post[] {
  return Array.from(bundles.values())
    .map((bundle) => bundle[language])
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string, language: Language): Post | undefined {
  return bundles.get(slug)?.[language];
}
