var express = require('express');
var request = require('request');
    sys = require('sys');

var router = express.Router();
var joke = "";

/* GET home page. */
router.get('/', function(req, res, next) {
    request({ uri:'http://api.icndb.com/jokes/random?exclude=[nerdy,explicit]&limitTo=[nerdy]' }, function (error, response, body) {
        if (!(error && response.statusCode !== 200)) {
            var obj = JSON.parse(body);
            joke = obj.value.joke;
            res.render('chuck', { joke: joke });
        } else {
            console.log('Error when contacting the API')
            joke = "ERROR";
            res.render('chuck', { joke: joke });
        }
    });

});

module.exports = router;