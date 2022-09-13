const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminTestimonialList(req, res) {
  const alltestimonial = await Models.Testimonial.findAll({});
  return res.render('admin/pages/Testimonial/testimoniallist', {
    page_name: 'admin-testimonial',
    layout: 'admin/layouts/adminlayout',
    data: alltestimonial,
  });
}

async function adminAddTestimonial(req, res) {
  return res.render('admin/pages/Testimonial/addtestimonial', {
    page_name: 'admin-testimonial',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddTestimonialAction(req, res) {
  let testimonialData = {
    description: req.body.description,
  };

  var created_testimonial = await Models.Testimonial.create(testimonialData);
  if (created_testimonial) {
    req.flash('success', 'Testimonial added successfully');
    return res.redirect('/admin/testimonial/add');
  } else {
    req.flash('error', 'Testimonial is not added ');
    return res.redirect('/admin/testimonial/add');
  }
}

async function adminEditTestimonial(req, res) {
  var id = req.params.id;
  const testimonial = await Models.Testimonial.findOne({ where:{id: id} });
  if (testimonial) {
    return res.render('admin/pages/Testimonial/edittestimonial', {
      page_name: 'admin-testimonial',
      layout: 'admin/layouts/adminlayout',
      data: testimonial,
    });
  }
}

async function adminEditTestimonialAction(req, res) {
  var id = req.params.id;
  let testimonialData = {
    description: req.body.description,
  };

  var update_testimonial = await Models.Testimonial.update(testimonialData, {
    where: { id: id },
  });
  if (update_testimonial) {
    req.flash('success', 'Testimonial updated successfully');
    return res.redirect(`/admin/testimonial/edit/${id}`);
  } else {
    req.flash('error', 'Testimonial is not updated ');
    return res.redirect(`/admin/testimonial/edit/${id}`);
  }
}

async function adminDeleteTestimonialAction(req, res) {
  var id = req.params.id;
  var delete_testimonial = await Models.Testimonial.destroy({
    where: { id: id },
  });
  if (delete_testimonial) {
    req.flash('success', 'Testimonial deleted successfully');
    return res.redirect(`/admin/testimonial`);
  } else {
    req.flash('error', 'Testimonial is not deleted ');
    return res.redirect(`/admin/testimonial`);
  }
}

module.exports = {
  adminTestimonialList: adminTestimonialList,
  adminAddTestimonial: adminAddTestimonial,
  adminAddTestimonialAction: adminAddTestimonialAction,
  adminEditTestimonial: adminEditTestimonial,
  adminEditTestimonialAction: adminEditTestimonialAction,
  adminDeleteTestimonialAction: adminDeleteTestimonialAction,
};
