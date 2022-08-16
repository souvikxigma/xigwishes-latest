module.exports = (sequelize, Sequelize) => {
    const Anniversary = sequelize.define("anniversarys", {
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
      brideName: {
        type: Sequelize.STRING,  
        allowNull: false
      },
      groomName: {
        type: Sequelize.STRING,  
        allowNull: false
      },
      anniversaryday: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      anniversaryPic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delflag:{
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        defaultValue: 'N',
      }
    });
    return Anniversary;
  };