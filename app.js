var express = require('express');
const path = require("path");
var expressLayouts = require('express-ejs-layouts');
var flash = require('express-flash');
var session = require('express-session');
const http = require('http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var os = require('os');
var jwt = require('jsonwebtoken');
const Models = require("./models");
const passport = require('passport');
const cookieSession = require('cookie-session');

//passport//
var app = express();
require('./passport');
app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  })
);
app.use(passport.initialize());
app.use(passport.session());

//google Auth
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
//facebook Auth
app.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);
//google Auth Callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/callback/success',
    failureRedirect: '/auth/google/callback/failure',
  })
);
//facebook Auth Callback
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/auth/facebook/callback/success',
    failureRedirect: '/auth/facebook/callback/failure',
  })
);

const db = require("./models");
db.sequelize.sync({alter:true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({resave: true, saveUninitialized: true, secret: 'xig2022#wishesdo%$a', cookie: { maxAge: 6000000 }}));
// set the view engine to ejs
app.use(expressLayouts);
app.use(cookieParser())
// app.use(csrf({ cookie: true }))


app.use(flash());
app.use(fileUpload());
app.set('view engine', 'ejs');
app.use('', express.static(__dirname + '/public'));
require('dotenv').config({path:'.env'});
//custom layout set //
app.set('layout', 'front/layouts/layout'); //front  layoub
// app.set('views', path.join(__dirname, 'views'));
// use res.render to load up an ejs view file

// // index page


app.get('/', function(req, res) {
  return res.redirect('/home');
});


// global variables across routes
app.use(async (req, res, next) => {
  try {
    // res.locals.login = req.isAuthenticated();
    // res.locals.session = req.session;
    // res.locals.currentUser = req.user;
    // const categories = await Category.find({}).sort({ title: 1 }).exec();
    res.locals.boka = "categories";
    next();
  } catch (error) {
    console.log(error);
  }
});


// app.get('/admin', function(req, res) {
//     return res.render('admin/pages/home.ejs',{ layout: 'admin/layouts/adminlayout' });
// });

// app.get('/admin/login', function(req, res) {
//     return res.render('admin/layouts/adminauthlayout',{ layout: false });
// });


///import router //
const contactRouter = require('./routers/front/contactRouter');
const staticListRouter = require('./routers/front/staticListRouter');
const userRouter = require('./routers/front/userRouter');
const cronRouter = require('./routers/front/cronRouter');
const tempRouter = require('./routers/front/tempRouter');
const homeRouter = require('./routers/front/homeRouter');
const packageRouter = require('./routers/front/packageRouter');
const anniversaryRouter = require('./routers/front/anniversaryRouter');
const birthdayRouter = require('./routers/front/birthdayRouter');
const festivalRouter = require('./routers/front/festivalRouter');

// ////define all router ////
app.use(function (req, res, next) {
  // res.clearCookie('token');
  // res.clearCookie('userID');
  // res.clearCookie('userEmail');
  // global.loginAuthCheck = 0;
  // next();
  global.loginAuthCheck = req.cookies.userID;
  global.loginAuthEmail = req.cookies.userEmail;
  next();
});

// app.use(`/birthday`,contactRouter);
// app.use(function (req, res, next) {
//   req.someVariable = 123;
//   //const token = req.cookies.token;
//   const token = "12111";
//   global.loginAuthCheck = 0;
//   //
//   jwt.verify(token, process.env.SECRET, async function (err, data) {

//     if (err) {
//       global.loginAuthCheck = 0;
//       next();
//     }

//     if (data) {
//       var userid = data.id;
//       const user = await Models.User.findOne({ where: { id: userid } });

//       if (user) {
//         global.loginAuthCheck = 1;
//         next();
//       } else {
//         global.loginAuthCheck = 0;
//         next();
//       }
//     }
//   });
//   //
//   next();
// });

app.use(`/birthday`,birthdayRouter);
app.use(`/others`,staticListRouter);
app.use(`/cron`,cronRouter);
app.use(`/temp`,tempRouter);
app.use(`/home`,homeRouter);
app.use(`/package`,packageRouter);
app.use(`/anniversary`,anniversaryRouter);
app.use(`/holidays`,festivalRouter);
app.use(`/`,userRouter);




///end define router//



// admin route
const adminAuthRouter = require('./routers/admin/adminAuthRouter');
const adminDashboardRouter = require('./routers/admin/adminDashboardRouter');
const adminThemeRouter = require('./routers/admin/adminThemeRouter');
const adminEventRouter = require('./routers/admin/adminEventRouter');
const adminSubEventRouter = require('./routers/admin/adminSubEventRouter');
const adminUserRouter = require('./routers/admin/adminUserRouter');

//admin //
app.use(`/admin`,adminAuthRouter);
app.use(`/admin/dashboard`,adminDashboardRouter);
app.use(`/admin/theme`,adminThemeRouter);
app.use(`/admin/event`,adminEventRouter);
app.use(`/admin/sub-event`,adminSubEventRouter);
app.use(`/admin/user`,adminUserRouter);


// admin 404
app.get('/admin/*', function(req, res){
  res.status(404).send('what admin???');
});
// user 404
app.get('*', function(req, res){
  res.status(404).send('what user???');
});

const server = http.createServer(app);

server.listen(process.env.PORT,()=>{
  console.log(`server is working on ${process.env.PORT}||`);
  //console.log('Server listening:', `${os.userInfo()}`);

});