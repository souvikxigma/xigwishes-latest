const express = require('express');
const adminHowworkController = require('../../controllers/admin/adminHowworkController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminHowworkController.adminHowworkList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminHowworkController.adminAddHowwork);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminHowworkController.adminAddHowworkAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminHowworkController.adminEditHowwork);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminHowworkController.adminEditHowworkAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminHowworkController.adminDeleteHowworkAction);

module.exports = router;