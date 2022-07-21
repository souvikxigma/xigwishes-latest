const express = require('express');
const tempController = require('../../controllers/front/tempController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser,tempController.templateSubmit);
router.post('/action', tempController.templateSubmitAction);
router.get('/review/:id/:uniqueCode',tempController.templateReview);


module.exports = router;