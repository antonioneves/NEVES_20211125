const Sequelize = require("sequelize");
const configDatabase = require("./config");

const sequelize = new Sequelize(configDatabase);

module.exports = sequelize;
