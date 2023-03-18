import { BrowserWindow, app, protocol } from 'electron';
import {
  icProtocolScheme,
  registerIcMetadataProtocol,
  registerIcProtocol,
} from '../protocols';
import { AppWindow } from './app-window';

export class App {
  private window: AppWindow;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    protocol.registerSchemesAsPrivileged([icProtocolScheme]);

    await app.whenReady();

    registerIcProtocol();
    registerIcMetadataProtocol();

    this.window = new AppWindow();

    app.on('activate', this.onAppActivate.bind(this));
    app.on('window-all-closed', this.onAllWindowClosed.bind(this));
  }

  private onAppActivate(): void {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this.window = new AppWindow();
    }
  }

  private onAllWindowClosed(): void {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}
