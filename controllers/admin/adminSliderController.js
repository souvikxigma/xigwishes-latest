const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminSliderList(req, res) {
  const allslider = await Models.Slider.findAll({});
  return res.render('admin/pages/Slider/sliderlist', {
    page_name: 'admin-slider',
    layout: 'admin/layouts/adminlayout',
    data: allslider,
  });
}

async function adminAddSlider(req, res) {
  return res.render('admin/pages/Slider/addslider', {
    page_name: 'admin-slider',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddSliderAction(req, res) {
  if(req.files && req.files.image){
    var documentFile = req.files.image;
    var imgString = documentFile.name;
    var imgArr = imgString.split(".");
    var imgname = "slider-" + Date.now() + "." + imgArr[1];
    documentFile.mv("public/uploads/slider/" + imgname, function (err) {
        if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/admin/slider/add`);
        }
    });

  }
  let sliderData = {
    title: req.body.title,
    description: req.body.description,
  };
  if(imgname){
    sliderData = {
      title: req.body.title,
      description: req.body.description,
      image: imgname,
    };
  }

  var created_slider = await Models.Slider.create(sliderData);
  if (created_slider) {
    req.flash('success', 'Slider added successfully');
    return res.redirect('/admin/slider/add');
  } else {
    req.flash('error', 'Slider is not added ');
    return res.redirect('/admin/slider/add');
  }
}

async function adminEditSlider(req, res) {
  var id = req.params.id;
  const slider = await Models.Slider.findOne({where:{ id: id }});
  if (slider) {
    return res.render('admin/pages/Slider/editslider', {
      page_name: 'admin-slider',
      layout: 'admin/layouts/adminlayout',
      data: slider,
    });
  }
}

async function adminEditSliderAction(req, res) {
  var id = req.params.id;
  if(req.files && req.files.image){
    var documentFile = req.files.image;
    var imgString = documentFile.name;
    var imgArr = imgString.split(".");
    var imgname = "slider-" + Date.now() + "." + imgArr[1];
    documentFile.mv("public/uploads/slider/" + imgname, function (err) {
        if (err) {
            req.flash('error', 'Image not uploaded');
            res.redirect(`/admin/slider/edit/${id}`);
        }
    });



  }
  let sliderData = {
    title: req.body.title,
    description: req.body.description,
  };
  if(imgname){
    sliderData = {
      title: req.body.title,
      description: req.body.description,
      image: imgname,
    };
  }

  var update_slider = await Models.Slider.update(sliderData, {
    where: { id: id },
  });
  if (update_slider) {
    req.flash('success', 'Slider updated successfully');
    return res.redirect(`/admin/slider/edit/${id}`);
  } else {
    req.flash('error', 'Slider is not updated ');
    return res.redirect(`/admin/slider/edit/${id}`);
  }
}

async function adminDeleteSliderAction(req, res) {
  var id = req.params.id;
  var delete_slider = await Models.Slider.destroy({
    where: { id: id },
  });
  if (delete_slider) {
    req.flash('success', 'Slider deleted successfully');
    return res.redirect(`/admin/slider`);
  } else {
    req.flash('error', 'Slider is not deleted ');
    return res.redirect(`/admin/slider`);
  }
}

module.exports = {
  adminSliderList: adminSliderList,
  adminAddSlider: adminAddSlider,
  adminAddSliderAction: adminAddSliderAction,
  adminEditSlider: adminEditSlider,
  adminEditSliderAction: adminEditSliderAction,
  adminDeleteSliderAction: adminDeleteSliderAction,
};
