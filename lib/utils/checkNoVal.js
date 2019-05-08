/**
  * Check for no Value.
  *
  * Checks wether the given value is not undefined, null, {}, [] or ''.
  * @since 1.0.0
  * @param {object} value
  * @return {boolean}
*/
function checkNoVal(value) {
  if (value === undefined | value === null | value === {} | value === [] | value === '') {
    return true;
  }
  return false;
}

exports.checkNoVal = checkNoVal;
