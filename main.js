const versionValue = '1.0.0',
      versionName = 'Buttercake';
const path = require('path'),
      utils = require('./lib/utils.js'),
      init = require('./init.js'),
      discordHandler = require('./lib/discord/discordHandler.js');
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

const main = function (config, discord, database) {

  //TODO: Console Input


  discordHandler.run(config, discord, database);

};

init.init(main);
