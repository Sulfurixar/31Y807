const deleteMessage = require('./eventUtils/deleteMessage.js').deleteMessage;
const parse = require('./eventUtils/commandParser.js').parse;
const utils = require('../../utils.js');
const fs = require('fs');
const path = require('path');
const checkAliases = require('./eventUtils/checkAliases.js').checkAliases;

const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

const paths = [ path.join(__dirname, '..', 'commands'),
                path.join(__dirname, '..', '..', '..', 'commands')
              ];

function loadData(_path, commands) {
  fs.readdir(_path, (err, files) => {
    if (err) {
      return errorOutput(err, fName);
    }
    files.forEach(function (file) {
      const fullpath = path.join(_path, file);
      debugOutput(fullpath, fName);
      if (!fs.lstatSync(fullpath).isDirectory()) {
        try {
          var command = new (require(fullpath).command)(file.split('.')[0].split(/[\/\\]/).slice(-1)[0]);
          if (command.config.active) {
            commands[file.split('.')[0]] = command;
          }
        } catch(e) {
          errorOutput(e, fName);
        }
      }
    });
  });
}

var Event = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: true,
    }
  };
  var commands = {};
  for (let i in paths) {
    loadData(paths[i], commands);
  }
  this.commands = commands;

  this.message = (client, message, database) => {
  	let content = message.content;
  	database.collection('servers').findOne({id: message.guild.id}).then(
    	(data) => {
      	if (data !== null) {
      	  let prefix = data.prefix;
      	  if (content.startsWith(prefix)) {
        	  let cmd = content.replace(prefix, '');
          	var args = parse(cmd);
            cmd = args[0].toLowerCase();
            args = args.slice(1);
            // find command
            var disabledAliases = checkAliases(commands);
            if (disabledAliases.includes(cmd)) {
              // we can't execute this command, execute help command
            } else {
            	for (let key in this.commands) {
                var command = this.commands[key];
								if (command.aliases.main.includes(cmd)) {
                  try {
                    command.run(client, database, message, args);
                  } catch (e) {
                    errorOutput(e, fName);
                  }
                  break;
                }
            	}
          	}
        	  deleteMessage(client, message);
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
