(function() {
  
  /* global MathJax */
  
  'use strict';
  
   $.widget("custom.muikkuConnectField", {
      options : {
        readonly: false
      },
      _create : function() {
        this._initialized = false;
        
        this._element = $('<div>')
          .addClass("muikku-connect-field")
          .append($('<div>').addClass('muikku-connect-field-terms'))
          .append($('<div>').addClass('muikku-connect-field-gap'))
          .append($('<div>').addClass('muikku-connect-field-counterparts'))
          .muikkuField({
            materialId: this.options.materialId,
            embedId: this.options.embedId,
            fieldName: this.options.fieldName,
            readonly: this.options.readonly,
            answer: $.proxy(function (val) {
              if (val !== undefined) {
                this._element.find('.muikku-connect-field-correct-number').remove();
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
              
              var isCorrect = true;
              for (var term in pairs) {
                var termElement = this._element.find('.muikku-connect-field-term[data-field-name="' + term + '"]');
                var counterPartElement = this._element.find('.muikku-connect-field-counterpart[data-field-value="' + pairs[term] + '"]');
                termElement.removeClass('muikku-connect-field-wrong-answer muikku-connect-field-correct-answer');
                counterPartElement.removeClass('muikku-connect-field-wrong-answer muikku-connect-field-correct-answer');
                if (this.getCounterpartText(corrects[term]) != this.getCounterpartText(pairs[term])) {
                  termElement.addClass('muikku-connect-field-wrong-answer');
                  counterPartElement.addClass('muikku-connect-field-wrong-answer');
                  isCorrect = false;
                }else{
                  termElement.addClass('muikku-connect-field-correct-answer');
                  counterPartElement.addClass('muikku-connect-field-correct-answer');
                }
              }
              return isCorrect;

            }, this),
            getCorrectAnswers: $.proxy(function() {
              var result = [];
              var meta = this.options.meta;
              for (var i = 0, l = meta.connections.length; i < l; i++) {
                var counterpart = this._element.find('.muikku-connect-field-counterpart[data-field-value="' + meta.connections[i].counterpart + '"]');
                var termNumber = this._element.find('.muikku-connect-field-term[data-field-name="' + meta.connections[i].field + '"]').attr('data-field-number');
                counterpart.before($('<span>')
                    .text(termNumber)
                    .addClass('muikku-connect-field-correct-number'));
              }
              return result;
            }, this),
            hideCorrectAnswers: $.proxy(function() {
              this._element.find(".muikku-connect-field-correct-number").remove();
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
            .attr('data-title', $(term).attr('title'))
            .attr('data-field-name', fieldName)
            .attr('data-field-number', index + 1)
            .html($(term).html());
          
          termElement.click($.proxy(function(e){
            this.options.meta.selectedTerm = termElement;
            this._element.find($('.muikku-connect-field-term')).removeClass('muikku-connect-field-term-selected');
            $(termElement).addClass('muikku-connect-field-term-selected');
          }, this));

          if (($(term).attr('title')||"").length > 50) {
            termElement.mouseenter($.proxy(function(e){  
              var childElement = $('<div>')
                .addClass('term-full-text')
                .html($(term).attr('title'));
              termElement.html("").append(childElement);
            }, this));
            
            termElement.mouseleave($.proxy(function(e){
              termElement
                .empty()
                .html($(term).html());
            }, this));
          }
          
          this._element.find('.muikku-connect-field-terms')
            .append($('<span>').text(index + 1).addClass('muikku-connect-field-number'))
            .append(termElement);
          
        }, this));
        
        this.element.find('.muikku-connect-field-counterpart-cell').each($.proxy(function (index, counterpart) {
          
          var counterpartElement = $('<div>')
            .addClass('muikku-connect-field-counterpart')
            .attr('data-title', $(counterpart).attr('title'))
            .attr('data-field-value', $(counterpart).data('muikku-connect-field-option-name'))
            .html($(counterpart).html())
            .draggable({
              containment: 'parent',
              revert: 'invalid',
              zIndex: 100,
              start: $.proxy(function(event) {
                this.draggedElement = event.target;
              }, this)
            })
            .droppable({
              accept: '.muikku-connect-field-counterpart',
              drop: $.proxy(function(event) {
                // Source and target counterparts
                var sourceElement = this.draggedElement;
                var targetElement = event.target;
                // Mark source term and target counterpart as unedited (that connection is not intended) 
                this._element.find('.muikku-connect-field-term:eq( '+ $(sourceElement).index() +' )' ).removeClass('muikku-connect-field-edited');
                $(targetElement).removeClass('muikku-connect-field-edited');
                // Switch placement of source and target counterparts
                var counterpartContainer = sourceElement.parentNode;
                var sourceSibling = sourceElement.nextSibling === targetElement ? sourceElement : sourceElement.nextSibling;
                counterpartContainer.insertBefore(sourceElement, targetElement);
                counterpartContainer.insertBefore(targetElement, sourceSibling);
                // Reset the relative position of the dragged source counterpart
                $(sourceElement).css("left", 0);
                $(sourceElement).css("top", 0);
                // Mark the target term and dragged counterpart as edited (intended connection)
                this._element.find('.muikku-connect-field-term:eq( '+ $(sourceElement).index() +' )' ).addClass('muikku-connect-field-edited');
                $(sourceElement).addClass('muikku-connect-field-edited');
                // Value upkeeping
                this._updateValues();
              }, this)
            });
          
          var counterPartClickHandler = $.proxy(function(e){
            if(typeof(this.options.meta.selectedTerm) !== 'undefined' && this.options.meta.selectedTerm !== null){
              this._swapElements(this.options.meta.selectedTerm, $(e.target).closest('.muikku-connect-field-counterpart'));
              counterpartElement
                .removeClass('counterpart-full-text')
                .html($(counterpart).html());
            }
          }, this);
          counterpartElement.click(counterPartClickHandler);
          
          if (($(counterpart).attr('title')||"").length > 50) {
            $(counterpartElement).on('mouseenter', function(e) {
              var childElement = $('<div>')
                .addClass('counterpart-full-text')
                .html($(counterpart).attr('title'));
              childElement.click(counterPartClickHandler);
              counterpartElement.html("").append(childElement);
            });
            
            $(counterpartElement).on('mouseleave', function(e) {
              counterpartElement
                .empty()
                .html($(counterpart).html());
            });
          }

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
            this._updateValues();
          }

        }, this));
        
        this.element
          .addClass('muikku-connect-field')
          .hide();
        
        this._initialized = true;
      },
      
      getCounterpartText: function(counterpart) {
        var meta = this.options.meta;
        for (var i = 0, l = meta.counterparts.length; i < l; i++) {
          if (meta.counterparts[i].name == counterpart) {
            return meta.counterparts[i].text;
          }
        }
      },

      pairs: function(val) {
        if (val !== undefined) {
          var currentPairs = this.pairs();
          $.each(val || {}, $.proxy(function (name, value) {
            if(currentPairs[name] != value){
              var term = this._element.find('.muikku-connect-field-term[data-field-name="' + name + '"]');
              var counterpart = this._element.find('.muikku-connect-field-counterpart[data-field-value="' + value + '"]');
              $(this._element).find('.muikku-connect-field-input[name="' + name + '"]').val(value);
              this._swapElements(term, counterpart);
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
      _updateValues: function () {
        this._element.find('.muikku-connect-field-term').each($.proxy(function(index, term){
          var termInput = this._element.find('input[name="' + $(term).attr('data-field-name') + '"]');
          var counterpart = this._element.find( '.muikku-connect-field-counterpart:eq( '+index+' )' );
          termInput.val($(counterpart).attr('data-field-value'));
        },this));
        
        if (this._initialized) {
          this._element.trigger("change");
        }
      },
      _swapElements: function(term, counterpart){
        
        //Remove correct answers when elements are swapped
        $(counterpart).parent().find(".muikku-connect-field-correct-number").remove();
        
        var termIndex = $(term).parent().find('.muikku-connect-field-term').index(term);
        var counterPartIndex = $(counterpart).parent().find('.muikku-connect-field-counterpart').index(counterpart);
        var occupyingElement = this._element.find( '.muikku-connect-field-counterpart:eq( '+termIndex+' )' );
        occupyingElement.removeClass('muikku-connect-field-edited');
        this._element.find( '.muikku-connect-field-term:eq( '+counterPartIndex+' )' ).removeClass('muikku-connect-field-edited');
        if(termIndex > counterPartIndex){
          counterpart.after(occupyingElement);
          this._element.find( '.muikku-connect-field-counterpart:eq( '+termIndex+' )' ).after(counterpart);
          $(term).addClass('muikku-connect-field-edited');
          $(counterpart).addClass('muikku-connect-field-edited');
        }else if(termIndex < counterPartIndex){
          counterpart.before(occupyingElement);
          this._element.find( '.muikku-connect-field-counterpart:eq( '+termIndex+' )' ).before(counterpart);
          $(term).addClass('muikku-connect-field-edited');
          $(counterpart).addClass('muikku-connect-field-edited');
        }else{
          $(term).addClass('muikku-connect-field-edited');
          $(counterpart).addClass('muikku-connect-field-edited');
        }
        this._updateValues();
        this._element.find('.muikku-connect-field-term-selected').removeClass('muikku-connect-field-term-selected');
        this.options.meta.selectedTerm = null;
      },
      _destroy : function() {
      }
    });
   
}).call(this);
