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
        allowNull: true,
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
        allowNull: true,
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
      birthdayThemes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      anniversaryThemes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      holidayThemes: {
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
      authprovider:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      authid:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      service1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service3: {
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
      emailVerification: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0',
      },
      delflag:{
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        defaultValue: 'N',
      },
    });
    return User;
  };