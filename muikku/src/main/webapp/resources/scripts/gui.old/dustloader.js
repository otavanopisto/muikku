dust.onLoad = function(name, callback) {
  $.ajax(CONTEXTPATH + '/resources/templates/' + name, {
    async: false,
    type: method,
    data: params
  }).success(function (data, textStatus, jqXHR) {
    callback(false, data);
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
  var base = dust.makeBase({
    localize: function(chunk, context, bodies, params) {
//      var locale = getLocale();
//      var localeText = locale.getText(params.key);
//      return chunk.write(localeText);
      
      return chunk.write(params.key);
    }
  });
  
  dust.render(templateName, base.push(json), function (err, text) {
    if (err) {
      alert(err);
    } else {
      callback(text);
    }
  });
}; 