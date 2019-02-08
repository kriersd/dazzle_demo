var express = require('express');
var request = require('request'),
    sys = require('sys');

var Promise = require('bluebird');

var router = express.Router();


var addTwoPromise = function(num) {
    return new Promise(
        function (fulfill, reject) {
           fulfill(num + 2);
        }
     );
};

/* GET Bluebird page. */
router.get('/', function(req, res, next) {
    //Let's execute the promise
    addTwoPromise(1)
        .then(addTwoPromise)
        .then(addTwoPromise)
        .then(function(result) {
            console.log(result); // will print 7 in the console
            res.render('bluebird', { resultofbb: result });
        });
});

module.exports = router;


