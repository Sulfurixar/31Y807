const loadServers = require('./discord/loadServers.js');
exports.run = (config, client, database) => {
  return handle(config, client, database);
}

function handle(config, client, database) {
  loadServers.loadGuilds(config, client, database);
}
