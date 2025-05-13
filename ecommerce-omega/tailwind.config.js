// └── tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',      // your App-Router pages
      './src/components/**/*.{js,ts,jsx,tsx}',// your shared components
    ],
    theme: {
      extend: {
        colors: {
          bg1:     'var(--color-bg1)',
          bg2:     'var(--color-bg2)',
          text1:   'var(--color-text1)',
          text2:   'var(--color-text2)',
          border:  'var(--color-border)',
          border2: 'var(--color-border2)',
        },
      },
    },
    plugins: [],
  }
  