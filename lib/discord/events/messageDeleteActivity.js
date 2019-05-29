const updateActivity = require('./eventUtils/updateActivity.js').defaultUpdate;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      messageDelete: true,
    },
  };
}

Event.prototype.messageDelete = (message, empty, database) => {
  updateActivity(message.channel, message.guild.member(message.author), database, 'del');
};

exports.event = Event;
