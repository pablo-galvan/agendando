'use strict';

let webpack = require('webpack');
let path = require('path');
let TransferWebpackPlugin = require('transfer-webpack-plugin');
let SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
let CompressionPlugin = require('compression-webpack-plugin');
let OfflinePlugin = require('offline-plugin');
let ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const config = {
  entry: {
    main: [
      'babel-polyfill',
      './src/app/app.js',
    ],
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'public/'), // Path of output file
    filename: 'static/app.js',
    chunkFilename: 'node-static.js',
  },
  plugins: [
    new TransferWebpackPlugin([
      { from: 'www' },
    ], path.resolve(__dirname, 'src')),
    new OfflinePlugin({
      responseStrategy:'network-first',
      ServiceWorker: {
        minify: false,
        navigateFallbackURL: '/index.html'
      },
       dynamicCaches: [{
          match: '/(.+)',
          origin: /\api\//,
          responseStrategy: 'fastest'
        }]
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,
    }),
    new ExtractTextPlugin('/static/css/bundle-styles.css'),
    new ModernizrWebpackPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'node-static',
      filename: '/static/node-static.js',
      minChunks(module, count) {
        let context = module.context;
          return context && context.indexOf('node_modules') >= 0;
        },
      }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: true,
                localIdentName: '[hash:base64:5]',
                discardComments: { removeAll: true },
              },
            },
            {
              loader: 'postcss-loader',
            }
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ],
  },
};

module.exports = config;
