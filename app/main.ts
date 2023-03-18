import { app, BrowserWindow, screen, protocol } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');

function createWindow(): void {
  const size = screen.getPrimaryDisplay().workAreaSize;

  let browserWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });

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
    (_details, callback) => {
      // [TODO] - detect URLs meant for the IC

      // replace URL protocol
      // const redirectURL = details.url.replace(/^https?:\/\//, 'icp:');

      // redirect to the ICP protocol
      // callback({
      //   redirectURL,
      // });

      // allow non-IC requests through as normal
      callback({});
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
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'icp',
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true,
        bypassCSP: true,
      },
    },
  ]);

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    protocol.registerStreamProtocol('icp', async (protocolRequest, respond) => {
      // [TODO] - fetch requested asset
      console.log('ICP request', protocolRequest);

      // [TODO] - certify asset

      return respond({});
    });

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
