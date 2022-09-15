const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Models = require('../../models');
const Op = Sequelize.Op;

function adminLogin(req, res) {
  return res.render('admin/pages/Signin/signin', {
    page_name: 'admin-signin',
    layout: false,
  });
}

async function adminLoginAction(req, res) {
  
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
    return res.redirect('/admin/login');
  }
  //validation end
  const user = await Models.Admin.findOne({ where: { email: req.body.email } });

  if (user) {
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      var admintoken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.ADMINSECRET,
        {
          expiresIn: '1h', // expires in 1 hours
        }
      );
      console.log('kk')
      console.log('admin ',admintoken)
      res.cookie('admintoken', admintoken);
      return res.redirect('/admin/dashboard');
    } else {
      console.log('kk22')
      req.flash('error', 'Password Incorrect');
      return res.redirect('/admin/login');
    }
  } else {
    console.log('kk55')
    req.flash('error', 'Admin does not exist');
    return res.redirect('/admin/login');
  }
}

async function logout(req, res) {
  res.clearCookie('admintoken');
  req.flash('success', 'Logout Successfully');
  return res.redirect('/admin/login');
}


//register
async function adminSignupAction(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  //validation start
  const validator = new Validator();
  const validationResponse = validator.validate(
    {
      name: name,
      email: email,
      password: password,
    },
    {
      name: { type: 'string', empty: false, max: '100' },
      email: { type: 'string', empty: false, max: '100' },
      password: { type: 'string', empty: false, max: '100' },
    }
  );
  if (validationResponse !== true) {
    return res.status(404).send(validationResponse[0].message);
  }
  //validation end
  const salt = await bcrypt.genSalt(10);
  var adm = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  };
  var created_admin = await Models.Admin.create(adm);
  if (created_admin) {
    return res.status(200).send('admin created successfully');
  } else {
    return res.status(404).send('some problem');
  }
}
//

module.exports = {
    adminLogin: adminLogin,
    adminLoginAction: adminLoginAction,
    logout: logout,
    adminSignupAction:adminSignupAction,
};
