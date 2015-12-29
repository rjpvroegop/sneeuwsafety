var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage/template/index', { welcome: '../homepage/home/welcome.ejs' });
});

module.exports = router;
