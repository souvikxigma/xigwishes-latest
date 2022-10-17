const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminCmsList(req, res) {
  const allcms = await Models.Cms.findAll({});
  if (allcms) {
    return res.render('admin/pages/Cms/cmslist', {
      page_name: 'admin-cms',
      layout: 'admin/layouts/adminlayout',
      data: allcms,
    });
  }
}

async function adminAddCms(req, res) {
  return res.render('admin/pages/Cms/addcms', {
    page_name: 'admin-cms',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddCmsAction(req, res) {
  let cmsData = {
    type: req.body.type,
    description: req.body.description,
  };

  var created_cms = await Models.Cms.create(cmsData);
  if (created_cms) {
    req.flash('success', 'Cms added successfully');
    return res.redirect('/admin/cms/add');
  } else {
    req.flash('error', 'Cms is not added ');
    return res.redirect('/admin/cms/add');
  }
}

async function adminEditCms(req, res) {
  var id = req.params.id;
  const cms = await Models.Cms.findOne({ where:{id: id} });
  if (cms) {
    return res.render('admin/pages/Cms/editcms', {
      page_name: 'admin-cms',
      layout: 'admin/layouts/adminlayout',
      data: cms,
    });
  }
}

async function adminEditCmsAction(req, res) {
  var id = req.params.id;  
  let cmsData = {
    type: req.body.type,
    description: req.body.description,
  };

  var update_cms = await Models.Cms.update(cmsData,{ where: { id: id } });
  if (update_cms) {
    req.flash('success', 'Cms updated successfully');
    return res.redirect(`/admin/cms/edit/${id}`);
  } else {
    req.flash('error', 'Cms is not updated ');
    return res.redirect(`/admin/cms/edit/${id}`);
  }
}

async function adminDeleteCmsAction(req, res) {
    var id = req.params.id;  
    var delete_cms = await Models.Cms.destroy({ where: { id: id } });
    if (delete_cms) {
      req.flash('success', 'Cms deleted successfully');
      return res.redirect(`/admin/cms`);
    } else {
      req.flash('error', 'Cms is not deleted ');
      return res.redirect(`/admin/cms`);
    }
  }

module.exports = {
  adminCmsList: adminCmsList,
  adminAddCms: adminAddCms,
  adminAddCmsAction: adminAddCmsAction,
  adminEditCms: adminEditCms,
  adminEditCmsAction: adminEditCmsAction,
  adminDeleteCmsAction : adminDeleteCmsAction
};
