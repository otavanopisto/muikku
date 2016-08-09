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
        var pageElement = this.options.pageElement;
        $(pageElement).on('beforeAssignmentSubmit', $.proxy(this._onBeforeAssignmentSubmit, this));
      },
      _destroy : function() {
        
      },
      _buildUi: function() {
        var meta = this.options.meta;
        
        var orientation = meta.orientation;
        var containerElement = orientation == 'horizontal' ? 'span' : 'div';
        
        var capitalize = meta.capitalize||false;

        this.element.addClass('muikku-sorter-field');
        this.element.attr('id', meta.name);
        if (capitalize) {
          this.element.addClass('capitalize');
        }
        
        var itemsContainer = $('<' + containerElement + '>').addClass('muikku-sorter-items-container');
        
        var items = meta.items;
        for (var i = 0; i < items.length; i++) {
          var item = $('<' + containerElement + '>').addClass('muikku-sorter-item');
          item.attr('data-item-id', items[i].id);
          item.text(items[i].name);
          itemsContainer.append(item);
        }
        var itemObjects = itemsContainer.children();
        while (itemObjects.length) {
          itemsContainer.append(itemObjects.splice(Math.floor(Math.random() * itemObjects.length), 1)[0]);
        }
        if (!this.isReadonly()) {
          $(itemsContainer).sortable({
            tolerance: 'pointer',
            update: $.proxy(function (event, ui) {
              $(this.element).trigger('change');
            }, this)
          });
        }
        this.element.append(itemsContainer);
      },
      isReadonly: function () {
        return this.element.attr('data-disabled') == 'true';
      },
      setReadonly: function(readonly) {
        var itemsContainer = this.element.find('.muikku-sorter-items-container');
        if (readonly) {
          this.element.attr('data-disabled', 'true');
          $(itemsContainer).sortable("destroy");
        } else {
          $(itemsContainer).sortable({
            tolerance: 'pointer',
            update: $.proxy(function (event, ui) {
              $(this.element).trigger("change");
            }, this)
          });
          this.element.removeAttr('data-disabled');
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
          var orientation = this.options.meta.orientation;
          var correctString = '';
          var delimiter = orientation == 'horizontal' ? ' ' : ', ';
          for (var i = 0; i < correctItems.length; i++) {
            var value = correctItems[i].name;
            if (i == 0 && orientation == 'horizontal') {
              value = value.charAt(0).toUpperCase() + value.slice(1);
            }
            correctString += i == 0 ? value : delimiter + value; 
          }
          exampleDetails.append($('<span>').addClass('muikku-field-example').text(correctString));
          $(this.element).after(exampleDetails);
        }
        return result;
      },
      canCheckAnswer: function() {
        return true;
      },
      _onBeforeAssignmentSubmit: function (event, data) {
        if (data.state == 'UNANSWERED') {
          $(this.element).trigger('change');
        }
      }
    });
   
}).call(this);
