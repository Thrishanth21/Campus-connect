/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: '#0F172A',
          navyLight: '#1E293B',
          navyMuted: '#334155',
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          blueLight: '#EFF6FF',
          orange: '#F97316',
          orangeLight: '#FFF7ED',
          border: '#E2E8F0',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          textMuted: '#64748B',
          textMain: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
