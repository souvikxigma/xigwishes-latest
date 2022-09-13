const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
const nodemailer = require('nodemailer');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const passport = require('passport');
var randtoken = require('rand-token');
var { customDateFormat, customDateAdd } = require('../../helpers/format');
var { generateRandomToken } = require('../../helpers/generateToken');
var { sendResetEmail } = require('../../helpers/sendResetPasswordEmail');


function signup(req, res) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('info', req.protocol + '://' + req.get('host'));

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
    return res.redirect('/home');
  }

  var allreadyuser = await Models.User.findOne({ where: { email: email } });
  if (allreadyuser) {
    req.flash('error', 'email id has been used.please use another one');
    return res.redirect('/home');
  }

  //validation end
  const salt = await bcrypt.genSalt(10);
  var AdminInfo = await Models.Admin.findOne({});
  var trialDays = AdminInfo.trialDays;

  var date = new Date(); // Now
  var accountExpireDate = customDateAdd(date, trialDays);

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
    accountExpireDate: accountExpireDate,
  };
  var created_user = await Models.User.create(usr);
  if (created_user) {
    //mail//
    // const transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   port: process.env.MAIL_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.MAIL_AUTH_USER,
    //     pass: process.env.MAIL_AUTH_PASSWORD,
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'souvik.hajra@xigmapro.com',
        pass: 'xigma123'
      }
    });

    let info = transporter.sendMail({
      // from: process.env.MAIL_AUTH_USER,
      from: 'souvik.hajra@xigmapro.com',
      to: req.body.email,
      subject: `Xigwish Account Activation Mail`,
      //text: 'hi xigwish',
      html: `<div style="height:150px"><p style="font-size: 18px;">Please click this button to activate your account</p><br/>
      <a style="text-decoration:none;border:1px solid beige;border-radius:10px;background-color:#e67e22;color:white;padding:12px;" href="${process.env.BASE_URL}/email/verification/${emailtoken}/${req.body.email}">verification link</a></div>`,
    });
    ///////
    req.flash('success', 'User added successfully');
    // return res.redirect('/login');
    return res.redirect('/home');
  } else {
    req.flash('error', 'User not added successfully');
    // return res.redirect('/signup');
    return res.redirect('/home');
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
    return res.redirect('back');
  }
  //validation end
  const user = await Models.User.findOne({ where: { email: req.body.email } });
  console.log(user);

  if (user) {
    var today = customDateFormat(new Date());

    // if (today > user.accountExpireDate) {
    //   await user.update({ accountActiveStatus: '0' });
    //   req.flash('error', 'Your account is expired');
    //   return res.redirect('back');
    // }

    if (user.emailVerification == '0') {
      req.flash('error', 'Please verify your email');
      return res.redirect('back');
    }
    // if (user.accountActiveStatus == '0') {
    //   req.flash('error', 'Your account is expired');
    //   return res.redirect('back');
    // }
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      var token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.SECRET,
        {
          expiresIn: '1h', // expires in 1 hours
        }
      );
      res.cookie('token', token);
      res.cookie('userID', user.id);
      // res.cookie('userName', user.id);
      res.cookie('userEmail', user.email);
      global.loginAuthCheck = user.id;
      // loginAuthCheck = 1;

     

      //return res.redirect('/contact');
      return res.redirect('/home');
    } else {
      req.flash('error', 'Password Incorrect');
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'User does not exist');
    return res.redirect('back');
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
    return res.redirect('/profile');
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
    res.redirect('/profile');
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
        res.redirect('/profile');
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
    res.redirect('/profile');
  } else {
    req.flash('error', 'Profile is not updated');
    res.redirect('/profile');
  }
}
/*change password view */
async function changePasswordView(req,res){
  return res.render('front/pages/Auth/changepassword', {
    page_name: 'change-password',
    //layout: false,
  });
}

/*change password action */
async function changePasswordAction(req,res){
  var currentpassword = req.body.currentpassword;
  var newpassword = req.body.newpassword;
  var renewpassword = req.body.renewpassword;

  let userInfo = await Models.User.findOne({ where: { id: req.id } });

  console.log(currentpassword);
  console.log(userInfo.password);

  if(!userInfo){
    req.flash('error', 'User not found');
    res.redirect('/change-password');
  }

  const password_valid = await bcrypt.compare(
    currentpassword,
    userInfo.password
  );

  if(password_valid){
    if(newpassword == renewpassword){
      var saltRounds = 10;
      bcrypt.genSalt(saltRounds,  function (err, salt) {
        bcrypt.hash(newpassword, salt, async function (err, hash) {
          var data = {
            password: hash
          }
          let updateInfo = await Models.User.update(data, {
            where: { id: req.id },
          });
        });
      });
      req.flash('success', 'Password changed successfully');
      res.redirect('/change-password');
    }else{
      req.flash('error', 'new and re new password is not same ');
    res.redirect('/change-password');
    }
  }else{
    req.flash('error', 'you have entered wrong current password');
    res.redirect('/change-password');
  }

}


