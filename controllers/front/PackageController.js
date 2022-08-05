const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var {customDateAdd} = require('../../helpers/format');

async function index(req, res) {
  var packageData = await Models.Package.findAll({
    order: [['amount', 'ASC']],
  });
  var UserInfo = await Models.User.findOne({ where: { id: req.id } });
  var PaymentInfo = await Models.Payment.findOne({
    where: { userId: req.id, paymentStatus: 'succeeded' },
    order: [['createdAt', 'DESC']],
    include: [{
        model: Models.Package,
      }],
  });




  return res.render('front/pages/Package/package', {
    page_name: 'package',
    key: process.env.STRIPE_PUBLISH_KEY,
    packageData: packageData,
    UserInfo: UserInfo,
    PaymentInfo: PaymentInfo,
  });
}

async function packagePayment(req, res) {
  let userId = req.id;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  var customerId;
  if (!userInfo.stripeCustomerid) {
    var customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: 'XigWishes',
    });
    customerId = customer.id;
    await userInfo.update({ stripeCustomerid: customerId });
  } else {
    customerId = userInfo.stripeCustomerid;
  }

  const charges = await stripe.charges.create({
    amount: req.body.amount, 
    description: req.body.description,
    currency: req.body.currency,
    customer: customerId,
  });

  if (charges.status == 'succeeded') {
    const newPayment = {
      userId: userId,
      customerId: charges.customer,
      amount: charges.amount,
      paymentStatus: charges.status,
      paymentMethod: charges.payment_method,
      receiptEmail: charges.receipt_email,
      packageId: req.body.packageId,
      response: JSON.stringify(charges),
    };


    var date = new Date(); 
    var adddays = parseInt(req.body.validityDays);
    var accountExpireDate = customDateAdd(date,adddays)
    console.log('req.body.validityDays',adddays)
    console.log('accountExpireDate',accountExpireDate);


    var paymentCreate = await Models.Payment.create(newPayment);
    if (paymentCreate) {
      await userInfo.update({ accountActiveStatus: '1',accountExpireDate: accountExpireDate});
      req.flash('success', 'Subscription added successfully');
      return res.redirect('/package');
    } else {
      req.flash('error', 'Subscription not added successfully');
      return res.redirect('/package');
    }
  } else if (charges.status == 'failed') {
    req.flash('error', 'Subscription failed');
    return res.redirect('/package');
  } else {
    req.flash('error', 'Subscription Pending');
    return res.redirect('/package');
  }
}

module.exports = {
  index: index,
  packagePayment: packagePayment,
};
