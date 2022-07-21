const express = require('express');
const contactController = require('../../controllers/front/contactController');
// const authUserCheck = require('../middleware/AuthCheckByLocal');

const router = express.Router();

router.get('/', contactController.index);
router.get('/add', contactController.add);
router.post('/add/action', contactController.addAction);
////
router.get('/temp',contactController.templateSubmit);
router.post('/temp/action', contactController.templateSubmitAction);


router.get('/temp/review/:id/:uniqueCode',contactController.templateReview);


module.exports = router;