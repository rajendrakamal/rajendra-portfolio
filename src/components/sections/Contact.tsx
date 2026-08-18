import { GithubIcon, LinkedinIcon } from "../icons/BrandIcons";
import { ContactMessageForm } from "../ContactMessageForm";
import { PhoneReveal } from "../PhoneReveal";
import { Reveal } from "../Reveal";
import { trackEvent } from "../../lib/analytics";
import { contactForm, profile } from "../../data/content";

export function Contact() {
  const { email, phone, linkedin, github } = profile.socialLinks;
  const { web3formsAccessKey } = contactForm;
  const hasContactInfo = Boolean(web3formsAccessKey || phone || linkedin || github);

  return (
    <section
      id="contact"
      className="section-py border-t border-ink-200/70 dark:border-ink-800/70"
    >
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-heading justify-center">Contact</p>
          <h2 className="h2 mt-3 text-ink-900 dark:text-ink-50">Let's talk about data</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-300">
            I'm always open to conversations about revenue analytics, pricing
            strategy, and building reporting that leadership actually trusts.
          </p>

          {hasContactInfo ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ContactMessageForm accessKey={web3formsAccessKey} />
              <PhoneReveal phone={phone} />
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => trackEvent("social-link:linkedin:contact")}
                  className="btn-secondary"
                >
                  <LinkedinIcon className="size-4" />
                  LinkedIn
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => trackEvent("social-link:github:contact")}
                  className="btn-secondary"
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </a>
              )}
            </div>
          ) : null}

          {(web3formsAccessKey || phone) && (
            <p className="mt-4 font-mono text-xs text-ink-400 dark:text-ink-500">
              No inbox spam, promise — messages go straight to me and my
              number is shared only when there's a reason to.
            </p>
          )}

          {!hasContactInfo && (
            <p className="mt-8 inline-block rounded-full border border-dashed border-ink-300 px-5 py-3 font-mono text-xs text-ink-500 dark:border-ink-700 dark:text-ink-400">
              Contact details coming soon — add them in{" "}
              <code>src/data/content.ts</code>
            </p>
          )}

          {/*
            Print-only fallback: every contact option above is gated behind
            interactive JS (a reveal form, a reason picker) that can't work
            on paper. A printed "resume" with a blank Contact section isn't
            useful, so show plain email/LinkedIn text here instead — hidden
            on screen, shown only when printing/"Save as PDF". Reaching
            someone who already has the physical page in hand isn't the
            scraping/harvesting risk the on-screen gates protect against.
          */}
          {(email || linkedin) && (
            <p className="mt-6 hidden font-mono text-sm text-black print:block">
              {email}
              {email && linkedin ? " · " : ""}
              {linkedin}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
