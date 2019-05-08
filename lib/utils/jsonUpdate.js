/**
  * JSON data updater.
  *
  * Compares 2 JSON objects and adds any missing literals - recursively.
  * @since 1.0.0
  * @param {object} updatingJson
  * @param {object} templateJson
  * @return {object} updated object
*/
function jsonUpdate(updatingJson, templateJson) {

  if (typeof(updatingJson) === 'object' & typeof(templateJson) === 'object') {
    for (var key in templateJson) {
      if (updatingJson[key] === undefined | updatingJson[key] === null) {
        updatingJson[key] = templateJson[key];
      } else {
        updatingJson[key] = exports.jsonUpdate(updatingJson[key], templateJson[key]);
      }

    }
    return updatingJson;
  }

  if (updatingJson === undefined | updatingJson === null) {
    if (typeof(templateJson) !== 'function') {
      return templateJson;
    }
  }

  return updatingJson;
};

exports.jsonUpdate = jsonUpdate;
