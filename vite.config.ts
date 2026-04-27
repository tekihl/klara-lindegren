import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
        resume: resolve(__dirname, 'resume.html'),
        media: resolve(__dirname, 'media.html'),
        recensioner: resolve(__dirname, 'recensioner.html'),
      },
    },
  },
})
