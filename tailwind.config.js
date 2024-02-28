/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{js,jsx,ts,tsx}', './app/javascript/packs/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

