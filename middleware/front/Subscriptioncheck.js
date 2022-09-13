const Models = require("../../models");

async function Subscriptioncheck(req, res, next) {

    const userid = req.id;
    const user = await Models.User.findOne({ where: { id: userid } });
    if(user && user.accountActiveStatus == '1'){
        next();
    }else{
        req.flash('error', 'Your package is expired.');
          return res.redirect('back');
    }

    
}



module.exports = {
    Subscriptioncheck: Subscriptioncheck,
};
