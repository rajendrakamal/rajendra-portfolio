import { Check, Copy, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { trackEvent } from "../lib/analytics";
import { useStrings } from "../i18n/strings";

type PhoneRevealProps = {
  phone: string;
  className?: string;
};

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
  const s = useStrings();

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
          aria-label={s.phone.copyAria}
          title={s.phone.copyAria}
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
        {s.phone.requestNumber}
      </button>

      {open && (
        <div className="glass-card absolute top-full left-1/2 z-10 mt-2 w-64 -translate-x-1/2 p-3 text-left">
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
            {s.phone.whatsThisAbout}
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {/* value stays the canonical English string (see strings.ts) so
                the trackEvent name stays consistent in analytics regardless
                of display language; only the visible label translates. */}
            {s.contactReasons.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  setReason(r.value);
                  setOpen(false);
                  trackEvent(`phone-reveal:${r.value}`);
                }}
                className="rounded-lg px-2.5 py-1.5 text-left text-sm text-ink-700 transition-colors hover:bg-accent-50 hover:text-accent-700 dark:text-ink-200 dark:hover:bg-accent-900/30 dark:hover:text-accent-300"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
