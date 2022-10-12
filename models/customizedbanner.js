module.exports = (sequelize, Sequelize) => {
    const Customizedbanner = sequelize.define("customizedbanner", {
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
      email: {
        type: Sequelize.STRING,  
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING,  
        allowNull: false
      },
      requirement:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      requirementImage:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      delflag:{
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        defaultValue: 'N',
      }
    });
    return Customizedbanner;
  };