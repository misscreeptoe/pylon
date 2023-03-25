import { BrowserView, BrowserWindow } from 'electron';
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
import { uuid } from '../util';
import { createBrowserView } from './browser-window';

export class TabManager {
  private currentTabId: string | null = null;
  private tabs: Record<string, BrowserView | null> = {};

  constructor(private readonly browserWindow: BrowserWindow) {
    browserWindow.webContents.ipc.handle(FG_LOADED, (_event) => {
      this.addNewTab();
    });

    browserWindow.webContents.ipc.handle(FG_ADD_TAB, (_event) => {
      this.addNewTab();
    });

    browserWindow.webContents.ipc.handle(
      FG_REMOVE_TAB,
      (_event, payload: FgRemoveTabIpcEvent) => {
        this.removeTab(payload.id);
      },
    );

    browserWindow.webContents.ipc.handle(
      FG_SHOW_TAB,
      (_event, payload: FgShowTabIpcEvent) => {
        this.setCurrentTab(payload.id);
      },
    );
  }

  private get currentTab(): BrowserView | null {
    return this.tabs[this.currentTabId] ?? null;
  }

  private get currentTabHasBrowserView(): boolean {
    return this.currentTab !== null && this.currentTab instanceof BrowserView;
  }

  public nextTab(): void {
    this.sendNextTabEvent();
  }

  public prevTab(): void {
    this.sendPrevTabEvent();
  }

  public removeCurrentTab(): void {
    this.sendRemoveCurrentTabEvent();
  }

  public addNewTab(): string {
    const id = uuid();
    this.tabs[id] = null;

    this.sendAddNewTabEvent(id);

    return id;
  }

  public openUrlInTab(url: string): BrowserView {
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
