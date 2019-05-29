const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');
const updateActivity = require('./eventUtils/updateActivity.js').updateActivity;

const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      voiceStateUpdate: true,
    },
  };
}

function updateUserActivity(oldMember, newMember, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(newMember);
  function successFunction(data, bareData, collection) {
    var channel = oldMember.voiceChannel || newMember.voiceChannel;
    var key = (oldMember.voiceChannelID ? 'leave' : 'join');
    updateActivity(
      channel, newMember, true,
      data, bareData, collection, key
    );
  }
  load(bareUserData, users, successFunction);
}

function updateServerActivity(oldMember, newMember, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(newMember.guild);
  function successFunction(data, bareData, collection) {
    var channel = oldMember.voiceChannel || newMember.voiceChannel;
    var key = (oldMember.voiceChannelID ? 'leave' : 'join');
    updateActivity(
      channel, newMember, false,
      data, bareData, collection, key
    );
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.voiceStateUpdate = (oldMember, newMember, database) => {
  updateUserActivity(oldMember, newMember, database);
  updateServerActivity(oldMember, newMember, database);
};

exports.event = Event;
