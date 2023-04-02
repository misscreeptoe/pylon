import { nativeTheme } from 'electron';
import { uuid } from '../util';
import { AppWindow } from './app-window';

export class AppWindowManager {
  private appWindows: Record<string, AppWindow> = {};

  constructor() {
    nativeTheme.on('updated', this.onThemeUpdated.bind(this));
  }

  public addNewWindow(): void {
    const id = uuid();
    const appWindow = new AppWindow(id);

    appWindow.once('closed', () => this.onAppWindowClosed(id));

    this.appWindows[id] = appWindow;
  }

  public getNumWindows(): number {
    return Object.keys(this.appWindows).length;
  }

  private onAppWindowClosed(id: string): void {
    delete this.appWindows[id];
  }

  private onThemeUpdated(): void {
    for (const [_id, appWindow] of Object.entries(this.appWindows)) {
      appWindow.updateTheme();
    }
  }
}
