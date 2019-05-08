/**
  * Get datetime.
  * @since 1.0.0
  * @return {string}
  * @param {boolean} [year=true]
  * @param {boolean} [month=true]
  * @param {boolean} [day=true]
  * @param {boolean} [hour=true]
  * @param {boolean} [min=true]
  * @param {boolean} [sec=true]
*/
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

exports.getTime = getTime;
