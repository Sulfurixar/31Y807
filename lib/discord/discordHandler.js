const loadServers = require('./loadServers.js');
const loadUsers = require('./loadUsers.js');
/**
  * Wrapper for the handler.
  * @since 1.0.0
  * @param {Object} config - updated mainConfig from ./config.js
  * @param {Discord.Client} client - acquired from ./discord/discordLoad.js
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
exports.run = (config, client, database) => {
  return handle(config, client, database);
}

/**
  * Discord handler.
  *
  * Loads various data related to the discord client.
  * Guild data, user data, events, commands, etc.
  * @since 1.0.0
  * @param {Object} config - updated mainConfig from ./config.js
  * @param {Discord.Client} client - acquired from ./discord/discordLoad.js
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
function handle(config, client, database) {
  loadServers.loadGuilds(config, client, database);
  loadUsers.loadUsers(client, database);
}
