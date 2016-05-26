function getLocaleText(key, args) {
  var val = window._MUIKKU_LOCALEMAP[key];
  if (val !== undefined) {
    val = val.replace(/\{(\d+)(,?\w*)(,?\w*)\}/gi, function (match, number, type, format) {
      var currentValue = args[Number(number)];

      if (type == ",date") {
        if (format == ",short") {
          return formatDate(new Date(currentValue), true);
        } else {
          return formatDate(new Date(currentValue));
        }
      } else if (type == ",time") {
        return formatTime(new Date(currentValue));
      } else {
        return currentValue;
      }
    });
    
    return val;
  } else {
    return "!" + key + "!";
  }
}

function getLocale() {
  return window._MUIKKU_LOCALE;
}

function getCurrentDate() {
  return formatDate(new Date());
}

function formatDate(d, shortDate) {
  if (shortDate) {
    return $.datepicker.formatDate(getLocaleText('shortDatePattern'), d);
  } else {
    return $.datepicker.formatDate(getLocaleText('datePattern'), d);
  }
}

function getCurrentTime() {
  return formatTime(new Date());
}

function formatTime(d) {
  // TODO Could use some elegance, surely...
  var val = getLocaleText('timePattern');
  val = val.replace('hh', ('00' + d.getHours()).slice(-2));
  val = val.replace('mm', ('00' + d.getMinutes()).slice(-2));
  val = val.replace('ss', ('00' + d.getSeconds()).slice(-2));
  return val;
}
