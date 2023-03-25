import { BrowserView, BrowserWindow, screen, WebPreferences } from 'electron';
import { getThemeOptions, TITLE_BAR_HEIGHT } from './window-theme';
import { getWindowUrl } from './window-url';

const commonWebPreferences: WebPreferences = {
  webviewTag: false,
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true,
  allowRunningInsecureContent: false,
};

export function createBrowserWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;
  const windowUrl = getWindowUrl();

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
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      allowRunningInsecureContent: windowUrl.insecure,
    },
  });

  browserWindow.setMenuBarVisibility(false);
  browserWindow.loadURL(windowUrl.href);

  return browserWindow;
}

export function createBrowserView(
  browserWindow: BrowserWindow,
  url: string,
): BrowserView {
  const toolbarHeight = TITLE_BAR_HEIGHT;
  const [width, height] = browserWindow.getContentSize();

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
  browserView.webContents.loadURL(url);

  return browserView;
}
