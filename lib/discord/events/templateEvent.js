//This is a template event

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: true,
    },
  };
}

Event.prototype.message = (client, message) => {
  console.log(message);
};

exports.event = Event;
