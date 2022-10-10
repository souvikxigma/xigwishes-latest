const nodemailer = require('nodemailer');
const {BASEPATH} = require('../config/path.config.js');

//send email
function sendEmail(email, token) {
 
    var email = email;
    var token = token; 
 
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'souvik.hajra@xigmapro.com',
          pass: 'xigma123'
        }
      });
 
    var mailOptions = {
        from: 'souvik.hajra@xigmapro.com',
        to: email,
        subject: 'Reset Password Link - Xigwishes',
        html: `<p>You requested for reset password, kindly use this <a href="${BASEPATH}/reset-password?token=' + token + '">link</a> to reset your password</p>`
 
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