module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'], // make sure this is correct
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.7s ease-out forwards',
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#1E40AF',
        },
        background: {
          light: '#0F172A',
          medium: '#1E293B',
          dark: '#0B1120',
          overlay: 'rgba(0,0,0,0.4)',
        },
        text: {
          base: '#F1F5F9',
          muted: '#94A3B8',
          subtle: '#CBD5E1',
          danger: '#F87171',
          success: '#4ADE80',
        },
        border: {
          soft: '#334155',
          strong: '#475569',
        },
        glass: {
          whiteBlur: 'rgba(255,255,255,0.05)',
          blackBlur: 'rgba(0,0,0,0.4)',
        },
      },
    },
  },
  plugins: [],
};
