const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      guildMemberRemove: true,
    },
  };
}

function updateServerPresence(member, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(member.guild);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    if (!data.memberLeaves[member.id]) data.memberLeaves[member.id] = [];
    data.memberLeaves[member.id].push(utils.getTime());
    const updatedData = serversJS.upToDater(data, bareGuildData);
    collection.updateOne({id: updatedData.id}, {$set: {
      memberCount: updatedData.memberCount,
      previousMemberCount: updatedData.previousMemberCount,
      memberLeaves: updatedData.memberLeaves
    }});
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.guildMemberRemove = (member, empty, database) => {
  updateServerMembers(member, database);
};

exports.event = Event;
