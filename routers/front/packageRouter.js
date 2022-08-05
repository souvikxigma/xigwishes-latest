const express = require('express');
const packageController = require('../../controllers/front/PackageController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser, packageController.index);
router.post('/action',authUserCheck.authUser, packageController.packagePayment);
// router.get('/add',authUserCheck.authUser, contactController.add);
// router.post('/add/action',authUserCheck.authUser, contactController.addAction);


module.exports = router;