//This is a template event

var Event = function (name) {
  this.config = {
    name: name,
    active: false,
    events: {
      message: true,
    },
  };
}

Event.prototype.message = (client, message, database) => {
  console.log(message.content);
};

exports.event = Event;
