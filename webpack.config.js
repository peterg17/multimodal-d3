const path = require('path');

module.exports = {
  entry: {
    force: './src/force.js',
    scatter: './src/scatter.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader'
              ]
          }
      ]
  }
};