const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


async function adminDashboard(req, res) {

  const testimonialCount = await Models.Testimonial.count({});
  var usersActiveCount = await Models.User.count({where:{accountActiveStatus:'1'}});
  var themeCount = await Models.Theme.count({where:{status:'1'}});

  return res.render('admin/pages/Dashboard/dashboard', {
    page_name: 'admin-dashboard',
    layout: 'admin/layouts/adminlayout',
    testimonialCount: testimonialCount,
    usersActiveCount:usersActiveCount,
    themeCount:themeCount
  });
}


module.exports = {
    adminDashboard: adminDashboard,
};