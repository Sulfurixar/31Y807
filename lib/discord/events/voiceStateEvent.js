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
      voiceStateUpdate: true,
    },
  };
}

function updateActivity(oldMember, newMember, _activity=false, data, bareData, collection) {
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
    if (!data.channelActivity.activity[newMember.guild.id]) data.channelActivity.activity[newMember.guild.id] = {};
    activity = data.channelActivity.activity[newMember.guild.id];
  } else {
    activity = data.channelActivity.activity;
  }
  var channel = oldMember.voiceChannelID || newMember.voiceChannelID;
  if (!activity[channel]) activity[channel] = {};
  if (!activity[channel][newMember.id]) activity[channel][newMember.id] = {};
  var key = (oldMember.voiceChannel ? 'leave' : 'join');
  if (!activity[channel][newMember.id][key]) activity[channel][newMember.id][key] = 0;
  activity[channel][newMember.id][key] += 1;
  if (_activity) {
    data.channelActivity.activity[newMember.guild.id] = activity;
  } else {
    data.channelActivity.activity = activity;
  }
  collection.updateOne({id: data.id}, {$set: {
    channelActivity: { activity: data.channelActivity.activity, date: data.channelActivity.date},
    previousChannelActivity: data.previousChannelActivity
  }});
}

function updateUserActivity(oldMember, newMember, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(newMember);
  function successFunction(data, bareData, collection) {
    updateActivity(
      oldMember, newMember, true,
      data, bareData, collection
    );
  }
  load(bareUserData, users, successFunction);
}

function updateServerActivity(oldMember, newMember, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(newMember.guild);
  function successFunction(data, bareData, collection) {
    updateActivity(
      oldMember, newMember, false,
      data, bareData, collection
    );
  }
  load(bareGuildData, servers, successFunction);
}

Event.prototype.voiceStateUpdate = (oldMember, newMember, database) => {
  updateUserActivity(oldMember, newMember, database);
  updateServerActivity(oldMember, newMember, database);
};

exports.event = Event;
