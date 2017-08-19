(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  setLocale: function setLocale(locale) {
    return {
      'type': 'SET_LOCALE',
      'payload': locale
    };
  }
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  displayNotification: function displayNotification(message, severity) {
    return {
      'type': 'ADD_NOTIFICATION',
      'payload': {
        'severity': severity,
        'message': message
      }
    };
  },
  hideNotification: function hideNotification(notification) {
    return {
      'type': 'HIDE_NOTIFICATION',
      'payload': notification
    };
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  logout: function logout() {
    return {
      'type': 'LOGOUT'
    };
  }
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dialog = require('../general/dialog.jsx');

var _dialog2 = _interopRequireDefault(_dialog);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ForgotPasswordDialog = function (_React$Component) {
  _inherits(ForgotPasswordDialog, _React$Component);

  function ForgotPasswordDialog() {
    _classCallCheck(this, ForgotPasswordDialog);

    return _possibleConstructorReturn(this, (ForgotPasswordDialog.__proto__ || Object.getPrototypeOf(ForgotPasswordDialog)).apply(this, arguments));
  }

  _createClass(ForgotPasswordDialog, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var content = _react2.default.createElement(
        'div',
        null,
        this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.instructions'),
        _react2.default.createElement('br', null),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'form',
          { className: 'form' },
          _react2.default.createElement(
            'div',
            { className: 'form-row' },
            _react2.default.createElement(
              'label',
              { htmlFor: 'forgotpassword-email' },
              this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.email')
            ),
            _react2.default.createElement('input', { type: 'text', name: 'email' }),
            _react2.default.createElement('input', { type: 'submit', className: 'form-hidden', id: 'form-reset-password-submit' })
          )
        )
      );
      var footer = function footer(closeDialog) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            { htmlFor: 'form-reset-password-submit', className: 'button button-large' },
            _this2.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.sendButtonLabel')
          ),
          _react2.default.createElement(
            'a',
            { className: 'button button-large button-warn', onClick: closeDialog },
            _this2.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.cancelButtonLabel')
          )
        );
      };
      return _react2.default.createElement(
        _dialog2.default,
        { title: this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.title'),
          content: content, footer: footer, classNameExtension: this.props.classNameExtension },
        this.props.children
      );
    }
  }]);

  return ForgotPasswordDialog;
}(_react2.default.Component);

ForgotPasswordDialog.propTypes = {
  children: _propTypes2.default.element.isRequired,
  classNameExtension: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ForgotPasswordDialog);

},{"../general/dialog.jsx":10,"prop-types":29,"react":"react","react-redux":"react-redux"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _link = require('../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

var LoginButton = function (_React$Component) {
  _inherits(LoginButton, _React$Component);

  function LoginButton(props) {
    _classCallCheck(this, LoginButton);

    var _this = _possibleConstructorReturn(this, (LoginButton.__proto__ || Object.getPrototypeOf(LoginButton)).call(this, props));

    _this.login = _this.login.bind(_this);
    return _this;
  }

  _createClass(LoginButton, [{
    key: 'login',
    value: function login() {
      //TODO please let's find a better way to do this rather than the emulated way
      window.location.replace($("#login").attr("href"));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _link2.default,
        { className: this.props.classNameExtension + ' button ' + this.props.classNameExtension + '-button-login', onClick: this.login },
        _react2.default.createElement(
          'span',
          null,
          this.props.i18n.text.get('plugin.login.buttonLabel')
        )
      );
    }
  }]);

  return LoginButton;
}(_react2.default.Component);

LoginButton.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LoginButton);

},{"../general/link.jsx":13,"prop-types":29,"react":"react","react-redux":"react-redux"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require('../../actions/base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Notifications = function (_React$Component) {
  _inherits(Notifications, _React$Component);

  function Notifications() {
    _classCallCheck(this, Notifications);

    return _possibleConstructorReturn(this, (Notifications.__proto__ || Object.getPrototypeOf(Notifications)).apply(this, arguments));
  }

  _createClass(Notifications, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'notification-queue' },
        _react2.default.createElement(
          'div',
          { className: 'notification-queue-items' },
          this.props.notifications.map(function (notification) {
            return _react2.default.createElement(
              'div',
              { key: notification.id, className: "notification-queue-item notification-queue-item-" + notification.severity },
              _react2.default.createElement(
                'span',
                null,
                notification.message
              ),
              _react2.default.createElement('a', { className: 'notification-queue-item-close', onClick: _this2.props.hideNotification.bind(_this2, notification) })
            );
          })
        )
      );
    }
  }]);

  return Notifications;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)(_notifications2.default, dispatch);
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Notifications);

},{"../../actions/base/notifications":2,"react":"react","react-redux":"react-redux","redux":"redux"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('./navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _feed = require('./feed.jsx');

var _feed2 = _interopRequireDefault(_feed);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FrontpageBody = function (_React$Component) {
  _inherits(FrontpageBody, _React$Component);

  function FrontpageBody() {
    _classCallCheck(this, FrontpageBody);

    return _possibleConstructorReturn(this, (FrontpageBody.__proto__ || Object.getPrototypeOf(FrontpageBody)).apply(this, arguments));
  }

  _createClass(FrontpageBody, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.addCarousels();
    }
  }, {
    key: 'addCarousels',
    value: function addCarousels() {
      //TODO this piece of code us deprecated and uses jquery, notice that this
      //will be very buggy if ever the frontpage body updates, eg making the i18 reducer more efficient
      //or adding another reducer that causes changes to the body properties
      //we need to repace this if ever going to make body to update

      $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.css'
      }).appendTo('head');

      $.getScript("//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.min.js", function (data, textStatus, jqxhr) {
        $(".carousel-item").each(function (index, element) {
          $(element).show();
        });

        $(".carousel").each(function (index, element) {
          $(element).slick({
            appendDots: $(element).siblings(".carousel-controls"),
            arrows: false,
            dots: true,
            dotsClass: "carousel-dots",
            fade: true,
            speed: 750,
            waitForAnimate: false,
            responsive: [{
              breakpoint: 769,
              settings: {
                adaptiveHeight: true,
                fade: false
              }
            }]
          });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'embbed embbed-full' },
        _react2.default.createElement(_navbar2.default, null),
        _react2.default.createElement(
          'header',
          { className: 'frontpage hero' },
          _react2.default.createElement(
            'div',
            { className: 'hero-wrapper' },
            _react2.default.createElement(
              'div',
              { className: 'hero-item' },
              _react2.default.createElement(
                'div',
                { className: 'bubble bubble-responsive' },
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-title' },
                  this.props.i18n.text.get('plugin.header.studentApplicationBubble.title')
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-content' },
                  this.props.i18n.text.get('plugin.header.studentApplicationBubble.description')
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-button-container' },
                  _react2.default.createElement(
                    'a',
                    { className: 'button button-soft button-dynamic-height button-warn button-focus' },
                    this.props.i18n.text.get('plugin.header.studentApplicationBubble.link')
                  )
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'hero-item' },
              _react2.default.createElement(
                'div',
                { className: 'frontpage container frontpage-container-muikku-logo' },
                _react2.default.createElement('img', { className: 'frontpage logo frontpage-logo-muikku-verkko', src: '/gfx/of-site-logo.png' }),
                _react2.default.createElement(
                  'div',
                  { className: 'frontpage text text-uppercase' },
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage text frontpage-text-muikku-author' },
                    this.props.i18n.text.get('plugin.header.site.author')
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage text frontpage-text-muikku' },
                    'MUIKKU'
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage text frontpage-text-verkko' },
                    'VERKKO'
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'frontpage text text-uppercase frontpage-text-muikku-description' },
                this.props.i18n.text.get('plugin.header.site.description')
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'hero-item' },
              _react2.default.createElement(
                'div',
                { className: 'bubble bubble-responsive' },
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-title' },
                  this.props.i18n.text.get('plugin.header.openMaterialsBubble.title')
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-content' },
                  this.props.i18n.text.get('plugin.header.openMaterialsBubble.description')
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-button-container' },
                  _react2.default.createElement(
                    'a',
                    { className: 'button button-soft button-dynamic-height button-warn' },
                    this.props.i18n.text.get('plugin.header.openMaterialsBubble.link')
                  )
                )
              )
            )
          )
        ),
        _react2.default.createElement('div', { className: 'frontpage separator' }),
        _react2.default.createElement(
          'div',
          { className: 'screen-container' },
          _react2.default.createElement(
            'div',
            { className: 'screen-container-wrapper' },
            _react2.default.createElement(
              'section',
              { id: 'studying', className: 'frontpage container frontpage-container-section' },
              _react2.default.createElement(
                'h2',
                { className: 'frontpage text frontpage-text-title' },
                this.props.i18n.text.get('plugin.sectionTitle.studying')
              ),
              _react2.default.createElement(
                'div',
                { className: 'frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-studying' },
                _react2.default.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage card frontpage-card-studying' },
                    _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva_nettilukio.png', alt: '',
                      title: '' }),
                    _react2.default.createElement(
                      'div',
                      { className: 'card-content' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card-title' },
                        this.props.i18n.text.get('plugin.studying.nettilukio.title')
                      ),
                      _react2.default.createElement(
                        'div',
                        { className: 'card-text' },
                        this.props.i18n.text.get('plugin.studying.nettilukio.description')
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'card-footer' },
                      _react2.default.createElement(
                        'a',
                        { href: 'http://www.nettilukio.fi/nettilukio_esittely',
                          className: 'frontpage button frontpage-button-studying-readmore' },
                        this.props.i18n.text.get('plugin.studying.readMore.link'),
                        ' '
                      )
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage card frontpage-card-school' },
                    _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva_nettiperuskoulu.png',
                      alt: '', title: '' }),
                    _react2.default.createElement(
                      'div',
                      { className: 'card-content' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card-title' },
                        this.props.i18n.text.get('plugin.studying.nettiperuskoulu.title')
                      ),
                      _react2.default.createElement(
                        'div',
                        { className: 'card-text' },
                        this.props.i18n.text.get('plugin.studying.nettiperuskoulu.description')
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'card-footer' },
                      _react2.default.createElement(
                        'a',
                        { href: 'http://www.nettilukio.fi/esittely_nettipk',
                          className: 'frontpage button frontpage-button-school-readmore' },
                        this.props.i18n.text.get('plugin.studying.readMore.link'),
                        ' '
                      )
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage card frontpage-card-courses' },
                    _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva_aineopiskelu.png',
                      alt: '', title: '' }),
                    _react2.default.createElement(
                      'div',
                      { className: 'card-content' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card-title' },
                        this.props.i18n.text.get('plugin.studying.aineopiskelu.title')
                      ),
                      _react2.default.createElement(
                        'div',
                        { className: 'card-text' },
                        this.props.i18n.text.get('plugin.studying.aineopiskelu.description')
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'card-footer' },
                      _react2.default.createElement(
                        'a',
                        { href: 'http://www.nettilukio.fi/esittely_nettipk',
                          className: 'frontpage button frontpage-button-courses-readmore' },
                        this.props.i18n.text.get('plugin.studying.readMore.link'),
                        ' '
                      )
                    )
                  )
                )
              )
            ),
            _react2.default.createElement(
              'section',
              { id: 'videos', className: 'frontpage container frontpage-container-section' },
              _react2.default.createElement(
                'div',
                { className: 'carousel' },
                _react2.default.createElement(
                  'div',
                  { className: 'carousel-item' },
                  _react2.default.createElement(
                    'div',
                    { className: 'carousel-video' },
                    _react2.default.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/OD5Oj50vyh0?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'carousel-item', style: { display: "none" } },
                  _react2.default.createElement(
                    'div',
                    { className: 'carousel-video' },
                    _react2.default.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'carousel-item', style: { display: "none" } },
                  _react2.default.createElement(
                    'div',
                    { className: 'carousel-video' },
                    _react2.default.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/EbJnWIyOJNg?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'carousel-item', style: { display: "none" } },
                  _react2.default.createElement(
                    'div',
                    { className: 'carousel-video' },
                    _react2.default.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                )
              ),
              _react2.default.createElement('div', { className: 'carousel-controls' })
            ),
            _react2.default.createElement(
              'section',
              { id: 'news', className: 'frontpage container frontpage-container-section' },
              _react2.default.createElement(
                'h2',
                { className: 'frontpage text frontpage-text-title' },
                this.props.i18n.text.get('plugin.sectionTitle.news')
              ),
              _react2.default.createElement(
                'div',
                { className: 'frontpage ordered-container frontpage-ordered-container-news' },
                _react2.default.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-news-subcontainer' },
                    _react2.default.createElement(
                      'div',
                      { className: 'ordered-container-item' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card' },
                        _react2.default.createElement(
                          'div',
                          { className: 'card-content' },
                          _react2.default.createElement(
                            'h2',
                            { className: 'card-title' },
                            this.props.i18n.text.get('plugin.frontpageBoxTitle.events')
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'frontpage-events-container' },
                            _react2.default.createElement(_feed2.default, { queryOptions: { numItems: 4, order: "ASCENDING" }, feedReadTarget: 'ooevents' })
                          )
                        )
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'ordered-container-item' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card' },
                        _react2.default.createElement(
                          'div',
                          { className: 'card-content' },
                          _react2.default.createElement(
                            'h2',
                            { className: 'card-title' },
                            this.props.i18n.text.get('plugin.frontpageBoxTitle.news')
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'frontpage-news-container' },
                            _react2.default.createElement(_feed2.default, { queryOptions: { numItems: 5 }, feedReadTarget: 'oonews' })
                          )
                        )
                      )
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  _react2.default.createElement(
                    'div',
                    { className: 'frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-news-subcontainer' },
                    _react2.default.createElement(
                      'div',
                      { className: 'ordered-container-item frontpage-card-container' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card' },
                        _react2.default.createElement(
                          'div',
                          { className: 'carousel' },
                          _react2.default.createElement(
                            'div',
                            { className: 'carousel-item' },
                            _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva1.jpg', alt: '', title: '' }),
                            _react2.default.createElement(
                              'div',
                              { className: 'card-content' },
                              _react2.default.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image1')
                              )
                            )
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva2.jpg', alt: '',
                              title: '' }),
                            _react2.default.createElement(
                              'div',
                              { className: 'card-content' },
                              _react2.default.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image2')
                              )
                            )
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva3.jpg', alt: '', title: '' }),
                            _react2.default.createElement(
                              'div',
                              { className: 'card-content' },
                              _react2.default.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image3')
                              )
                            )
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva4.jpg', alt: '',
                              title: '' }),
                            _react2.default.createElement(
                              'div',
                              { className: 'card-content' },
                              _react2.default.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image4')
                              )
                            )
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            _react2.default.createElement('img', { className: 'card-image', src: '/gfx/kuva5.jpg', alt: '',
                              title: '' }),
                            _react2.default.createElement(
                              'div',
                              { className: 'card-content' },
                              _react2.default.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image5')
                              )
                            )
                          )
                        ),
                        _react2.default.createElement('div', { className: 'carousel-controls' })
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'ordered-container-item frontpage-card-container' },
                      _react2.default.createElement(
                        'div',
                        { className: 'card' },
                        _react2.default.createElement(
                          'div',
                          { className: 'card-content' },
                          _react2.default.createElement(
                            'h2',
                            { className: 'card-title' },
                            this.props.i18n.text.get('plugin.frontpageBoxTitle.blogs')
                          ),
                          _react2.default.createElement(
                            'div',
                            { className: 'frontpage-blogs-container' },
                            _react2.default.createElement(_feed2.default, { queryOptions: { numItems: 6 },
                              feedReadTarget: 'eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia' })
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),
            _react2.default.createElement(
              'section',
              { id: 'organization', className: 'frontpage container frontpage-container-section frontpage-card-container' },
              _react2.default.createElement(
                'div',
                { className: 'frontpage card frontpage-card-otavan-opisto' },
                _react2.default.createElement(
                  'div',
                  { className: 'frontpage ordered-container frontpage-ordered-container-otavan-opisto-info' },
                  _react2.default.createElement(
                    'div',
                    { className: 'ordered-container-item frontpage-ordered-container-item-otavan-opisto-social-media' },
                    _react2.default.createElement(
                      'div',
                      { className: 'frontpage container frontpage-container-otavan-opisto-social-media' },
                      _react2.default.createElement(
                        'h2',
                        { className: 'frontpage text text-uppercase frontpage-text-otavan-opisto-info-title' },
                        this.props.i18n.text.get('plugin.organization.some.title')
                      ),
                      _react2.default.createElement('a', { className: 'frontpage button-social icon icon-some-facebook', href: 'https://www.facebook.com/otavanopisto', target: 'top' }),
                      _react2.default.createElement('a', { className: 'frontpage button-social icon icon-some-twitter', href: 'https://twitter.com/OtavanOpisto', target: 'top' }),
                      _react2.default.createElement('a', { className: 'frontpage button-social icon icon-some-instagram', href: 'https://www.instagram.com/otavanopisto/', target: 'top' }),
                      _react2.default.createElement('a', { className: 'frontpage button-social icon icon-some-pinterest', href: 'https://fi.pinterest.com/otavanopisto/', target: 'top' }),
                      _react2.default.createElement('a', { className: 'frontpage button-social icon icon-some-linkedin', href: 'https://www.linkedin.com/company/106028', target: 'top' })
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'frontpage container frontpage-container-otavan-opisto-description' },
                      _react2.default.createElement('div', { className: 'frontpage text text-multiparagraph frontpage-text-otavan-opisto-info-description',
                        dangerouslySetInnerHTML: { __html: this.props.i18n.text.get('plugin.organization.description') } }),
                      _react2.default.createElement(
                        'a',
                        { href: 'http://www.otavanopisto.fi', target: 'top', className: 'frontpage button frontpage-button-website' },
                        'www.otavanopisto.fi'
                      ),
                      _react2.default.createElement('br', null),
                      _react2.default.createElement(
                        'a',
                        { href: 'http://www.otavanopisto.fi/uutiskirje', target: 'top', className: 'frontpage button frontpage-button-newsletter' },
                        this.props.i18n.text.get('plugin.organization.newsletter.link')
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'ordered-container-item frontpage-ordered-container-item-otavan-opisto-logo' },
                    _react2.default.createElement('img', { src: '/gfx/of-organization-logo.jpg', alt: 'logo', title: 'logo' })
                  )
                )
              )
            )
          )
        ),
        _react2.default.createElement(
          'footer',
          { className: 'frontpage footer', id: 'contact' },
          _react2.default.createElement(
            'div',
            { className: 'footer-container' },
            _react2.default.createElement(
              'div',
              { className: 'footer-item frontpage-footer-item-contact' },
              _react2.default.createElement(
                'h2',
                { className: 'frontpage text frontpage-text-contact-us' },
                this.props.i18n.text.get('plugin.footer.contact.title')
              ),
              _react2.default.createElement(
                'p',
                { className: 'frontpage text frontpage-text-contact-us-information' },
                _react2.default.createElement('span', { className: 'text-icon icon-location' }),
                _react2.default.createElement(
                  'b',
                  null,
                  this.props.i18n.text.get('plugin.footer.streetAddress.label')
                ),
                _react2.default.createElement(
                  'span',
                  null,
                  'Otavantie 2 B, 50670 Otava'
                )
              ),
              _react2.default.createElement(
                'p',
                { className: 'frontpage text frontpage-text-contact-us-information' },
                _react2.default.createElement('span', { className: 'text-icon icon-phone' }),
                _react2.default.createElement(
                  'b',
                  null,
                  this.props.i18n.text.get('plugin.footer.phoneNumber.label')
                ),
                _react2.default.createElement(
                  'span',
                  null,
                  '015 194\xA03552'
                )
              ),
              _react2.default.createElement(
                'p',
                { className: 'frontpage text frontpage-text-contact-us-information' },
                _react2.default.createElement('span', { className: 'text-icon icon-envelope' }),
                _react2.default.createElement(
                  'b',
                  null,
                  this.props.i18n.text.get('plugin.footer.emailAddress.label')
                ),
                _react2.default.createElement(
                  'span',
                  null,
                  'info@otavanopisto.fi'
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'footer-item frontpage-footer-item-logos' },
              _react2.default.createElement('img', { src: '/gfx/alku_uudelle.jpg', alt: '', title: '', className: 'logo' }),
              _react2.default.createElement('img', { src: '/gfx/footer_logo.jpg', alt: '', title: '', className: 'logo' })
            )
          )
        )
      );
    }
  }]);

  return FrontpageBody;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FrontpageBody);

},{"./feed.jsx":8,"./navbar.jsx":9,"react":"react","react-redux":"react-redux"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _feed = require('../general/feed.jsx');

var _feed2 = _interopRequireDefault(_feed);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FrontpageFeed = function (_React$Component) {
  _inherits(FrontpageFeed, _React$Component);

  function FrontpageFeed(props) {
    _classCallCheck(this, FrontpageFeed);

    var _this = _possibleConstructorReturn(this, (FrontpageFeed.__proto__ || Object.getPrototypeOf(FrontpageFeed)).call(this, props));

    _this.state = {
      entries: []
    };
    return _this;
  }

  _createClass(FrontpageFeed, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      mApi().feed.feeds.read(this.props.feedReadTarget, this.props.queryOptions).callback(function (err, entries) {
        if (!err) {
          _this2.setState({ entries: entries });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_feed2.default, { entries: this.state.entries });
    }
  }]);

  return FrontpageFeed;
}(_react2.default.Component);

