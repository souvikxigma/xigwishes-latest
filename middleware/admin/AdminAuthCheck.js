var jwt = require('jsonwebtoken');
const Models = require("../../models");

async function adminAuthUser(req, res, next) {
  if (req.cookies.admintoken) {
    console.log('admin auth check',req.cookies.admintoken);
    const admintoken = req.cookies.admintoken;
    jwt.verify(admintoken, process.env.ADMINSECRET, async function (err, data) {
      if (err) {
        req.flash('error', err);
        res.clearCookie();
        return res.redirect('/admin/login');
      }

      if (data) {
        var adminid = data.id;
        const user = await Models.Admin.findOne({ where: { id: adminid } });

        if (user) {
          req.id = adminid;

          req.user = user;

          next();
        } else {
          req.flash('error', 'Admin not found');
          res.clearCookie();
          return res.redirect('/admin/login');
        }
      }
    });
  } else {    
    // req.flash('error', 'Invalid or expired token');
    return res.redirect('/admin/login');
  }
}

module.exports = {
    adminAuthUser: adminAuthUser,
};
