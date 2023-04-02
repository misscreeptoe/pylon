import { BrowserView, BrowserWindow, screen, WebPreferences } from 'electron';
import {
  getThemeOptions,
  TITLE_BAR_HEIGHT,
  TOOLBAR_HEIGHT,
} from './window-theme';

const commonWebPreferences: WebPreferences = {
  webviewTag: false,
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true,
  allowRunningInsecureContent: false,
};

export function createBrowserWindow(
  url: string,
  preload?: string,
): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  const browserWindow = new BrowserWindow({
    ...getThemeOptions(),
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    title: 'Pylon',
    titleBarStyle: 'hidden',
    webPreferences: {
      ...commonWebPreferences,
      preload,
    },
  });

  browserWindow.setMenuBarVisibility(false);
  browserWindow.loadURL(url);

  return browserWindow;
}

export function createBrowserView(
  browserWindow: BrowserWindow,
  url: string,
): BrowserView {
  const toolbarHeight = TITLE_BAR_HEIGHT + TOOLBAR_HEIGHT;
  const [width, height] = browserWindow.getContentSize();
  const { backgroundColor } = getThemeOptions();

  const browserView = new BrowserView({
    webPreferences: {
      ...commonWebPreferences,
    },
  });
  browserView.setBounds({
    x: 0,
    y: toolbarHeight,
    width,
    height: height - toolbarHeight,
  });
  browserView.setAutoResize({
    height: true,
    width: true,
  });
  browserView.setBackgroundColor(backgroundColor);
  browserView.webContents.loadURL(url);

  return browserView;
}
