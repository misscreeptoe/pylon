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
        backgroundColor: '#131316',
        titleBarOverlay: {
          color: '#131316',
          symbolColor: '#fff',
          height: TITLE_BAR_HEIGHT,
        },
      }
    : {
        backgroundColor: '#e0e0e3',
        titleBarOverlay: {
          color: '#e0e0e3',
          symbolColor: '#212121',
          height: TITLE_BAR_HEIGHT,
        },
      };
}
