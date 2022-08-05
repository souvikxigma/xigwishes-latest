const express = require('express');
const adminSubEventController = require('../../controllers/admin/adminSubEventController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubEventList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubAddEvent);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubAddEventAction);

//ajax //
router.post('/ajaxsubfestival',adminAuthCheck.adminAuthUser ,adminSubEventController.adminGetSubFestivalCategoryAjax);

module.exports = router;