var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('library_home', { title: 'Biblioteca Local' });
});

module.exports = router;
