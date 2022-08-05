const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');

async function index(req, res) {
  var userId = req.id;
  const usecontactsr = await Models.Contact.findAll({where:{userId:userId}});
  if (usecontactsr) {
    return res.render('front/pages/Contact/contactlist', {
      page_name: 'contact',
      data: usecontactsr,
    });
  }
}

async function add(req, res) {
  const categoryList = await Models.Category.findAll({});
  return res.render('front/pages/Contact/addcontact', {
    page_name: 'contact',
    categoryList: categoryList
  });
}

async function addAction(req, res) {
  console.log(req.files);
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
      // birthday: birthday,
      gender: gender,
      email: email,
      mobile: mobile,
    },
    {
      name: { type: 'string', empty: false, max: '100' },
      // birthday: { type: 'string', empty: false, max: '100' },
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

   //image upload//
   if (req.files && req.files.contactPic) {
    var documentFile = req.files.contactPic;
    var imgString = documentFile.name;
    var imgArr = imgString.split('.');
    var imgname = 'contact-pic-' + Date.now() + '.' + imgArr[1];
    console.log(imgname);
    documentFile.mv('public/uploads/birthdayContact/' + imgname, function (err) {
      if (err) {
        req.flash('error', 'Image not uploaded');
        res.redirect('/user/profile');
      }
    });
  }
  console.log('jkol',imgname);
  //end image upload//

  const newContact = {
    userId: req.id,
    name: req.body.name,
    birthday: req.body.birthday ? format(req.body.birthday) : null,
    anniversary: req.body.anniversary ? format(req.body.anniversary) : null,
    companyName: req.body.companyName,
    gender: req.body.gender,
    email: req.body.email,
    mobile: req.body.mobile,
    contactPic: imgname,
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


module.exports = {
  index: index,
  add: add,
  addAction: addAction,
};
