import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useStrings } from "../i18n/strings";

const SHOW_AFTER_PX = 480;

/**
 * Floating "scroll to top" button, available at any scroll position past
 * the hero — not just once you've reached the footer, where a second
 * "back to top" icon already lives (kept as-is; harmless overlap for
 * visitors who scroll all the way down).
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const s = useStrings();

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={s.scrollTop.aria}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed right-5 bottom-5 z-40 inline-flex size-11 items-center justify-center rounded-full border border-ink-200/70 bg-ink-50/90 text-ink-600 shadow-lg backdrop-blur-sm transition-colors hover:border-ink-500 hover:text-ink-900 sm:right-8 sm:bottom-8 dark:border-ink-700/70 dark:bg-ink-900/90 dark:text-ink-300 dark:hover:border-ink-400 dark:hover:text-ink-50"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
