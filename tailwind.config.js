/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './build/**/*.html',  // Scans all HTML files in the build folder
    './build/js/**/*.js', // Scans all JavaScript files in the js folder
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}







// content: ['./build/*.html'],