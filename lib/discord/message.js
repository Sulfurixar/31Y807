const utils = require('../utils.js');
const path = require('path');

function exec(client, message, database, functions) {
  //// TODO:
  for (let f in functions) {
    try {
      functions[f].func(client, message, database);
    } catch (e) {
      utils.errorOutput(e, __filename.split(/[\/\\]/).slice(-1)[0]);
    }
  }

}

exports.exec = exec;
