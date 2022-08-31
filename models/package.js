module.exports = (sequelize, Sequelize) => {
  const Package = sequelize.define('packages', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    validityDays: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    currency: {
        type: Sequelize.STRING,
        allowNull: false,
    },
  });
  return Package;
};
