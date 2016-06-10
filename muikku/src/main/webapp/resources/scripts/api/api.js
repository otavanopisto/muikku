(function() {
  
  var createClass = function () {
    var superClass = null;
    var definition = null;
    
    if (arguments.length == 1) {
      definition = arguments[0];
    } else if (arguments.length == 2) {
      var superClass = arguments[0];
      var definition = arguments[1];
    } else {
      throw new Error("Invalid number of arguments " + arguments.length);
    }
    
    if ((typeof definition.init) != 'function') {
      throw new Error("Class missing constructor");
    }
    
    var init = null;
    var properties = {};
    
    properties.constructor = {
      value: definition.init,
      enumerable: false
    };
    
    for (var funcName in definition) {
      if (funcName === 'init') {
        init = definition[funcName];
      } else {
        properties[funcName] = {
          value: definition[funcName]
        };
      }
    }
    
    var result = init;
    result.prototype = Object.create(superClass ? superClass.prototype : null, properties);
    
    return result;
  };
  
  var ResourceImpl = null;
  var ServiceImpl = null;
  var EventImpl = null;
  var RequestImpl = null;

  EventImpl = createClass({
    init: function (path, callback) {
      this._path = path; 
      this._callback = callback;
    },
    getPath: function () {
      return this._path;
    },
    getCallback: function () {
      return this._callback;
    }
  });
  
  ResourceImpl = createClass({
    init: function (service, client) {
      this._service = service;
      this._client = client;
      this._clientRequest = null;
    },
    
    create: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = true;
      try {
        return request.create.apply(request, arguments);
      } finally {
        this._service.cacheClear();
      }
    },

    read: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = false;
      return request.read.apply(request, arguments);
    },

    cacheClear: function () {
      this._service.cacheClear();
      return this;
    },

    update: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = true;
      try {
        return request.update.apply(request, arguments);
      } finally {
        this._service.cacheClear();
      }
    },

    del: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = true;
      try {
        return request.del.apply(request, arguments);
      } finally {
        this._service.cacheClear();
      }
    }
  });
  
  ServiceImpl = createClass({
    init: function (async, service) {
      this._client = new $.RestClient(CONTEXTPATH + '/rest/' + service + '/', {
        cache: 30,
        cachableMethods: ["GET"]
      });
      this._xhrs = [];
      // "temporary workaround": $.RestClient has a shared `async' object in options
      this._client.opts.ajax = {
        dataType: 'json', 
        async: async,
        traditional: true,
        contentType: 'application/json', // http://stackoverflow.com/a/17660503
        beforeSend: $.proxy(function (xhr, settings) {
          this._xhrs.push(xhr);
        }, this),
        complete: $.proxy(function (xhr, settings) {
          var pos = this._xhrs.indexOf(xhr);
          this._xhrs.splice(pos, 1);
        }, this)
      };
      
      var locale = window.getLocale ? getLocale() : null;
      if (locale) {
        this._client.opts.ajax.headers = {
          'Accept-Language': locale
        };
      }
    },
    add: function (resources) {
      var current = this;
      while (resources.length > 0) {
        var resource = resources.splice(0, 1)[0];
        if (!current[resource]) {
          current = current[resource] = new ResourceImpl(this, current._client.add(resource));
        } else {
          current = current[resource];
        }
      }
    },
    cacheClear: function () {
      this._client.cache.clear();
      return this;
    },
    abortAll: function () {
      for (var i=0; i<this._xhrs.length; i++) {
        this._xhrs[i].abort();
      }
      this._xhrs = [];
    }
   });
  
  AbstractRequest = createClass({
    init: function () {
      this._events = new Array();
    },
    
    getEvents: function () {
      return this._events;
    },

    on: function (path, func) {
      this._events.push(new EventImpl(path, func));
      return this;
    },
    
    _add: function (path, property, newProperty, resource, removeOriginalProperty, options) {
      return this.on(path, function (parent, callback) {
        if ($.isArray(parent)) {
          var callbacks = new Array();
          var elements = new Array();
          
          $.each(parent, function (index, element) {
            var idProperty = element[property];
            elements.push(element);
            var operation = options === undefined ? resource.read(idProperty) : resource.read(idProperty, options);
            callbacks.push($.proxy(operation.callback, operation));
          });

          async.series(callbacks, $.proxy(function(err, results) {
            if (!err) {
              for (var i = 0, l = results.length; i < l; i++) {
                var element = elements[i];
                if (removeOriginalProperty) {
                  delete element[property];
                }
                
                element[newProperty] = results[i];
              }

              callback();
            } else {
              callback(err);
            }
          }, this));
          
        } else {
          var idProperty = parent[property];
          var operation = options === undefined ? resource.read(idProperty) : resource.read(idProperty, options);
          operation.callback(function (err, result) {
            if (!err) {
              if (removeOriginalProperty) {
                delete parent[property];
              }
              
              parent[newProperty] = result;
              callback();
            } else {
              callback(err);
            }
          });
        }
      });
    },
    
    replace: function (path, property, newProperty, resource, options) {
      return this._add(path, property, newProperty, resource, true, options);
    },
    
    add: function (path, property, newProperty, resource, options) {
      return this._add(path, property, newProperty, resource, false, options);
    },
    
    handleResponse: function (data, callback) {
      var processEvents = new Array();
      var tree = new objectPath(data);
      
      for (var i = 0, l = this._events.length; i < l; i++) {
        var path = this._events[i].getPath();
        var node = tree.execute(path);
        if (node) {
          if ($.isArray(node)) {
            for (var j = 0, jl = node.length; j < jl; j++) {
              processEvents.push({
                node: node[j],
                event: this._events[i]
              });
            }
          } else {
            processEvents.push({
              node: node,
              event: this._events[i]
            });
          }
        }
      }
      
      if (processEvents.length > 0) {
        this._handleEvents(processEvents, callback);
      } else {
        callback(); 
      }
    },
    
    _handleEvents: function (processEvents, callback) {
      var eventCalls = $.map(processEvents, function (processEvent) {
        return function (callCallback) {
          var eventCallback = processEvent.event.getCallback();
          eventCallback(processEvent.node, function () {
            callCallback();
          });
        };
      });
      
      async.parallel(eventCalls, function (err, results) {
        callback();
      });
    }
  });
  
  BatchRequestImpl = createClass(AbstractRequest, {
    init: function (operations) {
      AbstractRequest.call(this);
      this._operations = operations;
      this._callback = null;
    },
    callback: function (callback) {
      var callbacks = new Array();
      var names = new Array();

      $.each(this._operations, function (name, operation) {
        names.push(name);
        callbacks.push($.proxy(operation.callback, operation));
      });
      
      async.series(callbacks, $.proxy(function(err, results){
        if (!err) {
          if (names.length != results.length) {
            throw new Error("names.length != results.length");
          }
          
          var result = new Object();
          for (var i = 0, l = names.length; i < l; i++) {
            result[names[i]] = results[i]; 
          }
          
          callback(null, result);
        } else {
          callback(err, null);
        }
        
      }, this));

      return this;
    }
  });
  
  ApiImpl = createClass({
    init: function () {
      
    },
    add: function (name, service) {
      this[name] = service;
    },
    batch: function (operations) {
      return new BatchRequestImpl(operations);
    },
    abortAll: function () {
      $.each(this, function (name, service) {
        try {
          if (service && service.abortAll) {
            service.abortAll();
          }
        } catch (e) {
        }
      });
    }
  });
  
  RequestImpl = createClass(AbstractRequest, {
    init: function (client) {
      AbstractRequest.call(this);
      this._client = client;
    },
    
    create: function (data) {
      this._clientRequest = this._client.create.apply(window, arguments);
      return this;
    }, 
    
    read: function () {
      this._clientRequest = this._client.read.apply(window, arguments);
      return this;
    },

    update: function () {
      this._clientRequest = this._client.update.apply(window, arguments);
      return this;
    },
    
    del: function () {
      this._clientRequest = this._client.del.apply(window, arguments);
      return this;
    },
    
    callback: function (callback) {
      this._clientRequest.done($.proxy(function (data, textStatus, jqXHR) {
        if ((textStatus === "abort") || (jqXHR.status === 0)) {
          return;
        }

        this.handleResponse(data, function (node) {
          callback(null, data);
        });
      }, this));
      
      this._clientRequest.fail(function (jqXHR, textStatus, errorThrown) {
        if ((textStatus === "abort") || (jqXHR.status === 0)) {
          return;
        }
        
        callback(textStatus ? jqXHR.responseText || jqXHR.statusText || textStatus : null, jqXHR);
      });
      
      return this;
    }
  });
  
  function getResources() {
    var resources = new Array();
    
    for (var i = 0, l = META_RESOURCES.length; i < l; i++) {
      var resource = META_RESOURCES[i].replace(/\/\{[a-zA-Z0-9_.]*\}/g, '');
      if (resource[0] == '/') {
        resource = resource.substring(1);
      }
      
      if (resource[resource.length - 1] == '/') {
        resource = resource.substring(0, resource.length - 1);
      }
      
      if (resources.indexOf(resource) == -1) {
        resources.push(resource);
      }
    }
    
    return resources;
  }
  
  $(window).unload(function () {
    if (window.muikkuApi) {
      window.muikkuApi.abortAll();
    }
    
    if (window.asyncMuikkuApi) {
      window.asyncMuikkuApi.abortAll();
    }
  });
  
  function getApi(options) {
    options = options || { async: true };
    var resources;
    var resource;
    var serviceIndex;
    var serviceName;
    var service;

    if (!window.muikkuApi) {
      resources = getResources();
      window.muikkuApi = new ApiImpl();
    
      for (var i = 0, l = resources.length; i < l; i++) {
        resource = resources[i];
        
        serviceIndex = resource.indexOf('/');
        serviceName = resource.substring(0, serviceIndex);
        service = window.muikkuApi[serviceName];
        if (!service) {
          service = new ServiceImpl(false, serviceName);
          window.muikkuApi.add(serviceName, service);
        }
        
        service.add(resource.substring(serviceIndex + 1).split('/'));
      }
    }

    if (!window.asyncMuikkuApi) {
      resources = getResources();
      window.asyncMuikkuApi = new ApiImpl();
    
      for (var i = 0, l = resources.length; i < l; i++) {
        resource = resources[i];
        
        serviceIndex = resource.indexOf('/');
        serviceName = resource.substring(0, serviceIndex);
        service = window.asyncMuikkuApi[serviceName];
        if (!service) {
          service = new ServiceImpl(true, serviceName);
          window.asyncMuikkuApi.add(serviceName, service);
        }
        
        service.add(resource.substring(serviceIndex + 1).split('/'));
      }
    }
    
    if (options.async) {
      return window.asyncMuikkuApi;
    } else {
      return window.muikkuApi;
    }
  };
  
  window.mApi = getApi;
  
})(window);