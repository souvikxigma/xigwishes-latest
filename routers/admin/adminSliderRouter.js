const express = require('express');
const adminSliderController = require('../../controllers/admin/adminSliderController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminSliderController.adminSliderList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminSliderController.adminAddSlider);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminSliderController.adminAddSliderAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminSliderController.adminEditSlider);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminSliderController.adminEditSliderAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminSliderController.adminDeleteSliderAction);


module.exports = router;