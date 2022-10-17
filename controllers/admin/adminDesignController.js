const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminDesignList(req, res) {
  const alldesign = await Models.Design.findAll({});
  return res.render('admin/pages/Design/designlist', {
    page_name: 'admin-design',
    layout: 'admin/layouts/adminlayout',
    data: alldesign,
  });
}

async function adminAddDesign(req, res) {
  return res.render('admin/pages/Design/adddesign', {
    page_name: 'admin-design',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddDesignAction(req, res) {
  if(req.files && req.files.image){
    var documentFile = req.files.image;
    var imgString = documentFile.name;
    var imgArr = imgString.split(".");
    var imgname = "design-" + Date.now() + "." + imgArr[1];
    documentFile.mv("public/uploads/design/" + imgname, function (err) {
        if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/admin/design/add`);
        }
    });

  }
  let designData = {
    title: req.body.title,
    description: req.body.description,
  };
  if(imgname){
    designData = {
      title: req.body.title,
      description: req.body.description,
      image: imgname,
    };
  }

  var created_design = await Models.Design.create(designData);
  if (created_design) {
    req.flash('success', 'Design added successfully');
    return res.redirect('/admin/design/add');
  } else {
    req.flash('error', 'Design is not added ');
    return res.redirect('/admin/design/add');
  }
}

async function adminEditDesign(req, res) {
  var id = req.params.id;
  const design = await Models.Design.findOne({where:{ id: id }});
  if (design) {
    return res.render('admin/pages/Design/editdesign', {
      page_name: 'admin-design',
      layout: 'admin/layouts/adminlayout',
      data: design,
    });
  }
}

async function adminEditDesignAction(req, res) {
  var id = req.params.id;
  if(req.files && req.files.image){
    var documentFile = req.files.image;
    var imgString = documentFile.name;
    var imgArr = imgString.split(".");
    var imgname = "design-" + Date.now() + "." + imgArr[1];
    documentFile.mv("public/uploads/design/" + imgname, function (err) {
        if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/admin/design/edit/${id}`);
        }
    });



  }
  let designData = {
    title: req.body.title,
    description: req.body.description,
  };
  if(imgname){
    designData = {
      title: req.body.title,
      description: req.body.description,
      image: imgname,
    };
  }

  var update_design = await Models.Design.update(designData, {
    where: { id: id },
  });
  if (update_design) {
    req.flash('success', 'Design updated successfully');
    return res.redirect(`/admin/design/edit/${id}`);
  } else {
    req.flash('error', 'Design is not updated ');
    return res.redirect(`/admin/design/edit/${id}`);
  }
}

async function adminDeleteDesignAction(req, res) {
  var id = req.params.id;
  var delete_design = await Models.Design.destroy({
    where: { id: id },
  });
  if (delete_design) {
    req.flash('success', 'Design deleted successfully');
    return res.redirect(`/admin/design`);
  } else {
    req.flash('error', 'Design is not deleted ');
    return res.redirect(`/admin/design`);
  }
}

module.exports = {
  adminDesignList: adminDesignList,
  adminAddDesign: adminAddDesign,
  adminAddDesignAction: adminAddDesignAction,
  adminEditDesign: adminEditDesign,
  adminEditDesignAction: adminEditDesignAction,
  adminDeleteDesignAction: adminDeleteDesignAction,
};
