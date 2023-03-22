import { Injectable } from '@angular/core';
import { ImmutableArray } from '../../utils';
import { Store } from './store.service';

export interface CreateTab {
  url?: string;
  title?: string;
}

export interface Tab {
  id: number;
  url: string | null;
  title: string | null;
}

export type TabState = {
  active: number;
  tabs: ImmutableArray<Tab>;
};

const INITIAL_STATE: TabState = {
  active: 0,
  tabs: new ImmutableArray(),
};

@Injectable({
  providedIn: 'root',
})
export class TabsStore extends Store<TabState> {
  public tabs$ = this.select(({ tabs }) => tabs);
  public activeTab$ = this.select(({ active }) => active);

  private previousTabId = 0;

  constructor() {
    super(INITIAL_STATE);

    this.addTab();
  }

  public addTab(createTab: CreateTab = {}): void {
    this.setState(({ tabs }) => {
      const currentTab = this.getCurrentTab();
      const currentTabIndex = this.getCurrentTabIndex();

      if (!currentTab?.url && createTab?.url) {
        return {
          tabs: tabs.replaceByIndex(currentTabIndex, {
            ...currentTab,
            ...createTab,
          }),
        };
      }

      const id = this.previousTabId++;

      return {
        active: id,
        tabs: tabs.push({
          id,
          url: createTab.url ?? null,
          title: createTab.title ?? 'New Tab',
        }),
      };
    });
  }

  public setActiveTab(active: number): void {
    this.setState(() => ({
      active,
    }));
  }

  public nextTab(): void {
    let nextTabIndex = this.getCurrentTabIndex() + 1;
    if (nextTabIndex >= this.state.tabs.length) {
      nextTabIndex = 0;
    }
    const nextTabId = this.state.tabs.get(nextTabIndex).id;

    this.setActiveTab(nextTabId);
  }

  public previousTab(): void {
    let previousTabIndex = this.getCurrentTabIndex() - 1;
    if (previousTabIndex < 0) {
      previousTabIndex = this.state.tabs.length - 1;
    }
    const previousTabId = this.state.tabs.get(previousTabIndex).id;

    this.setActiveTab(previousTabId);
  }

  public removeTab(tab: Tab): void {
    if (this.state.tabs.length <= 1) {
      return;
    }

    this.setState(({ tabs }) => {
      const indexToRemove = tabs.findIndex(({ id }) => id === tab.id);

      const newActiveTab =
        indexToRemove === 0
          ? tabs.get(1)
          : tabs.get(indexToRemove - 1) ?? tabs.get(0);

      return {
        active: newActiveTab.id,
        tabs: tabs.removeByIndex(indexToRemove),
      };
    });
  }

  public removeCurrentTab(): void {
    const currentTab = this.getCurrentTab();
    this.removeTab(currentTab);
  }

  private getCurrentTabIndex(): number {
    return this.state.tabs.findIndex((tab) => tab.id === this.state.active);
  }

  private getCurrentTab(): Tab {
    return this.state.tabs.find((tab) => tab.id === this.state.active);
  }
}
