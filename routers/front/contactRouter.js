const express = require('express');
const contactController = require('../../controllers/front/contactController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser, contactController.index);
router.get('/add',authUserCheck.authUser, contactController.add);
router.post('/add/action',authUserCheck.authUser, contactController.addAction);


module.exports = router;