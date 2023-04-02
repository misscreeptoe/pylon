import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Tab } from '../model';

export interface TabState {
  currentTabId: string | null;
  tabs: Tab[];
}

export interface TabActions {
  openNewTab: (id: string) => void;
  switchToTab: (id: string) => void;
  switchToPreviousTab: () => void;
  switchToNextTab: () => void;
  closeTab: (id: string) => void;
  closeCurrentTab: () => void;
  setTabTitle: (id: string, title: string) => void;
}

function getTabIndex(tabs: Tab[], id: string): number {
  return tabs.findIndex(tab => tab.id === id);
}

export const useTabStore = create(
  immer<TabState & TabActions>(set => ({
    currentTabId: null,
    tabs: [],

    /**
     * Triggered by the UI.
     * Should send an event to the main process to sync.
     */
    openNewTab: (id: string) =>
      set(state => {
        state.tabs.push({
          id,
          title: 'New Tab',
        });

        state.currentTabId = id;
        window.rendererAPI.switchToTab(state.currentTabId);
      }),

    /**
     * Triggered by the UI.
     * Should send an event to the main process to sync.
     */
    switchToTab: (id: string) =>
      set(state => {
        state.currentTabId = id;
        window.rendererAPI.switchToTab(state.currentTabId);
      }),

    /**
     * Triggered by the main process on keyboard input.
     * Should send an event to the main process to sync.
     */
    switchToNextTab: () =>
      set(state => {
        if (!state.currentTabId) {
          return;
        }

        let nextTabIndex = getTabIndex(state.tabs, state.currentTabId) + 1;
        if (nextTabIndex >= state.tabs.length) {
          nextTabIndex = 0;
        }

        state.currentTabId = state.tabs[nextTabIndex].id;
        window.rendererAPI.switchToTab(state.currentTabId);
      }),

    /**
     * Triggered by the main process on keyboard input.
     * Should send an event to the main process to sync.
     */
    switchToPreviousTab: () =>
      set(state => {
        if (!state.currentTabId) {
          return;
        }

        let previousTabIndex = getTabIndex(state.tabs, state.currentTabId) - 1;
        if (previousTabIndex < 0) {
          previousTabIndex = state.tabs.length - 1;
        }

        state.currentTabId = state.tabs[previousTabIndex].id;
        window.rendererAPI.switchToTab(state.currentTabId);
      }),

    /**
     * Triggered by the UI.
     * Should send an event to the main process to sync.
     */
    closeTab: (id: string) =>
      set(state => {
        if (state.tabs.length <= 1) {
          return;
        }

        const indexToRemove = getTabIndex(state.tabs, id);
        const tabToRemove = state.tabs[indexToRemove];

        if (tabToRemove.id === state.currentTabId) {
          const newActiveTab =
            indexToRemove === 0
              ? state.tabs[1]
              : state.tabs[indexToRemove - 1] ?? state.tabs[0];

          state.currentTabId = newActiveTab.id;
          window.rendererAPI.switchToTab(state.currentTabId);
        }

        state.tabs.splice(indexToRemove, 1);
        window.rendererAPI.closeTab(tabToRemove.id);
      }),

    /**
     * Triggered by the main process on keyboard input.
     * Should not trigger any events.
     */
    closeCurrentTab: () =>
      set(state => {
        if (!state.currentTabId || state.tabs.length <= 1) {
          return;
        }

        const indexToRemove = getTabIndex(state.tabs, state.currentTabId);
        const newActiveTab =
          indexToRemove === 0
            ? state.tabs[1]
            : state.tabs[indexToRemove - 1] ?? state.tabs[0];

        state.tabs.splice(indexToRemove, 1);

        state.currentTabId = newActiveTab.id;
        window.rendererAPI.switchToTab(state.currentTabId);
      }),

    /**
     * Triggered by the main process on navigation.
     * Should not trigger any events.
     */
    setTabTitle: (id: string, title: string) =>
      set(state => {
        const tabIndex = getTabIndex(state.tabs, id);
        state.tabs[tabIndex].title = title;
      }),
  })),
);
