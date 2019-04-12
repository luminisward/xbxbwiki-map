const devMw = 'http://192.168.1.18'

module.exports = {
  botAccount: {
    username: 'Monado',
    password: ''
  },
  devMwHost: devMw,
  proxyTable: {
    '/': devMw
  },
  depolyTable: {
    'xb2map.js': 'Gadget:Xb2map.js',
    'collection.js': 'Gadget:Xb2mapCollection.js',
    'tbox.js': 'Gadget:Xb2mapTbox.js',
    'collection~tbox.css': 'Gadget:Xb2map.css'
  }
}
