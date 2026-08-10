import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import portrait from "../../assets/portrait.jpg";
import { ResumeGate } from "../ResumeGate";
import { profile } from "../../data/content";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section
      id="top"
      className="grid-backdrop relative overflow-hidden border-b border-ink-200/70 dark:border-ink-800/70"
    >
      <div className="container-page section-py relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-300/70 px-3 py-1 text-xs font-medium text-ink-700 dark:border-ink-700/70 dark:text-ink-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-slow rounded-full bg-ink-900 dark:bg-ink-100" />
              <span className="relative inline-flex size-2 rounded-full bg-ink-900 dark:bg-ink-100" />
            </span>
            {profile.availability}
          </span>

          <h1 className="h1 mt-6 text-ink-900 dark:text-ink-50">{profile.name}</h1>
          <p className="font-display mt-2 text-xl font-semibold text-ink-700 sm:text-2xl dark:text-ink-200">
            {profile.role}
          </p>

          <p className="lead mt-6 max-w-xl text-ink-600 dark:text-ink-300">{profile.tagline}</p>

          <p className="mt-3 font-mono text-sm text-ink-500 dark:text-ink-400">
            {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => scrollTo("projects")} className="btn-primary">
              View projects
              <ArrowRight className="size-4" />
            </button>
            <button type="button" onClick={() => scrollTo("contact")} className="btn-secondary">
              <Mail className="size-4" />
              Get in touch
            </button>
            <ResumeGate resumeUrl={profile.socialLinks.resumeUrl} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-ink-200/70 shadow-sm dark:border-ink-800/70">
            <img
              src={portrait}
              alt={profile.name}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/0 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-lg font-semibold text-white sm:text-xl">
                {profile.name}
              </p>
              <p className="text-sm text-white/85">{profile.role}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
