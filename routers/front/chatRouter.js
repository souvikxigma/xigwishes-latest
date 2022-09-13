const express = require('express');
const chatController = require('../../controllers/front/chatController');
//middleware
const authUserCheck = require('../../middleware/front/AuthCheck');

const router = express.Router();

router.get('/', authUserCheck.authUser, chatController.index);


module.exports = router;