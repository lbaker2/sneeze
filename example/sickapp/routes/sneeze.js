// SNEEZE ROUTES

var express = require('express');
var router = express.Router();

/* GET all errors */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST a new error */
router.post('/', function(req, res, next) {
	console.log(req.body);
	res.send('ok we got the error!');
});

module.exports = router;
