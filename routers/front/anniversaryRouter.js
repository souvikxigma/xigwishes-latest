const express = require('express');
const anniversaryController = require('../../controllers/front/anniversaryController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/', anniversaryController.anniversaryThemeList);
router.get('/list',authUserCheck.authUser, anniversaryController.anniversaryList);
router.get('/add-anniversary',authUserCheck.authUser, anniversaryController.addAnniversary);
router.post('/add-anniversary/action',authUserCheck.authUser, anniversaryController.addAnniversaryAction);
router.get('/fav-theme',authUserCheck.authUser, anniversaryController.userFavAnniversaryTheme);

///ajax///
router.post('/set-anniversary-theme', authUserCheck.authUser, anniversaryController.setAnniversaryThemeAction);
router.post('/remove-anniversary-theme', authUserCheck.authUser, anniversaryController.setAnniversaryRemoveThemeAction);

module.exports = router;