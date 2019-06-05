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
      guildBanAdd: true,
    },
  };
}

function updateUserBans(user, guild, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getUserSchema(user);
  function successFunction(data, bareData, collection) {
    var bans = data.bans;
    var time = utils.getTime();
    if (bans[time] === undefined) bans[time] = [];
    bans[time].push(guild.id);
    collection.updateOne({id: bareData.id}, {$set: {
      bans: bans
    }});
  }
  load(bareUserData, users, successFunction);
}

function updateServerBans(user, guild, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(guild);
  function successFunction(data, bareData, collection) {
    var bans = data.memberBans;
    var time = utils.getTime();
    if (bans[time] === undefined) bans[time] = [];
    bans[time].push(user.id);
    collection.updateOne({id: updatedData.id}, {$set: {
      memberBans: bans
    }});
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.guildBanAdd = (guild, user, database) => {
  updateUserBans(user, guild, database);
  updateServerBans(user, guild, database);
};

exports.event = Event;
