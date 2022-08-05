module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
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
      },
      forgetPassword: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      emailToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyLogo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      homeAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      officeAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      themes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      defaultBirthdayTheme:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      defaultAnniversaryTheme:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      defaultText:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      stripeCustomerid:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      accountExpireDate: {
        allowNull: true,
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
      },
      accountActiveStatus: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '1',
      },
      delflag:{
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        defaultValue: 'N',
      },
    });
    return User;
  };