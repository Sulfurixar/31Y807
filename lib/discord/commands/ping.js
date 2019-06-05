const aliasGen = require('./commandUtils/aliasGen.js').aliasGen;
const checkPerms = require('./commandUtils/checkPerms.js').checkPerms;
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
      execute: 'Returns Pong!'
    },
  };

  this.run = (client, database, message, args=null) => {
    if (checkPerms(message.author, 'execute', this)) {
      const embed = new discord.RichEmbed().setTitle('Pong!')
      message.channel.send(embed);
    }
  };
}
exports.command = Command;
