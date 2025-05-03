// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        imageUpload: resolve(__dirname, 'imageUpload.html'),
        imageFeedback: resolve(__dirname, 'imageFeedback.html'),
        imageList: resolve(__dirname, 'imageList.html'),
      },
    },
  },
})
