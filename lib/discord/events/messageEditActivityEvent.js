const updateActivity = require('./eventUtils/updateActivity.js').defaultUpdate;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      messageUpdate: true,
    },
  };
}

Event.prototype.messageUpdate = (oldMessage, newMessage, database) => {
  updateActivity(newMessage.channel, newMessage.guild.member(newMessage.author), database, 'edit');
};

exports.event = Event;
