var express = require('express');

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var Promise = require('bluebird');

var router = express.Router();

var cloudantcall = function(url, db, id) {
    console.log("id = " + id);
    return new Promise(
        function (resolve,reject) {

            // Initialize the Cloudant Connection with my Cludant URL.
            var cloudant = Cloudant(url, function(er, cloudant, reply) {

                if (er) {
                    //throw error if we can't connect;
                    console.log('Error Connecting ');
                    reject(er);
                } else {
                    console.log('Connected to DB - Fetching DB list');

                    var dbconn = cloudant.db.use(db);
                    console.log("Record _id = " + id);

                    dbconn.get(id, function(err, data) {
                        if (err) {
                            console.log('Error getting record');
                            reject(err);
                        } else {
                            console.log("Found record:", JSON.stringify(data));
                            // Sending a JSON object back in the Promise.
                            resolve(data);
                        }
                    });

                }
            });

        })
};


/* GET cards page. */
router.get('/', function(req, res, next) {
    //Let's execute the promise
    cloudantcall(process.env.db_full_url,process.env.db_name, req.query.id)
        .then(function(result) {
            //console.log("Here we go" + result);
            result.JSONOBJ = JSON.stringify(result);
            res.render('exportcards', result);
        }).catch(function (err) {
           // handle all errors here - Need to show a pretty message to the user.
           console.log("Promise (reject) Error Caught: "+ err);
           res.render('exportcards', { "errormsg": "Well this is embarassing!!! We took an error!!" });
    });
});

module.exports = router;


