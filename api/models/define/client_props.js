/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client_props', {
    client_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_addr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    asset_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    measure_point_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    measure_point_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meter_model: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mail_addr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    data_query_no: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    CT: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PT: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bill_flag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    switch_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    line_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    area_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    general_multiplying_power: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    measure_point_status: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    collect_point_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'client_props'
  });
};
