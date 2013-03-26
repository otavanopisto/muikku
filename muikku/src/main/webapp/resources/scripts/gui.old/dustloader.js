dust.onLoad = function(name, callback) {
  new Ajax.Request(CONTEXTPATH + '/resources/templates/' + name, {
    onSuccess : function(response) {
      callback(false, response.responseText);
    },
    onFailure: function (response) {
      var message = 'Could not find Dust template: ' + name;
      
      getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
        className: "notificationQueueCriticalItem"
      }));
    }
  });
};

dust.filters.formatDate = function(value) {
  // TODO: Implement proper formatter
  return new Date(value).toGMTString();
};

dust.helpers.contextPath = function(chunk, context, bodies) {
  return chunk.write(CONTEXTPATH);
};

function renderDustTemplate(templateName, json, callback) {
  getLocale(); // Preloads locale as dust works asynchronously and fails to load during render

  var base = dust.makeBase({
    localize: function(chunk, context, bodies, params) {
      var locale = getLocale();
      var localeText = locale.getText(params.key);
      return chunk.write(localeText);
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