var c = require('./config').config;  // App configuration

/* 
 * Build the connection string to the MongoDB instance for this application.
 */
exports.buildMongoURL = function(dbConfig) { 
    if(dbConfig.dbUsername && dbConfig.dbPassword) {
        return 'mongodb://' + dbConfig.dbUsername + ':' + dbConfig.dbPassword + '@' + dbConfig.dbHost + ':' + dbConfig.dbPort + '/' + dbConfig.dbName + '?auto_reconnect=true&safe=true';
    } else { 
        return 'mongodb://' + dbConfig.dbHost + ':' + dbConfig.dbPort + '/' + dbConfig.dbName + '?auto_reconnect=true&safe=true'; 
    }
}

/*
 * Build a short URL.
 */
exports.buildShortURL = function(shortCode) {
    var url = 'http://' + c.appDomain;
    if (c.appPort && c.appPort.length > 0) url += ':' + c.appPort;
    url += c.appPath + shortCode;

    return url;
}
