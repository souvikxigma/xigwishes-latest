function authNotUser(req, res, next) {
  if (req.cookies && req.cookies.token) {
    console.log('auth not check',req.cookies.token);
    return res.redirect('/');
  }
  next();
}

module.exports = {
  authNotUser: authNotUser,
};
