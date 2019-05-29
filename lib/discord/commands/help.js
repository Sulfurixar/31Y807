const aliasGen = require('./commandUtils/aliasGen.js').aliasGen;

var Command = function (name) {
  this.config = {
    name: name,
    active: true,
    events: {
      message: false,
    },
  };
  this.aliases = {
    main: aliasGen(name),
    canExecute: 'everyone'
  };
}

Command.prototype.run = (client, database, message, args) => {
  
};

exports.command = Command;
