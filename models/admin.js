module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admins", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },trialDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '7'
      },
    });
    return Admin;
  };