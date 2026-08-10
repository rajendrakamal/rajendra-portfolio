# Portfolio Site

**Live:** https://rajendrakamal.github.io/rajendra-portfolio/

A personal portfolio site — an alternative to a static resume — built with
React, TypeScript, Tailwind CSS, and Framer Motion.

Live sections: Hero, At a Glance, About, What I Do, My Analytics Process,
Experience (timeline), Projects, Education, Testimonials, Contact.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run oxlint
```

## How the site is organized

```
src/
  data/
    content.ts       ← ALL page content lives here (see below)
    navigation.ts     ← nav bar links
  components/
    Navbar.tsx, Footer.tsx, ThemeToggle.tsx, Reveal.tsx
    TimelineItem.tsx    ← one Experience-timeline entry (used by Experience.tsx)
    ServiceCard.tsx     ← one "What I Do" card (used by Skills.tsx)
    ProcessStep.tsx     ← one "My Analytics Process" step
    TestimonialCard.tsx ← one testimonial card
    sections/
      Hero.tsx, AtAGlance.tsx, About.tsx, Skills.tsx,
      AnalyticsProcess.tsx, Experience.tsx, Projects.tsx,
      Education.tsx, Testimonials.tsx, Contact.tsx
  hooks/
    useTheme.ts          ← dark/light mode, persisted to localStorage
    useActiveSection.ts  ← highlights the nav link for the section in view
  index.css           ← design tokens (colors, fonts, type scale) + global styles
