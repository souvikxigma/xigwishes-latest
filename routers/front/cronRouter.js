const express = require('express');
const cronController = require('../../controllers/front/cronController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',cronController.cronBirthday);
//router.get('/',authUserCheck.authUser, cronController.cronAnniversary);

module.exports = router;