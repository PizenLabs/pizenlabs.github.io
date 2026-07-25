/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#070a09',
          800: '#0a0e0c',
          700: '#0f1513',
          600: '#141c19',
          500: '#1b2521',
          400: '#26332e',
          300: '#384741',
        },
        forest: {
          900: '#0d1a13',
          700: '#163a26',
          500: '#1f5a3d',
          400: '#2d7a52',
          300: '#3fa66a',
          200: '#6fce94',
          100: '#a8e3bd',
        },
        lime: {
          400: '#b6e85a',
          300: '#c9f07a',
        },
        bone: {
          50: '#f4f7f5',
          100: '#e6ede9',
          200: '#cdd8d2',
          300: '#a7b6ae',
          400: '#7d8c84',
          500: '#5b6960',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightish: '-0.015em',
        tighter: '-0.03em',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1.2s ease forwards',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'scan': 'scan 6s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
