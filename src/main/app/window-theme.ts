import { nativeTheme, TitleBarOverlayOptions } from 'electron';

export interface ThemeOptions {
  backgroundColor: string;
  titleBarOverlay: TitleBarOverlayOptions;
}

export function getThemeOptions(): ThemeOptions {
  const height = 40;

  return nativeTheme.shouldUseDarkColors
    ? {
        backgroundColor: '#212529',
        titleBarOverlay: {
          color: '#212529',
          symbolColor: '#adb5bd',
          height,
        },
      }
    : {
        backgroundColor: '#fff',
        titleBarOverlay: {
          color: '#fff',
          symbolColor: '#212529',
          height,
        },
      };
}
