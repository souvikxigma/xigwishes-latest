module.exports = (sequelize, Sequelize) => {
  const Testimonial = sequelize.define("testimonials", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      values: ['Y', 'N'],
      defaultValue: 'Y',
    },
    delflag: {
      type: Sequelize.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N',
    }
  });
  return Testimonial;
};