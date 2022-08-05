module.exports = (sequelize, Sequelize) => {
    const Subcategory = sequelize.define("subcategorys", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    subcategoryUniqueCode:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    categoryId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    festivalSubCategoryId:{
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    subcategoryTitle: {
        type: Sequelize.STRING,
        allowNull: true
    },
    subcategoryImage: {
        type: Sequelize.STRING,
        allowNull: true
    },

    });
    return Subcategory;
  };