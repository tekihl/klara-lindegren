import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        resume: resolve(__dirname, 'resume.html'),
        media: resolve(__dirname, 'media.html'),
        reviews: resolve(__dirname, 'reviews-honors.html'),
      },
    },
  },
})
