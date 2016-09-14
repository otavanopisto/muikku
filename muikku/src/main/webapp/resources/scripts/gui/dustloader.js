var mdust = {};

mdust.loading = {};
mdust.queued = {};

dust.onLoad = function(name, callback) {
  if (mdust.loading[name]) {
    if (!mdust.queued[name]) {
      mdust.queued[name] = [];
    }
    
    mdust.queued[name].push(callback);
  } else {
    mdust.loading[name] = true;
    
    $.ajax(CONTEXTPATH + '/resources/dust/' + name, {
      success : function(data, textStatus, jqXHR) {
        delete mdust.loading[name];
        callback(false, data);
        
        if (mdust.queued[name]) {
          $.each(mdust.queued[name], function (ind, queuedCallback) {
            queuedCallback(false, data);
          });
          
          delete mdust.queued[name];
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        var message = 'Could not find Dust template: ' + name;
        $('.notification-queue').notificationQueue('notification', 'error', message);  
      }
    })
  };
};

dust.filters.formatDate = function(value) {
  var d = new Date(moment(value));
  return formatDate(d);
};

dust.filters.formatTime = function(value) {
  var d = new Date(moment(value));
  return formatTime(d);
};

dust.filters.formatPercent = function(value) {
  return parseFloat(value).toFixed(2);
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
    },
    isLoggedIn: function(chunk, context, bodies, params) {
      if (MUIKKU_LOGGEDIN === true) {
        return chunk.render(bodies.block, context);
      } else {
        if (bodies['else']) {
          return chunk.render(bodies['else'], context);
        }
      }
    }
  });
  
  dust.render(templateName, base.push(json), function (err, text) {
    if (err) {
      var message = "Error occured while rendering dust template " + templateName + ": " + err;
      $('.notification-queue').notificationQueue('notification', 'error', message);  
    } else {
      callback(text);
    }
  });
}; 
