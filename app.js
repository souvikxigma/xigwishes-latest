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

var os = require('os');
var jwt = require('jsonwebtoken');
const Models = require("./models");
const adminAuthCheck = require('./middleware/admin/AdminAuthCheck');

const passport = require('passport');
const cookieSession = require('cookie-session');
const moment = require("moment");
const {ADMINPATH} = require('./config/path.config.js');

// const server = http.createServer(app);
// var io = require('socket.io');

// socket io chat start

// socket io chat end

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

app.get('/chat/start', function(req, res) {
 return res.render('front/pages/Chat/chat.ejs');
});


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



// global variables across routes
app.use(async (req, res, next) => {
  res.locals.moment = moment;
  var usersActiveCount = await Models.User.count({where:{accountActiveStatus:'1'}});
  res.locals.usersActiveCount = usersActiveCount;
  var themeCount = await Models.Theme.count({where:{status:'1'}});
  res.locals.themeCount = themeCount;

  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let ipData = {
    ip: ip,
  };
  await Models.Ip.create(ipData);
  var ipCount = await Models.Ip.count({});
  res.locals.ipCount = ipCount;


  try {
    global.loginAuthCheck = req.cookies.userID;
    global.loginAuthEmail = req.cookies.userEmail;
    // res.locals.login = req.isAuthenticated();
    // res.locals.session = req.session;
    // res.locals.currentUser = req.user;
    var globalUserData = null;
    var accountExpireDays = null;
    if(loginAuthCheck){
      globalUserData = await Models.User.findOne({where:{id:loginAuthCheck}});
      const endDate    = globalUserData.accountExpireDate;
      const startDate    = new Date().toISOString().slice(0, 10);
      const diffInMs   = new Date(endDate) - new Date(startDate);
      accountExpireDays = diffInMs / (1000 * 60 * 60 * 24);
      // if(accountExpireDays >= 0){
      //   var cronfunc = require("./controllers/front/cronController");
      //   cronfunc.cronBirthday();
      //   cronfunc.cronAnniversary();
      // }

    }
    res.locals.globalUserData = globalUserData;
    res.locals.accountExpireDays = accountExpireDays;
    //res.locals.adminbaseurl = "http://localhost:9128/admin";
    res.locals.adminbaseurl = `${ADMINPATH}/admin`;
    res.locals.boka = "categories";
    // res.locals.srvr = server;

    var cronfunc = require("./controllers/front/cronController");
    cronfunc.cronBirthday();
    cronfunc.cronAnniversary();

    next();
  } catch (error) {
    console.log(error);
  }
});



app.get('/', function(req, res) {
  return res.redirect('/home');


  // //var f = window.localStorage.getItem("firstTimeUser");
  // res.locals.ftu = false;
  // if(f){
  //   console.log(f);
  //   return res.redirect('/home/loader');
  // }else{
  //   return res.redirect('/home');
  //   // setInterval(()=>{

  //   // })
  // }
  
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
const chatRouter = require('./routers/front/chatRouter');

// ////define all router ////


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
app.use(`/chat`,chatRouter);
app.use(`/`,userRouter);




///end define router//



// admin route
const adminAuthRouter = require('./routers/admin/adminAuthRouter');
const adminDashboardRouter = require('./routers/admin/adminDashboardRouter');
const adminThemeRouter = require('./routers/admin/adminThemeRouter');
const adminEventRouter = require('./routers/admin/adminEventRouter');
const adminSubEventRouter = require('./routers/admin/adminSubEventRouter');
const adminUserRouter = require('./routers/admin/adminUserRouter');
const adminCmsRouter = require('./routers/admin/adminCmsRouter');
const adminTestimonialRouter = require('./routers/admin/adminTestimonialRouter');
const adminQnaRouter = require('./routers/admin/adminQnaRouter');
const adminFeatureRouter = require('./routers/admin/adminFeatureRouter');
const adminSliderRouter = require('./routers/admin/adminSliderRouter');
const adminDesignRouter = require('./routers/admin/adminDesignRouter');
const adminHowworkRouter = require('./routers/admin/adminHowworkRouter');
const adminCompanyRouter = require('./routers/admin/adminCompanyRouter');

//admin //
app.use(`/admin`,adminAuthRouter);
app.use(`/admin/dashboard`,adminDashboardRouter);
app.use(`/admin/theme`,adminThemeRouter);
app.use(`/admin/event`,adminEventRouter);
app.use(`/admin/sub-event`,adminSubEventRouter);
app.use(`/admin/user`,adminUserRouter);
app.use(`/admin/cms`,adminCmsRouter);
app.use(`/admin/testimonial`,adminTestimonialRouter);
app.use(`/admin/qna`,adminQnaRouter);
app.use(`/admin/feature`,adminFeatureRouter);
app.use(`/admin/slider`,adminSliderRouter);
app.use(`/admin/design`,adminDesignRouter);
app.use(`/admin/howwork`,adminHowworkRouter);
app.use(`/admin/company`,adminCompanyRouter);


// admin 404
app.get('/admin/*', adminAuthCheck.adminAuthUser  , function(req, res){
  var title = 'Admin';
  return res.render('admin/pages/Others/erroradmin', {
    page_name: 'erroradmin',
    title:title,
    layout: 'admin/layouts/adminlayout',
  });
});
// user 404
app.get('*', function(req, res){
  var title = 'User';
  return res.render('front/pages/Others/error', {
    page_name: 'error',
    title:title
  });
});

const server = http.createServer(app);


////////socket start ///////////////
const io = require('socket.io')(server);
//var chatController = require('./controllers/front/chatController');
io.on('connection', function(socket) {
  console.log('A user connected');
  //create room//
  // socket.on("join_room", (data) => {
  //   socket.join(data.room);
  //   console.log(`User with id : ${socket.id} joined room: ${data.room}`);
  // });

  socket.on('frontent_send_msg', function(msg){
    console.log(`User with id : ${socket.id} joined room: ${msg.room}`);
    console.log('message: ' + msg);
  });

  // socket.emit('backend_send_msg', function(msg){
  //   console.log('message: ' + msg);
  // });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});




//chatController.index(io);
/////////////////socket end ////////////////////////
server.listen(process.env.PORT,()=>{
  console.log(`server is working on ${process.env.PORT}||`);

  //console.log('Server listening:', `${os.userInfo()}`);

});