var express = require('express');
var router = express.Router();

/* GET Dashboard */
router.get('/', function(req, res, next) {
 
  res.status(200).send({
    admin:'siva',
    notification:5,
    invites:2
  })
});

module.exports = router;