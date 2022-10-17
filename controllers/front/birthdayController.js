const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');
const { userInfo } = require('os');
const moment = require('moment');

async function birthdayThemeList(req, res) {
  const allBirthdayData = await Models.Subcategory.findAll({
    where: { categoryId: 1 },
    include: [
      {
        model: Models.Category,
        attributes: ['name'],
      },
    ],
  });
  console.log('hi');

  var allBirthdayThemeToArray = [];
  var authId = null;
  if (loginAuthCheck) {
    var userinfo = await Models.User.findOne({ where: { id: loginAuthCheck } });
    if (userinfo.birthdayThemes) {
      console.log('bye');
      allBirthdayThemeToArray = userinfo.birthdayThemes.split(',');
    }
    authId = loginAuthCheck;
  }

  // console.log('authId',authId);

  // if (!allBirthdayData) {
  //   req.flash('success', 'Themes not available');
  //   return res.redirect('/home');
  // }
  return res.render('front/pages/Birthday/birthdaythemelist', {
    page_name: 'birthday',
    theme: allBirthdayData,
    allBirthdayThemeToArray: allBirthdayThemeToArray,
    authId: authId,
  });
}

async function birthdayList(req, res) {
  var userId = req.id;
  const BirthdayList = await Models.Birthday.findAll({
    where: { userId: userId },
    order: [['id', 'DESC']],
  });
  if (BirthdayList) {
    return res.render('front/pages/Birthday/birthdaylist', {
      page_name: 'birthday',
      data: BirthdayList,
    });
  }
}

async function addBirthday(req, res) {
  //const categoryList = await Models.Category.findAll({});
  return res.render('front/pages/Birthday/addbirthday', {
    page_name: 'birthday',
  });
}

async function addBirthdayAction(req, res) {
  const { name, birthday, gender, email, mobile } = req.body;

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
      name: { type: 'string', empty: false, max: '30' },
      birthday: { type: 'string', empty: false, max: '100' },
      gender: { type: 'string', empty: false, max: '100' },
      email: { type: 'string', empty: false, max: '30' },
      mobile: { type: 'string', empty: false, min: '10', max: '12' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    return res.redirect('/birthday/add-birthday');
  }
  //validation end

  //image upload//
  if (req.files && req.files.contactPic) {
    var documentFile = req.files.contactPic;
    var imgString = documentFile.name;
    var imgArr = imgString.split('.');
    var imgname = 'contact-pic-' + Date.now() + '.' + imgArr[1];
    console.log(imgname);
    documentFile.mv(
      'public/uploads/birthdayContact/' + imgname,
      function (err) {
        if (err) {
          req.flash('error', 'Image not uploaded');
          res.redirect('/birthday/add-birthday');
        }
      }
    );
  } else {
    req.flash('error', 'Please choose a Contact Pic.');
    res.redirect('/birthday/add-birthday');
  }

  const newContact = {
    userId: req.id,
    name: name,
    birthday: format(birthday),
    gender: gender,
    email: email,
    mobile: mobile,
    contactPic: imgname,
  };
  var created_birthday = await Models.Birthday.create(newContact);
  if (created_birthday) {
    req.flash('success', 'Birthday contact added successfully');
    return res.redirect('/birthday/add-birthday');
  } else {
    req.flash('error', 'Birthday contact not added successfully');
    return res.redirect('/birthday/add-birthday');
  }
}

async function editBirthday(req, res) {
  var id = req.params.id;
  const birthday = await Models.Birthday.findOne({ where: { id: id } });
  if (birthday) {
    return res.render('front/pages/Birthday/editbirthday', {
      page_name: 'birthday',
      data: birthday,
    });
  }
}

