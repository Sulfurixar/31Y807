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
      typingStop: true,
    },
  };
}

function updateUserActivity(channel, user, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(channel.guild.member(user));
  function successFunction(data, bareData, collection) {
    updateActivity(
      channel, channel.guild.member(user), true,
      data, bareData, collection, 'typing'
    );
  }
  load(bareUserData, users, successFunction);
}

function updateServerActivity(channel, user, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(channel.guild);
  function successFunction(data, bareData, collection) {
    updateActivity(
      channel, channel.guild.member(user), false,
      data, bareData, collection, 'typing'
    );
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.typingStop = (channel, user, database) => {
  updateUserActivity(channel, user, database);
  updateServerActivity(channel, user, database);
};

exports.event = Event;
