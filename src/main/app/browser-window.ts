import { BrowserView, BrowserWindow, screen, WebPreferences } from 'electron';
import { isDarwin } from './platform';
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

function getBrowserViewYPos(
  browserWindow: BrowserWindow,
  heightOffset: number,
) {
  const [_windowWidth, windowHeight] = browserWindow.getSize();

  // on MacOS if `y` is set to `0` then Electron sets it to be `windowHeight`,
  // so if `y` is set to `heightOffset` then Electron sets it to be `windowHeight + heightOffset`,
  // so `y` should be set to `heightOffset - windowHeight` to compensate.
  // See: https://github.com/electron/electron/issues/35994
  return isDarwin ? heightOffset - windowHeight : heightOffset;
}

export function createBrowserView(
  browserWindow: BrowserWindow,
  url: string,
): BrowserView {
  const heightOffset = TITLE_BAR_HEIGHT + TOOLBAR_HEIGHT;
  const [width, height] = browserWindow.getContentSize();
  const { backgroundColor } = getThemeOptions();

  const browserView = new BrowserView({
    webPreferences: {
      ...commonWebPreferences,
    },
  });
  browserView.setBounds({
    x: 0,
    y: getBrowserViewYPos(browserWindow, heightOffset),
    width,
    height: height - heightOffset,
  });
  browserView.setAutoResize({
    height: true,
    width: true,
  });
  browserView.setBackgroundColor(backgroundColor);
  browserView.webContents.loadURL(url);

  return browserView;
}
