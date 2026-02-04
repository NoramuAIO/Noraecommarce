import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary)',
          light: 'var(--color-primary)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          pink: 'var(--color-accent)',
          cyan: '#06B6D4',
          blue: '#3B82F6',
        },
        violet: {
          50: 'color-mix(in srgb, var(--color-primary) 5%, white)',
          100: 'color-mix(in srgb, var(--color-primary) 10%, white)',
          200: 'color-mix(in srgb, var(--color-primary) 20%, white)',
          300: 'color-mix(in srgb, var(--color-primary) 40%, white)',
          400: 'color-mix(in srgb, var(--color-primary) 70%, white)',
          500: 'var(--color-primary)',
          600: 'var(--color-primary)',
          700: 'color-mix(in srgb, var(--color-primary) 80%, black)',
        },
        fuchsia: {
          400: 'color-mix(in srgb, var(--color-accent) 70%, white)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent)',
        },
        purple: {
          500: 'var(--color-primary)',
        },
        pink: {
          500: 'var(--color-accent)',
        },
        dark: {
          DEFAULT: '#030712',
          50: '#111827',
          100: '#0F172A',
          200: '#0A0F1C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)' },
          '100%': { boxShadow: '0 0 40px color-mix(in srgb, var(--color-primary) 60%, transparent)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
export default config
