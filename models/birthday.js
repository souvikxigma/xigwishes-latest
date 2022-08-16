module.exports = (sequelize, Sequelize) => {
    const Birthday = sequelize.define("birthdays", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,  
        allowNull: false
      },
      birthday: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['male', 'female','others'],
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contactPic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delflag:{
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        defaultValue: 'N',
      }
    });
    return Birthday;
  };