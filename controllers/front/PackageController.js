const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var {customDateAdd} = require('../../helpers/format');

async function index(req, res) {
  // const subscription = await stripe.subscriptions.retrieve('sub_1LcRJ9SETcggQixJksmoqqCC');
  // const updatedsub = await stripe.subscriptions.update('sub_1LcRJ9SETcggQixJksmoqqCC', {cancel_at_period_end: true});

  // console.log(updatedsub);

  // res.locals.boka = "gandu";


  var packageData = await Models.Package.findAll({
    order: [['amount', 'ASC']],
  });
  var UserInfo = await Models.User.findOne({ where: { id: req.id } });
  var PaymentInfo = await Models.Payment.findOne({
    where: { userId: req.id, paymentStatus: 'active',delflag: 'N' },
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
  // var pi = await stripe.products.list({});
  // var pl = await stripe.plans.list({})
  //console.log(req.body);
  //return false;
  let userId = req.id;
  var userPaymentInfo = await Models.Payment.findOne({where:{ [Op.and]: [{userId: userId}, {delflag: 'N'}]}});
  if(userPaymentInfo){
    req.flash('error', 'Allready Subscribed');
      return res.redirect('/package');
  }

  var interval ;
  var intervalCount = 0;
  const {packageId,productId,amount,currency,description,validityDays,stripeTokenType,stripeEmail} = req.body;
  if(validityDays == '30'){
    //interval = 'day';
    interval = 'day';
    intervalCount = 30;
  }else if(validityDays == '365'){
    //interval = 'year';
    interval = 'day';
    intervalCount = 365;
  }

  
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

  ///subscription//
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price_data: {
          currency: currency,
          product: productId,
          recurring: {interval: interval, interval_count: intervalCount},
          unit_amount: Number(amount),
        },
        quantity: 1,
      },
    ],
  });
  ///subscription//

// return res.send(subscription);


  if (subscription.id) {
    const newPayment = {
      userId: userId,
      customerId: subscription.customer,
      amount: amount,
      paymentStatus: subscription.status,
      paymentMethod: stripeTokenType,
      receiptEmail: stripeEmail,
      packageId: packageId,
      subscriptionId: subscription.id,
      paymentType: subscription.object,
      subscriptionType: intervalCount,
      response: JSON.stringify(subscription),
    };

    var date = new Date(); 
    var adddays = parseInt(validityDays);
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
  } 
  // else if (charges.status == 'failed') {
  //   req.flash('error', 'Subscription failed');
  //   return res.redirect('/package');
  // } 
  else {
    req.flash('error', 'Subscription failed');
    return res.redirect('/package');
  }
}


async function cancelSubscription(req,res){
  // var userId = req.id;
  // var paymentInfo = await Models.Payment.findOne({where:{userId: userId }});
  // if(paymentInfo && paymentInfo.subscriptionId){
  //   const updatedsub = await stripe.subscriptions.update(paymentInfo.subscriptionId, {cancel_at_period_end: true});

  //   return res.send(updatedsub);
  //   console.log(updatedsub);
  // }
  var userId = req.id;
  var userPaymentInfo = await Models.Payment.findOne({where:{ [Op.and]: [{userId: userId}, {delflag: 'N'}]}});
 
  if(!userPaymentInfo){
      req.flash('error', 'User does not have any package');
      return res.redirect('/package');
  }

  try {
    const deletedSubscription = await stripe.subscriptions.del(
      userPaymentInfo.subscriptionId
    );
    if(deletedSubscription.status == 'canceled'){

      await userPaymentInfo.update({ delflag: 'Y' });

      req.flash('success', 'Subscription canceled successfully');
      return res.redirect('/package');
    }else{
      req.flash('error', 'Subscription is not canceled');
      return res.redirect('/package');
    }

    //res.send({ subscription: deletedSubscription });
  } catch (error) {
   // return res.status(400).send({ error: { message: error.message } });
    req.flash('error', error);
    return res.redirect('/package');
  }

}

module.exports = {
  index: index,
  packagePayment: packagePayment,
  cancelSubscription: cancelSubscription,
};
