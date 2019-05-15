const path = require('path');

module.exports = {
  entry: {
    force: './src/force.js',
    scatter: './src/scatter.js',
    click: './src/click-sim.js',
    scatterZoom: './src/scatter-zoom.js',
    scatterPan: './src/scatter-pan.js'
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