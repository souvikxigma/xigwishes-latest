const express = require('express');
const adminSubEventController = require('../../controllers/admin/adminSubEventController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubEventList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubAddEvent);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubAddEventAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubEventDelete);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubEventEdit);
router.post('/edit/action/:cid/:id',adminAuthCheck.adminAuthUser ,adminSubEventController.adminSubEventEditAction);

//ajax //
router.post('/ajaxsubfestival',adminAuthCheck.adminAuthUser ,adminSubEventController.adminGetSubFestivalCategoryAjax);

module.exports = router;