import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer, WebFrame } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private readonly ipcRenderer: IpcRenderer;
  private readonly webFrame: WebFrame;

  constructor(private readonly ngZone: NgZone) {
    const { ipcRenderer, webFrame } = window.require('electron');

    this.ipcRenderer = ipcRenderer;
    this.webFrame = webFrame;
  }

  public on<U>(eventType: string, handler: (payload: U) => void): void {
    this.ipcRenderer.on(eventType, (_event, payload: U) => {
      this.ngZone.run(() => {
        handler(payload);
      });
    });
  }

  public invoke<U>(eventType: string, payload?: U): void {
    this.ipcRenderer.invoke(eventType, payload);
  }
}
