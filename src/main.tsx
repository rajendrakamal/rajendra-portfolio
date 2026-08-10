import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user" makes every Framer Motion animation site-wide
        automatically respect the OS-level prefers-reduced-motion setting
        (transform/scale animations become instant; opacity fades still
        play) — no need to handle this per-component. */}
    <MotionConfig reducedMotion="user">
      {/* basename matches vite.config.ts's `base` — GitHub Pages serves this
          site from a /rajendra-portfolio/ subpath, not the domain root.
          See public/404.html + the inline script in index.html for the
          redirect trick that makes deep links (e.g. /blog/my-post) survive
          a hard refresh on GitHub Pages, which has no server-side router. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
