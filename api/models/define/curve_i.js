/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('curve_i', {
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
    A: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    B: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    C: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'curve_i',
    timestamps: false
  });
};
