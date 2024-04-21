module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Make sure to include all file types you're using
  theme: {
    extend: {
      colors: {
        'custom-gray': '#F5F5F5',
        'custom-gray2': '#F7F8F9',
        'custom-green': '#09e85e',
      },
      transitionProperty: { // Extending transition properties
        'width': 'width',
        'margin': 'margin',
      },
      height: { // Adding custom height utilities
        '128': '32rem', // Assuming 1rem = 4px, 32rem would be equivalent to 128px
        '256': '64rem', // Assuming 1rem = 4px, 64rem would be equivalent to 256px
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    // Your plugins here
  ],
}
