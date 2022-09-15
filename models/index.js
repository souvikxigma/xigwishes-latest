const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging:false
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./user.js")(sequelize, Sequelize);
db.Payment = require("./payment.js")(sequelize, Sequelize);
db.Package = require("./package.js")(sequelize, Sequelize);
db.Contact = require("./contact.js")(sequelize, Sequelize);
db.Birthday = require("./birthday.js")(sequelize, Sequelize);
db.Anniversary = require("./anniversary.js")(sequelize, Sequelize);
db.Theme = require("./theme.js")(sequelize, Sequelize);
db.Admin = require("./admin.js")(sequelize, Sequelize);
db.Category = require("./category.js")(sequelize, Sequelize);
db.Subcategory = require("./subcategory.js")(sequelize, Sequelize);
db.Festivalsubcategory = require("./festivalsubcategory")(sequelize, Sequelize);
db.Cms = require("./cms")(sequelize, Sequelize);
db.Testimonial = require("./testimonial")(sequelize, Sequelize);
db.Qna = require("./qna")(sequelize, Sequelize);
db.Feature = require("./feature")(sequelize, Sequelize);
db.Slider = require("./slider")(sequelize, Sequelize);
db.Design = require("./design")(sequelize, Sequelize);
db.Howwork = require("./howwork")(sequelize, Sequelize);
db.Ip = require("./ip")(sequelize, Sequelize);
db.Company = require("./company")(sequelize, Sequelize);
db.Contactus = require("./contactus")(sequelize, Sequelize);

//category and subcategory relationship ////

db.Category.hasMany(db.Subcategory,{foreignKey: {
  name: 'categoryId', targetKey: 'id',
  // as: "gh"
}})
db.Subcategory.belongsTo(db.Category,{foreignKey: {
  name: 'categoryId'
}})
//////////////////

db.Category.hasMany(db.Festivalsubcategory,{foreignKey: {
  name: 'catId', targetKey: 'id',
  // as: "gh"
}})
db.Festivalsubcategory.belongsTo(db.Category,{foreignKey: {
  name: 'catId'
}})

db.Festivalsubcategory.hasMany(db.Subcategory,{foreignKey: {
  name: 'festivalSubCategoryId', targetKey: 'id',
  // as: "gh"
}})

db.Subcategory.belongsTo(db.Festivalsubcategory,{foreignKey: {
  name: 'festivalSubCategoryId'
}})

db.Payment.belongsTo(db.Package,{foreignKey: {
  name: 'packageId'
}})

db.Package.hasMany(db.Payment,{foreignKey: {
  name: 'packageId', targetKey: 'id',
  // as: "gh"
}})



//category and subcategory relationship ////


module.exports = db;