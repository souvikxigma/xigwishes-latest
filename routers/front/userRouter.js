const express = require('express');
const userController = require('../../controllers/front/userController');
//middleware
const authUserCheck = require('../../middleware/front/AuthCheck');
const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/signup',authNotUserCheck.authNotUser, userController.signup);
router.post('/signup/action', userController.signupAction);

router.get('/login',authNotUserCheck.authNotUser, userController.login);
router.post('/login/action', userController.loginAction);

//social google login//
router.get('/auth/google/callback/success', userController.authGoogleCallbackSuccess);
router.get('/auth/google/callback/failure', userController.authGoogleCallbackFailure);
//social facebook login//
router.get('/auth/facebook/callback/success', userController.authFacebookCallbackSuccess);
router.get('/auth/facebook/callback/failure', userController.authFacebookCallbackFailure);



router.get('/email/verification/:token/:emailid', userController.emailVerification);

router.get('/profile',authUserCheck.authUser, userController.profile);
router.post('/profile/action',authUserCheck.authUser, userController.profileUpdate);

//forget password//
router.post('/forget-password', userController.forgetPasswordView);
router.get('/reset-password', userController.resetPasswordView);
router.post('/update-password', userController.updateResetPassword);

//change password//

router.get('/change-password', authUserCheck.authUser, userController.changePasswordView);
router.post('/change-password/action', authUserCheck.authUser, userController.changePasswordAction);

router.get('/logout',authUserCheck.authUser, userController.logout);

module.exports = router;