import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Garamond', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        'eco-green': '#10b981',
        'eco-blue': '#3b82f6',
        'eco-purple': '#a855f7',
        'eco-orange': '#f97316',
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        // Semantic palette colors
        'sage': '#10b981',         // Environmental
        'clay': '#f97316',         // Social/Terracotta
        'ink-blue': '#3b82f6',     // Governance
        'ceramic': '#06b6d4',      // Overall/Cyan
      },
      backgroundColor: {
        'dark-primary': '#0f172a',
        'dark-secondary': '#1e293b',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;

