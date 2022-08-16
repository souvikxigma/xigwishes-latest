const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');

function support(req, res) {
    return res.render('front/pages/Others/support', {
        page_name: 'support'
    });
}

function termsCondition(req, res) {
    return res.render('front/pages/Others/termcondition', {
        page_name: 'termcondition'
    });
}

function privacyPolicy(req, res) {
    return res.render('front/pages/Others/privacy', {
        page_name: 'privacy'
    });
}

function cancelationRefund(req, res) {
    return res.render('front/pages/Others/refund', {
        page_name: 'refund'
    });
}

function aboutUs(req,res){
    return res.render('front/pages/Others/aboutus', {
        page_name: 'aboutus'
    });
}



module.exports = {
    support: support,
    termsCondition: termsCondition,
    privacyPolicy: privacyPolicy,
    cancelationRefund: cancelationRefund,
    aboutUs: aboutUs,
}