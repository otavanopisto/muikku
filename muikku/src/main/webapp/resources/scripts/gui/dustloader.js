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
      //Fixes Firefox complains about XML #3330
      mimeType: "text/plain",
      
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
  return formatDate(moment(value).toDate());
};

dust.filters.formatTime = function(value) {
  return formatTime(moment(value).toDate());
};

dust.filters.timestamp = function(value) {
  return moment(value).toDate().getTime();
};

dust.filters.formatPercent = function(value) {
  return parseFloat(value).toFixed(2);
};

dust.filters.shorten50 = function (value) {
  if (value.length < 50) {
    return value;
  } else {
    return value.slice(0, 47) + "...";
  }
}

dust.helpers.contextPath = function(chunk, context, bodies) {
  return chunk.write(CONTEXTPATH);
};

dust.helpers.moment = function (chunk, context, bodies, params) {
  var type = context.resolve(params.type, chunk, context) || 'format';
  var date = context.resolve(params.date, chunk, context) || new Date();
  var format = context.resolve(params.format, chunk, context) || 'MMM Do YYYY';
  var input = context.resolve(params.input, chunk, context) || 1;
  var value = context.resolve(params.value, chunk, context) || 'days';
  var locale = getLocale();

  moment.locale(locale);

  switch (type) {
    case 'format':
      return chunk.write(moment(new Date(date)).format(format));
      break;
    case 'fromNow':
      return chunk.write(moment(new Date(date)).fromNow());
      break;
    case 'subtract':
      return chunk.write(moment(new Date(date)).subtract(input, value).calendar());
      break;
    case 'add':
      return chunk.write(moment(new Date(date)).add(input, value).calendar());
      break;
  }
};

dust.helpers.color = function(chunk, context, bodies, params) {
  var color = context.resolve(params.color, chunk, context);
  if (!color){
    if (console && console.warn){
      console.warn("missing color in dust template");
    }
    return chunk.write("red");
  }
  
  var b = (color & 255).toString(16);
  var g = ((color >> 8) & 255).toString(16);
  var r = ((color >> 16) & 255).toString(16);

  var rStr = r.length == 1 ? "0" + r : r;
  var gStr = g.length == 1 ? "0" + g : g;
  var bStr = b.length == 1 ? "0" + b : b;
  
  return chunk.write("#" + rStr + gStr + bStr);
}

function renderDustTemplate(templateName, json, callback) {
  var base = dust.makeBase({
    localize: function(chunk, context, bodies, params) {
      var args = new Array();
      var i = 0;
      while (true) {
        if (params["arg" + i] != null) {
          args.push(params["arg" + i]);
        } else {
          break;
        }
        
        i++;
      }
      
      var text = getLocaleText(params.key, args);
      if (text)
        text = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      
      var result = chunk.write(text);
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
