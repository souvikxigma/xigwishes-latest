const express = require('express');
const contactController = require('../../controllers/front/contactController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

// router.get('/',authUserCheck.authUser, contactController.index);
// router.get('/add',authUserCheck.authUser, contactController.add);
// router.post('/add/action',authUserCheck.authUser, contactController.addAction);
///birthday////
router.get('/', contactController.birthdayThemeList);
router.get('/list',authUserCheck.authUser, contactController.birthdayList);
router.get('/add-birthday',authUserCheck.authUser, contactController.addBirthday);
router.post('/add-birthday/action',authUserCheck.authUser, contactController.addBirthdayAction);
///anniversary///
router.get('/anniversary-list',authUserCheck.authUser, contactController.allAnniversaryList);
router.get('/add-anniversary',authUserCheck.authUser, contactController.addAnniversary);
router.post('/add-anniversary/action',authUserCheck.authUser, contactController.addAnniversaryAction);


module.exports = router;