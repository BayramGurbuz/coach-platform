/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color-blind friendly palette (based on IBM's design system)
        primary: {
          50: '#e8f4fd',
          100: '#bee8ff',
          200: '#92dcfc',
          300: '#66cff8',
          400: '#41c5f5',
          500: '#0f62fe', // Main blue
          600: '#0353e9',
          700: '#0043ce',
          800: '#002d9c',
          900: '#001d6c',
        },
        success: {
          50: '#d2f4ea',
          100: '#a7f0d5',
          200: '#6eebc0',
          300: '#42be99',
          400: '#24a170',
          500: '#198038', // Green
          600: '#0f7030',
          700: '#0e6027',
          800: '#044317',
          900: '#022d10',
        },
        warning: {
          50: '#fcf4d6',
          100: '#fde899',
          200: '#fcdd5e',
          300: '#f1c21b', // Yellow
          400: '#d9ad00',
          500: '#be9700',
          600: '#a37f00',
          700: '#876800',
          800: '#6c5300',
          900: '#513d00',
        },
        danger: {
          50: '#fff0f1',
          100: '#ffd7d9',
          200: '#ffb3b8',
          300: '#ff8389',
          400: '#fa4d56', // Red
          500: '#da1e28',
          600: '#b91820',
          700: '#a2191f',
          800: '#78191e',
          900: '#5c0f14',
        },
        neutral: {
          50: '#f4f4f4',
          100: '#e0e0e0',
          200: '#c6c6c6',
          300: '#a8a8a8',
          400: '#8d8d8d',
          500: '#6f6f6f',
          600: '#525252',
          700: '#393939',
          800: '#262626',
          900: '#161616',
        },
      },
    },
  },
  plugins: [],
}

