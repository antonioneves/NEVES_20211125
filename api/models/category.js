const category = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "category",
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Video, {
      foreignKey: "categoryId",
      as: "video",
    });
  };

  return Category;
};

module.exports = category;