FrontpageFeed.propTypes = {
  feedReadTarget: _propTypes2.default.string.isRequired,
  queryOptions: _propTypes2.default.object.isRequired
};
exports.default = FrontpageFeed;

},{"../general/feed.jsx":12,"prop-types":29,"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('../general/navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _link = require('../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

var _loginButton = require('../base/login-button.jsx');

var _loginButton2 = _interopRequireDefault(_loginButton);

var _forgotPasswordDialog = require('../base/forgot-password-dialog.jsx');

var _forgotPasswordDialog2 = _interopRequireDefault(_forgotPasswordDialog);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FrontpageNavbar = function (_React$Component) {
  _inherits(FrontpageNavbar, _React$Component);

  function FrontpageNavbar(props) {
    _classCallCheck(this, FrontpageNavbar);

    return _possibleConstructorReturn(this, (FrontpageNavbar.__proto__ || Object.getPrototypeOf(FrontpageNavbar)).call(this, props));
  }

  _createClass(FrontpageNavbar, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_navbar2.default, { classNameExtension: 'frontpage', navbarItems: [{
          classNameSuffix: "studying",
          item: _react2.default.createElement(
            _link2.default,
            { href: '#studying', className: 'link link-full' },
            _react2.default.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.studying')
            )
          )
        }, {
          classNameSuffix: "news",
          item: _react2.default.createElement(
            _link2.default,
            { href: '#news', className: 'link link-full' },
            _react2.default.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.news')
            )
          )
        }, {
          classNameSuffix: "otavan-opisto",
          item: _react2.default.createElement(
            _link2.default,
            { href: '#organization', className: 'link link-full' },
            _react2.default.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.otavanOpisto')
            )
          )
        }, {
          classNameSuffix: "contact",
          item: _react2.default.createElement(
            _link2.default,
            { href: '#contact', className: 'link link-full' },
            _react2.default.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.contact')
            )
          )
        }, {
          classNameSuffix: "open-materials",
          item: _react2.default.createElement(
            _link2.default,
            { href: '/coursepicker', className: 'link link-highlight link-full' },
            _react2.default.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.openMaterials')
            )
          )
        }], defaultOptions: [_react2.default.createElement(_loginButton2.default, { key: '0', classNameExtension: 'frontpage' }), _react2.default.createElement(
          _forgotPasswordDialog2.default,
          { key: '1', classNameExtension: 'frontpage' },
          _react2.default.createElement(
            _link2.default,
            { className: 'frontpage label label-dynamic-word-break label-clickable frontpage-label-forgot-password frontpage-interact-forgot-password' },
            _react2.default.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.forgotpassword.forgotLink')
            )
          )
        )], menuItems: [_react2.default.createElement(
          _link2.default,
          { href: '#studying', className: 'link link-full' },
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.studying')
          )
        ), _react2.default.createElement(
          _link2.default,
          { href: '#news', className: 'link link-full' },
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.news')
          )
        ), _react2.default.createElement(
          _link2.default,
          { href: '#organization', className: 'link link-full' },
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.otavanOpisto')
          )
        ), _react2.default.createElement(
          _link2.default,
          { href: '#contact', className: 'link link-full' },
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.contact')
          )
        ), _react2.default.createElement(
          _link2.default,
          { href: '/coursepicker', className: 'link link-highlight link-full' },
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.openMaterials')
          )
        )] });
    }
  }]);

  return FrontpageNavbar;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FrontpageNavbar);

},{"../base/forgot-password-dialog.jsx":4,"../base/login-button.jsx":5,"../general/link.jsx":13,"../general/navbar.jsx":14,"react":"react","react-redux":"react-redux"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _portal = require('./portal.jsx');

var _portal2 = _interopRequireDefault(_portal);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = function (_React$Component) {
  _inherits(Dialog, _React$Component);

  function Dialog(props) {
    _classCallCheck(this, Dialog);

    var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, props));

    _this.close = _this.close.bind(_this);
    _this.onOverlayClick = _this.onOverlayClick.bind(_this);
    _this.onOpen = _this.onOpen.bind(_this);
    _this.beforeClose = _this.beforeClose.bind(_this);

    _this.state = {
      visible: false
    };
    return _this;
  }

  _createClass(Dialog, [{
    key: 'close',
    value: function close() {
      this.refs.portal.closePortal();
    }
  }, {
    key: 'onOverlayClick',
    value: function onOverlayClick(e) {
      if (e.target === e.currentTarget) {
        this.close();
      }
    }
  }, {
    key: 'onOpen',
    value: function onOpen() {
      var _this2 = this;

      setTimeout(function () {
        _this2.setState({
          visible: true
        });
      }, 10);
    }
  }, {
    key: 'beforeClose',
    value: function beforeClose(DOMNode, removeFromDOM) {
      this.setState({
        visible: false
      });
      setTimeout(removeFromDOM, 300);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _portal2.default,
        { ref: 'portal', openByClickOn: this.props.children, onOpen: this.onOpen, beforeClose: this.beforeClose, closeOnEsc: true },
        _react2.default.createElement(
          'div',
          { className: 'dialog ' + this.props.classNameExtension + '-dialog ' + (this.state.visible ? "visible" : ""), onClick: this.onOverlayClick },
          _react2.default.createElement(
            'div',
            { className: 'dialog-window' },
            _react2.default.createElement(
              'div',
              { className: 'dialog-header' },
              _react2.default.createElement(
                'div',
                { className: 'dialog-title' },
                this.props.title,
                _react2.default.createElement('span', { className: 'dialog-close icon icon-close', onClick: this.close })
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'dialog-content' },
              this.props.content
            ),
            _react2.default.createElement(
              'div',
              { className: 'dialog-footer' },
              this.props.footer(this.close)
            )
          )
        )
      );
    }
  }]);

  return Dialog;
}(_react2.default.Component);

Dialog.propTypes = {
  children: _propTypes2.default.element.isRequired,
  title: _propTypes2.default.string.isRequired,
  classNameExtension: _propTypes2.default.string.isRequired,
  content: _propTypes2.default.element.isRequired,
  footer: _propTypes2.default.func.isRequired
};
exports.default = Dialog;

},{"./portal.jsx":18,"prop-types":29,"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _portal = require('./portal.jsx');

var _portal2 = _interopRequireDefault(_portal);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dropdown = function (_React$Component) {
  _inherits(Dropdown, _React$Component);

  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, props));

    _this.onOpen = _this.onOpen.bind(_this);
    _this.beforeClose = _this.beforeClose.bind(_this);
    _this.close = _this.close.bind(_this);

    _this.state = {
      top: null,
      left: null,
      arrowLeft: null,
      arrowRight: null,
      visible: false
    };
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'onOpen',
    value: function onOpen(DOMNode) {
      var $target = $(this.refs.activator);
      var $arrow = $(this.refs.arrow);
      var $dropdown = $(this.refs.dropdown);

      var position = $target.offset();
      var windowWidth = $(window).width();
      var moreSpaceInTheLeftSide = windowWidth - position.left < position.left;

      var left = null;
      if (moreSpaceInTheLeftSide) {
        left = position.left - $dropdown.outerWidth() + $target.outerWidth();
      } else {
        left = position.left;
      }
      var top = position.top + $target.outerHeight() + 5;

      var arrowLeft = null;
      var arrowRight = null;
      if (moreSpaceInTheLeftSide) {
        arrowRight = $target.outerWidth() / 2 + $arrow.width() / 2;
      } else {
        arrowLeft = $target.outerWidth() / 2 + $arrow.width() / 2;
      }

      this.setState({ top: top, left: left, arrowLeft: arrowLeft, arrowRight: arrowRight, visible: true });
    }
  }, {
    key: 'beforeClose',
    value: function beforeClose(DOMNode, removeFromDOM) {
      this.setState({
        visible: false
      });
      setTimeout(removeFromDOM, 300);
    }
  }, {
    key: 'close',
    value: function close() {
      this.refs.portal.closePortal();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        _portal2.default,
        { ref: 'portal', openByClickOn: _react2.default.cloneElement(this.props.children, { ref: "activator" }),
          closeOnEsc: true, closeOnOutsideClick: true, closeOnScroll: true, onOpen: this.onOpen, beforeClose: this.beforeClose },
        _react2.default.createElement(
          'div',
          { ref: 'dropdown',
            style: {
              top: this.state.top,
              left: this.state.left
            },
            className: this.props.classNameExtension + ' dropdown ' + this.props.classNameExtension + '-dropdown-' + this.props.classNameSuffix + ' ' + (this.state.visible ? "visible" : "") },
          _react2.default.createElement('span', { className: 'arrow', ref: 'arrow', style: { left: this.state.arrowLeft, right: this.state.arrowRight } }),
          _react2.default.createElement(
            'div',
            { className: 'dropdown-container' },
            this.props.items.map(function (item, index) {
              var element = typeof item === "function" ? item(_this2.close) : item;
              return _react2.default.createElement(
                'div',
                { className: 'dropdown-item', key: index },
                element
              );
            })
          )
        )
      );
    }
  }]);

  return Dropdown;
}(_react2.default.Component);

Dropdown.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired,
  classNameSuffix: _propTypes2.default.string.isRequired,
  children: _propTypes2.default.element.isRequired,
  items: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func])).isRequired
};
exports.default = Dropdown;

},{"./portal.jsx":18,"prop-types":29,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Feed = function (_React$Component) {
  _inherits(Feed, _React$Component);

  function Feed() {
    _classCallCheck(this, Feed);

    return _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).apply(this, arguments));
  }

  _createClass(Feed, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'ul',
        { className: 'feed' },
        this.props.entries.map(function (entry, index) {
          return _react2.default.createElement(
            'li',
            { className: 'feed-item' },
            _react2.default.createElement(
              'span',
              { className: 'feed-item-description' },
              _react2.default.createElement(
                'a',
                { href: entry.link, target: 'top' },
                entry.title
              ),
              entry.description
            ),
            _react2.default.createElement(
              'span',
              { className: 'feed-item-date' },
              _this2.props.i18n.time.format(entry.publicationDate)
            )
          );
        })
      );
    }
  }]);

  return Feed;
}(_react2.default.Component);

Feed.propTypes = {
  entries: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    publicationDate: _propTypes2.default.string.isRequired,
    description: _propTypes2.default.string.isRequired,
    link: _propTypes2.default.string.isRequired,
    title: _propTypes2.default.string.isRequired
  })).isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Feed);

},{"prop-types":29,"react":"react","react-redux":"react-redux"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function scrollToSection(anchor) {
  var topOffset = 90;
  var scrollTop = $(anchor).offset().top - topOffset;

  $('html, body').stop().animate({
    scrollTop: scrollTop
  }, {
    duration: 500,
    easing: "easeInOutQuad"
  });
}

var Link = function (_React$Component) {
  _inherits(Link, _React$Component);

  function Link(props) {
    _classCallCheck(this, Link);

    var _this = _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);

    _this.state = {
      active: false
    };
    return _this;
  }

  _createClass(Link, [{
    key: 'onClick',
    value: function onClick(e, re) {
      if (this.props.href && this.props.href[0] === '#') {
        e.preventDefault();
        scrollToSection(this.props.href);
      }
      if (this.props.onClick) {
        this.props.onClick(e, re);
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e, re) {
      this.setState({ active: true });
      if (this.props.onTouchStart) {
        this.props.onTouchStart(e, re);
      }
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e, re) {
      this.setState({ active: false });
      this.onClick(e, re);
      if (this.props.onTouchEnd) {
        this.props.onTouchEnd(e, re);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('a', _extends({}, this.props, {
        className: this.props.className + (this.state.active ? " active" : ""),
        onClick: this.onClick, onTouchStart: this.onTouchStart, onTouchEnd: this.onTouchEnd }));
    }
  }]);

  return Link;
}(_react2.default.Component);

exports.default = Link;

},{"prop-types":29,"react":"react"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _languagePicker = require('./navbar/language-picker.jsx');

var _languagePicker2 = _interopRequireDefault(_languagePicker);

var _profileItem = require('./navbar/profile-item.jsx');

var _profileItem2 = _interopRequireDefault(_profileItem);

var _menu = require('./navbar/menu.jsx');

var _menu2 = _interopRequireDefault(_menu);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navbar = function (_React$Component) {
  _inherits(Navbar, _React$Component);

  function Navbar(props) {
    _classCallCheck(this, Navbar);

    var _this = _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).call(this, props));

    _this.openMenu = _this.openMenu.bind(_this);
    _this.closeMenu = _this.closeMenu.bind(_this);
    _this.state = {
      isMenuOpen: false
    };
    return _this;
  }

  _createClass(Navbar, [{
    key: 'openMenu',
    value: function openMenu() {
      this.setState({
        isMenuOpen: true
      });
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu() {
      this.setState({
        isMenuOpen: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'nav',
          { className: 'navbar ' + this.props.classNameExtension },
          _react2.default.createElement(
            'div',
            { className: 'navbar-wrapper' },
            _react2.default.createElement('div', { className: 'navbar-logo' }),
            _react2.default.createElement(
              'div',
              { className: 'navbar-items' },
              _react2.default.createElement(
                'ul',
                { className: 'navbar-items-container' },
                _react2.default.createElement(
                  'li',
                  { className: 'navbar-item ' + this.props.classNameExtension + '-navbar-item-menu-button' },
                  _react2.default.createElement(
                    'a',
                    { className: this.props.classNameExtension + ' link link-icon link-full', onClick: this.openMenu },
                    _react2.default.createElement('span', { className: 'icon icon-navicon' })
                  )
                ),
                this.props.navbarItems.map(function (item, index) {
                  if (!item) {
                    return null;
                  }
                  return _react2.default.createElement(
                    'li',
                    { key: index, className: 'navbar-item ' + _this2.props.classNameExtension + '-navbar-item-' + item.classNameSuffix },
                    item.item
                  );
                }).filter(function (item) {
                  return !!item;
                })
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'navbar-default-options' },
              _react2.default.createElement(
                'div',
                { className: 'navbar-default-options-container' },
                this.props.defaultOptions,
                _react2.default.createElement(_profileItem2.default, { classNameExtension: this.props.classNameExtension }),
                _react2.default.createElement(_languagePicker2.default, { classNameExtension: this.props.classNameExtension })
              )
            )
          )
        ),
        _react2.default.createElement(_menu2.default, { open: this.state.isMenuOpen, onClose: this.closeMenu, items: this.props.menuItems, classNameExtension: this.props.classNameExtension })
      );
    }
  }]);

  return Navbar;
}(_react2.default.Component);

Navbar.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired,
  navbarItems: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    classNameSuffix: _propTypes2.default.string,
    item: _propTypes2.default.element.isRequired
  })).isRequired,
  menuItems: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired,
  defaultOptions: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired
};
exports.default = Navbar;

},{"./navbar/language-picker.jsx":15,"./navbar/menu.jsx":16,"./navbar/profile-item.jsx":17,"prop-types":29,"react":"react"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _locales = require('../../../actions/base/locales');

var _locales2 = _interopRequireDefault(_locales);

var _dropdown = require('../dropdown.jsx');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LanguagePicker = function (_React$Component) {
  _inherits(LanguagePicker, _React$Component);

  function LanguagePicker() {
    _classCallCheck(this, LanguagePicker);

    return _possibleConstructorReturn(this, (LanguagePicker.__proto__ || Object.getPrototypeOf(LanguagePicker)).apply(this, arguments));
  }

  _createClass(LanguagePicker, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        _dropdown2.default,
        { classNameExtension: this.props.classNameExtension, classNameSuffix: 'language-picker', items: this.props.locales.avaliable.map(function (locale) {
            return _react2.default.createElement(
              'a',
              { className: _this2.props.classNameExtension + ' link link-full ' + _this2.props.classNameExtension + '-link-language-picker', onClick: _this2.props.setLocale.bind(_this2, locale.locale) },
              _react2.default.createElement(
                'span',
                null,
                locale.name
              )
            );
          }) },
        _react2.default.createElement(
          'a',
          { className: this.props.classNameExtension + ' button-pill ' + this.props.classNameExtension + '-button-pill-language' },
          _react2.default.createElement(
            'span',
            null,
            this.props.locales.current
          )
        )
      );
    }
  }]);

  return LanguagePicker;
}(_react2.default.Component);

