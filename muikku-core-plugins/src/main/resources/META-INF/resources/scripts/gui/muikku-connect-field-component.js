(function() {
  'use strict';
  
   $.widget("custom.muikkuConnectField", {
      options : {
        connector:[ "Bezier", { curviness: 25 } ],
        connectorStyle : {  lineWidth: 3, strokeStyle:"#5b9ada" },
        endpoint: ["Dot", {radius:7}]
      },
      _create : function() {
        this._element = $('<div>')
          .addClass('muikku-connect-field')
          .append($('<div>').addClass('muikku-connect-field-terms'))
          .append($('<div>').addClass('muikku-connect-field-gap'))
          .append($('<div>').addClass('muikku-connect-field-counterparts'));
        
        this._taskInstance = jsPlumb.getInstance();
        
        this.element.find('.muikku-connect-field-term-cell').each($.proxy(function (index, term) {
          var fieldName = $(term).closest('tr').find('.muikku-connect-field-value').attr('name');
          
          var termElement = $('<div>')
            .addClass('muikku-connect-field-term')
            .attr('data-field-name', fieldName)
            .html($(term).html());
          this._element.find('.muikku-connect-field-terms').append(termElement);
        }, this));
        
        this.element.find('.muikku-connect-field-counterpart-cell').each($.proxy(function (index, counterpart) {
          var counterpartElement = $('<div>')
            .addClass('muikku-connect-field-counterpart')
            .attr('data-field-value', $(counterpart).data('muikku-connect-field-option-name'))
            .html($(counterpart).html());
          this._element.find('.muikku-connect-field-counterparts').append(counterpartElement);
        }, this));
        
        this.element
          .after(this._element)
          .hide();
        
        var width = Math.max(this._element.find('.muikku-connect-field-terms').width(), this._element.find('.muikku-connect-field-counterparts').width());
        
        this._element.find('.muikku-connect-field-terms').css({
          width: width + 'px'
        });
        
        this._element.find('.muikku-connect-field-counterparts').css({
          width: width + 'px'
        });
        
        this._element.find('.muikku-connect-field-term').each($.proxy(function (index, element) {
          this._taskInstance.addEndpoint(
            $(element), {
              connector: this.options.connector,
              endpoint: this.options.endpoint,
              connectorStyle: this.options.connectorStyle,
              isSource: true,
              isTarget: false,
              maxConnections: 1,    
              anchor:"Right"
            }
          );
        }, this));

        this._element.find('.muikku-connect-field-counterpart').each($.proxy(function (index, element) {
          this._taskInstance.addEndpoint(
            $(element), {
              connector: this.options.connector,
              endpoint: this.options.endpoint,
              connectorStyle: this.options.connectorStyle,
              isSource: false,
              isTarget: true,
              maxConnections: 1,    
              anchor:"Left"
            }
          );
        }, this));

        this.element.find('.muikku-connect-field-value').each($.proxy(function (index, valueField) {
          var name = $(valueField).attr('name');
          var val = $(valueField).val();
          
          this._element.append($('<input>')
            .attr('type', 'hidden')
            .attr('name', name)
            .val(val)  
          );
          
          if (val) {
            var term = this._element.find('.muikku-connect-field-term[data-field-name="' + name + '"]');
            var counterpart = this._element.find('.muikku-connect-field-counterpart[data-field-value="' + val + '"]');
            
            this._taskInstance.connect({
              source: term, 
              target: counterpart,
              anchors: ["Right", "Left" ],
              endpoint: this.options.endpoint,
              connector: this.options.connector,
              paintStyle: this.options.connectorStyle
            });
          }

        }, this));
        
        this.element.remove();

        this._taskInstance.bind("connection", $.proxy(this._onConnection, this));
        this._taskInstance.bind("connectionDetached", $.proxy(this._onConnectionDetached, this));
      },
      
      _onConnection: function (info) {
        this._element.find('input[name="' + $(info.source).data('field-name') + '"]').val($(info.target).data('field-value'));
      },
      
      _onConnectionDetached: function (info) {
        this._element.find('input[name="' + $(info.source).data('field-name') + '"]').val('');
      },
      
      _destroy : function() {
      }
    });
   
}).call(this);