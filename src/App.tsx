import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/sections/Hero";
import { AtAGlance } from "./components/sections/AtAGlance";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { AnalyticsProcess } from "./components/sections/AnalyticsProcess";
import { Experience } from "./components/sections/Experience";
import { Projects } from "./components/sections/Projects";
import { Education } from "./components/sections/Education";
import { Testimonials } from "./components/sections/Testimonials";
import { Contact } from "./components/sections/Contact";
import { profile } from "./data/content";

function App() {
  useEffect(() => {
    document.title = `${profile.name} — ${profile.role}`;
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AtAGlance />
        <About />
        <Skills />
        <AnalyticsProcess />
        <Experience />
        <Projects />
        <Education />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
