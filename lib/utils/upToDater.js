const utils = require('../utils.js');
const ddiff = require('deep-diff');
const clone = require('lodash/cloneDeep');


/**
  * Schema updater.
  * @since 1.0.2
  * @param {object} currentData - schema JSON object
  * @param {object} newData - schema JSON object
  * @return {object} updated schema
*/
function upToDater(currentData, newData, exactTimeKeys=[], hourTimeKeys=[], whiteList=[]) {
  for (var key in newData) {
    if (!whiteList.includes(key)) break;
    if (!utils.objectsEqual(currentData[key], newData[key])) {
      if (currentData[key] != newData[key]) {
        nKey = 'previous' + key.charAt(0).toUpperCase() + key.slice(1);
        if (!whiteList.includes(nKey)) break;
        if (currentData[nKey] !== undefined) {
          const dates = Object.keys(currentData[nKey]);
          const last = currentData[nKey][dates[dates.length - 1]];
          if (last === undefined) {
            var diff = currentData[key];
          } else {
            var x11 = clone(newData[key]);
            ddiff.applyDiff(x11, clone(currentData[key]));
            var x22 = clone(last);
            ddiff.applyDiff(x22, clone(currentData[key]));
            var x33 = clone(x11);
            ddiff.applyDiff(x33, clone(x22));
            var x44 = clone(last);
            ddiff.applyDiff(clone(newData[key]), x44);
            x44 = utils.getJSONFull(clone(x44), clone(newData[key]));
            var diff = utils.getJSONDifferences(clone(x44), clone(x33));

          }
          if (diff !== null) {
            if (exactTimeKeys.includes(key)) {
              currentData[nKey][utils.getTime()] = diff;
            } else if (hourTimeKeys.includes(key)) {
              currentData[nKey][utils.getHourTime()] = diff;
            } else {
              if (whiteList.includes(key)) {
                currentData[nKey][utils.getDayTime()] = diff;
              }
            }
          }
        }
        if (!key.startsWith('previous')) {
          currentData[key] = newData[key];
        }
      }
    }
  }
  return currentData;
}

exports.upToDater = upToDater;
