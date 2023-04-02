import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import {
  MainEventType,
  MainOpenNewTab,
  MainSetTabTitle,
  RendererCloseTab,
  RendererEventType,
  RendererSwitchToTab,
  IpcListener,
  IpcUnsubscribe,
} from '../ipc';

function sendRendererEvent<U = void>(
  type: RendererEventType,
  payload?: U,
): void {
  ipcRenderer.send(type, payload);
}

contextBridge.exposeInMainWorld('rendererAPI', {
  loaded(): void {
    sendRendererEvent(RendererEventType.Loaded);
  },

  openNewTab(): void {
    sendRendererEvent(RendererEventType.OpenNewTab);
  },

  closeTab(id: string): void {
    sendRendererEvent<RendererCloseTab>(RendererEventType.CloseTab, {
      id,
    });
  },

  switchToTab(id: string): void {
    sendRendererEvent<RendererSwitchToTab>(RendererEventType.SwitchToTab, {
      id,
    });
  },

  currentTabReload(): void {
    sendRendererEvent(RendererEventType.CurrentTabReload);
  },

  currentTabGoBack(): void {
    sendRendererEvent(RendererEventType.CurrentTabGoBack);
  },

  currentTabGoForward(): void {
    sendRendererEvent(RendererEventType.CurrentTabGoForward);
  },
});

function subscribeToMainEvent<U>(
  type: MainEventType,
  listener: IpcListener<U>,
): IpcUnsubscribe {
  const wrappedListener = (_event: IpcRendererEvent, payload: U) =>
    listener(payload);

  ipcRenderer.addListener(type, wrappedListener);

  return () => {
    ipcRenderer.removeListener(type, wrappedListener);
  };
}

contextBridge.exposeInMainWorld('mainAPI', {
  onSwitchToNextTab(listener: IpcListener): IpcUnsubscribe {
    return subscribeToMainEvent(MainEventType.SwitchToNextTab, listener);
  },

  onSwitchToPreviousTab(listener: IpcListener): IpcUnsubscribe {
    return subscribeToMainEvent(MainEventType.SwitchToPreviousTab, listener);
  },

  onOpenNewTab(listener: IpcListener<MainOpenNewTab>): IpcUnsubscribe {
    return subscribeToMainEvent(MainEventType.OpenNewTab, listener);
  },

  onCloseCurrentTab(listener: IpcListener): IpcUnsubscribe {
    return subscribeToMainEvent(MainEventType.CloseCurrentTab, listener);
  },

  onSetTabTitle(listener: IpcListener<MainSetTabTitle>): IpcUnsubscribe {
    return subscribeToMainEvent(MainEventType.SetTabTitle, listener);
  },
});
