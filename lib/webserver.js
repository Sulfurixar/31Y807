const fs = require('fs'),
      http = require('http'),
      https = require('https'),
      utils = require('./utils.js'),
      path = require('path'),
      express = require('express');

const fName = __filename.split(/[\/\\]/).slice(-1)[0];

var app = express();
exports.app = app;

/**
  * Express web server initializer.
  *
  * Checks for ssl file paths and port configuration for http/https.
  * Starts the web server.
  * @since 1.0.0
  * @param {string} keyPath - path of ssl key
  * @param {string} certPath - path of ssl certificate
  * @param {int} httpPort
  * @param {int} httpsPort
  * @return {express} app
*/
exports.initServer = function (keyPath, certPath, httpPort, httpsPort) {

  var key = function () {
      if (!utils.checkNoVal(keyPath)) {
        try {
          return fs.readFileSync(keyPath);
        } catch (e) {
          utils.debugOutput('no ssl certificate key specified for elybot.', fName);
        }
      }
    }(),
    cert = function () {
      if (!utils.checkNoVal(certPath)) {
        try {
          return fs.readFileSync(certPath);
        } catch (e) {
          utils.debugOutput('no ssl certificate specified for elybot.', fName);
        }
      }
    }();

  if (key !== undefined & cert !== undefined & !utils.checkNoVal(httpsPort)) {
    var options = {key: key, cert: cert};
    https.createServer(options, app).listen(httpsPort, function () {
      utils.debugOutput("Express https server listening on port " + httpsPort, fName);
    });
  }

  http.createServer(app).listen(httpPort, function () {
    utils.debugOutput("Express http server listening on port " + httpPort, fName);
  });

  app.get('/', function (req, res) {
    res.writeHead(200);
    res.end("Hello World!\n");
  });

  return app;
}
