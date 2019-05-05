const utils = require('./utils.js');
const discord = require('discord.js');
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

exports.load = function (config, callback, database) {
  if (utils.checkNoVal(config.discord['global-prefix'])) {
    errorOutput("global-prefix in config.json has no value!", fName);
  }
  const method = config.discord['login-method'];
  if (utils.checkNoVal(method)) {
    errorOutput("login-method in config.json has no value!", fName);
  }
  if (utils.checkNoVal(config.discord.methods[method])) {
    errorOutput(`method(${method})->methods in config.json has no value!`);
  }
  const client = new discord.Client();
  client.login(config.discord.methods[method]);

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    callback(config, client, database);
  });

  return client;
}
