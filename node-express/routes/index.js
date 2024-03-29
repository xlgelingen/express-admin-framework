var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Framework' });
});

// router.get('/user', userController.Show);
// router.get('/login', authController.renderLogin);



module.exports = router;
