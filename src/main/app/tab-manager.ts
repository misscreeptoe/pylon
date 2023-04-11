import { BrowserView } from 'electron';
import { getThemeOptions } from './window-theme';
import { uuid } from '../util';
import { removeTabCacheEntry, upsertTabCacheEntry } from './tab-cache';

export class TabManager {
  private currentTabId: string | null = null;
  private tabs: Record<string, BrowserView> = {};

  public get currentTab(): BrowserView | null {
    if (!this.currentTabId) {
      return null;
    }

    return this.tabs[this.currentTabId] ?? null;
  }

  public updateTheme(): void {
    const { backgroundColor } = getThemeOptions();

    for (const [_id, browserView] of Object.entries(this.tabs)) {
      if (browserView === null) {
        return;
      }

      browserView.setBackgroundColor(backgroundColor);
    }
  }

  public openNewTab(browserView: BrowserView): string {
    const id = uuid();

    browserView.webContents.on('did-navigate', (event, url) => {
      console.log('Did navigate', event, url);
      upsertTabCacheEntry(id, url);
    });

    browserView.webContents.on('did-frame-navigate', (event, url) => {
      console.log('Did frame navigate', event, url);
      upsertTabCacheEntry(id, url);
    });

    browserView.webContents.on('did-navigate-in-page', (event, url) => {
      console.log('Did in-page navigate', event, url);
      upsertTabCacheEntry(id, url);
    });

    browserView.webContents.on('did-redirect-navigation', (event, url) => {
      console.log('Did redirect navigate', event, url);
      upsertTabCacheEntry(id, url);
    });

    this.currentTabId = id;
    this.tabs[id] = browserView;

    upsertTabCacheEntry(id, browserView.webContents.getURL());

    return id;
  }

  public closeTab(id: string): BrowserView | null {
    // don't delete the last tab
    if (Object.keys(this.tabs).length <= 1) {
      return null;
    }

    const browserView = this.tabs[id] ?? null;
    delete this.tabs[id];

    removeTabCacheEntry(id);

    return browserView;
  }

  public switchToTab(id: string): BrowserView | null {
    this.currentTabId = id;

    // make sure to shift focus to the new browser view
    // or keyboard shortcuts won't work anymore
    this.currentTab?.webContents.focus();

    return this.currentTab;
  }

  public currentTabGoback(): void {
    this.currentTab?.webContents.goBack();
  }

  public currentTabGoForward(): void {
    this.currentTab?.webContents.goForward();
  }

  public currentTabReload(): void {
    this.currentTab?.webContents.reload();
  }

  public hardReloadCurrentTab(): void {
    this.currentTab?.webContents.reloadIgnoringCache();
  }

  public toggleCurrentTabDevTools(): void {
    if (!this.currentTab) {
      return;
    }

    if (this.currentTab.webContents.isDevToolsOpened()) {
      this.currentTab.webContents.closeDevTools();
    } else {
      this.currentTab.webContents.openDevTools({
        mode: 'detach',
      });
    }
  }
}
