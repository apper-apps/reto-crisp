/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6B46C1',
        secondary: '#3B82F6',
        accent: '#8B5CF6',
        surface: '#FFFFFF',
        background: '#F9FAFB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      backgroundImage: {
        'gradient-purple-blue': 'linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%)',
        'gradient-light': 'linear-gradient(135deg, #8B5CF6 0%, #60A5FA 100%)',
      }
    },
  },
  plugins: [],
}