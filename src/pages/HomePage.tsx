import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "../lib/analytics";
import { Hero } from "../components/sections/Hero";
import { AtAGlance } from "../components/sections/AtAGlance";
import { About } from "../components/sections/About";
import { Skills } from "../components/sections/Skills";
import { AnalyticsProcess } from "../components/sections/AnalyticsProcess";
import { Experience } from "../components/sections/Experience";
import { Projects } from "../components/sections/Projects";
import { BlogTeaser } from "../components/sections/BlogTeaser";
import { Education } from "../components/sections/Education";
import { Testimonials } from "../components/sections/Testimonials";
import { Contact } from "../components/sections/Contact";
import { profile } from "../data/content";

type NavigateState = { scrollTo?: string } | null;

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = `${profile.name} — ${profile.role}`;
    // Fired here (not a route-level effect) so document.title is always
    // correct by the time GoatCounter reads it — see BlogIndexPage.tsx and
    // BlogPostPage.tsx, which do the same for their own routes.
    trackPageview("/", document.title);
  }, []);

  // When Navbar sends someone here from a different route (e.g. clicking
  // "About" while on /blog), it passes the target section id via router
  // state instead of a plain scroll — this page didn't exist yet to scroll
  // within until the route change completed. Scroll to it once mounted.
  useEffect(() => {
    const state = location.state as NavigateState;
    if (!state?.scrollTo) return;
    const target = document.getElementById(state.scrollTo);
    target?.scrollIntoView({ behavior: "smooth" });
  }, [location.state]);

  return (
    <>
      <Hero />
      <AtAGlance />
      <About />
      <Skills />
      <AnalyticsProcess />
      <Experience />
      <Projects />
      <BlogTeaser />
      <Education />
      <Testimonials />
      <Contact />
    </>
  );
}
