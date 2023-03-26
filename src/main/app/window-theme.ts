import { nativeTheme, TitleBarOverlayOptions } from 'electron';

export const TITLE_BAR_HEIGHT = 40;
export const TOOLBAR_HEIGHT = 40;

export interface ThemeOptions {
  backgroundColor: string;
  titleBarOverlay: TitleBarOverlayOptions;
}

export function getThemeOptions(): ThemeOptions {
  return nativeTheme.shouldUseDarkColors
    ? {
        backgroundColor: '#212529',
        titleBarOverlay: {
          color: '#2b3035',
          symbolColor: '#adb5bd',
          height: TITLE_BAR_HEIGHT,
        },
      }
    : {
        backgroundColor: '#e9ecef',
        titleBarOverlay: {
          color: '#e9ecef',
          symbolColor: '#212529',
          height: TITLE_BAR_HEIGHT,
        },
      };
}
