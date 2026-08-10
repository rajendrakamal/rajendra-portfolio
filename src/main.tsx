import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user" makes every Framer Motion animation site-wide
        automatically respect the OS-level prefers-reduced-motion setting
        (transform/scale animations become instant; opacity fades still
        play) — no need to handle this per-component. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
