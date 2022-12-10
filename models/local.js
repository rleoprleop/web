'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class local extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      local.belongsTo(models.user, { foreignKey: "user_id", targetKey: "user_id" })
    }
  }
  local.init({
    user_id: DataTypes.STRING,
    section1: DataTypes.STRING,
    section2: DataTypes.STRING,
    section3: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'local',
  });
  return local;
};