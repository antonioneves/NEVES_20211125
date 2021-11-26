const Sequelize = require("sequelize");

const sequelize = require("../config/sequelize");

const Video = require("./video");
const Category = require("./category");

const video = Video(sequelize, Sequelize.DataTypes);
const category = Category(sequelize, Sequelize.DataTypes);

const db = { video, category, sequelize };

module.exports = db;
