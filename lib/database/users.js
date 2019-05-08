const utils = require('../utils.js');
const user = require('./schemas/userSchema.js').get();

/**
  * User schema getter.
  * @since 1.0.0
  * @param {Discord.GuildMember} guildMember
  * @return {object} User data schema.
*/
exports.getSchema = (guildMember) => {
  const userData = JSON.parse(JSON.stringify(user));

  return guildData;
}

/**
  * User schema updater.
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
          if (key in []) {
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
