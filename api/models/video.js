const video = (sequelize, DataTypes) => {
  const Video = sequelize.define("video", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail256: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    thumbnail128: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    thumbnail64: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Video;
};

module.exports = video;
