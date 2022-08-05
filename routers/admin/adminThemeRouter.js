const express = require('express');
const adminThemeController = require('../../controllers/admin/adminThemeController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser ,adminThemeController.adminThemeList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminThemeController.adminAddTheme);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminThemeController.adminAddThemeAction);


//ajax function//
router.post(`/add/subthemeajax`,adminAuthCheck.adminAuthUser, adminThemeController.getSubcategoryBycategoryAjax);

module.exports = router;