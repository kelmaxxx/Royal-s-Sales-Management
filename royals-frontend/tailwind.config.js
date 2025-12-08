/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#1e293b',
        },
        accent: {
          gold: '#f59e0b',
        },
        background: {
          light: '#f3f4f6',
        },
      },
    },
  },
  plugins: [],
}
