const versionValue = '1.0.0',
      versionName = 'Buttercake';

const path = require('path'),
      utils = require('./lib/utils.js');

const fName = utils.getBaseName(__filename);

const debugOutput = utils.debugOutput;

const errorOutput = utils.errorOutput;


const main = function (configs, discord, webserver) {

  //TODO: Console Input

};


debugOutput('Loading base configuration...', fName);
const configJS = require(path.join(__dirname, 'lib/config.js'));
setTimeout(() => {
  console.log(configJS.config);
  debugOutput('Finished loading base configuration!', fName);

  //TODO: check config data
  var config = configJS.config;

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


  //TODO: load
  if (utils.checkNoVal(config.discord['global-prefix'])) {
    errorOutput("global-prefix in config.json has no value!", fName);
  }


  //Run Main
}, 3000);
