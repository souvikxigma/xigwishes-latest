module.exports = (sequelize, Sequelize) => {
    const Festivalsubcategory = sequelize.define("festivalsubcategory", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    catId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '3',
    },
    festivalName:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    });
    return Festivalsubcategory;
  };