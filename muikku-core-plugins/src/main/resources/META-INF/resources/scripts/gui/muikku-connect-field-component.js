(function() {
  'use strict';
  
   $.widget("custom.muikkuConnectField", {
      options : {
        readonly: false
      },
      _create : function() {
        var _this = this;
        this._element = $('<div>')
          .addClass("muikku-connect-field")
          .append($('<div>').addClass('muikku-connect-field-terms'))
          .append($('<div>').addClass('muikku-connect-field-gap'))
          .append($('<div>').addClass('muikku-connect-field-counterparts').sortable({
            placeholder: "ui-sortable-placeholder",
            update: function(event, ui){
              var counterPartElement = ui.item;
              var elementIndex = counterPartElement.parent().find('.muikku-connect-field-counterpart').index(counterPartElement);
              var termElement = _this._element.find( '.muikku-connect-field-term:eq( '+elementIndex+' )' );
              counterPartElement.addClass('muikku-connect-field-edited');
              termElement.addClass('muikku-connect-field-edited');
              _this._createConnection(termElement, counterPartElement);
            }
          }).disableSelection())
          .muikkuField({
            materialId: this.options.materialId,
            embedId: this.options.embedId,
            fieldName: this.options.fieldName,
            readonly: this.options.readonly,
            answer: $.proxy(function (val) {
              if (val !== undefined) {
                this.pairs($.parseJSON(val));
              } else {
                return JSON.stringify(this.pairs());
              }
            }, this),
            hasDisplayableAnswers: $.proxy(function() {
              return this.options.meta.connections.length > 0;
            }, this), 
            canCheckAnswer: $.proxy(function() {
              var meta = this.options.meta;
              return meta.connections.length > 0;
            }, this),
            isCorrectAnswer: $.proxy(function() {
              var meta = this.options.meta;
              var pairs = this.pairs();
              var corrects = {};
              
              for (var i = 0, l = meta.connections.length; i < l; i++) {
                corrects[meta.connections[i].field] = meta.connections[i].counterpart;
              }
              
              for (var term in pairs) {
                if (corrects[term] != pairs[term]) {
                  return false;
                }
              }

              return true; 
            }, this),
            getCorrectAnswers: $.proxy(function() {
              var result = [];
              var meta = this.options.meta;
              for (var i = 0, l = meta.connections.length; i < l; i++) {
                result.push(meta.connections[i].field + ' = ' + meta.connections[i].counterpart);
              }
              return result;
            }, this)
          });
        
        if (this.options.readonly) {
          this._element.css('position', 'relative');
          
          $('<div>')
            .css({
              'position': 'absolute',
              'top': 0,
              'bottom': 0,
              'left': 0,
              'right': 0,
              'opacity': 0,
              'z-index': 9999
            })
            .click(function (event) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            })
            .mousemove(function (event) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            })
            .appendTo(this._element);
        }
        
        this.element.find('.muikku-connect-field-term-cell').each($.proxy(function (index, term) {
          var fieldName = $(term).closest('tr').find('.muikku-connect-field-value').attr('name');
           
          var termElement = $('<div>')
            .addClass('muikku-connect-field-term')
            .attr('data-field-name', fieldName)
            .html($(term).html());
          
          termElement.click(function(e){
            _this.options.meta.selectedTerm = termElement;
            _this._element.find($('.muikku-connect-field-term')).removeClass('muikku-connect-field-term-selected');
            $(termElement).addClass('muikku-connect-field-term-selected');
          });
          
          this._element.find('.muikku-connect-field-terms').append(termElement);
        }, this));
        
        this.element.find('.muikku-connect-field-counterpart-cell').each($.proxy(function (index, counterpart) {
          var counterpartElement = $('<div>')
            .addClass('muikku-connect-field-counterpart')
            .attr('data-field-value', $(counterpart).data('muikku-connect-field-option-name'))
            .html($(counterpart).html());
          
          counterpartElement.click(function(e){
            if(typeof(_this.options.meta.selectedTerm) !== 'undefined' && _this.options.meta.selectedTerm !== null){
              _this._swapElements(_this.options.meta.selectedTerm, $(this));
            }
          });
          
          this._element.find('.muikku-connect-field-counterparts').append(counterpartElement);
          
        }, this));
        
        this.element
          .after(this._element)
          .hide();

        this.element.find('.muikku-connect-field-value').each($.proxy(function (index, valueField) {
          var name = $(valueField).attr('name');
          var val = $(valueField).val();
          
          this._element.append($('<input>')
            .attr('type', 'hidden')
            .attr('name', name)
            .addClass('muikku-connect-field-input')
            .val(val)  
          );
          
          if (val) {
            var term = this._element.find('.muikku-connect-field-term[data-field-name="' + name + '"]');
            var counterpart = this._element.find('.muikku-connect-field-counterpart[data-field-value="' + val + '"]');
            this._createConnection(term, counterpart);
          }

        }, this));
        
        this.element
          .addClass('muikku-connect-field')
          .hide();
        
      },
      
      pairs: function(val) {
        if (val !== undefined) {
          
          $(this._element).find('.muikku-connect-field-input').val('');
          
          $.each(val || {}, $.proxy(function (name, value) {
            $(this._element).find('.muikku-connect-field-input[name="' + name + '"]').val(value);
            
            if (value) {
              var term = this._element.find('.muikku-connect-field-term[data-field-name="' + name + '"]');
              var counterpart = this._element.find('.muikku-connect-field-counterpart[data-field-value="' + value + '"]');
              
              this._createConnection(term, counterpart);
            }
          }, this));
          
        } else {
          var pairs = {};
          
          $(this._element).find('.muikku-connect-field-input').each(function (index, input) {
            pairs[$(input).attr('name')] = $(input).val();
          });
          
          return pairs;
        }
      },
      _createConnection: function (term, counterpart) {
        var termInput = this._element.find('input[name="' + $(term).data('field-name') + '"]');
        if(typeof(termInput.val()) !== 'undefined' && termInput.val() !== ''){
          this._detachConnection(term); 
        }
        termInput.val($(counterpart).data('field-value'));
        this._element.trigger("change");
      },
      
      _detachConnection: function (term) {
        this._element.find('input[name="' + $(term).data('field-name') + '"]').val('');
        this._element.trigger("change");
      },
      _swapElements: function(term, counterpart){
        var elementIndex = $(term).parent().find('.muikku-connect-field-term').index(term);
        var counterPartIndex = $(counterpart).parent().find('.muikku-connect-field-counterpart').index(counterpart);
        if(elementIndex > counterPartIndex){
          this._element.find( '.muikku-connect-field-counterpart:eq( '+elementIndex+' )' ).after(counterpart);
          term.addClass('muikku-connect-field-edited');
          counterpart.addClass('muikku-connect-field-edited');
        }else if(elementIndex < counterPartIndex){
          this._element.find( '.muikku-connect-field-counterpart:eq( '+elementIndex+' )' ).before(counterpart);
          term.addClass('muikku-connect-field-edited');
          counterpart.addClass('muikku-connect-field-edited');
        }
        this._createConnection(term, counterpart);
        this._element.find('.muikku-connect-field-term').removeClass('muikku-connect-field-term-selected');
        this.options.meta.selectedTerm = null;
      },
      _destroy : function() {
      }
    });
   
}).call(this);
