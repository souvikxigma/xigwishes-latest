const express = require('express');
const adminCompanyController = require('../../controllers/admin/adminCompanyController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser ,adminCompanyController.adminEditCompany);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminCompanyController.adminEditCompanyAction);

module.exports = router;