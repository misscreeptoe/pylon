import { app, protocol } from 'electron';
import { mkdir } from 'node:fs/promises';
import {
  icMetadataProtocolSchema,
  icProtocolScheme,
  registerIcMetadataProtocol,
  registerIcProtocol,
} from '../protocols';
import { AppWindowManager } from './app-window-manager';

export class App {
  private readonly appWindowManager: AppWindowManager;

  constructor() {
    this.appWindowManager = new AppWindowManager();

    this.init();
  }

  private async init(): Promise<void> {
    if (require('electron-squirrel-startup')) {
      app.quit();
    }

    protocol.registerSchemesAsPrivileged([
      icProtocolScheme,
      icMetadataProtocolSchema,
    ]);

    await this.setAppSessionDirectory();
    await app.whenReady();

    registerIcProtocol();
    registerIcMetadataProtocol();

    this.appWindowManager.addNewWindow();

    app.on('activate', this.onAppActivate.bind(this));
    app.on('window-all-closed', this.onAllWindowClosed.bind(this));
  }

  private async setAppSessionDirectory(): Promise<void> {
    const currentSessionDirectory = app.getPath('sessionData');
    const userDirectory = app.getPath('userData');

    if (currentSessionDirectory === userDirectory) {
      const newSessionDirectory = `${userDirectory}/session`;
      await mkdir(newSessionDirectory, { recursive: true });

      app.setPath('sessionData', newSessionDirectory);
    }
  }

  private onAppActivate(): void {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (this.appWindowManager.getNumWindows() === 0) {
      this.appWindowManager.addNewWindow();
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
