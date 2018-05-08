const Sequelize = require('sequelize');
const md5 = require('md5');
const connection = require('./dbConnection');
const userConfig = require('../../config/database').defaultUser;
const models = {
  user: connection.import('./define/user'),
  client: connection.import('./define/client_props'),
  curveI: connection.import('./define/curve_i'),
  curveP: connection.import('./define/curve_p'),
  curvePTotal: connection.import('./define/curve_p_total'),
  curveU: connection.import('./define/curve_u'),
  maxRequirement: connection.import('./define/max_requirement'),
  meterRecord: connection.import('./define/meter_record'),
  powerCut: connection.import('./define/power_cut_info'),
  weather: connection.import('./define/weather')
};

models.client.hasMany(models.curveI, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});
models.client.hasMany(models.curveP, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});
models.client.hasMany(models.curvePTotal, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});
models.client.hasMany(models.curveU, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});
models.client.hasMany(models.maxRequirement, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});
models.client.hasMany(models.meterRecord, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});
models.client.hasMany(models.powerCut, {foreignKey: 'collect_point_no', sourceKey: 'collect_point_no'});

connection.sync({force: false}).then(async () => {
  if ((await models.user.findAll()).length === 0) {
    models.user.create({
      username: userConfig.username,
      password: md5(userConfig.password)
    });
  }
});

models.sequelize = connection;
models.Sequelize = Sequelize;

module.exports = models;