const express = require('express');
const tempController = require('../../controllers/front/tempController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser,tempController.templateSubmit);
router.post('/action', tempController.templateSubmitAction);


router.get('/review/:uniqueCode',authUserCheck.authUser,tempController.templateReview1);
router.get('/anniversary-review/:uniqueCode',authUserCheck.authUser,tempController.templateReviewForAnniversary);

// template download
router.get('/review/download/:userId/:uniqueCode/:contactId/:downloadTheme?',tempController.templateReviewBirthdayDownload);
router.get('/anniversary-review/download/:userId/:uniqueCode/:contactId',tempController.templateReviewForAnniversaryDownload);

//ajax//
router.post('/review/birthday/ajax-theme-set',authUserCheck.authUser,tempController.setDefaultBirthdayImage);
router.post('/review/anniversary/ajax-theme-set',authUserCheck.authUser,tempController.setDefaultAnniversaryImage);


router.post('/festivalAjax',authUserCheck.authUser,tempController.getFestivalAjaxSort);


module.exports = router;