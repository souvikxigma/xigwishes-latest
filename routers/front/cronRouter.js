const express = require('express');
const cronController = require('../../controllers/front/cronController');

const router = express.Router();

router.get('/', cronController.cronBirthday);

module.exports = router;