import { ArrowUp, Mail, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { contactForm, profile } from "../data/content";

export function Footer() {
  const { phone, linkedin, github } = profile.socialLinks;
  const { web3formsAccessKey } = contactForm;
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  // The Contact section only exists on the home page — from any other
  // route (e.g. /blog), navigate there first and let HomePage's own effect
  // scroll to it once mounted, same pattern as Navbar's section links.
  const goToContact = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "contact" } });
      return;
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-ink-200/70 dark:border-ink-800/70">
      <div className="container-page flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
          © {year} {profile.name} · Built with React, TypeScript & Tailwind
        </p>

        <div className="flex items-center gap-3">
          {web3formsAccessKey && (
            <button
              type="button"
              onClick={goToContact}
              aria-label="Email — send a message from the contact section"
              title="Send a message from the contact section"
              className="icon-btn"
            >
              <Mail className="size-4" />
            </button>
          )}
          {phone && (
            <button
              type="button"
              onClick={goToContact}
              aria-label="Phone — request in the contact section"
              title="Request phone number in the contact section"
              className="icon-btn"
            >
              <Phone className="size-4" />
            </button>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="icon-btn"
            >
              <LinkedinIcon className="size-4" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="icon-btn"
            >
              <GithubIcon className="size-4" />
            </a>
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="icon-btn"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
