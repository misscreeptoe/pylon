import { app, BrowserWindow, screen, protocol, nativeTheme } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';
import {
  getIcpProtocolRedirectUrl,
  icpProtocolScheme,
  registerIcpProtocol,
  shouldRedirectToIcpProtocol,
} from './icp-protocol';

global.fetch = fetch as any;

const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');

function createWindow(): void {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // [TODO] - Remove hard coded theme in production
  nativeTheme.themeSource = 'dark';
  const themingOptions: Electron.BrowserWindowConstructorOptions =
    nativeTheme.shouldUseDarkColors
      ? {
          backgroundColor: '#212529',
          titleBarOverlay: {
            color: '#212529',
            symbolColor: '#adb5bd',
          },
        }
      : {
          titleBarOverlay: {
            color: '#fff',
          },
        };

  let browserWindow = new BrowserWindow({
    ...themingOptions,
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    backgroundColor: '#212529',
    title: 'Pylon',
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  browserWindow.setMenuBarVisibility(false);
  nativeTheme.themeSource = 'dark';

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    browserWindow.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    browserWindow.loadURL(url.href);
  }

  browserWindow.webContents.session.webRequest.onBeforeRequest(
    {
      urls: ['http://*/*', 'https://*/*'],
    },
    (details, callback) => {
      if (shouldRedirectToIcpProtocol(details.url)) {
        const redirectURL = getIcpProtocolRedirectUrl(details.url);

        return callback({
          redirectURL,
        });
      }

      return callback({});
    },
  );

  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });
}

try {
  protocol.registerSchemesAsPrivileged([icpProtocolScheme]);

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    registerIcpProtocol();

    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    setTimeout(createWindow, 400);

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
