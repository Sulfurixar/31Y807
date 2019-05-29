const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      presenceUpdate: true,
    },
  };
}

function updateUserPresence(guildMember, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(guildMember);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    const updatedData = usersJS.upToDater(data, bareUserData);
    collection.updateOne({id: updatedData.id}, {$set: {
      presence: updatedData.presence,
      previousPresence: updatedData.previousPresence
    }});
  }
  load(bareUserData, users, successFunction);
}

function updateServerPresence(guild, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(guild);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    const updatedData = serversJS.upToDater(data, bareGuildData);
    collection.updateOne({id: updatedData.id}, {$set: {
      presenceCount: updatedData.presenceCount,
      previousPresenceCount: updatedData.previousPresenceCount
    }});
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.presenceUpdate = (oldMember, newMember, database) => {
  updateUserPresence(newMember, database);
  updateServerPresence(newMember.guild, database);
};

exports.event = Event;
