const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');

async function index(req, res) {
  const usecontactsr = await Models.Contact.findAll({});
  if (usecontactsr) {
    return res.render('front/pages/Contact/contactlist', {
      page_name: 'contact',
      data: usecontactsr,
    });
  }else{
    return res.render('front/pages/Contact/contactlist', {
        page_name: 'contact',
        data: null,
      });
  }
}

function add(req, res) {
  return res.render('front/pages/Contact/addcontact', {
    page_name: 'contact',
  });
}

async function addAction(req, res) {
  var userId = 1;
  var name = req.body.name;
  var birthday = req.body.birthday;
  var gender = req.body.gender;
  var email = req.body.email;
  var mobile = req.body.mobile;
  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      name: name,
      birthday: birthday,
      gender: gender,
      email: email,
      mobile: mobile,
    },
    {
      name: { type: 'string', empty: false, max: '100' },
      birthday: { type: 'string', empty: false, max: '100' },
      gender: { type: 'string', empty: false, max: '100' },
      email: { type: 'string', empty: false, max: '100' },
      mobile: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    return res.redirect('/contact/add');
  }
  //validation end
  const newContact = {
    userId: 1,
    name: req.body.name,
    birthday: format(req.body.birthday),
    companyName: req.body.companyName,
    gender: req.body.gender,
    email: req.body.email,
    mobile: req.body.mobile,
  };
  var created_contact = await Models.Contact.create(newContact);
  if (created_contact) {
    req.flash('success', 'Contact added successfully');
    return res.redirect('/contact/add');
  } else {
    req.flash('error', 'Contact not added successfully');
    return res.redirect('/contact/add');
  }
}

async function templateSubmit(req, res) {
  var userId = req.id;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  if (!userInfo) {
    return res.redirect('/contact/temp');
  }
  if (!userInfo.themes) {
    return res.redirect('/contact/temp');
  }
  var theme = await Models.Theme.findAll({});
  return res.render('front/templat', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
  });
}

function templateSubmitAction(req, res) {
  let name = req.body.name;
  let birthday = req.body.birthday;

  console.log('ioioi---', req.body);

  return res.render('front/templat', {
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
  return res.render('front/templateReview', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
  });
}

module.exports = {
  index: index,
  add: add,
  addAction: addAction,
  templateSubmit: templateSubmit,
  templateSubmitAction: templateSubmitAction,
  templateReview: templateReview,
};
