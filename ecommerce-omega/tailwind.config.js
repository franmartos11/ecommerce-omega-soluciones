// tailwind.config.js
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          bg1:    'var(--color-bg1)',
          bg2:    'var(--color-bg2)',
          text1:  'var(--color-text1)',
          text2:  'var(--color-text2)',
          border: 'var(--color-border)',
        },
      },
    },
    plugins: [],
  };
  