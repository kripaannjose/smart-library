/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0d12',
        surface: '#111827',
        primary: {
          500: '#10b981',
          600: '#059669',
        },
        slate: {
          950: '#030712',
        }
      }
    },
  },
  plugins: [],
}
