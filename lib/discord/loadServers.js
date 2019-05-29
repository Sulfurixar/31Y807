const serversJS = require('../database/servers.js');
const loadD = require('../database/databaseEntryLoader.js').load;
const utils = require('../utils.js');
const path = require('path');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

/**
  * Guild Loader.
  *
  * Executes the load function for each guild connected to the server.
  * @since 1.0.0
  * @param {Object} config - updated mainConfig from ./config.js
  * @param {Discord.Client} discord - acquired from ./discord/discordLoad.js
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
exports.loadGuilds = (config, discord, database) => {
  const guilds = discord.guilds.array();
  for (var i in guilds) {
    load(config, guilds[i], database);
  }
}

exports.load = load;

/**
  * Guild Loader.
  *
  * Updates guild data in the database or adds it.
  * @since 1.0.0
  * @param {Object} config - updated mainConfig from ./config.js
  * @param {Discord.Guild} guild
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
function load(config, guild, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(guild, config['global-prefix']);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    const updatedData = serversJS.upToDater(data, bareGuildData);
    collection.updateOne({id: updatedData.id}, {$set: updatedData});
  }
  loadD(bareGuildData, servers, successFunction);
}
