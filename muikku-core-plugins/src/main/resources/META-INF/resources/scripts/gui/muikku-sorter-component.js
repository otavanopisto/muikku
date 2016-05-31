(function() {
  'use strict';
  
   $.widget("custom.muikkuSorterField", {
      options : {
      },
      _create : function() {
        var methods = {};
        _.each($.custom.muikkuField['_proto'].options, $.proxy(function (value, key) {
          if ((!_.startsWith(key, '_')) && $.isFunction(value)) {
            if (this[key]) {
              methods[key] = $.proxy(this[key], this);
            }
          }
        }, this));
        this.element.muikkuField($.extend(this.options, methods));
        this._buildUi();
      },
      _destroy : function() {
        
      },
      _buildUi: function() {
        var meta = this.options.meta;

        this.element.addClass('muikku-sorter-field');
        this.element.attr('id', meta.name);
        
        var itemsContainer = $('<div>').addClass('muikku-sorter-items-container');
        
        var items = meta.items;
        for (var i = 0; i < items.length; i++) {
          var item = $('<div>').addClass('muikku-sorter-item');
          item.attr('data-item-id', items[i].id);
          item.text(items[i].name);
          itemsContainer.append(item);
        }
        var itemObjects = itemsContainer.children();
        while (itemObjects.length) {
          itemsContainer.append(itemObjects.splice(Math.floor(Math.random() * itemObjects.length), 1)[0]);
        }
        $(itemsContainer).sortable({
          update: $.proxy(function (event, ui) {
            $(this.element).trigger("change");
          }, this)
        });
        this.element.append(itemsContainer);
      },
      setReadonly: function(readonly) {
        var itemsContainer = this.element.find('.muikku-sorter-items-container');
        if (readonly) {
          $(itemsContainer).sortable("destroy"); //call widget-function destroy
        } else {
          $(itemsContainer).sortable({
            update: $.proxy(function (event, ui) {
              $(this.element).trigger("change");
            }, this)
          });
        } 
      },
      answer: function(val) {
        if (val === undefined) {
          var answer = [];
          var items = $(this.element).find('.muikku-sorter-item');
          for (var i = 0; i < items.length; i++) {
            answer.push($(items[i]).attr('data-item-id'));
          }
          return JSON.stringify(answer);
        }
        else {
          var previousObject = null;
          var answer = $.parseJSON(val);
          var items = $(this.element).find('.muikku-sorter-item');
          items.sort(function(a, b) {
            return answer.indexOf($(a).attr('data-item-id')) - answer.indexOf($(b).attr('data-item-id'));
          });
          items.detach().appendTo($(this.element).find('.muikku-sorter-items-container')[0]);
        }
      },
      hasDisplayableAnswers: function() {
        return true;
      },
      checksOwnAnswer: function() {
        return true;
      },
      checkAnswer: function(showCorrectAnswers) {
        $(this.element).find('.muikku-field-examples').remove();
        var result = {
          'correctAnswers': 0,
          'wrongAnswers': 0
        }
        var userAnswer = $.parseJSON(this.answer());
        var correctItems = this.options.meta.items;
        var itemsContainer = $(this.element).find('.muikku-sorter-items-container')[0];
        for (var i = 0; i < correctItems.length; i++) {
          var correctId = correctItems[i].id;
          var userId = userAnswer[i];
          var itemElement = $(this.element).find('.muikku-sorter-item[data-item-id="' + userId + '"]')[0];
          if (correctId == userId) {
            result.correctAnswers++;
            $(itemElement).addClass('muikku-field-correct-answer');
          }
          else {
            result.wrongAnswers++;
            $(itemElement).addClass('muikku-field-incorrect-answer');
          }
        }
        if (showCorrectAnswers) {
          var exampleDetails = $('<span>').addClass('muikku-field-examples').attr('data-for-field', $(this.element).attr('name'));
          exampleDetails.append( 
            $('<span>').addClass('muikku-field-examples-title').text(getLocaleText('plugin.workspace.assigment.checkAnswers.correctSummary.title'))
          );
          var correctString = '';
          for (var i = 0; i < correctItems.length; i++) {
            correctString += i == 0 ? correctItems[i].name : ', ' + correctItems[i].name; 
          }
          exampleDetails.append($('<span>').addClass('muikku-field-example').text(correctString));
          $(this.element).after(exampleDetails);
        }
        return result;
      },
      canCheckAnswer: function() {
        return true;
      }
    });
   
}).call(this);
