const path = require('path'),
      init = require('./init.js'),
      discordHandler = require('./lib/discord/discordHandler.js');

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
