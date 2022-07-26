var express = require('express');
const path = require("path");
var expressLayouts = require('express-ejs-layouts');
var flash = require('express-flash');
var session = require('express-session');
const http = require('http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var cookieParser = require('cookie-parser')

var app = express();

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

// ////define all router ////
app.use(`/contact`,contactRouter);
app.use(`/others`,staticListRouter);
app.use(`/cron`,cronRouter);
app.use(`/temp`,tempRouter);
app.use(`/`,userRouter);
app.use(`/home`,homeRouter);
///end define router//



// admin route
const adminAuthRouter = require('./routers/admin/adminAuthRouter');
const adminDashboardRouter = require('./routers/admin/adminDashboardRouter');
const adminThemeRouter = require('./routers/admin/adminThemeRouter');

//admin //
app.use(`/admin`,adminAuthRouter);
app.use(`/admin/dashboard`,adminDashboardRouter);
app.use(`/admin/theme`,adminThemeRouter);


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
  console.log(`server is working on ${process.env.PORT}`);
});