var cron = require('node-cron');
const Models = require('../../models');
const Sequelize = require('sequelize');
var format = require('date-format');
const nodemailer = require("nodemailer");
const moment = require('moment');

async function cronBirthday(req, res) {
  var userId = req.id;
  var userInfo = await Models.User.findOne({where:{id:userId}});

  // tomorrow all birthaday data
  var month = moment().month() + 1;
  var tomorrow = moment().add(1, 'days').date();

  const Op = Sequelize.Op;

  const TODAY_START = moment().format('YYYY-MM-DD 17:00');
  const today = format('yyyy-MM-dd hh:mm', new Date());
  const TODAY_END = moment().format('YYYY-MM-DD 23:59');
  const contacts = await Models.Contact.findAll({
    where: {
      [Op.and]: [
        {
          userId:userId,
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

  console.log(contacts);
  if (contacts.length > 0) {
    if (today > TODAY_START && today < TODAY_END) {
      console.log('working');
      cron.schedule('0 21 * * *', () => {
        //1 0 * * *
        // 0 21 * * *
        console.log('running a task every minute');
        contacts.forEach((contact, i) => {
          
          var url = `http://localhost:9128/temp/review/download/${userId}/${userInfo.defaultBirthdayTheme}/${contact.id}`;
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
          if (contact) {
            // send mail with defined transport object
            let info = transporter.sendMail({
              from: 'souvik.hajra@xigmapro.com',
              to: userInfo.email,
              subject: `Xigwish Mail`,
              html: url, // html body
            });
          }
          //htmltocanvas code//
        });
        //email + logic//
      });
    }
  }

  return res.send({ cron: contacts });
}

module.exports = {
  cronBirthday: cronBirthday,
};
