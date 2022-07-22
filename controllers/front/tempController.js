const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');

async function templateSubmit(req, res) {
  var userId = req.id;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  if (!userInfo) {
    req.flash('success', 'Please login to get themes');
    return res.redirect('/login');
  }
  const theme = await Models.Theme.findAll({});
  if (!theme) {
    req.flash('success', 'Themes not available');
    return res.redirect('/home');
  }
  return res.render('front/pages/Temp/templat', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
  });
}

function templateSubmitAction(req, res) {
  let name = req.body.name;
  let birthday = req.body.birthday;
  return res.render('front/pages/Temp/templat', {
    page_name: 'template',
    name: name,
    birthday: birthday,
  });
}

async function templateReview(req, res) {
  let userId = req.params.id;
  let uniqueCode = req.params.uniqueCode;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  const theme = await Models.Theme.findOne({ where: { uniqueCode: uniqueCode } });
  return res.render('front/pages/Temp/Birthday/templateReview', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
  });
}

async function templateReviewTypeTwo(req, res) {
  let userId = req.params.id;
  let uniqueCode = req.params.uniqueCode;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  const theme = await Models.Theme.findOne({ where: { uniqueCode: uniqueCode } });
  return res.render('front/pages/Temp/Birthday/templateReviewtwo', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
  });
}

module.exports = {
  templateSubmit: templateSubmit,
  templateSubmitAction: templateSubmitAction,
  templateReview: templateReview,
  templateReviewTypeTwo: templateReviewTypeTwo,
};
