import {
  BrowserView,
  BrowserWindow,
  Event,
  HandlerDetails,
  Input,
  IpcMainEvent,
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
  MainEventType,
  MainOpenNewTab,
  MainSetTabTitle,
  RendererCloseTab,
  RendererEventType,
  RendererSwitchToTab,
} from '../../ipc';

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

    this.browserWindow = createBrowserWindow(
      MAIN_WINDOW_WEBPACK_ENTRY,
      MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    );
    this.browserWindow.once('close', () => {
      this.emit('closed');
    });

    this.initWebContents(this.browserWindow.webContents);
    this.setupIpcHandlers();
  }

  private get currentTab(): BrowserView | null {
    if (!this.currentTabId) {
      return null;
    }

    return this.tabs[this.currentTabId] ?? null;
  }

  private get currentTabHasBrowserView(): boolean {
    return this.currentTab !== null && this.currentTab instanceof BrowserView;
  }

  public updateTheme(): void {
    const { backgroundColor, titleBarOverlay } = getThemeOptions();

    this.browserWindow.setBackgroundColor(backgroundColor);
    this.browserWindow.setTitleBarOverlay(titleBarOverlay);

    for (const [_id, browserView] of Object.entries(this.tabs)) {
      if (browserView === null) {
        return;
      }

      browserView.setBackgroundColor(backgroundColor);
    }
  }

  private subscribeToRendererEvent<U>(
    type: RendererEventType,
    listener: (event: IpcMainEvent, ...args: U[]) => void,
  ): void {
    this.browserWindow.webContents.ipc.on(type, listener);
  }

  private setupIpcHandlers(): void {
    this.subscribeToRendererEvent(RendererEventType.Loaded, () => {
      this.openNewTab();
    });

    this.subscribeToRendererEvent(RendererEventType.OpenNewTab, () => {
      this.openNewTab();
    });

    this.subscribeToRendererEvent<RendererCloseTab>(
      RendererEventType.CloseTab,
      (_event, { id }) => {
        this.closeTab(id);
      },
    );

    this.subscribeToRendererEvent<RendererSwitchToTab>(
      RendererEventType.SwitchToTab,
      (_event, { id }) => {
        this.switchToTab(id);
      },
    );

    this.subscribeToRendererEvent(RendererEventType.CurrentTabReload, () => {
      this.currentTabReload();
    });

    this.subscribeToRendererEvent(RendererEventType.CurrentTabGoBack, () => {
      this.currentTabGoback();
    });

    this.subscribeToRendererEvent(RendererEventType.CurrentTabGoForward, () => {
      this.currentTabGoForward();
    });
  }

  private initWebContents(webContents: WebContents): void {
    webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));
    webContents.on('before-input-event', this.onInputEvent.bind(this));
  }

  private onInputEvent(event: Event, input: Input): void {
    if (isNextTab(input)) {
      this.sendSwitchToNextTabEvent();
      event.preventDefault();
      return;
    }

    if (isPrevTab(input)) {
      this.sendSwitichToPreviousTabEvent();
      event.preventDefault();
      return;
    }

    if (isReloadCurrentTab(input)) {
      this.currentTabReload();
      event.preventDefault();
      return;
    }

    if (isHardReloadCurrentTab(input)) {
      this.hardReloadCurrentTab();
      event.preventDefault();
      return;
    }

    if (isRemoveCurrentTab(input)) {
      this.sendCloseCurrentTabEvent();
      event.preventDefault();
      return;
    }

    if (isAddNewTab(input)) {
      this.openNewTab();
      event.preventDefault();
      return;
    }

    if (isToggleDevTools(input)) {
      this.toggleDevTools();
      event.preventDefault();
      return;
    }

    if (isNavigateBack(input)) {
      this.currentTabGoback();
      event.preventDefault();
      return;
    }

    if (isNavigateForward(input)) {
      this.currentTabGoForward();
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

  private openNewTab(): string {
    const id = uuid();
    this.currentTabId = id;

    this.setCurrentTabBrowserView(NEW_TAB_WEBPACK_ENTRY);
    this.sendOpenNewTabEvent(id);

    return id;
  }

  private openUrlInTab(url: string): BrowserView {
    if (this.currentTabHasBrowserView) {
      const newTabId = this.openNewTab();
      this.switchToTab(newTabId);
    }

    return this.setCurrentTabBrowserView(url);
  }

  private closeTab(id: string): void {
    if (Object.keys(this.tabs).length >= 1) {
      return;
    }

    delete this.tabs[id];

    if (id === this.currentTabId) {
      this.browserWindow.setBrowserView(null);
    }
  }

  private switchToTab(id: string): void {
    this.currentTabId = id;
    const currentBrowserView = this.currentTab;

    // this is okay, if currentBrowserView is null
    // this will show the "new tab" page
    this.browserWindow.setBrowserView(currentBrowserView);

    if (currentBrowserView) {
      if (!this.currentTab) {
        return;
      }

      // make sure to shift focus to the new browser view
      // or keyboard shortcuts won't work anymore
      this.currentTab.webContents.focus();
    } else {
      // if there is no browser view then we need to focus the window
      this.browserWindow.webContents.focus();
    }
  }

  private currentTabGoback(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      return;
    }

    currentBrowserView.webContents.goBack();
  }

  private currentTabGoForward(): void {
    const currentBrowserView = this.currentTab;

    if (!currentBrowserView) {
      return;
    }

    currentBrowserView.webContents.goForward();
  }

  private currentTabReload(): void {
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
      if (!tabId) {
        return;
      }

      this.sendSetTabTitleEvent(tabId, title);
    });

    if (this.currentTabId) {
      this.tabs[this.currentTabId] = browserView;
    }
    this.browserWindow.setBrowserView(browserView);

    return browserView;
  }

  private sendMainEvent<U>(type: MainEventType, payload?: U): void {
    this.browserWindow.webContents.send(type, payload);
  }

  private sendSwitchToNextTabEvent(): void {
    this.sendMainEvent(MainEventType.SwitchToNextTab);
  }

  private sendSwitichToPreviousTabEvent(): void {
    this.sendMainEvent(MainEventType.SwitchToPreviousTab);
  }

  private sendOpenNewTabEvent(id: string): void {
    this.sendMainEvent<MainOpenNewTab>(MainEventType.OpenNewTab, { id });
  }

  private sendCloseCurrentTabEvent(): void {
    this.sendMainEvent(MainEventType.CloseCurrentTab);
  }

  private sendSetTabTitleEvent(id: string, title: string): void {
    this.sendMainEvent<MainSetTabTitle>(MainEventType.SetTabTitle, {
      id,
      title,
    });
  }
}
