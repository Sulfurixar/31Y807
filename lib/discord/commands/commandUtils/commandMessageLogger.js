const utils = require('../../../utils.js');
const serversJS = require('../../../database/servers.js');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;
const clone = require('lodash/cloneDeep');

function deleteMessages(messages, guild) {
  for (m in messages) { // for each message record in old
    let message = messages[m];
    var channel = null;
    for (i of guild.channels.entries()) {
      let key = i[0];
      let val = i[1];
      if (key === message.channel) { channel = val; break; }
    }
    if (channel) {
      channel.fetchMessage(message.id).then((message) => {
        message.delete();
      }, () => {});
    }
  }
}

function getms(messages) {
  let nMessages = [];
  for (m in messages) {
    nMessages.push({
      channel: messages[m].channel.id,
      id: messages[m].id
    });
  }
  return nMessages;
}

function insertData(client, data, userMessage, messages) {
  if (!data.botMessageBuffer) data.botMessageBuffer = {};
  if (!data.botErrorBuffer) data.botErrorBuffer = [];
  let guild = userMessage.guild;
  let bCol = messages[0].embeds[0].color;
  let eCols = data.embedColours;
  if (bCol === eCols.error || bCol === eCols.dev) {
    if (data.botErrorBuffer.length + 1 > 1000) {
      // get the old error message query that ought to be deleted
      let old = data.botErrorBuffer.shift();
      deleteMessages(clone(old), guild);
    }
    // once we have made sure our buffer won't get too many elements
    data.botErrorBuffer.push(getms(messages));
  } else {
    // first, check if our user already exists in the dict
    if (!data.botMessageBuffer[userMessage.author.id]) {
      // user didn't exist, make sure we don't pass 20 users at a time per server
      if (Object.keys(data.botMessageBuffer).length + 1 > 20) {
        let key = Object.keys(data.botMessageBuffer)[0];
        let old = data.botMessageBuffer[key];
        deleteMessages(clone(old), guild);
        delete data.botMessageBuffer[key];
      }
    } else {
      let old = data.botMessageBuffer[userMessage.author.id];
      deleteMessages(clone(old), guild);
      delete data.botMessageBuffer[userMessage.author.id];
    }
    data.botMessageBuffer[userMessage.author.id] = getms(messages);
  }
  return data
}

function botMessageLogger(client, cmdMessage, botMessages, database) {
  const servers = database.collection('servers');
  const bareGuildData = serversJS.getSchema(cmdMessage.guild);
  servers.findOne({id: cmdMessage.guild.id}).then(
    (data) => {
      if (data) {
        data = utils.jsonUpdate(data, bareGuildData);
        data = insertData(client, clone(data), cmdMessage, botMessages);
        servers.updateOne({id: data.id}, { $set: {
          botErrorBuffer: data.botErrorBuffer,
          botMessageBuffer: data.botMessageBuffer
        }});
      } else {
        bareGuildData = insertData(client, bareGuildData, cmdMessage, botMessages);
        servers.insertOne(bareGuildData);
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

exports.botMessageLogger = botMessageLogger;
