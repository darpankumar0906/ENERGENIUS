/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        energy: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          bright: '#00d2ff',
          dim: 'rgba(0, 242, 254, 0.12)',
        },
        status: {
          positive: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
          info: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'energy': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'energy-lg': '0 0 35px -5px rgba(0, 242, 254, 0.5)',
        'positive': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'warning': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
        'critical': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s infinite ease-in-out',
        'dash': 'dash 1.5s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        dash: {
          to: {
            strokeDashoffset: '-24',
          },
        },
      }
    },
  },
  plugins: [],
}
