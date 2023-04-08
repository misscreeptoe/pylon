import type { ForgeConfig } from '@electron-forge/shared-types';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { DeterministicZipMaker } from 'deterministic-electron-forge-zip-maker';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [new DeterministicZipMaker({}, ['linux', 'win32', 'darwin', 'mas'])],
  plugins: [
    {
      name: '@electron-forge/plugin-electronegativity',
      config: {},
    },
    new WebpackPlugin({
      devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data: ic-metadata:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            name: 'main_window',
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            preload: {
              js: './src/renderer/preload.ts',
            },
          },
          {
            name: 'new_tab',
            html: './src/new-tab/index.html',
            js: './src/new-tab/index.tsx',
          },
        ],
      },
    }),
  ],
};

export default config;
