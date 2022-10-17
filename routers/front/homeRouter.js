const express = require('express');
const homeController = require('../../controllers/front/homeController');
//middleware
// const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/', homeController.home);
router.get('/loader', homeController.loaderFunc);

module.exports = router;