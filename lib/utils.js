const path = require('path');

const getBaseName = require('./utils/getBaseName.js').getBaseName,
      jsonUpdate = require('./utils/jsonUpdate.js').jsonUpdate,
      checkNoVal = require('./utils/checkNoVal.js').checkNoVal,
      objectsEqual = require('./utils/objectsEqual.js').objectsEqual,
      getTime = require('./utils/getTime.js').getTime;

const _fName = getBaseName(__filename);

/**
  * Debug data outputter.
  * @since 1.0.0
  * @param {string} output - debug message
  * @param {string} fName - function name or location indicator
*/
const debugOutput = function (output, fName) {
  fName = fName | _fName;
  console.log(`[${fName}]: ${output}`)
};

/**
  * Error data outputter.
  * @since 1.0.0
  * @param {string} output - debug message
  * @param {string} fName - function name or location indicator
*/
const errorOutput = function (output, fName) {
  fName = fName | _fName;
  throw Error(`[${fName}]: ${output}`);
};

exports.debugOutput = debugOutput;
exports.errorOutput = errorOutput;

exports.jsonUpdate = jsonUpdate;
exports.getBaseName = getBaseName;
exports.checkNoVal = checkNoVal;
exports.objectsEqual = objectsEqual;

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
