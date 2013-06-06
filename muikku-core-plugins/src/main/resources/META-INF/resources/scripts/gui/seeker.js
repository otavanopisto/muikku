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
//    var imageUrl = "/muikku/themes/default/gfx/fish.jpg";
//    if (item.image)
//      imageUrl = item.image;
    
//    var inner_html = 
//      '<a><div class="seeker_autocomplete_item_container">' + 
//      '<div class="seeker_autocomplete_item_image"><img src="' + imageUrl + '"></div>' +
//      '<div class="seeker_autocomplete_item_label">' + item.label + '</div></div></a>';
    
    dust.preload(item.template);

    var inner_html = undefined;
    var listItem = $( "<li></li>" ).data( "item.autocomplete", item );
    
    var params = {
      item: item
    };
      
    renderDustTemplate(item.template, params, function (text) {
      inner_html = $.parseHTML(text);
      listItem.append(inner_html);
      listItem.appendTo(ul);
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
          response(_this._doSearch(request.term));
        },
        select: function (event, ui) {
          if (ui.item.link) {
            window.location.href = CONTEXTPATH + ui.item.link;
            $(this).val("");
            return false;
          }
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