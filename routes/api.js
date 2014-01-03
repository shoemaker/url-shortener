var url = require('url');
var mongo = require('mongodb');  // Init MongoDB library
var moment = require('moment');
var models = require('../models');
var c = require('../config').config;  // App configuration
var util = require('../util');

var Db = mongo.Db;
var ObjectID = require('mongodb').ObjectID;


// CREATE a short url. 
exports.create = function(req, res) {
    // If we are in development, a default/debug user will be specified. 
    if (c.debugUser) { req.cookies.userid = c.debugUser; }

    var response = models.wrapper();

    // Check that a URL was provided
    if (!req.body.url)
    {
        response.message = 'No URL was provided.';
        response.isSuccessful = false;
        res.json(500, response);
    } else {
        // URL validation
        // TO DO: more we can do here. 
        var oUrl = url.parse(req.body.url);
        if (!oUrl.protocol) req.body.url = 'http://' + req.body.url;

        // Map details to a new url object
        var newUrl = models.url();
        newUrl.longUrl = req.body.url;
        newUrl.userId = req.cookies.userid;
        newUrl.shortCode = generateShortCode(6);
        newUrl.createDate = new Date();

        // Build query
        var query = {};
        query.shortCode = newUrl.shortCode;

        Db.connect(util.buildMongoURL(c.dbs.common), function(err, db) {
            if(!err) {
                db.collection('urls', {safe:false}, function(err, collection) {
                    
                    collection.update(query, newUrl, {safe:false, upsert:true}, function(err, result) {
                        if (err) {
                            response.message = 'Encountered error: ' + err + '.';
                            response.isSuccessful = false;
                            res.json(500, response);
                        } else {
                            response.message = 'Successfully added new URL.';
                            newUrl.shortUrl = util.buildShortURL(newUrl.shortCode);
                            newUrl.accessedDate = (newUrl.accessedDate) ? moment(newUrl.accessedDate).format('D-MMM-YYYY, HH:mm:ss') : '--';
                            response.data = newUrl;
                            res.json(200, response);    
                        }
                        
                        db.close();
                    });
                })
            } else {
                response.message = 'Encountered error connecting to database. ' + err + '.';
                response.isSuccessful = false;
                res.json(500, response);
            }
        });
    }
};


// GET a specific URL record.
// if no short code, retrieve all for this user.
exports.get = function(req, res) {
    var response = models.wrapper();    
    
    // If we are in development, a default/debug user will be specified. 
    if (c.debugUser) { req.cookies.userid = c.debugUser; }

    // Only allow this request for authenticated users
    if (!req.cookies.userid) {
        response.message = 'Only authenticated users may make this request.';
        response.isSuccessful = false;
        res.json(401, response);
    } else { 
        // Build query
        var query = {
            userId : null
        };
        query.userId = req.cookies.userid;
        if (req.params.shortCode) {
            query.shortCode = req.params.shortCode;
        }

        Db.connect(util.buildMongoURL(c.dbs.common), function(err, db) {
            if(!err) {  
                db.collection('urls', {safe:false}, function(err, collection) {
                    collection.find(query, {'_id':false}, {'sort': [['accessedDate','desc']]}).toArray(function(err, urls){
                       if (err) {
                            response.message = 'Encountered error: ' + err + '.';
                            response.isSuccessful = false;
                            res.json(500, response);
                        } else if (!urls) {
                            response.message = 'No URL found for ' + req.params.shortCode + '.';
                            response.isSuccessful = false;
                            res.json(500, response);
                        } else {
                            urls.forEach(function(item, array, index) {
                                item.shortUrl = util.buildShortURL(item.shortCode);
                                item.accessedDate = (item.accessedDate) ? moment(item.accessedDate).format('D-MMM-YYYY, HH:mm:ss') : '--';
                            })
                            response.data = urls;
                            response.message = 'Successfully retreived URL(s).';
                            res.json(200, response);    
                        }
                        
                        db.close();
                    }); 
                });
            } else {
                response.message = 'Encountered error connecting to database.' + err + '.';
                response.isSuccessful = false;
                res.json(500, response);
            }
        });
    }
}

// DELETE a specific URL record.
exports.delete = function(req, res) {
    // If we are in development, a default/debug user will be specified. 
    if (c.debugUser) { req.cookies.userid = c.debugUser; }
    
    // Build query
    var query = {};
    query.shortCode = req.params.shortCode;
    query.userId = req.cookies.userid;

    var response = models.wrapper();
    Db.connect(util.buildMongoURL(c.dbs.common), function(err, db) {
        if(!err) {  
            db.collection('urls', {safe:false}, function(err, collection) {
                collection.remove(query, function(err){
                   if (err) {
                        response.message = 'Encountered error: ' + err + '.';
                        response.isSuccessful = false;
                        res.json(500, response);
                    } else {
                        response.message = 'Successfully deleted short URL.';
                        res.json(200, response);    
                    }
                    
                    db.close();
                }); 
            });
        } else {
            response.message = 'Encountered error connecting to database.' + err + '.';
            response.isSuccessful = false;
            res.json(500, response);
        }
    });
}


/**
 Helper Functions
 */


// Function to generate a short code
function generateShortCode(len) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    var code = '';
    for (var ii=0; ii<len; ii++) {
        var rand = Math.floor(Math.random()*chars.length);
        code += chars[rand];
    }
    
    return code;
}

