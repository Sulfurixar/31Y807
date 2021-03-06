const eventList = require('./eventList.js').get();
const utils = require('../utils.js');
const fs = require('fs');
const path = require('path');
const messageJS = require('./message.js').exec;

const fName = __filename.split(/[\/\\]/).slice(-1)[0];
const debugOutput = utils.debugOutput;
const errorOutput = utils.errorOutput;

const paths = [ path.join(__dirname, 'events'),
                path.join(__dirname, '..', '..', 'events'),
                path.join(__dirname, 'commands'),
                path.join(__dirname, '..', '..', 'commands')
              ];

var eventChains = {};
for (let i in paths) {
  loadData(paths[i]);
}
function loadData(_path) {
  fs.readdir(_path, (err, files) => {
    if (err) {
      return errorOutput(err, fName);
    }
    files.forEach(function (file) {
      const fullpath = path.join(_path, file);
      debugOutput(fullpath, fName);
      if (!fs.lstatSync(fullpath).isDirectory()) {
        try {
          const Event = require(fullpath).event;
          if (Event !== undefined) {
            var event = new Event(file.split('.')[0].split(/[\/\\]/).slice(-1)[0]);
            if (event.config.active) {
              for (let ekey in event.config.events) {
                if (eventList.includes(ekey) && event.config.events[ekey] === true) {
                  if (eventChains[ekey] === undefined) eventChains[ekey] = [];
                  eventChains[ekey].push({name: file.split('.')[0], func: event[ekey]});
                }
              }
            }
          }
        } catch(e) {
          errorOutput(e, fName);
        }
      }
    });
  });
}

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
            eventChains[event][i].func(val1, val2, database);
          } catch (e) {
            errorOutput(e, fName);
          }
        }
      });
    }
  }
}

exports.createEvents = createEvents;
