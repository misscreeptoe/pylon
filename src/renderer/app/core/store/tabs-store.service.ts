import { Injectable } from '@angular/core';
import { ImmutableArray } from '../../utils';
import { Store } from './store.service';

export interface CreateTab {
  id: string;
  url?: string;
  title?: string;
}

export interface Tab {
  id: string;
  url: string | null;
  title: string | null;
}

export type TabState = {
  active: string | null;
  tabs: ImmutableArray<Tab>;
};

const INITIAL_STATE: TabState = {
  active: null,
  tabs: new ImmutableArray(),
};

export interface TabStatus {
  [key: Tab['id']]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TabsStore extends Store<TabState> {
  public tabs$ = this.select(({ tabs }) => tabs);
  public activeTab$ = this.select(({ active }) => active);
  public tabStatus$ = this.select(({ active, tabs }) =>
    tabs.reduce<TabStatus>(
      (accum, item) => ({
        ...accum,
        [item.id]: item.id === active,
      }),
      {},
    ),
  );

  constructor() {
    super(INITIAL_STATE);
  }

  public addTab(createTab: CreateTab): void {
    this.setState(({ tabs }) => {
      const { id, url } = createTab;
      const currentTab = this.getCurrentTab();
      const currentTabIndex = this.getCurrentTabIndex();

      if (!currentTab?.url && url) {
        return {
          tabs: tabs.replaceByIndex(currentTabIndex, {
            ...currentTab,
            url,
          }),
        };
      }

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

  public setActiveTab(active: string): void {
    this.setState(() => ({
      active,
    }));
  }

  public setTabTitle(id: string, title: string): void {
    const tab = this.getTabById(id);
    const tabIndex = this.getTabIndexById(id);

    this.setState(({ tabs }) => ({
      tabs: tabs.replaceByIndex(tabIndex, {
        ...tab,
        title,
      }),
    }));
  }

  public nextTab(): string {
    let nextTabIndex = this.getCurrentTabIndex() + 1;
    if (nextTabIndex >= this.state.tabs.length) {
      nextTabIndex = 0;
    }
    const nextTabId = this.state.tabs.get(nextTabIndex).id;

    this.setActiveTab(nextTabId);
    return nextTabId;
  }

  public previousTab(): string {
    let previousTabIndex = this.getCurrentTabIndex() - 1;
    if (previousTabIndex < 0) {
      previousTabIndex = this.state.tabs.length - 1;
    }
    const previousTabId = this.state.tabs.get(previousTabIndex).id;

    this.setActiveTab(previousTabId);
    return previousTabId;
  }

  public removeTab(id: string): string {
    if (this.state.tabs.length <= 1) {
      return id;
    }

    const indexToRemove = this.state.tabs.findIndex((tab) => tab.id === id);
    const newActiveTab =
      indexToRemove === 0
        ? this.state.tabs.get(1)
        : this.state.tabs.get(indexToRemove - 1) ?? this.state.tabs.get(0);

    this.setState(({ tabs }) => ({
      active: newActiveTab.id,
      tabs: tabs.removeByIndex(indexToRemove),
    }));

    return newActiveTab.id;
  }

  public removeCurrentTab(): string {
    const currentTab = this.getCurrentTab();
    return this.removeTab(currentTab.id);
  }

  private getCurrentTabIndex(): number {
    return this.state.tabs.findIndex((tab) => tab.id === this.state.active);
  }

  private getCurrentTab(): Tab {
    return this.state.tabs.find((tab) => tab.id === this.state.active);
  }

  private getTabById(id: string): Tab {
    return this.state.tabs.find((tab) => tab.id === id);
  }

  private getTabIndexById(id: string): number {
    return this.state.tabs.findIndex((tab) => tab.id === id);
  }
}
