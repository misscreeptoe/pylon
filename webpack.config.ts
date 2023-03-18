import {
  CustomWebpackBrowserSchema,
  TargetOptions,
} from '@angular-builders/custom-webpack';
import * as NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import * as webpack from 'webpack';

export default (
  config: webpack.Configuration,
  options: CustomWebpackBrowserSchema,
  _targetOptions: TargetOptions,
) => {
  config.target = 'electron-renderer';

  if (options.fileReplacements) {
    for (const fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      const fileReplacementParts = fileReplacement.with.split('.');
      if (
        fileReplacementParts.length > 1 &&
        ['web'].indexOf(fileReplacementParts[1]) >= 0
      ) {
        config.target = 'web';
      }
      break;
    }
  }

  config.plugins = [
    ...config.plugins,
    new NodePolyfillPlugin({
      excludeAliases: ['console'],
    }),
  ];

  return config;
};
