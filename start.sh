#!/bin/bash
npm install --save-dev sequelize-clinpm install --save-dev sequelize-cli
sequelize db:seed --seed=seeders/20211128053654-add_users.js

node index
