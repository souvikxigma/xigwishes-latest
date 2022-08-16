const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
const nodemailer = require("nodemailer");
var {customDateFormat,customDateAdd} = require('../../helpers/format');
var {generateRandomToken} = require('../../helpers/generateToken');

function signup(req, res) {

  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('info',req.protocol + '://' + req.get('host'));

  return res.render('front/pages/Auth/signup', {
    page_name: 'signup',
    layout: 'front/layouts/authlayout',
  });
}

async function signupAction(req, res) {
  var emailtokentemp = generateRandomToken();
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var emailtoken = emailtokentemp;
  var mobile = req.body.mobile;
  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      name: name,
      email: email,
      password: password,
      mobile: mobile,
    },
    {
      name: { type: 'string', empty: false, max: '100' },
      email: { type: 'string', empty: false, max: '100' },
      password: { type: 'string', empty: false, max: '100' },
      mobile: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    return res.redirect('/signup');
  }
  //validation end
  const salt = await bcrypt.genSalt(10);
  var AdminInfo = await Models.Admin.findOne({});
  var trialDays = AdminInfo.trialDays;

  var date = new Date(); // Now
  var accountExpireDate = customDateAdd(date,trialDays)

  // var furl = process.env.BASE_URL;
  // var baseurl = process.env.BASE_URL;
  // if(process.env.APP_PRODUCTION_MODE){
  //   baseurl = process.env.LIVE_BASE_URL;
  // }
  let basepath = req.protocol + '://' + req.get('host');
 
  var usr = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
    emailToken: emailtoken,
    mobile: req.body.mobile,
    accountExpireDate:accountExpireDate
  };
  var created_user = await Models.User.create(usr);
  if (created_user) {
    //mail//
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASSWORD,
      },
    });

    let info = transporter.sendMail({
      from: process.env.MAIL_AUTH_USER,
      to: req.body.email,
      subject: `Xigwish Account Activation Mail`,
      //text: 'hi xigwish',
      html: `<div style="height:150px"><p style="font-size: 18px;">Please click this button to activate your account</p><br/>
      <a style="text-decoration:none;border:1px solid beige;border-radius:10px;background-color:#e67e22;color:white;padding:12px;" href="${basepath}/email/verification/${emailtoken}/${req.body.email}">verification link</a></div>`
    });
    ///////
    req.flash('success', 'User added successfully');
    return res.redirect('/login');
  } else {
    req.flash('error', 'User not added successfully');
    return res.redirect('/signup');
  }
}

function login(req, res) {
  return res.render('front/pages/Auth/signin', {
    page_name: 'signin',
    layout: 'front/layouts/authlayout',
  });
}

async function loginAction(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      email: email,
      password: password,
    },
    {
      email: { type: 'string', empty: false, max: '100' },
      password: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    return res.redirect('/login');
  }
  //validation end
  const user = await Models.User.findOne({ where: { email: req.body.email } });

  if (user) {
    if(user.emailVerification == 0){
      req.flash('error', 'Please verify your email');
      return res.redirect('/login')
    }
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      var token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
        },
        process.env.SECRET,
        {
          expiresIn: '1h', // expires in 1 hours
        }
      );
      res.cookie('token', token);
      
   

      var today = customDateFormat(new Date());

      if(today > user.accountExpireDate){
        await user.update({ accountActiveStatus: '0'});
      }

      return res.redirect('/contact');
    } else {
      req.flash('error', 'Password Incorrect');
      return res.redirect('/login');
    }
  } else {
    req.flash('error', 'User does not exist');
    return res.redirect('/login');
  }
}

async function profile(req, res) {
  const userId = req.id;
  let userInfo = await Models.User.findOne({ where: { id: req.id } });
  if (userInfo) {
    return res.render('front/pages/Profile/profile', {
      page_name: 'profile',
      data: userInfo,
    });
  } else {
    req.flash('error', 'Profile can not be updated');
    return res.redirect('/user/profile');
  }
}

async function profileUpdate(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var companyName = req.body.companyName;
  var homeAddress = req.body.homeAddress;
  var officeAddress = req.body.officeAddress;
  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      name: name,
      email: email,
      mobile: mobile,
    },
    {
      name: { type: 'string', empty: false, max: '100' },
      email: { type: 'string', empty: false, max: '100' },
      mobile: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    req.flash('error', validationResponse[0].message);
    res.redirect('/user/profile');
  }
  //validation end
  const userId = req.id;
  //image upload//
  if (req.files && req.files.companyLogo) {
    var documentFile = req.files.companyLogo;
    var imgString = documentFile.name;
    var imgArr = imgString.split('.');
    var imgname = 'company-logo-' + Date.now() + '.' + imgArr[1];
    documentFile.mv('public/uploads/companyLogo/' + imgname, function (err) {
      if (err) {
        req.flash('error', 'Image not uploaded');
        res.redirect('/user/profile');
      }
    });
  }
  //end image upload//
  const updateUser = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    companyName: req.body.companyName,
    companyLogo: imgname,
    homeAddress: req.body.homeAddress,
    officeAddress: req.body.officeAddress,
    //
    service1: req.body.service1 ? req.body.service1 : null,
    service2: req.body.service2 ? req.body.service2 : null,
    service3: req.body.service3 ? req.body.service3 : null,
  };
  let updateInfo = await Models.User.update(updateUser, {
    where: { id: userId },
  });
  if (updateInfo) {
    req.flash('success', 'Profile updated Successfully');
    res.redirect('/user/profile');
  } else {
    req.flash('error', 'Profile is not updated');
    res.redirect('/user/profile');
  }
}

async function emailVerification(req,res){
  let emailtoken = req.params.token;
  let emailid = req.params.emailid;
  let basepath = req.protocol + '://' + req.get('host');

  let userInfo = await Models.User.findOne({ where: { email: emailid } });
  if(!userInfo.emailToken){
    req.flash('error', 'You have already verified your account');
    return res.redirect('/login');
  }
  let dbToken = userInfo.emailToken;
  if(dbToken == emailtoken){
    const updateUser = {
      emailVerification: '1',
      emailToken: null
    };
  
    let updateInfo = await Models.User.update(updateUser, {
      where: { id: userInfo.id },
    });

    //mail//
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASSWORD,
      },
    });

    let info = transporter.sendMail({
      from: process.env.MAIL_AUTH_USER,
      to: userInfo.email,
      subject: `Xigwish Account Activated Mail`,
      //text: 'hi xigwish',
      html: `<div style="height:150px"><p style="font-size: 18px;">Account successfully activated.</p><br/>
      <p>Click here to login <a style="text-decoration:none;border:1px solid beige;border-radius:10px;background-color:#e67e22;color:white;padding:12px;" href="${basepath}">Login</a></p></div>`
    });
    ///////

    req.flash('success', 'Email Verification Completed.Now you can login your account');
    return res.redirect('/login');

  }else{
    req.flash('error', 'Email Verification is not Completed');
    return res.redirect('/login');
  }
}

async function logout(req, res) {
  res.clearCookie();
  req.flash('success', 'Logout Successfully');
  return res.redirect('/login');
}



module.exports = {
  signup: signup,
  signupAction: signupAction,
  login: login,
  loginAction: loginAction,
  logout: logout,
  profile: profile,
  profileUpdate: profileUpdate,
  emailVerification: emailVerification,
};
