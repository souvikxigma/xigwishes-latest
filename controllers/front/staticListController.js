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
    var data = await Models.Cms.findOne({where:{type:'contact',status:'Y'}});
    return res.render('front/pages/Others/contactus', {
        page_name: 'contact',
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
}