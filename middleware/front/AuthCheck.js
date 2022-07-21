var jwt = require('jsonwebtoken');
const Models = require("../../models");

async function authUser(req, res, next) {
  if (req.cookies.token) {
    console.log('auth check',req.cookies.token);
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET, async function (err, data) {
      if (err) {
        req.flash('error', err);
        res.clearCookie();
        return res.redirect('/login');
      }

      if (data) {
        var userid = data.id;
        const user = await Models.User.findOne({ where: { id: userid } });

        if (user) {
          req.id = userid;

          req.user = user;

          next();
        } else {
          req.flash('error', 'User not found');
          res.clearCookie();
          return res.redirect('/login');
        }
      }
    });
  } else {    
    // req.flash('error', 'Invalid or expired token');
    return res.redirect('/login');
  }
}

module.exports = {
  authUser: authUser,
};
