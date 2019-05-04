const utils = require('./lib/utils.js');
const path = require('path');
const dbLoad = require('./lib/databaseLoad.js');
const webserverJS = require('./lib/webserver.js');
const dLoad = require('./lib/discordLoad.js');
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

exports.init = function (callback) {
  debugOutput('Loading base configuration...', fName);
  const configJS = require(path.join(__dirname, 'lib/config.js'));
  console.log(configJS.config);
  debugOutput('Finished loading base configuration!', fName);

  var config = configJS.config;

  //TODO: database
  var db = dbLoad.load(config);

  //TODO: load web-server
  if (utils.checkNoVal(config.webserver['http-port'])) {
    errorOutput('http-port in config.json has no value!', fName);
  }
  var webserver = webserverJS.initServer(
    config.webserver['key-path'],
    config.webserver['cert-path'],
    config.webserver['http-port'],
    config.webserver['https-port']
  );


  //TODO: load Discord
  const client = dLoad.load(config);
  
  callback(config, client, webserver, db);
}
