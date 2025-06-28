// Theme-based color definitions for consistent styling across the application

export const getThemeColors = (theme) => {
  const isDark = theme.name === 'dark';

  // Dashboard-inspired palette
  const palette = {
    dark: {
      background: {
        primary: '#0B1120', // main background
        secondary: '#181F2A', // card background
        card: '#181F2A',
        overlay: 'rgba(0,0,0,0.4)',
      },
      text: {
        primary: '#F1F5F9',
        secondary: '#94A3B8',
        muted: '#64748B',
      },
      border: {
        primary: '#232B3E',
        secondary: '#232B3E',
        accent: '#2563EB',
      },
      button: {
        primary: {
          background: '#2563EB',
          hover: '#1D4ED8',
          disabled: '#334155',
          text: '#FFFFFF',
        },
        secondary: {
          background: 'transparent',
          hover: '#232B3E',
          text: '#F1F5F9',
        },
      },
      status: {
        success: '#22C55E', // green-500
        warning: '#F59E0B',
        error: '#EF4444', // red-500
        info: '#2563EB', // blue-600
      },
      interactive: {
        link: '#2563EB',
        linkHover: '#1D4ED8',
        chip: {
          background: '#232B3E',
          border: '#2563EB',
          text: '#F1F5F9',
        },
        statusChip: {
          upcoming: {
            background: '#22C55E',
            text: '#FFFFFF',
          },
          overdue: {
            background: '#EF4444',
            text: '#FFFFFF',
          },
        },
      },
      shadow: {
        card: '0px 4px 24px rgba(0,0,0,0.25)',
        hover: '0px 8px 32px rgba(0,0,0,0.35)',
      },
      dialog: {
        background: '#181F2A',
        text: '#F1F5F9',
        border: '#232B3E',
      },
      form: {
        input: {
          background: '#181F2A',
          border: '#232B3E',
          borderHover: '#2563EB',
          borderFocus: '#2563EB',
          text: '#F1F5F9',
          label: '#94A3B8',
        },
      },
    },
    bright: {
      background: {
        primary: '#F8FAFC',
        secondary: '#FFFFFF',
        card: '#FFFFFF',
        overlay: 'rgba(0,0,0,0.1)',
      },
      text: {
        primary: '#1E293B',
        secondary: '#64748B',
        muted: '#94A3B8',
      },
      border: {
        primary: '#E2E8F0',
        secondary: '#CBD5E1',
        accent: '#2563EB',
      },
      button: {
        primary: {
          background: '#2563EB',
          hover: '#1D4ED8',
          disabled: '#94A3B8',
          text: '#FFFFFF',
        },
        secondary: {
          background: 'transparent',
          hover: '#E2E8F0',
          text: '#1E293B',
        },
      },
      status: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#2563EB',
      },
      interactive: {
        link: '#2563EB',
        linkHover: '#1D4ED8',
        chip: {
          background: '#E2E8F0',
          border: '#2563EB',
          text: '#1E293B',
        },
        statusChip: {
          upcoming: {
            background: '#22C55E',
            text: '#FFFFFF',
          },
          overdue: {
            background: '#EF4444',
            text: '#FFFFFF',
          },
        },
      },
      shadow: {
        card: '0px 4px 24px rgba(0,0,0,0.08)',
        hover: '0px 8px 32px rgba(0,0,0,0.12)',
      },
      dialog: {
        background: '#FFFFFF',
        text: '#1E293B',
        border: '#E2E8F0',
      },
      form: {
        input: {
          background: '#FFFFFF',
          border: '#E2E8F0',
          borderHover: '#2563EB',
          borderFocus: '#2563EB',
          text: '#1E293B',
          label: '#64748B',
        },
      },
    },
  };

  return isDark ? palette.dark : palette.bright;
};

// Helper function to get specific color
export const getColor = (theme, colorPath) => {
  const colors = getThemeColors(theme);
  return colorPath.split('.').reduce((obj, key) => obj[key], colors);
}; 