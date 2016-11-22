(function() {
  'use strict';
  
  function getLocaleText(key) {

    var args = Array.prototype.slice.call(arguments, 1);
    if (args.length === 1) {
      if ($.isArray(args[0])) {
        args = args[0];
      }
    }
    
    var val = window._MUIKKU_LOCALEMAP[key];
    if (val !== undefined) {
      val = val.replace(/\{(\d+)(,?\w*)(,?\w*)\}/gi, function (match, number, type, format) {
        var argumentIndex = Number(number);
        if (args.length > argumentIndex) {
          var currentValue = args[argumentIndex];
    
          if (type == ",date") {
            if (format == ",short") {
              return formatDate(new Date(currentValue), true);
            } else {
              return formatDate(new Date(currentValue));
            }
          } else if (type == ",time") {
            return formatTime(new Date(currentValue));
          }
        }
        
        return currentValue;
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
  
  function formatDateTime(d) {
    return formatDate(d) + ' ' + formatTime(d);
  }
  
  window.getLocaleText = getLocaleText;
  window.getLocale = getLocale;
  window.getCurrentDate = getCurrentDate;
  window.formatDate = formatDate;
  window.getCurrentTime = getCurrentTime;
  window.formatTime = formatTime;
  window.formatDateTime = formatDateTime;

}).call(this);