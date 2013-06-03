$.widget("custom.seekerautocomplete", $.ui.autocomplete, {
  _renderMenu: function(ul, items) {
    var _this = this;
    var currentCategory = "";
  
    $.each(items, function(index, item) {
      if (item.category != currentCategory) {
        if (item.category)
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
        currentCategory = item.category;
      }
      _this._renderItemData(ul, item);
    });
  },
  _renderItem: function(ul, item) {
    var imageUrl = "/muikku/themes/default/gfx/fish.jpg";
    if (item.image)
      imageUrl = item.image;
    
    var inner_html = 
      '<a><div class="seeker_autocomplete_item_container">' + 
      '<div class="seeker_autocomplete_item_image"><img src="' + imageUrl + '"></div>' +
      '<div class="seeker_autocomplete_item_label">' + item.label + '</div></div></a>';
    return $( "<li></li>" ).data( "item.autocomplete", item ).append(inner_html).appendTo( ul );
  }
});

$.fn.extend({
  /**
   * Thanks to
   * https://github.com/Kasheftin/jquery-textarea-caret/blob/master/jquery.textarea.caret.js
   */
  
  insertAtCaret: function(myValue) {
    return this.each(function(i) {
      if (document.selection) {
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      }
      else 
      if (this.selectionStart || this.selectionStart == "0") {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0,startPos) + myValue + this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      }
      else {
        this.value += myValue;
        this.focus();
      }
    }
  )}
});

(function() {
  
  SeekerWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;
      widgetElement = $(widgetElement);

      widgetElement.find("input[name='seekerInput']").seekerautocomplete({
        source: function (request, response) {
          response(_this._doSearch(request.term));
        },
        select: function (event, ui) {
          window.location.href = CONTEXTPATH + ui.item.link;
          $(this).val("");
          return false;
        }
      });
      
    },
    deinitialize: function () {
    },
    _doSearch: function (searchTerm) {
      var _this = this;
      var users = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/seeker/search", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        users = data;
      });

      return users;
    }
  });
  
  addWidgetController('seeker', SeekerWidgetController);

}).call(this);