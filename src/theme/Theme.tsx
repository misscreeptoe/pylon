import {
  PaletteColor,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { FC, PropsWithChildren, useMemo } from 'react';

export const Theme: FC<PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const mode = prefersDarkMode ? 'dark' : 'light';
  const tertiary: PaletteColor = prefersDarkMode
    ? {
        light: '#4B4C52',
        main: '#2F3037',
        dark: '#131316',
        contrastText: '#fff',
      }
    : {
        light: '#f5f5f5',
        main: '#e0e0e3',
        dark: '#9e9e9e',
        contrastText: '#000',
      };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          tertiary,
        },
      }),
    [prefersDarkMode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
