const utils = require('../utils.js');
const discord = require('discord.js');
const path = require('path');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

/**
  * Discord Loader.
  *
  * Checks config values for starting the discord client and then starts it.
  * Runs a callback function (main from ./main.js)
  * @since 1.0.0
  * @param {Object} config - updated mainConfig from ./config.js
  * @param {callback} callback - main from ./main.js
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
  * @return {Discord.Client}
*/
exports.load = function (config, callback, database) {
  if (utils.checkNoVal(config.discord['global-prefix'])) {
    errorOutput("global-prefix in config.json has no value!", fName);
  }
  const method = config.discord['login-method'];
  if (utils.checkNoVal(method)) {
    errorOutput("login-method in config.json has no value!", fName);
  }
  if (utils.checkNoVal(config.discord.methods[method])) {
    errorOutput(`method(${method})->methods in config.json has no value!`, fName);
  }
  const client = new discord.Client();
  client.login(config.discord.methods[method]);

  client.on('ready', () => {
    debugOutput(`Logged in as ${client.user.tag}!`, fName);
    callback(config, client, database);
  });

  return client;
}
