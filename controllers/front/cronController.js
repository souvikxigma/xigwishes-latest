var cron = require('node-cron');
const Models = require('../../models');
const Sequelize = require('sequelize');
var format = require('date-format');
const nodemailer = require("nodemailer");
const moment = require('moment');
const {ADMINPATH,BASEPATH} = require('../../config/path.config.js');

async function cronBirthdayf(req, res) {
/////////////////////////////////////////////////////////////////
  var userInfo = await Models.User.findAll({});
  // tomorrow all birthaday data
  var month = moment().month() + 1;
  var tomorrow = moment().add(1, 'days').date();
  const Op = Sequelize.Op;
  const TODAY_START = moment().format('YYYY-MM-DD 10:00');
  const today = format('yyyy-MM-dd hh:mm', new Date());
  const TODAY_END = moment().format('YYYY-MM-DD 23:59');
  var contacts = [];
  userInfo.forEach(async (user,index) => {
    contacts = await Models.Birthday.findAll({
      where: {
        [Op.and]: [
          {
            userId:user.id,
          },
          {
            birthday: Sequelize.where(
              Sequelize.fn('month', Sequelize.col('birthday')),
              month
            ),
          },
          {
            birthday: Sequelize.where(
              Sequelize.fn('day', Sequelize.col('birthday')),
              tomorrow
            ),
          },
        ],
      },
    });
   
    ///////////////////////////////////////////////
    if (contacts.length > 0) {
      // console.log("TODAY_START",TODAY_START);
      // console.log("today",today);
      // console.log("TODAY_END",TODAY_END);
  
      if (today > TODAY_START && today < TODAY_END) {
        // console.log('working');
        
        cron.schedule('* * * * *', () => {
          console.log("start 2",user.email);
          //random birthday item from user birthday array//
          var arritem = user.birthdayThemes.split(',');
          var randomDefaultBirthdayTheme = arritem[Math.floor(Math.random()*arritem.length)];
          //random birthday item from user birthday array//
          //1 0 * * *
          // 0 21 * * *
          // console.log('running a task every minute');
         
          contacts.forEach((contact, i) => {
            //var url = `http://localhost:9128/temp/review/download/${userId}/${userInfo.defaultBirthdayTheme}/${contact.id}`;
            var url = `${BASEPATH}/temp/review/download/${user.id}/${randomDefaultBirthdayTheme}/${contact.id}`;
            console.log(url);
            //htmltocanvas code//
            console.log('cron working');
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              auth: {
                user: 'souvik.hajra@xigmapro.com',
                pass: 'xigma123',
              },
            });
            // console.log("before func",user.email);
            if (contact) {
              // console.log("inside func",user.email);
              // send mail with defined transport object
              let info = transporter.sendMail({
                from: 'souvik.hajra@xigmapro.com',
                to: user.email,
                subject: `Xigwish Mail`,
                html: url, // html body
              });
            }
            //htmltocanvas code//
          });
          //email + logic//
        }, {
          scheduled: true,
          timezone: "Asia/Kolkata"
        });
      }
    }
  });
  return res.send({ cron: contacts });
}


async function cronBirthday(req,res){
 //console.log();
  var userInfo = await Models.User.findAll({});
  // tomorrow all birthaday data
  var month = moment().month() + 1;
  var tomorrow = moment().add(1, 'days').date();
  const Op = Sequelize.Op;
  const TODAY_START = moment().format('YYYY-MM-DD 10:00');
  const today = format('yyyy-MM-dd hh:mm', new Date());
  const TODAY_END = moment().format('YYYY-MM-DD 23:59');
  var contacts = [];

  cron.schedule('00 21 * * *', () => {
  //cron.schedule('* * * * *', () => {

    userInfo.forEach(async (user,index) => {
      contacts = await Models.Birthday.findAll({
        where: {
          [Op.and]: [
            {
              userId:user.id,
            },
            {
              birthday: Sequelize.where(
                Sequelize.fn('month', Sequelize.col('birthday')),
                month
              ),
            },
            {
              birthday: Sequelize.where(
                Sequelize.fn('day', Sequelize.col('birthday')),
                tomorrow
              ),
            },
          ],
        },
      });

      /////

      if (contacts.length > 0) {
        if (today > TODAY_START && today < TODAY_END) {

          var arritem = user.birthdayThemes.split(',');
          var randomDefaultBirthdayTheme = arritem[Math.floor(Math.random()*arritem.length)];
          //random birthday item from user birthday array//
          //1 0 * * *
          // 0 21 * * *
          // console.log('running a task every minute');
         
          contacts.forEach((contact, i) => {
            //var url = `http://localhost:9128/temp/review/download/${userId}/${userInfo.defaultBirthdayTheme}/${contact.id}`;
            //var url = `http://localhost:9128/temp/review/download/${user.id}/${randomDefaultBirthdayTheme}/${contact.id}`;
            var url = `${BASEPATH}/temp/review/download/${user.id}/${randomDefaultBirthdayTheme}/${contact.id}`;
            console.log(url);
            //htmltocanvas code//
            console.log('cron working');
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              auth: {
                user: 'souvik.hajra@xigmapro.com',
                pass: 'xigma123',
              },
            });
            // console.log("before func",user.email);
            if (contact) {
              // console.log("inside func",user.email);
              // send mail with defined transport object
              let info = transporter.sendMail({
                from: 'souvik.hajra@xigmapro.com',
                to: user.email,
                subject: `Xigwish Birthday Mail for ${contact.name}`,
                html: url, // html body
              });
            }
            //htmltocanvas code//
          });

        }
      }

    });



  });

  //return res.send({ cron: "contacts" });
}