async function emailVerification(req, res) {
  let emailtoken = req.params.token;
  let emailid = req.params.emailid;
  let basepath = req.protocol + '://' + req.get('host');

  let userInfo = await Models.User.findOne({ where: { email: emailid } });
  if (!userInfo.emailToken) {
    req.flash('error', 'You have already verified your account');
    return res.redirect('/login');
  }
  let dbToken = userInfo.emailToken;
  if (dbToken == emailtoken) {
    const updateUser = {
      emailVerification: '1',
      emailToken: null,
    };

    let updateInfo = await Models.User.update(updateUser, {
      where: { id: userInfo.id },
    });

    //mail//
    // const transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   port: process.env.MAIL_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.MAIL_AUTH_USER,
    //     pass: process.env.MAIL_AUTH_PASSWORD,
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'souvik.hajra@xigmapro.com',
        pass: 'xigma123'
      }
    });

    let info = transporter.sendMail({
      //from: process.env.MAIL_AUTH_USER,
      from: 'souvik.hajra@xigmapro.com',
      to: userInfo.email,
      subject: `Xigwish Account Activated Mail`,
      //text: 'hi xigwish',
      html: `<div style="height:150px"><p style="font-size: 18px;">Account successfully activated.</p><br/>
      <p>Click here to login <a style="text-decoration:none;border:1px solid beige;border-radius:10px;background-color:#e67e22;color:white;padding:12px;" href="${process.env.BASE_URL}">Login</a></p></div>`,
    });
    ///////

    req.flash(
      'success',
      'Email Verification Completed.Now you can login your account'
    );
    // return res.redirect('/login');
    return res.redirect('/home');
  } else {
    req.flash('error', 'Email Verification is not Completed');
    // return res.redirect('/login');
    return res.redirect('/home');
  }
}
//forget password//
async function forgetPasswordView(req, res) {
  var email = req.body.email;
  var userInfo = await Models.User.findOne({ where: { email: email } });
  if (!userInfo) {
    req.flash('error', 'No User Found');
    return res.redirect('/home');
  }

  ////
  var type = ''
  var msg = ''
  var forgetpasswordtoken = randtoken.generate(20);
  var sent = sendResetEmail(email, forgetpasswordtoken);
  if (sent != '0') {
    var data = {
      forgetPassword: forgetpasswordtoken
    }
    let updateInfo = await Models.User.update(data, {
      where: { email: email },
    });

    type = 'success';
    msg = 'The reset password link has been sent to your email address';
  } else {
    type = 'error';
    msg = 'Something goes to wrong. Please try again';
  }
  req.flash(type, msg);
  res.redirect('/home');

}

/* reset page */

async function resetPasswordView(req, res) {
  res.render('front/pages/Auth/reset', {
    page_name: 'reset password page',
    title: 'Reset Password Page',
    token: req.query.token,
    layout: false,
  });
}

async function updateResetPassword(req, res) {
  console.log(req.body);
  var token = req.body.token;
  var password = req.body.password;
  var userInfo = await Models.User.findOne({ where: { forgetPassword: token } });
  if (!userInfo) {
    req.flash('error', 'Invalid link; please try again');
    return res.redirect('/reset-password');
  }

  var saltRounds = 10;
  bcrypt.genSalt(saltRounds,  function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      var data = {
        password: hash,
        forgetPassword: null
      }
      let updateInfo = await Models.User.update(data, {
        where: { email: userInfo.email },
      });
    });
  });

  req.flash('success', 'Your password has been updated successfully');
  return res.redirect('/reset-password');
}

async function logout(req, res) {
  // res.clearCookie();
  res.clearCookie('token');
  res.clearCookie('userID');
  res.clearCookie('userEmail');
  // global.loginAuthCheck = 0;
  req.flash('success', 'Logout Successfully');
  return res.redirect('/home');
}


