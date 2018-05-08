/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('curve_p_total', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    total: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'curve_p_total'
  });
};