///////////////////////////////////////
async function cronAnniversary(req,res){

  var userInfo = await Models.User.findAll({});
    // tomorrow all birthaday data
    var month = moment().month() + 1;
    var tomorrow = moment().add(1, 'days').date();
    const Op = Sequelize.Op;
    const TODAY_START = moment().format('YYYY-MM-DD 10:00');
    const today = format('yyyy-MM-dd hh:mm', new Date());
    const TODAY_END = moment().format('YYYY-MM-DD 23:59');
    var anniversarys = [];
    cron.schedule('00 22 * * *', () => {

      userInfo.forEach(async (user,index) => {
        anniversarys = await Models.Anniversary.findAll({
          where: {
            [Op.and]: [
              {
                userId:user.id,
              },
              {
                anniversaryday: Sequelize.where(
                  Sequelize.fn('month', Sequelize.col('anniversaryday')),
                  month
                ),
              },
              {
                anniversaryday: Sequelize.where(
                  Sequelize.fn('day', Sequelize.col('anniversaryday')),
                  tomorrow
                ),
              },
            ],
          },
        });

        if (anniversarys.length > 0) {
          if (today > TODAY_START && today < TODAY_END) {
            var arritem = user.anniversaryThemes.split(',');
            var randomDefaultBirthdayTheme = arritem[Math.floor(Math.random()*arritem.length)];
            //random birthday item from user birthday array//
            //1 0 * * *
            // 0 21 * * *
            console.log('running a task every minute');
            anniversarys.forEach((anniversary, i) => {
              //var url = `http://localhost:9128/temp/review/download/${userId}/${userInfo.defaultBirthdayTheme}/${contact.id}`;
              var url = `${BASEPATH}/temp/anniversary-review/download/${user.id}/${randomDefaultBirthdayTheme}/${anniversary.id}`;
              console.log(url);
              //htmltocanvas code//
              console.log('cron working');
              const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                  user: 'souvik.hajra@xigmapro.com',
                  pass: 'xigma123',
                },
              });
              if (anniversary) {
                // send mail with defined transport object
                let info = transporter.sendMail({
                  from: 'souvik.hajra@xigmapro.com',
                  to: user.email,
                  subject: `Xigwish Anniversary Mail for ${anniversary.brideName} and ${anniversary.groomName}`,
                  html: url, // html body
                });
              }
              //htmltocanvas code//
            });
          }
        }


      });

    });
   // return res.send({ cron: "contacts" });

}


///////////////////////////////////////////
async function cronAnniversaryB(req, res) {
  /////////////////////////////////////////////////////////////////
    var userInfo = await Models.User.findAll({});
    // tomorrow all birthaday data
    var month = moment().month() + 1;
    var tomorrow = moment().add(1, 'days').date();
    const Op = Sequelize.Op;
    const TODAY_START = moment().format('YYYY-MM-DD 10:00');
    const today = format('yyyy-MM-dd hh:mm', new Date());
    const TODAY_END = moment().format('YYYY-MM-DD 23:59');
    var anniversarys = [];
    userInfo.forEach(async (user,index) => {
      anniversarys = await Models.Anniversary.findAll({
        where: {
          [Op.and]: [
            {
              userId:user.id,
            },
            {
              anniversaryday: Sequelize.where(
                Sequelize.fn('month', Sequelize.col('anniversaryday')),
                month
              ),
            },
            {
              anniversaryday: Sequelize.where(
                Sequelize.fn('day', Sequelize.col('anniversaryday')),
                tomorrow
              ),
            },
          ],
        },
      });

      console.log(anniversarys.length);
    
      ///////////////////////////////////////////////
      if (anniversarys.length > 0) {
        console.log("TODAY_START",TODAY_START);
        console.log("today",today);
        console.log("TODAY_END",TODAY_END);
    
        if (today > TODAY_START && today < TODAY_END) {
          console.log('working');
          cron.schedule('* * * * *', () => {
            //random birthday item from user birthday array//
            var arritem = user.anniversaryThemes.split(',');
            var randomDefaultBirthdayTheme = arritem[Math.floor(Math.random()*arritem.length)];
            //random birthday item from user birthday array//
            //1 0 * * *
            // 0 21 * * *
            console.log('running a task every minute');
            anniversarys.forEach((anniversary, i) => {
              //var url = `http://localhost:9128/temp/review/download/${userId}/${userInfo.defaultBirthdayTheme}/${contact.id}`;
              var url = `${BASEPATH}/temp/review/download/${user.id}/${randomDefaultBirthdayTheme}/${anniversary.id}`;
              console.log(url);
              //htmltocanvas code//
              console.log('cron working');
              const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                  user: 'souvik.hajra@xigmapro.com',
                  pass: 'xigma123',
                },
              });
              if (anniversary) {
                // send mail with defined transport object
                let info = transporter.sendMail({
                  from: 'souvik.hajra@xigmapro.com',
                  to: user.email,
                  subject: `Xigwish Mail`,
                  html: url, // html body
                });
              }
              //htmltocanvas code//
            });
            //email + logic//
          }, {
            scheduled: true,
            timezone: "Asia/Kolkata"
          });
        }
      }
    });
    //return res.send({ cron: anniversarys });
  }

module.exports = {
  cronBirthday: cronBirthday,
  cronAnniversary: cronAnniversary,
};
