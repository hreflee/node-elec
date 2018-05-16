module.exports = {
  publicApis: ['/api/user/login', '/api/user/checkLogin', '/api/user/logout'],
  rpcPort: 21029,
  bestItemsDeltasPath: ({
    development: 'G:\\hflee\\electricity\\model\\best_items_deltas.json',
    production: '/usr/electricity/model/best_items_deltas.json'
  })[process.env.NODE_ENV || 'production']
}