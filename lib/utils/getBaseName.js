const path = require('path');

/**
  * Path file name getter.
  * @since 1.0.0
  * @param {string} filePath
  * @return {string}
*/
function getBaseName (filePath) {
  let pathSplit = filePath.split(path.sep);
  return pathSplit[pathSplit.length - 1];
};

exports.getBaseName = getBaseName;
