const versionValue = '1.0.0',
      versionName = 'Buttercake';

const path = require('path'),
      utils = require('./lib/utils');

const fName = utils.getBaseName(__filename);

const debugOutput = function (output) {
  console.log(`[${fName}]: ${output}`)
};

const errorOutput = function (output) {
  throw Error(`[${fName}]: ${output}`);
};


const main = function (configs, discord, webserver) {

  //TODO: Console Input

};


debugOutput('Loading base configuration...');
const configJS = require(path.join(__dirname, 'lib/config.js'));
setTimeout(() => {
  console.log(configJS.config);
  debugOutput('Finished loading base configuration!');

  //TODO: check config data
  var config = configJS.config;

  //TODO: load web-server

  //TODO: load
  if (utils.checkNoVal(config.discord['global-prefix'])) {
    errorOutput("global-prefix in config.json has no value!");
  }

  //Run Main
}, 3000);
