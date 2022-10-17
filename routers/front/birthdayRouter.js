const express = require('express');
const birthdayController = require('../../controllers/front/birthdayController');

const authUserCheck = require('../../middleware/front/AuthCheck');
const Subscriptioncheck = require('../../middleware/front/Subscriptioncheck');

const router = express.Router();

router.get('/', birthdayController.birthdayThemeList);
router.get('/list',authUserCheck.authUser, birthdayController.birthdayList);
router.get('/upcoming',authUserCheck.authUser, birthdayController.upcomingBirthdayList);
router.get('/add-birthday',authUserCheck.authUser,Subscriptioncheck.Subscriptioncheck, birthdayController.addBirthday);
router.post('/add-birthday/action',authUserCheck.authUser, birthdayController.addBirthdayAction);

router.get('/edit-birthday/:id',authUserCheck.authUser,Subscriptioncheck.Subscriptioncheck, birthdayController.editBirthday);
router.post('/edit-birthday/action',authUserCheck.authUser, birthdayController.editBirthdayAction);

router.get('/delete-birthday/:id',authUserCheck.authUser,Subscriptioncheck.Subscriptioncheck, birthdayController.deleteBirthday);

router.get('/theme/:contactId',authUserCheck.authUser,Subscriptioncheck.Subscriptioncheck, birthdayController.themeBirthday);


router.get('/fav-theme',authUserCheck.authUser,Subscriptioncheck.Subscriptioncheck, birthdayController.userFavBirthdayTheme);

///ajax///
router.post('/set-birthday-theme', authUserCheck.authUser, birthdayController.setBirthdayThemeAction);
router.post('/remove-birthday-theme', authUserCheck.authUser, birthdayController.setBirthdayRemoveThemeAction);


module.exports = router;