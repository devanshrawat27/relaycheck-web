import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F1',
        sand: '#F3EEE5',
        surface: '#FFFEFB',
        ink: '#25231F',
        muted: '#716B63',
        stone: '#999187',
        line: '#E8E0D5',
        ember: {
          DEFAULT: '#C94F16',
          dark: '#A83D10',
          soft: '#FBE7D5',
          border: '#EBC6A8',
        },
        success: { DEFAULT: '#347653', soft: '#E4F0E7' },
        danger: { DEFAULT: '#D94A42', soft: '#FCE9E6' },
        warn: { DEFAULT: '#B7791F', soft: '#FBF2E2' },
        info: { DEFAULT: '#5276C7', soft: '#E9EFFA' },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: ['Iowan Old Style', 'Palatino Linotype', 'Georgia', 'ui-serif', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(37, 35, 31, 0.04), 0 10px 24px -20px rgba(37, 35, 31, 0.22)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
      keyframes: {
        'scan-soft': {
          '0%': { transform: 'translateY(-12%)', opacity: '0' },
          '12%': { opacity: '0.55' },
          '78%': { opacity: '0.4' },
          '100%': { transform: 'translateY(430px)', opacity: '0' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'scan-soft': 'scan-soft 9s ease-in-out infinite',
        'float-soft': 'float-soft 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
