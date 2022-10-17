const express = require('express');
const adminCmsController = require('../../controllers/admin/adminCmsController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminCmsController.adminCmsList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminCmsController.adminAddCms);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminCmsController.adminAddCmsAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminCmsController.adminEditCms);
router.post('/edit/action/:cid/:id',adminAuthCheck.adminAuthUser ,adminCmsController.adminEditCmsAction);
router.get('/delete/:cid/:id',adminAuthCheck.adminAuthUser ,adminCmsController.adminDeleteCmsAction);

module.exports = router;