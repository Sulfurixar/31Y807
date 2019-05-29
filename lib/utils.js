const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const jsonUpdate = require('./utils/jsonUpdate.js').jsonUpdate,
      checkNoVal = require('./utils/checkNoVal.js').checkNoVal,
      objectsEqual = require('./utils/objectsEqual.js').objectsEqual,
      getTime = require('./utils/getTime.js').getTime,
      getJSONDifferences = require('./utils/getJSONDifferences.js');

const _fName = __filename.split(/[\/\\]/).slice(-1)[0];
const errorPath = path.join(__dirname, '..', './errors');

/**
  * Debug data outputter.
  * @since 1.0.0
  * @param {string} output - debug message
  * @param {string} fName - function name or location indicator
*/
const debugOutput = function (output, fName=_fName) {
  console.log(`[${fName}]:`, output);
};

/**
  * Error data outputter.
  * @since 1.0.0
  * @param {string} output - debug message
  * @param {string} fName - function name or location indicator
*/
const errorOutput = function (output, fName=_fName) {
  console.log(`[${fName}]:`, output);
  output = output.stack.replace(/   */g, '\r\n\t');
  let hash = crypto.createHash('md5').update(output).digest("hex");
  fs.writeFileSync(path.join(errorPath, `${hash}.txt`), output, 'utf-8');
  return hash;
};

exports.debugOutput = debugOutput;
exports.errorOutput = errorOutput;

exports.jsonUpdate = jsonUpdate;
exports.checkNoVal = checkNoVal;
exports.objectsEqual = objectsEqual;
exports.getJSONDifferences = getJSONDifferences.getJSONDifferences;
exports.getJSONFull = getJSONDifferences.getJSONFull;

/**
  * Get full datetime.
  * @since 1.0.0
  * @return {string}
*/
exports.getTime = () => {
  return getTime();
};

/**
  * Get datetime from year to day.
  * @since 1.0.0
  * @return {string}
*/
exports.getDayTime = () => {
  return getTime(true, true, true, false, false, false);
};

/**
  * Get datetime from year to hour.
  * @since 1.0.0
  * @return {string}
*/
exports.getHourTime = () => {
  return getTime(true, true, true, true, false, false);
};

exports.getTimeCustom = getTime;