LanguagePicker.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    locales: state.locales
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)(_locales2.default, dispatch);
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LanguagePicker);

},{"../../../actions/base/locales":1,"../dropdown.jsx":11,"prop-types":29,"react":"react","react-redux":"react-redux","redux":"redux"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _link = require('../link.jsx');

var _link2 = _interopRequireDefault(_link);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);
    _this.open = _this.open.bind(_this);
    _this.close = _this.close.bind(_this);
    _this.closeByOverlay = _this.closeByOverlay.bind(_this);

    _this.state = {
      displayed: props.open,
      visible: props.open,
      dragging: false,
      drag: null,
      open: props.open
    };
    return _this;
  }

  _createClass(Menu, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.open && !this.state.open) {
        this.open();
      } else if (!nextProps.open && this.state.open) {
        this.close();
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      this.setState({ 'dragging': true });
      this.touchCordX = e.changedTouches[0].pageX;
      this.touchMovementX = 0;
      e.preventDefault();
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      var diffX = e.changedTouches[0].pageX - this.touchCordX;
      var absoluteDifferenceX = Math.abs(diffX - this.state.drag);
      this.touchMovementX += absoluteDifferenceX;

      if (diffX > 0) {
        diffX = 0;
      }
      this.setState({ drag: diffX });
      e.preventDefault();
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
      var _this2 = this;

      var width = $(this.refs.menuContainer).width();
      var diff = this.state.drag;
      var movement = this.touchMovementX;

      var menuHasSlidedEnoughForClosing = Math.abs(diff) >= width * 0.33;
      var youJustClickedTheOverlay = e.target === this.refs.menu && movement <= 5;
      var youJustClickedALink = e.target.nodeName.toLowerCase() === "a" && movement <= 5;

      this.setState({ dragging: false });
      setTimeout(function () {
        _this2.setState({ drag: null });
        if (menuHasSlidedEnoughForClosing || youJustClickedTheOverlay || youJustClickedALink) {
          _this2.close();
        }
      }, 10);
      e.preventDefault();
    }
  }, {
    key: 'open',
    value: function open() {
      var _this3 = this;

      this.setState({ displayed: true, open: true });
      setTimeout(function () {
        _this3.setState({ visible: true });
      }, 10);
      $(document.body).css({ 'overflow': 'hidden' });
    }
  }, {
    key: 'closeByOverlay',
    value: function closeByOverlay(e) {
      var isOverlay = e.target === e.currentTarget;
      var isLink = !!e.target.href;
      if (!this.state.dragging && (isOverlay || isLink)) {
        this.close();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      var _this4 = this;

      $(document.body).css({ 'overflow': '' });
      this.setState({ visible: false });
      setTimeout(function () {
        _this4.setState({ displayed: false, open: false });
        _this4.props.onClose();
      }, 300);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: this.props.classNameExtension + ' menu ' + (this.state.displayed ? "displayed" : "") + ' ' + (this.state.visible ? "visible" : "") + ' ' + (this.state.dragging ? "dragging" : ""),
          onClick: this.closeByOverlay, onTouchStart: this.onTouchStart, onTouchMove: this.onTouchMove, onTouchEnd: this.onTouchEnd, ref: 'menu' },
        _react2.default.createElement(
          'div',
          { className: 'menu-container', ref: 'menuContainer', style: { left: this.state.drag } },
          _react2.default.createElement(
            'div',
            { className: 'menu-header' },
            _react2.default.createElement('div', { className: 'menu-logo' }),
            _react2.default.createElement(_link2.default, { className: 'menu-header-button-close icon icon-arrow-left' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'menu-body' },
            _react2.default.createElement(
              'ul',
              { className: 'menu-items' },
              this.props.items.map(function (item, index) {
                if (!item) {
                  return null;
                }
                return _react2.default.createElement(
                  'li',
                  { className: 'menu-item', key: index },
                  item
                );
              }),
              this.props.status.loggedIn ? _react2.default.createElement('li', { className: 'menu-item menu-item-space' }) : null,
              this.props.status.loggedIn ? _react2.default.createElement(
                'li',
                { className: 'menu-item' },
                _react2.default.createElement(
                  _link2.default,
                  { className: 'main-function link link-full main-function-link-menu main-function-link-menu-profile', href: '/profile' },
                  _react2.default.createElement(
                    'object',
                    { className: 'embbed embbed-profile-image',
                      data: '/rest/user/files/user/#{sessionBackingBean.loggedUserId}/identifier/profile-image-96',
                      type: 'image/jpeg' },
                    _react2.default.createElement('span', { className: 'icon icon-user' })
                  ),
                  this.props.i18n.text.get('plugin.profile.profile')
                )
              ) : null,
              this.props.status.loggedIn ? _react2.default.createElement(
                'li',
                { className: 'menu-item' },
                _react2.default.createElement(
                  _link2.default,
                  { className: 'main-function link link-full main-function-link-menu main-function-link-menu-instructions' },
                  _react2.default.createElement('span', { className: 'icon icon-forgotpassword' }),
                  this.props.i18n.text.get('plugin.footer.instructions')
                )
              ) : null,
              this.props.status.loggedIn ? _react2.default.createElement(
                'li',
                { className: 'menu-item' },
                _react2.default.createElement(
                  _link2.default,
                  { className: 'main-function link link-full main-function-link-menu main-function-link-menu-helpdesk' },
                  _react2.default.createElement('span', { className: 'icon icon-helpdesk' }),
                  this.props.i18n.text.get('plugin.home.helpdesk')
                )
              ) : null,
              this.props.status.loggedIn ? _react2.default.createElement(
                'li',
                { className: 'menu-item' },
                _react2.default.createElement(
                  _link2.default,
                  { className: 'main-function link link-full main-function-link-menu main-function-link-menu-logout' },
                  _react2.default.createElement('span', { className: 'icon icon-signout' }),
                  this.props.i18n.text.get('plugin.logout.logout')
                )
              ) : null
            )
          )
        )
      );
    }
  }]);

  return Menu;
}(_react2.default.Component);

Menu.propTypes = {
  open: _propTypes2.default.bool.isRequired,
  onClose: _propTypes2.default.func.isRequired,
  items: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired,
  classNameExtension: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    status: state.status
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Menu);

},{"../link.jsx":13,"prop-types":29,"react":"react","react-redux":"react-redux"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dropdown = require('../dropdown.jsx');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _link = require('../link.jsx');

var _link2 = _interopRequireDefault(_link);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _status = require('../../../actions/base/status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProfileItem = function (_React$Component) {
  _inherits(ProfileItem, _React$Component);

  function ProfileItem() {
    _classCallCheck(this, ProfileItem);

    return _possibleConstructorReturn(this, (ProfileItem.__proto__ || Object.getPrototypeOf(ProfileItem)).apply(this, arguments));
  }

  _createClass(ProfileItem, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.props.status.loggedIn) {
        return null;
      }
      var items = [{
        icon: "user",
        text: 'plugin.profile.links.personal',
        href: "/profile"
      }, {
        icon: "forgotpassword",
        text: 'plugin.footer.instructions'
      }, {
        icon: "helpdesk",
        text: 'plugin.home.helpdesk'
      }, {
        icon: "signout",
        text: 'plugin.logout.logout',
        onClick: this.props.logout
      }];
      return _react2.default.createElement(
        _dropdown2.default,
        { classNameExtension: this.props.classNameExtension, classNameSuffix: 'profile-menu', items: items.map(function (item) {
            return function (closeDropdown) {
              return _react2.default.createElement(
                _link2.default,
                _defineProperty({ href: '/profile',
                  className: _this2.props.classNameExtension + ' link link-full ' + _this2.props.classNameExtension + '-link-profile-menu',
                  onClick: function onClick() {
                    closeDropdown();item.onClick && item.onClick.apply(item, arguments);
                  } }, 'href', item.href),
                _react2.default.createElement('span', { className: 'icon icon-' + item.icon }),
                _react2.default.createElement(
                  'span',
                  null,
                  _this2.props.i18n.text.get(item.text)
                )
              );
            };
          }) },
        _react2.default.createElement(
          'a',
          { className: 'main-function button-pill main-function-button-pill-profile' },
          _react2.default.createElement(
            'object',
            { className: 'embbed embbed-full',
              data: '/rest/user/files/user/' + this.props.status.userId + '/identifier/profile-image-96',
              type: 'image/jpeg' },
            _react2.default.createElement('span', { className: 'icon icon-user' })
          )
        )
      );
    }
  }]);

  return ProfileItem;
}(_react2.default.Component);

ProfileItem.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    status: state.status
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)(_status2.default, dispatch);
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ProfileItem);

},{"../../../actions/base/status":3,"../dropdown.jsx":11,"../link.jsx":13,"prop-types":29,"react":"react","react-redux":"react-redux","redux":"redux"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEYCODES = {
  ESCAPE: 27
};

var Portal = function (_React$Component) {
  _inherits(Portal, _React$Component);

  function Portal() {
    _classCallCheck(this, Portal);

    var _this = _possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).call(this));

    _this.state = { active: false };
    _this.handleWrapperClick = _this.handleWrapperClick.bind(_this);
    _this.closePortal = _this.closePortal.bind(_this);
    _this.handleOutsideMouseClick = _this.handleOutsideMouseClick.bind(_this);
    _this.handleKeydown = _this.handleKeydown.bind(_this);
    _this.portal = null;
    _this.node = null;
    return _this;
  }

  _createClass(Portal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }

      if (this.props.closeOnOutsideClick) {
        document.addEventListener('mouseup', this.handleOutsideMouseClick);
        document.addEventListener('touchstart', this.handleOutsideMouseClick);
      }

      if (this.props.closeOnScroll) {
        document.addEventListener('scroll', this.handleOutsideMouseClick);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.renderPortal(newProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }

      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('mouseup', this.handleOutsideMouseClick);
        document.removeEventListener('touchstart', this.handleOutsideMouseClick);
      }

      if (this.props.closeOnScroll) {
        document.removeEventListener('scroll', this.handleOutsideMouseClick);
      }

      this.closePortal(true);
    }
  }, {
    key: 'handleWrapperClick',
    value: function handleWrapperClick(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.active) {
        return;
      }
      this.openPortal();
    }
  }, {
    key: 'openPortal',
    value: function openPortal() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      this.setState({ active: true });
      this.renderPortal(props, true);
    }
  }, {
    key: 'closePortal',
    value: function closePortal() {
      var _this2 = this;

      var isUnmounted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var resetPortalState = function resetPortalState() {
        if (_this2.node) {
          (0, _reactDom.unmountComponentAtNode)(_this2.node);
          document.body.removeChild(_this2.node);
        }
        _this2.portal = null;
        _this2.node = null;
        if (isUnmounted !== true) {
          _this2.setState({ active: false });
        }
      };

      if (this.state.active) {
        if (this.props.beforeClose) {
          this.props.beforeClose(this.node, resetPortalState);
        } else {
          resetPortalState();
        }

        this.props.onClose();
      }
    }
  }, {
    key: 'handleOutsideMouseClick',
    value: function handleOutsideMouseClick(e) {
      if (!this.state.active) {
        return;
      }

      var root = (0, _reactDom.findDOMNode)(this.portal);
      if (root.contains(e.target) || e.button && e.button !== 0) {
        return;
      }

      e.stopPropagation();
      this.closePortal();
    }
  }, {
    key: 'handleKeydown',
    value: function handleKeydown(e) {
      if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
        this.closePortal();
      }
    }
  }, {
    key: 'renderPortal',
    value: function renderPortal(props, isOpening) {
      if (!this.node) {
        this.node = document.createElement('div');
        document.body.appendChild(this.node);
      }

      var children = props.children;
      // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
      if (typeof props.children.type === 'function') {
        children = _react2.default.cloneElement(props.children, {
          closePortal: this.closePortal
        });
      }

      this.portal = (0, _reactDom.unstable_renderSubtreeIntoContainer)(this, children, this.node, this.props.onUpdate);

      if (isOpening) {
        this.props.onOpen(this.node);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.openByClickOn) {
        return _react2.default.cloneElement(this.props.openByClickOn, {
          onClick: this.handleWrapperClick
        });
      }
      return null;
    }
  }]);

  return Portal;
}(_react2.default.Component);

exports.default = Portal;


Portal.propTypes = {
  children: _propTypes2.default.element.isRequired,
  openByClickOn: _propTypes2.default.element,
  closeOnEsc: _propTypes2.default.bool,
  closeOnOutsideClick: _propTypes2.default.bool,
  closeOnScroll: _propTypes2.default.bool,
  onOpen: _propTypes2.default.func,
  onClose: _propTypes2.default.func,
  beforeClose: _propTypes2.default.func,
  onUpdate: _propTypes2.default.func
};

Portal.defaultProps = {
  onOpen: function onOpen() {},
  onClose: function onClose() {},
  onUpdate: function onUpdate() {}
};

},{"prop-types":29,"react":"react","react-dom":"react-dom"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require('../components/base/notifications.jsx');

var _notifications2 = _interopRequireDefault(_notifications);

var _body = require('../components/frontpage/body.jsx');

var _body2 = _interopRequireDefault(_body);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IndexFrontpage = function (_React$Component) {
  _inherits(IndexFrontpage, _React$Component);

  function IndexFrontpage() {
    _classCallCheck(this, IndexFrontpage);

    return _possibleConstructorReturn(this, (IndexFrontpage.__proto__ || Object.getPrototypeOf(IndexFrontpage)).apply(this, arguments));
  }

  _createClass(IndexFrontpage, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'root' },
        _react2.default.createElement(_notifications2.default, null),
        _react2.default.createElement(_body2.default, null)
      );
    }
  }]);

  return IndexFrontpage;
}(_react2.default.Component);

exports.default = IndexFrontpage;

},{"../components/base/notifications.jsx":6,"../components/frontpage/body.jsx":7,"react":"react"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runApp;

var _reduxLogger = require('redux-logger');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runApp(reducer, App, callback) {
  var store = (0, _redux.createStore)(reducer, (0, _redux.applyMiddleware)(_reduxLogger.logger, _reduxThunk2.default));

  (0, _reactDom.render)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(App, null)
  ), document.querySelector("#app"));

  var newStore = {
    dispatch: function dispatch(action) {
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }

      return store.dispatch(action);
    },
    subscribe: function subscribe() {
      return store.subscribe.apply(store, arguments);
    },
    getState: function getState() {
      return store.getState.apply(store, arguments);
    },
    replaceReducer: function replaceReducer() {
      return store.replaceReducer.apply(store, arguments);
    }
  };

  //  const oConnect = ReactRedux.connect;
  //  ReactRedux.connect = function(mapStateToProps, mapDispatchToProps){
  //    return oConnect((state)=>{
  //      let value = mapStateToProps(state);
  //      Object.keys(value).forEach((key)=>{
  //        if (typeof value[key] === "undefined"){
  //          throw new Error("Missing state value for key " + key + " you most likely forgot to combine the reducers within the root reducer file");
  //        }
  //      });
  //    }, mapDispatchToProps);
  //  }

  callback && callback(newStore);
}

},{"react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","redux-logger":31,"redux-thunk":"redux-thunk"}],21:[function(require,module,exports){
'use strict';

var _indexFrontpage = require('./containers/index.frontpage.jsx');

var _indexFrontpage2 = _interopRequireDefault(_indexFrontpage);

var _index = require('./reducers/index.frontpage');

var _index2 = _interopRequireDefault(_index);

var _defaultDebug = require('./default.debug.jsx');

var _defaultDebug2 = _interopRequireDefault(_defaultDebug);

var _websocket = require('./util/websocket');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _defaultDebug2.default)(_index2.default, _indexFrontpage2.default);

},{"./containers/index.frontpage.jsx":19,"./default.debug.jsx":20,"./reducers/index.frontpage":36,"./util/websocket":37}],22:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":25}],24:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,require('_process'))

},{"./emptyFunction":22,"_process":25}],25:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],26:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

}).call(this,require('_process'))

},{"./lib/ReactPropTypesSecret":30,"_process":25,"fbjs/lib/invariant":23,"fbjs/lib/warning":24}],27:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":30,"fbjs/lib/emptyFunction":22,"fbjs/lib/invariant":23}],28:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,require('_process'))

},{"./checkPropTypes":26,"./lib/ReactPropTypesSecret":30,"_process":25,"fbjs/lib/emptyFunction":22,"fbjs/lib/invariant":23,"fbjs/lib/warning":24}],29:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

}).call(this,require('_process'))

},{"./factoryWithThrowingShims":27,"./factoryWithTypeCheckers":28,"_process":25}],30:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],31:[function(require,module,exports){
(function (global){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = i18n;
function i18n() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    text: {
      get: function get(key) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var text = getLocaleText(key, args);
        if (text) {
          text = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        return text;
      }
    },
    time: {
      format: function format() {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
        var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "L";

        return moment(new Date(date)).format(format);
      },
      fromNow: function fromNow() {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

        return moment(new Date(date)).fromNow();
      },
      subtract: function subtract() {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
        var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "days";

        return moment(new Date(date)).subtract(input, value).calendar();
      },
      add: function add() {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
        var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "days";

        return moment(new Date(date)).add(input, value).calendar();
      }
    }
  };
  var action = arguments[1];

  return state;
}

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = locales;
//TODO this reducer uses the api that interacts with the DOM in order to
//retrieve data, please fix in next versions

function locales() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    avaliable: $.makeArray($("#language-picker a").map(function (index, element) {
      return {
        name: $(element).text().trim(),
        locale: $(element).data('locale')
      };
    })),
    current: $("#locale").text()
  };
  var action = arguments[1];

  if (action.type === 'SET_LOCALE') {
    $('#language-picker a[data-locale="' + action.payload + '"]').click();
    return Object.assign({}, state, { current: action.payload });
  }
  return state;
}

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = notifications;
function notifications() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  if (action.type === 'ADD_NOTIFICATION') {
    var id = new Date().getTime();
    return state.concat(Object.assign({ id: id }, action.payload));
  } else if (action.type === 'HIDE_NOTIFICATION') {
    return state.filter(function (element) {
      return element.id !== action.payload.id;
    });
  }
  return state;
}

},{}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = status;
//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.js make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D

