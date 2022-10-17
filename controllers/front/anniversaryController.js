const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const moment = require('moment');

async function anniversaryThemeList(req, res) {
  console.log('jik', loginAuthCheck);
  const allAnniversaryData = await Models.Subcategory.findAll({
    where: { categoryId: 2 },
    include: [
      {
        model: Models.Category,
        attributes: ['name'],
      },
    ],
  });

  var allBirthdayThemeToArray = [];
  var authId = null;
  if (loginAuthCheck) {
    var userinfo = await Models.User.findOne({ where: { id: loginAuthCheck } });
    if (userinfo.anniversaryThemes) {
      allBirthdayThemeToArray = userinfo.anniversaryThemes.split(',');
    }
    authId = loginAuthCheck;
  }
  // if (!allAnniversaryData) {
  //   req.flash('success', 'Themes not available');
  //   return res.redirect('/home');
  // }
  return res.render('front/pages/Anniversary/anniversarythemelist', {
    page_name: 'anniversary',
    theme: allAnniversaryData,
    allBirthdayThemeToArray: allBirthdayThemeToArray,
    authId: authId,
  });
}

// destructure
//const { email, firstName, lastName, password, confirmPassword } = req.body;

async function anniversaryList(req, res) {
  var userId = req.id;
  const AnniversaryList = await Models.Anniversary.findAll({
    where: { userId: userId, delflag: 'N' },
    order: [['id', 'DESC']],
  });
  if (AnniversaryList) {
    return res.render('front/pages/Anniversary/anniversarylist', {
      page_name: 'anniversary',
      data: AnniversaryList,
    });
  }
}

async function addAnniversary(req, res) {
  return res.render('front/pages/Anniversary/addanniversary', {
    page_name: 'anniversary',
  });
}

async function addAnniversaryAction(req, res) {

  const { brideName, groomName, anniversaryday, email, mobile } = req.body;

  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      brideName: brideName,
      groomName: groomName,
      anniversaryday: anniversaryday,
    },
    {
      brideName: { type: 'string', empty: false, max: '30' },
      groomName: { type: 'string', empty: false, max: '30' },
      anniversaryday: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    return res.redirect('/anniversary/add-anniversary');
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
      'public/uploads/AnniversaryContact/' + imgname,
      function (err) {
        if (err) {
          req.flash('error', 'Image not uploaded');
          res.redirect('/anniversary/add-anniversary');
        }
      }
    );
  }else{
    req.flash('error', 'Please choose a Contact Pic.');
    res.redirect('/anniversary/add-anniversary');
  }
  //end image upload//

  const newContact = {
    userId: req.id,
    brideName: brideName,
    groomName: groomName,
    anniversaryday: format(anniversaryday),
    email: email,
    mobile: mobile,
    anniversaryPic: imgname,
  };
  var created_anniversary = await Models.Anniversary.create(newContact);
  if (created_anniversary) {
    req.flash('success', 'Anniversary contact added successfully');
    return res.redirect('/anniversary/add-anniversary');
  } else {
    req.flash('error', 'Anniversary contact not added successfully');
    return res.redirect('/anniversary/add-anniversary');
  }
}

async function setAnniversaryThemeAction(req, res) {
  var uid = req.id;
  var user = await Models.User.findOne({ where: { id: uid } });
  var selectAnniversaryImage = req.body.uniquecode;

  if (!user.anniversaryThemes) {
    const updateUser = {
      anniversaryThemes: selectAnniversaryImage,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: uid },
    });

    return res.json({
      msg: 'updated',
      scode: 2,
    });
  } else if (
    user.anniversaryThemes &&
    user.anniversaryThemes.split(',').length == 3
  ) {
    return res.json({
      msg: 'user maximum selected 3 themes',
      scode: 1,
    });
  } else {
    var updatedSelectAnniversaryImage =
      user.anniversaryThemes + ',' + selectAnniversaryImage;
    const updateUser = {
      anniversaryThemes: updatedSelectAnniversaryImage,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: uid },
    });
    return res.json({
      msg: 'updated 2',
      scode: 3,
    });
  }

}

