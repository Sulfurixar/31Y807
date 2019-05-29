const utils = require('../utils.js');
const server = require('./schemas/serverSchema.js').get();
const ddiff = require('deep-diff');
const clone = require('lodash/cloneDeep');

/**
  * Server schema getter.
  * @since 1.0.0
  * @param {Discord.Guild} guild
  * @param {string} [prefix='e!'] - prefix for the server commands.
  * @return {object} Guild data schema.
*/
exports.getSchema = (guild, prefix='e!') => {
  const guildData = clone(server);
  guildData.id = guild.id;
  guildData.available = guild.available;
  guildData.prefix = prefix;
  guildData.owner = guild.owner.id;
  guildData.name = guild.name;
  guildData.createdAt = guild.createdAt.toJSON().slice(0, 19).replace(/[T]/g, ' ');
  const memberCount = guild.memberCount;
  guildData.memberCount = memberCount;
  const presences = guild.presences.array();
  for (var i in presences) {
    guildData.presenceCount[presences[i].status] += 1;
  }
  return guildData;
}

/**
  * Server schema updater.
  * @since 1.0.2
  * @param {object} currentData - server schema
  * @param {object} newData - server schema
  * @return {object} updated server schema
*/
exports.upToDater = (currentData, newData) => {
  var exactTimeKeys = ['presenceCount', 'owner', 'name'],
      hourTimeKeys = ['available', 'memberCount'],
      blackList = ['channelActivity'];
  return utils.upToDater(currentData, newData, exactTimeKeys, hourTimeKeys, blackList);
}
