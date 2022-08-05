const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
var {customDateFormat,customDateAdd} = require('../../helpers/format');

function signup(req, res) {
  return res.render('front/pages/Auth/signup', {
    page_name: 'signup',
    layout: 'front/layouts/authlayout',
  });
}

async function signupAction(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
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

 
  var usr = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
    mobile: req.body.mobile,
    accountExpireDate:accountExpireDate
  };
  var created_user = await Models.User.create(usr);
  if (created_user) {
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
};
