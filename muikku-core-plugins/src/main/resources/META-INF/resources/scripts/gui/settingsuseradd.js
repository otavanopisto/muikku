(function() {
  
  SettingsUserAddWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      this._widgetElement.find('a').click($.proxy(this._onAddUserLinkClick, this));
    },
    destroy: function () {
      this._super(arguments);
    },
    _onAddUserLinkClick: function (event) {
      renderDustTemplate('/settings/users-add-dialog.dust', {}, function (text) {
        var buttons = new Object();
        
        buttons["Cancel"] = function (event) {
          $(this).dialog().remove();
        };
        
        buttons["Create"] = function (event) {
          var form = $(this).find('form');
          var userEntity = {
            firstName: form.find('input[name="firstName"]').val(),
            lastName: form.find('input[name="lastName"]').val(),
            email: form.find('input[name="email"]').val()
          };
          
          alert(JSON.stringify(userEntity));
          
          $(this).dialog().remove();
        };
        
        $(text).dialog({
          buttons: buttons
        });
      });
    }
  });
  
  addWidgetController('settingsUserAddWidget', SettingsUserAddWidgetController);
  
}).call(this);