(function() {
  
  var ResourceImpl = null;
  var ServiceImpl = null;
  var EventImpl = null;
  var RequestImpl = null;

  EventImpl = $.klass({
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
  
  ResourceImpl = $.klass({
    init: function (client) {
      this._client = client;
      this._clientRequest = null;
    },
    
    create: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = true;
      return request.create.apply(request, arguments);
    },

    read: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = false;
      return request.read.apply(request, arguments);
    },

    update: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = true;
      return request.update.apply(request, arguments);
    },

    del: function () {
      var request = new RequestImpl(this._client);
      this._client.opts.stringifyData = true;
      return request.del.apply(request, arguments);
    }
  });
  
  ServiceImpl = $.klass({
    init: function (service) {
      this._client = new $.RestClient(CONTEXTPATH + '/rest/' + service + '/', {
        cache: 30,
        cachableMethods: ["GET"],
        ajax: {
          async: false
        }
      });
    },
    add: function (resources) {
      var current = this;
      while (resources.length > 0) {
        var resource = resources.splice(0, 1)[0];
        if (!current[resource]) {
          current = current[resource] = new ResourceImpl(current._client.add(resource));
        } else {
          current = current[resource];
        }
      }
    }
  });
  
  AbstractRequest = $.klass({
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
      var processEvent = processEvents.pop();
      var _this = this;
      processEvent.event.getCallback()(processEvent.node, function () {
        if (processEvents.length > 0) {
          _this._handleEvents(processEvents, callback);
        } else {
          callback();
        }
      });
    }
  });
  
  BatchRequestImpl = $.klass(AbstractRequest, {
    init: function (operations) {
      this._super(arguments);
      
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
  
  ApiImpl = $.klass({
    init: function () {
      
    },
    add: function (name, service) {
      this[name] = service;
    },
    batch: function (operations) {
      return new BatchRequestImpl(operations);
    }
  });
  
  RequestImpl = $.klass(AbstractRequest, {
    init: function (client) {
      this._super(arguments);
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
        this.handleResponse(data, function (node) {
          callback(null, data);
        });
      }, this));
      
      this._clientRequest.fail(function (jqXHR, textStatus, errorThrown) {
        callback(textStatus, jqXHR);
      });
      
      return this;
    }
  });
  
  function getApi() {
    if (!window.muikkuApi) {
      window.muikkuApi = new ApiImpl();

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
    
      for (var i = 0, l = resources.length; i < l; i++) {
        var resource = resources[i];
        
        var serviceIndex = resource.indexOf('/');
        var serviceName = resource.substring(0, serviceIndex);
        var service = window.muikkuApi[serviceName];
        if (!service) {
          service = new ServiceImpl(serviceName);
          window.muikkuApi.add(serviceName, service);
        }
        
        service.add(resource.substring(serviceIndex + 1).split('/'));
      }
    }
    
    return window.muikkuApi;
  };
  
  window.mApi = getApi;
  
})(window);