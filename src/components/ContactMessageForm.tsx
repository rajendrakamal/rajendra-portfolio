import { Mail, Send } from "lucide-react";
import { type FormEvent, useState } from "react";

type ContactMessageFormProps = {
  accessKey: string;
  className?: string;
};

const REASONS = [
  "Job opportunity",
  "Consulting / freelance work",
  "Speaking or networking",
  "Something else",
];

type Status = "idle" | "sending" | "success" | "error";

/**
 * Lets visitors message the owner directly through Web3Forms — the owner's
 * email address never appears in the page's HTML/JS, only the Web3Forms
 * access key does (which can only receive submissions, not read the inbox).
 */
export function ContactMessageForm({ accessKey, className = "" }: ContactMessageFormProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  if (!accessKey) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", accessKey);

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`btn-primary ${className}`}
      >
        <Mail className="size-4" />
        Send a message
      </button>
    );
  }

  return (
    <div className={`glass-card w-full max-w-lg p-6 text-left ${className}`}>
      {status === "success" ? (
        <div className="py-4 text-center">
          <p className="text-lg font-semibold text-ink-900 dark:text-ink-50">
            Message sent — thank you!
          </p>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
            I'll get back to you as soon as I can.
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setStatus("idle");
            }}
            className="mt-4 text-sm font-medium text-accent-600 hover:underline dark:text-accent-400"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot: hidden from real visitors, catches basic bots. */}
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="cf-name" className="text-xs font-medium text-ink-600 dark:text-ink-300">
              Name
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700 dark:text-ink-50"
            />
          </div>

          <div>
            <label htmlFor="cf-email" className="text-xs font-medium text-ink-600 dark:text-ink-300">
              Your email (so I can reply)
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700 dark:text-ink-50"
            />
          </div>

          <div>
            <label htmlFor="cf-reason" className="text-xs font-medium text-ink-600 dark:text-ink-300">
              Reason
            </label>
            <select
              id="cf-reason"
              name="reason"
              required
              defaultValue=""
              className="mt-1 w-full rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700 dark:text-ink-50 dark:[color-scheme:dark]"
            >
              <option value="" disabled>
                Select a reason
              </option>
              {REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cf-subject" className="text-xs font-medium text-ink-600 dark:text-ink-300">
              Subject
            </label>
            <input
              id="cf-subject"
              name="subject"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700 dark:text-ink-50"
            />
          </div>

          <div>
            <label htmlFor="cf-message" className="text-xs font-medium text-ink-600 dark:text-ink-300">
              Message
            </label>
            <textarea
              id="cf-message"
              name="message"
              rows={4}
              required
              className="mt-1 w-full resize-none rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 dark:border-ink-700 dark:text-ink-50"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Something went wrong sending that — please try again in a moment.
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="size-4" />
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
