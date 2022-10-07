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

  const allBirthdayData = await Models.Subcategory.findAll({
    where: { categoryId: 1 },
    include: [{
      model: Models.Category,
      attributes: ["name"],
    }]
  });

  const allAnniversaryData = await Models.Subcategory.findAll({
    where: { categoryId: 2 },
    include: [{
      model: Models.Category,
      attributes: ["name"],
    }]
  });

  const allFestivalData = await Models.Subcategory.findAll({
    where: { categoryId: 3 },
    include: [{
      model: Models.Category,
      attributes: ["name", "id"],
      include: [{
        model: Models.Festivalsubcategory,
      }]
    }]
  });

  const FestivalInfo = await Models.Festivalsubcategory.findAll({});

  //console.log(allFestivalData[0].category.festivalsubcategories);

  if (!theme) {
    req.flash('success', 'Themes not available');
    return res.redirect('/home');
  }
  return res.render('front/pages/Temp/templat', {
    page_name: 'template',
    userInfo: userInfo,
    // theme: theme,
    theme: allBirthdayData,
    themeAnniversary: allAnniversaryData,
    themeFestival: allFestivalData,
    fest: FestivalInfo,
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

async function templateReview1(req, res) {
  let userId = req.id;
  //return res.status(200).send({"id":ab});
  // let userId = req.params.id;
  let uniqueCode = req.params.uniqueCode;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  const contact = await Models.Contact.findOne({ where: { userId: userId } });
  const theme = await Models.Subcategory.findOne({ where: { subcategoryUniqueCode: uniqueCode } });
  return res.render('front/pages/Temp/Birthday/templateReview1', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
    contact: contact,
  });
}


async function templateReviewBirthdayDownload(req, res) {
  //return res.status(200).send({"id":ab});
  // let userId = req.params.id;
  let userId = req.params.userId;
  let uniqueCode = req.params.uniqueCode;
  let contactId = req.params.contactId;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  const contact = await Models.Birthday.findOne({ where: { id: contactId } });
  const theme = await Models.Subcategory.findOne({ where: { subcategoryUniqueCode: uniqueCode } });
  return res.render('front/pages/Temp/Birthday/templateReviewDownload', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
    contact: contact,
    layout: false,
  });
}

async function templateReviewForAnniversary(req, res) {
  let userId = req.id;
  let uniqueCode = req.params.uniqueCode;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  const contact = await Models.Anniversary.findOne({ where: { userId: userId } });
  const theme = await Models.Subcategory.findOne({ where: { subcategoryUniqueCode: uniqueCode } });
  return res.render('front/pages/Temp/Anniversary/templateReview', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
    contact: contact,
  });
}

async function templateReviewForAnniversaryDownload(req, res) {
  let userId = req.params.userId;
  let uniqueCode = req.params.uniqueCode;
  let contactId = req.params.contactId;
  const userInfo = await Models.User.findOne({ where: { id: userId } });
  const contact = await Models.Anniversary.findOne({ where: { id: contactId } });
  const theme = await Models.Subcategory.findOne({ where: { subcategoryUniqueCode: uniqueCode } });
  return res.render('front/pages/Temp/Anniversary/templateReviewDownload', {
    page_name: 'template',
    userInfo: userInfo,
    theme: theme,
    contact: contact,
    layout: false,
  });
}


///ajax birthday theme set /////
async function setDefaultBirthdayImage(req, res) {
  let defaultBirthDayTheme = req.body.defaultBirthDayTheme;
  let userId = req.id;

  const updateDefaultBirthdayImage = {
    defaultBirthdayTheme: defaultBirthDayTheme,
  };
  let updateBirthdayImg = await Models.User.update(updateDefaultBirthdayImage, {
    where: { id: userId },
  });

  if (updateBirthdayImg) {
    return res.json({
      msg: 'Default Birthday Image update successfully',
    });
  } else {
    return res.json({
      msg: 'error',
    });
  }

}

///ajax anniversary theme set /////
async function setDefaultAnniversaryImage(req, res) {
  let defaultAnniversaryTheme = req.body.defaultAnniversaryTheme;
  let userId = req.id;

  const updateDefaultAnniversaryImage = {
    defaultAnniversaryTheme: defaultAnniversaryTheme,
  };
  let updateAnniversaryImg = await Models.User.update(updateDefaultAnniversaryImage, {
    where: { id: userId },
  });

  if (updateAnniversaryImg) {
    return res.json({
      msg: 'Default Anniversary Image updated successfully',
    });
  } else {
    return res.json({
      msg: 'error',
    });
  }

}

//ajax festival
async function getFestivalAjaxSort(req, res) {
  let festival_id = req.body.festival_id;
  var allfestivalResultSort ;
  if (festival_id != "all") {
    allfestivalResultSort = await Models.Subcategory.findAll({
      where: { festivalSubCategoryId: festival_id },
      include: [{
        model: Models.Festivalsubcategory,
      }]
    });
  }else{
    allfestivalResultSort = await Models.Subcategory.findAll({
      where: { categoryId: 3 },
      include: [{
        model: Models.Festivalsubcategory,
      }]
    });
  }
  console.log('hhhhh', allfestivalResultSort);
  return res.json({ msg: 'success', subcategorys: allfestivalResultSort });
}

module.exports = {
  templateSubmit: templateSubmit,
  templateSubmitAction: templateSubmitAction,
  templateReview1: templateReview1,
  templateReviewForAnniversary: templateReviewForAnniversary,
  setDefaultBirthdayImage: setDefaultBirthdayImage,
  setDefaultAnniversaryImage: setDefaultAnniversaryImage,
  getFestivalAjaxSort: getFestivalAjaxSort,
  templateReviewBirthdayDownload:templateReviewBirthdayDownload,
  templateReviewForAnniversaryDownload:templateReviewForAnniversaryDownload
};
