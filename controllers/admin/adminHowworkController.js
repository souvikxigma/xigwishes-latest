const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminHowworkList(req, res) {
  const allhowwork = await Models.Howwork.findAll({});
  if (allhowwork) {
    return res.render('admin/pages/Howwork/howworklist', {
      page_name: 'admin-howwork',
      layout: 'admin/layouts/adminlayout',
      data: allhowwork,
    });
  }
}

async function adminAddHowwork(req, res) {
  return res.render('admin/pages/Howwork/addhowwork', {
    page_name: 'admin-howwork',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddHowworkAction(req, res) {
  let howworkData = {
    description: req.body.description,
  };

  var created_howwork = await Models.Howwork.create(howworkData);
  if (created_howwork) {
    req.flash('success', 'How it work added successfully');
    return res.redirect('/admin/howwork/add');
  } else {
    req.flash('error', 'How it work is not added ');
    return res.redirect('/admin/howwork/add');
  }
}

async function adminEditHowwork(req, res) {
  var id = req.params.id;
  const howwork = await Models.Howwork.findOne({ where:{id: id} });
  if (howwork) {
    return res.render('admin/pages/Howwork/edithowwork', {
      page_name: 'admin-howwork',
      layout: 'admin/layouts/adminlayout',
      data: howwork,
    });
  }
}

async function adminEditHowworkAction(req, res) {
  var id = req.params.id;  
  let howworkData = {
    description: req.body.description,
  };

  var update_howwork = await Models.Howwork.update(howworkData,{ where: { id: id } });
  if (update_howwork) {
    req.flash('success', 'How it work updated successfully');
    return res.redirect(`/admin/howwork/edit/${id}`);
  } else {
    req.flash('error', 'How it work is not updated ');
    return res.redirect(`/admin/howwork/edit/${id}`);
  }
}

async function adminDeleteHowworkAction(req, res) {
    var id = req.params.id;  
    var delete_howwork = await Models.Howwork.destroy({ where: { id: id } });
    if (delete_howwork) {
      req.flash('success', 'How it work deleted successfully');
      return res.redirect(`/admin/howwork`);
    } else {
      req.flash('error', 'How it work is not deleted ');
      return res.redirect(`/admin/howwork`);
    }
  }

module.exports = {
  adminHowworkList: adminHowworkList,
  adminAddHowwork: adminAddHowwork,
  adminAddHowworkAction: adminAddHowworkAction,
  adminEditHowwork: adminEditHowwork,
  adminEditHowworkAction: adminEditHowworkAction,
  adminDeleteHowworkAction : adminDeleteHowworkAction
};
