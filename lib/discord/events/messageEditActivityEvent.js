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
      messageUpdate: true,
    },
  };
}

function updateUserActivity(message, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(message.guild.member(message.author));
  function successFunction(data, bareData, collection) {
    updateActivity(
      message.channel, message.guild.member(message.author), true,
      data, bareData, collection, 'edit'
    );
  }
  load(bareUserData, users, successFunction);
}

function updateServerActivity(message, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(message.guild);
  function successFunction(data, bareData, collection) {
    updateActivity(
      message.channel, message.guild.member(message.author), false,
      data, bareData, collection, 'edit'
    );
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.messageUpdate = (oldMessage, newMessage, database) => {
  updateUserActivity(newMessage, database);
  updateServerActivity(newMessage, database);
};

exports.event = Event;
