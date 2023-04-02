export enum MainEventType {
  SwitchToNextTab = `main-switch-to-next-tab`,
  SwitchToPreviousTab = `main-switch-to-previous-tab`,
  OpenNewTab = `main-open-new-tab`,
  CloseCurrentTab = `main-close-current-tab`,
  SetTabTitle = `main-set-tab-title`,
}

export interface MainOpenNewTab {
  id: string;
}

export interface MainSetTabTitle {
  id: string;
  title: string;
}

export type MainEvent = MainOpenNewTab | MainSetTabTitle;
