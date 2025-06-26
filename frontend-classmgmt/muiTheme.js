import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#1E40AF',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    border: {
      soft: '#334155',
      strong: '#475569',
    },
    custom: {
      glass: {
        whiteBlur: 'rgba(255,255,255,0.05)',
        blackBlur: 'rgba(0,0,0,0.4)',
      },
    }
  },
});
export default theme;
