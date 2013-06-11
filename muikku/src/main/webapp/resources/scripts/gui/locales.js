function getLocaleText(key, args) {
  var val = window._MUIKKU_LOCALEMAP[key];
  if (args) {
    for (var i = 0; i < args.length; i++) {
      val = val.replace('{' + i + '}', args[i]);
    }
    if (val.indexOf('{date}') !== -1) {
      val = val.replace('{date}', getCurrentDate());
    }
    if (val.indexOf('{time}') !== -1) {
      val = val.replace('{time}', getCurrentTime());
    }
  }
  return val;
}

function getLocale() {
  return window._MUIKKU_LOCALE;
}

function getCurrentDate() {
  return formatDate(new Date());
}

function formatDate(d) {
  return $.datepicker.formatDate(getLocaleText('datePattern'), d);
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
