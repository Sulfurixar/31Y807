const updateActivity = require('./eventUtils/updateActivity.js').defaultUpdate;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      messageReactionAdd: true,
    },
  };
}

Event.prototype.messageReactionAdd = (messageReaction, user, database) => {
  updateActivity(messageReaction.message.channel, user, database, 'react');
};

exports.event = Event;
