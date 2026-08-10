import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../data/navigation";
import { profile } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = navLinks.map((link) => link.id);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sectionActiveId = useActiveSection(sectionIds);
  const isBlogRoute = location.pathname.startsWith("/blog");
  // On the home page, the active nav item tracks scroll position; on any
  // /blog route, it's just "blog" — sectionActiveId will be empty there
  // anyway since none of the home page's section elements exist in the DOM.
  const activeKey = isBlogRoute ? "blog" : sectionActiveId;

  const handleNavigate = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      // The target section only exists on the home page — navigate there
      // and let HomePage's own effect (watching router state) scroll to it
      // once mounted, since it isn't in the DOM yet during this click.
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md dark:border-ink-800/70 dark:bg-ink-950/80">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          to="/"
          onClick={(event) => {
            setIsOpen(false);
            if (location.pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="font-display flex items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex size-2.5 shrink-0 rounded-full bg-ink-900 dark:bg-ink-100" />
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id} className="relative">
              {activeKey === link.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-ink-900 dark:bg-ink-100"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <button
                type="button"
                onClick={() => handleNavigate(link.id)}
                className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeKey === link.id
                    ? "text-ink-50 dark:text-ink-900"
                    : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
          <li className="relative">
            {activeKey === "blog" && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 rounded-full bg-ink-900 dark:bg-ink-100"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <Link
              to="/blog"
              className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeKey === "blog"
                  ? "text-ink-50 dark:text-ink-900"
                  : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50"
              }`}
            >
              Blog
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="icon-btn md:hidden"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-ink-200/70 bg-ink-50 md:hidden dark:border-ink-800/70 dark:bg-ink-950"
          >
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(link.id)}
                  className={`block w-full px-5 py-3 text-left text-sm font-medium ${
                    activeKey === link.id
                      ? "font-semibold text-ink-900 dark:text-ink-50"
                      : "text-ink-700 dark:text-ink-200"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <Link
                to="/blog"
                onClick={() => setIsOpen(false)}
                className={`block w-full px-5 py-3 text-left text-sm font-medium ${
                  activeKey === "blog"
                    ? "font-semibold text-ink-900 dark:text-ink-50"
                    : "text-ink-700 dark:text-ink-200"
                }`}
              >
                Blog
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
