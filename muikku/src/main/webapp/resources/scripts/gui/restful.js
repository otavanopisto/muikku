RESTfulImpl = $.klass({
  init: function () {
    this._pathParamPattern = /(\{[a-zA-Z0-9]*\})/g;
  },
  doGet: function (endPoint, options) {
    return this._doRequest(endPoint, "GET", options);
  },
  doPost: function (endPoint, options) {
    return this._doRequest(endPoint, "POST", options);
  },
  doPut: function (endPoint, options) {
    return this._doRequest(endPoint, "PUT", options);
  },
  doDelete: function (endPoint, options) {
    return this._doRequest(endPoint, "DELETE", options);
  },
  doPatch: function (endPoint, options) {
    return this._doRequest(endPoint, "PATCH", options);
  },
  /**
  doPostForm : function(form) {
    if (form.fire("rest:beforeFormPost").stopped !== true) {
      this._doFormRequest(form, 'POST', {
        onSuccess: function () {
          form.fire("rest:afterFormPost", {
          });
        }
      });
    }
  },
  doGetForm : function(form) {
    if (form.fire("rest:beforeFormGet").stopped !== true) {
      this._doFormRequest(form, 'GET', {
        onSuccess: function () {
          form.fire("rest:afterFormGet", {
          });
        }
      });
    }
  },
  postEventListener : function(event) {
    Event.stop(event);

    var element = Event.element(event);
    var form = element.tagName == 'FORM' ? element : element.form;
    if (!form) {
      form = element.up('form');
    }
    
    if (form) {
      this.doPostForm(form);
    }
  },
  getEventListener : function(event) {
    Event.stop(event);

    var element = Event.element(event);
    var form = element.tagName == 'FORM' ? element : element.form;
    if (!form) {
      form = element.up('form');
    }
    
    if (form) {
      this.doGetForm(form);
    }
  },
  **/
  _doRequest: function(endPoint, method, options) {
    var pathParams = this._getPathParams(endPoint);
    var parameters = (options && options.parameters)||{};
        
    // Process parameters
    parameters = this._processParameters(parameters);
    
    // Replace path parameters in path with values
    var path = this._replacePathParams(endPoint, parameters);

    // Remove path parametrs and undefined parameters from the request
    for (var name in parameters) {
      preserve = false;
      
      if ((typeof name) == 'string') {
        var value = parameters[name];
        if ((value  === undefined)||(value === null)||(value === '')) {
          preserve = false;
        } else {
          if (pathParams[name]) {
            preserve = false;
          } else {
            if (pathParams[name]) {
              preserve = false;
            } else {
              preserve = true;
            }
          }
        } 
        
        if (preserve == false) {
          delete parameters[name];
        }
      }
     
      return this._sendRequest(path, method, parameters, options);
    }
  },
  _doFormRequest: function(form, method, options) {
    var endPoint = this._getFormEndPoint(form);
    var waitMessage = this._getFormWaitMessage(form);
    var pathParams = this._getPathParams(endPoint);
    if (waitMessage) {
      options.waitMessage = waitMessage;
    }
    
    var formParams = this._serializeForm(form, pathParams);
    var processedEndPoint = this._replaceFormPathParams(form, endPoint, pathParams);
    var eventName = null;
    switch (method) {
      case 'GET':
        eventName = "rest:formGet";
      break;
      case 'POST':
        eventName = "rest:formPost";
      break;
      case 'PUT':
        eventName = "rest:formPut";
      break;
      case 'DELETE':
        eventName = "rest:formDelete";
      break;
      case 'PATCH':
        eventName = "rest:formPatch";
      break;
    }
    
    var eventData = {
      endPoint: endPoint,
      processedEndPoint: processedEndPoint,
      formParams: formParams,
      options: options
    };
    
    if (form.fire(eventName, eventData).stopped !== true) {
      this._sendRequest(processedEndPoint, method, formParams, options);
    }
  },
  _sendRequest: function (url, method, params, options) {
    // TODO: implement load message
    
    return $.ajax(url, {
      async: false,
      traditional: true,
      dataType: 'json',
      accepts: {
        'json' : 'application/json'
      },
      type: method,
      data: params
    });
  },
  _sendDataRequest: function (url, method, data, options) {
    // TODO: implement load message
    
    return $.ajax(url, {
      async: false,
      dataType: 'json',
      accepts: {
        'json' : 'application/json'
      },
      type: method,
      data: data
    });
  },
  _getPathParams: function (endPoint) {
    var result = new Array();
    
    var pathParams = endPoint.match(this._pathParamPattern);
    for (var i = 0, l = pathParams ? pathParams.length : 0; i < l; i++) {
      var param = pathParams[i];
      result.push(param.substring(1, param.length - 1));
    }
    
    return result;
  },
  _replacePathParams: function (endPoint, pathParams) {
    for (var key in pathParams) {
      if ((typeof key) == 'string') {
        endPoint = endPoint.replace('{' + key + '}', pathParams[key]);
      } 
    }
    
    return endPoint;
  },
  _processParameters: function (parameters) {
    var result = {};
    
    for (var name in parameters) {
      var value = parameters[name];
      
      if (value instanceof Date) {
        result[name] = value.getTime();
      } else {
        result[name] = value;
      }
    } 
    
    return result;
  }
  /**
  _serializeForm: function (form, pathParams) {
    var elements = Form.getElements(form);

    var excludeElements = new Array();
    if (pathParams) {
      for (var i = 0, l = pathParams.length; i < l; i++) {
        excludeElements.push(this._getFormElementName(form, pathParams[i]));
      }
    }
    
    excludeElements.push('javax.faces.ViewState');
    excludeElements.push(this._getFormElementName(form, 'restEndPoint'));
    if (form.id) {
      excludeElements.push(form.id);
    }
    
    for (var l = elements.length - 1; l >= 0; l--) {
      if (excludeElements.indexOf(elements[l].name) > -1) {
        elements.splice(l, 1);
      }
    }
    
    return elements.inject(new Hash(), function(result, element) {
      if (!element.disabled && element.name) {
        if (element.type != 'file' && element.type != 'submit') {
          var value = $(element).getValue();
          var name = element.name.substring(form.id ? form.id.length + 1 : 0);
          if (value !== '')
            result.set(name, value||'');
        }
      }
      
      return result;
    });
  },
  _replaceFormPathParams: function (form, endPoint, pathParams) {
    for (var i = 0, l = pathParams ? pathParams.length : 0; i < l; i++) {
      var param = pathParams[i];
      endPoint = endPoint.replace('{' + param + '}', this._getFormElementValue(form, param));
    }
    
    return endPoint;
  },
  _getFormEndPoint: function (form) {
    var element = this._getFormElement(form, 'restEndPoint');
    if (element && element.value) {
      var endPoint = element.value;
      return endPoint;
    } else {
      throw new Error("Could not find restEndPoint element from from!");
    }
  },
  _getFormWaitMessage: function (form) {
    var element = this._getFormElement(form, 'restWaitMessage');
    if (element && element.value) {
      var waitMessage = element.value;
      return waitMessage;
    }
    
    return null;
  },
  _getFormElementName: function (form, elementName) {
    return (form.id ? form.id + ':' : '') + elementName;
  },
  _getFormElement: function (form, elementName) {
    return form[this._getFormElementName(form, elementName)];
  },
  _getFormElementValue: function (form, elementName) {
    var element = this._getFormElement(form, elementName);
    if (element)
      return element.value;
    else
      return '';
  }
  **/
});

window.RESTful = new RESTfulImpl();
