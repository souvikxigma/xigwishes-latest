const express = require('express');
const homeController = require('../../controllers/front/homeController');
//middleware
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser, homeController.home);

module.exports = router;