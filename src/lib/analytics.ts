// Thin wrapper around GoatCounter's custom-event tracking (see the script
// tag in index.html for the pageview tracker itself). Every call is
// defensive — GoatCounter may not have loaded yet (slow network), may be
// blocked (ad blockers), or may be running on localhost, where it silently
// no-ops by design.
//
// To add a new tracked action: call `trackEvent("some-name")` from the
// component at the moment the action happens (see ResumeGate.tsx,
// ContactMessageForm.tsx, PhoneReveal.tsx, and Projects.tsx for examples).
// Event names appear verbatim in the GoatCounter dashboard under "Pages" —
// keep them short, kebab-case, and prefixed by category (e.g.
// "project-link:my-project:live") so related events sort together.

declare global {
  interface Window {
    goatcounter?: {
      count: (options: { path: string; title?: string; event?: boolean }) => void;
    };
  }
}

export function trackEvent(name: string) {
  window.goatcounter?.count({ path: name, event: true });
}
