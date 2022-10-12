const express = require('express');
const staticListController = require('../../controllers/front/staticListController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/support', staticListController.support);
router.get('/terms-condition', staticListController.termsCondition);
router.get('/privacy-policy', staticListController.privacyPolicy);
router.get('/cancelation-refund', staticListController.cancelationRefund);
router.get('/about-us', staticListController.aboutUs); 
router.get('/contact-us', staticListController.contactUs); 
router.post('/contact-us/action', staticListController.contactUsAction); 
router.get('/how-it-work', staticListController.howItWork); 
router.get('/request-customized-banner', authUserCheck.authUser, staticListController.viewCustomizedBanner); 
router.post('/request-customized-banner/action', authUserCheck.authUser, staticListController.viewCustomizedBannerAction); 
////


module.exports = router;