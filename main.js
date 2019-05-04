const versionValue = '1.0.0',
      versionName = 'Buttercake';
const path = require('path'),
      utils = require('./lib/utils.js');
const init = require('./init.js');
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

const main = function (config, discord, webserver, database) {

  //TODO: Console Input
  console.log(config, discord, webserver, database);

};

init.init(main);
