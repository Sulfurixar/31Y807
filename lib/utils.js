const path = require('path');

function getBaseName (filePath) {
  let pathSplit = filePath.split(path.sep);
  return pathSplit[pathSplit.length - 1];
};

const _fName = getBaseName(__filename);

const debugOutput = function (output, fName) {
  fName = fName | _fName;
  console.log(`[${fName}]: ${output}`)
};

const errorOutput = function (output, fName) {
  fName = fName | _fName;
  throw Error(`[${fName}]: ${output}`);
};

exports.debugOutput = debugOutput;
exports.errorOutput = errorOutput;

exports.jsonUpdate = function (updatingJson, templateJson) {

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

exports.getBaseName = getBaseName;

exports.checkNoVal = function (value) {
  if (value === undefined | value === null | value === {} | value === [] | value === '') {
    return true;
  }
  return false;
}

exports.objectsEqual = function (value, other) {

  // Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!exports.objectsEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;

}

exports.getTime = () => {
  return getTime();
};

exports.getDayTime = () => {
  return getTime(true, true, true, false, false, false);
};

exports.getHourTime = () => {
  return getTime(true, true, true, true, false, false);
};

exports.getTimeCustom = (year, month, day, hour, minute, second) => {
  return getTime(year, month, day, hour, minute, second);
}

function getTime(year=true, month=true, day=true, hour=true, min=true, sec=true) {
  const date = new Date();
  var dateStr = '';

  if (year) {
    dateStr += date.getFullYear();
  }

  function timefix(time) {
    return (time < 10 ? "0" : "") + time;
  }

  if (month) {
    month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    dateStr += (dateStr === '' ? '' : '-') + month;
  }

  if (day) {
    day  = timefix(date.getDate());
    dateStr += (dateStr === '' ? '' : '-') + day;
  }

  if (hour) {
    hour = timefix(date.getHours());
    dateStr += (dateStr === '' ? '' : ' ') + hour;
  }

  if (min) {
    min  = timefix(date.getMinutes());
    dateStr += (dateStr === '' ? '' : (hour ? ':' : ' ')) + min;
  }

  if (sec) {
    sec  = timefix(date.getSeconds());
    dateStr += (dateStr === '' ? '' : (hour ? ':' : (min ? ':' : ' '))) + min;
  }

  return dateStr;
}
