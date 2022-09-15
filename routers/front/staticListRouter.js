const express = require('express');
const staticListController = require('../../controllers/front/staticListController');

const router = express.Router();

router.get('/support', staticListController.support);
router.get('/terms-condition', staticListController.termsCondition);
router.get('/privacy-policy', staticListController.privacyPolicy);
router.get('/cancelation-refund', staticListController.cancelationRefund);
router.get('/about-us', staticListController.aboutUs); 
router.get('/contact-us', staticListController.contactUs); 
router.post('/contact-us/action', staticListController.contactUsAction); 
router.get('/how-it-work', staticListController.howItWork); 
////


module.exports = router;