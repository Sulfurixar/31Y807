const utils = require('../utils.js');
const server = require('./schemas/serverSchema.js').get();

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
  guildData.presenceCount.offline = memberCount - presences.length;
  return guildData;
}

exports.upToDater = (currentData, newData) => {
  for (var key in newData) {
    if (!utils.objectsEqual(currentData[key], newData[key])) {
      if (currentData[key] != newData[key]) {
        nKey = 'previous' + key.charAt(0).toUpperCase() + key.slice(1);
        if (currentData[nKey] !== undefined) {
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