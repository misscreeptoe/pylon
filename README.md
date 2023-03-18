# Pylon

A trustless Internet Computer gateway.

## Introduction

TODO...

## Development

- [Install NodeJS](https://nodejs.org/)
- [Install pnpm](https://pnpm.io/installation)
- [Install Pre-Commit](https://pre-commit.com/)
- [Install Commitizen](https://commitizen-tools.github.io/commitizen/)

Install Electron renderer process dependencies:

```bash
pnpm install
```

Install Angular CLI:

```bash
npm install -g @angular/cli
```

Install Electron main process dependencies:

```bash
cd app/
pnpm install
```

Why two package.json ? This project follow [Electron Builder two package.json structure](https://www.electron.build/tutorials/two-package-structure) in order to optimize final bundle and be still able to use Angular `ng add` feature.

## Commands

| Command                  | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `npm start`              | Run the dev server                                                                   |
| `npm run electron:local` | Builds your application and start electron locally                                   |
| `npm run electron:build` | Builds your application and creates an app consumable based on your operating system |

## Project structure

| Folder | Description                                      |
| ------ | ------------------------------------------------ |
| app    | Electron main process folder (NodeJS)            |
| src    | Electron renderer process folder (Web / Angular) |

## E2E Testing

E2E Test scripts can be found in `e2e` folder.

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run e2e` | Execute end to end tests |

Note: To make it work behind a proxy, you can add this proxy exception in your terminal
`export {no_proxy,NO_PROXY}="127.0.0.1,localhost"`

## Debug with VsCode

[VsCode](https://code.visualstudio.com/) debug configuration is available! In order to use it, you need the extension [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

Then set some breakpoints in your application's source code.

Finally from VsCode press **Ctrl+Shift+D** and select **Application Debug** and press **F5**.

Please note that Hot reload is only available in Renderer process.
