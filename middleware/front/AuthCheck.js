var jwt = require('jsonwebtoken');
const Models = require("../../models");

async function authUser(req, res, next) {
  if (req.cookies.token) {
    console.log('auth check',req.cookies.token);
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET, async function (err, data) {
      if (err) {
        //req.flash('error', err);
        res.clearCookie('token');
        res.clearCookie('userID');
        res.clearCookie('userEmail');
        req.flash('error', 'your token is expired.please login...');
        // return res.redirect('/login');
        return res.redirect('/home');
      }

      if (data) {
        var userid = data.id;
        const user = await Models.User.findOne({ where: { id: userid } });
        global.fullUserInfo = user;

        if (user) {
          req.id = userid;

          req.user = user;

          next();
        } else {
          req.flash('error', 'User not found');
          res.clearCookie();
          //eturn res.redirect('/login');
          return res.redirect('/home');
        }
      }
    });
  } else {    
    req.flash('error', 'please login first ..');
    return res.redirect('/home');
  }
}

module.exports = {
  authUser: authUser,
};
