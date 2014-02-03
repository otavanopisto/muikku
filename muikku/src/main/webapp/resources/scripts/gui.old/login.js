LoginWidgetController = Class.create(WidgetController, {
  initialize: function () {
    this._registerClickListener = this._onRegisterClick.bindAsEventListener(this);
  },
  setup: function (widgetElement) {
    this._widgetElement = widgetElement;
    
    Event.observe($('loginForm:login'), "click", this._registerClickListener);
  },
  deinitialize: function () {
    Event.stopObserving($('loginForm:login'), 'click', _this._registerClickListener);
  },
  _onRegisterClick: function (event) {
    Event.stop(event);
    
    var email = $('loginForm:email').value;
    var passwordHash = hex_md5($('loginForm:password').value);
    
    RESTful.doPost(CONTEXTPATH + '/rest/user/login', {
      parameters: {
        'email': email,
        'passwordHash': passwordHash
      },
      onSuccess: function (response) {
        window.location.reload();
      }
    });
  }
});

addWidgetController('loginWidget', LoginWidgetController);
