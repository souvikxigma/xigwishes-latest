const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

function home(req, res) {
  console.log(loginAuthCheck);
  return res.render('front/pages/Home/home', {
    page_name: 'home',
  });
  //console.log('home tok: ',req.cookies.token);
  //var usertoken = req.cookies.token;
  
}

module.exports = {
  home: home,
};
