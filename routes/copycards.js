var express = require('express');

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var Promise = require('bluebird');

var moment = require('moment');

var router = express.Router();

var cloudantGetDoc = function(url, db, id) {
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


var cloudantInsertDoc = function(url, db, doc_str) {
    //console.log("id = " + id);
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

                    dbconn.insert(doc_str,function(err, data) {
                        //dbconn.get(id, function(err, data) {
                        if (err) {
                            console.log('Error inserting document!!!');
                            reject(err);
                        } else {
                            console.log("Document hs been inserted: ", JSON.stringify(data));
                            // Sending a JSON object back in the Promise.
                            resolve(data);
                        }
                    });

                }
            });

        })
};

/* GET doc and delete - Send back to List page. */
router.get('/', function(req, res, next) {
    //Let's execute the promise
    cloudantGetDoc(process.env.db_full_url,process.env.db_name, req.query.id)
        .then(function(docToCopy) {
            //console.log("Here we go" + docToDel);
            console.log( "ID: " + docToCopy._id);

            var CurrentDate = moment().format("YYYY-MM-DD-kk-mm-ss");
            console.log("Date TS: " + CurrentDate);
            docToCopy.timestamp = CurrentDate;
            docToCopy._id = (docToCopy.event + "-" + CurrentDate);

            delete docToCopy._rev;  // Remove this..

            console.log("NEW DOC: " + JSON.stringify(docToCopy));

            cloudantInsertDoc(process.env.db_full_url,process.env.db_name, docToCopy)
                .then(function(result) {
                    console.log("Doc Should be toasted!!!");

                    // Send them to the list cards page. ALL GOOD!!s
                    res.redirect('/listcards');

                }).catch(function (err) {
                // handle all errors here - Need to show a pretty message to the user.
                console.log("Promise (reject) Error Caught: "+ err);
                res.render('listcards', { "errormsg": "Well this is embarassing!!! We took an error!!" });
            });

        }).catch(function (err) {
        // handle all errors here - Need to show a pretty message to the user.
        console.log("Promise (reject) Error Caught: "+ err);
        res.render('listcards', { "errormsg": "Well this is embarassing!!! We took an error!!" });
    });
});

module.exports = router;

