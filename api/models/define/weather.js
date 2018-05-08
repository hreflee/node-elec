/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('weather', {
    RHU: {
      type: "DOUBLE",
      allowNull: true
    },
    TA: {
      type: "DOUBLE",
      allowNull: true
    },
    TEM: {
      type: "DOUBLE",
      allowNull: true
    },
    WIN: {
      type: "DOUBLE",
      allowNull: true
    },
    season: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    station_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'weather'
  });
};
