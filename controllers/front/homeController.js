const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

function home(req, res) {
  return res.render('front/pages/Home/home', {
    page_name: 'signup',
  });
}

module.exports = {
  home: home,
};
