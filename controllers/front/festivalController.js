const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');
const { userInfo } = require('os');

async function festivalThemeList(req, res) {
  const FestivalInfo = await Models.Festivalsubcategory.findAll({});
  var allFestivalData = [];
  var allFestivalThemeToArray = [];
  var authId = null;
  if (loginAuthCheck) {
    authId = loginAuthCheck;
    var userinfo = await Models.User.findOne({ where: { id: loginAuthCheck } });
    if (userinfo.holidayThemes) {
      allFestivalThemeToArray = userinfo.holidayThemes.split(',').map(Number);

      allFestivalData = await Models.Subcategory.findAll({
        where: {
          festivalSubCategoryId: {
            [Op.in]: allFestivalThemeToArray,
          },
        },
        include: [
          {
            model: Models.Festivalsubcategory,
          },
        ],
      });
    }
  }
  return res.render('front/pages/Festival/festivalthemelist', {
    page_name: 'festival',
    theme: allFestivalData,
    fest: FestivalInfo,
    allFestivalThemeToArray: allFestivalThemeToArray,
    authId: authId,
  });
}

//ajax festival
async function getFestivalAjaxSort(req, res) {
  let festival_id = req.body.festival_id;
  var allfestivalResultSort;
  if (festival_id != 'all') {
    allfestivalResultSort = await Models.Subcategory.findAll({
      where: { festivalSubCategoryId: festival_id },
      include: [
        {
          model: Models.Festivalsubcategory,
        },
      ],
    });
  } else {
    allfestivalResultSort = await Models.Subcategory.findAll({
      where: { categoryId: 3 },
      include: [
        {
          model: Models.Festivalsubcategory,
        },
      ],
    });
  }
  //console.log('hhhhh', allfestivalResultSort);
  return res.json({ msg: 'success', subcategorys: allfestivalResultSort });
}

///ajax ////
async function setFestivalThemeAction(req, res) {
  var uid = req.id;
  var user = await Models.User.findOne({ where: { id: uid } });
  var selectFestivalImage = req.body.uniquecode;
  if (!user.holidayThemes) {
    const updateUser = {
      holidayThemes: selectFestivalImage,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: uid },
    });

    return res.json({
      msg: 'updated',
    });
  } else {
    var updatedSelectFestivalImage =
      user.holidayThemes + ',' + selectFestivalImage;
    const updateUser = {
      holidayThemes: updatedSelectFestivalImage,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: uid },
    });
    return res.json({
      msg: 'updated 2',
    });
  }
}

async function setFestivalRemoveThemeAction(req, res) {
  var userid = req.id;
  var allFestivalThemeToArra = [];
  var userinfo = await Models.User.findOne({ where: { id: userid } });
  if (userinfo.holidayThemes) {
    allFestivalThemeToArra = userinfo.holidayThemes.split(',');
  }
  var allFestivalThemeToArray = allFestivalThemeToArra;

  var updatedFestivalThemesToArray = allFestivalThemeToArray.filter(
    (e) => e !== req.body.uniquecode
  );
  var updatedFestivalThemes;

  // console.log("final",updatedBirthdayThemesToArray);
  if (updatedFestivalThemesToArray.length) {
    updatedFestivalThemes = updatedFestivalThemesToArray.toString();
  } else {
    updatedFestivalThemes = null;
  }

  const updateUser = {
    holidayThemes: updatedFestivalThemes,
  };
  let updateInfo = await Models.User.update(updateUser, {
    where: { id: userid },
  });
  return res.json({
    msg: 'removed',
  });
}

async function userFavHolidayTheme(req, res) {
  var userid = req.id;
  var allHolidayThemeToArray = [];
  var userinfo = await Models.User.findOne({ where: { id: userid } });
  if (userinfo.holidayThemes) {
    allHolidayThemeToArray = userinfo.holidayThemes.split(',');
  }

  const allFavHolidayData = await Models.Subcategory.findAll({
    where: {
      //[Op.and]: [{ categoryId: 3 }, { subcategoryUniqueCode: { [Op.in]: allHolidayThemeToArray } }]
      [Op.and]: [
        { categoryId: 3 },
        { festivalSubCategoryId: { [Op.in]: allHolidayThemeToArray } },
      ],
    },
    include: [
      {
        model: Models.Category,
        attributes: ['name'],
      },
    ],
  });

  console.log(allFavHolidayData.length);

  //
  return res.render('front/pages/Festival/favfestivaltheme', {
    page_name: 'birthday',
    theme: allFavHolidayData,
    //allBirthdayThemeToArray: allBirthdayThemeToArray,
    authId: userid,
  });
}
//////////////////////////

async function getNewFestivalAjaxSort(req, res) {
  var allFestivalCategoryId = req.body.festival_id;
  var holidayThemes = null;
  var allfestivalResultSort = [];
  var authId = null;
  if (allFestivalCategoryId && allFestivalCategoryId !== 'undefined') {
    holidayThemes = allFestivalCategoryId.toString();
    allfestivalResultSort = await Models.Subcategory.findAll({
      where: {
        festivalSubCategoryId: {
          [Op.in]: allFestivalCategoryId,
        },
      },
      include: [
        {
          model: Models.Festivalsubcategory,
        },
      ],
    });
  }
  if (loginAuthCheck) {
    authId = loginAuthCheck;
    const updateUser = {
      holidayThemes: holidayThemes,
    };
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: loginAuthCheck },
    });
    
    return res.json({
      msg: 'updated',
      subcategorys: allfestivalResultSort,
      authId: authId,
    });
  } else {
    
    return res.json({
      msg: 'updated',
      subcategorys: allfestivalResultSort,
      authId: authId,
    });
  }

  //console.log('ghuj', allFestivalCategoryId.toString());
}

module.exports = {
  festivalThemeList: festivalThemeList,
  getFestivalAjaxSort: getFestivalAjaxSort,
  userFavHolidayTheme: userFavHolidayTheme,

  //ajax
  setFestivalThemeAction: setFestivalThemeAction,
  setFestivalRemoveThemeAction: setFestivalRemoveThemeAction,

  //new//
  getNewFestivalAjaxSort: getNewFestivalAjaxSort,
};
