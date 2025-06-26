module.exports = {
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
      },
    },
  };
  