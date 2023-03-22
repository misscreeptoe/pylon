export enum IpcEventType {
  openTab = 'open-tab',
  nextTab = 'next-tab',
  previousTab = 'previous-tab',
  closeCurrentTab = 'close-current-tab',
  addNewTab = 'add-new-tab',
}

export interface OpenTabIpcEvent {
  url?: string;
}