async function setAnniversaryRemoveThemeAction(req, res) {
  var userid = req.id;
  // var userinfo = await Models.User.findOne({where:{ id: userid }});

  var allAnniversaryThemeToArra = [];
  var userinfo = await Models.User.findOne({ where: { id: userid } });
  if (userinfo.anniversaryThemes) {
    allAnniversaryThemeToArra = userinfo.anniversaryThemes.split(',');
  }
  var allAnniversaryThemeToArray = allAnniversaryThemeToArra;

  var updatedAnniversaryThemesToArray = allAnniversaryThemeToArray.filter(
    (e) => e !== req.body.uniquecode
  );
  var updatedAnniversaryThemes;

  // console.log("final",updatedBirthdayThemesToArray);
  if (updatedAnniversaryThemesToArray.length) {
    updatedAnniversaryThemes = updatedAnniversaryThemesToArray.toString();
  } else {
    updatedAnniversaryThemes = null;
  }

  const updateUser = {
    anniversaryThemes: updatedAnniversaryThemes,
  };
  let updateInfo = await Models.User.update(updateUser, {
    where: { id: userid },
  });
  return res.json({
    msg: 'removed',
  });
}

async function userFavAnniversaryTheme(req, res) {
  var userid = req.id;
  var allAnniversaryThemeToArray = [];
  var userinfo = await Models.User.findOne({ where: { id: userid } });
  if (userinfo.anniversaryThemes) {
    allAnniversaryThemeToArray = userinfo.anniversaryThemes.split(',');
  }
  const allFavAnniversaryData = await Models.Subcategory.findAll({
    where: {
      [Op.and]: [
        { categoryId: 2 },
        { subcategoryUniqueCode: { [Op.in]: allAnniversaryThemeToArray } },
      ],
    },
    include: [
      {
        model: Models.Category,
        attributes: ['name'],
      },
    ],
  });

  console.log(allFavAnniversaryData.length);

  //
  return res.render('front/pages/Anniversary/favanniversarytheme', {
    page_name: 'anniversary',
    theme: allFavAnniversaryData,
    //allBirthdayThemeToArray: allBirthdayThemeToArray,
    authId: userid,
  });
}


async function userAnniversaryEdit(req, res) {
  var anniversayid = req.params.id;  
  var anniversaryInfo = await Models.Anniversary.findOne({ where: { id: anniversayid } });
  if (anniversaryInfo) {
      return res.render('front/pages/Anniversary/editanniversarylist', {
          page_name: 'anniversary-list-edit',
          data:anniversaryInfo
      });
  } else {
    req.flash('error', 'No Record found ');
    return res.redirect(`/anniversary/list`);
  }

}

async function usrAnniversaryEditAction(req, res) { 
  console.log();
  var anniversayid = req.body.anniversaryid;
  var brideName = req.body.brideName;  
  var groomName = req.body.groomName;  
  var anniversaryday = req.body.anniversaryday;  
  var imgname =null;
  var anniversaryData;
  var anniversaryDataInfo = await Models.Anniversary.findOne({ where: { id: anniversayid } });
  if(anniversaryDataInfo){

    //validation start
    const validator = new Validator();
    const validationResponse = validator.validate(
      {
        brideName: brideName,
        groomName: groomName,
        anniversaryday: anniversaryday,
      },
      {
        brideName: { type: 'string', empty: false, max: '30' },
        groomName: { type: 'string', empty: false, max: '30' },
        anniversaryday: { type: 'string', empty: false, max: '100' },
      }
    );
    if (validationResponse !== true) {
      req.flash('error', validationResponse[0].message);
      return res.redirect(`/anniversary/edit/${anniversayid}`);
    }
    //validation end


      if (req.files && req.files.anniversaryPic) {
          var documentFile = req.files.anniversaryPic;
          var imgString = documentFile.name;
          var imgArr = imgString.split(".");
          imgname = 'contact-pic-' + Date.now() + '.' + imgArr[1];
          documentFile.mv("public/uploads/AnniversaryContact/" + imgname, function (err) {
              if (err) {
                  req.flash('error', 'Image not uploaded');
                  res.redirect(`/anniversary/edit/${anniversayid}`);
              }
          });
          console.log(imgname)
      }
      
      anniversaryData = {
        brideName: req.body.brideName,
        groomName: req.body.groomName,
        anniversaryday: req.body.anniversaryday,
        email: req.body.email,
        mobile: req.body.mobile,
        anniversaryPic: imgname ? imgname : anniversaryDataInfo.anniversaryPic,
      };
  
      var update_Anniversary = await Models.Anniversary.update(anniversaryData,{ where: { id: anniversayid } });
      if (update_Anniversary) {
          req.flash('success', 'Anniversary Record updated successfully');
          return res.redirect(`/anniversary/edit/${anniversayid}`);
      } else {
          req.flash('error', 'Anniversary Record is not updated');
          return res.redirect(`/anniversary/edit/${anniversayid}`);
      }
  } else {
      req.flash('error', 'Anniversary Record not found');
      return res.redirect(`/anniversary/edit/${anniversayid}`);
  }
}


