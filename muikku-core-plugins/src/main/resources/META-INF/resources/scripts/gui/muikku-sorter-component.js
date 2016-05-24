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
        if (meta.title) {
          itemsContainer.append($('<div>').addClass('muikku-sorter-items-title').append(meta.title));
        }
        var itemsData = $('<div>').addClass('muikku-sorter-items-data');
        itemsContainer.append(itemsData);
        
        var items = meta.items;
        for (var i = 0; i < items.length; i++) {
          var item = $('<div>').addClass('muikku-sorter-item');
          item.attr('data-item-id', items[i].id);
          item.text(items[i].name);
          itemsData.append(item);
        }
        var itemObjects = itemsData.children();
        while (itemObjects.length) {
          itemsData.append(itemObjects.splice(Math.floor(Math.random() * itemObjects.length), 1)[0]);
        }
        $(itemsData).sortable({
          update: $.proxy(function (event, ui) {
            $(this.element).trigger("change");
          }, this)
        });
        this.element.append(itemsContainer);
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
          items.detach().appendTo($(this.element).find('.muikku-sorter-items-data')[0]);
        }
      },
      hasDisplayableAnswers: function() {
        return true;
      },
      checksOwnAnswer: function() {
        return true;
      },
      checkAnswer: function(showCorrectAnswers) {
        var result = {
          'correctAnswers': 0,
          'wrongAnswers': 0
        }
        var userAnswer = $.parseJSON(this.answer());
        var correctItems = this.options.meta.items;
        var itemsData = $(this.element).find('.muikku-sorter-items-data')[0];
        for (var i = 0; i < correctItems.length; i++) {
          var correctId = correctItems[i].id;
          var userId = userAnswer[i];
          var itemElement = $(this.element).find('.muikku-sorter-item[data-item-id="' + userId + '"]')[0];
          if (correctId == userId) {
            result.correctAnswers++;
            if (showCorrectAnswers) {
              $(itemElement).addClass('muikku-field-correct-answer');
            }
          }
          else {
            result.wrongAnswers++;
            if (showCorrectAnswers) {
              $(itemElement).addClass('muikku-field-incorrect-answer');
            }
          }
        }
        if (!showCorrectAnswers) {
          if (result.wrongAnswers == 0) {
            $(itemsData).addClass('muikku-field-correct-answer');
          }
          else if (result.correctAnswers == 0) {
            $(itemsData).addClass('muikku-field-incorrect-answer');
          }
          else {
            $(itemsData).addClass('muikku-field-semi-correct-answer');
          }
        }
        return result;
      },
      canCheckAnswer: function() {
        return true;
      }
    });
   
}).call(this);
