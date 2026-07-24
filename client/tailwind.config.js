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
        // Brand palette
        primary: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Canvas background tones (Light theme)
        canvas: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
          hover: '#f1f5f9',
        },
        // Editor chrome
        editor: {
          sidebar: '#ffffff',
          toolbar: '#ffffff',
          panel: '#ffffff',
          input: '#f1f5f9',
        },
        accent: {
          purple: '#8b5cf6',
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
          green:  '#10b981',
          orange: '#f59e0b',
          pink:   '#ec4899',
          red:    '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        'gradient-dark': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.5)',
        'panel': '0 8px 32px rgba(0,0,0,0.06)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.3)',
        'glow-blue':   '0 0 20px rgba(59,130,246,0.3)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in':   'slideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 3s linear infinite',
        'bounce-sm':  'bounceSm 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        bounceSm: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.05)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
