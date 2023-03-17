import { BrowserWindow, nativeTheme, screen, WebContents } from 'electron';
import { getThemeOptions } from './window-theme';
import { getWindowUrl } from './window-url';

export class AppWindow {
  private browserWindow: BrowserWindow | null = null;

  constructor() {
    this.createWindow();

    nativeTheme.on('updated', this.onThemeUpdated.bind(this));
    this.browserWindow.on('close', this.onWindowClosed.bind(this));
    this.browserWindow.webContents.on(
      'did-attach-webview',
      this.onWebViewAttached.bind(this),
    );
  }

  private createWindow(): void {
    const size = screen.getPrimaryDisplay().workAreaSize;
    const windowUrl = getWindowUrl();

    this.browserWindow = new BrowserWindow({
      ...getThemeOptions(),
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      title: 'Pylon',
      titleBarStyle: 'hidden',
      webPreferences: {
        webviewTag: true,
        nodeIntegration: true,
        allowRunningInsecureContent: windowUrl.insecure,
        contextIsolation: false,
      },
    });

    this.browserWindow.setMenuBarVisibility(false);
    this.browserWindow.loadURL(windowUrl.href);
  }

  private onWindowClosed(): void {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    this.browserWindow = null;
  }

  private onThemeUpdated(): void {
    const { backgroundColor, titleBarOverlay } = getThemeOptions();

    this.browserWindow.setBackgroundColor(backgroundColor);
    this.browserWindow.setTitleBarOverlay(titleBarOverlay);
  }

  private onWebViewAttached(_event: Event, webContents: WebContents): void {
    webContents.setWindowOpenHandler((_details) => ({
      action: 'allow',
      outlivesOpener: false,
      overrideBrowserWindowOptions: {
        autoHideMenuBar: true,
      },
    }));
  }
}
