const utils = require('../utils.js');
const discord = require('discord.js');
const path = require('path');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

function deleteMessages(messages, guild) {
  for (m in messages) { // for each message record in old
    let message = messages[m];
    var channel = null;
    for (i of guild.channels.entries()) {
      let key = i[0];
      let val = i[1];
      if (key === message.channel) { channel = val; break; }
    }
    if (channel) {
      channel.fetchMessage(message.id).then((message) => {
        message.delete();
      }, (err) => {
        debugOutput(err, fName);
      });
    }
  }
}

function clearBotLogs(client, database) {
  debugOutput('clearBotLogs ran!', fName);
  const servers = database.collection('servers');
  var cursor = servers.find();
  cursor.forEach((server) => {
    if (server) {
      var guild = null;
      for (i of client.guilds.entries()) {
        let key = i[0];
        let val = i[1];
        if (key === server.id) { guild = val; break; }
      }
      if (guild) {
        if (server.botErrorBuffer) {
          while (server.botErrorBuffer.length > 0) {
            deleteMessages(server.botErrorBuffer.pop(), guild);
          }
        }
        if (server.botMessageBuffer) {
          while (Object.keys(server.botMessageBuffer).length > 0) {
            let key = Object.keys(server.botMessageBuffer)[0];
            deleteMessages(server.botMessageBuffer[key], guild);
            delete server.botMessageBuffer[key];
          }
        }
      }
    }
  }).then(()=>{
    servers.updateMany({}, {$unset: {
      botErrorBuffer:1,
      botMessageBuffer:1
    }}, () => {
      debugOutput(`Cleared botLogs!`, fName);
    });
  });
}

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
    clearBotLogs(client, database);

    callback(config, client, database);
  });

  return client;
}
