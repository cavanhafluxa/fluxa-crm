/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#28B0FE',
          50: '#EBF7FF',
          100: '#D1EFFE',
          200: '#A3DFFD',
          300: '#75CFFB',
          400: '#47BFF9',
          500: '#28B0FE',
          600: '#0A96E4',
          700: '#0774B2',
          800: '#055280',
          900: '#03304E',
        },
        cobalt: {
          DEFAULT: '#166FCA',
          500: '#166FCA',
          600: '#1259A2',
          700: '#0E437A',
        },
        bg: {
          light: '#F1F1F1',
          dark: '#0F0F10',
          card: '#FFFFFF',
          'card-dark': '#1A1A1B',
        },
        ink: {
          DEFAULT: '#0F0F10',
          soft: '#6B7280',
          muted: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
        'blue': '0 4px 24px rgba(40,176,254,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      }
    },
  },
  plugins: [],
}
