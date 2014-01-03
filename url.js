
/**
 * Module dependencies.
 */
var fs = require('fs');  // File system access
var express = require('express');
var http = require('http');
var path = require('path');

// App configuration
if (!fs.existsSync('config.js')) {
    console.error('Config file [config.js] missing!');
    console.error('Either rename sample-config.js and populate with your settings, or run "make decrypt_conf".');
    process.exit(1);
}

var routes = require('./routes');
var api = require('./routes/api');
var c = require('./config').config;  // App configuration

var app = express();
// all environments
app.set('port', c.appPort || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(c.appPath, express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


/**
 * Define routes.
 */
app.get(c.appPath, routes.index);
app.post(c.appPath + '/api', api.create);
app.get(c.appPath + '/api/:shortCode?', api.get);
app.get(c.appPath + '/api/:shortCode/delete', api.delete);
app.get(c.appPath + '/:shortCode', routes.redirect);


/**
 * Fire up the server. 
 */
http.createServer(app).listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port') + '. \nTry this: http://localhost:' + app.get('port') + c.appPath);
});





