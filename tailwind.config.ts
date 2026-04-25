import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#E91E8C',
          light: '#FF4DB3',
          dark: '#B5166D',
          glow: 'rgba(233,30,140,0.22)',
          dim: 'rgba(233,30,140,0.10)',
        },
        bg: {
          DEFAULT: '#0D0A0C',
          secondary: '#130E11',
        },
        surface: {
          DEFAULT: '#201519',
          2: '#2A1C22',
        },
        text: {
          DEFAULT: '#F8F0F4',
          secondary: '#BFA0AB',
          muted: '#7A5665',
        },
        gold: '#E8B84B',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      maxWidth: {
        content: '1160px',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '18px',
        xl: '24px',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #E91E8C, #E8B84B)',
        'gradient-dark': 'linear-gradient(180deg, transparent, #0D0A0C)',
      },
      boxShadow: {
        'pink-glow': '0 0 20px rgba(233,30,140,0.3)',
        'pink-glow-lg': '0 0 40px rgba(233,30,140,0.4)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}

export default config
