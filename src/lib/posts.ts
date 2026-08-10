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
 */

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

const postModules = import.meta.glob("/src/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const posts: Post[] = Object.entries(postModules)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      tags: data.tags ?? [],
      content,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
