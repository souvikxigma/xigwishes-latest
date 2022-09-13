const Validator = require('fastest-validator');
var format = require('date-format');
const { localsName } = require('ejs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Models = require('../../models');
const { userInfo } = require('os');


async function birthdayThemeList(req,res){    
    const allBirthdayData = await Models.Subcategory.findAll({
      where: { categoryId: 1 },
      include: [{
        model: Models.Category,
        attributes: ["name"],
      }]
    });
    console.log('hi');

    var allBirthdayThemeToArray=[];
    if(loginAuthCheck){
      var userinfo = await Models.User.findOne({where:{ id: loginAuthCheck }});
      if(userinfo.birthdayThemes){
        console.log('bye');
        allBirthdayThemeToArray = userinfo.birthdayThemes.split(','); 
      }
    }
   
    console.log('hello');
  
    // if (!allBirthdayData) {
    //   req.flash('success', 'Themes not available');
    //   return res.redirect('/home');
    // }
    return res.render('front/pages/Birthday/birthdaythemelist', {
      page_name: 'birthday',
      theme: allBirthdayData,
      allBirthdayThemeToArray: allBirthdayThemeToArray,
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
      return res.render('front/pages/Birthday/birthdaylist', {
        page_name: 'birthday',
        data: BirthdayList,
      });
    }
  }

  async function addBirthday(req, res) {
    //const categoryList = await Models.Category.findAll({});
    return res.render('front/pages/Birthday/addbirthday', {
      page_name: 'birthday'
    });
  }

  
async function addBirthdayAction(req, res) {
    // var name = req.body.name;
    // var birthday = req.body.birthday;
    // var gender = req.body.gender;
    // var email = req.body.email;
    // var mobile = req.body.mobile;

    const { name, birthday, gender, email, mobile, companyName } = req.body;

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
      name: name,
      birthday: format(birthday),
      companyName: companyName,
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

  async function setBirthdayThemeAction(req,res){
    //console.log(req.body.uniquecode);
    var user = await Models.User.findOne({where:{ id: loginAuthCheck }});
    var selectBirthdayImage = req.body.uniquecode;

    // console.log(user.birthdayThemes.split(',').length == 5);
    // return false;
    // if(user.birthdayThemes.split(',').length == 3){
    //   return res.json({
    //     msg: 'user maximum selected 3 themes',
    //     scode: 1,
    //   });
    // }

    if(!user.birthdayThemes){  
      const updateUser = {
        birthdayThemes: selectBirthdayImage,
      }
      let updateInfo = await Models.User.update(updateUser, {
        where: { id: loginAuthCheck },
      });
  
      return res.json({
        msg: 'updated',
        scode: 2,
      });
    }else if(user.birthdayThemes && user.birthdayThemes.split(',').length == 3){
      return res.json({
        msg: 'user maximum selected 3 themes',
        scode: 1,
      });
    }else{
      var updatedSelectBirthdayImage = user.birthdayThemes+","+selectBirthdayImage;
      const updateUser = {
        birthdayThemes: updatedSelectBirthdayImage,
      }
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

  async function setBirthdayRemoveThemeAction(req,res){
    var userid = req.id;
    // var userinfo = await Models.User.findOne({where:{ id: userid }});

    var allBirthdayThemeToArra=[];
    var userinfo = await Models.User.findOne({where:{ id: userid }});
    if(userinfo.birthdayThemes){
      allBirthdayThemeToArra = userinfo.birthdayThemes.split(','); 
    } 
    var allBirthdayThemeToArray = allBirthdayThemeToArra;

    var updatedBirthdayThemesToArray = allBirthdayThemeToArray.filter(e => e !== req.body.uniquecode);
    var updatedBirthdayThemes;

   // console.log("final",updatedBirthdayThemesToArray);
    if(updatedBirthdayThemesToArray.length){
      updatedBirthdayThemes = updatedBirthdayThemesToArray.toString();
    }else{
      updatedBirthdayThemes = null
    }

    const updateUser = {
      birthdayThemes: updatedBirthdayThemes,
    }
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: userid },
    });
    return res.json({
      msg: 'removed',
    });

    
  }

  async function userFavBirthdayTheme(req,res){
    var userid = req.id;
    var allBirthdayThemeToArray=[];
    var userinfo = await Models.User.findOne({where:{ id: userid }});
    if(userinfo.birthdayThemes){
      allBirthdayThemeToArray = userinfo.birthdayThemes.split(','); 
    } 

    // const allBirthdayData = await Models.Subcategory.findAll({
    //   where: { categoryId: 1 },  //and 
    //   where: { subcategoryUniqueCode: {[Op.in]: allBirthdayThemeToArray} },
    //   include: [{
    //     model: Models.Category,
    //     attributes: ["name"],
    //   }]
    // });

    const allFavBirthdayData = await Models.Subcategory.findAll({
      where: {
        [Op.and]: [{categoryId: 1}, {subcategoryUniqueCode: {[Op.in]: allBirthdayThemeToArray}}]
      },
      include: [{
        model: Models.Category,
        attributes: ["name"],
      }]
    });

    console.log(allFavBirthdayData.length);

    //
    return res.render('front/pages/Birthday/favbirthdaytheme', {
      page_name: 'birthday',
      theme: allFavBirthdayData,
      //allBirthdayThemeToArray: allBirthdayThemeToArray,
    });



  }

  module.exports = {
    ///birthday///
    birthdayThemeList: birthdayThemeList,
    birthdayList: birthdayList,
    addBirthday: addBirthday,
    addBirthdayAction: addBirthdayAction,

    setBirthdayThemeAction: setBirthdayThemeAction,
    setBirthdayRemoveThemeAction: setBirthdayRemoveThemeAction,

    userFavBirthdayTheme: userFavBirthdayTheme,

  }