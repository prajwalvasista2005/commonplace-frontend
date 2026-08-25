import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from '../theme';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'theme_mode';

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  });

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      isDark: mode === 'dark',
    }),
    [mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
}
