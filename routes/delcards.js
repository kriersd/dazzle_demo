var express = require('express');

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var Promise = require('bluebird');

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


var cloudantDelDoc = function(url, db, id, rev) {
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
                    dbconn.destroy(id, rev,  function(err) {
                        if (!err) {
                            console.log("Successfully deleted doc: " + id);
                            var successDoc = {success: true, msg: 'Successfully deleted the item from the database.'};

                            // Sending a JSON object back in the Promise.
                            resolve(successDoc);
                        } else {
                            var rejDoc = {success: false, msg: 'Failed to delete with fkId from the database, please try again.'};

                            // Sending a JSON object back in the Promise.
                            reject(rejDoc);
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

        .then(function(docToDel) {
            //console.log("Here we go" + docToDel);
            console.log( "ID: " + docToDel._id + "  REV: "  + docToDel._rev);

            cloudantDelDoc(process.env.db_full_url,process.env.db_name, docToDel._id, docToDel._rev)
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