//social login//
async function authGoogleCallbackSuccess(req, res) {
    if (!req.user) res.redirect('/auth/google/callback/failure');
    // console.log(req.user);
    var authprovider = req.user.provider;
    var authid = req.user.id;
    var displayName = req.user.displayName;
    var email = req.user.email;

    var checkEmail = await Models.User.findOne({ where: { email: email } });
    if (checkEmail) {
        if (checkEmail.authprovider == null) {
            // general login
            req.flash('error', 'Allready Registered with this email. ');
            return res.redirect('/home');
        } else if (checkEmail.authprovider == 'facebook') {
            // gmail login
            req.flash('error', 'Allready Registered this email with facebook login. ');
            return res.redirect('/home');
        } else if (checkEmail.authprovider == 'google' && checkEmail.authid == req.user.id) {
            // facebook login//
            var token = jwt.sign(
                {
                    id: checkEmail.id,
                    email: email,
                    name: checkEmail.name,
                },
                process.env.SECRET,
                {
                    expiresIn: '1h', // expires in 1 hours
                }
            );
            res.cookie('token', token);
            res.cookie('userID', checkEmail.id);
            // res.cookie('userName', user.id);
            res.cookie('userEmail', email);
            global.loginAuthCheck = checkEmail.id;
            //
            req.flash('success', 'Login successful ');
            return res.redirect('/home');

        } else {
            req.flash('error', 'Something went wrong');
            return res.redirect('/home');
        }
    } else {
        // facebook register//
        var AdminInfo = await Models.Admin.findOne({});
        var trialDays = AdminInfo.trialDays;

        var date = new Date(); // Now
        var accountExpireDate = customDateAdd(date, trialDays);

        var usr = {
            name: displayName,
            email: email,
            authprovider: authprovider,
            authid: authid,
            accountExpireDate: accountExpireDate,
        };
        var created_user = await Models.User.create(usr);

        if (created_user) {
            var token = jwt.sign(
                {
                    id: created_user.id,
                    email: email,
                    name: displayName,
                },
                process.env.SECRET,
                {
                    expiresIn: '1h', // expires in 1 hours
                }
            );
            res.cookie('token', token);
            res.cookie('userID', created_user.id);
            // res.cookie('userName', user.id);
            res.cookie('userEmail', email);
            global.loginAuthCheck = created_user.id;
            //
            req.flash('success', 'Login successful ');
            return res.redirect('/home');
        }
        // end facebook register//
    }

}
function authGoogleCallbackFailure(req, res) {
  res.send('Error');
}

//facebook

async function authFacebookCallbackSuccess(req, res) {
    if (!req.user) {
        res.redirect('/auth/facebook/callback/failure');
    }
    //////////////
    var authprovider = req.user.provider;
    var authid = req.user.id;
    var displayName = req.user.displayName;
    var email = req.user.emails[0].value;

    var checkEmail = await Models.User.findOne({ where: { email: email } });
    if (checkEmail) {
        if (checkEmail.authprovider == null) {
            // general login
            req.flash('error', 'Allready Registered with this email. ');
            return res.redirect('/home');
        } else if (checkEmail.authprovider == 'google') {
            // gmail login
            req.flash('error', 'Allready Registered this email with google login. ');
            return res.redirect('/home');
        } else if (checkEmail.authprovider == 'facebook' && checkEmail.authid == req.user.id) {
            // facebook login//
            var token = jwt.sign(
                {
                    id: checkEmail.id,
                    email: email,
                    name: checkEmail.name,
                },
                process.env.SECRET,
                {
                    expiresIn: '1h', // expires in 1 hours
                }
            );
            res.cookie('token', token);
            res.cookie('userID', checkEmail.id);
            // res.cookie('userName', user.id);
            res.cookie('userEmail', email);
            global.loginAuthCheck = checkEmail.id;
            //
            req.flash('success', 'Login successful ');
            return res.redirect('/home');

        } else {
            req.flash('error', 'Something went wrong');
            return res.redirect('/home');
        }
    } else {
        // facebook register//
        var AdminInfo = await Models.Admin.findOne({});
        var trialDays = AdminInfo.trialDays;

        var date = new Date(); // Now
        var accountExpireDate = customDateAdd(date, trialDays);

        var usr = {
            name: displayName,
            email: email,
            authprovider: authprovider,
            authid: authid,
            accountExpireDate: accountExpireDate,
        };
        var created_user = await Models.User.create(usr);

        if (created_user) {
            var token = jwt.sign(
                {
                    id: created_user.id,
                    email: email,
                    name: displayName,
                },
                process.env.SECRET,
                {
                    expiresIn: '1h', // expires in 1 hours
                }
            );
            res.cookie('token', token);
            res.cookie('userID', created_user.id);
            // res.cookie('userName', user.id);
            res.cookie('userEmail', email);
            global.loginAuthCheck = created_user.id;
            //
            req.flash('success', 'Login successful ');
            return res.redirect('/home');
        }
        // end facebook register//
    }

}

function authFacebookCallbackFailure(req, res) {
  res.send('Error');
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
  forgetPasswordView: forgetPasswordView,
  resetPasswordView: resetPasswordView,
  updateResetPassword: updateResetPassword,
  changePasswordView: changePasswordView,
  changePasswordAction: changePasswordAction,

  //google auth//
  authGoogleCallbackSuccess: authGoogleCallbackSuccess,
  authGoogleCallbackFailure: authGoogleCallbackFailure,
  //fb auth//
  authFacebookCallbackSuccess: authFacebookCallbackSuccess,
  authFacebookCallbackFailure: authFacebookCallbackFailure,
};
