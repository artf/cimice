var path = require('path');
var webpack = require('webpack');
var name = 'cimice';
var env = process.env.WEBPACK_ENV;
var plugins = [];

if(env !== 'dev'){
  plugins.push(new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } }));
}

module.exports = {
  entry: './src/main',
  output: {
      filename: './dist/' + name + '.min.js',
      library: name,
      libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: /src/,
        query: {
          presets: ['es2015']
        }
      },
    ],
  },
  plugins: plugins
};