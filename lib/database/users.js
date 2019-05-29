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
  userData.createdAt = guildMember.user.createdAt;
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

exports.getUserSchema = (user) => {
  const userData = clone(user);
  userData.id = user.id;
  userData.tag = user.tag;
  userData.createdAt = user.createdAt;
  userData.presence.status = user.presence.status;
  if (yser.presence.game !== null) {
    const k = Object.keys(userData.presence.game);
    for (let i in k) {
      if (user.presence.game[k[i]] !== null) {
        if (k[i] !== 'party') {
          userData.presence.game[k[i]] = user.presence.game[k[i]];
        } else {
          userData.presence.game.party = user.presence.game.party.size;
        }
      }
    }
  }

  return userData;
}

/**
  * User schema updater.
  * @since 1.0.2
  * @param {object} currentData - server schema
  * @param {object} newData - server schema
  * @return {object} updated server schema
*/
exports.upToDater = (currentData, newData) => {
  var exactTimeKeys = ['presence', 'tag', 'nicknames'],
      hourTimeKeys = [],
      blackList = ['channelActivity', 'bans'];
  return utils.upToDater(currentData, newData, exactTimeKeys, hourTimeKeys, blackList);
}
