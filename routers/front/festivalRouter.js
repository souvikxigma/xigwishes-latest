const express = require('express');
const festivalController = require('../../controllers/front/festivalController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/', festivalController.festivalThemeList);
router.get('/fav-theme',authUserCheck.authUser, festivalController.userFavHolidayTheme);
router.post('/sort/ajax',authUserCheck.authUser, festivalController.getFestivalAjaxSort);

router.post('/sort/ajax/new', festivalController.getNewFestivalAjaxSort);


///ajax///
router.post('/set-holidays-theme', authUserCheck.authUser, festivalController.setFestivalThemeAction);
router.post('/remove-holidays-theme', authUserCheck.authUser, festivalController.setFestivalRemoveThemeAction);



module.exports = router;