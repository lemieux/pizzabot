'use strict';

var nconf = require('nconf');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var configFile = __dirname + '/' + process.env.NODE_ENV + '.json';

nconf.env()
    .file({
        file: configFile
    });


module.exports = nconf;