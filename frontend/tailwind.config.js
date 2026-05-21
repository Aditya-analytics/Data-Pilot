/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#050505',
        white: '#FAFAFA',
        grey: {
          DEFAULT: '#E8E8E8',
          dark: '#D0D0D0'
        },
        yellow: {
          DEFAULT: '#FACC15', // Highlight color for active states
        },
        green: {
          DEFAULT: '#22c55e', // Success
        },
        red: {
          DEFAULT: '#ef4444', // Error
        }
      },
      fontFamily: {
        sans: ['"Cabinet Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal': '6px 6px 0px 0px rgba(5,5,5,1)',
        'brutal-hover': '10px 10px 0px 0px rgba(5,5,5,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(5,5,5,1)',
      }
    },
  },
  plugins: [],
}
