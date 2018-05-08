const Sequelize = require('sequelize');

const dbConfig = require('../../config/database');

module.exports = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  define: {
    timestamps: false
  },
  timezone: '+08:00'
});