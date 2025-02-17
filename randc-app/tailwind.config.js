/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8",
        secondary: "#9333EA",
        accent: "#F59E0B",
        background: "#F3F4F6",
        customGreen: "#10B981",
        customBlue: "#3B82F6",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1.5rem',
      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      // Custom max-width utilities
      maxWidth: {
        '8xl': '80rem',  // e.g., 1440px if 1rem = 16px
        '9xl': '90rem', // 1600px
        '10xl': '120rem' // 1920px
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
