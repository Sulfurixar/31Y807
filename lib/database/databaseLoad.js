const utils = require('../utils.js');
const mongo = require('mongodb').MongoClient;
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;


exports.load = (config) => {
  var url = 'mongodb://localhost:';
  console.log(config.database.port);
  if (utils.checkNoVal(config.database.port)) {
    url = url + '27017';
  } else {
    if (typeof(config.database.port) === 'number' && config.database.port >= 0) {
      url = `mongodb://localhost:${config.database.port}`;
    } else {
      if (typeof(config.database.port) === 'number') {
        errorOutput('database->port in config.json not a positive integer.', fName);
      } else {
        errorOutput('database->port in config.json not a number', fName);
      }
    }
  }

  return mongo.connect(url);

};
