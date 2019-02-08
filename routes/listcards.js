var express = require('express');
//var request = require('request'),
//    sys = require('sys');

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var Promise = require('bluebird');

var router = express.Router();

var cloudantcall = function(url, db) {
//    console.log("id = " + id);
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
                    //console.log("Record _id = " + id);

                    //  *** This just lists all without the SORT  *************
                    //dbconn.list({include_docs:true}, function (err, data) {
                    //
                    //  Need to change the listcards.hbs if you just use the list
                    //  all the fields within the 'rows' section need doc. in front of them.
                    //  *** This just lists all without the SORT  *************


                    //  *** ADDED THIS for the SORT  *************
                    dbconn.find({
                        "selector": {
                            "_id": {
                                "$gt": "0"
                            }
                        },
                        "fields": [
                            "_id",
                            "_rev",
                            "timestamp",
                            "owner_name",
                            "event"
                        ],
                        "sort": [
                            {
                                "timestamp": "desc"
                            }
                        ]
                    },function (err, data) {
                    // *************************************************************


                        //dbconn.list({include_docs:true}, function (err, data) {
                        if (err) {
                            console.log('Error getting record');
                            reject(err);
                        } else {
                            console.log("List Retrieved:", JSON.stringify(data));
                            // Sending a JSON object back in the Promise.


                            // If using the find() function the result will be in the docs field. Need to push that into the
                            // rows filed, which is what is returned from the list() function.
                            data.rows = data.docs;
                            delete data.docs;
                            console.log(JSON.stringify(data));


                            resolve(data);
                        }
                    });
                }
            });
        })
};


/* GET List page. */

router.get('/', function(req, res, next) {
    //Let's execute the promise
    console.log(process.env.db_full_url);
    cloudantcall(process.env.db_full_url,process.env.db_name)
        .then(function(result) {
            console.log("Here we go" + result);
            // All good... Sending the JSON document from Cloudant to the page
            res.render('listcards', result);
        }).catch(function (err) {
        // handle all errors here - Need to show a pretty message to the user.
        console.log("Promise (reject) Error Caught: "+ err);
        res.render('listcards', { "errormsg": "Well this is embarassing!!! We took an error!!" });
    });
});


/*
var addTwoPromise = function(num) {
    return new Promise(
        function (fulfill, reject) {
           fulfill(num + 2);
        }
     );
};
*/


/* GET Bluebird page. */
/*
router.get('/', function(req, res, next) {
    //Let's execute the promise
    addTwoPromise(1)
        .then(addTwoPromise)
        .then(addTwoPromise)
        .then(function(result) {
            console.log(result); // will print 7 in the console
            res.render('listcards', { resultofbb: result });
        });
});
*/

module.exports = router;


