/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#00A651',
        accent: '#FF6B35',
        surface: '#F8FAFC',
        success: '#00A651',
        warning: '#FFA500',
        error: '#DC3545',
        info: '#17A2B8',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}