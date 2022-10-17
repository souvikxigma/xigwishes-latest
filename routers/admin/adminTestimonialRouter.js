const express = require('express');
const adminTestimonialController = require('../../controllers/admin/adminTestimonialController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminTestimonialController.adminTestimonialList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminTestimonialController.adminAddTestimonial);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminTestimonialController.adminAddTestimonialAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminTestimonialController.adminEditTestimonial);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminTestimonialController.adminEditTestimonialAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminTestimonialController.adminDeleteTestimonialAction);


module.exports = router;