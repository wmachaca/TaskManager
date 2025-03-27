// tailwind.config.js
export default {
  presets: [require('tailwindcss/defaultConfig')],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}" // Add this line    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Temporary debug option (remove after it works)
  important: true,  
  corePlugins: {
    preflight: false,
  }
}