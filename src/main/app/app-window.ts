import {
  BrowserView,
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
import { TypedEventEmitter, uuid } from '../util';
import { createBrowserView, createBrowserWindow } from './browser-window';
import {
  BgAddTabIpcEvent,
  BgUpdateTabTitleIpcEvent,
  BG_ADD_TAB,
  BG_NEXT_TAB,
  BG_PREV_TAB,
  BG_REMOVE_CURRENT_TAB,
  BG_UPDATE_TAB_TITLE,
  FgRemoveTabIpcEvent,
  FgShowTabIpcEvent,
  FG_ADD_TAB,
  FG_LOADED,
  FG_REMOVE_TAB,
  FG_SHOW_TAB,
} from '../ipc';

type WindowOpenHandler = Parameters<WebContents['setWindowOpenHandler']>[0];

export type AppWindowEvents = {
  closed: () => void;
};

export class AppWindow extends TypedEventEmitter<AppWindowEvents> {
  private readonly browserWindow: BrowserWindow;
  private currentTabId: string | null = null;
  private tabs: Record<string, BrowserView | null> = {};

  constructor(private readonly id: string) {
    super();

    this.browserWindow = createBrowserWindow();
    this.browserWindow.once('close', () => {
      this.emit('closed');
    });

    this.initWebContents(this.browserWindow.webContents);
    this.setupIpcHandlers();
  }

  private get currentTab(): BrowserView | null {
    return this.tabs[this.currentTabId] ?? null;
  }

  private get currentTabHasBrowserView(): boolean {
    return this.currentTab !== null && this.currentTab instanceof BrowserView;
  }

  public updateTheme(): void {
    const { backgroundColor, titleBarOverlay } = getThemeOptions();

    this.browserWindow.setBackgroundColor(backgroundColor);
    this.browserWindow.setTitleBarOverlay(titleBarOverlay);
  }

  private setupIpcHandlers(): void {
    this.browserWindow.webContents.ipc.handle(FG_LOADED, (_event) => {
      this.addNewTab();
    });

    this.browserWindow.webContents.ipc.handle(FG_ADD_TAB, (_event) => {
      this.addNewTab();
    });

    this.browserWindow.webContents.ipc.handle(
      FG_REMOVE_TAB,
      (_event, payload: FgRemoveTabIpcEvent) => {
        this.removeTab(payload.id);
      },
    );

    this.browserWindow.webContents.ipc.handle(
      FG_SHOW_TAB,
      (_event, payload: FgShowTabIpcEvent) => {
        this.setCurrentTab(payload.id);
      },
    );
  }

  private initWebContents(webContents: WebContents): void {
    webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));
    webContents.on('before-input-event', this.onInputEvent.bind(this));
  }

  private onInputEvent(event: Event, input: Input): void {
    const keyboardShortcutAction = getKeyboardShortcutAction(input);

    switch (keyboardShortcutAction) {
      case KeyboardShortcutAction.nextTab: {
        this.sendNextTabEvent();
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.previousTab: {
        this.sendPrevTabEvent();
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.closeCurrentTab: {
        this.sendRemoveCurrentTabEvent();
        event.preventDefault();
        break;
      }

      case KeyboardShortcutAction.addNewTab: {
        this.addNewTab();
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

  private addNewTab(): string {
    const id = uuid();
    this.tabs[id] = null;

    this.sendAddNewTabEvent(id);

    return id;
  }

  private openUrlInTab(url: string): BrowserView {
    if (this.currentTabHasBrowserView) {
      const newTabId = this.addNewTab();
      this.setCurrentTab(newTabId);
    }

    return this.setCurrentTabBrowserView(url);
  }

  private removeTab(id: string): void {
    if (Object.keys(this.tabs).length >= 1) {
      return;
    }

    delete this.tabs[id];
    this.browserWindow.setBrowserView(null);
  }

  private setCurrentTab(id: string): void {
    this.currentTabId = id;
    this.browserWindow.setBrowserView(this.currentTab);
  }

  private setCurrentTabBrowserView(url: string): BrowserView {
    const browserView = createBrowserView(this.browserWindow, url);
    this.initWebContents(browserView.webContents);

    const tabId = this.currentTabId;
    browserView.webContents.on('page-title-updated', (_event, title) => {
      this.sentUpdateTabTitleEvent(tabId, title);
    });

    this.tabs[this.currentTabId] = browserView;
    this.browserWindow.setBrowserView(browserView);

    return browserView;
  }

  private sendAddNewTabEvent(id: string): void {
    const payload: BgAddTabIpcEvent = {
      id,
    };

    this.browserWindow.webContents.send(BG_ADD_TAB, payload);
  }

  private sendNextTabEvent(): void {
    this.browserWindow.webContents.send(BG_NEXT_TAB);
  }

  private sendPrevTabEvent(): void {
    this.browserWindow.webContents.send(BG_PREV_TAB);
  }

  private sendRemoveCurrentTabEvent(): void {
    this.browserWindow.webContents.send(BG_REMOVE_CURRENT_TAB);
  }

  private sentUpdateTabTitleEvent(id: string, title: string): void {
    const payload: BgUpdateTabTitleIpcEvent = {
      id,
      title,
    };

    this.browserWindow.webContents.send(BG_UPDATE_TAB_TITLE, payload);
  }
}
