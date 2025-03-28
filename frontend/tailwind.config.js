export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true, // Force !important on all utilities
  corePlugins: {
    preflight: false, // Disable default styles
  },
  theme: {
    extend: {},
  },
  plugins: [],
}