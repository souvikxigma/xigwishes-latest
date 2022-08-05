const express = require('express');
const adminEventController = require('../../controllers/admin/adminEventController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser ,adminEventController.adminEventList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminEventController.adminAddEvent);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminEventController.adminAddEventAction);

router.get('/add-festival-name',adminAuthCheck.adminAuthUser ,adminEventController.adminAddFestivalEvent);
router.post('/add-festival-name/action',adminAuthCheck.adminAuthUser ,adminEventController.adminAddFestivalEventAction);

module.exports = router;