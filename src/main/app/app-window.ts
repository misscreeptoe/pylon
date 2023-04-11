import {
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
import { TypedEventEmitter } from '../util';
import { createBrowserView, createBrowserWindow } from './browser-window';
import {
  MainEventType,
  MainOpenNewTab,
  MainSetTabTitle,
  RendererCloseTab,
  RendererEventType,
  RendererSwitchToTab,
} from '../../ipc';
import { TabManager } from './tab-manager';

type WindowOpenHandler = Parameters<WebContents['setWindowOpenHandler']>[0];

export type AppWindowEvents = {
  closed: () => void;
};

export class AppWindow extends TypedEventEmitter<AppWindowEvents> {
  private readonly browserWindow: BrowserWindow;
  private readonly tabManager: TabManager;

  constructor(private readonly id: string) {
    super();

    this.browserWindow = createBrowserWindow(
      MAIN_WINDOW_WEBPACK_ENTRY,
      MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    );
    this.browserWindow.once('close', () => {
      this.emit('closed');
    });
    this.tabManager = new TabManager();

    this.browserWindow.webContents.on(
      'before-input-event',
      this.onInputEvent.bind(this),
    );
    this.setupIpcHandlers();
  }

  public updateTheme(): void {
    const { backgroundColor, titleBarOverlay } = getThemeOptions();

    this.browserWindow.setBackgroundColor(backgroundColor);
    this.browserWindow.setTitleBarOverlay(titleBarOverlay);

    this.tabManager.updateTheme();
  }

  private subscribeToRendererEvent<U>(
    type: RendererEventType,
    listener: (event: IpcMainEvent, ...args: U[]) => void,
  ): void {
    this.browserWindow.webContents.ipc.on(type, listener);
  }

  private setupIpcHandlers(): void {
    this.subscribeToRendererEvent(RendererEventType.Loaded, () => {
      this.openNewTabAndNotify(NEW_TAB_WEBPACK_ENTRY);
    });

    this.subscribeToRendererEvent(RendererEventType.OpenNewTab, () => {
      this.openNewTab(NEW_TAB_WEBPACK_ENTRY);
    });

    this.subscribeToRendererEvent<RendererCloseTab>(
      RendererEventType.CloseTab,
      (_event, { id }) => {
        this.tabManager.closeTab(id);
      },
    );

    this.subscribeToRendererEvent<RendererSwitchToTab>(
      RendererEventType.SwitchToTab,
      (_event, { id }) => {
        const browserView = this.tabManager.switchToTab(id);
        this.browserWindow.setBrowserView(browserView);
      },
    );

    this.subscribeToRendererEvent(RendererEventType.CurrentTabReload, () => {
      this.tabManager.currentTabReload();
    });

    this.subscribeToRendererEvent(RendererEventType.CurrentTabGoBack, () => {
      this.tabManager.currentTabGoback();
    });

    this.subscribeToRendererEvent(RendererEventType.CurrentTabGoForward, () => {
      this.tabManager.currentTabGoForward();
    });
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
      this.tabManager.currentTabReload();
      event.preventDefault();
      return;
    }

    if (isHardReloadCurrentTab(input)) {
      this.tabManager.hardReloadCurrentTab();
      event.preventDefault();
      return;
    }

    if (isRemoveCurrentTab(input)) {
      this.sendCloseCurrentTabEvent();
      event.preventDefault();
      return;
    }

    if (isAddNewTab(input)) {
      this.openNewTab(NEW_TAB_WEBPACK_ENTRY);
      event.preventDefault();
      return;
    }

    if (isToggleDevTools(input)) {
      this.tabManager.toggleCurrentTabDevTools();
      event.preventDefault();
      return;
    }

    if (isNavigateBack(input)) {
      this.tabManager.currentTabGoback();
      event.preventDefault();
      return;
    }

    if (isNavigateForward(input)) {
      this.tabManager.currentTabGoForward();
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
        this.openNewTabAndNotify(details.url);
        return {
          action: 'deny',
        };

      // fail anything else
      case 'default':
      case 'other':
      default: {
        // [TODO] - handle error
        return {
          action: 'deny',
        };
      }
    }
  }

  private openNewTab(url: string): string {
    const browserView = createBrowserView(this.browserWindow, url);
    const tabId = this.tabManager.openNewTab(browserView);

    browserView.webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));
    browserView.webContents.on(
      'before-input-event',
      this.onInputEvent.bind(this),
    );
    browserView.webContents.on('page-title-updated', (_event, title) => {
      this.sendSetTabTitleEvent(tabId, title);
    });

    return tabId;
  }

  private openNewTabAndNotify(url: string): void {
    const tabId = this.openNewTab(url);
    this.sendOpenNewTabEvent(tabId);
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
