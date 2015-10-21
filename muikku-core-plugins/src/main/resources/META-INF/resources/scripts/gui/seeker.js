$.widget("custom.seekerautocomplete", $.ui.autocomplete, {
	

  _renderMenu: function(ul, items) {
    var _this = this;
    var currentCategory = "";

    $.each(items, function(index, item) {
      if (item.category != currentCategory) {
        if (item.category)
         $('#searchResult > ul').append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
        currentCategory = item.category;
      }
      _this._renderItemData(ul, item);
    });
  },
  _renderItem: function(ul, item) {
    var inner_html = undefined;
    var listItem = $( "<li></li>" ).data( "item.autocomplete", item );
    
    var params = {
      searchTerm: this.element.val(),
      item: item
    };

    renderDustTemplate(item.template, params, function (text) {
      inner_html = $.parseHTML(text);
      listItem.append(inner_html);
      listItem.appendTo($('#searchResults > ul'));

    });
    
    return listItem;
  }
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
          $.ajax({
            url : CONTEXTPATH + "/rest/seeker/search",
            dataType : "json",
            data : {
              searchString : request.term
            },
            headers: {
              "Accept-Language": getLocale()
            },
            accepts: {
              'json' : 'application/json'
            },
            success : function(data) {
              response(data);
            }
          });
          
        },
        select: function (event, ui) {
          if (ui.item.link) {
            window.location.href = CONTEXTPATH + ui.item.link;
          }
          return false;
        },
        
        search : function(event, ui){
      	  $('#searchResults > ul').empty();
        },

        appendTo : "#searchResults .sk-hideResults",
 
        change: function( event, ui ) {
//          $('#searchResults > ul').empty();        	  
        }
      });
      
    },
    deinitialize: function () {
    }
  });
  
  addWidgetController('seeker', SeekerWidgetController);

}).call(this);
