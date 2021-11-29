'use strict';

const bcrypt = require('bcryptjs');
const date = (new Date()).toISOString();

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {login: 'user', password:  bcrypt.hashSync('user', parseInt(process.env.SALT_ROUNDS)), role: 'user', id:1, token:'', createdAt: date, updatedAt: date},
      {login: 'admin', password:  bcrypt.hashSync('admin', parseInt(process.env.SALT_ROUNDS)), role: 'admin', id:2,  token:'', createdAt: date, updatedAt: date}
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
  }
};
