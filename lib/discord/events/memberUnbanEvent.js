const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');

const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      guildBanRemove: true,
    },
  };
}

function updateServerBans(user, guild, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(guild);
  function successFunction(data, bareData, collection) {
    var bans = data.memberUnbans;
    var time = utils.getTime();
    if (bans[time] === undefined) bans[time] = [];
    bans[time].push(user.id);
    collection.updateOne({id: bareData.id}, {$set: {
      memberUnbans: bans
    }});
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.guildBanRemove = (guild, user, database) => {
  updateServerBans(user, guild, database);
};

exports.event = Event;
