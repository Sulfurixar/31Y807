const updateActivity = require('./eventUtils/updateActivity.js').defaultUpdate;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: true,
    },
  };
}

Event.prototype.message = (client, message, database) => {
  updateActivity(message.channel, message.guild.member(message.author), database, 'message');
};

exports.event = Event;
