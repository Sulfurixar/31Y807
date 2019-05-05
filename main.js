const path = require('path'),
      utils = require('./lib/utils.js'),
      init = require('./init.js'),
      discordHandler = require('./lib/discord/discordHandler.js');
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

/**
  * Main wrapper.
  *
  * Executed from ./discord/discordLoad.js as a callback.
  * The purpose of this wrapper is to connect console I/O, discord I/O,
  * web server I/O, and database.
  * @since 1.0.0
  * @param {Object} config - updated mainConfig from ./config.js
  * @param {Discord.Client} discord - acquired from ./discord/discordLoad.js
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
const main = function (config, discord, database) {

  //TODO: Console Input


  discordHandler.run(config, discord, database);

};

init.init(main);
