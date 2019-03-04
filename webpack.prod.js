const config = require('./webpack.dev')

config.mode = 'production'
console.log(process.env.NODE_ENV)

module.exports = config
