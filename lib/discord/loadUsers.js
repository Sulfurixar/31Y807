const usersJS = require('../database/users.js');
const utils = require('../utils.js');
const fName = utils.getBaseName(__filename);
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
  * @since 1.0.0
  * @param {Discord.GuildMember} guildMember
  * @param {mongodb.db} database - aquired from ./discord/discordLoad.js
*/
function load(guildMember, database) {
  const users = database.collection('users');
  const bareUserData = usersJS.getSchema(guildMember);
  users.findOne({id: guildMember.id}).then(
    (data) => {
      if (data !== null) {
        data = utils.jsonUpdate(data, bareUserData);
        const updatedData = usersJS.upToDater(data, bareUserData);
        users.updateOne({id: updatedData.id}, {$set: updatedData});
      } else {
        users.insertOne(bareUserData);
      }
    },
    (err) => {
      if (err !== null) {
        errorOutput(err);
      }
    }
  ).catch((err) => {
    errorOutput(err);
  });
}
