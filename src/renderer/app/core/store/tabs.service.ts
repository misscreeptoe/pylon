import { Injectable } from '@angular/core';
import {
  FG_ADD_TAB,
  FG_REMOVE_TAB,
  FgRemoveTabIpcEvent,
  BgAddTabIpcEvent,
  BG_ADD_TAB,
  BG_NEXT_TAB,
  BG_PREV_TAB,
  BG_REMOVE_CURRENT_TAB,
  FgShowTabIpcEvent,
  FG_SHOW_TAB,
  BG_UPDATE_TAB_TITLE,
  BgUpdateTabTitleIpcEvent,
} from '../../../ipc';
import { ElectronService } from '../electron';
import { TabsStore } from './tabs-store.service';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  constructor(
    private readonly electronService: ElectronService,
    private readonly tabsStore: TabsStore,
  ) {}

  public initIpcEvents(): void {
    this.electronService.on<BgAddTabIpcEvent>(BG_ADD_TAB, (payload) => {
      this.tabsStore.addTab(payload);
      this.sendShowTabEvent(payload.id);
    });

    this.electronService.on(BG_NEXT_TAB, () => {
      const nextTabId = this.tabsStore.nextTab();
      this.sendShowTabEvent(nextTabId);
    });

    this.electronService.on(BG_PREV_TAB, () => {
      const previousTabId = this.tabsStore.previousTab();
      this.sendShowTabEvent(previousTabId);
    });

    this.electronService.on(BG_REMOVE_CURRENT_TAB, () => {
      const newActiveTabId = this.tabsStore.removeCurrentTab();
      this.sendShowTabEvent(newActiveTabId);
    });

    this.electronService.on<BgUpdateTabTitleIpcEvent>(
      BG_UPDATE_TAB_TITLE,
      (payload) => {
        this.tabsStore.setTabTitle(payload.id, payload.title);
      },
    );
  }

  public addTab(): void {
    this.electronService.invoke(FG_ADD_TAB);
  }

  public removeTab(id: string): void {
    const newActiveTabId = this.tabsStore.removeTab(id);

    this.electronService.invoke<FgRemoveTabIpcEvent>(FG_REMOVE_TAB, { id });
    this.sendShowTabEvent(newActiveTabId);
  }

  public showTab(id: string): void {
    this.tabsStore.setActiveTab(id);
    this.sendShowTabEvent(id);
  }

  private sendShowTabEvent(id: string): void {
    this.electronService.invoke<FgShowTabIpcEvent>(FG_SHOW_TAB, { id });
  }
}
