
/**
 * Module dependencies.
 */
var fs = require('fs'), 
    express = require('express'), 
    bodyParser = require('body-parser'),
    compress = require('compression'), 
    cookieParser = require('cookie-parser'), 
    path = require('path'),
    helmet = require('helmet');

// App configuration
if (!fs.existsSync('config.js')) {
    console.error('Config file [config.js] missing!');
    console.error('Either rename sample-config.js and populate with your settings, or run "make decrypt_conf".');
    process.exit(1);
}

var routes = require('./routes');
var api = require('./routes/api');
var c = require('./config').config;  // App configuration

// Init Express
var app = express();
app.set('port', c.appPort || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(cookieParser('foo'));

/**
 * Define routes.
 */
app.use(c.appPath, express.static(path.join(__dirname, 'public')));
app.get(c.appPath, routes.index);
app.post(c.appPath + 'api', api.create);
app.get(c.appPath + 'api/:shortCode?', api.get);
app.get(c.appPath + 'api/:shortCode/delete', api.delete);
app.get(c.appPath + ':shortCode', routes.redirect);


/**
 * Fire up the server. 
 */
app.listen(app.get('port'));
console.log('Server started on port ' + app.get('port') + '. \nTry this: http://localhost:' + app.get('port') + c.appPath);






