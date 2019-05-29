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
          const dates = Object.keys(currentData[nKey]);
          const last = currentData[nKey][dates[dates.length - 1]];
          if (last === undefined) {
            var diff = currentData[key];
          } else {
            /* For checking whether the actual thing was working.
            console.log('c:', currentData[key], 'n:', newData[key]);
            var x1 = utils.getJSONFull(clone(currentData[key]), clone(newData[key]));
            console.log('\tx1:', x1);
            console.log('l:', last, 'c:', currentData[key]);
            var x2 = utils.getJSONFull(clone(currentData[key]), clone(last));
            console.log('\tx2:', x2);
            var x3 = utils.getJSONFull(clone(x1), clone(x2));
            console.log('l:', last, 'n:', newData[key]);
            var x4 = utils.getJSONFull(clone(last), clone(newData[key]));
            console.log('\tx4:', x4);
            console.log('\t\tx3:', x3, 'x4:', x4);
            var x5 = utils.getJSONDifferences(clone(x4), clone(x3));
            console.log('\t\t\tx5:', x5, '\n\n');
            var diff = x5;
*/
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
            if (['presenceCount', 'owner', 'name'].includes(key)) {
              currentData[nKey][utils.getTime()] = diff;
            } else if (['available', 'memberCount'].includes(key)) {
              currentData[nKey][utils.getHourTime()] = diff;
            } else {
              currentData[nKey][utils.getDayTime('memberJoins', 'memberLeaves', 'memberReturns')] = diff;
            }
          }
        }
        if (!key.startsWith('previous')) {
          currentData[key] = newData[key];
        }
      }
    }
  }
  return currentData;
}
