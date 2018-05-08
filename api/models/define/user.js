/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: DataTypes.STRING(255),
    password: DataTypes.STRING(255)
  }, {
    tableName: 'user',
    timestamps: true
  });
};
