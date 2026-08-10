import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Repo name for GitHub Pages project sites (https://<user>.github.io/<repo>/).
  // Set to '/' instead if you deploy to a custom domain or a user/org root page.
  base: '/rajendra-portfolio/',
  plugins: [react(), tailwindcss()],
})
