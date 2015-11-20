/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment/');
var User   = require('./api/user/user.model');
// Setup server
var app = express();

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);



function bootstrap (err, nbOfUsers) {
  if (nbOfUsers === 0) {
    require('./config/seedProd');
  }

  var server = require('http').createServer(app);
  require('./config/express')(app);
  require('./routes')(app);

  // Start server
  server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

User.count ({}, bootstrap);

// Expose app
exports = module.exports = app;
