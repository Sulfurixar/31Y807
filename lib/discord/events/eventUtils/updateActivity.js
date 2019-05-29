const utils = require('../../../utils.js');
const clone = require('lodash/cloneDeep');

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

exports.updateActivity = updateActivity;
