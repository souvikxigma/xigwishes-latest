const express = require('express');
const adminAuthController = require('../../controllers/admin/adminAuthController');
//middleware
// const authUserCheck = require('../../middleware/front/AuthCheck');
// const authNotUserCheck = require('../../middleware/front/AuthNotCheck');

const router = express.Router();

router.get('/login', adminAuthController.adminLogin);
router.post('/login/action', adminAuthController.adminLoginAction);
router.post('/register/action', adminAuthController.adminSignupAction);
router.get('/logout', adminAuthController.logout);

module.exports = router;