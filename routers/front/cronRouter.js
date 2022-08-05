const express = require('express');
const cronController = require('../../controllers/front/cronController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser, cronController.cronBirthday);

module.exports = router;