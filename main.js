const versionValue = '1.0.0',
      versionName = 'Buttercake';

const path = require('path'),
      utils = require('./lib/utils.js');

const fName = utils.getBaseName(__filename);

const debugOutput = utils.debugOutput;

const errorOutput = utils.errorOutput;


const main = function (configs, discord, webserver, database) {

  //TODO: Console Input

};


debugOutput('Loading base configuration...', fName);
const configJS = require(path.join(__dirname, 'lib/config.js'));
setTimeout(() => {
  console.log(configJS.config);
  debugOutput('Finished loading base configuration!', fName);

  //TODO: check config data
  var config = configJS.config;

  //TODO: database
  const mongo = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:';
  console.log(config.database.port);
  if (utils.checkNoVal(config.database.port)) {
    url = url + '27017';
  } else {
    if (typeof(config.database.port) === 'number' && config.database.port >= 0) {
      url = `mongodb://localhost:${config.database.port}`;
    } else {
      if (typeof(config.database.port) === 'number') {
        errorOutput('database->port in config.json not a positive integer.', fName);
      } else {
        errorOutput('database->port in config.json not a number', fName);
      }
    }
  }
  console.log(url);

  var db;
  mongo.connect(url, (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    db = client.db('elybot');
  });

  //TODO: load web-server
  if (utils.checkNoVal(config.webserver['http-port'])) {
    errorOutput('http-port in config.json has no value!', fName);
  }
  var webserver = require('./lib/webserver.js').initServer(
    config.webserver['key-path'],
    config.webserver['cert-path'],
    config.webserver['http-port'],
    config.webserver['https-port']
  );


  //TODO: load Discord
  if (utils.checkNoVal(config.discord['global-prefix'])) {
    errorOutput("global-prefix in config.json has no value!", fName);
  }


  //Run Main
  main(config, null, webserver, db);
}, 3000);
