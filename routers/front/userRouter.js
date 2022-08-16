const express = require('express');
const userController = require('../../controllers/front/userController');
//middleware
const authUserCheck = require('../../middleware/front/AuthCheck');
const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/signup',authNotUserCheck.authNotUser, userController.signup);
router.post('/signup/action', userController.signupAction);
router.post('/signup/action/ajax', userController.signupActionAjax);

router.get('/login',authNotUserCheck.authNotUser, userController.login);
router.post('/login/action', userController.loginAction);
router.post('/login/action/ajax', userController.loginActionAjax);


router.get('/email/verification/:token/:emailid', userController.emailVerification);

router.get('/user/profile',authUserCheck.authUser, userController.profile);
router.post('/user/profile/action',authUserCheck.authUser, userController.profileUpdate);

router.get('/logout',authUserCheck.authUser, userController.logout);

module.exports = router;