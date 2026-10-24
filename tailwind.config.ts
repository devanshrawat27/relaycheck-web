import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F5',
        sand: '#F4EFEA',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1E1D1A',
          secondary: '#4A463F',
        },
        muted: '#6B665E',
        stone: '#9E988E',
        line: {
          DEFAULT: '#E8E2D8',
          subtle: '#F0ECE4',
        },
        ember: {
          DEFAULT: '#C94F16',
          dark: '#A83D10',
          hover: '#BA4410',
          soft: '#FDF1E7',
          border: '#F2D3BC',
        },
        success: {
          DEFAULT: '#276749',
          dark: '#1F513A',
          soft: '#EAF4EE',
          border: '#BDE0CB',
        },
        danger: {
          DEFAULT: '#C53030',
          dark: '#9B2C2C',
          soft: '#FDECEC',
          border: '#F7C0C0',
        },
        warn: {
          DEFAULT: '#9A6210',
          dark: '#8C5B14',
          soft: '#FDF6E9',
          border: '#F8DCAC',
        },
        info: {
          DEFAULT: '#2B6CB0',
          dark: '#225287',
          soft: '#EBF3FA',
          border: '#BEE0F6',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Iowan Old Style',
          'Palatino Linotype',
          'Palatino',
          'Georgia',
          'ui-serif',
          'serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(30, 29, 26, 0.04), 0 1px 2px -1px rgba(30, 29, 26, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(30, 29, 26, 0.06), 0 1px 3px 0 rgba(30, 29, 26, 0.04)',
        elevated: '0 10px 25px -5px rgba(30, 29, 26, 0.08), 0 8px 10px -6px rgba(30, 29, 26, 0.04)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      keyframes: {
        flow: {
          '0%': { left: '0%', opacity: '0' },
          '12%': { opacity: '1' },
          '88%': { opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        flow: 'flow 5.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
