var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage/template/index', {url : req.protocol + '://' + req.get('host') + req.originalUrl});
});

module.exports = router;