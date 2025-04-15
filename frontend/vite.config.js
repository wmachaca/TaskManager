import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows you to use global variables like `describe`, `it`, `expect` without importing them
    environment: 'jsdom', // Use jsdom for DOM-related testing (like React)
    setupFiles: './vite.setup.js', // Optionally include your setup file if needed
  },
  server: { port: 3000 },
});
