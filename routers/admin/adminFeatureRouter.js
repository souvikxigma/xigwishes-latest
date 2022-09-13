const express = require('express');
const adminFeatureController = require('../../controllers/admin/adminFeatureController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminFeatureController.adminFeatureList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminFeatureController.adminAddFeature);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminFeatureController.adminAddFeatureAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminFeatureController.adminEditFeature);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminFeatureController.adminEditFeatureAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminFeatureController.adminDeleteFeatureAction);


module.exports = router;