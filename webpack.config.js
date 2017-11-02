'use strict';

let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let TransferWebpackPlugin = require('transfer-webpack-plugin');
let SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const config = {
  entry: {
    main: [
      './src/app/app.js',
    ],
  },
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, 'public/'),
    filename: 'static/app.js',
  },
  plugins: [
    new TransferWebpackPlugin([
      { from: 'www' },
    ], path.resolve(__dirname, 'src')),
    new ExtractTextPlugin('/static/css/bundle-styles.css'),
  ],
  resolve: { 
    extensions: ['.js', '.jsx','.css'], 
  },
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
