

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

module.exports = {
    index: index,
    viewAllBirthdayByUser: viewAllBirthdayByUser,
    viewAllAnniversaryByUser: viewAllAnniversaryByUser,
};