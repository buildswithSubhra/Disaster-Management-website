export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf7f2',
          100: '#f2ece1',
          200: '#e6dccb',
          300: '#d5c6ad',
          400: '#b9a483',
        },
        ink: '#1c1917',
        clay: '#a8563a',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
