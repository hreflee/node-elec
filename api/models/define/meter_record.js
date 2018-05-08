/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('meter_record', {
    collect_point_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    client_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    asset_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    data_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    record_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    jian: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    feng: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ping: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    gu: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    valid: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'meter_record'
  });
};
