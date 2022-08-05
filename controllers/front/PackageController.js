const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) 

async function index(req, res) {
//   var userId = req.id;
//   const usecontactsr = await Models.Contact.findAll({where:{userId:userId}});
//   if (usecontactsr) {
//     return res.render('front/pages/Contact/contactlist', {
//       page_name: 'contact',
//       data: usecontactsr,
//     });
//   }

    return res.render('front/pages/Package/package', {
        page_name: 'package',
        key: process.env.STRIPE_PUBLISH_KEY,
        amount: 400000
        // data: usecontactsr,
    });
}

async function packagePayment(req,res){
    let userId = req.id;
    const userInfo = await Models.User.findOne({where:{id:userId}});
    var customerId;
    if(!userInfo.stripeCustomerid){
        
        var customer = await stripe.customers.create({
            email: req.body.stripeEmail, 
            source: req.body.stripeToken,
            name: 'XigWishes', 
        });
         customerId = customer.id;
         await userInfo.update({stripeCustomerid: customerId});
    }else{
        customerId = userInfo.stripeCustomerid;
    }
    
    const charges = await stripe.charges.create({
        amount: 400000,    // Charing Rs 25 
        description: `Xigwishes Yearly subscription user id : ${userId}`, 
        currency: 'INR', 
        customer: customerId
    });

    if(charges.status == 'succeeded'){
       // res.send("Success")
        //db insert//

        const newPayment = {
            userId: userId,
            customerId: charges.customer,
            amount: charges.amount,
            paymentStatus: charges.status,
            paymentMethod: charges.payment_method,
            receiptEmail: charges.receipt_email,
            response: JSON.stringify(charges),
          };
          var paymentCreate = await Models.Payment.create(newPayment);
          if(paymentCreate){
            req.flash('success', 'Subscription added successfully');
            // Toastify({text: 'Subscription added successfully',duration: 3000,style: {
            //     background: "linear-gradient(to right, #00b09b, #96c93d)",
            // },}).showToast();  
            return res.redirect('/package');
          }else{
            req.flash('error', 'Subscription not added successfully');
            return res.redirect('/package');
          }
          

        /////////////
    }else if(charges.status == 'failed'){
        req.flash('error', 'Subscription failed');
        return res.redirect('/package');
    }else{
        req.flash('error', 'Subscription Pending');
        return res.redirect('/package');
    }
}



module.exports = {
    index: index,
    packagePayment:packagePayment,
};