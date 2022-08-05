module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define("payments", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      packageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      customerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiptEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      response: {
        type: Sequelize.TEXT,
        allowNull: true,
      }, 
      
    });
    return Payment;
  };