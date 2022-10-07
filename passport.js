const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const {ADMINPATH,BASEPATH} = require('./config/path.config.js');

  
passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});
  
passport.use(new GoogleStrategy({
    clientID:"1036617403093-i6bofotdk0s8fhhg4mmo3l0n51kt7t7t.apps.googleusercontent.com", 
    clientSecret:"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", 
    callbackURL:`${BASEPATH}/auth/google/callback`,
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.use(new FacebookStrategy({
  clientID: '829192618465577',
  clientSecret: '9cbf894a424af221a5eae7aaf920ab7e',
  callbackURL: `${BASEPATH}/auth/facebook/callback`
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));