async function userDeleteAnniversary(req,res){
  var id = req.params.id; 
  const updateUserAnniversary = {
    delflag: 'Y',
  };
  let updateInfo = await Models.Anniversary.update(updateUserAnniversary, {
    where: { id: id },
  }); 
    if (updateInfo) {
      req.flash('success', 'Record Deleted successfully');
      return res.redirect(`/anniversary/list`);
    } else {
      req.flash('error', 'Record is not deleted ');
      return res.redirect(`/anniversary/list`);
    }
}


async function themeAnniversary(req, res) {
  var contactId = req.params.contactId;
  var anniversary = await Models.Anniversary.findOne({ where: { id: contactId } });
  if (anniversary) {
    var userid = req.id;
    var allAnniversaryThemeToArray = [];
    var userinfo = await Models.User.findOne({ where: { id: userid } });
    if (userinfo.anniversaryThemes) {
      allAnniversaryThemeToArray = userinfo.anniversaryThemes.split(',');
    }
    const allFavAnniversaryData = await Models.Subcategory.findAll({
      where: {
        [Op.and]: [
          { categoryId: 2 },
          { subcategoryUniqueCode: { [Op.in]: allAnniversaryThemeToArray } },
        ],
      },
      include: [
        {
          model: Models.Category,
          attributes: ['name'],
        },
      ],
    });
  
    return res.render('front/pages/Anniversary/themeSelectAnniversary', {
      page_name: 'anniversary',
      theme: allFavAnniversaryData,
      authId: userid,
      anniversary: anniversary,
    });
  } else {
    req.flash('error', 'Anniversary theme list not found');
    return res.redirect(`/anniversary/list`);
  }
}

async function upcomingAnniversaryList(req, res) {
  const Op = Sequelize.Op;
  var userId = req.id;
  var anniversaryArray = [];
  var month = moment().month() + 1; //current month
  var day = moment().add(1, 'days').date(); //current day
  for (var i = 1; i <= 30; i++){
    day = moment().add(i, 'days').date(); //current day
    if(day == 1 && i > 1){
      month = moment().month() + 2; //next month
    }
    var AnniversaryList = await Models.Anniversary.findAll({
      where: {
        [Op.and]: [{ userId: userId }],
        [Op.or]: [
          {
            [Op.and]: [
              {
                anniversaryday: Sequelize.where(
                  Sequelize.fn('month', Sequelize.col('anniversaryday')),
                  month
                ),
              },
              {
                anniversaryday: Sequelize.where(
                  Sequelize.fn('day', Sequelize.col('anniversaryday')),
                  day
                ),
              },
            ],
          },
        ],
      },
    });

    if(day && month && AnniversaryList && AnniversaryList.length > 0){
      anniversaryArray[i] = {
        day:day,
        month:month,
        AnniversaryList:AnniversaryList,
      };
    }
  }

  if (anniversaryArray) {
    return res.render('front/pages/Anniversary/upcominganniversarylist', {
      page_name: 'anniversary',
      data: anniversaryArray,
    });
  }else{
    req.flash('error', 'Upcomming Anniversary list not found');
    return res.redirect(`/anniversary/list`);
  }
}

module.exports = {
  anniversaryThemeList: anniversaryThemeList,
  anniversaryList: anniversaryList,
  addAnniversary: addAnniversary,
  addAnniversaryAction: addAnniversaryAction,
  userFavAnniversaryTheme: userFavAnniversaryTheme,
  userAnniversaryEdit: userAnniversaryEdit,
  usrAnniversaryEditAction: usrAnniversaryEditAction,
  userDeleteAnniversary: userDeleteAnniversary,
  themeAnniversary:themeAnniversary,
  upcomingAnniversaryList:upcomingAnniversaryList,

  //ajax//
  setAnniversaryThemeAction: setAnniversaryThemeAction,
  setAnniversaryRemoveThemeAction: setAnniversaryRemoveThemeAction,
};
