import { nativeTheme, TitleBarOverlayOptions } from 'electron';

export const TITLE_BAR_HEIGHT = 40;

export interface ThemeOptions {
  backgroundColor: string;
  titleBarOverlay: TitleBarOverlayOptions;
}

export function getThemeOptions(): ThemeOptions {
  return nativeTheme.shouldUseDarkColors
    ? {
        backgroundColor: '#212529',
        titleBarOverlay: {
          color: '#212529',
          symbolColor: '#adb5bd',
          height: TITLE_BAR_HEIGHT,
        },
      }
    : {
        backgroundColor: '#fff',
        titleBarOverlay: {
          color: '#fff',
          symbolColor: '#212529',
          height: TITLE_BAR_HEIGHT,
        },
      };
}
