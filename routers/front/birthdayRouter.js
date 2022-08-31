const express = require('express');
const birthdayController = require('../../controllers/front/birthdayController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/', birthdayController.birthdayThemeList);
router.get('/list',authUserCheck.authUser, birthdayController.birthdayList);
router.get('/add-birthday',authUserCheck.authUser, birthdayController.addBirthday);
router.post('/add-birthday/action',authUserCheck.authUser, birthdayController.addBirthdayAction);

router.get('/fav-theme',authUserCheck.authUser, birthdayController.userFavBirthdayTheme);

///ajax///
router.post('/set-birthday-theme', authUserCheck.authUser, birthdayController.setBirthdayThemeAction);
router.post('/remove-birthday-theme', authUserCheck.authUser, birthdayController.setBirthdayRemoveThemeAction);


module.exports = router;