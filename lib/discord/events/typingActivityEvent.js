const updateActivity = require('./eventUtils/updateActivity.js').defaultUpdate;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      typingStop: true,
    },
  };
}

Event.prototype.typingStop = (channel, user, database) => {
  updateActivity(channel, user, database, 'typing');
};

exports.event = Event;
