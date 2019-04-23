const fs = require('fs'),
      http = require('http'),
      https = require('https'),
      utils = require('./utils.js'),
      express = require('express');

const fName = utils.getBaseName(__filename);

var app = express();
exports.app = app;

exports.initServer = function (keyPath, certPath, httpPort, httpsPort) {

  var key = function () {
      try {
        return fs.readFileSync(keyPath);
      } catch (e) {
        utils.debugOutput('no ssl certificate key specified for elybot.', fName);
        return undefined;
      }
    }(),
    cert = function () {
      try {
        return fs.readFileSync(certPath);
      } catch (e) {
        utils.debugOutput('no ssl certificate specified for elybot.', fName);
        return undefined;
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
}
