const updateActivity = require('./eventUtils/updateActivity.js').updateActivity;

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: true,
    }
  };

  this.message = (client, message, database) => {
  	let content = message.content;
  	database.collection('servers').findOne({id: message.guild.id}).then(
    	(data) => {
      	if (data !== null) {
      	  let prefix = data.prefix;
      	  if (content.startsWith(prefix)) {
            updateActivity(message.channel, message.guild.member(message.author), database, 'cmd');
          }
    	  }
  	  },
    	(err) => {
  	    if (err !== null) {
      	  errorOutput(err, fName);
  	    }
  	  }
  	);
	}
}

exports.event = Event;
