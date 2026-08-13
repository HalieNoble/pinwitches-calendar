/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16121F',
        surface: '#241B36',
        surface2: '#2E2247',
        magenta: '#FF3EA5',
        acid: '#B4FF39',
        bone: '#F2EEF7',
        dim: '#9C90B5',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
