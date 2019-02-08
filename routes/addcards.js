var express = require('express');

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var Promise = require('bluebird');

var moment = require('moment');

var router = express.Router();

var cloudantcall = function(url, db, doc_str) {
    //console.log("id = " + id);
    console.log("*********************   GOT HERE ***********************************");
    console.log(doc_str);
    return new Promise(
        function (resolve,reject) {

            // Initialize the Cloudant Connection with my Cludant URL.
            var cloudant = Cloudant(url, function(er, cloudant, reply) {

                if (er) {
                    //throw error if we can't connect;
                    console.log('Error Connecting ');
                    reject(er);
                } else {
                    console.log('Connected to DB - About to save doc');

                    var dbconn = cloudant.db.use(db);
                    //console.log("Record _id = " + id);

                    var CurrentDate = moment().format("YYYY-MM-DD-kk-mm-ss");
                    doc_str.timestamp = CurrentDate;

                    dbconn.insert(doc_str,function(err, data) {
                    //dbconn.get(id, function(err, data) {
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

/* Add cards page. */
router.post('/', function(req, res, next) {

    //Let's execute the promise
    cloudantcall(process.env.db_full_url,process.env.db_name,req.body)
        .then(function(result) {
            console.log("Here is the result: " + result);
            res.render('addcards', { "good": "stuff" });

        }).catch(function (err) {
          // handle all errors here - Need to show a pretty message to the user.
          console.log("Promise (reject) Error Caught: "+ err);
        res.render('addcards', { "errormsg": "Well this is embarassing!!! We took an error!!" });
    });


});


module.exports = router;


