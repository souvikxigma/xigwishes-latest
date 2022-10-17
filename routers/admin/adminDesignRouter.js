const express = require('express');
const adminDesignController = require('../../controllers/admin/adminDesignController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminDesignController.adminDesignList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminDesignController.adminAddDesign);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminDesignController.adminAddDesignAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminDesignController.adminEditDesign);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminDesignController.adminEditDesignAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminDesignController.adminDeleteDesignAction);


module.exports = router;