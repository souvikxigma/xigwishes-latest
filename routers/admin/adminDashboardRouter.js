
const express = require('express');
const adminDashboardController = require('../../controllers/admin/adminDashboardController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/', adminAuthCheck.adminAuthUser ,adminDashboardController.adminDashboard);

module.exports = router;