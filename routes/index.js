var mongo = require('mongodb');  // Init MongoDB library
var models = require('../models');
var c = require('../config').config;  // App configuration
var util = require('../util');

var Db = mongo.Db;
var ObjectID = require('mongodb').ObjectID;


/*
 * GET home page.
 */
exports.index = function(req, res){
    var model = {
        isAuthenticated : false
    };
    var query = {};

    // If we are in development, a default/debug user will be specified. 
    if (c.debugUser) { req.cookies.userid = c.debugUser; }
    if (req.cookies.userid) {
        model.isAuthenticated = true;
        var o_id = ObjectID.createFromHexString(req.cookies.userid);
        query._id = o_id;
    }
    
    Db.connect(util.buildMongoURL(c.dbs.common), function(err, db) {
        if(!err) {  
            db.collection('users', {safe:false}, function(err, collection) {
                collection.findAndModify(query, [['_id','asc']], { $set : { dateAccessed : new Date() } }, {}, function(err, user) {
                    model.user = user;
                    res.render('index', model);
                });
            });
        } else {
            console.log('Encountered error: ' + err + '.');
            res.render('error');
        }
    });

    
};

/*
 * Redirect from short URL to destination URL.
 */
exports.redirect = function(req, res) {
    // Build query
    var query = {};
    query.shortCode = req.params.shortCode;

    Db.connect(util.buildMongoURL(c.dbs.common), function(err, db) {
        if(!err) {  
            db.collection('urls', {safe:false}, function(err, collection) {
                collection.findAndModify(query, [['_id','asc']], { $set : { accessedDate : new Date() }, $inc: { hitCount : 1 } }, {}, function(err, url){
                   if (err) {
                        console.log('Encountered error: ' + err + '.');
                        res.render('error');
                    } else if (!url) {
                        console.log('No URL found for ' + req.params.shortCode + '.');
                        res.render('notFound');
                    } else {
                        console.log('Successfully retreived URL.');
                        res.redirect(url.longUrl);
                    }
                    
                    db.close();
                }); 
            });
        } else {
            console.log('Encountered error connecting to database.' + err + '.');
            res.render(error);
        }
    });
};

