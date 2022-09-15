const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


async function adminEditCompany(req, res) {
  const company = await Models.Company.findOne({});
  if (company) {
    return res.render('admin/pages/Company/editcompany', {
      page_name: 'admin-company',
      layout: 'admin/layouts/adminlayout',
      data: company,
    });
  }
}

async function adminEditCompanyAction(req, res) {
  var id = req.params.id;  
  let companyData = {
    name: req.body.name,
    tag: req.body.tag,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
  };

  var update_company = await Models.Company.update(companyData,{ where: { id: id } });
  if (update_company) {
    req.flash('success', 'Company updated successfully');
    return res.redirect(`/admin/company`);
  } else {
    req.flash('error', 'Company is not updated ');
    return res.redirect(`/admin/company`);
  }
}

module.exports = {
  adminEditCompany: adminEditCompany,
  adminEditCompanyAction: adminEditCompanyAction,
};
