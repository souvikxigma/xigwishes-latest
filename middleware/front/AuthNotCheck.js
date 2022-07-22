function authNotUser(req, res, next) {
  if (req.cookies && req.cookies.token) {
    res.clearCookie();
    console.log('auth not check',req.cookies.token);
    // return res.redirect('/home');
   // return res.redirect('/');
  }
  next();
}

module.exports = {
  authNotUser: authNotUser,
};
