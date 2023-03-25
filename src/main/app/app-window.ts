import {
  BrowserWindow,
  Event,
  HandlerDetails,
  Input,
  shell,
  WebContents,
} from 'electron';
import {
  isInternetIdentityUrl,
  getCanisterIdFromDomain,
} from '../http-gateway';
import { getThemeOptions } from './window-theme';
import {
  getKeyboardShortcutAction,
  KeyboardShortcutAction,
} from './keyboard-shortcut-mappings';
import { TypedEventEmitter } from '../util';
import { TabManager } from './tab-manager';
import { createBrowserWindow } from './browser-window';

type WindowOpenHandler = Parameters<WebContents['setWindowOpenHandler']>[0];

export type AppWindowEvents = {
  closed: [];
};

export class AppWindow extends TypedEventEmitter<AppWindowEvents> {
  private readonly browserWindow: BrowserWindow;
  private readonly tabManager: TabManager;

  constructor(private readonly id: string) {
    super();

    this.browserWindow = createBrowserWindow();
    this.browserWindow.on('close', () => {
      this.emit('closed');
    });

    this.tabManager = new TabManager(this.browserWindow);

    this.initWebContents(this.browserWindow.webContents);
  }

  public updateTheme(): void {
    const { backgroundColor, titleBarOverlay } = getThemeOptions();

    this.browserWindow.setBackgroundColor(backgroundColor);
    this.browserWindow.setTitleBarOverlay(titleBarOverlay);
  }

  private initWebContents(webContents: WebContents): void {
    webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));
    webContents.on('before-input-event', this.onInputEvent.bind(this));
  }

  private onInputEvent(event: Event, input: Input): void {
    const keyboardShortcutAction = getKeyboardShortcutAction(input);

    switch (keyboardShortcutAction) {
      case KeyboardShortcutAction.nextTab: {
        this.tabManager.nextTab();
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.previousTab: {
        this.tabManager.prevTab();
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.closeCurrentTab: {
        this.tabManager.removeCurrentTab();
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.addNewTab: {
        this.tabManager.addNewTab();
        event.preventDefault();
        break;
      }
    }
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
        this.openUrlInTab(details.url);
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

  private openUrlInTab(url: string): void {
    const browserView = this.tabManager.openUrlInTab(url);
    this.initWebContents(browserView.webContents);
  }
}
