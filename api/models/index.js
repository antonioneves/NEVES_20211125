const Sequelize = require("sequelize");

const sequelize = require("../config/sequelize");

const Video = require("./video");
const Category = require("./category");

const video = Video(sequelize, Sequelize.DataTypes);
const category = Category(sequelize, Sequelize.DataTypes);

video.belongsTo(category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
category.hasMany(video);

const db = { video, category, sequelize };

module.exports = db;
