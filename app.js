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
db.sequelize.sync({force:false})
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
  return res.render('front/pages/home.ejs');
});

app.get('/login', function(req, res) {
    return res.render('front/pages/Auth/signin.ejs',{ layout: 'front/layouts/authlayout' });
});

app.get('/admin', function(req, res) {
    return res.render('admin/pages/home.ejs',{ layout: 'admin/layouts/adminlayout' });
});

app.get('/admin/login', function(req, res) {
    return res.render('admin/layouts/adminauthlayout',{ layout: false });
});

///define router//

const contactRouter = require('./routers/front/contactRouter');
const staticListRouter = require('./routers/front/staticListRouter');
// const userRouter = require('./routers/front/');
// const othersRouter = require('./routers/othersRouter');
//cron
// const cronRouter = require('./routers/cronRouter');

// ////define all controller ////

app.use(`/contact`,contactRouter);
app.use(`/others`,staticListRouter);
// app.use(`/cron`,cronRouter);
// app.use(`/`,userRouter);
///end define router//


const server = http.createServer(app);

server.listen(process.env.PORT,()=>{
  console.log(`server is working on ${process.env.PORT}`);
});