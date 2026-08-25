import { createTheme } from '@mui/material/styles';

// Commonplace design tokens — grounded in the idea of a commonplace book:
// a personal journal for copying down what's worth remembering.
// Ink (deep pine) for structure, aged brass for the rare marginalia moment,
// oxide red kept strictly to destructive/negative actions, sage-paper (not
// cream) for the page itself.
const tokens = {
  ink: { main: '#1E3A3F', light: '#3A5A5F', dark: '#122326' },
  brass: { main: '#B08D2B', light: '#C9A94F', dark: '#8A6D1E' },
  oxide: { main: '#A13D3D', light: '#B96363', dark: '#7A2C2C' },
  paperLight: '#EEF0EA',
  panelLight: '#F7F8F4',
  paperDark: '#14181A',
  panelDark: '#1B211F',
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: tokens.ink.main,
      light: tokens.ink.light,
      dark: tokens.ink.dark,
      contrastText: '#F7F8F4',
    },
    secondary: {
      main: tokens.oxide.main,
      light: tokens.oxide.light,
      dark: tokens.oxide.dark,
      contrastText: '#ffffff',
    },
    warning: {
      main: tokens.brass.main,
      light: tokens.brass.light,
      dark: tokens.brass.dark,
    },
    background: {
      default: mode === 'light' ? tokens.paperLight : tokens.paperDark,
      paper: mode === 'light' ? tokens.panelLight : tokens.panelDark,
    },
    text: {
      primary: mode === 'light' ? '#20241F' : '#EDEFE9',
      secondary: mode === 'light' ? '#5B6158' : '#9BA39A',
    },
    divider: mode === 'light' ? 'rgba(30, 58, 63, 0.14)' : 'rgba(237, 239, 233, 0.14)',
  },
  typography: {
    fontFamily: '"Public Sans", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    caption: { fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(6px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 500,
        },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
