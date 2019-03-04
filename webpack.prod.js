const config = require('./webpack.dev')

config.mode = 'production'
config.externals = {
  jquery: 'jQuery'
}

module.exports = config