```

Repeated card/list markup is componentized (`TimelineItem`, `ServiceCard`,
`ProcessStep`, `TestimonialCard`) rather than duplicated inline — each section
component just loops over data from `content.ts` and renders one of these.

## Updating content

You should almost never need to touch a component to update the site.
Everything text-based lives in **`src/data/content.ts`**:

- `profile` — name, role, tagline, location, availability, summary paragraphs,
  and social links (email / LinkedIn / GitHub / resume URL). Leave any
  `socialLinks` value as `""` to hide that link automatically.
- `skillGroups` — the "What I Do" cards: each has a `category`, a one-line
  `description`, and the specific `skills` tags shown as proof underneath.
- `experience` — work history entries (rendered as the Experience timeline),
  each with a list of bullet highlights. **To add a new role**, add a new
  object to this array — `TimelineItem` picks it up automatically, no other
  file needs to change.
- `analyticsProcess` — the 4 steps in "My Analytics Process". Reorder, edit,
  or add/remove a step here; numbering and layout update automatically.
- `projects` — project cards, each with optional `link`/`repo` URLs (hidden
  automatically when left empty).
- `education` — degrees/credentials.
- `testimonials` — **placeholder content by default** (see the comment above
  the export in `content.ts`). To add a real one, edit an entry's `quote`,
  `name`, and `title`, and set `isPlaceholder: false` — the card automatically
  stops showing the "Placeholder" badge and switches out of the muted/italic
  styling once you do. To add a 4th+ testimonial, add another object to the
  array (same shape) — `TestimonialCard` picks it up automatically.

Nav bar links live separately in `src/data/navigation.ts` — only edit this if
you add or remove a whole *section*, not for everyday text changes.

**Contact details status:** name and email are set; `phone` is still empty
(the phone-reveal button in Contact just won't render until you add one), and
`contactForm.web3formsAccessKey` is a temporary preview key — swap it for a
real key from web3forms.com before publishing so the contact/resume-request
forms actually deliver messages (see the comment above that export).

## Re-theming

Colors, fonts, spacing, and the type scale are defined once as CSS variables
in `src/index.css` — components reference these tokens through Tailwind
classes (e.g. `bg-accent-600`, `text-ink-900`) and never hardcode a hex value,
so re-theming means editing `index.css` only, not hunting through components.

**Color system** (`@theme` block, top of `index.css`) — deliberately
monochrome, matching the current design direction (confident black/cream, no
brand hue):

- `--color-ink-*` — the *only* color scale on the site: warm cream at the
  light end (`ink-50`–`ink-200`, the light-mode background/surface color) and
  near-black warm charcoal at the dark end (`ink-800`–`ink-950`, the dark-mode
  background). `bg-ink-50` in light mode and `text-ink-50` in dark mode use
  the same token — see the comment block above `@theme` in `index.css` for
  the full explanation of why one ramp serves both themes. Buttons/badges that
  need to flip between "dark chip on light page" and "light chip on dark
  page" (e.g. `.btn-primary`) use `ink-900 ... dark:ink-50` pairs directly —
  that inversion, not a fixed hue, is what reads as the site's "accent."
- `--color-accent-*` — kept as a token for architectural flexibility, but its
  values are set identical to the matching `ink-*` step, so any existing
  `bg-accent-*`/`text-accent-*` class already renders as neutral grey. **To
  reintroduce a color accent, give this scale its own values again** — every
  component using it will pick up the change automatically.
- All text/background pairings have been checked for WCAG AA contrast
  (4.5:1+) in both themes.

**Type scale**: `--text-h1` / `--text-h2` / `--text-h3` / `--text-lead` (just
above `@layer base` in `index.css`) are `clamp()`-based fluid sizes following
a 1.25 ("major third") ratio, so headings scale continuously with viewport
width instead of jumping at fixed breakpoints. Apply them with the `.h1` /
`.h2` / `.h3` / `.lead` classes rather than ad-hoc `text-*` utilities.

**Spacing**: `--section-py` controls the vertical padding of every section
(applied via the `.section-py` class) — change it in one place to
tighten/loosen the whole page's pacing.

Dark mode is a `dark` class toggled on `<html>` (see `useTheme.ts`); every
component already has `dark:` variants, so new sections should follow the
same pattern.

## Breakpoints

Standard Tailwind breakpoints, used consistently across every section:

| Range | Tailwind prefix | Layout behavior |
|---|---|---|
| 0–639px (mobile) | *(none — mobile-first default)* | Single column, stacked cards, hamburger nav |
| 640–767px (large mobile) | `sm:` | Minor spacing/type increases |
| 768–1023px (tablet) | `md:` | Full nav bar appears (hamburger hides); 2-column grids in a few sections |
| 1024–1279px (laptop) | `lg:` | Hero/About/At-a-Glance switch to their 2-column layouts; 3-column grids |
| 1280px+ (desktop) | *(content is capped at `max-w-6xl` via `.container-page`, so it doesn't keep stretching)* | Same as laptop, just more side margin |

No fixed pixel widths are used for layout — grids/flex containers are fluid,
and heading type sizes use `clamp()` (see Re-theming above) rather than fixed
px values, so nothing should visually break between these ranges.

## Deploying

### GitHub Pages (configured out of the box)

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys the
   site automatically. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.
4. Open `vite.config.ts` and make sure the `base` path matches your repo
   name exactly, e.g. `base: '/<repo-name>/'`. If you deploy to a custom
   domain or a `<username>.github.io` root repo instead, set `base: '/'`.

### Vercel or Netlify (also works, no code changes needed for the app itself)

- Import the repo in the Vercel/Netlify dashboard.
- Build command: `npm run build` — Output directory: `dist`.
- Set `base: '/'` in `vite.config.ts` (both platforms serve from the domain
  root, unlike GitHub Pages project sites).

## SEO / search presence

**Already in place (no action needed):**

- `index.html` has a real `<title>`/description, canonical URL, Open Graph +
  Twitter Card tags (so links shared on LinkedIn/Slack/iMessage show a
  preview card), and a `schema.org` `Person` JSON-LD block (helps Google
  associate the page with you, your role, employer, and LinkedIn). All of
  this is static HTML — it renders before React does, so it's visible to
  crawlers that don't execute JavaScript.
- `public/og-image.jpg` is the preview-card image (currently your headshot —
  swap it for a designed 1200×630 banner any time for a richer card, no code
  change needed, same filename).
- `public/robots.txt` and `public/sitemap.xml` allow crawling and point at
  the one page.
- Keep the JSON-LD block in `index.html` in sync with `profile.name`,
  `profile.role`, `socialLinks.linkedin`, the current employer
  (`experience[0].company`), and school (`education[0].school`) in
  `content.ts` if any of those change.

**Needs your action (things I can't do for you):**

1. **Submit to search engines** — the single highest-leverage step. Add the
   site in [Google Search Console](https://search.google.com/search-console)
   and [Bing Webmaster Tools](https://www.bing.com/webmasters), verify
   ownership (both support a DNS or HTML-file method), and submit
   `sitemap.xml`. Without this, discovery can take weeks; with it, often days.
2. **Get backlinks from sites that already rank** — link to the portfolio
   from your LinkedIn profile (headline, "Featured" section, or contact
   info), your GitHub profile README if you make one public, and your email
   signature. A link from an established, indexed domain (linkedin.com,
   github.com) does more for a brand-new site's ranking than any on-page tweak.
3. **Optional: a custom domain** (e.g. `rajendradharanikota.com`) reads more
   professionally than a `github.io` subpath and is easy to point at GitHub
   Pages via a `CNAME` file, but isn't required for indexing — treat it as a
   nice-to-have once the basics above are done.

## Old resume/assets

The original resume PDF and image assets from the previous version of this
folder were preserved (not deleted) in `legacy/`. They aren't referenced by
the site and can be removed once you've confirmed you don't need them.
