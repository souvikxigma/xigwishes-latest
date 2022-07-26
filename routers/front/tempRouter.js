const express = require('express');
const tempController = require('../../controllers/front/tempController');
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/',authUserCheck.authUser,tempController.templateSubmit);
router.post('/action', tempController.templateSubmitAction);
router.get('/review/1/:id/:uniqueCode',tempController.templateReview1);
router.get('/review/2/:id/:uniqueCode',tempController.templateReview2);
router.get('/review/3/:id/:uniqueCode',tempController.templateReview3);
router.get('/review/4/:id/:uniqueCode',tempController.templateReview4);
router.get('/review/5/:id/:uniqueCode',tempController.templateReview5);


module.exports = router;