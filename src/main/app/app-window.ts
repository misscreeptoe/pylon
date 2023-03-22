import {
  BrowserWindow,
  Event,
  HandlerDetails,
  Input,
  nativeTheme,
  screen,
  shell,
  WebContents,
} from 'electron';
import { IpcEventType, OpenTabIpcEvent } from '../ipc';
import {
  isInternetIdentityUrl,
  getCanisterIdFromDomain,
} from '../http-gateway';
import { getThemeOptions } from './window-theme';
import { getWindowUrl } from './window-url';
import {
  getKeyboardShortcutAction,
  KeyboardShortcutAction,
} from './keyboard-shortcut-mappings';

type WindowOpenHandler = Parameters<WebContents['setWindowOpenHandler']>[0];

export class AppWindow {
  private browserWindow: BrowserWindow | null = null;

  constructor() {
    this.createWindow();
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

    nativeTheme.on('updated', this.onThemeUpdated.bind(this));
    this.browserWindow.on('close', this.onWindowClosed.bind(this));
    this.browserWindow.webContents.setWindowOpenHandler(
      this.onWindowOpen.bind(this),
    );
    this.browserWindow.webContents.on(
      'before-input-event',
      this.onInputEvent.bind(this),
    );

    this.browserWindow.webContents.on(
      'did-attach-webview',
      (_event, webcontents) => {
        webcontents.setWindowOpenHandler(this.onWindowOpen.bind(this));
        webcontents.on('before-input-event', this.onInputEvent.bind(this));
      },
    );
  }

  private onWindowClosed(): void {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    this.browserWindow = null;
  }

  private onInputEvent(event: Event, input: Input): void {
    const keyboardShortcutAction = getKeyboardShortcutAction(input);

    switch (keyboardShortcutAction) {
      case KeyboardShortcutAction.nextTab: {
        this.browserWindow.webContents.send(IpcEventType.nextTab);
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.previousTab: {
        this.browserWindow.webContents.send(IpcEventType.previousTab);
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.closeCurrentTab: {
        this.browserWindow.webContents.send(IpcEventType.closeCurrentTab);
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.addNewTab: {
        this.browserWindow.webContents.send(IpcEventType.addNewTab);
        event.preventDefault();
        break;
      }
    }
  }

  private onThemeUpdated(): void {
    const { backgroundColor, titleBarOverlay } = getThemeOptions();

    this.browserWindow.setBackgroundColor(backgroundColor);
    this.browserWindow.setTitleBarOverlay(titleBarOverlay);
  }

  private onWindowOpen(details: HandlerDetails): ReturnType<WindowOpenHandler> {
    const canisterId = getCanisterIdFromDomain(details.url);

    // open URLs that are not for the IC in the default system browser
    if (!canisterId) {
      shell.openExternal(details.url);

      return {
        action: 'deny',
      };
    }

    // open Internet identity URLs in a barebones window
    if (isInternetIdentityUrl(details.url)) {
      return {
        action: 'allow',
        outlivesOpener: false,
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
        },
      };
    }

    switch (details.disposition) {
      // [TODO] - handle creating new "full" window that hosts the Angular application
      // this should only be applied to non-authentication apps, II should still open in a barebones window
      // open in a new window
      case 'new-window':
        return {
          action: 'allow',
          outlivesOpener: false,
          overrideBrowserWindowOptions: {
            autoHideMenuBar: true,
          },
        };

      // open in a new tab
      case 'foreground-tab':
      case 'background-tab':
        this.sendOpenTabEvent({
          url: details.url,
        });
        return {
          action: 'deny',
        };

      // fail anything else
      case 'default':
      case 'save-to-disk':
      case 'other':
      default: {
        // [TODO] - handle error
        return {
          action: 'deny',
        };
      }
    }
  }

  private sendOpenTabEvent(openTabEvent: OpenTabIpcEvent): void {
    this.browserWindow.webContents.send(IpcEventType.openTab, openTabEvent);
  }
}
