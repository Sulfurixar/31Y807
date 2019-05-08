const utils = require('../utils.js');
const server = require('./schemas/serverSchema.js').get();

/**
  * Server schema getter.
  * @since 1.0.0
  * @param {Discord.Guild} guild
  * @param {string} [prefix='e!'] - prefix for the server commands.
  * @return {object} Guild data schema.
*/
exports.getSchema = (guild, prefix='e!') => {
  const guildData = JSON.parse(JSON.stringify(server));
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
  * @since 1.0.0
  * @param {object} currentData - server schema
  * @param {object} newData - server schema
  * @return {object} updated server schema
*/
exports.upToDater = (currentData, newData) => {
  for (var key in newData) {
    if (!utils.objectsEqual(currentData[key], newData[key])) {
      if (currentData[key] != newData[key]) {
        nKey = 'previous' + key.charAt(0).toUpperCase() + key.slice(1);
        if (currentData[nKey] !== undefined) {
          console.log(currentData[nKey]);
          const dates = Object.keys(currentData[nKey]);
          console.log(dates);
          const last = currentData[nKey][dates[dates.length - 1]];
          console.log(dates[dates.length - 1]);
          const diff = utils.getJSONDifferences(last, newData[key]);
          if (key in ['available', 'memberCount', 'presences']) {
            currentData[nKey][utils.getHourTime()] = currentData[key];
          } else {
            currentData[nKey][utils.getDayTime()] = currentData[key];
          }
        }
        if (typeof(newData[key]) !== 'object') {
          currentData[key] = newData[key];
        }
      }
    }
  }
  return currentData;
}
