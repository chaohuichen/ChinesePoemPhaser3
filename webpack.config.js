'use strict';
const isDev = process.env.NODE_ENV === 'development';
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.js',

  // devServer: {
  //   contentBase: './public',
  //   inline: true,
  //   hot: true
  // },
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: [/\.vert$/, /\.frag$/],
        exclude: /node_modules/,
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ]
};
