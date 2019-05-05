const utils = require('../../utils.js');

const server = {
  id: '',
  prefix: '',
  available: true,
  previousAvailable:{},                      // date-time: available
  channelActivity: {
    activity: [],                             // {channelID, [{userID, count}]}
    date: ''
  },
  previousChannels: {},                       // date-time: channels
  owner: '',                                  // id <Snowflake>
  previousOwner: {},                          // date-time: owner
  name: '',
  previousName: {},                           //date-time: name
  createdAt: '',                              // date-time
  memberCount: 0,
  previousMemberCount: {},                    // date-time: memberCount
  presenceCount: {
    online: 0, offline: 0, idle: 0, dnd: 0
  },
  previousPresenceCount: {},                  // date-time: presenceCount
  memberJoins: [],                            // {id <Snowflake>, date-time}
  previousMemberJoins: {},                    // date-time: memberJoins
  memberLeaves: [],                           // {id <Snowflake, date-time>}
  previousMemberLeaves: {},                   // date-time: memberLeaves
  memberReturns: [],                          // {id <Snowflake>, date-time}
  previousMemberReturns: {},                  // date-time: memberReturns
};

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
