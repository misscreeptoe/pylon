import { PaletteColor, Theme } from '@mui/material';
import {
  IpcListener,
  IpcUnsubscribe,
  MainOpenNewTab,
  MainSetTabTitle,
} from '../ipc';

declare global {
  interface Window {
    rendererAPI: {
      loaded: () => void;
      openNewTab: () => void;
      closeTab: (id: string) => void;
      switchToTab: (id: string) => void;
      currentTabReload: () => void;
      currentTabGoBack: () => void;
      currentTabGoForward: () => void;
    };

    mainAPI: {
      onSwitchToNextTab: (listener: IpcListener) => IpcUnsubscribe;
      onSwitchToPreviousTab: (listener: IpcListener) => IpcUnsubscribe;
      onOpenNewTab: (listener: IpcListener<MainOpenNewTab>) => IpcUnsubscribe;
      onCloseCurrentTab: (listener: IpcListener) => IpcUnsubscribe;
      onSetTabTitle: (listener: IpcListener<MainSetTabTitle>) => IpcUnsubscribe;
    };
  }
}

declare module '@mui/material' {
  export interface PaletteOptions {
    tertiary: PaletteColor;
  }

  export interface Theme {
    palette: PaletteOptions;
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
