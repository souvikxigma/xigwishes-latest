const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


function adminDashboard(req, res) {
  return res.render('admin/pages/Dashboard/dashboard', {
    page_name: 'admin-dashboard',
    layout: 'admin/layouts/adminlayout'
  });
}


module.exports = {
    adminDashboard: adminDashboard,
};