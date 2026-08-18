// Thin wrapper around GoatCounter (see the script tag in index.html, which
// loads with `no_onload: true` so pageviews are counted manually here
// instead — see RouteTracker.tsx for why that's necessary in an SPA).
// Every call is defensive — GoatCounter may not have loaded yet (slow
// network), may be blocked (ad blockers), or may be running on localhost,
// where it silently no-ops by design.
//
// To add a new tracked action: call `trackEvent("some-name")` from the
// component at the moment the action happens (see ResumeGate.tsx,
// ContactMessageForm.tsx, PhoneReveal.tsx, Projects.tsx, Footer.tsx, and
// Contact.tsx for examples). Event names appear verbatim in the GoatCounter
// dashboard under "Pages" — keep them short, kebab-case, and prefixed by
// category (e.g. "project-link:my-project:live") so related events sort
// together.

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

/**
 * Records a real pageview (not a custom event) for the given path — used
 * by RouteTracker on every client-side navigation, since GoatCounter's
 * script only fires automatically on the initial full page load.
 */
export function trackPageview(path: string, title?: string) {
  window.goatcounter?.count({ path, title });
}
