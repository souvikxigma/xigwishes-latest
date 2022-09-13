const express = require('express');
const adminQnaController = require('../../controllers/admin/adminQnaController');
//middleware
const adminAuthCheck = require('../../middleware/admin/AdminAuthCheck');

const router = express.Router();

router.get('/',adminAuthCheck.adminAuthUser , adminQnaController.adminQnaList);
router.get('/add',adminAuthCheck.adminAuthUser ,adminQnaController.adminAddQna);
router.post('/add/action',adminAuthCheck.adminAuthUser ,adminQnaController.adminAddQnaAction);
router.get('/edit/:id',adminAuthCheck.adminAuthUser ,adminQnaController.adminEditQna);
router.post('/edit/action/:id',adminAuthCheck.adminAuthUser ,adminQnaController.adminEditQnaAction);
router.get('/delete/:id',adminAuthCheck.adminAuthUser ,adminQnaController.adminDeleteQnaAction);


module.exports = router;