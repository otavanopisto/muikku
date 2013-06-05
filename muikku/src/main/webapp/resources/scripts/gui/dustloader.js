dust.onLoad = function(name, callback) {
  $.ajax(CONTEXTPATH + '/resources/dust/' + name, {
    success : function(data, textStatus, jqXHR) {
      callback(false, data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      var message = 'Could not find Dust template: ' + name;
      
      getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
        className: "notificationQueueCriticalItem"
      }));
    }
  });
};

dust.preload = function(name) {
  var tmpl = dust.cache[name];
  if (!tmpl) {
    $.ajax(CONTEXTPATH + '/resources/dust/' + name, {
      async: false,
      success : function(data, textStatus, jqXHR) {
        if (!dust.cache[name]) 
          dust.loadSource(dust.compile(data, name));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        var message = 'Could not find Dust template: ' + name;
        
        getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
          className: "notificationQueueCriticalItem"
        }));
      }
    });
  }
};

dust.filters.formatDate = function(value) {
  return getCurrentDate();
};

dust.helpers.contextPath = function(chunk, context, bodies) {
  return chunk.write(CONTEXTPATH);
};

function renderDustTemplate(templateName, json, callback) {
  var base = dust.makeBase({
    localize: function(chunk, context, bodies, params) {
      var args = new Array();
      var i = 0;
      while (true) {
        if (params["arg" + i]) {
          args.push(params["arg" + i]);
        } else {
          break;
        }
        
        i++;
      }
      
      var result = chunk.write(getLocaleText(params.key, args));
      return result;
    }
  });
  
  dust.render(templateName, base.push(json), function (err, text) {
    if (err) {
      var message = "Error occured while rendering dust template " + templateName + ": " + err;
      getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
        className: "notificationQueueCriticalItem"
      }));
    } else {
      callback(text);
    }
  });
}; 