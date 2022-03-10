const path = require('path');
const webpack = require('webpack');

module.exports = {
  configureWebpack: { 
    resolve: {
      mainFields: ['browser', 'module', 'main'],
      fallback: {
        "assert": false,
        "buffer": false,
        "crypto": false,
        "fs": false,
        "http": false,
        "https": false,
        "net": false,
        "os": false,
        "path": false,
        "stream": false,
        "stream-http": false,
        "tls": false,
        "url": false,
        "util": require.resolve("util/"),
        "zlib": false,
        'child_process': false,
      },
    },
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
          process: 'process/browser',
      }),
  ],
  },
};