const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      guildMemberAdd: true,
    },
  };
}

function updateServerPresence(guild, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(guild);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    const updatedData = serversJS.upToDater(data, bareGuildData);
    collection.updateOne({id: updatedData.id}, {$set: {
      memberCount: updatedData.memberCount,
      previousMemberCount: updatedData.previousMemberCount
    }});
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.guildMemberAdd = (member, empty, database) => {
  updateServerMembers(member.guild, database);
};

exports.event = Event;
