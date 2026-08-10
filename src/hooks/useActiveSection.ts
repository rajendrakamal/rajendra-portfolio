import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids the user is currently reading, so
 * the nav can highlight it. Whichever tracked section's top edge has most
 * recently scrolled past a line 35% down the viewport "owns" that spot —
 * the same technique behind most scrollspy implementations. Driven by a
 * plain scroll listener (rather than IntersectionObserver) so it doesn't
 * depend on section height relative to the observer's root margin.
 */
export function useActiveSection(sectionIds: string[]) {
  // Empty until the user scrolls past the top of the first tracked section —
  // no nav item is highlighted while they're still up in the hero.
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    let ticking = false;

    function updateActive() {
      ticking = false;
      const probeLine = window.innerHeight * 0.35;

      let current = "";
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= probeLine) {
          current = el.id;
        }
      }
      setActiveId(current);
    }

    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sectionIds]);

  return activeId;
}
