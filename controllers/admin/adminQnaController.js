const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');

async function adminQnaList(req, res) {
  const allqna = await Models.Qna.findAll({});
  return res.render('admin/pages/Qna/qnalist', {
    page_name: 'admin-qna',
    layout: 'admin/layouts/adminlayout',
    data: allqna,
  });
}

async function adminAddQna(req, res) {
  return res.render('admin/pages/Qna/addqna', {
    page_name: 'admin-qna',
    layout: 'admin/layouts/adminlayout',
  });
}

async function adminAddQnaAction(req, res) {
  let qnaData = {
    question: req.body.question,
    answer: req.body.answer,
  };

  var created_qna = await Models.Qna.create(qnaData);
  if (created_qna) {
    req.flash('success', 'Qna added successfully');
    return res.redirect('/admin/qna/add');
  } else {
    req.flash('error', 'Qna is not added ');
    return res.redirect('/admin/qna/add');
  }
}

async function adminEditQna(req, res) {
  var id = req.params.id;
  const qna = await Models.Qna.findOne({ where:{id: id }});
  if (qna) {
    return res.render('admin/pages/Qna/editqna', {
      page_name: 'admin-qna',
      layout: 'admin/layouts/adminlayout',
      data: qna,
    });
  }
}

async function adminEditQnaAction(req, res) {
  var id = req.params.id;
  let qnaData = {
    question: req.body.question,
    answer: req.body.answer,
  };

  var update_qna = await Models.Qna.update(qnaData, {
    where: { id: id },
  });
  if (update_qna) {
    req.flash('success', 'Qna updated successfully');
    return res.redirect(`/admin/qna/edit/${id}`);
  } else {
    req.flash('error', 'Qna is not updated ');
    return res.redirect(`/admin/qna/edit/${id}`);
  }
}

async function adminDeleteQnaAction(req, res) {
  var id = req.params.id;
  var delete_qna = await Models.Qna.destroy({
    where: { id: id },
  });
  if (delete_qna) {
    req.flash('success', 'Qna deleted successfully');
    return res.redirect(`/admin/qna`);
  } else {
    req.flash('error', 'Qna is not deleted ');
    return res.redirect(`/admin/qna`);
  }
}

module.exports = {
  adminQnaList: adminQnaList,
  adminAddQna: adminAddQna,
  adminAddQnaAction: adminAddQnaAction,
  adminEditQna: adminEditQna,
  adminEditQnaAction: adminEditQnaAction,
  adminDeleteQnaAction: adminDeleteQnaAction,
};
