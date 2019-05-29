const usersJS = require('../database/users.js');
const loadD = require('../database/databaseEntryLoader.js').load;
const utils = require('../utils.js');
const path = require('path');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

/**
  * User Loader.
  *
  * Executes the load function for each user in a guild connected to the server.
  * @since 1.0.0
  * @param {Discord.Client} discord - acquired from ./discord/discordLoad.js
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
exports.loadUsers = (discord, database) => {
  const guilds = discord.guilds.array();
  for (var i in guilds) {
    guilds[i].fetchMembers().then((guild) => {
        const members = guild.members.array();
        for (var j in members) {
          load(members[j], database);
        }
    });
  }
}

exports.load = load;

/**
  * User Loader.
  *
  * Updates user data in the database or adds it.
  * @since 1.0.2
  * @param {Discord.GuildMember} guildMember
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
function load(guildMember, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(guildMember);
  function successFunction(data, bareData, collection) {
    data = utils.jsonUpdate(data, bareData);
    const updatedData = usersJS.upToDater(data, bareUserData);
    collection.updateOne({id: updatedData.id}, {$set: updatedData});
  }
  loadD(bareUserData, users, successFunction);
}
