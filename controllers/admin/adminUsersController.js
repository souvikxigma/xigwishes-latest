

const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
const user = require('../../models/user');


async function index(req, res) {
    const allUser = await Models.User.findAll({});
    if (allUser) {
        return res.render('admin/pages/Users/allusers', {
            page_name: 'admin-users',
            layout: 'admin/layouts/adminlayout',
            data: allUser,
        });
    }
}

async function viewAllBirthdayByUser(req,res){
    let userid = req.params.uid;
    const userInfo = await Models.User.findOne({where:{id:userid}});
    const allBirthday = await Models.Birthday.findAll({where:{userId:userid}});
    if (allBirthday) {
        return res.render('admin/pages/Users/allbirthday', {
            page_name: 'admin-users',
            layout: 'admin/layouts/adminlayout',
            data: allBirthday,
            user: userInfo,
        });
    }
}

async function viewAllAnniversaryByUser(req,res){
    let userid = req.params.uid;
    const userInfo = await Models.User.findOne({where:{id:userid}});
    const allAnniversary = await Models.Anniversary.findAll({where:{userId:userid}});
    if (allAnniversary) {
        return res.render('admin/pages/Users/allanniversary', {
            page_name: 'admin-users',
            layout: 'admin/layouts/adminlayout',
            data: allAnniversary,
            user: userInfo,
        });
    }
}

async function userDeleteAction(req, res) {
    var id = req.params.uid;  
    var delete_user = await Models.User.destroy({ where: { id: id } });
    if (delete_user) {
      req.flash('success', 'User deleted successfully');
      return res.redirect(`/admin/user`);
    } else {
      req.flash('error', 'User is not deleted ');
      return res.redirect(`/admin/user`);
    }
  }

  async function userBirthdayDeleteAction(req, res) {
    var uid = req.params.uid;  
    var id = req.params.id;   
    var delete_birthday = await Models.Birthday.destroy({ where: { userId: uid,id:id } });
    if (delete_birthday) {
      req.flash('success', 'User Birthday deleted successfully');
      return res.redirect(`/admin/user/birthday/${uid}`);
    } else {
      req.flash('error', 'User Birthday is not deleted ');
      return res.redirect(`/admin/user/birthday/${uid}`);
    }
  }

  async function userAnniversaryDeleteAction(req, res) {
    var uid = req.params.uid;  
    var id = req.params.id;  
    var delete_anniversary = await Models.Anniversary.destroy({ where: { userId: uid,id:id } });
    if (delete_anniversary) {
      req.flash('success', 'User anniversary deleted successfully');
      return res.redirect(`/admin/user/anniversary/${uid}`);
    } else {
      req.flash('error', 'User anniversary is not deleted ');
      return res.redirect(`/admin/user/anniversary/${uid}`);
    }
  }

module.exports = {
    index: index,
    viewAllBirthdayByUser: viewAllBirthdayByUser,
    viewAllAnniversaryByUser: viewAllAnniversaryByUser,
    userDeleteAction:userDeleteAction,
    userBirthdayDeleteAction:userBirthdayDeleteAction,
    userAnniversaryDeleteAction:userAnniversaryDeleteAction
};