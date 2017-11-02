'use strict';

let webpack = require('webpack');
let path = require('path');
let TransferWebpackPlugin = require('transfer-webpack-plugin');
let ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
let OfflinePlugin = require('offline-plugin');

const config = {
  // Entry points to the project
  entry: {
    main: [
      // only- means to only hot reload for successful updates
      'webpack/hot/only-dev-server',
      './src/app/app.js',
    ],
  },
  // Server Configuration options
  devServer: {
    historyApiFallback: true,
    contentBase: 'src/www', // Relative directory for base of server
    hot: true, // Live-reload
    inline: true,
    port: 3000, // Port Number
    host: 'localhost' // Change to '0.0.0.0' for external facing server
  },
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, 'build'), // Path of output file
    filename: 'app.js',
  },
  plugins: [
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Moves files
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'src')),
    new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'src/www/sw.js'),
        excludes: [
          '**/.*',
          '**/*.map',
          '*.html',
        ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              localIdentName: '[name]-[local]-[hash:base64:5]',
              discardComments: { removeAll: true },
            },
          },
          {
            loader: 'postcss-loader',
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
};

module.exports = config;
