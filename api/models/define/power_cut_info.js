/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('power_cut_info', {
    date_time: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    asset_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    collect_point_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    valid_method: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'power_cut_info'
  });
};
