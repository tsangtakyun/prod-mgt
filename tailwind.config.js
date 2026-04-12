/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        amber: { 300: '#e8c97a' },
      },
      borderColor: {
        'white/8': 'rgba(255,255,255,0.08)',
        'white/7': 'rgba(255,255,255,0.07)',
        'white/6': 'rgba(255,255,255,0.06)',
      },
      opacity: { 18: '0.18', 35: '0.35', 45: '0.45', 85: '0.85' },
    },
  },
  plugins: [],
}