async function editBirthdayAction(req, res) {
  const { id, name, birthday, gender, email, mobile } = req.body;
  const birthdayDet = await Models.Birthday.findOne({ where: { id: id } });
  if (birthdayDet) {
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
        name: { type: 'string', empty: false, max: '30' },
        birthday: { type: 'string', empty: false, max: '100' },
        gender: { type: 'string', empty: false, max: '100' },
        email: { type: 'string', empty: false, max: '30' },
        mobile: { type: 'string', empty: false, min: '10', max: '12' },
      }
    );
    if (validationResponse !== true) {
      req.flash('error', validationResponse[0].message);
      return res.redirect(`/birthday/edit-birthday/${id}`);
    }
    //validation end

    //image upload//
    if (req.files && req.files.contactPic) {
      var documentFile = req.files.contactPic;
      var imgString = documentFile.name;
      var imgArr = imgString.split('.');
      var imgname = 'contact-pic-' + Date.now() + '.' + imgArr[1];
      console.log(imgname);
      documentFile.mv(
        'public/uploads/birthdayContact/' + imgname,
        function (err) {
          if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/birthday/edit-birthday/${id}`);
          }
        }
      );
    }

    const updateContact = {
      userId: req.id,
      name: name,
      birthday: format(birthday),
      gender: gender,
      email: email,
      mobile: mobile,
      contactPic: imgname ? imgname : birthdayDet.contactPic,
    };
    var update_birthday = await Models.Birthday.update(updateContact, {
      where: { id: id },
    });
    if (update_birthday) {
      req.flash('success', 'Birthday contact updated successfully');
      return res.redirect(`/birthday/edit-birthday/${id}`);
    } else {
      req.flash('error', 'Birthday contact not updated successfully');
      return res.redirect(`/birthday/edit-birthday/${id}`);
    }
  } else {
    req.flash('error', 'Birthday contact not updated successfully');
    return res.redirect(`/birthday/edit-birthday/${id}`);
  }
}

async function deleteBirthday(req, res) {
  var id = req.params.id;
  const updateUserBirthday = {
    delflag: 'Y',
  };
  var delete_birthday = await Models.Birthday.update(updateUserBirthday, {
    where: { id: id },
  });
  if (delete_birthday) {
    req.flash('success', 'Birthday deleted successfully');
    return res.redirect(`/birthday/list`);
  } else {
    req.flash('error', 'Birthday is not deleted ');
    return res.redirect(`/birthday/list`);
  }
}

async function setBirthdayThemeAction(req, res) {
  //console.log(req.body.uniquecode);
  var user = await Models.User.findOne({ where: { id: loginAuthCheck } });
  var selectBirthdayImage = req.body.uniquecode;

  // console.log(user.birthdayThemes.split(',').length == 5);
  // return false;
  // if(user.birthdayThemes.split(',').length == 3){
  //   return res.json({
  //     msg: 'user maximum selected 3 themes',
  //     scode: 1,
  //   });
  // }

  if (!user.birthdayThemes) {
    const updateUser = {
      birthdayThemes: selectBirthdayImage,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: loginAuthCheck },
    });

    return res.json({
      msg: 'updated',
      scode: 2,
    });
  } else if (
    user.birthdayThemes &&
    user.birthdayThemes.split(',').length == 3
  ) {
    return res.json({
      msg: 'user maximum selected 3 themes',
      scode: 1,
    });
  } else {
    var updatedSelectBirthdayImage =
      user.birthdayThemes + ',' + selectBirthdayImage;
    const updateUser = {
      birthdayThemes: updatedSelectBirthdayImage,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: loginAuthCheck },
    });
    return res.json({
      msg: 'updated 2',
      scode: 3,
    });
  }

  //selectpackages.split(",").find(function(val){return val == "1";})
}

async function setBirthdayRemoveThemeAction(req, res) {
  var userid = req.id;
  // var userinfo = await Models.User.findOne({where:{ id: userid }});

  var allBirthdayThemeToArra = [];
  var userinfo = await Models.User.findOne({ where: { id: userid } });
  if (userinfo.birthdayThemes) {
    allBirthdayThemeToArra = userinfo.birthdayThemes.split(',');
  }
  var allBirthdayThemeToArray = allBirthdayThemeToArra;

  var updatedBirthdayThemesToArray = allBirthdayThemeToArray.filter(
    (e) => e !== req.body.uniquecode
  );
  var updatedBirthdayThemes;

  // console.log("final",updatedBirthdayThemesToArray);
  if (updatedBirthdayThemesToArray.length) {
    updatedBirthdayThemes = updatedBirthdayThemesToArray.toString();
  } else {
    updatedBirthdayThemes = null;
  }

  const updateUser = {
    birthdayThemes: updatedBirthdayThemes,
  };
  let updateInfo = await Models.User.update(updateUser, {
    where: { id: userid },
  });
  return res.json({
    msg: 'removed',
  });
}

async function userFavBirthdayTheme(req, res) {
  var userid = req.id;
  var allBirthdayThemeToArray = [];
  var userinfo = await Models.User.findOne({ where: { id: userid } });
  if (userinfo.birthdayThemes) {
    allBirthdayThemeToArray = userinfo.birthdayThemes.split(',');
  }

  const allFavBirthdayData = await Models.Subcategory.findAll({
    where: {
      [Op.and]: [
        { categoryId: 1 },
        { subcategoryUniqueCode: { [Op.in]: allBirthdayThemeToArray } },
      ],
    },
    include: [
      {
        model: Models.Category,
        attributes: ['name'],
      },
    ],
  });

  console.log(allFavBirthdayData.length);
  return res.render('front/pages/Birthday/favbirthdaytheme', {
    page_name: 'birthday',
    theme: allFavBirthdayData,
    //allBirthdayThemeToArray: allBirthdayThemeToArray,
    authId: userid,
  });
}

async function upcomingBirthdayList(req, res) {
  const Op = Sequelize.Op;
  var userId = req.id;
  var birthDayArray = [];
  var month = moment().month() + 1; //current month
  var day = moment().add(1, 'days').date(); //current day
  for (var i = 1; i <= 30; i++){
    day = moment().add(i, 'days').date(); //current day
    if(day == 1 && i > 1){
      month = moment().month() + 2; //next month
    }
    var BirthdayList = await Models.Birthday.findAll({
      where: {
        [Op.and]: [{ userId: userId }],
        [Op.or]: [
          {
            [Op.and]: [
              {
                birthday: Sequelize.where(
                  Sequelize.fn('month', Sequelize.col('birthday')),
                  month
                ),
              },
              {
                birthday: Sequelize.where(
                  Sequelize.fn('day', Sequelize.col('birthday')),
                  day
                ),
              },
            ],
          },
        ],
      },
    });

    if(day && month && BirthdayList && BirthdayList.length > 0){
      birthDayArray[i] = {
        day:day,
        month:month,
        BirthdayList:BirthdayList,
      };
    }
  }

  if (birthDayArray) {
    return res.render('front/pages/Birthday/upcomingbirthdaylist', {
      page_name: 'birthday',
      data: birthDayArray,
    });
  }else{
    req.flash('error', 'Upcomming Birthday list not found');
    return res.redirect(`/birthday/list`);
  }
}

async function themeBirthday(req, res) {
  var contactId = req.params.contactId;
  var birthday = await Models.Birthday.findOne({ where: { id: contactId } });
  if (birthday) {
    var userid = req.id;
    var allBirthdayThemeToArray = [];
    var userinfo = await Models.User.findOne({ where: { id: userid } });
    if (userinfo.birthdayThemes) {
      allBirthdayThemeToArray = userinfo.birthdayThemes.split(',');
    }

    const allFavBirthdayData = await Models.Subcategory.findAll({
      where: {
        [Op.and]: [
          { categoryId: 1 },
          { subcategoryUniqueCode: { [Op.in]: allBirthdayThemeToArray } },
        ],
      },
      include: [
        {
          model: Models.Category,
          attributes: ['name'],
        },
      ],
    });

    return res.render('front/pages/Birthday/themeSelectBirthday', {
      page_name: 'birthday',
      theme: allFavBirthdayData,
      authId: userid,
      birthday: birthday,
    });
  } else {
    req.flash('error', 'Birthday theme list not found');
    return res.redirect(`/birthday/list`);
  }
}

module.exports = {
  birthdayThemeList: birthdayThemeList,
  birthdayList: birthdayList,
  upcomingBirthdayList: upcomingBirthdayList,
  addBirthday: addBirthday,
  addBirthdayAction: addBirthdayAction,

  editBirthday: editBirthday,
  editBirthdayAction: editBirthdayAction,

  deleteBirthday: deleteBirthday,
  themeBirthday: themeBirthday,

  setBirthdayThemeAction: setBirthdayThemeAction,
  setBirthdayRemoveThemeAction: setBirthdayRemoveThemeAction,

  userFavBirthdayTheme: userFavBirthdayTheme,
};
