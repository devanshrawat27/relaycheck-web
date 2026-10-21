import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F2EA',
        surface: '#FFFDF9',
        ink: '#15120E',
        muted: '#6E6659',
        line: '#E2DACC',
        ember: {
          DEFAULT: '#D9501F',
          soft: '#FBE9E0',
        },
        success: { DEFAULT: '#1D7A4B', soft: '#E7F3EC' },
        danger: { DEFAULT: '#B3261E', soft: '#FCEAE7' },
        warn: { DEFAULT: '#A85B04', soft: '#FCF1E0' },
        info: { DEFAULT: '#1D4ED8', soft: '#E9EFFC' },
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
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21, 18, 14, 0.04), 0 12px 32px -20px rgba(21, 18, 14, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
