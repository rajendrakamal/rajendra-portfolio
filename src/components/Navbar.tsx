import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "../data/navigation";
import { profile } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = navLinks.map((link) => link.id);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);

  const handleNavigate = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md dark:border-ink-800/70 dark:bg-ink-950/80">
      <nav className="container-page flex h-16 items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display flex items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex size-2.5 shrink-0 rounded-full bg-ink-900 dark:bg-ink-100" />
          {profile.name}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id} className="relative">
              {activeId === link.id && (
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
                  activeId === link.id
                    ? "text-ink-50 dark:text-ink-900"
                    : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
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
                    activeId === link.id
                      ? "font-semibold text-ink-900 dark:text-ink-50"
                      : "text-ink-700 dark:text-ink-200"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
