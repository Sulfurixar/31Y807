const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      guildMemberUpdate: true,
    },
  };
}

function updateUser(guildMember, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(guildMember);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    const updatedData = usersJS.upToDater(data, bareUserData);
    collection.updateOne({id: updatedData.id}, {$set: updatedData} );
  }
  load(bareUserData, users, successFunction);
}

Event.prototype.guildMemberUpdate = (oldMember, newMember, database) => {
  updateUser(newMember, database);
};

exports.event = Event;
