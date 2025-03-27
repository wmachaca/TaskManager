import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Replace with your desired port
  },  
  css: {
    postcss: './postcss.config.js' // Add this line
  }  
})
