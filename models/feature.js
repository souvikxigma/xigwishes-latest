module.exports = (sequelize, Sequelize) => {
  const Feature = sequelize.define("features", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      values: ['Y', 'N'],
      defaultValue: 'Y',
    },
    delflag: {
      type: Sequelize.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N',
    }
  });
  return Feature;
};