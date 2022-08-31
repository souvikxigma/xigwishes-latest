const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

async function anniversaryThemeList(req, res) {

  console.log("jik",loginAuthCheck);
    const allAnniversaryData = await Models.Subcategory.findAll({
        where: { categoryId: 2 },
        include: [{
          model: Models.Category,
          attributes: ["name"],
        }]
      });


    var allBirthdayThemeToArray=[];
    if(loginAuthCheck){
      var userinfo = await Models.User.findOne({where:{ id: loginAuthCheck }});
      if(userinfo.anniversaryThemes){
        allBirthdayThemeToArray = userinfo.anniversaryThemes.split(','); 
      }
    }
      // if (!allAnniversaryData) {
      //   req.flash('success', 'Themes not available');
      //   return res.redirect('/home');
      // }
      return res.render('front/pages/Anniversary/anniversarythemelist', {
        page_name: 'anniversary',
        theme: allAnniversaryData,
        allBirthdayThemeToArray: allBirthdayThemeToArray,
      });
}

// destructure
//const { email, firstName, lastName, password, confirmPassword } = req.body;

async function anniversaryList(req,res){
    var userId = req.id;
    const AnniversaryList = await Models.Birthday.findAll(
      {where:{userId:userId},
      order: [
        ["id", "DESC"],
      ]
      }
    );
    if (AnniversaryList) {
      return res.render('front/pages/Anniversary/anniversarylist', {
        page_name: 'anniversary',
        data: AnniversaryList,
      });
    }
}

async function addAnniversary(req, res) {
    return res.render('front/pages/Anniversary/addanniversary', {
      page_name: 'anniversary'
    });
}

async function addAnniversaryAction(req, res) {
  
  // var brideName = req.body.brideName;
  // var groomName = req.body.groomName;
  // var anniversaryday = req.body.anniversaryday;

  const { brideName, groomName, anniversaryday, email, mobile, companyName } = req.body;
  
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
    documentFile.mv('public/uploads/AnniversaryContact/' + imgname, function (err) {
      if (err) {
        req.flash('error', 'Image not uploaded');
        res.redirect('/user/profile');
      }
    });
  }
  //end image upload//

  const newContact = {
    userId: req.id,
    brideName: brideName,
    groomName: groomName,
    anniversaryday: format(anniversaryday),
    companyName: companyName,
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

async function setAnniversaryThemeAction(req,res){
 var uid = req.id;
  var user = await Models.User.findOne({where:{ id: uid }});
  var selectAnniversaryImage = req.body.uniquecode;

  if(!user.anniversaryThemes){
    const updateUser = {
      anniversaryThemes: selectAnniversaryImage,
    }
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: uid },
    });

    return res.json({
      msg: 'updated',
    });
  }else{

    var updatedSelectAnniversaryImage = user.anniversaryThemes+","+selectAnniversaryImage;
    const updateUser = {
      anniversaryThemes: updatedSelectAnniversaryImage,
    }
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: uid },
    });
    return res.json({
      msg: 'updated 2',
    });
  }

  //selectpackages.split(",").find(function(val){return val == "1";})

}

async function setAnniversaryRemoveThemeAction(req,res){
  var userid = req.id;
  // var userinfo = await Models.User.findOne({where:{ id: userid }});

  var allAnniversaryThemeToArra=[];
  var userinfo = await Models.User.findOne({where:{ id: userid }});
  if(userinfo.anniversaryThemes){
    allAnniversaryThemeToArra = userinfo.anniversaryThemes.split(','); 
  } 
  var allAnniversaryThemeToArray = allAnniversaryThemeToArra;

  var updatedAnniversaryThemesToArray = allAnniversaryThemeToArray.filter(e => e !== req.body.uniquecode);
  var updatedAnniversaryThemes;

 // console.log("final",updatedBirthdayThemesToArray);
  if(updatedAnniversaryThemesToArray.length){
    updatedAnniversaryThemes = updatedAnniversaryThemesToArray.toString();
  }else{
    updatedAnniversaryThemes = null
  }

  const updateUser = {
    anniversaryThemes: updatedAnniversaryThemes,
  }
  let updateInfo = await Models.User.update(updateUser, {
    where: { id: userid },
  });
  return res.json({
    msg: 'removed',
  });
}

async function userFavAnniversaryTheme(req,res){
  var userid = req.id;
  var allAnniversaryThemeToArray=[];
  var userinfo = await Models.User.findOne({where:{ id: userid }});
  if(userinfo.anniversaryThemes){
    allAnniversaryThemeToArray = userinfo.anniversaryThemes.split(','); 
  } 
  const allFavAnniversaryData = await Models.Subcategory.findAll({
    where: {
      [Op.and]: [{categoryId: 2}, {subcategoryUniqueCode: {[Op.in]: allAnniversaryThemeToArray}}]
    },
    include: [{
      model: Models.Category,
      attributes: ["name"],
    }]
  });

  console.log(allFavAnniversaryData.length);

  //
  return res.render('front/pages/Anniversary/favanniversarytheme', {
    page_name: 'anniversary',
    theme: allFavAnniversaryData,
    //allBirthdayThemeToArray: allBirthdayThemeToArray,
  });

}

module.exports = {
  anniversaryThemeList: anniversaryThemeList,
  anniversaryList: anniversaryList,
  addAnniversary: addAnniversary,
  addAnniversaryAction: addAnniversaryAction,
  userFavAnniversaryTheme: userFavAnniversaryTheme,

  //ajax//
  setAnniversaryThemeAction: setAnniversaryThemeAction,
  setAnniversaryRemoveThemeAction: setAnniversaryRemoveThemeAction,

};
