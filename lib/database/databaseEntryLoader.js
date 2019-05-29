const utils = require('../utils.js');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

/**
  * Database Entry Loader.
  *
  * Updates entry data in the database or adds it.
  * @since 1.0.2
  * @param {JSON Object} guildMember / server
  * @param {mongodb.db.collection} collection
  * @param {function} successFunction callback if retrieval of data is successful
*/
function load(bareData, collection, successFunction) {
  collection.findOne({id: bareData.id}).then(
    (data) => {
      if (data !== null) {
        successFunction(data, bareData, collection);
      } else {
        users.insertOne(bareUserData);
      }
    },
    (err) => {
      if (err !== null) {
        errorOutput(err, fName);
      }
    }
  ).catch((err) => {
    errorOutput(err, fName);
  });
}

exports.load = load;
