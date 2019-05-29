const fs = require('fs'),
      path = require('path'),
      clone = require('lodash/cloneDeep');

const utils = require('./utils.js');

const _basePath = path.join(__dirname, '..');
const fName = __filename.split(/[\/\\]/).slice(-1)[0];

const templatesPath = path.join(_basePath, 'templates'),
      mainConfigTemplatePath = path.join(templatesPath, 'main-config.json'),
      templateEventPath = path.join(templatesPath, 'templateEvent.js'),
      baseTemplateEventPath = path.join(_basePath, 'lib', 'discord', 'events', 'templateEvent.js'),
      mainConfigPath = path.join(_basePath, 'config.json'),
      eventsPath = path.join(_basePath, 'events'),
      errorsPath = path.join(_basePath, 'errors'),
      commandsPath = path.join(_basePath, 'commands'),
      dataPath = path.join(_basePath, 'webserver');

// Various config files...
const mainConfig = {
  "discord": {
    "global-prefix": "e!",
    "login-method": "bot",
    "methods": {
      "bot": "",
      "user": ""
    }
  },
  "webserver": {
    "key-path": "",
    "cert-path": "",
    "http-port": 80,
    'https-port': 443,
    'data-path': dataPath
  },
  "database": {
    "port": 27017
  }
};
try {
  exports.config = require(mainConfigPath);
} catch (e) {
  exports.config = clone(mainConfig);
}
//

/**
  * Checks if a file exists and creates it if it's missing.
  * @since 1.0.0
  * @param {string} filePath - path of the file in question
  * @param {string} [data=''] - json string of already existing content for the default contents of the file
  * @param {string} [useExistingFile=undefined] - path of a file that contains data to be used for the file
*/
function fileExists(filePath, data='', useExistingFile=undefined) {

  fs.access(filePath, fs.F_OK, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        utils.debugOutput(`Creating ${filePath} ...`, fName);
        let found = filePath.split(/[\/\\]/).slice(-1)[0].match(/\./);
        if (found === null) {
          fs.mkdirSync(filePath);
        } else {
          if (useExistingFile === undefined) {
            fs.writeFileSync(filePath, data, 'utf-8');
          } else {
            fs.copyFileSync(useExistingFile, filePath);
          }
        }
        utils.debugOutput(`${filePath} is created successfully!`, fName);
      } else {
        utils.errorOutput(err, fName);
      }
      return;
    }

    // file exists - do some checks
    let name = filePath.split(/[\/\\]/).slice(-1)[0].split('.')[0];
    utils.debugOutput(`Found: '${filePath}' -> ${name}`, fName);
    if (path.extname(filePath) === '.json') {
      try {
        var content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        utils.errorOutput(e, fName);
        var content = {};
      }
      if (name === 'main-config' | name === 'config') {
        var new_content = utils.jsonUpdate(clone(content), clone(mainConfig));
      }

      //apply changes if there were any
      if (!utils.objectsEqual(content, new_content)) {
        utils.debugOutput(`Updating: '${filePath}'`, fName);
        console.log('new content:', new_content);
        fs.writeFileSync(filePath, JSON.stringify(new_content, null, 2), 'utf-8');
        exports.config = require(filePath);
      }
    }
  });
}

fileExists(templatesPath);
fileExists(commandsPath);
fileExists(eventsPath);
fileExists(errorsPath);
fileExists(mainConfigTemplatePath, JSON.stringify(mainConfig, null, 2));
fileExists(mainConfigPath, null, mainConfigTemplatePath);
fileExists(templateEventPath, null, baseTemplateEventPath);
