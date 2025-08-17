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
        'gradient-achievement-gold': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-achievement-silver': 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)',
        'gradient-achievement-bronze': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      },
      animation: {
        'badge-unlock': 'badge-unlock 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'badge-glow': 'badge-glow 2s infinite',
        'sparkle': 'sparkle 1.5s infinite',
        'progress-ring': 'progress-ring 1s ease-out',
      }
    },
  },
  plugins: [],
}