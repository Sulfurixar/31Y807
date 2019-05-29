const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');
const updateActivity = require('./eventUtils/updateActivity.js').updateActivity;

const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

function updateUserActivity(message, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(message.guild.member(message.author));
  function successFunction(data, bareData, collection) {
    updateActivity(
      message.channel, message.guild.member(message.author), true,
      data, bareData, collection, 'cmd'
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
      data, bareData, collection, 'cmd'
    );
  }
  load(bareGuildData, servers, successFunction);
}

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: true,
    }
  };

  this.message = (client, message, database) => {
  	let content = message.content;
  	database.collection('servers').findOne({id: message.guild.id}).then(
    	(data) => {
      	if (data !== null) {
      	  let prefix = data.prefix;
      	  if (content.startsWith(prefix)) {
            updateUserActivity(message, database);
            updateServerActivity(message, database);
          }
    	  }
  	  },
    	(err) => {
  	    if (err !== null) {
      	  errorOutput(err, fName);
  	    }
  	  }
  	);
	}
}

exports.event = Event;