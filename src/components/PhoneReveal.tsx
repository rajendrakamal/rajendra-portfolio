import { Check, Copy, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { trackEvent } from "../lib/analytics";

type PhoneRevealProps = {
  phone: string;
  className?: string;
};

const REASONS = [
  "Job opportunity",
  "Consulting / freelance work",
  "Speaking or networking",
  "Something else",
];

/**
 * Gates the phone number behind a one-tap "what's this about" prompt.
 * The reason isn't sent anywhere (this is a static site) — it exists to
 * keep the number out of the DOM for anyone just skimming the page, and to
 * make casual harvesting slightly more deliberate than a single click.
 */
export function PhoneReveal({ phone, className = "" }: PhoneRevealProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const { copied, copy } = useCopyToClipboard();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!phone) return null;

  if (reason) {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full border border-ink-300/70 bg-white/60 py-2 pr-2 pl-5 text-sm font-semibold text-ink-700 backdrop-blur-sm dark:border-ink-700/70 dark:bg-ink-900/50 dark:text-ink-200 ${className}`}
      >
        <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="underline-offset-2 hover:underline">
          {phone}
        </a>
        <button
          type="button"
          onClick={() => copy(phone)}
          aria-label="Copy phone number"
          title="Copy phone number"
          className="inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="btn-secondary"
      >
        <Phone className="size-4" />
        Request phone number
      </button>

      {open && (
        <div className="glass-card absolute top-full left-1/2 z-10 mt-2 w-64 -translate-x-1/2 p-3 text-left">
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
            What's this regarding?
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setReason(r);
                  setOpen(false);
                  trackEvent(`phone-reveal:${r}`);
                }}
                className="rounded-lg px-2.5 py-1.5 text-left text-sm text-ink-700 transition-colors hover:bg-accent-50 hover:text-accent-700 dark:text-ink-200 dark:hover:bg-accent-900/30 dark:hover:text-accent-300"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
