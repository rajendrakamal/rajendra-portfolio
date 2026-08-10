import { AnimatePresence, motion } from "framer-motion";
import { Download, FileDown, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { contactForm } from "../data/content";

type ResumeGateProps = {
  resumeUrl: string;
  className?: string;
};

/**
 * Same pattern the WHATWG HTML spec uses to validate <input type="email">.
 * This checks the address is well-formed — it can't confirm the mailbox
 * actually exists/receives mail (that needs a paid verification API), which
 * is a reasonable static-site trade-off for a lead-capture gate like this.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Gates the resume PDF behind an email + purpose prompt. Once the form
 * validates, the file downloads immediately — the (optional) Web3Forms
 * notification to the owner is fire-and-forget and never blocks it.
 */
export function ResumeGate({ resumeUrl, className = "" }: ResumeGateProps) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const downloadRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!resumeUrl) return null;

  const resolvedUrl = `${import.meta.env.BASE_URL}${resumeUrl}`;

  function close() {
    setOpen(false);
    window.setTimeout(() => {
      setUnlocked(false);
      setEmail("");
      setPurpose("");
      setError("");
    }, 200);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (purpose.trim().length < 3) {
      setError("Let me know what you're looking for the resume for.");
      return;
    }

    setError("");
    setUnlocked(true);
    trackEvent("resume-download");

    const { web3formsAccessKey } = contactForm;
    if (web3formsAccessKey) {
      const formData = new FormData();
      formData.append("access_key", web3formsAccessKey);
      formData.append("subject", "Resume download request");
      formData.append("email", email.trim());
      formData.append("purpose", purpose.trim());
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      }).catch(() => {
        // Non-blocking — the visitor already has their download either way.
      });
    }

    window.setTimeout(() => downloadRef.current?.click(), 150);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`btn-secondary ${className}`}>
        <FileDown className="size-4" />
        Download resume
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Download resume"
              className="glass-card w-full max-w-md p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-heading">Resume</p>
                  <h3 className="font-display mt-2 text-xl font-semibold text-ink-900 dark:text-ink-50">
                    {unlocked ? "You're all set" : "Quick intro first"}
                  </h3>
                </div>
                <button type="button" onClick={close} aria-label="Close" className="icon-btn shrink-0">
                  <X className="size-4" />
                </button>
              </div>

              {unlocked ? (
                <div className="mt-4">
                  <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    Thanks — your download should have started automatically.
                  </p>
                  <a ref={downloadRef} href={resolvedUrl} download className="btn-primary mt-4">
                    <Download className="size-4" />
                    Download PDF
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    Tell me a bit about who's asking, and the PDF is yours.
                  </p>

                  <div>
                    <label htmlFor="rg-email" className="text-xs font-medium text-ink-600 dark:text-ink-300">
                      Email
                    </label>
                    <input
                      id="rg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="mt-1 w-full rounded-lg border border-ink-300/70 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700/70 dark:text-ink-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="rg-purpose" className="text-xs font-medium text-ink-600 dark:text-ink-300">
                      Purpose
                    </label>
                    <input
                      id="rg-purpose"
                      type="text"
                      required
                      value={purpose}
                      onChange={(event) => setPurpose(event.target.value)}
                      placeholder="e.g. Hiring for a Data Analyst role"
                      className="mt-1 w-full rounded-lg border border-ink-300/70 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700/70 dark:text-ink-50"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                  <button type="submit" className="btn-primary w-full justify-center">
                    <FileDown className="size-4" />
                    Unlock download
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
