const express = require('express');
const adminEventController = require('../../controllers/admin/adminEventController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser ,adminEventController.adminEventList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminEventController.adminAddEvent);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminEventController.adminAddEventAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventDelete);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventEdit);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventEditAction);

router.get('/festival/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventFestivalList);
router.get('/add-festival-name',adminAuthCheck.adminAuthUser ,adminEventController.adminAddFestivalEvent);
router.post('/add-festival-name/action',adminAuthCheck.adminAuthUser ,adminEventController.adminAddFestivalEventAction);
router.get('/festival/delete/:cid/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventFestivalDelete);
router.get('/festival/edit/:cid/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventFestivalEdit);
router.post('/festival/edit/action/:cid/:id',adminAuthCheck.adminAuthUser ,adminEventController.adminEventFestivalEditAction);

module.exports = router;