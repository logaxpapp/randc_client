/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable dark mode via a class on the <html> element
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
