const devMw = ''

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
    'enemy.js': 'Gadget:Xb2mapEnemy.js',
    'xb2map.css': 'Gadget:Xb2map.css'
  }
}
