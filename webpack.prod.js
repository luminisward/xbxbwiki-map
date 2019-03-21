const config = require('./webpack.dev')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

config.externals = {
  jquery: 'jQuery',
  leaflet: 'L'
}
config.entry = {
  collection: './src/build-entry/collection.js',
  tbox: './src/build-entry/tbox.js'
}
config.plugins.push(...[
  new UglifyJsPlugin({
    uglifyOptions: {
      mangle: true,
      ie8: true,
      output: {
        comments: false
      }
    }
  })
])

module.exports = config
