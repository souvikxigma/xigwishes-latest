var cron = require('node-cron');
const Models = require('../../models');
const Sequelize = require('sequelize');
var format = require('date-format');
////
const moment = require('moment');


async function cronBirthday(req, res) {
    
    const Op = Sequelize.Op;
    const TODAY_START = moment().format('YYYY-MM-DD 00:00');
    const NOW = moment().format('YYYY-MM-DD 23:59');

    const users = await Models.Contact.findAll({
        where: {
          birthday: { 
            [Op.between]: [
                TODAY_START,
                NOW,
            ]
          },
        },
     });
     console.log(users);

      if(users.length > 0){
        cron.schedule('* * * * *', () => {
            //1 0 * * *
            console.log('running a task every minute');

            users.forEach((user,i) => {
              console.log(user)
              //htmltocanvas code//
              
              //htmltocanvas code//
            });

            //email + logic//
        });
      }

    return res.send({"cron":"success"});
}


module.exports = {
    cronBirthday: cronBirthday,
}