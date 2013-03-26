(function() {
  
  InternalLoginWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      this._form = this._widgetElement.find("form");
      this._form.submit($.proxy(this._onFormSubmit, this));
    },
    
    _onFormSubmit: function () {
      var passwordField = this._form.find('input:password');
      passwordField.val(hex_md5(passwordField.val()));
    }
  });
  
  addWidgetController('loginWidget', InternalLoginWidgetController);
  
}).call(this);