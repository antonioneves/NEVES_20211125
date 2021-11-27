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
      get() {
        return this.getDataValue('picture').toString('utf8');
      },
    },
    thumbnail128: {
      type: DataTypes.BLOB,
      allowNull: false,
      get() {
        return this.getDataValue('picture').toString('utf8');
      },
    },
    thumbnail64: {
      type: DataTypes.BLOB,
      allowNull: false,
      get() {
        return this.getDataValue('picture').toString('utf8');
      },
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
