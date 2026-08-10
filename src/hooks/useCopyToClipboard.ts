import { useState } from "react";

/** Copies text to the clipboard and reports success for a short window, for "Copied!" UI feedback. */
export function useCopyToClipboard(resetAfterMs = 1500) {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), resetAfterMs);
    } catch {
      setCopied(false);
    }
  }

  return { copied, copy };
}
