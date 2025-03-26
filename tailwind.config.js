/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'apple-blue': {
          light: 'rgb(0, 122, 255)',
          dark: 'rgb(10, 132, 255)',
        },
        'apple-purple': {
          light: 'rgb(88, 86, 214)',
          dark: 'rgb(94, 92, 230)',
        },
        'apple-green': {
          light: 'rgb(52, 199, 89)',
          dark: 'rgb(48, 209, 88)',
        },
        'apple-red': {
          light: 'rgb(255, 59, 48)',
          dark: 'rgb(255, 69, 58)',
        },
        'apple-yellow': {
          light: 'rgb(255, 204, 0)',
          dark: 'rgb(255, 214, 10)',
        },
        'apple-teal': {
          light: 'rgb(90, 200, 250)',
          dark: 'rgb(100, 210, 255)',
        },
        'apple-gray': {
          light: 'rgb(142, 142, 147)',
          dark: 'rgb(152, 152, 157)',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}; 