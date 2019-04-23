const fs = require('fs'),
      path = require('path'),
      clone = require('lodash/cloneDeep');

const utils = require('./utils');

const _basePath = path.join(__dirname, '..');

const templatesPath = path.join(_basePath, 'templates'),
      mainConfigTemplatePath = path.join(templatesPath, 'main-config.json'),
      mainConfigPath = path.join(_basePath, 'config.json');

// Various config files...
const mainConfig = {
  "discord": {
    "global-prefix": "e!",
    "login-method": "bot",
    "methods": {
      "bot": {
        "token": ""
      },
      "user": {
        "email": "",
        "password": ""
      }
    }
  },
  "webserver": {
    "key-path": ''
  }
};
try {
  exports.config = require(mainConfigPath);
} catch (e) {
  exports.config = clone(mainConfig);
}
//

function fileExists(filePath, data='', useExistingFile=undefined) {

  fs.access(filePath, fs.F_OK, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(`Creating ${filePath} ...`);
        let found = utils.getBaseName(filePath).match(/\./);
        if (found === null) {
          fs.mkdirSync(filePath);
        } else {
          if (useExistingFile === undefined) {
            fs.writeFileSync(filePath, data, 'utf-8');
          } else {
            fs.copyFileSync(useExistingFile, filePath)
          }
        }
        console.log(`${filePath} is created successfully!`);
      } else {
        console.error(err);
      }
      return
    }

    // file exists - do some checks
    let name = utils.getBaseName(filePath).split('.')[0];
    console.log(`Found: '${filePath}' -> ${name}`);
    if (path.extname(filePath) === '.json') {
      let content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (name === 'main-config' | name === 'config') {
        var new_content = utils.jsonUpdate(clone(content), clone(mainConfig));
      }

      //apply changes if there were any
      if (!utils.objectsEqual(content, new_content)) {
        console.log(`Updating: '${filePath}'`);
        fs.writeFileSync(filePath, JSON.stringify(new_content, null, 2), 'utf-8');
        exports.config = require(filePath);
      }
    }
  });
}

fileExists(templatesPath);
fileExists(mainConfigTemplatePath, JSON.stringify(mainConfig, null, 2));
fileExists(mainConfigPath, null, mainConfigTemplatePath);
