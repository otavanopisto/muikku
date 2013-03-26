RegisterWidgetController = Class.create(WidgetController, {
  initialize: function () {
    this._registerClickListener = this._onRegisterClick.bindAsEventListener(this);
  },
  setup: function (widgetElement) {
    this._widgetElement = widgetElement;
    
    Event.observe($('registerForm:register'), "click", this._registerClickListener);
  },
  deinitialize: function () {
    Event.stopObserving($('registerForm:register'), 'click', _this._registerClickListener);
  },
  _onRegisterClick: function (event) {
    Event.stop(event);
    
    var firstName = $('registerForm:firstName').value;
    var lastName = $('registerForm:lastName').value;
    var email = $('registerForm:email').value;
    var passwordHash = hex_md5($('registerForm:password').value);
    
    RESTful.doPost(CONTEXTPATH + '/rest/user/registerUser', {
      parameters: {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'passwordHash': passwordHash
      },
      onSuccess: function (response) {
        window.location.reload();
      }
    });
  }
});

addWidgetController('registerWidget', RegisterWidgetController);
