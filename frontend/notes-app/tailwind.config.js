/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    
    extend: {
      colors: {
        primary: '#2B85FF',
        secondary: '#EF863E',
      },
    },
  },
  plugins: [],
}
