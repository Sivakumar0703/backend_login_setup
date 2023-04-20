var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(`<h1> Wlecome to Express </h1>`)
});

module.exports = router;
