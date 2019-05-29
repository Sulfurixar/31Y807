const utils = require('./lib/utils.js');
const path = require('path');
const dbLoad = require('./lib/database/databaseLoad.js');
const webserverJS = require('./lib/webserver.js');
const dLoad = require('./lib/discord/discordLoad.js');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

/**
  * Initialization function.
  *
  * Gets Configuration, and runs Loaders for each service
  * (discord, webserver, database).
  * @since 1.0.0
  * @param {function} callback - main from ./main.js
*/
exports.init = function (callback) {
  debugOutput('Loading base configuration...', fName);
  const configJS = require(path.join(__dirname, 'lib/config.js'));
  debugOutput('Finished loading base configuration!', fName);

  var config = configJS.config;

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

  //TODO: database
  const db = dbLoad.load(config).then((db) => {
    const client = dLoad.load(config, callback, db.db('elybot'));
  }, () => {});

}
