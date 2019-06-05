const deleteMessage = require('./eventUtils/deleteMessage.js').deleteMessage;
const parse = require('./eventUtils/commandParser.js').parse;
const utils = require('../../utils.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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
              console.log('disabled alias')
            } else {
              var foundCommand = false;
            	for (let key in this.commands) {
                var command = this.commands[key];
								if (command.command.aliases.includes(cmd)) {
                  try {
                    command.run(client, database, message, args, this.commands);
                  } catch (e) {
                    var errorData = errorOutput(e, fName);
                    var log = `Command issued by: ${message.author.id}:${message.author.tag}\r\n\t` +
                    `in ${message.guild.id}:${message.guild.name}\r\n\r\n` +
                    `Command: ${message.content}\r\n` +
                    `error log: ${errorData[0]}\r\nerror message: ${errorData[1]}`
                    errorData = errorOutput(log, fName);
                    // RETURN message to user
                  }
                  foundCommand = true;
                  break;
                }
            	}
              if (!foundCommand) {
                // didn't find the command, execute help command
                console.log('did not find command')
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
