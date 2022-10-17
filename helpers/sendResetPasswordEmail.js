const nodemailer = require('nodemailer');
const {BASEPATH} = require('../config/path.config.js');

//send email
function sendEmail(email, token) {
 
    var email = email;
    var token = token; 
 
    const transporter = nodemailer.createTransport({
        host: 'xigwishes.com',
        port: 465,
        secure: true,
        auth: {
          user: 'no-reply@xigwishes.com',
          pass: 'no-reply@xigwishes'
        }
      });
 
    var mailOptions = {
        from: 'no-reply@xigwishes.com',
        to: email,
        subject: 'Reset Password Link - Xigwishes',
        html: `<p>You requested for reset password, kindly use this <a href="${BASEPATH}/reset-password?token=${token}">link</a> to reset your password</p>`
 
    };
 
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
}

module.exports = {
    sendResetEmail: sendEmail,
};