/**
 * Nav link ids map 1:1 to the labels in src/i18n/strings.ts (nav.about,
 * nav.skills, ...) — Navbar.tsx looks up each link's label by its id, so
 * the actual display text lives with the rest of the UI strings rather
 * than here.
 */
export type NavLink = {
  id: string;
};

export const navLinks: NavLink[] = [
  { id: "about" },
  { id: "skills" },
  { id: "experience" },
  { id: "projects" },
  { id: "education" },
  { id: "contact" },
];
