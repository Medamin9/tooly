import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#17191F',
          light: '#2E323E',
        },
        paper: {
          DEFAULT: '#FAF9F6',
          dark: '#F3F0EA',
        },
        surface: '#FFFFFF',
        muted: '#6B6B70',
        line: '#E8E5E0',
        tooly: {
          red: '#F52F3D',
          'red-dark': '#C91F2D',
          'soft-red': '#FFF0F1',
        },
        success: '#237A57',
        warning: '#9A5A12',
        danger: '#B42318',
      },
      fontFamily: {
        sans: [
          'var(--font-latin)',
          'var(--font-arabic)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        arabic: ['var(--font-arabic)', 'sans-serif'],
      },
      borderRadius: {
        control: '12px',
        card: '20px',
        feature: '28px',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
