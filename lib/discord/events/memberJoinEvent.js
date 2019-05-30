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

function updateServerMembers(member, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(member.guild);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    if (!data.memberJoins[member.id]) {
      data.memberJoins[member.id] = utils.getTime();
    } else {
      if (!data.memberReturns[member.id]) data.memberReturns[member.id] = [];
      data.memberReturns[member.id].push(utils.getTime());
    }
    const updatedData = serversJS.upToDater(data, bareGuildData);
    collection.updateOne({id: updatedData.id}, {$set: {
      memberCount: updatedData.memberCount,
      previousMemberCount: updatedData.previousMemberCount,
      memberJoins: updatedData.memberJoins,
      memberReturns: updatedData.memberReturns
    }});
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.guildMemberAdd = (member, empty, database) => {
  updateServerMembers(member, database);
};

exports.event = Event;
