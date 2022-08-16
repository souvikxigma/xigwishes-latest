const express = require('express');
const staticListController = require('../../controllers/front/staticListController');

const router = express.Router();

router.get('/', staticListController.support);
router.get('/terms-condition', staticListController.termsCondition);
router.get('/privacy-policy', staticListController.privacyPolicy);
router.get('/cancelation-refund', staticListController.cancelationRefund);
router.get('/about-us', staticListController.aboutUs);
////


module.exports = router;