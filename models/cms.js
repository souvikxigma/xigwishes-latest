module.exports = (sequelize, Sequelize) => {
  const Cms = sequelize.define("cms", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
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
  return Cms;
};