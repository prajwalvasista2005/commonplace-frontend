import { createTheme } from '@mui/material/styles';

// Commonplace Design System:
// A refined, editorial palette combining deep teal, slate navy, warm neutral linen,
// and restrained amber/brass accents. Absolutely NO purple.
const tokens = {
  // Primary brand: Deep Teal / Ocean Slate
  teal: {
    main: '#0E4D55',
    light: '#1B6A75',
    dark: '#083339',
    contrastText: '#F5F9F9',
  },
  // Dark Slate / Navy for contrast and depth
  slate: {
    main: '#1A2E35',
    light: '#2D444D',
    dark: '#101D22',
    contrastText: '#FFFFFF',
  },
  // Warm Amber / Brass for restrained accents and highlights
  amber: {
    main: '#C07D2B',
    light: '#D99645',
    dark: '#965E1B',
    contrastText: '#FFFFFF',
  },
  // Oxide Red for destructive/error actions
  oxide: {
    main: '#B83A38',
    light: '#CF5755',
    dark: '#8C2725',
    contrastText: '#FFFFFF',
  },
  // Success Green
  forest: {
    main: '#286E53',
    light: '#3C8A6B',
    dark: '#194E3A',
    contrastText: '#FFFFFF',
  },
  // Light Mode Surfaces (Warm Linen & Crisp Cards)
  light: {
    bgDefault: '#F6F7F3',
    bgPaper: '#FFFFFF',
    textPrimary: '#162224',
    textSecondary: '#526265',
    border: 'rgba(14, 77, 85, 0.12)',
    divider: 'rgba(14, 77, 85, 0.08)',
  },
  // Dark Mode Surfaces (Deep Obsidian & Elevated Slate)
  dark: {
    bgDefault: '#0E1416',
    bgPaper: '#151D20',
    textPrimary: '#EDF3F3',
    textSecondary: '#9CB0B3',
    border: 'rgba(237, 243, 243, 0.10)',
    divider: 'rgba(237, 243, 243, 0.07)',
  },
};

const getDesignTokens = (mode) => {
  const isLight = mode === 'light';
  const surfaces = isLight ? tokens.light : tokens.dark;

  return {
    palette: {
      mode,
      primary: {
        main: isLight ? tokens.teal.main : tokens.teal.light,
        light: tokens.teal.light,
        dark: tokens.teal.dark,
        contrastText: tokens.teal.contrastText,
      },
      secondary: {
        main: tokens.amber.main,
        light: tokens.amber.light,
        dark: tokens.amber.dark,
        contrastText: tokens.amber.contrastText,
      },
      error: {
        main: tokens.oxide.main,
        light: tokens.oxide.light,
        dark: tokens.oxide.dark,
      },
      warning: {
        main: tokens.amber.main,
        light: tokens.amber.light,
        dark: tokens.amber.dark,
      },
      success: {
        main: tokens.forest.main,
        light: tokens.forest.light,
        dark: tokens.forest.dark,
      },
      background: {
        default: surfaces.bgDefault,
        paper: surfaces.bgPaper,
      },
      text: {
        primary: surfaces.textPrimary,
        secondary: surfaces.textSecondary,
      },
      divider: surfaces.divider,
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.25,
      },
      h3: {
        fontWeight: 650,
        letterSpacing: '-0.015em',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 650,
        letterSpacing: '-0.01em',
        lineHeight: 1.35,
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        lineHeight: 1.4,
      },
      subtitle1: {
        fontWeight: 600,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        lineHeight: 1.55,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      caption: {
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: surfaces.bgDefault,
            color: surfaces.textPrimary,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 18px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isLight
                ? '0 2px 8px rgba(14, 77, 85, 0.22)'
                : '0 2px 8px rgba(0, 0, 0, 0.45)',
            },
          },
          outlined: {
            borderColor: surfaces.border,
            '&:hover': {
              borderColor: isLight ? tokens.teal.main : tokens.teal.light,
              backgroundColor: isLight ? 'rgba(14, 77, 85, 0.04)' : 'rgba(27, 106, 117, 0.08)',
            },
          },
          sizeSmall: {
            padding: '5px 12px',
            fontSize: '0.8125rem',
          },
          sizeLarge: {
            padding: '12px 24px',
            fontSize: '0.9375rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${surfaces.border}`,
            backgroundColor: surfaces.bgPaper,
            boxShadow: isLight
              ? '0 1px 3px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(14, 77, 85, 0.03)'
              : '0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 14,
          },
          outlined: {
            borderColor: surfaces.border,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(12px)',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(21, 29, 32, 0.92)',
            color: surfaces.textPrimary,
            borderBottom: `1px solid ${surfaces.border}`,
            boxShadow: isLight ? '0 1px 6px rgba(0, 0, 0, 0.02)' : 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: surfaces.border,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? 'rgba(14, 77, 85, 0.35)' : 'rgba(237, 243, 243, 0.25)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? tokens.teal.main : tokens.teal.light,
              borderWidth: '1.5px',
            },
          },
          input: {
            padding: '12px 14px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${surfaces.border}`,
            boxShadow: isLight
              ? '0 12px 36px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(14, 77, 85, 0.06)'
              : '0 16px 48px rgba(0, 0, 0, 0.55)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            fontSize: '0.75rem',
            padding: '5px 10px',
            backgroundColor: isLight ? tokens.slate.main : '#2A3C42',
            color: '#FFFFFF',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: surfaces.divider,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  };
};

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
