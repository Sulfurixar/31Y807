const serverSchema = require('../database/schemas/serverSchema.js');
const utils = require('../utils.js');
const fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

exports.loadGuilds = (config, discord, database) => {
  const guilds = discord.guilds.array();
  for (var i in guilds) {
    load(config, guilds[i], database);
  }
}

exports.load = load;

function load(config, guild, database) {
  const servers = database.collection('servers');
  const bareGuildData = serverSchema.getSchema(guild, config['global-prefix']);
  servers.findOne({id: guild.id}).then(
    (data) => {
      if (data !== null) {
        data = utils.jsonUpdate(data, bareGuildData);
        const updatedData = serverSchema.upToDater(data, bareGuildData);
        servers.updateOne({id: updatedData.id}, {$set: updatedData});
      } else {
        servers.insertOne(bareGuildData);
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
