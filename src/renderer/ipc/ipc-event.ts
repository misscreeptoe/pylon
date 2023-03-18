export enum IpcEventType {
  openTab = 'open-tab',
}

export interface OpenTabIpcEvent {
  url?: string;
}
