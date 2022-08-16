const express = require('express');
const adminUsersController = require('../../controllers/admin/adminUsersController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminUsersController.index);
router.get('/birthday/:uid',adminAuthCheck.adminAuthUser , adminUsersController.viewAllBirthdayByUser);
router.get('/anniversary/:uid',adminAuthCheck.adminAuthUser , adminUsersController.viewAllAnniversaryByUser);
// router.get('/add',adminAuthCheck.adminAuthUser ,adminThemeController.adminAddTheme);
// router.post('/add/action',adminAuthCheck.adminAuthUser ,adminThemeController.adminAddThemeAction);


//ajax function//
module.exports = router;