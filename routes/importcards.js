var express = require('express');

var router = express.Router();

/* GET Imports Page. */
router.get('/', function(req, res, next) {
    res.render('importcards');
});

module.exports = router;


