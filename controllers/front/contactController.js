const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');

async function index(req, res) {
  var userId = req.id;
  const BirthdayList = await Models.Birthday.findAll(
    {where:{userId:userId},
    order: [
      ["id", "DESC"],
    ]
    }
  );
  if (BirthdayList) {
    return res.render('front/pages/Contact/contactlist', {
      page_name: 'contact',
      data: BirthdayList,
    });
  }
}

async function birthdayThemeList(req,res){
  const allBirthdayData = await Models.Subcategory.findAll({
    where: { categoryId: 1 },
    include: [{
      model: Models.Category,
      attributes: ["name"],
    }]
  });

  // if (!allBirthdayData) {
  //   req.flash('success', 'Themes not available');
  //   return res.redirect('/home');
  // }
  return res.render('front/pages/Contact/birthdaythemelist', {
    page_name: 'template',
    // userInfo: userInfo,
    // theme: theme,
    theme: allBirthdayData,
  });
}

async function birthdayList(req,res){
  var userId = req.id;
  const BirthdayList = await Models.Birthday.findAll(
    {where:{userId:userId},
    order: [
      ["id", "DESC"],
    ]
    }
  );
  if (BirthdayList) {
    return res.render('front/pages/Contact/birthdaylist', {
      page_name: 'contact',
      data: BirthdayList,
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


async function addBirthday(req, res) {
  //const categoryList = await Models.Category.findAll({});
  return res.render('front/pages/Contact/addbirthday', {
    page_name: 'contact'
  });
}

async function addBirthdayAction(req, res) {
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
    return res.redirect('/contact/add-birthday');
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
  //console.log('jkol',imgname);
  //end image upload//

  const newContact = {
    userId: req.id,
    name: req.body.name,
    birthday: format(req.body.birthday),
    companyName: req.body.companyName,
    gender: req.body.gender,
    email: req.body.email,
    mobile: req.body.mobile,
    contactPic: imgname,
  };
  var created_birthday = await Models.Birthday.create(newContact);
  if (created_birthday) {
    req.flash('success', 'Birthday contact added successfully');
    return res.redirect('/contact/add-birthday');
  } else {
    req.flash('error', 'Birthday contact not added successfully');
    return res.redirect('/contact/add-birthday');
  }
}

async function allAnniversaryList(req,res){
  var userId = req.id;
  const AnniversaryList = await Models.Anniversary.findAll(
    {where:{userId:userId},
    order: [
      ["id", "DESC"],
    ]
    }
  );

  if (AnniversaryList) {
    return res.render('front/pages/Contact/anniversarylist', {
      page_name: 'contact',
      data: AnniversaryList,
    });
  }
}

async function addAnniversary(req, res) {
  //const categoryList = await Models.Category.findAll({});
  return res.render('front/pages/Contact/addanniversary', {
    page_name: 'contact'
  });
}

async function addAnniversaryAction(req, res) {
  
  var brideName = req.body.brideName;
  var groomName = req.body.groomName;
  var anniversaryday = req.body.anniversaryday;
  
  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      brideName: brideName,
      groomName: groomName,
      anniversaryday: anniversaryday,
    },
    {
      brideName: { type: 'string', empty: false, max: '100' },
      groomName: { type: 'string', empty: false, max: '100' },
      anniversaryday: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    return res.redirect('/contact/add-anniversary');
  }
  //validation end

   //image upload//
   if (req.files && req.files.contactPic) {
    var documentFile = req.files.contactPic;
    var imgString = documentFile.name;
    var imgArr = imgString.split('.');
    var imgname = 'contact-pic-' + Date.now() + '.' + imgArr[1];
    console.log(imgname);
    documentFile.mv('public/uploads/AnniversaryContact/' + imgname, function (err) {
      if (err) {
        req.flash('error', 'Image not uploaded');
        res.redirect('/user/profile');
      }
    });
  }
  //console.log('jkol',imgname);
  //end image upload//

  const newContact = {
    userId: req.id,
    brideName: req.body.brideName,
    groomName: req.body.groomName,
    anniversaryday: format(req.body.anniversaryday),
    companyName: req.body.companyName,
    email: req.body.email,
    mobile: req.body.mobile,
    anniversaryPic: imgname,
  };
  var created_anniversary = await Models.Anniversary.create(newContact);
  if (created_anniversary) {
    req.flash('success', 'Anniversary contact added successfully');
    return res.redirect('/contact/add-anniversary');
  } else {
    req.flash('error', 'Anniversary contact not added successfully');
    return res.redirect('/contact/add-anniversary');
  }
}



module.exports = {
  index: index,
  add: add,
  addAction: addAction,
  ///birthday///
  birthdayThemeList: birthdayThemeList,
  birthdayList: birthdayList,
  addBirthday: addBirthday,
  addBirthdayAction: addBirthdayAction,

  ///anniversary///
  allAnniversaryList: allAnniversaryList,
  addAnniversary: addAnniversary,
  addAnniversaryAction: addAnniversaryAction,

};
