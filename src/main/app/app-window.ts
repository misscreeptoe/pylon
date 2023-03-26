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
  isRemoveCurrentTab,
  isNextTab,
  isPrevTab,
  isAddNewTab,
  isReloadCurrentTab,
  isHardReloadCurrentTab,
  isToggleDevTools,
  isNavigateBack,
  isNavigateForward,
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
  FG_NAV_BACK,
  FG_NAV_FORWARD,
  FG_RELOAD,
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

    for (const [id, browserView] of Object.entries(this.tabs)) {
      if (browserView === null) {
        return;
      }

      browserView.setBackgroundColor(backgroundColor);
    }
  }

  private setupIpcHandlers(): void {
    this.browserWindow.webContents.ipc.handle(FG_LOADED, () => {
      this.addNewTab();
    });

    this.browserWindow.webContents.ipc.handle(FG_ADD_TAB, () => {
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

    this.browserWindow.webContents.ipc.handle(FG_RELOAD, () => {
      this.reloadCurrentTab();
    });

    this.browserWindow.webContents.ipc.handle(FG_NAV_BACK, () => {
      this.navigateBack();
    });

    this.browserWindow.webContents.ipc.handle(FG_NAV_FORWARD, () => {
      this.navigateForward();
    });
  }

  private initWebContents(webContents: WebContents): void {
    webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));
    webContents.on('before-input-event', this.onInputEvent.bind(this));
  }

  private onInputEvent(event: Event, input: Input): void {
    if (isNextTab(input)) {
      this.sendNextTabEvent();
      event.preventDefault();
      return;
    }

    if (isPrevTab(input)) {
      this.sendPrevTabEvent();
      event.preventDefault();
      return;
    }

    if (isReloadCurrentTab(input)) {
      this.reloadCurrentTab();
      event.preventDefault();
      return;
    }

    if (isHardReloadCurrentTab(input)) {
      this.hardReloadCurrentTab();
      event.preventDefault();
      return;
    }

    if (isRemoveCurrentTab(input)) {
      this.sendRemoveCurrentTabEvent();
      event.preventDefault();
      return;
    }

    if (isAddNewTab(input)) {
      this.addNewTab();
      event.preventDefault();
      return;
    }

    if (isToggleDevTools(input)) {
      this.toggleDevTools();
      event.preventDefault();
      return;
    }

    if (isNavigateBack(input)) {
      this.navigateBack();
      event.preventDefault();
      return;
    }

    if (isNavigateForward(input)) {
      this.navigateForward();
      event.preventDefault();
      return;
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
    const currentBrowserView = this.currentTab;

    // this is okay, if currentBrowserView is null
    // this will show the "new tab" page
    this.browserWindow.setBrowserView(currentBrowserView);

    if (currentBrowserView) {
      // make sure to shift focus to the new browser view
      // or keyboard shortcuts won't work anymore
      this.currentTab.webContents.focus();
    } else {
      // if there is no browser view then we need to focus the window
      this.browserWindow.webContents.focus();
    }
  }

  private navigateBack(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      return;
    }

    currentBrowserView.webContents.goBack();
  }

  private navigateForward(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      return;
    }

    currentBrowserView.webContents.goForward();
  }

  private reloadCurrentTab(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      return;
    }

    currentBrowserView.webContents.reload();
  }

  private hardReloadCurrentTab(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      return;
    }

    currentBrowserView.webContents.reloadIgnoringCache();
  }

  private toggleDevTools(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      this.toggleWebContentsDevTools(this.browserWindow.webContents);
      return;
    }

    this.toggleWebContentsDevTools(currentBrowserView.webContents);
  }

  private toggleWebContentsDevTools(webContents: WebContents): void {
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools();
    } else {
      webContents.openDevTools({
        mode: 'detach',
      });
    }
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
