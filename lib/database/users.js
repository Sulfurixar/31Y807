const utils = require('../utils.js');
const user = require('./schemas/userSchema.js').get();
const clone = require('lodash/cloneDeep');

/**
  * User schema getter.
  * @since 1.0.0
  * @param {Discord.GuildMember} guildMember
  * @return {object} User data schema.
*/
exports.getSchema = (guildMember) => {
  const userData = clone(user);
  userData.id = guildMember.id;
  userData.tag = guildMember.user.tag;
  userData.nicknames[guildMember.guild.id] = guildMember.nickname;
  userData.presence.status = guildMember.presence.status;
  if (guildMember.presence.game !== null) {
    const k = Object.keys(userData.presence.game);
    for (let i in k) {
      if (guildMember.presence.game[k[i]] !== null) {
        if (k[i] !== 'party') {
          userData.presence.game[k[i]] = guildMember.presence.game[k[i]];
        } else {
          userData.presence.game.party = guildMember.presence.game.party.size;
        }
      }
    }
  }

  return userData;
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
      if (currentData[nKey] !== undefined) {
        const dates = Object.keys(currentData[nKey]);
        const last = currentData[nKey][dates[dates.length - 1]];
        const first = currentData[nKey][dates[0]];
        if (last === undefined) {
          var diff = currentData[key];
        } else {
          var x11 = clone(newData[key]);
          ddiff.applyDiff(x11, clone(currentData[key]));
          var x22 = clone(last);
          ddiff.applyDiff(x22, clone(currentData[key]));
          var x33 = clone(x11);
          ddiff.applyDiff(x33, clone(x22));
          var x44 = clone(last);
          ddiff.applyDiff(clone(newData[key]), x44);
          x44 = utils.getJSONFull(clone(x44), clone(newData[key]));
          var diff = utils.getJSONDifferences(clone(x44), clone(x33));

        }
        if (diff !== null) {
          if ([].includes(key)) {
            currentData[nKey][utils.getTime()] = diff;
          } else if ([].includes(key)) {
            currentData[nKey][utils.getHourTime()] = diff;
          } else {
            currentData[nKey][utils.getDayTime()] = diff;
          }
        }
      }
    }
  }
  return currentData;
}
