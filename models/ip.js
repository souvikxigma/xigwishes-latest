module.exports = (sequelize, Sequelize) => {
  const Ip = sequelize.define("ips", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ip: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Ip;
};