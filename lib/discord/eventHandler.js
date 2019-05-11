const eventList = require('./eventList.js').get();
const utils = require('../utils.js');
const fs = require('fs');
const path = require('path');
const messageJS = require('./message.js').exec;

const _fName = utils.getBaseName(__filename);
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

const eventPath = path.join(__dirname, 'events');
const commandPath = path.join(__dirname, 'commands');

var eventChains = {};
fs.readdir(eventPath, (err, files) => {
  if (err) {
    return errorOutput(err, _fName);
  }
  eventChains = {};
  files.forEach(function (file) {
    const fullpath = path.join(eventPath, file);
    try {
      var event = new (require(fullpath).event)(utils.getBaseName(file.split('.')[0]));
      if (event.config.active) {
        for (let ekey in event.config.events) {
          if (eventList.includes(ekey) && event.config.events[ekey] === true) {
            if (eventChains[ekey] === undefined) eventChains[ekey] = [];
            eventChains[ekey].push({name: file.split('.')[0], func: event[ekey]});
          }
        }
      }
    } catch(e) {
      debugOutput(e, _fNam);
    }
  });
});

function createEvents(client, database) {
  console.log(eventChains);
  for (let event in eventChains){
    if (event === 'message') {
      client.on(event, message => {
        messageJS(client, message, database, eventChains[event]);
      });
    } else {
      client.on(event, (val1, val2) => {
        for (let i in eventChains[event]) {
          try {
            eventChains[event][i].func(val1, val2);
          } catch (e) {
            debugOutput(e, _fName);
          }
        }
      });
    }
  }
}

exports.createEvents = createEvents;
