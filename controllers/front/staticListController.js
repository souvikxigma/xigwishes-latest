const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');

async function support(req, res) {
    var title = 'Support';
    var data = await Models.Cms.findOne({where:{type:'support',status:'Y'}});
    return res.render('front/pages/Others/support', {
        page_name: 'support',
        data:data,
        title:title
    });
}

async function termsCondition(req, res) { 
    var title = 'Terms Condition';   
    var data = await Models.Cms.findOne({where:{type:'terms',status:'Y'}});
    return res.render('front/pages/Others/termcondition', {
        page_name: 'terms',
        data:data,
        title:title
    });
}

async function privacyPolicy(req, res) {
    var title = 'Privacy Policy'; 
    var data = await Models.Cms.findOne({where:{type:'policy',status:'Y'}});
    return res.render('front/pages/Others/privacy', {
        page_name: 'policy',
        data:data,
        title:title
    });
}

async function cancelationRefund(req, res) {
    var title = 'Cancelation Refund'; 
    var data = await Models.Cms.findOne({where:{type:'cancelation',status:'Y'}});
    return res.render('front/pages/Others/refund', {
        page_name: 'cancelation',
        data:data,
        title:title
    });
}

async function aboutUs(req,res){
    var title = 'About Us'; 
    var data = await Models.Cms.findOne({where:{type:'about',status:'Y'}});
    return res.render('front/pages/Others/aboutus', {
        page_name: 'about',
        data:data,
        title:title
    });
}

async function contactUs(req,res){
    var title = 'Contact Us'; 
    var company = await Models.Company.findOne({});
    return res.render('front/pages/Others/contactus', {
        page_name: 'contact',
        company:company,
        title:title
    });
}

async function contactUsAction(req,res){

    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;
    //validation start
    const validator = new Validator();
    const validationResponse = validator.validate(
      {
        subject: subject,
        email: email,
        message: message,
      },
      {
        subject: { type: 'string', empty: false, max: '100' },
        email: { type: 'string', empty: false, max: '100' },
        message: { type: 'string', empty: false, max: '100' },
      }
    );
    if (validationResponse !== true) {
      req.flash('error', validationResponse[0].message);
      return res.redirect('/others/contact-us');
    }
    //validation end

    let contactUsData = {
        subject: subject,
        email: email,
        message: message,
      };
    
      var created_contactus = await Models.Contactus.create(contactUsData);
      if (created_contactus) {
        req.flash('success', 'Form submited');
        return res.redirect('/others/contact-us');
      } else {
        req.flash('error', 'Form submition faied');
        return res.redirect('/others/contact-us');
      }
}


async function howItWork(req,res){
    var title = 'How It Work'; 
    var data = await Models.Howwork.findAll({where:{status:'Y'}});
   // console.log('data',data);
    return res.render('front/pages/Others/howwork', {
        page_name: 'howwork',
        data:data,
        title:title
    });
}



module.exports = {
    support: support,
    termsCondition: termsCondition,
    privacyPolicy: privacyPolicy,
    cancelationRefund: cancelationRefund,
    aboutUs: aboutUs,
    contactUs: contactUs,
    howItWork:howItWork,
    contactUsAction:contactUsAction,
}