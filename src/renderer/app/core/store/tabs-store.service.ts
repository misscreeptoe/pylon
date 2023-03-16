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
      const id = this.previousTabId++;

      return {
        active: id,
        tabs: tabs.push({
          id,
          url: createTab.url ?? null,
          title: createTab.title ?? 'Directory',
        }),
      };
    });
  }

  public setActiveTab(active: number): void {
    this.setState(() => ({
      active,
    }));
  }

  public removeTab(tab: Tab): void {
    this.setState(({ tabs }) => {
      const indexToRemove = tabs.findIndex(({ id }) => id === tab.id);
      const newActiveTab = tabs.get(indexToRemove - 1) ?? tabs.get(0);

      return {
        active: newActiveTab.id,
        tabs: tabs.removeByIndex(indexToRemove),
      };
    });
  }
}
