/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('max_requirement', {
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
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    requirement: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'max_requirement'
  });
};
