const diff = require('deep-diff');
const objectsEqual = require('./objectsEqual.js').objectsEqual;

function getJSONDifferences(newJSON, oldJSON) {
  console.log('oldJSON:', oldJSON);
  console.log('newJSON:', newJSON);
  const diffr = diff(oldJSON, newJSON);
  console.log(diffr);
  for (var d in diffr) {
    if (diffr[d].kind == 'D') {
      return newJSON;
    }
  }
}

exports.getJSONDifferences = getJSONDifferences;