function status() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    loggedIn: !!MUIKKU_LOGGED_USER_ID,
    userId: MUIKKU_LOGGED_USER_ID,
    permissions: MUIKKU_PERMISSIONS,
    contextPath: CONTEXTPATH
  };
  var action = arguments[1];

  if (action.type === "LOGOUT") {
    $('#logout').click();
    return state;
  }
  return state;
}

},{}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('./base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _locales = require('./base/locales');

var _locales2 = _interopRequireDefault(_locales);

var _status = require('./base/status');

var _status2 = _interopRequireDefault(_status);

var _i18n = require('./base/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  notifications: _notifications2.default,
  i18n: _i18n2.default,
  locales: _locales2.default,
  status: _status2.default
});

},{"./base/i18n":32,"./base/locales":33,"./base/notifications":34,"./base/status":35,"redux":"redux"}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require('../actions/base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MuikkuWebsocket = function () {
  function MuikkuWebsocket(store) {
    var _this = this;

    var listeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      reconnectInterval: 200,
      pingTimeStep: 1000,
      pingTimeout: 10000
    };

    _classCallCheck(this, MuikkuWebsocket);

    this.options = options;
    this.listeners = listeners;

    this.ticket = null;
    this.webSocket = null;
    this.socketOpen = false;
    this.messagesPending = [];
    this.pingHandle = null;
    this.pinging = false;
    this.pingTime = 0;
    this.listeners = {};
    this.store = store;

    this.getTicket(function (ticket) {
      if (_this.ticket) {
        _this.openWebSocket();
        _this.startPinging();
      } else {
        _this.store.dispatch(_notifications2.default.displayNotification("Could not open WebSocket because ticket was missing", 'error'));
      }
    });

    $(window).on("beforeunload", this.onBeforeWindowUnload.bind(this));
  }

  _createClass(MuikkuWebsocket, [{
    key: 'sendMessage',
    value: function sendMessage(eventType, data) {
      var message = {
        eventType: eventType,
        data: data
      };

      if (this.socketOpen) {
        try {
          this.webSocket.send(JSON.stringify(message));
        } catch (e) {
          this.messagesPending.push({
            eventType: eventType,
            data: data
          });
          this.reconnect();
        }
      } else {
        this.messagesPending.push(message);
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(event) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.store.dispatch({
        'type': 'WEBSOCKET_EVENT',
        'payload': {
          event: event,
          data: data
        }
      });

      if (this.listeners[event]) {
        var listeners = this.listeners[event];
        if (typeof listeners === "function") {
          listeners(data);
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            action = _step.value;

            if (typeof action === "function") {
              this.store.dispatch(action());
            } else {
              this.store.dispatch(action);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }, {
    key: 'getTicket',
    value: function getTicket(callback) {
      var _this2 = this;

      try {
        if (this.ticket) {
          // We have a ticket, so we need to validate it before using it
          mApi().websocket.cacheClear().ticket.check.read(this.ticket).callback($.proxy(function (err, response) {
            if (err) {
              // Ticket did not pass validation, so we need to create a new one
              this.createTicket($.proxy(function (ticket) {
                this.ticket = ticket;
                callback(ticket);
              }, this));
            } else {
              // Ticket passed validation, so we use it
              callback(this.ticket);
            }
          }, this));
        } else {
          // Create new ticket
          this.createTicket(function (ticket) {
            _this2.ticket = ticket;
            callback(ticket);
          });
        }
      } catch (e) {
        this.store.dispatch(_notifications2.default.displayNotification("Ticket creation failed on an internal error", 'error'));
      }
    }
  }, {
    key: 'createTicket',
    value: function createTicket(callback) {
      var _this3 = this;

      mApi().websocket.ticket.create().callback(function (err, ticket) {
        if (!err) {
          callback(ticket.ticket);
        } else {
          _this3.store.dispatch(_notifications2.default.displayNotification("Could not create WebSocket ticket", 'error'));
        }
      });
    }
  }, {
    key: 'onWebSocketConnected',
    value: function onWebSocketConnected() {
      this.socketOpen = true;
      this.trigger("webSocketConnected");

      while (this.socketOpen && this.messagesPending.length) {
        var message = this.messagesPending.shift();
        this.sendMessage(message.eventType, message.data);
      }
    }
  }, {
    key: 'onWebSocketError',
    value: function onWebSocketError() {
      this.reconnect();
    }
  }, {
    key: 'onWebSocketClose',
    value: function onWebSocketClose() {
      this.trigger("webSocketDisconnected");
      this.reconnect();
    }
  }, {
    key: 'openWebSocket',
    value: function openWebSocket() {
      var host = window.location.host;
      var secure = location.protocol == 'https:';
      this.webSocket = this.createWebSocket((secure ? 'wss://' : 'ws://') + host + '/ws/socket/' + this.ticket);

      if (this.webSocket) {
        this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
        this.webSocket.onerror = this.onWebSocketError.bind(this);
        this.webSocket.onclose = this.onWebSocketClose.bind(this);
        switch (this.webSocket.readyState) {
          case this.webSocket.CONNECTING:
            this.webSocket.onopen = this.onWebSocketConnected.bind(this);
            break;
          case this.webSocket.OPEN:
            this.onWebSocketConnected();
            break;
          default:
            this.store.dispatch(_notifications2.default.displayNotification("WebSocket connection failed", 'error'));
            break;
        }
      } else {
        this.store.dispatch(_notifications2.default.displayNotification("Could not open WebSocket connection", 'error'));
      }
    }
  }, {
    key: 'createWebSocket',
    value: function createWebSocket(url) {
      if (typeof window.WebSocket !== 'undefined') {
        return new WebSocket(url);
      } else if (typeof window.MozWebSocket !== 'undefined') {
        return new MozWebSocket(url);
      }

      return null;
    }
  }, {
    key: 'startPinging',
    value: function startPinging() {
      var _this4 = this;

      this.pingHandle = setInterval(function () {
        if (_this4.socketOpen === false) {
          return;
        }
        if (!_this4.pinging) {
          _this4.sendMessage("ping:ping", {});
          _this4.pinging = true;
        } else {
          _this4.pingTime += _this4.options.pingTimeStep;

          if (_this4.pingTime > _this4.options.pingTimeout) {
            if (console) console.log("ping failed, reconnecting...");
            _this4.pinging = false;
            _this4.pingTime = 0;

            _this4.reconnect();
          }
        }
      }, this.options.pingTimeStep);
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      var _this5 = this;

      var wasOpen = this.socketOpen;
      this.socketOpen = false;
      clearTimeout(this.reconnectTimeout);

      this.reconnectTimeout = setTimeout(function () {
        try {
          if (_this5.webSocket) {
            _this5.webSocket.onmessage = function () {};
            _this5.webSocket.onerror = function () {};
            _this5.webSocket.onclose = function () {};
            if (wasOpen) {
              _this5.webSocket.close();
            }
          }
        } catch (e) {
          // Ignore exceptions related to discarding a WebSocket 
        }

        _this5.getTicket(function (ticket) {
          if (_this5.ticket) {
            _this5.openWebSocket();
          } else {
            _this5.store.dispatch(_notifications2.default.displayNotification("Could not open WebSocket because ticket was missing", 'error'));
          }
        });
      }, this.options.reconnectInterval);
    }
  }, {
    key: 'onWebSocketMessage',
    value: function onWebSocketMessage(event) {
      var message = JSON.parse(event.data);
      var eventType = message.eventType;

      if (eventType == "ping:pong") {
        this.pinging = false;
        this.pingTime = 0;
      } else {
        this.trigger(eventType, message.data);
      }
    }
  }, {
    key: 'onBeforeWindowUnload',
    value: function onBeforeWindowUnload() {
      if (this.webSocket) {
        this.webSocket.onmessage = function () {};
        this.webSocket.onerror = function () {};
        this.webSocket.onclose = function () {};
        if (this.socketOpen) {
          this.webSocket.close();
        }
      }
    }
  }]);

  return MuikkuWebsocket;
}();

exports.default = MuikkuWebsocket;

},{"../actions/base/notifications":2}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiYWN0aW9ucy9iYXNlL3N0YXR1cy5qcyIsImNvbXBvbmVudHMvYmFzZS9mb3Jnb3QtcGFzc3dvcmQtZGlhbG9nLmpzeCIsImNvbXBvbmVudHMvYmFzZS9sb2dpbi1idXR0b24uanN4IiwiY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4IiwiY29tcG9uZW50cy9mcm9udHBhZ2UvYm9keS5qc3giLCJjb21wb25lbnRzL2Zyb250cGFnZS9mZWVkLmpzeCIsImNvbXBvbmVudHMvZnJvbnRwYWdlL25hdmJhci5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZGlhbG9nLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZmVlZC5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvbGFuZ3VhZ2UtcGlja2VyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvbWVudS5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvcG9ydGFsLmpzeCIsImNvbnRhaW5lcnMvaW5kZXguZnJvbnRwYWdlLmpzeCIsImRlZmF1bHQuZGVidWcuanN4IiwiaW5kZXguZnJvbnRwYWdlLmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL3dhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9kaXN0L3JlZHV4LWxvZ2dlci5qcyIsInJlZHVjZXJzL2Jhc2UvaTE4bi5qcyIsInJlZHVjZXJzL2Jhc2UvbG9jYWxlcy5qcyIsInJlZHVjZXJzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qcyIsInJlZHVjZXJzL2Jhc2Uvc3RhdHVzLmpzIiwicmVkdWNlcnMvaW5kZXguZnJvbnRwYWdlLmpzIiwidXRpbC93ZWJzb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNBZTtBQUNiLGFBQVcsbUJBQVMsTUFBVCxFQUFnQjtBQUN6QixXQUFPO0FBQ0wsY0FBUSxZQURIO0FBRUwsaUJBQVc7QUFGTixLQUFQO0FBSUQ7QUFOWSxDOzs7Ozs7OztrQkNBQTtBQUNiLHVCQUFxQiw2QkFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTJCO0FBQzlDLFdBQU87QUFDTCxjQUFRLGtCQURIO0FBRUwsaUJBQVc7QUFDVCxvQkFBWSxRQURIO0FBRVQsbUJBQVc7QUFGRjtBQUZOLEtBQVA7QUFPRCxHQVRZO0FBVWIsb0JBQWtCLDBCQUFTLFlBQVQsRUFBc0I7QUFDdEMsV0FBTztBQUNMLGNBQVEsbUJBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQWZZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsUUFEYSxvQkFDTDtBQUNOLFdBQU87QUFDTCxjQUFRO0FBREgsS0FBUDtBQUdEO0FBTFksQzs7Ozs7Ozs7Ozs7QUNBZjs7OztB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QixRQUFRLElBQWhDO0FBQ0Q7QUFDRjs7OzJDQUVzQjtBQUNyQixVQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixhQUFLLFNBQUwsQ0FBZSxTQUFmLEdBQTJCLFlBQUksQ0FBRSxDQUFqQztBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWYsR0FBeUIsWUFBSSxDQUFFLENBQS9CO0FBQ0EsYUFBSyxTQUFMLENBQWUsT0FBZixHQUF5QixZQUFJLENBQUUsQ0FBL0I7QUFDQSxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixlQUFLLFNBQUwsQ0FBZSxLQUFmO0FBQ0Q7QUFDRjtBQUNGOzs7Ozs7a0JBalBrQixlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgc2V0TG9jYWxlOiBmdW5jdGlvbihsb2NhbGUpe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdTRVRfTE9DQUxFJyxcbiAgICAgICdwYXlsb2FkJzogbG9jYWxlXG4gICAgfVxuICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgZGlzcGxheU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obWVzc2FnZSwgc2V2ZXJpdHkpe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdBRERfTk9USUZJQ0FUSU9OJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAnc2V2ZXJpdHknOiBzZXZlcml0eSxcbiAgICAgICAgJ21lc3NhZ2UnOiBtZXNzYWdlXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBoaWRlTm90aWZpY2F0aW9uOiBmdW5jdGlvbihub3RpZmljYXRpb24pe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdISURFX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IG5vdGlmaWNhdGlvblxuICAgIH1cbiAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gIGxvZ291dCgpe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdMT0dPVVQnXG4gICAgfVxuICB9XG59OyIsImltcG9ydCBEaWFsb2cgZnJvbSAnLi4vZ2VuZXJhbC9kaWFsb2cuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIEZvcmdvdFBhc3N3b3JkRGlhbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGxldCBjb250ZW50ID0gKDxkaXY+XG4gICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5pbnN0cnVjdGlvbnMnKX1cbiAgICAgICAgPGJyLz5cbiAgICAgICAgPGJyLz5cbiAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1yb3dcIj5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZm9yZ290cGFzc3dvcmQtZW1haWxcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuZW1haWwnKX08L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIi8+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiZm9ybS1oaWRkZW5cIiBpZD1cImZvcm0tcmVzZXQtcGFzc3dvcmQtc3VibWl0XCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj4pO1xuICAgIGxldCBmb290ZXIgPSAoY2xvc2VEaWFsb2cpPT57XG4gICAgICByZXR1cm4gPGRpdj5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3JtLXJlc2V0LXBhc3N3b3JkLXN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tbGFyZ2VcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuc2VuZEJ1dHRvbkxhYmVsJyl9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tbGFyZ2UgYnV0dG9uLXdhcm5cIiBvbkNsaWNrPXtjbG9zZURpYWxvZ30+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLmNhbmNlbEJ1dHRvbkxhYmVsJyl9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvZGl2PlxuICAgIH1cbiAgICByZXR1cm4gPERpYWxvZyB0aXRsZT17dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cudGl0bGUnKX1cbiAgICAgIGNvbnRlbnQ9e2NvbnRlbnR9IGZvb3Rlcj17Zm9vdGVyfSBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufT5cbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgPC9EaWFsb2c+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRm9yZ290UGFzc3dvcmREaWFsb2cpOyIsIi8vVE9ETyB1bmxpa2UgbGFuZ3VhZ2UgY2hhbmdlLCBsb2dpbiBpbiBuZWVkcyB0byBlc2NhcGUgdGhlIGN1cnJlbnRcbi8vcGFnZSBoZW5jZSBpdCBkb2Vzbid0IHJlYWxseSBuZWVkIGEgcmVkdWNlciwgaG93ZXZlciBpdCBjb3VsZCBiZSBpbXBsbWVudGVkXG4vL2lmIGV2ZXIgd2Ugd2lzaCB0byB0dXJuIGl0IGludG8gYSBTUEFcblxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMaW5rIGZyb20gJy4uL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBMb2dpbkJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMubG9naW4gPSB0aGlzLmxvZ2luLmJpbmQodGhpcyk7XG4gIH1cbiAgbG9naW4oKXtcbiAgICAvL1RPRE8gcGxlYXNlIGxldCdzIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMgcmF0aGVyIHRoYW4gdGhlIGVtdWxhdGVkIHdheVxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCQoXCIjbG9naW5cIikuYXR0cihcImhyZWZcIikpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPExpbmsgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1sb2dpbmB9IG9uQ2xpY2s9e3RoaXMubG9naW59PlxuICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmxvZ2luLmJ1dHRvbkxhYmVsJyl9PC9zcGFuPlxuICAgIDwvTGluaz4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKExvZ2luQnV0dG9uKTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5jbGFzcyBOb3RpZmljYXRpb25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW1zXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubm90aWZpY2F0aW9ucy5tYXAoKG5vdGlmaWNhdGlvbik9PntcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtub3RpZmljYXRpb24uaWR9IGNsYXNzTmFtZT17XCJub3RpZmljYXRpb24tcXVldWUtaXRlbSBub3RpZmljYXRpb24tcXVldWUtaXRlbS1cIiArIG5vdGlmaWNhdGlvbi5zZXZlcml0eX0+XG4gICAgICAgICAgICAgICAgPHNwYW4+e25vdGlmaWNhdGlvbi5tZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbS1jbG9zZVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuaGlkZU5vdGlmaWNhdGlvbi5iaW5kKHRoaXMsIG5vdGlmaWNhdGlvbil9PjwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiAgXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIG5vdGlmaWNhdGlvbnM6IHN0YXRlLm5vdGlmaWNhdGlvbnNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE5vdGlmaWNhdGlvbnMpOyIsImltcG9ydCBGcm9udHBhZ2VOYXZiYXIgZnJvbSAnLi9uYXZiYXIuanN4JztcbmltcG9ydCBGcm9udHBhZ2VGZWVkIGZyb20gJy4vZmVlZC5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBGcm9udHBhZ2VCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICB0aGlzLmFkZENhcm91c2VscygpO1xuICB9XG4gIGFkZENhcm91c2Vscygpe1xuICAgIC8vVE9ETyB0aGlzIHBpZWNlIG9mIGNvZGUgdXMgZGVwcmVjYXRlZCBhbmQgdXNlcyBqcXVlcnksIG5vdGljZSB0aGF0IHRoaXNcbiAgICAvL3dpbGwgYmUgdmVyeSBidWdneSBpZiBldmVyIHRoZSBmcm9udHBhZ2UgYm9keSB1cGRhdGVzLCBlZyBtYWtpbmcgdGhlIGkxOCByZWR1Y2VyIG1vcmUgZWZmaWNpZW50XG4gICAgLy9vciBhZGRpbmcgYW5vdGhlciByZWR1Y2VyIHRoYXQgY2F1c2VzIGNoYW5nZXMgdG8gdGhlIGJvZHkgcHJvcGVydGllc1xuICAgIC8vd2UgbmVlZCB0byByZXBhY2UgdGhpcyBpZiBldmVyIGdvaW5nIHRvIG1ha2UgYm9keSB0byB1cGRhdGVcbiAgICAgIFxuICAgICQoJzxsaW5rLz4nLCB7XG4gICAgICByZWw6ICdzdHlsZXNoZWV0JyxcbiAgICAgIHR5cGU6ICd0ZXh0L2NzcycsXG4gICAgICBocmVmOiAnLy9jZG4ubXVpa2t1dmVya2tvLmZpL2xpYnMvc2xpY2svMS42LjAvc2xpY2suY3NzJ1xuICAgIH0pLmFwcGVuZFRvKCdoZWFkJyk7XG4gICAgICBcbiAgICAkLmdldFNjcmlwdChcIi8vY2RuLm11aWtrdXZlcmtrby5maS9saWJzL3NsaWNrLzEuNi4wL3NsaWNrLm1pbi5qc1wiLCBmdW5jdGlvbiggZGF0YSwgdGV4dFN0YXR1cywganF4aHIgKSB7XG4gICAgICAkKFwiLmNhcm91c2VsLWl0ZW1cIikuZWFjaCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgICAgICQoZWxlbWVudCkuc2hvdygpO1xuICAgICAgfSk7XG5cbiAgICAgICQoXCIuY2Fyb3VzZWxcIikuZWFjaCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgICAgICQoZWxlbWVudCkuc2xpY2soe1xuICAgICAgICAgIGFwcGVuZERvdHM6ICQoZWxlbWVudCkuc2libGluZ3MoXCIuY2Fyb3VzZWwtY29udHJvbHNcIiksXG4gICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgIGRvdHNDbGFzczogXCJjYXJvdXNlbC1kb3RzXCIsXG4gICAgICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgICAgICBzcGVlZDogNzUwLFxuICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiBmYWxzZSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjksXG4gICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZmFkZTogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZW1iYmVkIGVtYmJlZC1mdWxsXCI+XG48RnJvbnRwYWdlTmF2YmFyIC8+XG4gICAgICAgICAgICBcbjxoZWFkZXIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGhlcm9cIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLXdyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUgYnViYmxlLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtdGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnN0dWRlbnRBcHBsaWNhdGlvbkJ1YmJsZS50aXRsZScpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtY29udGVudFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc3R1ZGVudEFwcGxpY2F0aW9uQnViYmxlLmRlc2NyaXB0aW9uJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1idXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1zb2Z0IGJ1dHRvbi1keW5hbWljLWhlaWdodCBidXR0b24td2FybiBidXR0b24tZm9jdXNcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc3R1ZGVudEFwcGxpY2F0aW9uQnViYmxlLmxpbmsnKX1cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLWl0ZW1cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLW11aWtrdS1sb2dvXCI+XG4gICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGxvZ28gZnJvbnRwYWdlLWxvZ28tbXVpa2t1LXZlcmtrb1wiIHNyYz1cIi9nZngvb2Ytc2l0ZS1sb2dvLnBuZ1wiPjwvaW1nPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtdXBwZXJjYXNlXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1tdWlra3UtYXV0aG9yXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zaXRlLmF1dGhvcicpfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtbXVpa2t1XCI+TVVJS0tVPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC12ZXJra29cIj5WRVJLS088L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC11cHBlcmNhc2UgZnJvbnRwYWdlLXRleHQtbXVpa2t1LWRlc2NyaXB0aW9uXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zaXRlLmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLWl0ZW1cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlIGJ1YmJsZS1yZXNwb25zaXZlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5vcGVuTWF0ZXJpYWxzQnViYmxlLnRpdGxlJyl9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWNvbnRlbnRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLm9wZW5NYXRlcmlhbHNCdWJibGUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tc29mdCBidXR0b24tZHluYW1pYy1oZWlnaHQgYnV0dG9uLXdhcm5cIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLm9wZW5NYXRlcmlhbHNCdWJibGUubGluaycpfTwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2hlYWRlcj5cblxuPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugc2VwYXJhdG9yXCI+PC9kaXY+XG5cbjxkaXYgY2xhc3NOYW1lPVwic2NyZWVuLWNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbi1jb250YWluZXItd3JhcHBlclwiPlxuICAgICAgICAgIFxuICAgIDxzZWN0aW9uIGlkPVwic3R1ZHlpbmdcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvblwiPlxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnNlY3Rpb25UaXRsZS5zdHVkeWluZycpfTwvaDI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBvcmRlcmVkLWNvbnRhaW5lci1yb3cgb3JkZXJlZC1jb250YWluZXItcmVzcG9uc2l2ZSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItc3R1ZHlpbmdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY2FyZCBmcm9udHBhZ2UtY2FyZC1zdHVkeWluZ1wiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhX25ldHRpbHVraW8ucG5nXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLm5ldHRpbHVraW8udGl0bGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlsdWtpby5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtZm9vdGVyXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm5ldHRpbHVraW8uZmkvbmV0dGlsdWtpb19lc2l0dGVseVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLXN0dWR5aW5nLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLXNjaG9vbFwiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhX25ldHRpcGVydXNrb3VsdS5wbmdcIlxuICAgICAgICAgICAgICBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlwZXJ1c2tvdWx1LnRpdGxlJyl9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLm5ldHRpcGVydXNrb3VsdS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtZm9vdGVyXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm5ldHRpbHVraW8uZmkvZXNpdHRlbHlfbmV0dGlwa1wiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLXNjaG9vbC1yZWFkbW9yZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5yZWFkTW9yZS5saW5rJyl9IDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY2FyZCBmcm9udHBhZ2UtY2FyZC1jb3Vyc2VzXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfYWluZW9waXNrZWx1LnBuZ1wiXG4gICAgICAgICAgICAgIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5haW5lb3Bpc2tlbHUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcuYWluZW9waXNrZWx1LmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9lc2l0dGVseV9uZXR0aXBrXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tY291cnNlcy1yZWFkbW9yZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5yZWFkTW9yZS5saW5rJyl9IDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cblxuICAgIDxzZWN0aW9uIGlkPVwidmlkZW9zXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWxcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9PRDVPajUwdnloMD9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9DSmNwV1pEMFZUOD9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvRWJKbldJeU9KTmc/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL2lPS1VvQUFRN1VrP3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1jb250cm9sc1wiPjwvZGl2PlxuICAgIDwvc2VjdGlvbj5cblxuICAgIDxzZWN0aW9uIGlkPVwibmV3c1wiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uXCI+XG5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zZWN0aW9uVGl0bGUubmV3cycpfTwvaDI+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1uZXdzXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3Mtc3ViY29udGFpbmVyXCI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUuZXZlbnRzJyl9PC9oMj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlLWV2ZW50cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZyb250cGFnZUZlZWQgcXVlcnlPcHRpb25zPXt7bnVtSXRlbXM6IDQsIG9yZGVyOiBcIkFTQ0VORElOR1wifX0gZmVlZFJlYWRUYXJnZXQ9XCJvb2V2ZW50c1wiPjwvRnJvbnRwYWdlRmVlZD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZyb250cGFnZUJveFRpdGxlLm5ld3MnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtbmV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZyb250cGFnZUZlZWQgcXVlcnlPcHRpb25zPXt7bnVtSXRlbXM6IDV9fSBmZWVkUmVhZFRhcmdldD1cIm9vbmV3c1wiPjwvRnJvbnRwYWdlRmVlZD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIG9yZGVyZWQtY29udGFpbmVyLXJvdyBvcmRlcmVkLWNvbnRhaW5lci1yZXNwb25zaXZlIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1uZXdzLXN1YmNvbnRhaW5lclwiPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLWNhcmQtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWxcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmExLmpwZ1wiIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2UxJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmEyLmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTInKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTMuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTMnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTQuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlNCcpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhNS5qcGdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWNvbnRyb2xzXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2UtY2FyZC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZyb250cGFnZUJveFRpdGxlLmJsb2dzJyl9PC9oMj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlLWJsb2dzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNn19XG4gICAgICAgICAgICAgICAgICAgICBmZWVkUmVhZFRhcmdldD1cImVvcHBpbWlza2Vza3VzLG9wZW4sZWJhcm9tZXRyaSxtYXRza3VsYSxvcHBpbWluZW4scG9sa3VqYSxyZWlzc3V2aWhrbyxqYWxraWFcIj48L0Zyb250cGFnZUZlZWQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG5cbiAgICA8c2VjdGlvbiBpZD1cIm9yZ2FuaXphdGlvblwiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uIGZyb250cGFnZS1jYXJkLWNvbnRhaW5lclwiPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLW90YXZhbi1vcGlzdG9cIj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItb3RhdmFuLW9waXN0by1pbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1pdGVtLW90YXZhbi1vcGlzdG8tc29jaWFsLW1lZGlhXCI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLW90YXZhbi1vcGlzdG8tc29jaWFsLW1lZGlhXCI+XG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LXVwcGVyY2FzZSBmcm9udHBhZ2UtdGV4dC1vdGF2YW4tb3Bpc3RvLWluZm8tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ub3JnYW5pemF0aW9uLnNvbWUudGl0bGUnKX1cbiAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbi1zb2NpYWwgaWNvbiBpY29uLXNvbWUtZmFjZWJvb2tcIiBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL290YXZhbm9waXN0b1wiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbi1zb2NpYWwgaWNvbiBpY29uLXNvbWUtdHdpdHRlclwiIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL090YXZhbk9waXN0b1wiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbi1zb2NpYWwgaWNvbiBpY29uLXNvbWUtaW5zdGFncmFtXCIgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vb3RhdmFub3Bpc3RvL1wiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbi1zb2NpYWwgaWNvbiBpY29uLXNvbWUtcGludGVyZXN0XCIgaHJlZj1cImh0dHBzOi8vZmkucGludGVyZXN0LmNvbS9vdGF2YW5vcGlzdG8vXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1saW5rZWRpblwiIGhyZWY9XCJodHRwczovL3d3dy5saW5rZWRpbi5jb20vY29tcGFueS8xMDYwMjhcIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItb3RhdmFuLW9waXN0by1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtbXVsdGlwYXJhZ3JhcGggZnJvbnRwYWdlLXRleHQtb3RhdmFuLW9waXN0by1pbmZvLWRlc2NyaXB0aW9uXCJcbiAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogdGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ub3JnYW5pemF0aW9uLmRlc2NyaXB0aW9uJyl9fT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm90YXZhbm9waXN0by5maVwiIHRhcmdldD1cInRvcFwiIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi13ZWJzaXRlXCI+XG4gICAgICAgICAgICAgICAgd3d3Lm90YXZhbm9waXN0by5maVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm90YXZhbm9waXN0by5maS91dXRpc2tpcmplXCIgdGFyZ2V0PVwidG9wXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLW5ld3NsZXR0ZXJcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ub3JnYW5pemF0aW9uLm5ld3NsZXR0ZXIubGluaycpfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItaXRlbS1vdGF2YW4tb3Bpc3RvLWxvZ29cIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiL2dmeC9vZi1vcmdhbml6YXRpb24tbG9nby5qcGdcIiBhbHQ9XCJsb2dvXCIgdGl0bGU9XCJsb2dvXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPGZvb3RlciBjbGFzc05hbWU9XCJmcm9udHBhZ2UgZm9vdGVyXCIgaWQ9XCJjb250YWN0XCI+XG4gIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWNvbnRhaW5lclwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWl0ZW0gZnJvbnRwYWdlLWZvb3Rlci1pdGVtLWNvbnRhY3RcIj5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5jb250YWN0LnRpdGxlJyl9PC9oMj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXMtaW5mb3JtYXRpb25cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pY29uIGljb24tbG9jYXRpb25cIj48L3NwYW4+XG4gICAgICAgIDxiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIuc3RyZWV0QWRkcmVzcy5sYWJlbCcpfTwvYj5cbiAgICAgICAgPHNwYW4+T3RhdmFudGllIDIgQiwgNTA2NzAgT3RhdmE8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzLWluZm9ybWF0aW9uXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaWNvbiBpY29uLXBob25lXCI+PC9zcGFuPlxuICAgICAgICA8Yj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLnBob25lTnVtYmVyLmxhYmVsJyl9PC9iPlxuICAgICAgICA8c3Bhbj4wMTUgMTk0wqAzNTUyPC9zcGFuPlxuICAgICAgPC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11cy1pbmZvcm1hdGlvblwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWljb24gaWNvbi1lbnZlbG9wZVwiPjwvc3Bhbj5cbiAgICAgICAgPGI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5lbWFpbEFkZHJlc3MubGFiZWwnKX08L2I+XG4gICAgICAgIDxzcGFuPmluZm9Ab3RhdmFub3Bpc3RvLmZpPC9zcGFuPlxuICAgICAgPC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWl0ZW0gZnJvbnRwYWdlLWZvb3Rlci1pdGVtLWxvZ29zXCI+XG4gICAgICA8aW1nIHNyYz1cIi9nZngvYWxrdV91dWRlbGxlLmpwZ1wiIGFsdD1cIlwiIHRpdGxlPVwiXCIgY2xhc3NOYW1lPVwibG9nb1wiIC8+XG4gICAgICA8aW1nIHNyYz1cIi9nZngvZm9vdGVyX2xvZ28uanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiBjbGFzc05hbWU9XCJsb2dvXCIgLz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Zvb3Rlcj5cbiAgICAgICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGcm9udHBhZ2VCb2R5KTsiLCJpbXBvcnQgRmVlZCBmcm9tICcuLi9nZW5lcmFsL2ZlZWQuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcm9udHBhZ2VGZWVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBmZWVkUmVhZFRhcmdldDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5T3B0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW50cmllczogW11cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICBtQXBpKCkuZmVlZC5mZWVkcy5yZWFkKHRoaXMucHJvcHMuZmVlZFJlYWRUYXJnZXQsIHRoaXMucHJvcHMucXVlcnlPcHRpb25zKS5jYWxsYmFjaygoZXJyLCBlbnRyaWVzKT0+e1xuICAgICAgaWYgKCFlcnIpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlbnRyaWVzfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxGZWVkIGVudHJpZXM9e3RoaXMuc3RhdGUuZW50cmllc30+PC9GZWVkPlxuICB9XG59IiwiaW1wb3J0IE5hdmJhciBmcm9tICcuLi9nZW5lcmFsL25hdmJhci5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgTG9naW5CdXR0b24gZnJvbSAnLi4vYmFzZS9sb2dpbi1idXR0b24uanN4JztcbmltcG9ydCBGb3Jnb3RQYXNzd29yZERpYWxvZyBmcm9tICcuLi9iYXNlL2ZvcmdvdC1wYXNzd29yZC1kaWFsb2cuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgRnJvbnRwYWdlTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPE5hdmJhciBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIiBuYXZiYXJJdGVtcz17W1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwic3R1ZHlpbmdcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjc3R1ZHlpbmdcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsuc3R1ZHlpbmcnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJuZXdzXCIsXG4gICAgICAgIGl0ZW06ICg8TGluayBocmVmPVwiI25ld3NcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsubmV3cycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcIm90YXZhbi1vcGlzdG9cIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjb3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm90YXZhbk9waXN0bycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbnRhY3RcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjY29udGFjdFwiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5jb250YWN0Jyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwib3Blbi1tYXRlcmlhbHNcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIvY291cnNlcGlja2VyXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWhpZ2hsaWdodCBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm9wZW5NYXRlcmlhbHMnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH1cbiAgICBdfSBkZWZhdWx0T3B0aW9ucz17W1xuICAgICAgKDxMb2dpbkJ1dHRvbiBrZXk9XCIwXCIgY2xhc3NOYW1lRXh0ZW5zaW9uPVwiZnJvbnRwYWdlXCIvPiksXG4gICAgICAoPEZvcmdvdFBhc3N3b3JkRGlhbG9nIGtleT1cIjFcIiBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIj48TGluayBjbGFzc05hbWU9XCJmcm9udHBhZ2UgbGFiZWwgbGFiZWwtZHluYW1pYy13b3JkLWJyZWFrIGxhYmVsLWNsaWNrYWJsZSBmcm9udHBhZ2UtbGFiZWwtZm9yZ290LXBhc3N3b3JkIGZyb250cGFnZS1pbnRlcmFjdC1mb3Jnb3QtcGFzc3dvcmRcIj5cbiAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RMaW5rJyl9PC9zcGFuPlxuICAgICAgIDwvTGluaz48L0ZvcmdvdFBhc3N3b3JkRGlhbG9nPilcbiAgICBdfSBtZW51SXRlbXM9e1tcbiAgICAgICAoPExpbmsgaHJlZj1cIiNzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5zdHVkeWluZycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNuZXdzXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm5ld3MnKX08L3NwYW4+PC9MaW5rPiksXG4gICAgICAgKDxMaW5rIGhyZWY9XCIjb3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm90YXZhbk9waXN0bycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNjb250YWN0XCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLmNvbnRhY3QnKX08L3NwYW4+PC9MaW5rPiksXG4gICAgICAgKDxMaW5rIGhyZWY9XCIvY291cnNlcGlja2VyXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWhpZ2hsaWdodCBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm9wZW5NYXRlcmlhbHMnKX08L3NwYW4+PC9MaW5rPilcbiAgICBdfS8+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRnJvbnRwYWdlTmF2YmFyKTtcbiIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUG9ydGFsIGZyb20gJy4vcG9ydGFsLmpzeCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY29udGVudDogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBmb290ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk92ZXJsYXlDbGljayA9IHRoaXMub25PdmVybGF5Q2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICB0aGlzLnJlZnMucG9ydGFsLmNsb3NlUG9ydGFsKCk7XG4gIH1cbiAgb25PdmVybGF5Q2xpY2soZSl7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvbk9wZW4oKXtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSwgMTApO1xuICB9XG4gIGJlZm9yZUNsb3NlKERPTU5vZGUsIHJlbW92ZUZyb21ET00pe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KHJlbW92ZUZyb21ET00sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8UG9ydGFsIHJlZj1cInBvcnRhbFwiIG9wZW5CeUNsaWNrT249e3RoaXMucHJvcHMuY2hpbGRyZW59IG9uT3Blbj17dGhpcy5vbk9wZW59IGJlZm9yZUNsb3NlPXt0aGlzLmJlZm9yZUNsb3NlfSBjbG9zZU9uRXNjPlxuPGRpdiBjbGFzc05hbWU9e2BkaWFsb2cgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tZGlhbG9nICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifWB9IG9uQ2xpY2s9e3RoaXMub25PdmVybGF5Q2xpY2t9PlxuICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy13aW5kb3dcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy10aXRsZVwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaWFsb2ctY2xvc2UgaWNvbiBpY29uLWNsb3NlXCIgb25DbGljaz17dGhpcy5jbG9zZX0+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5jb250ZW50fVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1mb290ZXJcIj5cbiAgICAgICAge3RoaXMucHJvcHMuZm9vdGVyKHRoaXMuY2xvc2UpfVxuICAgICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4gICAgICAgIDwvUG9ydGFsPik7XG4gIH1cbn0iLCJpbXBvcnQgUG9ydGFsIGZyb20gJy4vcG9ydGFsLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG9wOiBudWxsLFxuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIGFycm93TGVmdDogbnVsbCxcbiAgICAgIGFycm93UmlnaHQ6IG51bGwsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbk9wZW4oRE9NTm9kZSl7XG4gICAgbGV0ICR0YXJnZXQgPSAkKHRoaXMucmVmcy5hY3RpdmF0b3IpO1xuICAgIGxldCAkYXJyb3cgPSAkKHRoaXMucmVmcy5hcnJvdyk7XG4gICAgbGV0ICRkcm9wZG93biA9ICQodGhpcy5yZWZzLmRyb3Bkb3duKTtcbiAgICAgIFxuICAgIGxldCBwb3NpdGlvbiA9ICR0YXJnZXQub2Zmc2V0KCk7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgbGV0IG1vcmVTcGFjZUluVGhlTGVmdFNpZGUgPSAod2luZG93V2lkdGggLSBwb3NpdGlvbi5sZWZ0KSA8IHBvc2l0aW9uLmxlZnQ7XG4gICAgXG4gICAgbGV0IGxlZnQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0IC0gJGRyb3Bkb3duLm91dGVyV2lkdGgoKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdDtcbiAgICB9XG4gICAgbGV0IHRvcCA9IHBvc2l0aW9uLnRvcCArICR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDU7XG4gICAgXG4gICAgbGV0IGFycm93TGVmdCA9IG51bGw7XG4gICAgbGV0IGFycm93UmlnaHQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGFycm93UmlnaHQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3dMZWZ0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe3RvcCwgbGVmdCwgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0LCB2aXNpYmxlOiB0cnVlfSk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICBjbG9zZSgpe1xuICAgIHRoaXMucmVmcy5wb3J0YWwuY2xvc2VQb3J0YWwoKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXtSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jaGlsZHJlbiwgeyByZWY6IFwiYWN0aXZhdG9yXCIgfSl9XG4gICAgICBjbG9zZU9uRXNjIGNsb3NlT25PdXRzaWRlQ2xpY2sgY2xvc2VPblNjcm9sbCBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0+XG4gICAgICA8ZGl2IHJlZj1cImRyb3Bkb3duXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubGVmdFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBkcm9wZG93biAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kcm9wZG93bi0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXJyb3dcIiByZWY9XCJhcnJvd1wiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5hcnJvd0xlZnQsIHJpZ2h0OiB0aGlzLnN0YXRlLmFycm93UmlnaHR9fT48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdHlwZW9mIGl0ZW0gPT09IFwiZnVuY3Rpb25cIiA/IGl0ZW0odGhpcy5jbG9zZSkgOiBpdGVtO1xuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAge2VsZW1lbnR9XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvUG9ydGFsPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgRmVlZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZW50cmllczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHB1YmxpY2F0aW9uRGF0ZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGVzY3JpcHRpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGxpbms6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwiZmVlZFwiPlxuICAgICAge3RoaXMucHJvcHMuZW50cmllcy5tYXAoKGVudHJ5LCBpbmRleCk9PntcbiAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJmZWVkLWl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmZWVkLWl0ZW0tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIDxhIGhyZWY9e2VudHJ5Lmxpbmt9IHRhcmdldD1cInRvcFwiPntlbnRyeS50aXRsZX08L2E+XG4gICAgICAgICAgICB7ZW50cnkuZGVzY3JpcHRpb259XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZlZWQtaXRlbS1kYXRlXCI+e3RoaXMucHJvcHMuaTE4bi50aW1lLmZvcm1hdChlbnRyeS5wdWJsaWNhdGlvbkRhdGUpfTwvc3Bhbj5cbiAgICAgICAgPC9saT5cbiAgICAgIH0pfVxuICAgIDwvdWw+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRmVlZCk7IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIHNjcm9sbFRvU2VjdGlvbihhbmNob3IpIHtcbiAgbGV0IHRvcE9mZnNldCA9IDkwO1xuICBsZXQgc2Nyb2xsVG9wID0gJChhbmNob3IpLm9mZnNldCgpLnRvcCAtIHRvcE9mZnNldDtcblxuICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgIHNjcm9sbFRvcCA6IHNjcm9sbFRvcFxuICB9LCB7XG4gICAgZHVyYXRpb24gOiA1MDAsXG4gICAgZWFzaW5nIDogXCJlYXNlSW5PdXRRdWFkXCJcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbkNsaWNrKGUsIHJlKXtcbiAgICBpZiAodGhpcy5wcm9wcy5ocmVmICYmIHRoaXMucHJvcHMuaHJlZlswXSA9PT0gJyMnKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNjcm9sbFRvU2VjdGlvbih0aGlzLnByb3BzLmhyZWYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKXtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiB0cnVlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBmYWxzZX0pO1xuICAgIHRoaXMub25DbGljayhlLCByZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaEVuZCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hFbmQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPGEgey4uLnRoaXMucHJvcHN9XG4gICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lICsgKHRoaXMuc3RhdGUuYWN0aXZlID8gXCIgYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja30gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfS8+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExhbmd1YWdlUGlja2VyIGZyb20gJy4vbmF2YmFyL2xhbmd1YWdlLXBpY2tlci5qc3gnO1xuaW1wb3J0IFByb2ZpbGVJdGVtIGZyb20gJy4vbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3gnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi9uYXZiYXIvbWVudS5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9wZW5NZW51ID0gdGhpcy5vcGVuTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VNZW51ID0gdGhpcy5jbG9zZU1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9XG4gIH1cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZiYXJJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGl0ZW06IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZCxcbiAgICBtZW51SXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkLFxuICAgIGRlZmF1bHRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZFxuICB9XG4gIG9wZW5NZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgY2xvc2VNZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH0pO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufWB9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWxvZ29cIj48L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tbWVudS1idXR0b25gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1pY29uIGxpbmstZnVsbGB9IG9uQ2xpY2s9e3RoaXMub3Blbk1lbnV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbmF2aWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5hdmJhckl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLSR7aXRlbS5jbGFzc05hbWVTdWZmaXh9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLml0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGl0ZW09PiEhaXRlbSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZGVmYXVsdE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgPFByb2ZpbGVJdGVtIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3VhZ2VQaWNrZXIgY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICAgIDxNZW51IG9wZW49e3RoaXMuc3RhdGUuaXNNZW51T3Blbn0gb25DbG9zZT17dGhpcy5jbG9zZU1lbnV9IGl0ZW1zPXt0aGlzLnByb3BzLm1lbnVJdGVtc30gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uLy4uL2FjdGlvbnMvYmFzZS9sb2NhbGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICcuLi9kcm9wZG93bi5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuY2xhc3MgTGFuZ3VhZ2VQaWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8RHJvcGRvd24gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gY2xhc3NOYW1lU3VmZml4PVwibGFuZ3VhZ2UtcGlja2VyXCIgaXRlbXM9e3RoaXMucHJvcHMubG9jYWxlcy5hdmFsaWFibGUubWFwKChsb2NhbGUpPT57XG4gICAgICByZXR1cm4gKDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstbGFuZ3VhZ2UtcGlja2VyYH0gb25DbGljaz17dGhpcy5wcm9wcy5zZXRMb2NhbGUuYmluZCh0aGlzLCBsb2NhbGUubG9jYWxlKX0+XG4gICAgICAgIDxzcGFuPntsb2NhbGUubmFtZX08L3NwYW4+XG4gICAgICA8L2E+KTtcbiAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBidXR0b24tcGlsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1idXR0b24tcGlsbC1sYW5ndWFnZWB9PlxuICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5sb2NhbGVzLmN1cnJlbnR9PC9zcGFuPlxuICAgICAgPC9hPlxuICAgIDwvRHJvcGRvd24+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBsb2NhbGVzOiBzdGF0ZS5sb2NhbGVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYW5ndWFnZVBpY2tlcik7IiwiaW1wb3J0IExpbmsgZnJvbSAnLi4vbGluay5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgTWVudSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaE1vdmUgPSB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vcGVuID0gdGhpcy5vcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlQnlPdmVybGF5ID0gdGhpcy5jbG9zZUJ5T3ZlcmxheS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkaXNwbGF5ZWQ6IHByb3BzLm9wZW4sXG4gICAgICB2aXNpYmxlOiBwcm9wcy5vcGVuLFxuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZzogbnVsbCxcbiAgICAgIG9wZW46IHByb3BzLm9wZW5cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xuICAgIGlmIChuZXh0UHJvcHMub3BlbiAmJiAhdGhpcy5zdGF0ZS5vcGVuKXtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy5vcGVuICYmIHRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlKXtcbiAgICB0aGlzLnNldFN0YXRlKHsnZHJhZ2dpbmcnOiB0cnVlfSk7XG4gICAgdGhpcy50b3VjaENvcmRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYID0gMDtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb25Ub3VjaE1vdmUoZSl7XG4gICAgbGV0IGRpZmZYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHRoaXMudG91Y2hDb3JkWDtcbiAgICBsZXQgYWJzb2x1dGVEaWZmZXJlbmNlWCA9IE1hdGguYWJzKGRpZmZYIC0gdGhpcy5zdGF0ZS5kcmFnKTtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYICs9IGFic29sdXRlRGlmZmVyZW5jZVg7XG5cbiAgICBpZiAoZGlmZlggPiAwKSB7XG4gICAgICBkaWZmWCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWc6IGRpZmZYfSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hFbmQoZSl7XG4gICAgbGV0IHdpZHRoID0gJCh0aGlzLnJlZnMubWVudUNvbnRhaW5lcikud2lkdGgoKTtcbiAgICBsZXQgZGlmZiA9IHRoaXMuc3RhdGUuZHJhZztcbiAgICBsZXQgbW92ZW1lbnQgPSB0aGlzLnRvdWNoTW92ZW1lbnRYO1xuICAgIFxuICAgIGxldCBtZW51SGFzU2xpZGVkRW5vdWdoRm9yQ2xvc2luZyA9IE1hdGguYWJzKGRpZmYpID49IHdpZHRoKjAuMzM7XG4gICAgbGV0IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSA9IGUudGFyZ2V0ID09PSB0aGlzLnJlZnMubWVudSAmJiBtb3ZlbWVudCA8PSA1O1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZEFMaW5rID0gZS50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2luZzogZmFsc2V9KTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBudWxsfSk7XG4gICAgICBpZiAobWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgfHwgeW91SnVzdENsaWNrZWRUaGVPdmVybGF5IHx8IHlvdUp1c3RDbGlja2VkQUxpbmspe1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvcGVuKCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiB0cnVlLCBvcGVuOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmlzaWJsZTogdHJ1ZX0pO1xuICAgIH0sIDEwKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJ2hpZGRlbid9KTtcbiAgfVxuICBjbG9zZUJ5T3ZlcmxheShlKXtcbiAgICBsZXQgaXNPdmVybGF5ID0gZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldDtcbiAgICBsZXQgaXNMaW5rID0gISFlLnRhcmdldC5ocmVmO1xuICAgIGlmICghdGhpcy5zdGF0ZS5kcmFnZ2luZyAmJiAoaXNPdmVybGF5IHx8IGlzTGluaykpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBjbG9zZSgpe1xuICAgICQoZG9jdW1lbnQuYm9keSkuY3NzKHsnb3ZlcmZsb3cnOiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiBmYWxzZSwgb3BlbjogZmFsc2V9KTtcbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH0sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IG1lbnUgJHt0aGlzLnN0YXRlLmRpc3BsYXllZCA/IFwiZGlzcGxheWVkXCIgOiBcIlwifSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLmRyYWdnaW5nID8gXCJkcmFnZ2luZ1wiIDogXCJcIn1gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNsb3NlQnlPdmVybGF5fSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoTW92ZT17dGhpcy5vblRvdWNoTW92ZX0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfSByZWY9XCJtZW51XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWNvbnRhaW5lclwiIHJlZj1cIm1lbnVDb250YWluZXJcIiBzdHlsZT17e2xlZnQ6IHRoaXMuc3RhdGUuZHJhZ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtZW51LWhlYWRlci1idXR0b24tY2xvc2UgaWNvbiBpY29uLWFycm93LWxlZnRcIj48L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJtZW51LWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGtleT17aW5kZXh9PntpdGVtfTwvbGk+XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtIG1lbnUtaXRlbS1zcGFjZVwiPjwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtcHJvZmlsZVwiIGhyZWY9XCIvcHJvZmlsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9iamVjdCBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLXByb2ZpbGUtaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPVwiL3Jlc3QvdXNlci9maWxlcy91c2VyLyN7c2Vzc2lvbkJhY2tpbmdCZWFuLmxvZ2dlZFVzZXJJZH0vaWRlbnRpZmllci9wcm9maWxlLWltYWdlLTk2XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXVzZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L29iamVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5wcm9maWxlLnByb2ZpbGUnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtaW5zdHJ1Y3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tZm9yZ290cGFzc3dvcmRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmluc3RydWN0aW9ucycpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSBtYWluLWZ1bmN0aW9uLWxpbmstbWVudS1oZWxwZGVza1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWhlbHBkZXNrXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhvbWUuaGVscGRlc2snKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtbG9nb3V0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tc2lnbm91dFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5sb2dvdXQubG9nb3V0Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuLFxuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTWVudSk7XG4gIFxuIiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICcuLi9kcm9wZG93bi5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vLi4vYWN0aW9ucy9iYXNlL3N0YXR1cyc7XG5cbmNsYXNzIFByb2ZpbGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICBpZiAoIXRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJ1c2VyXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4ucHJvZmlsZS5saW5rcy5wZXJzb25hbCcsXG4gICAgICAgIGhyZWY6IFwiL3Byb2ZpbGVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJmb3Jnb3RwYXNzd29yZFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmZvb3Rlci5pbnN0cnVjdGlvbnMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcImhlbHBkZXNrXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4uaG9tZS5oZWxwZGVzaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwic2lnbm91dFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmxvZ291dC5sb2dvdXQnLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLmxvZ291dFxuICAgICAgfVxuICAgIF1cbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cInByb2ZpbGUtbWVudVwiIGl0ZW1zPXtpdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgIHJldHVybiAoY2xvc2VEcm9wZG93bik9PntyZXR1cm4gPExpbmsgaHJlZj1cIi9wcm9maWxlXCJcbiAgICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstcHJvZmlsZS1tZW51YH1cbiAgICAgICAgIG9uQ2xpY2s9eyguLi5hcmdzKT0+e2Nsb3NlRHJvcGRvd24oKTtpdGVtLm9uQ2xpY2sgJiYgaXRlbS5vbkNsaWNrKC4uLmFyZ3MpfX0gaHJlZj17aXRlbS5ocmVmfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX08L3NwYW4+XG4gICAgICAgIDwvTGluaz59XG4gICAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGJ1dHRvbi1waWxsIG1haW4tZnVuY3Rpb24tYnV0dG9uLXBpbGwtcHJvZmlsZVwiPlxuICAgICAgICA8b2JqZWN0IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtZnVsbFwiXG4gICAgICAgICBkYXRhPXtgL3Jlc3QvdXNlci9maWxlcy91c2VyLyR7dGhpcy5wcm9wcy5zdGF0dXMudXNlcklkfS9pZGVudGlmaWVyL3Byb2ZpbGUtaW1hZ2UtOTZgfVxuICAgICAgICAgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdXNlclwiPjwvc3Bhbj5cbiAgICAgICAgPC9vYmplY3Q+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKFByb2ZpbGVJdGVtKTsiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7dW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIsIHVubW91bnRDb21wb25lbnRBdE5vZGUsIGZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nO1xuXG5jb25zdCBLRVlDT0RFUyA9IHtcbiAgRVNDQVBFOiAyN1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0geyBhY3RpdmU6IGZhbHNlIH07XG4gICAgdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2sgPSB0aGlzLmhhbmRsZVdyYXBwZXJDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwgPSB0aGlzLmNsb3NlUG9ydGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayA9IHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleWRvd24gPSB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKG5ld1Byb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBvcnRhbCh0cnVlKTtcbiAgfVxuXG4gIGhhbmRsZVdyYXBwZXJDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMub3BlblBvcnRhbCgpO1xuICB9XG5cbiAgb3BlblBvcnRhbChwcm9wcyA9IHRoaXMucHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKHByb3BzLCB0cnVlKTtcbiAgfVxuXG4gIGNsb3NlUG9ydGFsKGlzVW5tb3VudGVkID0gZmFsc2UpIHtcbiAgICBjb25zdCByZXNldFBvcnRhbFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICB1bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMubm9kZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICBpZiAoaXNVbm1vdW50ZWQgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuYmVmb3JlQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5iZWZvcmVDbG9zZSh0aGlzLm5vZGUsIHJlc2V0UG9ydGFsU3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzZXRQb3J0YWxTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVPdXRzaWRlTW91c2VDbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSBmaW5kRE9NTm9kZSh0aGlzLnBvcnRhbCk7XG4gICAgaWYgKHJvb3QuY29udGFpbnMoZS50YXJnZXQpIHx8IChlLmJ1dHRvbiAmJiBlLmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwoKTtcbiAgfVxuXG4gIGhhbmRsZUtleWRvd24oZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IEtFWUNPREVTLkVTQ0FQRSAmJiB0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclBvcnRhbChwcm9wcywgaXNPcGVuaW5nKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2ppbWZiL2Q5OWUwNjc4ZTlkYTcxNWNjZjY0NTQ5NjFlZjA0ZDFiXG4gICAgaWYgKHR5cGVvZiBwcm9wcy5jaGlsZHJlbi50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjaGlsZHJlbiA9IFJlYWN0LmNsb25lRWxlbWVudChwcm9wcy5jaGlsZHJlbiwge1xuICAgICAgICBjbG9zZVBvcnRhbDogdGhpcy5jbG9zZVBvcnRhbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3J0YWwgPSB1bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcihcbiAgICAgIHRoaXMsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHRoaXMubm9kZSxcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGVcbiAgICApO1xuICAgIFxuICAgIGlmIChpc09wZW5pbmcpIHtcbiAgICAgIHRoaXMucHJvcHMub25PcGVuKHRoaXMubm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5vcGVuQnlDbGlja09uLCB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuUG9ydGFsLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIG9wZW5CeUNsaWNrT246IFByb3BUeXBlcy5lbGVtZW50LFxuICBjbG9zZU9uRXNjOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPbk91dHNpZGVDbGljazogUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25TY3JvbGw6IFByb3BUeXBlcy5ib29sLFxuICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgYmVmb3JlQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblVwZGF0ZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cblBvcnRhbC5kZWZhdWx0UHJvcHMgPSB7XG4gIG9uT3BlbjogKCkgPT4ge30sXG4gIG9uQ2xvc2U6ICgpID0+IHt9LFxuICBvblVwZGF0ZTogKCkgPT4ge31cbn07IiwiaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4JztcbmltcG9ydCBCb2R5IGZyb20gJy4uL2NvbXBvbmVudHMvZnJvbnRwYWdlL2JvZHkuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4RnJvbnRwYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGlkPVwicm9vdFwiPlxuICAgICAgPE5vdGlmaWNhdGlvbnM+PC9Ob3RpZmljYXRpb25zPlxuICAgICAgPEJvZHk+PC9Cb2R5PlxuICAgIDwvZGl2Pik7XG4gIH1cbn0iLCJpbXBvcnQge2xvZ2dlcn0gZnJvbSAncmVkdXgtbG9nZ2VyJztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQcm92aWRlciwgY29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQge3JlbmRlcn0gZnJvbSAncmVhY3QtZG9tJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuQXBwKHJlZHVjZXIsIEFwcCwgY2FsbGJhY2spe1xuICBsZXQgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUobG9nZ2VyLCB0aHVuaykpO1xuXG4gIHJlbmRlcig8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICA8QXBwLz5cbiAgPC9Qcm92aWRlcj4sIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXBwXCIpKTtcbiAgXG4gIGxldCBuZXdTdG9yZSA9IHtcbiAgICBkaXNwYXRjaChhY3Rpb24pe1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbihzdG9yZS5kaXNwYXRjaCwgc3RvcmUuZ2V0U3RhdGUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICB9LFxuICAgIHN1YnNjcmliZSguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5zdWJzY3JpYmUoLi4uYXJncyk7XG4gICAgfSxcbiAgICBnZXRTdGF0ZSguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5nZXRTdGF0ZSguLi5hcmdzKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWR1Y2VyKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLnJlcGxhY2VSZWR1Y2VyKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuICBcbi8vICBjb25zdCBvQ29ubmVjdCA9IFJlYWN0UmVkdXguY29ubmVjdDtcbi8vICBSZWFjdFJlZHV4LmNvbm5lY3QgPSBmdW5jdGlvbihtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcyl7XG4vLyAgICByZXR1cm4gb0Nvbm5lY3QoKHN0YXRlKT0+e1xuLy8gICAgICBsZXQgdmFsdWUgPSBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpO1xuLy8gICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaCgoa2V5KT0+e1xuLy8gICAgICAgIGlmICh0eXBlb2YgdmFsdWVba2V5XSA9PT0gXCJ1bmRlZmluZWRcIil7XG4vLyAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIHN0YXRlIHZhbHVlIGZvciBrZXkgXCIgKyBrZXkgKyBcIiB5b3UgbW9zdCBsaWtlbHkgZm9yZ290IHRvIGNvbWJpbmUgdGhlIHJlZHVjZXJzIHdpdGhpbiB0aGUgcm9vdCByZWR1Y2VyIGZpbGVcIik7XG4vLyAgICAgICAgfVxuLy8gICAgICB9KTtcbi8vICAgIH0sIG1hcERpc3BhdGNoVG9Qcm9wcyk7XG4vLyAgfVxuICBcbiAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobmV3U3RvcmUpO1xufSIsImltcG9ydCBBcHAgZnJvbSAnLi9jb250YWluZXJzL2luZGV4LmZyb250cGFnZS5qc3gnO1xuaW1wb3J0IHJlZHVjZXIgZnJvbSAnLi9yZWR1Y2Vycy9pbmRleC5mcm9udHBhZ2UnO1xuaW1wb3J0IHJ1bkFwcCBmcm9tICcuL2RlZmF1bHQuZGVidWcuanN4JztcbmltcG9ydCB3ZWJzb2NrZXQgZnJvbSAnLi91dGlsL3dlYnNvY2tldCc7XG5cbnJ1bkFwcChyZWR1Y2VyLCBBcHApOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuZnVuY3Rpb24gbWFrZUVtcHR5RnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFyZztcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGFjY2VwdHMgYW5kIGRpc2NhcmRzIGlucHV0czsgaXQgaGFzIG5vIHNpZGUgZWZmZWN0cy4gVGhpcyBpc1xuICogcHJpbWFyaWx5IHVzZWZ1bCBpZGlvbWF0aWNhbGx5IGZvciBvdmVycmlkYWJsZSBmdW5jdGlvbiBlbmRwb2ludHMgd2hpY2hcbiAqIGFsd2F5cyBuZWVkIHRvIGJlIGNhbGxhYmxlLCBzaW5jZSBKUyBsYWNrcyBhIG51bGwtY2FsbCBpZGlvbSBhbGEgQ29jb2EuXG4gKi9cbnZhciBlbXB0eUZ1bmN0aW9uID0gZnVuY3Rpb24gZW1wdHlGdW5jdGlvbigpIHt9O1xuXG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zID0gbWFrZUVtcHR5RnVuY3Rpb247XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zRmFsc2UgPSBtYWtlRW1wdHlGdW5jdGlvbihmYWxzZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVHJ1ZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKHRydWUpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwgPSBtYWtlRW1wdHlGdW5jdGlvbihudWxsKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUaGlzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gIHJldHVybiBhcmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVtcHR5RnVuY3Rpb247IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCcuL2VtcHR5RnVuY3Rpb24nKTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBlbXB0eUZ1bmN0aW9uO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGZvcm1hdCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG5cbiAgd2FybmluZyA9IGZ1bmN0aW9uIHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5pbmRleE9mKCdGYWlsZWQgQ29tcG9zaXRlIHByb3BUeXBlOiAnKSA9PT0gMCkge1xuICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgQ29tcG9zaXRlQ29tcG9uZW50IHByb3B0eXBlIGNoZWNrLlxuICAgIH1cblxuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIgLSAyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHByaW50V2FybmluZy5hcHBseSh1bmRlZmluZWQsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuICB2YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmICh0eXBlU3BlY3MuaGFzT3duUHJvcGVydHkodHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpbnZhcmlhbnQodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ1JlYWN0LlByb3BUeXBlcy4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUpO1xuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICB3YXJuaW5nKCFlcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIEVycm9yLCAnJXM6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAlcyBgJXNgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAlcy4gJyArICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICsgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHNoaW0ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICBpZiAoc2VjcmV0ID09PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgLy8gSXQgaXMgc3RpbGwgc2FmZSB3aGVuIGNhbGxlZCBmcm9tIFJlYWN0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoXG4gICAgICBmYWxzZSxcbiAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICdVc2UgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKCkgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICk7XG4gIH07XG4gIHNoaW0uaXNSZXF1aXJlZCA9IHNoaW07XG4gIGZ1bmN0aW9uIGdldFNoaW0oKSB7XG4gICAgcmV0dXJuIHNoaW07XG4gIH07XG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogc2hpbSxcbiAgICBib29sOiBzaGltLFxuICAgIGZ1bmM6IHNoaW0sXG4gICAgbnVtYmVyOiBzaGltLFxuICAgIG9iamVjdDogc2hpbSxcbiAgICBzdHJpbmc6IHNoaW0sXG4gICAgc3ltYm9sOiBzaGltLFxuXG4gICAgYW55OiBzaGltLFxuICAgIGFycmF5T2Y6IGdldFNoaW0sXG4gICAgZWxlbWVudDogc2hpbSxcbiAgICBpbnN0YW5jZU9mOiBnZXRTaGltLFxuICAgIG5vZGU6IHNoaW0sXG4gICAgb2JqZWN0T2Y6IGdldFNoaW0sXG4gICAgb25lT2Y6IGdldFNoaW0sXG4gICAgb25lT2ZUeXBlOiBnZXRTaGltLFxuICAgIHNoYXBlOiBnZXRTaGltXG4gIH07XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBlbXB0eUZ1bmN0aW9uO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBPbGQgYmVoYXZpb3IgZm9yIHBlb3BsZSB1c2luZyBSZWFjdC5Qcm9wVHlwZXNcbiAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJlxuICAgICAgICAgICAgLy8gQXZvaWQgc3BhbW1pbmcgdGhlIGNvbnNvbGUgYmVjYXVzZSB0aGV5IGFyZSBvZnRlbiBub3QgYWN0aW9uYWJsZSBleGNlcHQgZm9yIGxpYiBhdXRob3JzXG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDNcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAlc2AgcHJvcCBvbiBgJXNgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJyxcbiAgICAgICAgICAgICAgcHJvcEZ1bGxOYW1lLFxuICAgICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgaW4gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzKHByb3BWYWx1ZSwgZXhwZWN0ZWRWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzKTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3BWYWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0ICcgK1xuICAgICAgICAgICdyZWNlaXZlZCAlcyBhdCBpbmRleCAlcy4nLFxuICAgICAgICAgIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSxcbiAgICAgICAgICBpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICAgIGlmIChjaGVja2VyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ10gPT09ICdTeW1ib2wnXG4gICAgaWYgKHByb3BWYWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgZm9yIG5vbi1zcGVjIGNvbXBsaWFudCBTeW1ib2xzIHdoaWNoIGFyZSBwb2x5ZmlsbGVkLlxuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXF1aXZhbGVudCBvZiBgdHlwZW9mYCBidXQgd2l0aCBzcGVjaWFsIGhhbmRsaW5nIGZvciBhcnJheSBhbmQgcmVnZXhwLlxuICBmdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2JqZWN0JyBmb3IgdHlwZW9mIGEgUmVnRXhwLiBXZSdsbCBub3JtYWxpemUgdGhpcyBoZXJlIHNvIHRoYXQgL2JsYS9cbiAgICAgIC8vIHBhc3NlcyBQcm9wVHlwZXMub2JqZWN0LlxuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gVGhpcyBoYW5kbGVzIG1vcmUgdHlwZXMgdGhhbiBgZ2V0UHJvcFR5cGVgLiBPbmx5IHVzZWQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICAvLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cbiAgZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHByb3BWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnICsgcHJvcFZhbHVlO1xuICAgIH1cbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBwb3N0Zml4ZWQgdG8gYSB3YXJuaW5nIGFib3V0IGFuIGludmFsaWQgdHlwZS5cbiAgLy8gRm9yIGV4YW1wbGUsIFwidW5kZWZpbmVkXCIgb3IgXCJvZiB0eXBlIGFycmF5XCJcbiAgZnVuY3Rpb24gZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICByZXR1cm4gJ2FuICcgKyB0eXBlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgIGNhc2UgJ3JlZ2V4cCc6XG4gICAgICAgIHJldHVybiAnYSAnICsgdHlwZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG4gIGZ1bmN0aW9uIGdldENsYXNzTmFtZShwcm9wVmFsdWUpIHtcbiAgICBpZiAoIXByb3BWYWx1ZS5jb25zdHJ1Y3RvciB8fCAhcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIHJldHVybiBBTk9OWU1PVVM7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gY2hlY2tQcm9wVHlwZXM7XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiZcbiAgICBTeW1ib2wuZm9yICYmXG4gICAgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAgIDB4ZWFjNztcblxuICB2YXIgaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH07XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLnJlZHV4TG9nZ2VyPWUucmVkdXhMb2dnZXJ8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZS5zdXBlcl89dCxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6ZSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KX1mdW5jdGlvbiByKGUsdCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJraW5kXCIse3ZhbHVlOmUsZW51bWVyYWJsZTohMH0pLHQmJnQubGVuZ3RoJiZPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInBhdGhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbihlLHQscil7bi5zdXBlcl8uY2FsbCh0aGlzLFwiRVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwibGhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG8oZSx0KXtvLnN1cGVyXy5jYWxsKHRoaXMsXCJOXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJyaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gaShlLHQpe2kuc3VwZXJfLmNhbGwodGhpcyxcIkRcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBhKGUsdCxyKXthLnN1cGVyXy5jYWxsKHRoaXMsXCJBXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpbmRleFwiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcIml0ZW1cIix7dmFsdWU6cixlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gZihlLHQscil7dmFyIG49ZS5zbGljZSgocnx8dCkrMXx8ZS5sZW5ndGgpO3JldHVybiBlLmxlbmd0aD10PDA/ZS5sZW5ndGgrdDp0LGUucHVzaC5hcHBseShlLG4pLGV9ZnVuY3Rpb24gdShlKXt2YXIgdD1cInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOk4oZSk7cmV0dXJuXCJvYmplY3RcIiE9PXQ/dDplPT09TWF0aD9cIm1hdGhcIjpudWxsPT09ZT9cIm51bGxcIjpBcnJheS5pc0FycmF5KGUpP1wiYXJyYXlcIjpcIltvYmplY3QgRGF0ZV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKT9cImRhdGVcIjpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvU3RyaW5nJiYvXlxcLy4qXFwvLy50ZXN0KGUudG9TdHJpbmcoKSk/XCJyZWdleHBcIjpcIm9iamVjdFwifWZ1bmN0aW9uIGwoZSx0LHIsYyxzLGQscCl7cz1zfHxbXSxwPXB8fFtdO3ZhciBnPXMuc2xpY2UoMCk7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGQpe2lmKGMpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGMmJmMoZyxkKSlyZXR1cm47aWYoXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgYz9cInVuZGVmaW5lZFwiOk4oYykpKXtpZihjLnByZWZpbHRlciYmYy5wcmVmaWx0ZXIoZyxkKSlyZXR1cm47aWYoYy5ub3JtYWxpemUpe3ZhciBoPWMubm9ybWFsaXplKGcsZCxlLHQpO2gmJihlPWhbMF0sdD1oWzFdKX19fWcucHVzaChkKX1cInJlZ2V4cFwiPT09dShlKSYmXCJyZWdleHBcIj09PXUodCkmJihlPWUudG9TdHJpbmcoKSx0PXQudG9TdHJpbmcoKSk7dmFyIHk9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpLHY9XCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpOKHQpLGI9XCJ1bmRlZmluZWRcIiE9PXl8fHAmJnBbcC5sZW5ndGgtMV0ubGhzJiZwW3AubGVuZ3RoLTFdLmxocy5oYXNPd25Qcm9wZXJ0eShkKSxtPVwidW5kZWZpbmVkXCIhPT12fHxwJiZwW3AubGVuZ3RoLTFdLnJocyYmcFtwLmxlbmd0aC0xXS5yaHMuaGFzT3duUHJvcGVydHkoZCk7aWYoIWImJm0pcihuZXcgbyhnLHQpKTtlbHNlIGlmKCFtJiZiKXIobmV3IGkoZyxlKSk7ZWxzZSBpZih1KGUpIT09dSh0KSlyKG5ldyBuKGcsZSx0KSk7ZWxzZSBpZihcImRhdGVcIj09PXUoZSkmJmUtdCE9PTApcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJvYmplY3RcIj09PXkmJm51bGwhPT1lJiZudWxsIT09dClpZihwLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdC5saHM9PT1lfSkubGVuZ3RoKWUhPT10JiZyKG5ldyBuKGcsZSx0KSk7ZWxzZXtpZihwLnB1c2goe2xoczplLHJoczp0fSksQXJyYXkuaXNBcnJheShlKSl7dmFyIHc7ZS5sZW5ndGg7Zm9yKHc9MDt3PGUubGVuZ3RoO3crKyl3Pj10Lmxlbmd0aD9yKG5ldyBhKGcsdyxuZXcgaSh2b2lkIDAsZVt3XSkpKTpsKGVbd10sdFt3XSxyLGMsZyx3LHApO2Zvcig7dzx0Lmxlbmd0aDspcihuZXcgYShnLHcsbmV3IG8odm9pZCAwLHRbdysrXSkpKX1lbHNle3ZhciB4PU9iamVjdC5rZXlzKGUpLFM9T2JqZWN0LmtleXModCk7eC5mb3JFYWNoKGZ1bmN0aW9uKG4sbyl7dmFyIGk9Uy5pbmRleE9mKG4pO2k+PTA/KGwoZVtuXSx0W25dLHIsYyxnLG4scCksUz1mKFMsaSkpOmwoZVtuXSx2b2lkIDAscixjLGcsbixwKX0pLFMuZm9yRWFjaChmdW5jdGlvbihlKXtsKHZvaWQgMCx0W2VdLHIsYyxnLGUscCl9KX1wLmxlbmd0aD1wLmxlbmd0aC0xfWVsc2UgZSE9PXQmJihcIm51bWJlclwiPT09eSYmaXNOYU4oZSkmJmlzTmFOKHQpfHxyKG5ldyBuKGcsZSx0KSkpfWZ1bmN0aW9uIGMoZSx0LHIsbil7cmV0dXJuIG49bnx8W10sbChlLHQsZnVuY3Rpb24oZSl7ZSYmbi5wdXNoKGUpfSxyKSxuLmxlbmd0aD9uOnZvaWQgMH1mdW5jdGlvbiBzKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG9bci5wYXRoW25dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm9bci5wYXRoW25dXT1yLnJoc319ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZT1mKGUsdCk7YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjplW3RdPXIucmhzfXJldHVybiBlfWZ1bmN0aW9uIGQoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7Zm9yKHZhciBuPWUsbz0tMSxpPXIucGF0aD9yLnBhdGgubGVuZ3RoLTE6MDsrK288aTspXCJ1bmRlZmluZWRcIj09dHlwZW9mIG5bci5wYXRoW29dXSYmKG5bci5wYXRoW29dXT1cIm51bWJlclwiPT10eXBlb2Ygci5wYXRoW29dP1tdOnt9KSxuPW5bci5wYXRoW29dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhyLnBhdGg/bltyLnBhdGhbb11dOm4sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpkZWxldGUgbltyLnBhdGhbb11dO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6bltyLnBhdGhbb11dPXIucmhzfX19ZnVuY3Rpb24gcChlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJFXCI6b1tyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjpkZWxldGUgb1tyLnBhdGhbbl1dfX1lbHNlIHN3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKGVbdF0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjplW3RdPXIubGhzO2JyZWFrO2Nhc2VcIkVcIjplW3RdPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjplPWYoZSx0KX1yZXR1cm4gZX1mdW5jdGlvbiBnKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe3ZhciBuLG8saT1lO2ZvcihvPXIucGF0aC5sZW5ndGgtMSxuPTA7bjxvO24rKylcInVuZGVmaW5lZFwiPT10eXBlb2YgaVtyLnBhdGhbbl1dJiYoaVtyLnBhdGhbbl1dPXt9KSxpPWlbci5wYXRoW25dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChpW3IucGF0aFtuXV0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiRVwiOmlbci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIGlbci5wYXRoW25dXX19fWZ1bmN0aW9uIGgoZSx0LHIpe2lmKGUmJnQpe3ZhciBuPWZ1bmN0aW9uKG4pe3ImJiFyKGUsdCxuKXx8ZChlLHQsbil9O2woZSx0LG4pfX1mdW5jdGlvbiB5KGUpe3JldHVyblwiY29sb3I6IFwiK0ZbZV0uY29sb3IrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCJ9ZnVuY3Rpb24gdihlKXt2YXIgdD1lLmtpbmQscj1lLnBhdGgsbj1lLmxocyxvPWUucmhzLGk9ZS5pbmRleCxhPWUuaXRlbTtzd2l0Y2godCl7Y2FzZVwiRVwiOnJldHVybltyLmpvaW4oXCIuXCIpLG4sXCLihpJcIixvXTtjYXNlXCJOXCI6cmV0dXJuW3Iuam9pbihcIi5cIiksb107Y2FzZVwiRFwiOnJldHVybltyLmpvaW4oXCIuXCIpXTtjYXNlXCJBXCI6cmV0dXJuW3Iuam9pbihcIi5cIikrXCJbXCIraStcIl1cIixhXTtkZWZhdWx0OnJldHVybltdfX1mdW5jdGlvbiBiKGUsdCxyLG4pe3ZhciBvPWMoZSx0KTt0cnl7bj9yLmdyb3VwQ29sbGFwc2VkKFwiZGlmZlwiKTpyLmdyb3VwKFwiZGlmZlwiKX1jYXRjaChlKXtyLmxvZyhcImRpZmZcIil9bz9vLmZvckVhY2goZnVuY3Rpb24oZSl7dmFyIHQ9ZS5raW5kLG49dihlKTtyLmxvZy5hcHBseShyLFtcIiVjIFwiK0ZbdF0udGV4dCx5KHQpXS5jb25jYXQoUChuKSkpfSk6ci5sb2coXCLigJTigJQgbm8gZGlmZiDigJTigJRcIik7dHJ5e3IuZ3JvdXBFbmQoKX1jYXRjaChlKXtyLmxvZyhcIuKAlOKAlCBkaWZmIGVuZCDigJTigJQgXCIpfX1mdW5jdGlvbiBtKGUsdCxyLG4pe3N3aXRjaChcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOk4oZSkpe2Nhc2VcIm9iamVjdFwiOnJldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGVbbl0/ZVtuXS5hcHBseShlLFAocikpOmVbbl07Y2FzZVwiZnVuY3Rpb25cIjpyZXR1cm4gZSh0KTtkZWZhdWx0OnJldHVybiBlfX1mdW5jdGlvbiB3KGUpe3ZhciB0PWUudGltZXN0YW1wLHI9ZS5kdXJhdGlvbjtyZXR1cm4gZnVuY3Rpb24oZSxuLG8pe3ZhciBpPVtcImFjdGlvblwiXTtyZXR1cm4gaS5wdXNoKFwiJWNcIitTdHJpbmcoZS50eXBlKSksdCYmaS5wdXNoKFwiJWNAIFwiK24pLHImJmkucHVzaChcIiVjKGluIFwiK28udG9GaXhlZCgyKStcIiBtcylcIiksaS5qb2luKFwiIFwiKX19ZnVuY3Rpb24geChlLHQpe3ZhciByPXQubG9nZ2VyLG49dC5hY3Rpb25UcmFuc2Zvcm1lcixvPXQudGl0bGVGb3JtYXR0ZXIsaT12b2lkIDA9PT1vP3codCk6byxhPXQuY29sbGFwc2VkLGY9dC5jb2xvcnMsdT10LmxldmVsLGw9dC5kaWZmLGM9XCJ1bmRlZmluZWRcIj09dHlwZW9mIHQudGl0bGVGb3JtYXR0ZXI7ZS5mb3JFYWNoKGZ1bmN0aW9uKG8scyl7dmFyIGQ9by5zdGFydGVkLHA9by5zdGFydGVkVGltZSxnPW8uYWN0aW9uLGg9by5wcmV2U3RhdGUseT1vLmVycm9yLHY9by50b29rLHc9by5uZXh0U3RhdGUseD1lW3MrMV07eCYmKHc9eC5wcmV2U3RhdGUsdj14LnN0YXJ0ZWQtZCk7dmFyIFM9bihnKSxrPVwiZnVuY3Rpb25cIj09dHlwZW9mIGE/YShmdW5jdGlvbigpe3JldHVybiB3fSxnLG8pOmEsaj1EKHApLEU9Zi50aXRsZT9cImNvbG9yOiBcIitmLnRpdGxlKFMpK1wiO1wiOlwiXCIsQT1bXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCJdO0EucHVzaChFKSx0LnRpbWVzdGFtcCYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKSx0LmR1cmF0aW9uJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpO3ZhciBPPWkoUyxqLHYpO3RyeXtrP2YudGl0bGUmJmM/ci5ncm91cENvbGxhcHNlZC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cENvbGxhcHNlZChPKTpmLnRpdGxlJiZjP3IuZ3JvdXAuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXAoTyl9Y2F0Y2goZSl7ci5sb2coTyl9dmFyIE49bSh1LFMsW2hdLFwicHJldlN0YXRlXCIpLFA9bSh1LFMsW1NdLFwiYWN0aW9uXCIpLEM9bSh1LFMsW3ksaF0sXCJlcnJvclwiKSxGPW0odSxTLFt3XSxcIm5leHRTdGF0ZVwiKTtpZihOKWlmKGYucHJldlN0YXRlKXt2YXIgTD1cImNvbG9yOiBcIitmLnByZXZTdGF0ZShoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW05dKFwiJWMgcHJldiBzdGF0ZVwiLEwsaCl9ZWxzZSByW05dKFwicHJldiBzdGF0ZVwiLGgpO2lmKFApaWYoZi5hY3Rpb24pe3ZhciBUPVwiY29sb3I6IFwiK2YuYWN0aW9uKFMpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbUF0oXCIlYyBhY3Rpb24gICAgXCIsVCxTKX1lbHNlIHJbUF0oXCJhY3Rpb24gICAgXCIsUyk7aWYoeSYmQylpZihmLmVycm9yKXt2YXIgTT1cImNvbG9yOiBcIitmLmVycm9yKHksaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiO3JbQ10oXCIlYyBlcnJvciAgICAgXCIsTSx5KX1lbHNlIHJbQ10oXCJlcnJvciAgICAgXCIseSk7aWYoRilpZihmLm5leHRTdGF0ZSl7dmFyIF89XCJjb2xvcjogXCIrZi5uZXh0U3RhdGUodykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltGXShcIiVjIG5leHQgc3RhdGVcIixfLHcpfWVsc2UgcltGXShcIm5leHQgc3RhdGVcIix3KTtsJiZiKGgsdyxyLGspO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgbG9nIGVuZCDigJTigJRcIil9fSl9ZnVuY3Rpb24gUygpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PU9iamVjdC5hc3NpZ24oe30sTCxlKSxyPXQubG9nZ2VyLG49dC5zdGF0ZVRyYW5zZm9ybWVyLG89dC5lcnJvclRyYW5zZm9ybWVyLGk9dC5wcmVkaWNhdGUsYT10LmxvZ0Vycm9ycyxmPXQuZGlmZlByZWRpY2F0ZTtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgcilyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBlKHQpfX19O2lmKGUuZ2V0U3RhdGUmJmUuZGlzcGF0Y2gpcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJbcmVkdXgtbG9nZ2VyXSByZWR1eC1sb2dnZXIgbm90IGluc3RhbGxlZC4gTWFrZSBzdXJlIHRvIHBhc3MgbG9nZ2VyIGluc3RhbmNlIGFzIG1pZGRsZXdhcmU6XFxuLy8gTG9nZ2VyIHdpdGggZGVmYXVsdCBvcHRpb25zXFxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoXFxuICByZWR1Y2VyLFxcbiAgYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcilcXG4pXFxuLy8gT3IgeW91IGNhbiBjcmVhdGUgeW91ciBvd24gbG9nZ2VyIHdpdGggY3VzdG9tIG9wdGlvbnMgaHR0cDovL2JpdC5seS9yZWR1eC1sb2dnZXItb3B0aW9uc1xcbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbmNvbnN0IGxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XFxuICAvLyAuLi5vcHRpb25zXFxufSk7XFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG5cIiksZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBlKHQpfX19O3ZhciB1PVtdO3JldHVybiBmdW5jdGlvbihlKXt2YXIgcj1lLmdldFN0YXRlO3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24obCl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgaSYmIWkocixsKSlyZXR1cm4gZShsKTt2YXIgYz17fTt1LnB1c2goYyksYy5zdGFydGVkPU8ubm93KCksYy5zdGFydGVkVGltZT1uZXcgRGF0ZSxjLnByZXZTdGF0ZT1uKHIoKSksYy5hY3Rpb249bDt2YXIgcz12b2lkIDA7aWYoYSl0cnl7cz1lKGwpfWNhdGNoKGUpe2MuZXJyb3I9byhlKX1lbHNlIHM9ZShsKTtjLnRvb2s9Ty5ub3coKS1jLnN0YXJ0ZWQsYy5uZXh0U3RhdGU9bihyKCkpO3ZhciBkPXQuZGlmZiYmXCJmdW5jdGlvblwiPT10eXBlb2YgZj9mKHIsbCk6dC5kaWZmO2lmKHgodSxPYmplY3QuYXNzaWduKHt9LHQse2RpZmY6ZH0pKSx1Lmxlbmd0aD0wLGMuZXJyb3IpdGhyb3cgYy5lcnJvcjtyZXR1cm4gc319fX12YXIgayxqLEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gbmV3IEFycmF5KHQrMSkuam9pbihlKX0sQT1mdW5jdGlvbihlLHQpe3JldHVybiBFKFwiMFwiLHQtZS50b1N0cmluZygpLmxlbmd0aCkrZX0sRD1mdW5jdGlvbihlKXtyZXR1cm4gQShlLmdldEhvdXJzKCksMikrXCI6XCIrQShlLmdldE1pbnV0ZXMoKSwyKStcIjpcIitBKGUuZ2V0U2Vjb25kcygpLDIpK1wiLlwiK0EoZS5nZXRNaWxsaXNlY29uZHMoKSwzKX0sTz1cInVuZGVmaW5lZFwiIT10eXBlb2YgcGVyZm9ybWFuY2UmJm51bGwhPT1wZXJmb3JtYW5jZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgcGVyZm9ybWFuY2Uubm93P3BlcmZvcm1hbmNlOkRhdGUsTj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfSxQPWZ1bmN0aW9uKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpe2Zvcih2YXIgdD0wLHI9QXJyYXkoZS5sZW5ndGgpO3Q8ZS5sZW5ndGg7dCsrKXJbdF09ZVt0XTtyZXR1cm4gcn1yZXR1cm4gQXJyYXkuZnJvbShlKX0sQz1bXTtrPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGdsb2JhbD9cInVuZGVmaW5lZFwiOk4oZ2xvYmFsKSkmJmdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30saj1rLkRlZXBEaWZmLGomJkMucHVzaChmdW5jdGlvbigpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBqJiZrLkRlZXBEaWZmPT09YyYmKGsuRGVlcERpZmY9aixqPXZvaWQgMCl9KSx0KG4sciksdChvLHIpLHQoaSxyKSx0KGEsciksT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYyx7ZGlmZjp7dmFsdWU6YyxlbnVtZXJhYmxlOiEwfSxvYnNlcnZhYmxlRGlmZjp7dmFsdWU6bCxlbnVtZXJhYmxlOiEwfSxhcHBseURpZmY6e3ZhbHVlOmgsZW51bWVyYWJsZTohMH0sYXBwbHlDaGFuZ2U6e3ZhbHVlOmQsZW51bWVyYWJsZTohMH0scmV2ZXJ0Q2hhbmdlOnt2YWx1ZTpnLGVudW1lcmFibGU6ITB9LGlzQ29uZmxpY3Q6e3ZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGp9LGVudW1lcmFibGU6ITB9LG5vQ29uZmxpY3Q6e3ZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIEMmJihDLmZvckVhY2goZnVuY3Rpb24oZSl7ZSgpfSksQz1udWxsKSxjfSxlbnVtZXJhYmxlOiEwfX0pO3ZhciBGPXtFOntjb2xvcjpcIiMyMTk2RjNcIix0ZXh0OlwiQ0hBTkdFRDpcIn0sTjp7Y29sb3I6XCIjNENBRjUwXCIsdGV4dDpcIkFEREVEOlwifSxEOntjb2xvcjpcIiNGNDQzMzZcIix0ZXh0OlwiREVMRVRFRDpcIn0sQTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkFSUkFZOlwifX0sTD17bGV2ZWw6XCJsb2dcIixsb2dnZXI6Y29uc29sZSxsb2dFcnJvcnM6ITAsY29sbGFwc2VkOnZvaWQgMCxwcmVkaWNhdGU6dm9pZCAwLGR1cmF0aW9uOiExLHRpbWVzdGFtcDohMCxzdGF0ZVRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxhY3Rpb25UcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sZXJyb3JUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sY29sb3JzOnt0aXRsZTpmdW5jdGlvbigpe3JldHVyblwiaW5oZXJpdFwifSxwcmV2U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM5RTlFOUVcIn0sYWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuXCIjMDNBOUY0XCJ9LG5leHRTdGF0ZTpmdW5jdGlvbigpe3JldHVyblwiIzRDQUY1MFwifSxlcnJvcjpmdW5jdGlvbigpe3JldHVyblwiI0YyMDQwNFwifX0sZGlmZjohMSxkaWZmUHJlZGljYXRlOnZvaWQgMCx0cmFuc2Zvcm1lcjp2b2lkIDB9LFQ9ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sdD1lLmRpc3BhdGNoLHI9ZS5nZXRTdGF0ZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiByP1MoKSh7ZGlzcGF0Y2g6dCxnZXRTdGF0ZTpyfSk6dm9pZCBjb25zb2xlLmVycm9yKFwiXFxuW3JlZHV4LWxvZ2dlciB2M10gQlJFQUtJTkcgQ0hBTkdFXFxuW3JlZHV4LWxvZ2dlciB2M10gU2luY2UgMy4wLjAgcmVkdXgtbG9nZ2VyIGV4cG9ydHMgYnkgZGVmYXVsdCBsb2dnZXIgd2l0aCBkZWZhdWx0IHNldHRpbmdzLlxcbltyZWR1eC1sb2dnZXIgdjNdIENoYW5nZVxcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbltyZWR1eC1sb2dnZXIgdjNdIHRvXFxuW3JlZHV4LWxvZ2dlciB2M10gaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcblwiKX07ZS5kZWZhdWx0cz1MLGUuY3JlYXRlTG9nZ2VyPVMsZS5sb2dnZXI9VCxlLmRlZmF1bHQ9VCxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaTE4bihzdGF0ZT17XG4gIHRleHQ6IHtcbiAgICBnZXQoa2V5LCAuLi5hcmdzKXtcbiAgICAgIGxldCB0ZXh0ID0gZ2V0TG9jYWxlVGV4dChrZXksIGFyZ3MpO1xuICAgICAgaWYgKHRleHQpe1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9ybWF0KGRhdGU9bmV3IERhdGUoKSwgZm9ybWF0PVwiTFwiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZvcm1hdChmb3JtYXQpO1xuICAgIH0sXG4gICAgZnJvbU5vdyhkYXRlPW5ldyBEYXRlKCkpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZnJvbU5vdygpO1xuICAgIH0sXG4gICAgc3VidHJhY3QoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5zdWJ0cmFjdChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfSxcbiAgICBhZGQoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5hZGQoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH1cbiAgfVxufSwgYWN0aW9uKXtcbiAgcmV0dXJuIHN0YXRlO1xufSIsIi8vVE9ETyB0aGlzIHJlZHVjZXIgdXNlcyB0aGUgYXBpIHRoYXQgaW50ZXJhY3RzIHdpdGggdGhlIERPTSBpbiBvcmRlciB0b1xuLy9yZXRyaWV2ZSBkYXRhLCBwbGVhc2UgZml4IGluIG5leHQgdmVyc2lvbnNcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlcyhzdGF0ZT17XG4gIGF2YWxpYWJsZTogJC5tYWtlQXJyYXkoJChcIiNsYW5ndWFnZS1waWNrZXIgYVwiKS5tYXAoKGluZGV4LCBlbGVtZW50KT0+e1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAkKGVsZW1lbnQpLnRleHQoKS50cmltKCksXG4gICAgICBsb2NhbGU6ICQoZWxlbWVudCkuZGF0YSgnbG9jYWxlJylcbiAgICB9XG4gIH0pKSxcbiAgY3VycmVudDogJChcIiNsb2NhbGVcIikudGV4dCgpXG59LCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRVRfTE9DQUxFJyl7XG4gICAgJCgnI2xhbmd1YWdlLXBpY2tlciBhW2RhdGEtbG9jYWxlPVwiJyArIGFjdGlvbi5wYXlsb2FkICsgJ1wiXScpLmNsaWNrKCk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7Y3VycmVudDogYWN0aW9uLnBheWxvYWR9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm90aWZpY2F0aW9ucyhzdGF0ZT1bXSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQUREX05PVElGSUNBVElPTicpIHtcbiAgICB2YXIgaWQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgIHJldHVybiBzdGF0ZS5jb25jYXQoT2JqZWN0LmFzc2lnbih7aWQ6IGlkfSwgYWN0aW9uLnBheWxvYWQpKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gJ0hJREVfTk9USUZJQ0FUSU9OJykge1xuICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICByZXR1cm4gZWxlbWVudC5pZCAhPT0gYWN0aW9uLnBheWxvYWQuaWQ7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsIi8vVGhpcyBvbmUgYWxzbyB1c2VzIGEgaGFjayB0byBhY2Nlc3MgdGhlIGRhdGEgaW4gdGhlIGRvbVxuLy9wbGVhc2UgcmVwbGFjZSBpdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvY2VkdXJlXG4vLzEuIENyZWF0ZSBhIHJlc3QgZW5kcG9pbnQgdG8gZ2V0IHRoZSBwZXJtaXNzaW9ucyBsaXN0XG4vLzIuIGluIHRoZSBtYWluIGZpbGUgZ2F0aGVyIHRob3NlIHBlcm1pc3Npb25zLi4uIGV0Yy4uLiwgZWcuIGluZGV4LmpzIG1ha2UgYSBjYWxsXG4vLzMuIGRpc3BhdGNoIHRoZSBhY3Rpb24gdG8gdGhpcyBzYW1lIHJlZHVjZXIgYW5kIGdhdGhlciB0aGUgYWN0aW9uIGhlcmVcbi8vNC4gaXQgd29ya3MgOkRcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhdHVzKHN0YXRlPXtcbiAgbG9nZ2VkSW46ICEhTVVJS0tVX0xPR0dFRF9VU0VSX0lELFxuICB1c2VySWQ6IE1VSUtLVV9MT0dHRURfVVNFUl9JRCxcbiAgcGVybWlzc2lvbnM6IE1VSUtLVV9QRVJNSVNTSU9OUyxcbiAgY29udGV4dFBhdGg6IENPTlRFWFRQQVRIXG59LCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09IFwiTE9HT1VUXCIpe1xuICAgICQoJyNsb2dvdXQnKS5jbGljaygpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiaW1wb3J0IG5vdGlmaWNhdGlvbnMgZnJvbSAnLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IGxvY2FsZXMgZnJvbSAnLi9iYXNlL2xvY2FsZXMnO1xuaW1wb3J0IHN0YXR1cyBmcm9tICcuL2Jhc2Uvc3RhdHVzJztcbmltcG9ydCBpMThuIGZyb20gJy4vYmFzZS9pMThuJztcbmltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIG5vdGlmaWNhdGlvbnMsXG4gIGkxOG4sXG4gIGxvY2FsZXMsXG4gIHN0YXR1c1xufSk7IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWlra3VXZWJzb2NrZXQge1xuICBjb25zdHJ1Y3RvcihzdG9yZSwgbGlzdGVuZXJzPVtdLCBvcHRpb25zPXtcbiAgICByZWNvbm5lY3RJbnRlcnZhbDogMjAwLFxuICAgIHBpbmdUaW1lU3RlcDogMTAwMCxcbiAgICBwaW5nVGltZW91dDogMTAwMDBcbiAgfSkge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XG4gICAgXG4gICAgdGhpcy50aWNrZXQgPSBudWxsO1xuICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLnNvY2tldE9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZyA9IFtdO1xuICAgIHRoaXMucGluZ0hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgXG4gICAgdGhpcy5nZXRUaWNrZXQoKHRpY2tldCk9PiB7XG4gICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgdGhpcy5vcGVuV2ViU29ja2V0KCk7XG4gICAgICAgIHRoaXMuc3RhcnRQaW5naW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBiZWNhdXNlIHRpY2tldCB3YXMgbWlzc2luZ1wiLCAnZXJyb3InKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgdGhpcy5vbkJlZm9yZVdpbmRvd1VubG9hZC5iaW5kKHRoaXMpKTtcbiAgfVxuICBzZW5kTWVzc2FnZShldmVudFR5cGUsIGRhdGEpe1xuICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgZXZlbnRUeXBlLFxuICAgICAgZGF0YVxuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5zb2NrZXRPcGVuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcucHVzaCh7XG4gICAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcucHVzaChtZXNzYWdlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHRyaWdnZXIoZXZlbnQsIGRhdGE9bnVsbCl7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAndHlwZSc6ICdXRUJTT0NLRVRfRVZFTlQnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBkYXRhXG4gICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2V2ZW50XSl7XG4gICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnRdO1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgIGxpc3RlbmVycyhkYXRhKTtcbiAgICAgIH1cbiAgICAgIGZvciAoYWN0aW9uIG9mIGxpc3RlbmVycyl7XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0VGlja2V0KGNhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICAvLyBXZSBoYXZlIGEgdGlja2V0LCBzbyB3ZSBuZWVkIHRvIHZhbGlkYXRlIGl0IGJlZm9yZSB1c2luZyBpdFxuICAgICAgICBtQXBpKCkud2Vic29ja2V0LmNhY2hlQ2xlYXIoKS50aWNrZXQuY2hlY2sucmVhZCh0aGlzLnRpY2tldCkuY2FsbGJhY2soJC5wcm94eShmdW5jdGlvbiAoZXJyLCByZXNwb25zZSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFRpY2tldCBkaWQgbm90IHBhc3MgdmFsaWRhdGlvbiwgc28gd2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgb25lXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpY2tldCgkLnByb3h5KGZ1bmN0aW9uICh0aWNrZXQpIHtcbiAgICAgICAgICAgICAgdGhpcy50aWNrZXQgPSB0aWNrZXQ7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHRpY2tldCk7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRpY2tldCBwYXNzZWQgdmFsaWRhdGlvbiwgc28gd2UgdXNlIGl0XG4gICAgICAgICAgICBjYWxsYmFjayh0aGlzLnRpY2tldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IHRpY2tldFxuICAgICAgICB0aGlzLmNyZWF0ZVRpY2tldCgodGlja2V0KT0+e1xuICAgICAgICAgIHRoaXMudGlja2V0ID0gdGlja2V0O1xuICAgICAgICAgIGNhbGxiYWNrKHRpY2tldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiVGlja2V0IGNyZWF0aW9uIGZhaWxlZCBvbiBhbiBpbnRlcm5hbCBlcnJvclwiLCAnZXJyb3InKSk7XG4gICAgfVxuICB9XG4gIFxuICBjcmVhdGVUaWNrZXQoY2FsbGJhY2spIHtcbiAgICBtQXBpKCkud2Vic29ja2V0LnRpY2tldC5jcmVhdGUoKVxuICAgICAgLmNhbGxiYWNrKChlcnIsIHRpY2tldCk9PntcbiAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayh0aWNrZXQudGlja2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBjcmVhdGUgV2ViU29ja2V0IHRpY2tldFwiLCAnZXJyb3InKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG4gIFxuICBvbldlYlNvY2tldENvbm5lY3RlZCgpIHtcbiAgICB0aGlzLnNvY2tldE9wZW4gPSB0cnVlO1xuICAgIHRoaXMudHJpZ2dlcihcIndlYlNvY2tldENvbm5lY3RlZFwiKTsgXG4gICAgXG4gICAgd2hpbGUgKHRoaXMuc29ja2V0T3BlbiAmJiB0aGlzLm1lc3NhZ2VzUGVuZGluZy5sZW5ndGgpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tZXNzYWdlc1BlbmRpbmcuc2hpZnQoKTtcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobWVzc2FnZS5ldmVudFR5cGUsIG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG4gIFxuICBvbldlYlNvY2tldEVycm9yKCkge1xuICAgIHRoaXMucmVjb25uZWN0KCk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0Q2xvc2UoKSB7XG4gICAgdGhpcy50cmlnZ2VyKFwid2ViU29ja2V0RGlzY29ubmVjdGVkXCIpOyBcbiAgICB0aGlzLnJlY29ubmVjdCgpO1xuICB9XG4gIFxuICBvcGVuV2ViU29ja2V0KCkge1xuICAgIGxldCBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgbGV0IHNlY3VyZSA9IGxvY2F0aW9uLnByb3RvY29sID09ICdodHRwczonO1xuICAgIHRoaXMud2ViU29ja2V0ID0gdGhpcy5jcmVhdGVXZWJTb2NrZXQoKHNlY3VyZSA/ICd3c3M6Ly8nIDogJ3dzOi8vJykgKyBob3N0ICsgJy93cy9zb2NrZXQvJyArIHRoaXMudGlja2V0KTtcbiAgICBcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMub25XZWJTb2NrZXRNZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gdGhpcy5vbldlYlNvY2tldEVycm9yLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gdGhpcy5vbldlYlNvY2tldENsb3NlLmJpbmQodGhpcyk7XG4gICAgICBzd2l0Y2ggKHRoaXMud2ViU29ja2V0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgY2FzZSB0aGlzLndlYlNvY2tldC5DT05ORUNUSU5HOlxuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9ub3BlbiA9IHRoaXMub25XZWJTb2NrZXRDb25uZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdGhpcy53ZWJTb2NrZXQuT1BFTjpcbiAgICAgICAgICB0aGlzLm9uV2ViU29ja2V0Q29ubmVjdGVkKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiV2ViU29ja2V0IGNvbm5lY3Rpb24gZmFpbGVkXCIsICdlcnJvcicpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGNvbm5lY3Rpb25cIiwgJ2Vycm9yJykpO1xuICAgIH1cbiAgfVxuICBcbiAgY3JlYXRlV2ViU29ja2V0KHVybCkge1xuICAgIGlmICgodHlwZW9mIHdpbmRvdy5XZWJTb2NrZXQpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93Lk1veldlYlNvY2tldCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE1veldlYlNvY2tldCh1cmwpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgc3RhcnRQaW5naW5nKCkge1xuICAgIHRoaXMucGluZ0hhbmRsZSA9IHNldEludGVydmFsKCgpPT57XG4gICAgICBpZiAodGhpcy5zb2NrZXRPcGVuID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMucGluZ2luZykge1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKFwicGluZzpwaW5nXCIsIHt9KTtcbiAgICAgICAgdGhpcy5waW5naW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGluZ1RpbWUgKz0gdGhpcy5vcHRpb25zLnBpbmdUaW1lU3RlcDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnBpbmdUaW1lID4gdGhpcy5vcHRpb25zLnBpbmdUaW1lb3V0KSB7XG4gICAgICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUubG9nKFwicGluZyBmYWlsZWQsIHJlY29ubmVjdGluZy4uLlwiKTtcbiAgICAgICAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcy5vcHRpb25zLnBpbmdUaW1lU3RlcCk7XG4gIH1cbiAgXG4gIHJlY29ubmVjdCgpIHtcbiAgICB2YXIgd2FzT3BlbiA9IHRoaXMuc29ja2V0T3BlbjsgXG4gICAgdGhpcy5zb2NrZXRPcGVuID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dCk7XG4gICAgXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lb3V0ID0gc2V0VGltZW91dCgoKT0+e1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICBpZiAod2FzT3Blbikge1xuICAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMgcmVsYXRlZCB0byBkaXNjYXJkaW5nIGEgV2ViU29ja2V0IFxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLmdldFRpY2tldCgodGlja2V0KT0+e1xuICAgICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgICB0aGlzLm9wZW5XZWJTb2NrZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBiZWNhdXNlIHRpY2tldCB3YXMgbWlzc2luZ1wiLCAnZXJyb3InKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgfSwgdGhpcy5vcHRpb25zLnJlY29ubmVjdEludGVydmFsKTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRNZXNzYWdlKGV2ZW50KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHZhciBldmVudFR5cGUgPSBtZXNzYWdlLmV2ZW50VHlwZTtcbiAgICBcbiAgICBpZiAoZXZlbnRUeXBlID09IFwicGluZzpwb25nXCIpIHtcbiAgICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJpZ2dlcihldmVudFR5cGUsIG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG4gIFxuICBvbkJlZm9yZVdpbmRvd1VubG9hZCgpIHtcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9ICgpPT57fTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSAoKT0+e307XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gKCk9Pnt9O1xuICAgICAgaWYgKHRoaXMuc29ja2V0T3Blbikge1xuICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSJdfQ==
