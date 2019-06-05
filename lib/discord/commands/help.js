const aliasGen = require('./commandUtils/aliasGen.js').aliasGen;
const checkPerms = require('./commandUtils/checkPerms.js').checkPerms;
const botMessageLogger = require('./commandUtils/commandMessageLogger.js').botMessageLogger;
const discord = require('discord.js');

var Command = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: false,
    },
  };
  this.command = {
    aliases: aliasGen(name),
    permissions: {
      execute: 'everyone',
    },
    help: {
      execute: 'Shows available commands and help related to them.'
    }
  };
}

Command.prototype.run = (client, database, message, args=null, commands) => {
  if (args === null || args.length === 0) {
    var sends = [];
    var vals = 0;
    for (i in commands) {
      if (checkPerms(message.author, 'execute', commands[i])) {
        var embed =
          new discord.RichEmbed()
          .setTitle(i)
          .setDescription(commands[i].command.help.execute)
          .addField('Aliases:', commands[i].command.aliases.join(', '));
        vals += 1;
        message.channel.send(embed).then((message) => {
          sends.push(message)
        }, (err) => {});
      }
    }
    var s = () => {
      if (sends.length !== vals) {
        setTimeout(s, 500);
      } else {
        botMessageLogger(client, message, sends, database);
      }
    };
    s();
  }
};

exports.command = Command;
