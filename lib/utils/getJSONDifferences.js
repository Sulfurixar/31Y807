const diff = require('deep-diff');
const objectsEqual = require('./objectsEqual.js').objectsEqual;

function getJSONDifferences(newJSON, oldJSON) {
  var dat = {};
  var d = diff(newJSON, oldJSON);
  for (let c in d) {
    diff.applyChange(dat, oldJSON, d[c]);
  }
  return dat;
}

function getJSONFull(newJSON, oldJSON) {
  const k1 = Object.keys(newJSON);
  const k2 = Object.keys(oldJSON);
  for (let i in k2) {
    if (newJSON[k2[i]] === undefined) {
      newJSON[k2[i]] = oldJSON[k2[i]];
    }
  }
  return newJSON;
}

exports.getJSONDifferences = getJSONDifferences;
exports.getJSONFull = getJSONFull;
