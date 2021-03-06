const path = require('path');

module.exports = {
  entry:'./client/admin.js',
  output: {
    path:path.resolve('dist'),
    filename:'admin_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
} 
