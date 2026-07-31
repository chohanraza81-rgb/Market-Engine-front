/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyber Theme Colors
        primary: '#2dd4bf',
        secondary: '#a78bfa',
        background: '#080B12',
        card: '#0D1117',
        success: '#34d399',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(45, 212, 191, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
