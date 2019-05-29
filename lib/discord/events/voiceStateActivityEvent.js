const updateActivity = require('./eventUtils/updateActivity.js').defaultUpdate;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      voiceStateUpdate: true,
    },
  };
}

Event.prototype.voiceStateUpdate = (oldMember, newMember, database) => {
  var channel = oldMember.voiceChannel || newMember.voiceChannel;
  var key = (oldMember.voiceChannelID ? 'leave' : 'join');
  updateActivity(channel, newMember, database, key);
};

exports.event = Event;
