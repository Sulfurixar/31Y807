const utils = require('../../../utils.js');
const clone = require('lodash/cloneDeep');
const usersJS = require('../../../database/users.js');
const serversJS = require('../../../database/servers.js');
const load = require('../../../database/databaseEntryLoader.js').load;

function updateActivity(channel, guildMember, _activity=false, data, bareData, collection, key) {
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
    if (!data.channelActivity.activity[guildMember.guild.id]) data.channelActivity.activity[guildMember.guild.id] = {};
    activity = data.channelActivity.activity[guildMember.guild.id];
  } else {
    activity = data.channelActivity.activity;
  }
  if (!activity[channel.id]) activity[channel.id] = {};
  if (!activity[channel.id][guildMember.id]) activity[channel.id][guildMember.id] = {};
  if (!activity[channel.id][guildMember.id][key]) activity[channel.id][guildMember.id][key] = 0;
  activity[channel.id][guildMember.id][key] += 1;
  if (_activity) {
    data.channelActivity.activity[guildMember.guild.id] = activity;
  } else {
    data.channelActivity.activity = activity;
  }
  collection.updateOne({id: data.id}, {$set: {
    channelActivity: { activity: data.channelActivity.activity, date: data.channelActivity.date},
    previousChannelActivity: data.previousChannelActivity
  }});
}

function updateUserActivity(channel, user, database, key) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(channel.guild.member(user));
  function successFunction(data, bareData, collection) {
    updateActivity(
      channel, channel.guild.member(user), true,
      data, bareData, collection, key
    );
  }
  load(bareUserData, users, successFunction);
}

function updateServerActivity(channel, user, database, key) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(channel.guild);
  function successFunction(data, bareData, collection) {
    updateActivity(
      channel, channel.guild.member(user), false,
      data, bareData, collection, key
    );
  }
  load(bareGuildData, servers, successFunction);
}

function defaultUpdate(channel, user, database, key){
  updateUserActivity(channel, user, database, key);
  updateServerActivity(channel, user, database, key);
}

exports.updateActivity = updateActivity;
exports.defaultUpdate = defaultUpdate;
