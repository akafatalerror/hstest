'use strict';
const {
  Model
} = require('sequelize');
const {UserRoles} = require("../lib/types");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM(UserRoles.ROLE_USER, UserRoles.ROLE_ADMIN),
    token: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};