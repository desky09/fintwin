/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintwin: {
          // Brand Neon Yellow Accent matching exact design image
          yellow: '#EEFC57',
          yellowHover: '#E0EE45',
          yellowGlow: 'rgba(238, 252, 87, 0.35)',
          
          // Legacy aliases mapping to high contrast vibrant palette
          indigo: '#EEFC57',
          indigoDark: '#D4E23C',
          indigoLight: '#F5FD8A',
          
          // Chart & Glow Accents
          neonPink: '#FF3B8A',
          neonCyan: '#06B6D4',
          neonPurple: '#A855F7',
          neonGreen: '#22C55E',
          
          mint: '#22C55E',
          amber: '#F59E0B',
          coral: '#EF4444',
          
          // Obsidian Dark UI Palette (Exact match to screenshot)
          canvas: '#0B0F17',
          surface: '#131926',
          card: '#151C2B',
          cardHover: '#1A2336',
          cardBorder: '#202A3C',
          borderSubtle: 'rgba(255, 255, 255, 0.07)',
          
          // Text Tokens
          textPrimary: '#FFFFFF',
          textSecondary: '#94A3B8',
          textMuted: '#64748B',
          
          // Backward compatibility tokens
          ink: '#FFFFFF',
          slate: '#94A3B8',
          cloud: '#0B0F17',
          darkBg: '#0B0F17',
          darkSurface: '#131926',
          darkCard: '#151C2B',
          darkBorder: '#202A3C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'General Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'card-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(238, 252, 87, 0.2)',
        'yellow-glow': '0 0 25px rgba(238, 252, 87, 0.35)',
        'pink-glow': '0 0 25px rgba(255, 59, 138, 0.35)',
        'cyan-glow': '0 0 25px rgba(6, 182, 212, 0.35)'
      },
      animation: {
        'laser-scan': 'laserScan 2s ease-in-out infinite',
        'subtle-shake': 'subtleShake 0.4s ease-in-out',
        'fade-slide-up': 'fadeSlideUp 0.25s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        laserScan: {
          '0%, 100%': { top: '5%' },
          '50%': { top: '90%' }
        },
        subtleShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' }
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
