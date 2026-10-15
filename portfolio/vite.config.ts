// Portfolio mini-app — completely separate from the xls-studio app.
// Served at https://xls-studio.com/corentin-gassien/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig(({ isSsrBuild }) => ({
    root: here('.'),
    base: '/corentin-gassien/',
    plugins: [react()],
    build: isSsrBuild
        ? {
              // Step 2: compile the React pages for Node (used by prerender.mjs, then deleted)
              ssr: true,
              rollupOptions: { input: here('src/entry-server.tsx') },
              outDir: here('.ssr'),
              emptyOutDir: true,
              copyPublicDir: false,
          }
        : {
              // Step 1: CSS + images + the HTML template, straight into the site's dist folder
              outDir: here('../dist/corentin-gassien'),
              emptyOutDir: true,
          },
}))
