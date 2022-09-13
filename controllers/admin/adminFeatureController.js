const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminFeatureList(req, res) {
  const allfeature = await Models.Feature.findAll({});
  return res.render('admin/pages/Feature/featurelist', {
    page_name: 'admin-feature',
    layout: 'admin/layouts/adminlayout',
    data: allfeature,
  });
}

async function adminAddFeature(req, res) {
  return res.render('admin/pages/Feature/addfeature', {
    page_name: 'admin-feature',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddFeatureAction(req, res) {
  if(req.files && req.files.image){
    var documentFile = req.files.image;
    var imgString = documentFile.name;
    var imgArr = imgString.split(".");
    var imgname = "feature-" + Date.now() + "." + imgArr[1];
    documentFile.mv("public/uploads/feature/" + imgname, function (err) {
        if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/admin/feature/add`);
        }
    });

  }
  let featureData = {
    title: req.body.title,
    description: req.body.description,
  };
  if(imgname){
    featureData = {
      title: req.body.title,
      description: req.body.description,
      image: imgname,
    };
  }

  var created_feature = await Models.Feature.create(featureData);
  if (created_feature) {
    req.flash('success', 'Feature added successfully');
    return res.redirect('/admin/feature/add');
  } else {
    req.flash('error', 'Feature is not added ');
    return res.redirect('/admin/feature/add');
  }
}

async function adminEditFeature(req, res) {
  var id = req.params.id;
  const feature = await Models.Feature.findOne({where:{ id: id }});
  if (feature) {
    return res.render('admin/pages/Feature/editfeature', {
      page_name: 'admin-feature',
      layout: 'admin/layouts/adminlayout',
      data: feature,
    });
  }
}

async function adminEditFeatureAction(req, res) {
  var id = req.params.id;
  if(req.files && req.files.image){
    var documentFile = req.files.image;
    var imgString = documentFile.name;
    var imgArr = imgString.split(".");
    var imgname = "feature-" + Date.now() + "." + imgArr[1];
    documentFile.mv("public/uploads/feature/" + imgname, function (err) {
        if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/admin/feature/edit/${id}`);
        }
    });



  }
  let featureData = {
    title: req.body.title,
    description: req.body.description,
  };
  if(imgname){
    featureData = {
      title: req.body.title,
      description: req.body.description,
      image: imgname,
    };
  }

  var update_feature = await Models.Feature.update(featureData, {
    where: { id: id },
  });
  if (update_feature) {
    req.flash('success', 'Feature updated successfully');
    return res.redirect(`/admin/feature/edit/${id}`);
  } else {
    req.flash('error', 'Feature is not updated ');
    return res.redirect(`/admin/feature/edit/${id}`);
  }
}

async function adminDeleteFeatureAction(req, res) {
  var id = req.params.id;
  var delete_feature = await Models.Feature.destroy({
    where: { id: id },
  });
  if (delete_feature) {
    req.flash('success', 'Feature deleted successfully');
    return res.redirect(`/admin/feature`);
  } else {
    req.flash('error', 'Feature is not deleted ');
    return res.redirect(`/admin/feature`);
  }
}

module.exports = {
  adminFeatureList: adminFeatureList,
  adminAddFeature: adminAddFeature,
  adminAddFeatureAction: adminAddFeatureAction,
  adminEditFeature: adminEditFeature,
  adminEditFeatureAction: adminEditFeatureAction,
  adminDeleteFeatureAction: adminDeleteFeatureAction,
};
