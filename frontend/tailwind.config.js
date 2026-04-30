/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { gray: { 850: '#1a1b2e', 950: '#030712' } },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
