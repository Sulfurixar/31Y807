const aliasGen = require('./commandUtils/aliasGen.js').aliasGen;
const checkPerms = require('./commandUtils/checkPerms.js').checkPerms;

var Command = function (name) {
  this.config = {
    name: name,
    active: false,
    events: {
      message: false,
    },
  };
  this.command = {
    aliases: aliasGen(name),
    permissions: {
      execute: 'everyone',
    },
  };
}

Command.prototype.run = (client, database, message, args=null) => {
};

exports.command = Command;
