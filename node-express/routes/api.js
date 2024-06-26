var express = require('express');
var router = express.Router();

var bookController = require('./../controllers/book')
var userController = require('./../controllers/user')
var roleController = require('./../controllers/role')
var permissionController = require('./../controllers/permission.js')
var loginController = require('./../controllers/login.js');
var tokenController = require('../controllers/token')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/isbn', bookController.info);
router.post('/token', tokenController.verify);

router.post('/login/phone', loginController.phoneLogin);
router.post('/login/account', loginController.accountLogin);
// router.get('/logout', loginController.logout);

router.get('/admin/users/user-info', userController.index);
router.post('/admin/users/create', userController.insert);
router.post('/admin/users/edit', userController.renderEdit);
router.put('/admin/users/edit', userController.update);
router.delete('/admin/users/del', userController.delete);

router.get('/admin/permissions/permission-info', permissionController.index);
router.post('/admin/permissions/permission-info', permissionController.select);

router.get('/admin/roles/role-info', roleController.index);
router.post('/admin/roles/create', roleController.insert);
router.post('/admin/roles/edit', roleController.renderEdit);
router.put('/admin/roles/edit', roleController.update);
router.delete('/admin/roles/del',roleController.delete);



module.exports = router;
