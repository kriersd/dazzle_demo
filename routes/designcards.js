var express = require('express');

var router = express.Router();

/* GET Design Cards Page. */
router.get('/', function(req, res, next) {

    res.render('designcards');

});

module.exports = router;


