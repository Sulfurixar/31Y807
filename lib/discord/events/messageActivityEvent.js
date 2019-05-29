const usersJS = require('../../database/users.js');
const serversJS = require('../../database/servers.js');
const load = require('../../database/databaseEntryLoader.js').load;
const utils = require('../../utils.js');
const clone = require('lodash/cloneDeep');
const ddiff = require('deep-diff');

const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: true,
    },
  };
}

function updateActivity(message, _activity=false, data, bareData, collection) {
  let time = utils.getHourTime();
  var oldChannelActivity = clone(data.channelActivity);
  var appendPrevious = false;
  if (data.channelActivity.date !== time && data.channelActivity.date != '') {
    appendPrevious = true;
    data.channelActivity.date = time;
    data.channelActivity.activity = {};
  } else {
    if (data.channelActivity.date === '') data.channelActivity.date = time;
  }
  if (appendPrevious) {
    data.previousChannelActivity[oldChannelActivity.date] = oldChannelActivity.activity;
  }
  if (_activity) {
    if (!data.channelActivity.activity[message.guild.id]) data.channelActivity.activity[message.guild.id] = {};
    activity = data.channelActivity.activity[message.guild.id];
  } else {
    activity = data.channelActivity.activity;
  }
  var channel = message.channel.id;
  if (!activity[channel]) activity[channel] = {};
  if (!activity[channel][message.author.id]) activity[channel][message.author.id] = {};
  var key = 'message'
  if (!activity[channel][message.author.id][key]) activity[channel][message.author.id][key] = 0;
  activity[channel][message.author.id][key] += 1;
  if (_activity) {
    data.channelActivity.activity[message.guild.id] = activity;
  } else {
    data.channelActivity.activity = activity;
  }
  collection.updateOne({id: data.id}, {$set: {
    channelActivity: { activity: data.channelActivity.activity, date: data.channelActivity.date},
    previousChannelActivity: data.previousChannelActivity
  }});
}

function updateUserActivity(message, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(message.author);
  function successFunction(data, bareData, collection) {
    updateActivity(
      message, true,
      data, bareData, collection
    );
  }
  load(bareUserData, users, successFunction);
}

function updateServerActivity(message, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(message.author.guild);
  function successFunction(data, bareData, collection) {
    updateActivity(
      message, false,
      data, bareData, collection
    );
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.message = (client, message, database) => {
  updateUserActivity(message, database);
  updateServerActivity(message, database);
};

exports.event = Event;
