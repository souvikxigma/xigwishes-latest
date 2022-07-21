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
db.Contact = require("./contact.js")(sequelize, Sequelize);
db.Theme = require("./theme.js")(sequelize, Sequelize);
db.Admin = require("./admin.js")(sequelize, Sequelize);
module.exports = db;