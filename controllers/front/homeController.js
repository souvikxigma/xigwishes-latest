const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function home(req, res) {
  var expirePopup = '0';
  if(loginAuthCheck){
    //expirePopup = '1';
    var user = await Models.User.findOne({
      where: { id: parseInt(loginAuthCheck) }
    });
  //  console.log('user.expirePopup',loginAuthCheck);
    if(user.expirePopup == '1'){
      expirePopup = '1';
      await user.update({ expirePopup	: '0' });
  
    }
    
  }
 
  var sliders = await Models.Slider.findAll({
    where: { status: 'Y' },
    order: [['id', 'DESC']],
  });
  var howwork = await Models.Howwork.findOne({
    where: { status: 'Y' }
  });
  var features = await Models.Feature.findAll({
    where: { status: 'Y' },
    order: [['id', 'DESC']],
  });
  var designs = await Models.Design.findAll({
    where: { status: 'Y' },
    order: [['id', 'DESC']],
  });
  var testimonials = await Models.Testimonial.findAll({
    where: { status: 'Y' },
    order: [['id', 'DESC']],
  });
  var qnas = await Models.Qna.findAll({
    where: { status: 'Y' },
    order: [['id', 'DESC']],
  });
  return res.render('front/pages/Home/home', {
    page_name: 'home',
    qnas: qnas,
    features: features,
    howwork:howwork,
    designs: designs,
    testimonials: testimonials,
    sliders: sliders,
    expirePopup: expirePopup,
  });
}

function loaderFunc(req, res) {
  return res.render('front/pages/Home/loader', {
    page_name: 'loader',
    layout: false,
  });
}

module.exports = {
  home: home,
  loaderFunc: loaderFunc,
};
