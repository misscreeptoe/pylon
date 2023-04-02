export enum RendererEventType {
  Loaded = `renderer-renderer-loaded`,
  OpenNewTab = `renderer-open-new-tab`,
  CloseTab = `renderer-close-tab`,
  SwitchToTab = `renderer-switch-to-tab`,
  CurrentTabReload = `renderer-current-tab-reload`,
  CurrentTabGoBack = `renderer-current-tab-go-back`,
  CurrentTabGoForward = `renderer-current-tab-go-forward`,
}

export interface RendererCloseTab {
  id: string;
}

export interface RendererSwitchToTab {
  id: string;
}

export type RendererEvent = RendererCloseTab | RendererSwitchToTab;
