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

var _reactDom = require('react-dom');

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
      var activator = this.refs.activator;
      if (!(activator instanceof HTMLElement)) {
        activator = (0, _reactDom.findDOMNode)(activator);
      }

      var $target = $(activator);
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

},{"./portal.jsx":18,"prop-types":29,"react":"react","react-dom":"react-dom"}],12:[function(require,module,exports){
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
  if (!$(anchor).size()) {
    window.location.href = anchor;
    return;
  }

  var topOffset = 90;
  var scrollTop = $(anchor).offset().top - topOffset;

  $('html, body').stop().animate({
    scrollTop: scrollTop
  }, {
    duration: 500,
    easing: "easeInOutQuad"
  });

  setTimeout(function () {
    window.location.href = anchor;
  }, 500);
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
        _react2.default.createElement(_menu2.default, { open: this.state.isMenuOpen, onClose: this.closeMenu,
          items: this.props.menuItems, classNameExtension: this.props.classNameExtension, navigation: this.props.navigation })
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
  defaultOptions: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired,
  navigation: _propTypes2.default.element
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

var _status = require('../../../actions/base/status');

var _status2 = _interopRequireDefault(_status);

var _reactRedux = require('react-redux');

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function checkLinkClicked(target) {
  return target.nodeName.toLowerCase() === "a" || (target.parentElement ? checkLinkClicked(target.parentElement) : false);
}

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
      var youJustClickedALink = checkLinkClicked(e.target) && movement <= 5;

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
      var isLink = checkLinkClicked(e.target);
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
            this.props.navigation ? _react2.default.createElement(
              'div',
              { className: 'menu-extras' },
              this.props.navigation
            ) : null,
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
                      data: '/rest/user/files/user/' + this.props.status.userId + '/identifier/profile-image-96',
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
                  { className: 'main-function link link-full main-function-link-menu main-function-link-menu-logout', onClick: this.props.logout },
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
  classNameExtension: _propTypes2.default.string.isRequired,
  navigation: _propTypes2.default.element
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

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Menu);

},{"../../../actions/base/status":3,"../link.jsx":13,"prop-types":29,"react":"react","react-redux":"react-redux","redux":"redux"}],17:[function(require,module,exports){
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
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextState.active) {
        this.renderPortal(nextProps);
      }
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
        var listeners = this.listeners[event] instanceof Array ? this.listeners[event] : this.listeners[event].actions;
        if (listeners) {
          if (typeof listeners === "function") {
            listeners = listeners(data);
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

        var otherListeners = this.listeners[event].callbacks;
        if (otherListeners) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = otherListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              callback = _step2.value;

              callback(data);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiYWN0aW9ucy9iYXNlL3N0YXR1cy5qcyIsImNvbXBvbmVudHMvYmFzZS9mb3Jnb3QtcGFzc3dvcmQtZGlhbG9nLmpzeCIsImNvbXBvbmVudHMvYmFzZS9sb2dpbi1idXR0b24uanN4IiwiY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4IiwiY29tcG9uZW50cy9mcm9udHBhZ2UvYm9keS5qc3giLCJjb21wb25lbnRzL2Zyb250cGFnZS9mZWVkLmpzeCIsImNvbXBvbmVudHMvZnJvbnRwYWdlL25hdmJhci5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZGlhbG9nLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZmVlZC5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvbGFuZ3VhZ2UtcGlja2VyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvbWVudS5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvcG9ydGFsLmpzeCIsImNvbnRhaW5lcnMvaW5kZXguZnJvbnRwYWdlLmpzeCIsImRlZmF1bHQuZGVidWcuanN4IiwiaW5kZXguZnJvbnRwYWdlLmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL3dhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9kaXN0L3JlZHV4LWxvZ2dlci5qcyIsInJlZHVjZXJzL2Jhc2UvaTE4bi5qcyIsInJlZHVjZXJzL2Jhc2UvbG9jYWxlcy5qcyIsInJlZHVjZXJzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qcyIsInJlZHVjZXJzL2Jhc2Uvc3RhdHVzLmpzIiwicmVkdWNlcnMvaW5kZXguZnJvbnRwYWdlLmpzIiwidXRpbC93ZWJzb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNBZTtBQUNiLGFBQVcsbUJBQVMsTUFBVCxFQUFnQjtBQUN6QixXQUFPO0FBQ0wsY0FBUSxZQURIO0FBRUwsaUJBQVc7QUFGTixLQUFQO0FBSUQ7QUFOWSxDOzs7Ozs7OztrQkNBQTtBQUNiLHVCQUFxQiw2QkFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTJCO0FBQzlDLFdBQU87QUFDTCxjQUFRLGtCQURIO0FBRUwsaUJBQVc7QUFDVCxvQkFBWSxRQURIO0FBRVQsbUJBQVc7QUFGRjtBQUZOLEtBQVA7QUFPRCxHQVRZO0FBVWIsb0JBQWtCLDBCQUFTLFlBQVQsRUFBc0I7QUFDdEMsV0FBTztBQUNMLGNBQVEsbUJBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQWZZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsUUFEYSxvQkFDTDtBQUNOLFdBQU87QUFDTCxjQUFRO0FBREgsS0FBUDtBQUdEO0FBTFksQzs7Ozs7Ozs7Ozs7QUNBZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVNLG9COzs7Ozs7Ozs7Ozs2QkFLSTtBQUFBOztBQUNOLFVBQUksVUFBVztBQUFBO0FBQUE7QUFDVixhQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLHlEQUF6QixDQURVO0FBRVgsaURBRlc7QUFHWCxpREFIVztBQUlYO0FBQUE7QUFBQSxZQUFNLFdBQVUsTUFBaEI7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUEsZ0JBQU8sU0FBUSxzQkFBZjtBQUF1QyxtQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixrREFBekI7QUFBdkMsYUFERjtBQUVJLHFEQUFPLE1BQUssTUFBWixFQUFtQixNQUFLLE9BQXhCLEdBRko7QUFHSSxxREFBTyxNQUFLLFFBQVosRUFBcUIsV0FBVSxhQUEvQixFQUE2QyxJQUFHLDRCQUFoRDtBQUhKO0FBREY7QUFKVyxPQUFmO0FBWUEsVUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFDLFdBQUQsRUFBZTtBQUMxQixlQUFPO0FBQUE7QUFBQTtBQUNMO0FBQUE7QUFBQSxjQUFPLFNBQVEsNEJBQWYsRUFBNEMsV0FBVSxxQkFBdEQ7QUFDRyxtQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qiw0REFBekI7QUFESCxXQURLO0FBSUw7QUFBQTtBQUFBLGNBQUcsV0FBVSxpQ0FBYixFQUErQyxTQUFTLFdBQXhEO0FBQ0csbUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsOERBQXpCO0FBREg7QUFKSyxTQUFQO0FBUUQsT0FURDtBQVVBLGFBQU87QUFBQTtBQUFBLFVBQVEsT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGtEQUF6QixDQUFmO0FBQ0wsbUJBQVMsT0FESixFQUNhLFFBQVEsTUFEckIsRUFDNkIsb0JBQW9CLEtBQUssS0FBTCxDQUFXLGtCQUQ1RDtBQUVGLGFBQUssS0FBTCxDQUFXO0FBRlQsT0FBUDtBQUlEOzs7O0VBaENnQyxnQkFBTSxTOztBQUFuQyxvQixDQUNHLFMsR0FBWTtBQUNqQixZQUFVLG9CQUFVLE9BQVYsQ0FBa0IsVUFEWDtBQUVqQixzQkFBb0Isb0JBQVUsTUFBVixDQUFpQjtBQUZwQixDOzs7QUFrQ3JCLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUErQjtBQUM3QixTQUFPO0FBQ0wsVUFBTSxNQUFNO0FBRFAsR0FBUDtBQUdEOztBQUVELElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLFFBQUQsRUFBWTtBQUNyQyxTQUFPLEVBQVA7QUFDRCxDQUZEOztrQkFJZSx5QkFDYixlQURhLEVBRWIsa0JBRmEsRUFHYixvQkFIYSxDOzs7Ozs7Ozs7OztBQzlDZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7K2VBUEE7QUFDQTtBQUNBOztJQU9NLFc7OztBQUlKLHVCQUFZLEtBQVosRUFBa0I7QUFBQTs7QUFBQSwwSEFDVixLQURVOztBQUdoQixVQUFLLEtBQUwsR0FBYSxNQUFLLEtBQUwsQ0FBVyxJQUFYLE9BQWI7QUFIZ0I7QUFJakI7Ozs7NEJBQ007QUFDTDtBQUNBLGFBQU8sUUFBUCxDQUFnQixPQUFoQixDQUF3QixFQUFFLFFBQUYsRUFBWSxJQUFaLENBQWlCLE1BQWpCLENBQXhCO0FBQ0Q7Ozs2QkFDTztBQUNOLGFBQVE7QUFBQTtBQUFBLFVBQU0sV0FBYyxLQUFLLEtBQUwsQ0FBVyxrQkFBekIsZ0JBQXNELEtBQUssS0FBTCxDQUFXLGtCQUFqRSxrQkFBTixFQUEwRyxTQUFTLEtBQUssS0FBeEg7QUFDTjtBQUFBO0FBQUE7QUFBTyxlQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLDBCQUF6QjtBQUFQO0FBRE0sT0FBUjtBQUdEOzs7O0VBakJ1QixnQkFBTSxTOztBQUExQixXLENBQ0csUyxHQUFZO0FBQ2pCLHNCQUFvQixvQkFBVSxNQUFWLENBQWlCO0FBRHBCLEM7OztBQW1CckIsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQStCO0FBQzdCLFNBQU87QUFDTCxVQUFNLE1BQU07QUFEUCxHQUFQO0FBR0Q7O0FBRUQsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLENBQUMsUUFBRCxFQUFZO0FBQ3JDLFNBQU8sRUFBUDtBQUNELENBRkQ7O2tCQUllLHlCQUNiLGVBRGEsRUFFYixrQkFGYSxFQUdiLFdBSGEsQzs7Ozs7Ozs7Ozs7QUN2Q2Y7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0lBRU0sYTs7Ozs7Ozs7Ozs7NkJBQ0k7QUFBQTs7QUFDTixhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsb0JBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLDBCQUFmO0FBQ0csZUFBSyxLQUFMLENBQVcsYUFBWCxDQUF5QixHQUF6QixDQUE2QixVQUFDLFlBQUQsRUFBZ0I7QUFDNUMsbUJBQ0U7QUFBQTtBQUFBLGdCQUFLLEtBQUssYUFBYSxFQUF2QixFQUEyQixXQUFXLHFEQUFxRCxhQUFhLFFBQXhHO0FBQ0U7QUFBQTtBQUFBO0FBQU8sNkJBQWE7QUFBcEIsZUFERjtBQUVFLG1EQUFHLFdBQVUsK0JBQWIsRUFBNkMsU0FBUyxPQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixJQUE1QixTQUF1QyxZQUF2QyxDQUF0RDtBQUZGLGFBREY7QUFNRCxXQVBBO0FBREg7QUFERixPQURGO0FBY0Q7Ozs7RUFoQnlCLGdCQUFNLFM7O0FBbUJsQyxTQUFTLGVBQVQsQ0FBeUIsS0FBekIsRUFBK0I7QUFDN0IsU0FBTztBQUNMLG1CQUFlLE1BQU07QUFEaEIsR0FBUDtBQUdEOztBQUVELElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLFFBQUQsRUFBWTtBQUNyQyxTQUFPLHdEQUE0QixRQUE1QixDQUFQO0FBQ0QsQ0FGRDs7a0JBSWUseUJBQ2IsZUFEYSxFQUViLGtCQUZhLEVBR2IsYUFIYSxDOzs7Ozs7Ozs7OztBQ2xDZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVNLGE7Ozs7Ozs7Ozs7O3dDQUNlO0FBQ2pCLFdBQUssWUFBTDtBQUNEOzs7bUNBQ2E7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFFLFNBQUYsRUFBYTtBQUNYLGFBQUssWUFETTtBQUVYLGNBQU0sVUFGSztBQUdYLGNBQU07QUFISyxPQUFiLEVBSUcsUUFKSCxDQUlZLE1BSlo7O0FBTUEsUUFBRSxTQUFGLENBQVkscURBQVosRUFBbUUsVUFBVSxJQUFWLEVBQWdCLFVBQWhCLEVBQTRCLEtBQTVCLEVBQW9DO0FBQ3JHLFVBQUUsZ0JBQUYsRUFBb0IsSUFBcEIsQ0FBeUIsVUFBQyxLQUFELEVBQVEsT0FBUixFQUFrQjtBQUN6QyxZQUFFLE9BQUYsRUFBVyxJQUFYO0FBQ0QsU0FGRDs7QUFJQSxVQUFFLFdBQUYsRUFBZSxJQUFmLENBQW9CLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBa0I7QUFDcEMsWUFBRSxPQUFGLEVBQVcsS0FBWCxDQUFpQjtBQUNmLHdCQUFZLEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0Isb0JBQXBCLENBREc7QUFFZixvQkFBUSxLQUZPO0FBR2Ysa0JBQU0sSUFIUztBQUlmLHVCQUFXLGVBSkk7QUFLZixrQkFBTSxJQUxTO0FBTWYsbUJBQU8sR0FOUTtBQU9mLDRCQUFnQixLQVBEO0FBUWYsd0JBQVksQ0FDVDtBQUNDLDBCQUFZLEdBRGI7QUFFQyx3QkFBVTtBQUNSLGdDQUFnQixJQURSO0FBRVIsc0JBQU07QUFGRTtBQUZYLGFBRFM7QUFSRyxXQUFqQjtBQWtCRCxTQW5CRDtBQW9CRCxPQXpCRDtBQTBCRDs7OzZCQUNPO0FBQ04sYUFBUTtBQUFBO0FBQUEsVUFBSyxXQUFVLG9CQUFmO0FBQ1osNkRBRFk7QUFHWjtBQUFBO0FBQUEsWUFBUSxXQUFVLGdCQUFsQjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLFdBQWY7QUFDRTtBQUFBO0FBQUEsa0JBQUssV0FBVSwwQkFBZjtBQUNFO0FBQUE7QUFBQSxvQkFBSyxXQUFVLGNBQWY7QUFDRyx1QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qiw4Q0FBekI7QUFESCxpQkFERjtBQUlFO0FBQUE7QUFBQSxvQkFBSyxXQUFVLGdCQUFmO0FBQ0csdUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsb0RBQXpCO0FBREgsaUJBSkY7QUFPRTtBQUFBO0FBQUEsb0JBQUssV0FBVSx5QkFBZjtBQUNFO0FBQUE7QUFBQSxzQkFBRyxXQUFVLG1FQUFiO0FBQ0cseUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsNkNBQXpCO0FBREg7QUFERjtBQVBGO0FBREYsYUFERjtBQWdCRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxXQUFmO0FBQ0U7QUFBQTtBQUFBLGtCQUFLLFdBQVUscURBQWY7QUFDRSx1REFBSyxXQUFVLDZDQUFmLEVBQTZELEtBQUksdUJBQWpFLEdBREY7QUFFRTtBQUFBO0FBQUEsb0JBQUssV0FBVSwrQkFBZjtBQUNFO0FBQUE7QUFBQSxzQkFBSyxXQUFVLDZDQUFmO0FBQThELHlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLDJCQUF6QjtBQUE5RCxtQkFERjtBQUVFO0FBQUE7QUFBQSxzQkFBSyxXQUFVLHNDQUFmO0FBQUE7QUFBQSxtQkFGRjtBQUdFO0FBQUE7QUFBQSxzQkFBSyxXQUFVLHNDQUFmO0FBQUE7QUFBQTtBQUhGO0FBRkYsZUFERjtBQVNFO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGlFQUFmO0FBQWtGLHFCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGdDQUF6QjtBQUFsRjtBQVRGLGFBaEJGO0FBMkJFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLFdBQWY7QUFDRTtBQUFBO0FBQUEsa0JBQUssV0FBVSwwQkFBZjtBQUNFO0FBQUE7QUFBQSxvQkFBSyxXQUFVLGNBQWY7QUFBK0IsdUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIseUNBQXpCO0FBQS9CLGlCQURGO0FBRUU7QUFBQTtBQUFBLG9CQUFLLFdBQVUsZ0JBQWY7QUFBaUMsdUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsK0NBQXpCO0FBQWpDLGlCQUZGO0FBR0U7QUFBQTtBQUFBLG9CQUFLLFdBQVUseUJBQWY7QUFDRTtBQUFBO0FBQUEsc0JBQUcsV0FBVSxzREFBYjtBQUFxRSx5QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qix3Q0FBekI7QUFBckU7QUFERjtBQUhGO0FBREY7QUEzQkY7QUFERixTQUhZO0FBMkNaLCtDQUFLLFdBQVUscUJBQWYsR0EzQ1k7QUE2Q1o7QUFBQTtBQUFBLFlBQUssV0FBVSxrQkFBZjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsMEJBQWY7QUFFRTtBQUFBO0FBQUEsZ0JBQVMsSUFBRyxVQUFaLEVBQXVCLFdBQVUsaURBQWpDO0FBQ0U7QUFBQTtBQUFBLGtCQUFJLFdBQVUscUNBQWQ7QUFBcUQscUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsOEJBQXpCO0FBQXJELGVBREY7QUFFRTtBQUFBO0FBQUEsa0JBQUssV0FBVSxxSEFBZjtBQUNFO0FBQUE7QUFBQSxvQkFBSyxXQUFVLHdCQUFmO0FBQ0U7QUFBQTtBQUFBLHNCQUFLLFdBQVUsd0NBQWY7QUFDRSwyREFBSyxXQUFVLFlBQWYsRUFBNEIsS0FBSSwwQkFBaEMsRUFBMkQsS0FBSSxFQUEvRDtBQUNFLDZCQUFNLEVBRFIsR0FERjtBQUdFO0FBQUE7QUFBQSx3QkFBSyxXQUFVLGNBQWY7QUFDRTtBQUFBO0FBQUEsMEJBQUssV0FBVSxZQUFmO0FBQTZCLDZCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGtDQUF6QjtBQUE3Qix1QkFERjtBQUVFO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFdBQWY7QUFBNEIsNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsd0NBQXpCO0FBQTVCO0FBRkYscUJBSEY7QUFPRTtBQUFBO0FBQUEsd0JBQUssV0FBVSxhQUFmO0FBQ0U7QUFBQTtBQUFBLDBCQUFHLE1BQUssOENBQVI7QUFDRSxxQ0FBVSxxREFEWjtBQUVHLDZCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLCtCQUF6QixDQUZIO0FBQUE7QUFBQTtBQURGO0FBUEY7QUFERixpQkFERjtBQWdCRTtBQUFBO0FBQUEsb0JBQUssV0FBVSx3QkFBZjtBQUNFO0FBQUE7QUFBQSxzQkFBSyxXQUFVLHNDQUFmO0FBQ0UsMkRBQUssV0FBVSxZQUFmLEVBQTRCLEtBQUksK0JBQWhDO0FBQ0UsMkJBQUksRUFETixFQUNTLE9BQU0sRUFEZixHQURGO0FBR0U7QUFBQTtBQUFBLHdCQUFLLFdBQVUsY0FBZjtBQUNFO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFlBQWY7QUFBNkIsNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsdUNBQXpCO0FBQTdCLHVCQURGO0FBRUU7QUFBQTtBQUFBLDBCQUFLLFdBQVUsV0FBZjtBQUE0Qiw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qiw2Q0FBekI7QUFBNUI7QUFGRixxQkFIRjtBQU9FO0FBQUE7QUFBQSx3QkFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsMEJBQUcsTUFBSywyQ0FBUjtBQUNFLHFDQUFVLG1EQURaO0FBRUcsNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsK0JBQXpCLENBRkg7QUFBQTtBQUFBO0FBREY7QUFQRjtBQURGLGlCQWhCRjtBQStCRTtBQUFBO0FBQUEsb0JBQUssV0FBVSx3QkFBZjtBQUNFO0FBQUE7QUFBQSxzQkFBSyxXQUFVLHVDQUFmO0FBQ0UsMkRBQUssV0FBVSxZQUFmLEVBQTRCLEtBQUksNEJBQWhDO0FBQ0UsMkJBQUksRUFETixFQUNTLE9BQU0sRUFEZixHQURGO0FBR0U7QUFBQTtBQUFBLHdCQUFLLFdBQVUsY0FBZjtBQUNFO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFlBQWY7QUFBNkIsNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsb0NBQXpCO0FBQTdCLHVCQURGO0FBRUU7QUFBQTtBQUFBLDBCQUFLLFdBQVUsV0FBZjtBQUE0Qiw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QiwwQ0FBekI7QUFBNUI7QUFGRixxQkFIRjtBQU9FO0FBQUE7QUFBQSx3QkFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsMEJBQUcsTUFBSywyQ0FBUjtBQUNFLHFDQUFVLG9EQURaO0FBRUcsNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsK0JBQXpCLENBRkg7QUFBQTtBQUFBO0FBREY7QUFQRjtBQURGO0FBL0JGO0FBRkYsYUFGRjtBQXFERTtBQUFBO0FBQUEsZ0JBQVMsSUFBRyxRQUFaLEVBQXFCLFdBQVUsaURBQS9CO0FBQ0U7QUFBQTtBQUFBLGtCQUFLLFdBQVUsVUFBZjtBQUNFO0FBQUE7QUFBQSxvQkFBSyxXQUFVLGVBQWY7QUFDRTtBQUFBO0FBQUEsc0JBQUssV0FBVSxnQkFBZjtBQUNFLDhEQUFRLE9BQU0sTUFBZCxFQUFxQixRQUFPLEtBQTVCO0FBQ0UsMkJBQUksNERBRE47QUFFRSw2QkFBTyxFQUFDLFFBQVEsQ0FBVCxFQUFZLGlCQUFnQixpQkFBNUIsRUFGVDtBQURGO0FBREYsaUJBREY7QUFRRTtBQUFBO0FBQUEsb0JBQUssV0FBVSxlQUFmLEVBQStCLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBdEM7QUFDRTtBQUFBO0FBQUEsc0JBQUssV0FBVSxnQkFBZjtBQUNFLDhEQUFRLE9BQU0sTUFBZCxFQUFxQixRQUFPLEtBQTVCO0FBQ0UsMkJBQUksNERBRE47QUFFQSw2QkFBTyxFQUFDLFFBQVEsQ0FBVCxFQUFZLGlCQUFnQixpQkFBNUIsRUFGUDtBQURGO0FBREYsaUJBUkY7QUFlRTtBQUFBO0FBQUEsb0JBQUssV0FBVSxlQUFmLEVBQStCLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBdEM7QUFDRTtBQUFBO0FBQUEsc0JBQUssV0FBVSxnQkFBZjtBQUNFLDhEQUFRLE9BQU0sTUFBZCxFQUFxQixRQUFPLEtBQTVCO0FBQ0UsMkJBQUksNERBRE47QUFFQSw2QkFBTyxFQUFDLFFBQVEsQ0FBVCxFQUFZLGlCQUFnQixpQkFBNUIsRUFGUDtBQURGO0FBREYsaUJBZkY7QUFzQkU7QUFBQTtBQUFBLG9CQUFLLFdBQVUsZUFBZixFQUErQixPQUFPLEVBQUMsU0FBUSxNQUFULEVBQXRDO0FBQ0U7QUFBQTtBQUFBLHNCQUFLLFdBQVUsZ0JBQWY7QUFDRSw4REFBUSxPQUFNLE1BQWQsRUFBcUIsUUFBTyxLQUE1QjtBQUNFLDJCQUFJLDREQUROO0FBRUEsNkJBQU8sRUFBQyxRQUFRLENBQVQsRUFBWSxpQkFBZ0IsaUJBQTVCLEVBRlA7QUFERjtBQURGO0FBdEJGLGVBREY7QUErQkUscURBQUssV0FBVSxtQkFBZjtBQS9CRixhQXJERjtBQXVGRTtBQUFBO0FBQUEsZ0JBQVMsSUFBRyxNQUFaLEVBQW1CLFdBQVUsaURBQTdCO0FBRUU7QUFBQTtBQUFBLGtCQUFJLFdBQVUscUNBQWQ7QUFBcUQscUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsMEJBQXpCO0FBQXJELGVBRkY7QUFJRTtBQUFBO0FBQUEsa0JBQUssV0FBVSw4REFBZjtBQUVFO0FBQUE7QUFBQSxvQkFBSyxXQUFVLHdCQUFmO0FBQ0U7QUFBQTtBQUFBLHNCQUFLLFdBQVUsOEhBQWY7QUFFRTtBQUFBO0FBQUEsd0JBQUssV0FBVSx3QkFBZjtBQUNFO0FBQUE7QUFBQSwwQkFBSyxXQUFVLE1BQWY7QUFDRTtBQUFBO0FBQUEsNEJBQUssV0FBVSxjQUFmO0FBQ0U7QUFBQTtBQUFBLDhCQUFJLFdBQVUsWUFBZDtBQUE0QixpQ0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixpQ0FBekI7QUFBNUIsMkJBREY7QUFFRTtBQUFBO0FBQUEsOEJBQUssV0FBVSw0QkFBZjtBQUNFLDRFQUFlLGNBQWMsRUFBQyxVQUFVLENBQVgsRUFBYyxPQUFPLFdBQXJCLEVBQTdCLEVBQWdFLGdCQUFlLFVBQS9FO0FBREY7QUFGRjtBQURGO0FBREYscUJBRkY7QUFhRTtBQUFBO0FBQUEsd0JBQUssV0FBVSx3QkFBZjtBQUNFO0FBQUE7QUFBQSwwQkFBSyxXQUFVLE1BQWY7QUFDRTtBQUFBO0FBQUEsNEJBQUssV0FBVSxjQUFmO0FBQ0U7QUFBQTtBQUFBLDhCQUFJLFdBQVUsWUFBZDtBQUE0QixpQ0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QiwrQkFBekI7QUFBNUIsMkJBREY7QUFFRTtBQUFBO0FBQUEsOEJBQUssV0FBVSwwQkFBZjtBQUNFLDRFQUFlLGNBQWMsRUFBQyxVQUFVLENBQVgsRUFBN0IsRUFBNEMsZ0JBQWUsUUFBM0Q7QUFERjtBQUZGO0FBREY7QUFERjtBQWJGO0FBREYsaUJBRkY7QUE4QkU7QUFBQTtBQUFBLG9CQUFLLFdBQVUsd0JBQWY7QUFDRTtBQUFBO0FBQUEsc0JBQUssV0FBVSw4SEFBZjtBQUVFO0FBQUE7QUFBQSx3QkFBSyxXQUFVLGlEQUFmO0FBQ0U7QUFBQTtBQUFBLDBCQUFLLFdBQVUsTUFBZjtBQUNFO0FBQUE7QUFBQSw0QkFBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUEsOEJBQUssV0FBVSxlQUFmO0FBQ0UsbUVBQUssV0FBVSxZQUFmLEVBQTRCLEtBQUksZ0JBQWhDLEVBQWlELEtBQUksRUFBckQsRUFBd0QsT0FBTSxFQUE5RCxHQURGO0FBRUU7QUFBQTtBQUFBLGdDQUFLLFdBQVUsY0FBZjtBQUNFO0FBQUE7QUFBQSxrQ0FBSyxXQUFVLFdBQWY7QUFBNEIscUNBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsa0NBQXpCO0FBQTVCO0FBREY7QUFGRiwyQkFERjtBQVFFO0FBQUE7QUFBQSw4QkFBSyxXQUFVLGVBQWYsRUFBK0IsT0FBTyxFQUFDLFNBQVEsTUFBVCxFQUF0QztBQUNFLG1FQUFLLFdBQVUsWUFBZixFQUE0QixLQUFJLGdCQUFoQyxFQUFpRCxLQUFJLEVBQXJEO0FBQ0UscUNBQU0sRUFEUixHQURGO0FBR0U7QUFBQTtBQUFBLGdDQUFLLFdBQVUsY0FBZjtBQUNFO0FBQUE7QUFBQSxrQ0FBSyxXQUFVLFdBQWY7QUFBNEIscUNBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsa0NBQXpCO0FBQTVCO0FBREY7QUFIRiwyQkFSRjtBQWdCRTtBQUFBO0FBQUEsOEJBQUssV0FBVSxlQUFmLEVBQStCLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBdEM7QUFDRSxtRUFBSyxXQUFVLFlBQWYsRUFBNEIsS0FBSSxnQkFBaEMsRUFBaUQsS0FBSSxFQUFyRCxFQUF3RCxPQUFNLEVBQTlELEdBREY7QUFFRTtBQUFBO0FBQUEsZ0NBQUssV0FBVSxjQUFmO0FBQ0U7QUFBQTtBQUFBLGtDQUFLLFdBQVUsV0FBZjtBQUE0QixxQ0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixrQ0FBekI7QUFBNUI7QUFERjtBQUZGLDJCQWhCRjtBQXVCRTtBQUFBO0FBQUEsOEJBQUssV0FBVSxlQUFmLEVBQStCLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBdEM7QUFDRSxtRUFBSyxXQUFVLFlBQWYsRUFBNEIsS0FBSSxnQkFBaEMsRUFBaUQsS0FBSSxFQUFyRDtBQUNFLHFDQUFNLEVBRFIsR0FERjtBQUdFO0FBQUE7QUFBQSxnQ0FBSyxXQUFVLGNBQWY7QUFDRTtBQUFBO0FBQUEsa0NBQUssV0FBVSxXQUFmO0FBQTRCLHFDQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGtDQUF6QjtBQUE1QjtBQURGO0FBSEYsMkJBdkJGO0FBK0JFO0FBQUE7QUFBQSw4QkFBSyxXQUFVLGVBQWYsRUFBK0IsT0FBTyxFQUFDLFNBQVEsTUFBVCxFQUF0QztBQUNFLG1FQUFLLFdBQVUsWUFBZixFQUE0QixLQUFJLGdCQUFoQyxFQUFpRCxLQUFJLEVBQXJEO0FBQ0UscUNBQU0sRUFEUixHQURGO0FBR0U7QUFBQTtBQUFBLGdDQUFLLFdBQVUsY0FBZjtBQUNFO0FBQUE7QUFBQSxrQ0FBSyxXQUFVLFdBQWY7QUFDRyxxQ0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixrQ0FBekI7QUFESDtBQURGO0FBSEY7QUEvQkYseUJBREY7QUF5Q0UsK0RBQUssV0FBVSxtQkFBZjtBQXpDRjtBQURGLHFCQUZGO0FBZ0RFO0FBQUE7QUFBQSx3QkFBSyxXQUFVLGlEQUFmO0FBQ0U7QUFBQTtBQUFBLDBCQUFLLFdBQVUsTUFBZjtBQUNFO0FBQUE7QUFBQSw0QkFBSyxXQUFVLGNBQWY7QUFDRTtBQUFBO0FBQUEsOEJBQUksV0FBVSxZQUFkO0FBQTRCLGlDQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGdDQUF6QjtBQUE1QiwyQkFERjtBQUVFO0FBQUE7QUFBQSw4QkFBSyxXQUFVLDJCQUFmO0FBQ0UsNEVBQWUsY0FBYyxFQUFDLFVBQVUsQ0FBWCxFQUE3QjtBQUNDLDhDQUFlLDhFQURoQjtBQURGO0FBRkY7QUFERjtBQURGO0FBaERGO0FBREY7QUE5QkY7QUFKRixhQXZGRjtBQTBMRTtBQUFBO0FBQUEsZ0JBQVMsSUFBRyxjQUFaLEVBQTJCLFdBQVUsMEVBQXJDO0FBRUU7QUFBQTtBQUFBLGtCQUFLLFdBQVUsNkNBQWY7QUFFRTtBQUFBO0FBQUEsb0JBQUssV0FBVSw0RUFBZjtBQUNFO0FBQUE7QUFBQSxzQkFBSyxXQUFVLG9GQUFmO0FBRUU7QUFBQTtBQUFBLHdCQUFLLFdBQVUsb0VBQWY7QUFDRTtBQUFBO0FBQUEsMEJBQUksV0FBVSx1RUFBZDtBQUNHLDZCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGdDQUF6QjtBQURILHVCQURGO0FBSUUsMkRBQUcsV0FBVSxpREFBYixFQUErRCxNQUFLLHVDQUFwRSxFQUE0RyxRQUFPLEtBQW5ILEdBSkY7QUFLRSwyREFBRyxXQUFVLGdEQUFiLEVBQThELE1BQUssa0NBQW5FLEVBQXNHLFFBQU8sS0FBN0csR0FMRjtBQU1FLDJEQUFHLFdBQVUsa0RBQWIsRUFBZ0UsTUFBSyx5Q0FBckUsRUFBK0csUUFBTyxLQUF0SCxHQU5GO0FBT0UsMkRBQUcsV0FBVSxrREFBYixFQUFnRSxNQUFLLHdDQUFyRSxFQUE4RyxRQUFPLEtBQXJILEdBUEY7QUFRRSwyREFBRyxXQUFVLGlEQUFiLEVBQStELE1BQUsseUNBQXBFLEVBQThHLFFBQU8sS0FBckg7QUFSRixxQkFGRjtBQWFFO0FBQUE7QUFBQSx3QkFBSyxXQUFVLG1FQUFmO0FBQ0UsNkRBQUssV0FBVSxrRkFBZjtBQUNFLGlEQUF5QixFQUFDLFFBQVEsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixpQ0FBekIsQ0FBVCxFQUQzQixHQURGO0FBSUU7QUFBQTtBQUFBLDBCQUFHLE1BQUssNEJBQVIsRUFBcUMsUUFBTyxLQUE1QyxFQUFrRCxXQUFVLDJDQUE1RDtBQUFBO0FBQUEsdUJBSkY7QUFPRSwrREFQRjtBQVFFO0FBQUE7QUFBQSwwQkFBRyxNQUFLLHVDQUFSLEVBQWdELFFBQU8sS0FBdkQsRUFBNkQsV0FBVSw4Q0FBdkU7QUFDRyw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixxQ0FBekI7QUFESDtBQVJGO0FBYkYsbUJBREY7QUE0QkU7QUFBQTtBQUFBLHNCQUFLLFdBQVUsNEVBQWY7QUFDRSwyREFBSyxLQUFJLCtCQUFULEVBQXlDLEtBQUksTUFBN0MsRUFBb0QsT0FBTSxNQUExRDtBQURGO0FBNUJGO0FBRkY7QUFGRjtBQTFMRjtBQURGLFNBN0NZO0FBa1JaO0FBQUE7QUFBQSxZQUFRLFdBQVUsa0JBQWxCLEVBQXFDLElBQUcsU0FBeEM7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGtCQUFmO0FBQ0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsMkNBQWY7QUFDRTtBQUFBO0FBQUEsa0JBQUksV0FBVSwwQ0FBZDtBQUEwRCxxQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qiw2QkFBekI7QUFBMUQsZUFERjtBQUVFO0FBQUE7QUFBQSxrQkFBRyxXQUFVLHNEQUFiO0FBQ0Usd0RBQU0sV0FBVSx5QkFBaEIsR0FERjtBQUVFO0FBQUE7QUFBQTtBQUFJLHVCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLG1DQUF6QjtBQUFKLGlCQUZGO0FBR0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLGVBRkY7QUFPRTtBQUFBO0FBQUEsa0JBQUcsV0FBVSxzREFBYjtBQUNFLHdEQUFNLFdBQVUsc0JBQWhCLEdBREY7QUFFRTtBQUFBO0FBQUE7QUFBSSx1QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixpQ0FBekI7QUFBSixpQkFGRjtBQUdFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixlQVBGO0FBWUU7QUFBQTtBQUFBLGtCQUFHLFdBQVUsc0RBQWI7QUFDRSx3REFBTSxXQUFVLHlCQUFoQixHQURGO0FBRUU7QUFBQTtBQUFBO0FBQUksdUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsa0NBQXpCO0FBQUosaUJBRkY7QUFHRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSEY7QUFaRixhQURGO0FBbUJFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLHlDQUFmO0FBQ0UscURBQUssS0FBSSx1QkFBVCxFQUFpQyxLQUFJLEVBQXJDLEVBQXdDLE9BQU0sRUFBOUMsRUFBaUQsV0FBVSxNQUEzRCxHQURGO0FBRUUscURBQUssS0FBSSxzQkFBVCxFQUFnQyxLQUFJLEVBQXBDLEVBQXVDLE9BQU0sRUFBN0MsRUFBZ0QsV0FBVSxNQUExRDtBQUZGO0FBbkJGO0FBREY7QUFsUlksT0FBUjtBQTZTRDs7OztFQXpWeUIsZ0JBQU0sUzs7QUE0VmxDLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUErQjtBQUM3QixTQUFPO0FBQ0wsVUFBTSxNQUFNO0FBRFAsR0FBUDtBQUdEOztBQUVELElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLFFBQUQsRUFBWTtBQUNyQyxTQUFPLEVBQVA7QUFDRCxDQUZEOztrQkFJZSx5QkFDYixlQURhLEVBRWIsa0JBRmEsRUFHYixhQUhhLEM7Ozs7Ozs7Ozs7O0FDM1dmOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLGE7OztBQUtuQix5QkFBWSxLQUFaLEVBQWtCO0FBQUE7O0FBQUEsOEhBQ1YsS0FEVTs7QUFHaEIsVUFBSyxLQUFMLEdBQWE7QUFDWCxlQUFTO0FBREUsS0FBYjtBQUhnQjtBQU1qQjs7Ozt3Q0FDa0I7QUFBQTs7QUFDakIsYUFBTyxJQUFQLENBQVksS0FBWixDQUFrQixJQUFsQixDQUF1QixLQUFLLEtBQUwsQ0FBVyxjQUFsQyxFQUFrRCxLQUFLLEtBQUwsQ0FBVyxZQUE3RCxFQUEyRSxRQUEzRSxDQUFvRixVQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWdCO0FBQ2xHLFlBQUksQ0FBQyxHQUFMLEVBQVM7QUFDUCxpQkFBSyxRQUFMLENBQWMsRUFBQyxnQkFBRCxFQUFkO0FBQ0Q7QUFDRixPQUpEO0FBS0Q7Ozs2QkFDTztBQUNOLGFBQU8sZ0RBQU0sU0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUExQixHQUFQO0FBQ0Q7Ozs7RUFyQndDLGdCQUFNLFM7O0FBQTVCLGEsQ0FDWixTLEdBQVk7QUFDakIsa0JBQWdCLG9CQUFVLE1BQVYsQ0FBaUIsVUFEaEI7QUFFakIsZ0JBQWMsb0JBQVUsTUFBVixDQUFpQjtBQUZkLEM7a0JBREEsYTs7Ozs7Ozs7Ozs7QUNKckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRU0sZTs7O0FBQ0osMkJBQVksS0FBWixFQUFrQjtBQUFBOztBQUFBLDZIQUNWLEtBRFU7QUFFakI7Ozs7NkJBQ087QUFDTixhQUFPLGtEQUFRLG9CQUFtQixXQUEzQixFQUF1QyxhQUFhLENBQ3pEO0FBQ0UsMkJBQWlCLFVBRG5CO0FBRUUsZ0JBQU87QUFBQTtBQUFBLGNBQU0sTUFBSyxXQUFYLEVBQXVCLFdBQVUsZ0JBQWpDO0FBQWtEO0FBQUE7QUFBQTtBQUFPLG1CQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGlDQUF6QjtBQUFQO0FBQWxEO0FBRlQsU0FEeUQsRUFLekQ7QUFDRSwyQkFBaUIsTUFEbkI7QUFFRSxnQkFBTztBQUFBO0FBQUEsY0FBTSxNQUFLLE9BQVgsRUFBbUIsV0FBVSxnQkFBN0I7QUFBOEM7QUFBQTtBQUFBO0FBQU8sbUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsNkJBQXpCO0FBQVA7QUFBOUM7QUFGVCxTQUx5RCxFQVN6RDtBQUNFLDJCQUFpQixlQURuQjtBQUVFLGdCQUFPO0FBQUE7QUFBQSxjQUFNLE1BQUssZUFBWCxFQUEyQixXQUFVLGdCQUFyQztBQUFzRDtBQUFBO0FBQUE7QUFBTyxtQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixxQ0FBekI7QUFBUDtBQUF0RDtBQUZULFNBVHlELEVBYXpEO0FBQ0UsMkJBQWlCLFNBRG5CO0FBRUUsZ0JBQU87QUFBQTtBQUFBLGNBQU0sTUFBSyxVQUFYLEVBQXNCLFdBQVUsZ0JBQWhDO0FBQWlEO0FBQUE7QUFBQTtBQUFPLG1CQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGdDQUF6QjtBQUFQO0FBQWpEO0FBRlQsU0FieUQsRUFpQnpEO0FBQ0UsMkJBQWlCLGdCQURuQjtBQUVFLGdCQUFPO0FBQUE7QUFBQSxjQUFNLE1BQUssZUFBWCxFQUEyQixXQUFVLCtCQUFyQztBQUFxRTtBQUFBO0FBQUE7QUFBTyxtQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixzQ0FBekI7QUFBUDtBQUFyRTtBQUZULFNBakJ5RCxDQUFwRCxFQXFCSixnQkFBZ0IsQ0FDaEIsdURBQWEsS0FBSSxHQUFqQixFQUFxQixvQkFBbUIsV0FBeEMsR0FEZ0IsRUFFaEI7QUFBQTtBQUFBLFlBQXNCLEtBQUksR0FBMUIsRUFBOEIsb0JBQW1CLFdBQWpEO0FBQTZEO0FBQUE7QUFBQSxjQUFNLFdBQVUsNkhBQWhCO0FBQzNEO0FBQUE7QUFBQTtBQUFPLG1CQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLGtDQUF6QjtBQUFQO0FBRDJEO0FBQTdELFNBRmdCLENBckJaLEVBMEJKLFdBQVcsQ0FDVjtBQUFBO0FBQUEsWUFBTSxNQUFLLFdBQVgsRUFBdUIsV0FBVSxnQkFBakM7QUFBa0Q7QUFBQTtBQUFBO0FBQU8saUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsaUNBQXpCO0FBQVA7QUFBbEQsU0FEVSxFQUVWO0FBQUE7QUFBQSxZQUFNLE1BQUssT0FBWCxFQUFtQixXQUFVLGdCQUE3QjtBQUE4QztBQUFBO0FBQUE7QUFBTyxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qiw2QkFBekI7QUFBUDtBQUE5QyxTQUZVLEVBR1Y7QUFBQTtBQUFBLFlBQU0sTUFBSyxlQUFYLEVBQTJCLFdBQVUsZ0JBQXJDO0FBQXNEO0FBQUE7QUFBQTtBQUFPLGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLHFDQUF6QjtBQUFQO0FBQXRELFNBSFUsRUFJVjtBQUFBO0FBQUEsWUFBTSxNQUFLLFVBQVgsRUFBc0IsV0FBVSxnQkFBaEM7QUFBaUQ7QUFBQTtBQUFBO0FBQU8saUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsZ0NBQXpCO0FBQVA7QUFBakQsU0FKVSxFQUtWO0FBQUE7QUFBQSxZQUFNLE1BQUssZUFBWCxFQUEyQixXQUFVLCtCQUFyQztBQUFxRTtBQUFBO0FBQUE7QUFBTyxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixzQ0FBekI7QUFBUDtBQUFyRSxTQUxVLENBMUJQLEdBQVA7QUFpQ0Q7Ozs7RUF0QzJCLGdCQUFNLFM7O0FBeUNwQyxTQUFTLGVBQVQsQ0FBeUIsS0FBekIsRUFBK0I7QUFDN0IsU0FBTztBQUNMLFVBQU0sTUFBTTtBQURQLEdBQVA7QUFHRDs7QUFFRCxJQUFNLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBQyxRQUFELEVBQVk7QUFDckMsU0FBTyxFQUFQO0FBQ0QsQ0FGRDs7a0JBSWUseUJBQ2IsZUFEYSxFQUViLGtCQUZhLEVBR2IsZUFIYSxDOzs7Ozs7Ozs7OztBQzFEZjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixNOzs7QUFRbkIsa0JBQVksS0FBWixFQUFrQjtBQUFBOztBQUFBLGdIQUNWLEtBRFU7O0FBR2hCLFVBQUssS0FBTCxHQUFhLE1BQUssS0FBTCxDQUFXLElBQVgsT0FBYjtBQUNBLFVBQUssY0FBTCxHQUFzQixNQUFLLGNBQUwsQ0FBb0IsSUFBcEIsT0FBdEI7QUFDQSxVQUFLLE1BQUwsR0FBYyxNQUFLLE1BQUwsQ0FBWSxJQUFaLE9BQWQ7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5COztBQUVBLFVBQUssS0FBTCxHQUFhO0FBQ1gsZUFBUztBQURFLEtBQWI7QUFSZ0I7QUFXakI7Ozs7NEJBQ007QUFDTCxXQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLFdBQWpCO0FBQ0Q7OzttQ0FDYyxDLEVBQUU7QUFDZixVQUFJLEVBQUUsTUFBRixLQUFhLEVBQUUsYUFBbkIsRUFBaUM7QUFDL0IsYUFBSyxLQUFMO0FBQ0Q7QUFDRjs7OzZCQUNPO0FBQUE7O0FBQ04saUJBQVcsWUFBSTtBQUNiLGVBQUssUUFBTCxDQUFjO0FBQ1osbUJBQVM7QUFERyxTQUFkO0FBR0QsT0FKRCxFQUlHLEVBSkg7QUFLRDs7O2dDQUNXLE8sRUFBUyxhLEVBQWM7QUFDakMsV0FBSyxRQUFMLENBQWM7QUFDWixpQkFBUztBQURHLE9BQWQ7QUFHQSxpQkFBVyxhQUFYLEVBQTBCLEdBQTFCO0FBQ0Q7Ozs2QkFDTztBQUNOLGFBQVE7QUFBQTtBQUFBLFVBQVEsS0FBSSxRQUFaLEVBQXFCLGVBQWUsS0FBSyxLQUFMLENBQVcsUUFBL0MsRUFBeUQsUUFBUSxLQUFLLE1BQXRFLEVBQThFLGFBQWEsS0FBSyxXQUFoRyxFQUE2RyxnQkFBN0c7QUFDWjtBQUFBO0FBQUEsWUFBSyx1QkFBcUIsS0FBSyxLQUFMLENBQVcsa0JBQWhDLGlCQUE2RCxLQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCLEdBQWlDLEVBQTlGLENBQUwsRUFBeUcsU0FBUyxLQUFLLGNBQXZIO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxlQUFmO0FBQ0k7QUFBQTtBQUFBLGdCQUFLLFdBQVUsZUFBZjtBQUNFO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGNBQWY7QUFDSyxxQkFBSyxLQUFMLENBQVcsS0FEaEI7QUFFSSx3REFBTSxXQUFVLDhCQUFoQixFQUErQyxTQUFTLEtBQUssS0FBN0Q7QUFGSjtBQURGLGFBREo7QUFPSTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxnQkFBZjtBQUNHLG1CQUFLLEtBQUwsQ0FBVztBQURkLGFBUEo7QUFVSTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxlQUFmO0FBQ0csbUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBSyxLQUF2QjtBQURIO0FBVko7QUFERjtBQURZLE9BQVI7QUFrQkQ7Ozs7RUE1RGlDLGdCQUFNLFM7O0FBQXJCLE0sQ0FDWixTLEdBQVk7QUFDakIsWUFBVSxvQkFBVSxPQUFWLENBQWtCLFVBRFg7QUFFakIsU0FBTyxvQkFBVSxNQUFWLENBQWlCLFVBRlA7QUFHakIsc0JBQW9CLG9CQUFVLE1BQVYsQ0FBaUIsVUFIcEI7QUFJakIsV0FBUyxvQkFBVSxPQUFWLENBQWtCLFVBSlY7QUFLakIsVUFBUSxvQkFBVSxJQUFWLENBQWU7QUFMTixDO2tCQURBLE07Ozs7Ozs7Ozs7O0FDSnJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCLFE7OztBQU9uQixvQkFBWSxLQUFaLEVBQWtCO0FBQUE7O0FBQUEsb0hBQ1YsS0FEVTs7QUFFaEIsVUFBSyxNQUFMLEdBQWMsTUFBSyxNQUFMLENBQVksSUFBWixPQUFkO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQUNBLFVBQUssS0FBTCxHQUFhLE1BQUssS0FBTCxDQUFXLElBQVgsT0FBYjs7QUFFQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFdBQUssSUFETTtBQUVYLFlBQU0sSUFGSztBQUdYLGlCQUFXLElBSEE7QUFJWCxrQkFBWSxJQUpEO0FBS1gsZUFBUztBQUxFLEtBQWI7QUFOZ0I7QUFhakI7Ozs7MkJBQ00sTyxFQUFRO0FBQ2IsVUFBSSxZQUFZLEtBQUssSUFBTCxDQUFVLFNBQTFCO0FBQ0EsVUFBSSxFQUFFLHFCQUFxQixXQUF2QixDQUFKLEVBQXdDO0FBQ3RDLG9CQUFZLDJCQUFZLFNBQVosQ0FBWjtBQUNEOztBQUVELFVBQUksVUFBVSxFQUFFLFNBQUYsQ0FBZDtBQUNBLFVBQUksU0FBUyxFQUFFLEtBQUssSUFBTCxDQUFVLEtBQVosQ0FBYjtBQUNBLFVBQUksWUFBWSxFQUFFLEtBQUssSUFBTCxDQUFVLFFBQVosQ0FBaEI7O0FBRUEsVUFBSSxXQUFXLFFBQVEsTUFBUixFQUFmO0FBQ0EsVUFBSSxjQUFjLEVBQUUsTUFBRixFQUFVLEtBQVYsRUFBbEI7QUFDQSxVQUFJLHlCQUEwQixjQUFjLFNBQVMsSUFBeEIsR0FBZ0MsU0FBUyxJQUF0RTs7QUFFQSxVQUFJLE9BQU8sSUFBWDtBQUNBLFVBQUksc0JBQUosRUFBMkI7QUFDekIsZUFBTyxTQUFTLElBQVQsR0FBZ0IsVUFBVSxVQUFWLEVBQWhCLEdBQXlDLFFBQVEsVUFBUixFQUFoRDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sU0FBUyxJQUFoQjtBQUNEO0FBQ0QsVUFBSSxNQUFNLFNBQVMsR0FBVCxHQUFlLFFBQVEsV0FBUixFQUFmLEdBQXVDLENBQWpEOztBQUVBLFVBQUksWUFBWSxJQUFoQjtBQUNBLFVBQUksYUFBYSxJQUFqQjtBQUNBLFVBQUksc0JBQUosRUFBMkI7QUFDekIscUJBQWMsUUFBUSxVQUFSLEtBQXVCLENBQXhCLEdBQThCLE9BQU8sS0FBUCxLQUFlLENBQTFEO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsb0JBQWEsUUFBUSxVQUFSLEtBQXVCLENBQXhCLEdBQThCLE9BQU8sS0FBUCxLQUFlLENBQXpEO0FBQ0Q7O0FBRUQsV0FBSyxRQUFMLENBQWMsRUFBQyxRQUFELEVBQU0sVUFBTixFQUFZLG9CQUFaLEVBQXVCLHNCQUF2QixFQUFtQyxTQUFTLElBQTVDLEVBQWQ7QUFDRDs7O2dDQUNXLE8sRUFBUyxhLEVBQWM7QUFDakMsV0FBSyxRQUFMLENBQWM7QUFDWixpQkFBUztBQURHLE9BQWQ7QUFHQSxpQkFBVyxhQUFYLEVBQTBCLEdBQTFCO0FBQ0Q7Ozs0QkFDTTtBQUNMLFdBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsV0FBakI7QUFDRDs7OzZCQUNPO0FBQUE7O0FBQ04sYUFBTztBQUFBO0FBQUEsVUFBUSxLQUFJLFFBQVosRUFBcUIsZUFBZSxnQkFBTSxZQUFOLENBQW1CLEtBQUssS0FBTCxDQUFXLFFBQTlCLEVBQXdDLEVBQUUsS0FBSyxXQUFQLEVBQXhDLENBQXBDO0FBQ0wsMEJBREssRUFDTSx5QkFETixFQUMwQixtQkFEMUIsRUFDd0MsUUFBUSxLQUFLLE1BRHJELEVBQzZELGFBQWEsS0FBSyxXQUQvRTtBQUVMO0FBQUE7QUFBQSxZQUFLLEtBQUksVUFBVDtBQUNFLG1CQUFPO0FBQ0wsbUJBQUssS0FBSyxLQUFMLENBQVcsR0FEWDtBQUVMLG9CQUFNLEtBQUssS0FBTCxDQUFXO0FBRlosYUFEVDtBQUtFLHVCQUFjLEtBQUssS0FBTCxDQUFXLGtCQUF6QixrQkFBd0QsS0FBSyxLQUFMLENBQVcsa0JBQW5FLGtCQUFrRyxLQUFLLEtBQUwsQ0FBVyxlQUE3RyxVQUFnSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCLEdBQWlDLEVBQWpLLENBTEY7QUFNRSxrREFBTSxXQUFVLE9BQWhCLEVBQXdCLEtBQUksT0FBNUIsRUFBb0MsT0FBTyxFQUFDLE1BQU0sS0FBSyxLQUFMLENBQVcsU0FBbEIsRUFBNkIsT0FBTyxLQUFLLEtBQUwsQ0FBVyxVQUEvQyxFQUEzQyxHQU5GO0FBT0U7QUFBQTtBQUFBLGNBQUssV0FBVSxvQkFBZjtBQUNHLGlCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQWpCLENBQXFCLFVBQUMsSUFBRCxFQUFPLEtBQVAsRUFBZTtBQUNuQyxrQkFBSSxVQUFVLE9BQU8sSUFBUCxLQUFnQixVQUFoQixHQUE2QixLQUFLLE9BQUssS0FBVixDQUE3QixHQUFnRCxJQUE5RDtBQUNBLHFCQUFRO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGVBQWYsRUFBK0IsS0FBSyxLQUFwQztBQUNMO0FBREssZUFBUjtBQUdELGFBTEE7QUFESDtBQVBGO0FBRkssT0FBUDtBQW1CRDs7OztFQWxGbUMsZ0JBQU0sUzs7QUFBdkIsUSxDQUNaLFMsR0FBWTtBQUNqQixzQkFBb0Isb0JBQVUsTUFBVixDQUFpQixVQURwQjtBQUVqQixtQkFBaUIsb0JBQVUsTUFBVixDQUFpQixVQUZqQjtBQUdqQixZQUFVLG9CQUFVLE9BQVYsQ0FBa0IsVUFIWDtBQUlqQixTQUFPLG9CQUFVLE9BQVYsQ0FBa0Isb0JBQVUsU0FBVixDQUFvQixDQUFDLG9CQUFVLE9BQVgsRUFBb0Isb0JBQVUsSUFBOUIsQ0FBcEIsQ0FBbEIsRUFBNEU7QUFKbEUsQztrQkFEQSxROzs7Ozs7Ozs7OztBQ0xyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7SUFFTSxJOzs7Ozs7Ozs7Ozs2QkFTSTtBQUFBOztBQUNOLGFBQU87QUFBQTtBQUFBLFVBQUksV0FBVSxNQUFkO0FBQ0osYUFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixHQUFuQixDQUF1QixVQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWdCO0FBQ3RDLGlCQUFPO0FBQUE7QUFBQSxjQUFJLFdBQVUsV0FBZDtBQUNMO0FBQUE7QUFBQSxnQkFBTSxXQUFVLHVCQUFoQjtBQUNFO0FBQUE7QUFBQSxrQkFBRyxNQUFNLE1BQU0sSUFBZixFQUFxQixRQUFPLEtBQTVCO0FBQW1DLHNCQUFNO0FBQXpDLGVBREY7QUFFRyxvQkFBTTtBQUZULGFBREs7QUFLTDtBQUFBO0FBQUEsZ0JBQU0sV0FBVSxnQkFBaEI7QUFBa0MscUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsTUFBckIsQ0FBNEIsTUFBTSxlQUFsQztBQUFsQztBQUxLLFdBQVA7QUFPRCxTQVJBO0FBREksT0FBUDtBQVdEOzs7O0VBckJnQixnQkFBTSxTOztBQUFuQixJLENBQ0csUyxHQUFZO0FBQ2pCLFdBQVMsb0JBQVUsT0FBVixDQUFrQixvQkFBVSxLQUFWLENBQWdCO0FBQ3pDLHFCQUFpQixvQkFBVSxNQUFWLENBQWlCLFVBRE87QUFFekMsaUJBQWEsb0JBQVUsTUFBVixDQUFpQixVQUZXO0FBR3pDLFVBQU0sb0JBQVUsTUFBVixDQUFpQixVQUhrQjtBQUl6QyxXQUFPLG9CQUFVLE1BQVYsQ0FBaUI7QUFKaUIsR0FBaEIsQ0FBbEIsRUFLTDtBQU5hLEM7OztBQXVCckIsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQStCO0FBQzdCLFNBQU87QUFDTCxVQUFNLE1BQU07QUFEUCxHQUFQO0FBR0Q7O0FBRUQsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLENBQUMsUUFBRCxFQUFZO0FBQ3JDLFNBQU8sRUFBUDtBQUNELENBRkQ7O2tCQUllLHlCQUNiLGVBRGEsRUFFYixrQkFGYSxFQUdiLElBSGEsQzs7Ozs7Ozs7Ozs7OztBQ3RDZjs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUM7QUFDL0IsTUFBSSxDQUFDLEVBQUUsTUFBRixFQUFVLElBQVYsRUFBTCxFQUFzQjtBQUNwQixXQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsTUFBdkI7QUFDQTtBQUNEOztBQUVELE1BQUksWUFBWSxFQUFoQjtBQUNBLE1BQUksWUFBWSxFQUFFLE1BQUYsRUFBVSxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCLFNBQXpDOztBQUVBLElBQUUsWUFBRixFQUFnQixJQUFoQixHQUF1QixPQUF2QixDQUErQjtBQUM3QixlQUFZO0FBRGlCLEdBQS9CLEVBRUc7QUFDRCxjQUFXLEdBRFY7QUFFRCxZQUFTO0FBRlIsR0FGSDs7QUFPQSxhQUFXLFlBQUk7QUFDYixXQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsTUFBdkI7QUFDRCxHQUZELEVBRUcsR0FGSDtBQUdEOztJQUVvQixJOzs7QUFDbkIsZ0JBQVksS0FBWixFQUFrQjtBQUFBOztBQUFBLDRHQUNWLEtBRFU7O0FBR2hCLFVBQUssT0FBTCxHQUFlLE1BQUssT0FBTCxDQUFhLElBQWIsT0FBZjtBQUNBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCOztBQUVBLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUTtBQURHLEtBQWI7QUFQZ0I7QUFVakI7Ozs7NEJBQ08sQyxFQUFHLEUsRUFBRztBQUNaLFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxJQUFtQixLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLENBQWhCLE1BQXVCLEdBQTlDLEVBQWtEO0FBQ2hELFVBQUUsY0FBRjtBQUNBLHdCQUFnQixLQUFLLEtBQUwsQ0FBVyxJQUEzQjtBQUNEO0FBQ0QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFmLEVBQXVCO0FBQ3JCLGFBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsQ0FBbkIsRUFBc0IsRUFBdEI7QUFDRDtBQUNGOzs7aUNBQ1ksQyxFQUFHLEUsRUFBRztBQUNqQixXQUFLLFFBQUwsQ0FBYyxFQUFDLFFBQVEsSUFBVCxFQUFkO0FBQ0EsVUFBSSxLQUFLLEtBQUwsQ0FBVyxZQUFmLEVBQTRCO0FBQzFCLGFBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsQ0FBeEIsRUFBMkIsRUFBM0I7QUFDRDtBQUNGOzs7K0JBQ1UsQyxFQUFHLEUsRUFBRztBQUNmLFdBQUssUUFBTCxDQUFjLEVBQUMsUUFBUSxLQUFULEVBQWQ7QUFDQSxXQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLEVBQWhCO0FBQ0EsVUFBSSxLQUFLLEtBQUwsQ0FBVyxVQUFmLEVBQTBCO0FBQ3hCLGFBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsQ0FBdEIsRUFBeUIsRUFBekI7QUFDRDtBQUNGOzs7NkJBQ087QUFDTixhQUFPLGdEQUFPLEtBQUssS0FBWjtBQUNMLG1CQUFXLEtBQUssS0FBTCxDQUFXLFNBQVgsSUFBd0IsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFwQixHQUFnQyxFQUF4RCxDQUROO0FBRUwsaUJBQVMsS0FBSyxPQUZULEVBRWtCLGNBQWMsS0FBSyxZQUZyQyxFQUVtRCxZQUFZLEtBQUssVUFGcEUsSUFBUDtBQUdEOzs7O0VBdEMrQixnQkFBTSxTOztrQkFBbkIsSTs7Ozs7Ozs7Ozs7QUN4QnJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixNOzs7QUFDbkIsa0JBQVksS0FBWixFQUFrQjtBQUFBOztBQUFBLGdIQUNWLEtBRFU7O0FBRWhCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLGtCQUFZO0FBREQsS0FBYjtBQUpnQjtBQU9qQjs7OzsrQkFXUztBQUNSLFdBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVk7QUFEQSxPQUFkO0FBR0Q7OztnQ0FDVTtBQUNULFdBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVk7QUFEQSxPQUFkO0FBR0Q7Ozs2QkFDTztBQUFBOztBQUNOLGFBQ1E7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssdUJBQXFCLEtBQUssS0FBTCxDQUFXLGtCQUFyQztBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsZ0JBQWY7QUFDRSxtREFBSyxXQUFVLGFBQWYsR0FERjtBQUdFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLGNBQWY7QUFDRTtBQUFBO0FBQUEsa0JBQUksV0FBVSx3QkFBZDtBQUNFO0FBQUE7QUFBQSxvQkFBSSw0QkFBMEIsS0FBSyxLQUFMLENBQVcsa0JBQXJDLDZCQUFKO0FBQ0U7QUFBQTtBQUFBLHNCQUFHLFdBQWMsS0FBSyxLQUFMLENBQVcsa0JBQXpCLDhCQUFILEVBQTJFLFNBQVMsS0FBSyxRQUF6RjtBQUNFLDREQUFNLFdBQVUsbUJBQWhCO0FBREY7QUFERixpQkFERjtBQU1HLHFCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEdBQXZCLENBQTJCLFVBQUMsSUFBRCxFQUFPLEtBQVAsRUFBZTtBQUN6QyxzQkFBSSxDQUFDLElBQUwsRUFBVTtBQUNSLDJCQUFPLElBQVA7QUFDRDtBQUNELHlCQUFRO0FBQUE7QUFBQSxzQkFBSSxLQUFLLEtBQVQsRUFBZ0IsNEJBQTBCLE9BQUssS0FBTCxDQUFXLGtCQUFyQyxxQkFBdUUsS0FBSyxlQUE1RjtBQUNMLHlCQUFLO0FBREEsbUJBQVI7QUFHRCxpQkFQQSxFQU9FLE1BUEYsQ0FPUztBQUFBLHlCQUFNLENBQUMsQ0FBQyxJQUFSO0FBQUEsaUJBUFQ7QUFOSDtBQURGLGFBSEY7QUFvQkU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsd0JBQWY7QUFDRTtBQUFBO0FBQUEsa0JBQUssV0FBVSxrQ0FBZjtBQUNHLHFCQUFLLEtBQUwsQ0FBVyxjQURkO0FBRUUsdUVBQWEsb0JBQW9CLEtBQUssS0FBTCxDQUFXLGtCQUE1QyxHQUZGO0FBR0UsMEVBQWdCLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxrQkFBL0M7QUFIRjtBQURGO0FBcEJGO0FBREYsU0FERjtBQStCRSx3REFBTSxNQUFNLEtBQUssS0FBTCxDQUFXLFVBQXZCLEVBQW1DLFNBQVMsS0FBSyxTQUFqRDtBQUNFLGlCQUFPLEtBQUssS0FBTCxDQUFXLFNBRHBCLEVBQytCLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxrQkFEOUQsRUFDa0YsWUFBWSxLQUFLLEtBQUwsQ0FBVyxVQUR6RztBQS9CRixPQURSO0FBb0NEOzs7O0VBbEVpQyxnQkFBTSxTOztBQUFyQixNLENBU1osUyxHQUFZO0FBQ2pCLHNCQUFvQixvQkFBVSxNQUFWLENBQWlCLFVBRHBCO0FBRWpCLGVBQWEsb0JBQVUsT0FBVixDQUFrQixvQkFBVSxLQUFWLENBQWdCO0FBQzdDLHFCQUFpQixvQkFBVSxNQURrQjtBQUU3QyxVQUFNLG9CQUFVLE9BQVYsQ0FBa0I7QUFGcUIsR0FBaEIsQ0FBbEIsRUFHVCxVQUxhO0FBTWpCLGFBQVcsb0JBQVUsT0FBVixDQUFrQixvQkFBVSxPQUE1QixFQUFxQyxVQU4vQjtBQU9qQixrQkFBZ0Isb0JBQVUsT0FBVixDQUFrQixvQkFBVSxPQUE1QixFQUFxQyxVQVBwQztBQVFqQixjQUFZLG9CQUFVO0FBUkwsQztrQkFUQSxNOzs7Ozs7Ozs7OztBQ05yQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0lBRU0sYzs7Ozs7Ozs7Ozs7NkJBSUk7QUFBQTs7QUFDTixhQUFPO0FBQUE7QUFBQSxVQUFVLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxrQkFBekMsRUFBNkQsaUJBQWdCLGlCQUE3RSxFQUErRixPQUFPLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsU0FBbkIsQ0FBNkIsR0FBN0IsQ0FBaUMsVUFBQyxNQUFELEVBQVU7QUFDdEosbUJBQVE7QUFBQTtBQUFBLGdCQUFHLFdBQWMsT0FBSyxLQUFMLENBQVcsa0JBQXpCLHdCQUE4RCxPQUFLLEtBQUwsQ0FBVyxrQkFBekUsMEJBQUgsRUFBdUgsU0FBUyxPQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLElBQXJCLFNBQWdDLE9BQU8sTUFBdkMsQ0FBaEk7QUFDTjtBQUFBO0FBQUE7QUFBTyx1QkFBTztBQUFkO0FBRE0sYUFBUjtBQUdELFdBSjRHLENBQXRHO0FBS0w7QUFBQTtBQUFBLFlBQUcsV0FBYyxLQUFLLEtBQUwsQ0FBVyxrQkFBekIscUJBQTJELEtBQUssS0FBTCxDQUFXLGtCQUF0RSwwQkFBSDtBQUNFO0FBQUE7QUFBQTtBQUFPLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQTFCO0FBREY7QUFMSyxPQUFQO0FBU0Q7Ozs7RUFkMEIsZ0JBQU0sUzs7QUFBN0IsYyxDQUNHLFMsR0FBWTtBQUNqQixzQkFBb0Isb0JBQVUsTUFBVixDQUFpQjtBQURwQixDOzs7QUFnQnJCLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUErQjtBQUM3QixTQUFPO0FBQ0wsYUFBUyxNQUFNO0FBRFYsR0FBUDtBQUdEOztBQUVELElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLFFBQUQsRUFBWTtBQUNyQyxTQUFPLGtEQUE0QixRQUE1QixDQUFQO0FBQ0QsQ0FGRDs7a0JBSWUseUJBQ2IsZUFEYSxFQUViLGtCQUZhLEVBR2IsY0FIYSxDOzs7Ozs7Ozs7OztBQ2xDZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixNQUExQixFQUFpQztBQUMvQixTQUFPLE9BQU8sUUFBUCxDQUFnQixXQUFoQixPQUFrQyxHQUFsQyxLQUEwQyxPQUFPLGFBQVAsR0FBdUIsaUJBQWlCLE9BQU8sYUFBeEIsQ0FBdkIsR0FBZ0UsS0FBMUcsQ0FBUDtBQUNEOztJQUVLLEk7OztBQVFKLGdCQUFZLEtBQVosRUFBa0I7QUFBQTs7QUFBQSw0R0FDVixLQURVOztBQUdoQixVQUFLLFlBQUwsR0FBb0IsTUFBSyxZQUFMLENBQWtCLElBQWxCLE9BQXBCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFDQSxVQUFLLElBQUwsR0FBWSxNQUFLLElBQUwsQ0FBVSxJQUFWLE9BQVo7QUFDQSxVQUFLLEtBQUwsR0FBYSxNQUFLLEtBQUwsQ0FBVyxJQUFYLE9BQWI7QUFDQSxVQUFLLGNBQUwsR0FBc0IsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQXRCOztBQUVBLFVBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVcsTUFBTSxJQUROO0FBRVgsZUFBUyxNQUFNLElBRko7QUFHWCxnQkFBVSxLQUhDO0FBSVgsWUFBTSxJQUpLO0FBS1gsWUFBTSxNQUFNO0FBTEQsS0FBYjtBQVZnQjtBQWlCakI7Ozs7OENBQ3lCLFMsRUFBVTtBQUNsQyxVQUFJLFVBQVUsSUFBVixJQUFrQixDQUFDLEtBQUssS0FBTCxDQUFXLElBQWxDLEVBQXVDO0FBQ3JDLGFBQUssSUFBTDtBQUNELE9BRkQsTUFFTyxJQUFJLENBQUMsVUFBVSxJQUFYLElBQW1CLEtBQUssS0FBTCxDQUFXLElBQWxDLEVBQXVDO0FBQzVDLGFBQUssS0FBTDtBQUNEO0FBQ0Y7OztpQ0FDWSxDLEVBQUU7QUFDYixXQUFLLFFBQUwsQ0FBYyxFQUFDLFlBQVksSUFBYixFQUFkO0FBQ0EsV0FBSyxVQUFMLEdBQWtCLEVBQUUsY0FBRixDQUFpQixDQUFqQixFQUFvQixLQUF0QztBQUNBLFdBQUssY0FBTCxHQUFzQixDQUF0QjtBQUNBLFFBQUUsY0FBRjtBQUNEOzs7Z0NBQ1csQyxFQUFFO0FBQ1osVUFBSSxRQUFRLEVBQUUsY0FBRixDQUFpQixDQUFqQixFQUFvQixLQUFwQixHQUE0QixLQUFLLFVBQTdDO0FBQ0EsVUFBSSxzQkFBc0IsS0FBSyxHQUFMLENBQVMsUUFBUSxLQUFLLEtBQUwsQ0FBVyxJQUE1QixDQUExQjtBQUNBLFdBQUssY0FBTCxJQUF1QixtQkFBdkI7O0FBRUEsVUFBSSxRQUFRLENBQVosRUFBZTtBQUNiLGdCQUFRLENBQVI7QUFDRDtBQUNELFdBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxLQUFQLEVBQWQ7QUFDQSxRQUFFLGNBQUY7QUFDRDs7OytCQUNVLEMsRUFBRTtBQUFBOztBQUNYLFVBQUksUUFBUSxFQUFFLEtBQUssSUFBTCxDQUFVLGFBQVosRUFBMkIsS0FBM0IsRUFBWjtBQUNBLFVBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUF0QjtBQUNBLFVBQUksV0FBVyxLQUFLLGNBQXBCOztBQUVBLFVBQUksZ0NBQWdDLEtBQUssR0FBTCxDQUFTLElBQVQsS0FBa0IsUUFBTSxJQUE1RDtBQUNBLFVBQUksMkJBQTJCLEVBQUUsTUFBRixLQUFhLEtBQUssSUFBTCxDQUFVLElBQXZCLElBQStCLFlBQVksQ0FBMUU7QUFDQSxVQUFJLHNCQUFzQixpQkFBaUIsRUFBRSxNQUFuQixLQUE4QixZQUFZLENBQXBFOztBQUVBLFdBQUssUUFBTCxDQUFjLEVBQUMsVUFBVSxLQUFYLEVBQWQ7QUFDQSxpQkFBVyxZQUFJO0FBQ2IsZUFBSyxRQUFMLENBQWMsRUFBQyxNQUFNLElBQVAsRUFBZDtBQUNBLFlBQUksaUNBQWlDLHdCQUFqQyxJQUE2RCxtQkFBakUsRUFBcUY7QUFDbkYsaUJBQUssS0FBTDtBQUNEO0FBQ0YsT0FMRCxFQUtHLEVBTEg7QUFNQSxRQUFFLGNBQUY7QUFDRDs7OzJCQUNLO0FBQUE7O0FBQ0osV0FBSyxRQUFMLENBQWMsRUFBQyxXQUFXLElBQVosRUFBa0IsTUFBTSxJQUF4QixFQUFkO0FBQ0EsaUJBQVcsWUFBSTtBQUNiLGVBQUssUUFBTCxDQUFjLEVBQUMsU0FBUyxJQUFWLEVBQWQ7QUFDRCxPQUZELEVBRUcsRUFGSDtBQUdBLFFBQUUsU0FBUyxJQUFYLEVBQWlCLEdBQWpCLENBQXFCLEVBQUMsWUFBWSxRQUFiLEVBQXJCO0FBQ0Q7OzttQ0FDYyxDLEVBQUU7QUFDZixVQUFJLFlBQVksRUFBRSxNQUFGLEtBQWEsRUFBRSxhQUEvQjtBQUNBLFVBQUksU0FBUyxpQkFBaUIsRUFBRSxNQUFuQixDQUFiO0FBQ0EsVUFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLFFBQVosS0FBeUIsYUFBYSxNQUF0QyxDQUFKLEVBQWtEO0FBQ2hELGFBQUssS0FBTDtBQUNEO0FBQ0Y7Ozs0QkFDTTtBQUFBOztBQUNMLFFBQUUsU0FBUyxJQUFYLEVBQWlCLEdBQWpCLENBQXFCLEVBQUMsWUFBWSxFQUFiLEVBQXJCO0FBQ0EsV0FBSyxRQUFMLENBQWMsRUFBQyxTQUFTLEtBQVYsRUFBZDtBQUNBLGlCQUFXLFlBQUk7QUFDYixlQUFLLFFBQUwsQ0FBYyxFQUFDLFdBQVcsS0FBWixFQUFtQixNQUFNLEtBQXpCLEVBQWQ7QUFDQSxlQUFLLEtBQUwsQ0FBVyxPQUFYO0FBQ0QsT0FIRCxFQUdHLEdBSEg7QUFJRDs7OzZCQUNPO0FBQ04sYUFBUTtBQUFBO0FBQUEsVUFBSyxXQUFjLEtBQUssS0FBTCxDQUFXLGtCQUF6QixlQUFvRCxLQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLFdBQXZCLEdBQXFDLEVBQXpGLFdBQStGLEtBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsU0FBckIsR0FBaUMsRUFBaEksV0FBc0ksS0FBSyxLQUFMLENBQVcsUUFBWCxHQUFzQixVQUF0QixHQUFtQyxFQUF6SyxDQUFMO0FBQ0UsbUJBQVMsS0FBSyxjQURoQixFQUNnQyxjQUFjLEtBQUssWUFEbkQsRUFDaUUsYUFBYSxLQUFLLFdBRG5GLEVBQ2dHLFlBQVksS0FBSyxVQURqSCxFQUM2SCxLQUFJLE1BRGpJO0FBRUM7QUFBQTtBQUFBLFlBQUssV0FBVSxnQkFBZixFQUFnQyxLQUFJLGVBQXBDLEVBQW9ELE9BQU8sRUFBQyxNQUFNLEtBQUssS0FBTCxDQUFXLElBQWxCLEVBQTNEO0FBQ0c7QUFBQTtBQUFBLGNBQUssV0FBVSxhQUFmO0FBQ0UsbURBQUssV0FBVSxXQUFmLEdBREY7QUFFRSw0REFBTSxXQUFVLCtDQUFoQjtBQUZGLFdBREg7QUFLRztBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFDRyxpQkFBSyxLQUFMLENBQVcsVUFBWCxHQUF3QjtBQUFBO0FBQUEsZ0JBQUssV0FBVSxhQUFmO0FBQThCLG1CQUFLLEtBQUwsQ0FBVztBQUF6QyxhQUF4QixHQUFxRixJQUR4RjtBQUVFO0FBQUE7QUFBQSxnQkFBSSxXQUFVLFlBQWQ7QUFDRyxtQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFqQixDQUFxQixVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWU7QUFDbkMsb0JBQUksQ0FBQyxJQUFMLEVBQVU7QUFDUix5QkFBTyxJQUFQO0FBQ0Q7QUFDRCx1QkFBTztBQUFBO0FBQUEsb0JBQUksV0FBVSxXQUFkLEVBQTBCLEtBQUssS0FBL0I7QUFBdUM7QUFBdkMsaUJBQVA7QUFDRCxlQUxBLENBREg7QUFPRyxtQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixRQUFsQixHQUE2QixzQ0FBSSxXQUFVLDJCQUFkLEdBQTdCLEdBQStFLElBUGxGO0FBUUcsbUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsUUFBbEIsR0FBNkI7QUFBQTtBQUFBLGtCQUFJLFdBQVUsV0FBZDtBQUM1QjtBQUFBO0FBQUEsb0JBQU0sV0FBVSxzRkFBaEIsRUFBdUcsTUFBSyxVQUE1RztBQUNFO0FBQUE7QUFBQSxzQkFBUSxXQUFVLDZCQUFsQjtBQUNFLHVEQUErQixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE1BQWpELGlDQURGO0FBRUUsNEJBQUssWUFGUDtBQUdFLDREQUFNLFdBQVUsZ0JBQWhCO0FBSEYsbUJBREY7QUFNRyx1QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qix3QkFBekI7QUFOSDtBQUQ0QixlQUE3QixHQVNPLElBakJWO0FBa0JHLG1CQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLFFBQWxCLEdBQTZCO0FBQUE7QUFBQSxrQkFBSSxXQUFVLFdBQWQ7QUFDNUI7QUFBQTtBQUFBLG9CQUFNLFdBQVUsMkZBQWhCO0FBQ0UsMERBQU0sV0FBVSwwQkFBaEIsR0FERjtBQUVHLHVCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLDRCQUF6QjtBQUZIO0FBRDRCLGVBQTdCLEdBS08sSUF2QlY7QUF3QkcsbUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsUUFBbEIsR0FBNkI7QUFBQTtBQUFBLGtCQUFJLFdBQVUsV0FBZDtBQUM1QjtBQUFBO0FBQUEsb0JBQU0sV0FBVSx1RkFBaEI7QUFDRSwwREFBTSxXQUFVLG9CQUFoQixHQURGO0FBRUcsdUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBeUIsc0JBQXpCO0FBRkg7QUFENEIsZUFBN0IsR0FLTyxJQTdCVjtBQThCRyxtQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixRQUFsQixHQUE2QjtBQUFBO0FBQUEsa0JBQUksV0FBVSxXQUFkO0FBQzVCO0FBQUE7QUFBQSxvQkFBTSxXQUFVLHFGQUFoQixFQUFzRyxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQTFIO0FBQ0UsMERBQU0sV0FBVSxtQkFBaEIsR0FERjtBQUVHLHVCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLHNCQUF6QjtBQUZIO0FBRDRCLGVBQTdCLEdBS087QUFuQ1Y7QUFGRjtBQUxIO0FBRkQsT0FBUjtBQWlERDs7OztFQTVJZ0IsZ0JBQU0sUzs7QUFBbkIsSSxDQUNHLFMsR0FBWTtBQUNqQixRQUFNLG9CQUFVLElBQVYsQ0FBZSxVQURKO0FBRWpCLFdBQVMsb0JBQVUsSUFBVixDQUFlLFVBRlA7QUFHakIsU0FBTyxvQkFBVSxPQUFWLENBQWtCLG9CQUFVLE9BQTVCLEVBQXFDLFVBSDNCO0FBSWpCLHNCQUFvQixvQkFBVSxNQUFWLENBQWlCLFVBSnBCO0FBS2pCLGNBQVksb0JBQVU7QUFMTCxDOzs7QUE4SXJCLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUErQjtBQUM3QixTQUFPO0FBQ0wsVUFBTSxNQUFNLElBRFA7QUFFTCxZQUFRLE1BQU07QUFGVCxHQUFQO0FBSUQ7O0FBRUQsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLENBQUMsUUFBRCxFQUFZO0FBQ3JDLFNBQU8saURBQTRCLFFBQTVCLENBQVA7QUFDRCxDQUZEOztrQkFJZSx5QkFDYixlQURhLEVBRWIsa0JBRmEsRUFHYixJQUhhLEM7Ozs7Ozs7Ozs7O0FDdEtmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBRU0sVzs7Ozs7Ozs7Ozs7NkJBSUk7QUFBQTs7QUFDTixVQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixRQUF2QixFQUFnQztBQUM5QixlQUFPLElBQVA7QUFDRDtBQUNELFVBQU0sUUFBUSxDQUNaO0FBQ0UsY0FBTSxNQURSO0FBRUUsY0FBTSwrQkFGUjtBQUdFLGNBQU07QUFIUixPQURZLEVBTVo7QUFDRSxjQUFNLGdCQURSO0FBRUUsY0FBTTtBQUZSLE9BTlksRUFVWjtBQUNFLGNBQU0sVUFEUjtBQUVFLGNBQU07QUFGUixPQVZZLEVBY1o7QUFDRSxjQUFNLFNBRFI7QUFFRSxjQUFNLHNCQUZSO0FBR0UsaUJBQVMsS0FBSyxLQUFMLENBQVc7QUFIdEIsT0FkWSxDQUFkO0FBb0JBLGFBQU87QUFBQTtBQUFBLFVBQVUsb0JBQW9CLEtBQUssS0FBTCxDQUFXLGtCQUF6QyxFQUE2RCxpQkFBZ0IsY0FBN0UsRUFBNEYsT0FBTyxNQUFNLEdBQU4sQ0FBVSxVQUFDLElBQUQsRUFBUTtBQUN4SCxtQkFBTyxVQUFDLGFBQUQsRUFBaUI7QUFBQyxxQkFBTztBQUFBO0FBQUEsa0NBQU0sTUFBSyxVQUFYO0FBQy9CLDZCQUFjLE9BQUssS0FBTCxDQUFXLGtCQUF6Qix3QkFBOEQsT0FBSyxLQUFMLENBQVcsa0JBQXpFLHVCQUQrQjtBQUUvQiwyQkFBUyxtQkFBVztBQUFDLG9DQUFnQixLQUFLLE9BQUwsSUFBZ0IsS0FBSyxPQUFMLHVCQUFoQjtBQUFzQyxtQkFGNUMsWUFFb0QsS0FBSyxJQUZ6RDtBQUc5Qix3REFBTSwwQkFBd0IsS0FBSyxJQUFuQyxHQUg4QjtBQUk5QjtBQUFBO0FBQUE7QUFBTyx5QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5QixLQUFLLElBQTlCO0FBQVA7QUFKOEIsZUFBUDtBQUtqQixhQUxSO0FBTUQsV0FQdUcsQ0FBbkc7QUFRTDtBQUFBO0FBQUEsWUFBRyxXQUFVLDZEQUFiO0FBQ0U7QUFBQTtBQUFBLGNBQVEsV0FBVSxvQkFBbEI7QUFDQywrQ0FBK0IsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUFqRCxpQ0FERDtBQUVDLG9CQUFLLFlBRk47QUFHRSxvREFBTSxXQUFVLGdCQUFoQjtBQUhGO0FBREY7QUFSSyxPQUFQO0FBZ0JEOzs7O0VBNUN1QixnQkFBTSxTOztBQUExQixXLENBQ0csUyxHQUFZO0FBQ2pCLHNCQUFvQixvQkFBVSxNQUFWLENBQWlCO0FBRHBCLEM7OztBQThDckIsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQStCO0FBQzdCLFNBQU87QUFDTCxVQUFNLE1BQU0sSUFEUDtBQUVMLFlBQVEsTUFBTTtBQUZULEdBQVA7QUFJRDs7QUFFRCxJQUFNLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBQyxRQUFELEVBQVk7QUFDckMsU0FBTyxpREFBNEIsUUFBNUIsQ0FBUDtBQUNELENBRkQ7O2tCQUllLHlCQUNiLGVBRGEsRUFFYixrQkFGYSxFQUdiLFdBSGEsQzs7Ozs7Ozs7Ozs7QUNuRWY7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTSxXQUFXO0FBQ2YsVUFBUTtBQURPLENBQWpCOztJQUlxQixNOzs7QUFDbkIsb0JBQWM7QUFBQTs7QUFBQTs7QUFFWixVQUFLLEtBQUwsR0FBYSxFQUFFLFFBQVEsS0FBVixFQUFiO0FBQ0EsVUFBSyxrQkFBTCxHQUEwQixNQUFLLGtCQUFMLENBQXdCLElBQXhCLE9BQTFCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQUNBLFVBQUssdUJBQUwsR0FBK0IsTUFBSyx1QkFBTCxDQUE2QixJQUE3QixPQUEvQjtBQUNBLFVBQUssYUFBTCxHQUFxQixNQUFLLGFBQUwsQ0FBbUIsSUFBbkIsT0FBckI7QUFDQSxVQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsVUFBSyxJQUFMLEdBQVksSUFBWjtBQVJZO0FBU2I7Ozs7d0NBRW1CO0FBQ2xCLFVBQUksS0FBSyxLQUFMLENBQVcsVUFBZixFQUEyQjtBQUN6QixpQkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxLQUFLLGFBQTFDO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLEtBQUwsQ0FBVyxtQkFBZixFQUFvQztBQUNsQyxpQkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxLQUFLLHVCQUExQztBQUNBLGlCQUFTLGdCQUFULENBQTBCLFlBQTFCLEVBQXdDLEtBQUssdUJBQTdDO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLGlCQUFTLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLEtBQUssdUJBQXpDO0FBQ0Q7QUFDRjs7O3dDQUVtQixTLEVBQVcsUyxFQUFXO0FBQ3hDLFVBQUksVUFBVSxNQUFkLEVBQXFCO0FBQ25CLGFBQUssWUFBTCxDQUFrQixTQUFsQjtBQUNEO0FBQ0Y7OzsyQ0FFc0I7QUFDckIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxVQUFmLEVBQTJCO0FBQ3pCLGlCQUFTLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLEtBQUssYUFBN0M7QUFDRDs7QUFFRCxVQUFJLEtBQUssS0FBTCxDQUFXLG1CQUFmLEVBQW9DO0FBQ2xDLGlCQUFTLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLEtBQUssdUJBQTdDO0FBQ0EsaUJBQVMsbUJBQVQsQ0FBNkIsWUFBN0IsRUFBMkMsS0FBSyx1QkFBaEQ7QUFDRDs7QUFFRCxVQUFJLEtBQUssS0FBTCxDQUFXLGFBQWYsRUFBOEI7QUFDNUIsaUJBQVMsbUJBQVQsQ0FBNkIsUUFBN0IsRUFBdUMsS0FBSyx1QkFBNUM7QUFDRDs7QUFFRCxXQUFLLFdBQUwsQ0FBaUIsSUFBakI7QUFDRDs7O3VDQUVrQixDLEVBQUc7QUFDcEIsUUFBRSxjQUFGO0FBQ0EsUUFBRSxlQUFGO0FBQ0EsVUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFmLEVBQXVCO0FBQ3JCO0FBQ0Q7QUFDRCxXQUFLLFVBQUw7QUFDRDs7O2lDQUU4QjtBQUFBLFVBQXBCLEtBQW9CLHVFQUFaLEtBQUssS0FBTzs7QUFDN0IsV0FBSyxRQUFMLENBQWMsRUFBRSxRQUFRLElBQVYsRUFBZDtBQUNBLFdBQUssWUFBTCxDQUFrQixLQUFsQixFQUF5QixJQUF6QjtBQUNEOzs7a0NBRWdDO0FBQUE7O0FBQUEsVUFBckIsV0FBcUIsdUVBQVAsS0FBTzs7QUFDL0IsVUFBTSxtQkFBbUIsU0FBbkIsZ0JBQW1CLEdBQU07QUFDN0IsWUFBSSxPQUFLLElBQVQsRUFBZTtBQUNiLGdEQUF1QixPQUFLLElBQTVCO0FBQ0EsbUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsT0FBSyxJQUEvQjtBQUNEO0FBQ0QsZUFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGVBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxZQUFJLGdCQUFnQixJQUFwQixFQUEwQjtBQUN4QixpQkFBSyxRQUFMLENBQWMsRUFBRSxRQUFRLEtBQVYsRUFBZDtBQUNEO0FBQ0YsT0FWRDs7QUFZQSxVQUFJLEtBQUssS0FBTCxDQUFXLE1BQWYsRUFBdUI7QUFDckIsWUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFmLEVBQTRCO0FBQzFCLGVBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsS0FBSyxJQUE1QixFQUFrQyxnQkFBbEM7QUFDRCxTQUZELE1BRU87QUFDTDtBQUNEOztBQUVELGFBQUssS0FBTCxDQUFXLE9BQVg7QUFDRDtBQUNGOzs7NENBRXVCLEMsRUFBRztBQUN6QixVQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsTUFBaEIsRUFBd0I7QUFDdEI7QUFDRDs7QUFFRCxVQUFNLE9BQU8sMkJBQVksS0FBSyxNQUFqQixDQUFiO0FBQ0EsVUFBSSxLQUFLLFFBQUwsQ0FBYyxFQUFFLE1BQWhCLEtBQTRCLEVBQUUsTUFBRixJQUFZLEVBQUUsTUFBRixLQUFhLENBQXpELEVBQTZEO0FBQzNEO0FBQ0Q7O0FBRUQsUUFBRSxlQUFGO0FBQ0EsV0FBSyxXQUFMO0FBQ0Q7OztrQ0FFYSxDLEVBQUc7QUFDZixVQUFJLEVBQUUsT0FBRixLQUFjLFNBQVMsTUFBdkIsSUFBaUMsS0FBSyxLQUFMLENBQVcsTUFBaEQsRUFBd0Q7QUFDdEQsYUFBSyxXQUFMO0FBQ0Q7QUFDRjs7O2lDQUVZLEssRUFBTyxTLEVBQVc7QUFDN0IsVUFBSSxDQUFDLEtBQUssSUFBVixFQUFnQjtBQUNkLGFBQUssSUFBTCxHQUFZLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFaO0FBQ0EsaUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsS0FBSyxJQUEvQjtBQUNEOztBQUVELFVBQUksV0FBVyxNQUFNLFFBQXJCO0FBQ0E7QUFDQSxVQUFJLE9BQU8sTUFBTSxRQUFOLENBQWUsSUFBdEIsS0FBK0IsVUFBbkMsRUFBK0M7QUFDN0MsbUJBQVcsZ0JBQU0sWUFBTixDQUFtQixNQUFNLFFBQXpCLEVBQW1DO0FBQzVDLHVCQUFhLEtBQUs7QUFEMEIsU0FBbkMsQ0FBWDtBQUdEOztBQUVELFdBQUssTUFBTCxHQUFjLG1EQUNaLElBRFksRUFFWixRQUZZLEVBR1osS0FBSyxJQUhPLEVBSVosS0FBSyxLQUFMLENBQVcsUUFKQyxDQUFkOztBQU9BLFVBQUksU0FBSixFQUFlO0FBQ2IsYUFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFLLElBQXZCO0FBQ0Q7QUFDRjs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLGVBQU8sZ0JBQU0sWUFBTixDQUFtQixLQUFLLEtBQUwsQ0FBVyxhQUE5QixFQUE2QztBQUNsRCxtQkFBUyxLQUFLO0FBRG9DLFNBQTdDLENBQVA7QUFHRDtBQUNELGFBQU8sSUFBUDtBQUNEOzs7O0VBN0lpQyxnQkFBTSxTOztrQkFBckIsTTs7O0FBZ0pyQixPQUFPLFNBQVAsR0FBbUI7QUFDakIsWUFBVSxvQkFBVSxPQUFWLENBQWtCLFVBRFg7QUFFakIsaUJBQWUsb0JBQVUsT0FGUjtBQUdqQixjQUFZLG9CQUFVLElBSEw7QUFJakIsdUJBQXFCLG9CQUFVLElBSmQ7QUFLakIsaUJBQWUsb0JBQVUsSUFMUjtBQU1qQixVQUFRLG9CQUFVLElBTkQ7QUFPakIsV0FBUyxvQkFBVSxJQVBGO0FBUWpCLGVBQWEsb0JBQVUsSUFSTjtBQVNqQixZQUFVLG9CQUFVO0FBVEgsQ0FBbkI7O0FBWUEsT0FBTyxZQUFQLEdBQXNCO0FBQ3BCLFVBQVEsa0JBQU0sQ0FBRSxDQURJO0FBRXBCLFdBQVMsbUJBQU0sQ0FBRSxDQUZHO0FBR3BCLFlBQVUsb0JBQU0sQ0FBRTtBQUhFLENBQXRCOzs7Ozs7Ozs7OztBQ3BLQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixjOzs7Ozs7Ozs7Ozs2QkFDWDtBQUNOLGFBQVE7QUFBQTtBQUFBLFVBQUssSUFBRyxNQUFSO0FBQ04sb0VBRE07QUFFTjtBQUZNLE9BQVI7QUFJRDs7OztFQU55QyxnQkFBTSxTOztrQkFBN0IsYzs7Ozs7Ozs7a0JDR0csTTs7QUFQeEI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRWUsU0FBUyxNQUFULENBQWdCLE9BQWhCLEVBQXlCLEdBQXpCLEVBQThCLFFBQTlCLEVBQXVDO0FBQ3BELE1BQUksUUFBUSx3QkFBWSxPQUFaLEVBQXFCLHNFQUFyQixDQUFaOztBQUVBLHdCQUFPO0FBQUE7QUFBQSxNQUFVLE9BQU8sS0FBakI7QUFDTCxrQ0FBQyxHQUFEO0FBREssR0FBUCxFQUVhLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUZiOztBQUlBLE1BQUksV0FBVztBQUNiLFlBRGEsb0JBQ0osTUFESSxFQUNHO0FBQ2QsVUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDaEMsZUFBTyxPQUFPLE1BQU0sUUFBYixFQUF1QixNQUFNLFFBQTdCLENBQVA7QUFDRDs7QUFFRCxhQUFPLE1BQU0sUUFBTixDQUFlLE1BQWYsQ0FBUDtBQUNELEtBUFk7QUFRYixhQVJhLHVCQVFLO0FBQ2hCLGFBQU8sTUFBTSxTQUFOLHdCQUFQO0FBQ0QsS0FWWTtBQVdiLFlBWGEsc0JBV0k7QUFDZixhQUFPLE1BQU0sUUFBTix3QkFBUDtBQUNELEtBYlk7QUFjYixrQkFkYSw0QkFjVTtBQUNyQixhQUFPLE1BQU0sY0FBTix3QkFBUDtBQUNEO0FBaEJZLEdBQWY7O0FBbUJGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsY0FBWSxTQUFTLFFBQVQsQ0FBWjtBQUNEOzs7OztBQzlDRDs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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UUFBUSxTQUF4Qjs7QUFFQSxVQUFJLGFBQWEsV0FBakIsRUFBOEI7QUFDNUIsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUssUUFBTCxHQUFnQixDQUFoQjtBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssT0FBTCxDQUFhLFNBQWIsRUFBd0IsUUFBUSxJQUFoQztBQUNEO0FBQ0Y7OzsyQ0FFc0I7QUFDckIsVUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsYUFBSyxTQUFMLENBQWUsU0FBZixHQUEyQixZQUFJLENBQUUsQ0FBakM7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLFlBQUksQ0FBRSxDQUEvQjtBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWYsR0FBeUIsWUFBSSxDQUFFLENBQS9CO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsZUFBSyxTQUFMLENBQWUsS0FBZjtBQUNEO0FBQ0Y7QUFDRjs7Ozs7O2tCQTFQa0IsZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCB7XG4gIHNldExvY2FsZTogZnVuY3Rpb24obG9jYWxlKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnU0VUX0xPQ0FMRScsXG4gICAgICAncGF5bG9hZCc6IGxvY2FsZVxuICAgIH1cbiAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gIGRpc3BsYXlOb3RpZmljYXRpb246IGZ1bmN0aW9uKG1lc3NhZ2UsIHNldmVyaXR5KXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnQUREX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3NldmVyaXR5Jzogc2V2ZXJpdHksXG4gICAgICAgICdtZXNzYWdlJzogbWVzc2FnZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaGlkZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obm90aWZpY2F0aW9uKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnSElERV9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiBub3RpZmljYXRpb25cbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBsb2dvdXQoKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnTE9HT1VUJ1xuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgRGlhbG9nIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2RpYWxvZy5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgRm9yZ290UGFzc3dvcmREaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgbGV0IGNvbnRlbnQgPSAoPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLmluc3RydWN0aW9ucycpfVxuICAgICAgICA8YnIvPlxuICAgICAgICA8YnIvPlxuICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLXJvd1wiPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3Jnb3RwYXNzd29yZC1lbWFpbFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5lbWFpbCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiLz5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJmb3JtLWhpZGRlblwiIGlkPVwiZm9ybS1yZXNldC1wYXNzd29yZC1zdWJtaXRcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2Pik7XG4gICAgbGV0IGZvb3RlciA9IChjbG9zZURpYWxvZyk9PntcbiAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcm0tcmVzZXQtcGFzc3dvcmQtc3VibWl0XCIgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1sYXJnZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5zZW5kQnV0dG9uTGFiZWwnKX1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1sYXJnZSBidXR0b24td2FyblwiIG9uQ2xpY2s9e2Nsb3NlRGlhbG9nfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuY2FuY2VsQnV0dG9uTGFiZWwnKX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9kaXY+XG4gICAgfVxuICAgIHJldHVybiA8RGlhbG9nIHRpdGxlPXt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy50aXRsZScpfVxuICAgICAgY29udGVudD17Y29udGVudH0gZm9vdGVyPXtmb290ZXJ9IGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259PlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICA8L0RpYWxvZz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGb3Jnb3RQYXNzd29yZERpYWxvZyk7IiwiLy9UT0RPIHVubGlrZSBsYW5ndWFnZSBjaGFuZ2UsIGxvZ2luIGluIG5lZWRzIHRvIGVzY2FwZSB0aGUgY3VycmVudFxuLy9wYWdlIGhlbmNlIGl0IGRvZXNuJ3QgcmVhbGx5IG5lZWQgYSByZWR1Y2VyLCBob3dldmVyIGl0IGNvdWxkIGJlIGltcGxtZW50ZWRcbi8vaWYgZXZlciB3ZSB3aXNoIHRvIHR1cm4gaXQgaW50byBhIFNQQVxuXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExpbmsgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBMb2dpbkJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMubG9naW4gPSB0aGlzLmxvZ2luLmJpbmQodGhpcyk7XG4gIH1cbiAgbG9naW4oKXtcbiAgICAvL1RPRE8gcGxlYXNlIGxldCdzIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMgcmF0aGVyIHRoYW4gdGhlIGVtdWxhdGVkIHdheVxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCQoXCIjbG9naW5cIikuYXR0cihcImhyZWZcIikpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPExpbmsgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1sb2dpbmB9IG9uQ2xpY2s9e3RoaXMubG9naW59PlxuICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmxvZ2luLmJ1dHRvbkxhYmVsJyl9PC9zcGFuPlxuICAgIDwvTGluaz4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKExvZ2luQnV0dG9uKTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmNsYXNzIE5vdGlmaWNhdGlvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5ub3RpZmljYXRpb25zLm1hcCgobm90aWZpY2F0aW9uKT0+e1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e25vdGlmaWNhdGlvbi5pZH0gY2xhc3NOYW1lPXtcIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtIG5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLVwiICsgbm90aWZpY2F0aW9uLnNldmVyaXR5fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57bm90aWZpY2F0aW9uLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLWNsb3NlXCIgb25DbGljaz17dGhpcy5wcm9wcy5oaWRlTm90aWZpY2F0aW9uLmJpbmQodGhpcywgbm90aWZpY2F0aW9uKX0+PC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuICBcbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbm90aWZpY2F0aW9uczogc3RhdGUubm90aWZpY2F0aW9uc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTm90aWZpY2F0aW9ucyk7IiwiaW1wb3J0IEZyb250cGFnZU5hdmJhciBmcm9tICcuL25hdmJhci5qc3gnO1xuaW1wb3J0IEZyb250cGFnZUZlZWQgZnJvbSAnLi9mZWVkLmpzeCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIEZyb250cGFnZUJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIHRoaXMuYWRkQ2Fyb3VzZWxzKCk7XG4gIH1cbiAgYWRkQ2Fyb3VzZWxzKCl7XG4gICAgLy9UT0RPIHRoaXMgcGllY2Ugb2YgY29kZSB1cyBkZXByZWNhdGVkIGFuZCB1c2VzIGpxdWVyeSwgbm90aWNlIHRoYXQgdGhpc1xuICAgIC8vd2lsbCBiZSB2ZXJ5IGJ1Z2d5IGlmIGV2ZXIgdGhlIGZyb250cGFnZSBib2R5IHVwZGF0ZXMsIGVnIG1ha2luZyB0aGUgaTE4IHJlZHVjZXIgbW9yZSBlZmZpY2llbnRcbiAgICAvL29yIGFkZGluZyBhbm90aGVyIHJlZHVjZXIgdGhhdCBjYXVzZXMgY2hhbmdlcyB0byB0aGUgYm9keSBwcm9wZXJ0aWVzXG4gICAgLy93ZSBuZWVkIHRvIHJlcGFjZSB0aGlzIGlmIGV2ZXIgZ29pbmcgdG8gbWFrZSBib2R5IHRvIHVwZGF0ZVxuICAgICAgXG4gICAgJCgnPGxpbmsvPicsIHtcbiAgICAgIHJlbDogJ3N0eWxlc2hlZXQnLFxuICAgICAgdHlwZTogJ3RleHQvY3NzJyxcbiAgICAgIGhyZWY6ICcvL2Nkbi5tdWlra3V2ZXJra28uZmkvbGlicy9zbGljay8xLjYuMC9zbGljay5jc3MnXG4gICAgfSkuYXBwZW5kVG8oJ2hlYWQnKTtcbiAgICAgIFxuICAgICQuZ2V0U2NyaXB0KFwiLy9jZG4ubXVpa2t1dmVya2tvLmZpL2xpYnMvc2xpY2svMS42LjAvc2xpY2subWluLmpzXCIsIGZ1bmN0aW9uKCBkYXRhLCB0ZXh0U3RhdHVzLCBqcXhociApIHtcbiAgICAgICQoXCIuY2Fyb3VzZWwtaXRlbVwiKS5lYWNoKChpbmRleCwgZWxlbWVudCk9PntcbiAgICAgICAgJChlbGVtZW50KS5zaG93KCk7XG4gICAgICB9KTtcblxuICAgICAgJChcIi5jYXJvdXNlbFwiKS5lYWNoKChpbmRleCwgZWxlbWVudCk9PntcbiAgICAgICAgJChlbGVtZW50KS5zbGljayh7XG4gICAgICAgICAgYXBwZW5kRG90czogJChlbGVtZW50KS5zaWJsaW5ncyhcIi5jYXJvdXNlbC1jb250cm9sc1wiKSxcbiAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgZG90c0NsYXNzOiBcImNhcm91c2VsLWRvdHNcIixcbiAgICAgICAgICBmYWRlOiB0cnVlLFxuICAgICAgICAgIHNwZWVkOiA3NTAsXG4gICAgICAgICAgd2FpdEZvckFuaW1hdGU6IGZhbHNlLFxuICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OSxcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBmYWRlOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLWZ1bGxcIj5cbjxGcm9udHBhZ2VOYXZiYXIgLz5cbiAgICAgICAgICAgIFxuPGhlYWRlciBjbGFzc05hbWU9XCJmcm9udHBhZ2UgaGVyb1wiPlxuICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8td3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZSBidWJibGUtcmVzcG9uc2l2ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS10aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc3R1ZGVudEFwcGxpY2F0aW9uQnViYmxlLnRpdGxlJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1jb250ZW50XCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUuZGVzY3JpcHRpb24nKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLXNvZnQgYnV0dG9uLWR5bmFtaWMtaGVpZ2h0IGJ1dHRvbi13YXJuIGJ1dHRvbi1mb2N1c1wiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUubGluaycpfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItbXVpa2t1LWxvZ29cIj5cbiAgICAgICAgPGltZyBjbGFzc05hbWU9XCJmcm9udHBhZ2UgbG9nbyBmcm9udHBhZ2UtbG9nby1tdWlra3UtdmVya2tvXCIgc3JjPVwiL2dmeC9vZi1zaXRlLWxvZ28ucG5nXCI+PC9pbWc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC11cHBlcmNhc2VcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LW11aWtrdS1hdXRob3JcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnNpdGUuYXV0aG9yJyl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1tdWlra3VcIj5NVUlLS1U8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXZlcmtrb1wiPlZFUktLTzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LXVwcGVyY2FzZSBmcm9udHBhZ2UtdGV4dC1tdWlra3UtZGVzY3JpcHRpb25cIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnNpdGUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUgYnViYmxlLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLm9wZW5NYXRlcmlhbHNCdWJibGUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtY29udGVudFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1idXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1zb2Z0IGJ1dHRvbi1keW5hbWljLWhlaWdodCBidXR0b24td2FyblwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS5saW5rJyl9PC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvaGVhZGVyPlxuXG48ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBzZXBhcmF0b3JcIj48L2Rpdj5cblxuPGRpdiBjbGFzc05hbWU9XCJzY3JlZW4tY29udGFpbmVyXCI+XG4gIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuLWNvbnRhaW5lci13cmFwcGVyXCI+XG4gICAgICAgICAgXG4gICAgPHNlY3Rpb24gaWQ9XCJzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uXCI+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc2VjdGlvblRpdGxlLnN0dWR5aW5nJyl9PC9oMj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIG9yZGVyZWQtY29udGFpbmVyLXJvdyBvcmRlcmVkLWNvbnRhaW5lci1yZXNwb25zaXZlIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1zdHVkeWluZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLXN0dWR5aW5nXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfbmV0dGlsdWtpby5wbmdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlsdWtpby50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aWx1a2lvLmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9uZXR0aWx1a2lvX2VzaXR0ZWx5XCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tc3R1ZHlpbmctcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtc2Nob29sXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfbmV0dGlwZXJ1c2tvdWx1LnBuZ1wiXG4gICAgICAgICAgICAgIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aXBlcnVza291bHUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlwZXJ1c2tvdWx1LmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9lc2l0dGVseV9uZXR0aXBrXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tc2Nob29sLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLWNvdXJzZXNcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9haW5lb3Bpc2tlbHUucG5nXCJcbiAgICAgICAgICAgICAgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLmFpbmVvcGlza2VsdS50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5haW5lb3Bpc2tlbHUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL2VzaXR0ZWx5X25ldHRpcGtcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1jb3Vyc2VzLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJ2aWRlb3NcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL09ENU9qNTB2eWgwP3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL0NKY3BXWkQwVlQ4P3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9FYkpuV0l5T0pOZz9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvaU9LVW9BQVE3VWs/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWNvbnRyb2xzXCI+PC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJuZXdzXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb25cIj5cblxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnNlY3Rpb25UaXRsZS5uZXdzJyl9PC9oMj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3NcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBvcmRlcmVkLWNvbnRhaW5lci1yb3cgb3JkZXJlZC1jb250YWluZXItcmVzcG9uc2l2ZSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3cy1zdWJjb250YWluZXJcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5ldmVudHMnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtZXZlbnRzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNCwgb3JkZXI6IFwiQVNDRU5ESU5HXCJ9fSBmZWVkUmVhZFRhcmdldD1cIm9vZXZlbnRzXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUubmV3cycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1uZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNX19IGZlZWRSZWFkVGFyZ2V0PVwib29uZXdzXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3Mtc3ViY29udGFpbmVyXCI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2UtY2FyZC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTEuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTEnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTIuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMicpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMy5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMycpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhNC5qcGdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2U0Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmE1LmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlNScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtY29udHJvbHNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1jYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUuYmxvZ3MnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtYmxvZ3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA2fX1cbiAgICAgICAgICAgICAgICAgICAgIGZlZWRSZWFkVGFyZ2V0PVwiZW9wcGltaXNrZXNrdXMsb3BlbixlYmFyb21ldHJpLG1hdHNrdWxhLG9wcGltaW5lbixwb2xrdWphLHJlaXNzdXZpaGtvLGphbGtpYVwiPjwvRnJvbnRwYWdlRmVlZD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cblxuICAgIDxzZWN0aW9uIGlkPVwib3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb24gZnJvbnRwYWdlLWNhcmQtY29udGFpbmVyXCI+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtb3RhdmFuLW9waXN0b1wiPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLWluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLWl0ZW0tb3RhdmFuLW9waXN0by1zb2NpYWwtbWVkaWFcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItb3RhdmFuLW9waXN0by1zb2NpYWwtbWVkaWFcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtdXBwZXJjYXNlIGZyb250cGFnZS10ZXh0LW90YXZhbi1vcGlzdG8taW5mby10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24uc29tZS50aXRsZScpfVxuICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1mYWNlYm9va1wiIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vb3RhdmFub3Bpc3RvXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS10d2l0dGVyXCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vT3RhdmFuT3Bpc3RvXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1pbnN0YWdyYW1cIiBocmVmPVwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9vdGF2YW5vcGlzdG8vXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1waW50ZXJlc3RcIiBocmVmPVwiaHR0cHM6Ly9maS5waW50ZXJlc3QuY29tL290YXZhbm9waXN0by9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWxpbmtlZGluXCIgaHJlZj1cImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9jb21wYW55LzEwNjAyOFwiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC1tdWx0aXBhcmFncmFwaCBmcm9udHBhZ2UtdGV4dC1vdGF2YW4tb3Bpc3RvLWluZm8tZGVzY3JpcHRpb25cIlxuICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24uZGVzY3JpcHRpb24nKX19PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3RhdmFub3Bpc3RvLmZpXCIgdGFyZ2V0PVwidG9wXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLXdlYnNpdGVcIj5cbiAgICAgICAgICAgICAgICB3d3cub3RhdmFub3Bpc3RvLmZpXG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3RhdmFub3Bpc3RvLmZpL3V1dGlza2lyamVcIiB0YXJnZXQ9XCJ0b3BcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tbmV3c2xldHRlclwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24ubmV3c2xldHRlci5saW5rJyl9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1pdGVtLW90YXZhbi1vcGlzdG8tbG9nb1wiPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIvZ2Z4L29mLW9yZ2FuaXphdGlvbi1sb2dvLmpwZ1wiIGFsdD1cImxvZ29cIiB0aXRsZT1cImxvZ29cIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48Zm9vdGVyIGNsYXNzTmFtZT1cImZyb250cGFnZSBmb290ZXJcIiBpZD1cImNvbnRhY3RcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItaXRlbSBmcm9udHBhZ2UtZm9vdGVyLWl0ZW0tY29udGFjdFwiPlxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXNcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmNvbnRhY3QudGl0bGUnKX08L2gyPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11cy1pbmZvcm1hdGlvblwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWljb24gaWNvbi1sb2NhdGlvblwiPjwvc3Bhbj5cbiAgICAgICAgPGI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5zdHJlZXRBZGRyZXNzLmxhYmVsJyl9PC9iPlxuICAgICAgICA8c3Bhbj5PdGF2YW50aWUgMiBCLCA1MDY3MCBPdGF2YTwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXMtaW5mb3JtYXRpb25cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pY29uIGljb24tcGhvbmVcIj48L3NwYW4+XG4gICAgICAgIDxiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIucGhvbmVOdW1iZXIubGFiZWwnKX08L2I+XG4gICAgICAgIDxzcGFuPjAxNSAxOTTCoDM1NTI8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzLWluZm9ybWF0aW9uXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaWNvbiBpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxuICAgICAgICA8Yj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmVtYWlsQWRkcmVzcy5sYWJlbCcpfTwvYj5cbiAgICAgICAgPHNwYW4+aW5mb0BvdGF2YW5vcGlzdG8uZmk8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItaXRlbSBmcm9udHBhZ2UtZm9vdGVyLWl0ZW0tbG9nb3NcIj5cbiAgICAgIDxpbWcgc3JjPVwiL2dmeC9hbGt1X3V1ZGVsbGUuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiBjbGFzc05hbWU9XCJsb2dvXCIgLz5cbiAgICAgIDxpbWcgc3JjPVwiL2dmeC9mb290ZXJfbG9nby5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIGNsYXNzTmFtZT1cImxvZ29cIiAvPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZm9vdGVyPlxuICAgICAgICA8L2Rpdj4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZyb250cGFnZUJvZHkpOyIsImltcG9ydCBGZWVkIGZyb20gJy4uL2dlbmVyYWwvZmVlZC5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyb250cGFnZUZlZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGZlZWRSZWFkVGFyZ2V0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcXVlcnlPcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbnRyaWVzOiBbXVxuICAgIH1cbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIG1BcGkoKS5mZWVkLmZlZWRzLnJlYWQodGhpcy5wcm9wcy5mZWVkUmVhZFRhcmdldCwgdGhpcy5wcm9wcy5xdWVyeU9wdGlvbnMpLmNhbGxiYWNrKChlcnIsIGVudHJpZXMpPT57XG4gICAgICBpZiAoIWVycil7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2VudHJpZXN9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPEZlZWQgZW50cmllcz17dGhpcy5zdGF0ZS5lbnRyaWVzfT48L0ZlZWQ+XG4gIH1cbn0iLCJpbXBvcnQgTmF2YmFyIGZyb20gJy4uL2dlbmVyYWwvbmF2YmFyLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9nZW5lcmFsL2xpbmsuanN4JztcbmltcG9ydCBMb2dpbkJ1dHRvbiBmcm9tICcuLi9iYXNlL2xvZ2luLWJ1dHRvbi5qc3gnO1xuaW1wb3J0IEZvcmdvdFBhc3N3b3JkRGlhbG9nIGZyb20gJy4uL2Jhc2UvZm9yZ290LXBhc3N3b3JkLWRpYWxvZy5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBGcm9udHBhZ2VOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8TmF2YmFyIGNsYXNzTmFtZUV4dGVuc2lvbj1cImZyb250cGFnZVwiIG5hdmJhckl0ZW1zPXtbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJzdHVkeWluZ1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5zdHVkeWluZycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcIm5ld3NcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjbmV3c1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5uZXdzJyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwib3RhdmFuLW9waXN0b1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3RhdmFuT3Bpc3RvJyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwiY29udGFjdFwiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNjb250YWN0XCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLmNvbnRhY3QnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJvcGVuLW1hdGVyaWFsc1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstaGlnaGxpZ2h0IGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3Blbk1hdGVyaWFscycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfVxuICAgIF19IGRlZmF1bHRPcHRpb25zPXtbXG4gICAgICAoPExvZ2luQnV0dG9uIGtleT1cIjBcIiBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIi8+KSxcbiAgICAgICg8Rm9yZ290UGFzc3dvcmREaWFsb2cga2V5PVwiMVwiIGNsYXNzTmFtZUV4dGVuc2lvbj1cImZyb250cGFnZVwiPjxMaW5rIGNsYXNzTmFtZT1cImZyb250cGFnZSBsYWJlbCBsYWJlbC1keW5hbWljLXdvcmQtYnJlYWsgbGFiZWwtY2xpY2thYmxlIGZyb250cGFnZS1sYWJlbC1mb3Jnb3QtcGFzc3dvcmQgZnJvbnRwYWdlLWludGVyYWN0LWZvcmdvdC1wYXNzd29yZFwiPlxuICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdExpbmsnKX08L3NwYW4+XG4gICAgICAgPC9MaW5rPjwvRm9yZ290UGFzc3dvcmREaWFsb2c+KVxuICAgIF19IG1lbnVJdGVtcz17W1xuICAgICAgICg8TGluayBocmVmPVwiI3N0dWR5aW5nXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLnN0dWR5aW5nJyl9PC9zcGFuPjwvTGluaz4pLFxuICAgICAgICg8TGluayBocmVmPVwiI25ld3NcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsubmV3cycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3RhdmFuT3Bpc3RvJyl9PC9zcGFuPjwvTGluaz4pLFxuICAgICAgICg8TGluayBocmVmPVwiI2NvbnRhY3RcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsuY29udGFjdCcpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstaGlnaGxpZ2h0IGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3Blbk1hdGVyaWFscycpfTwvc3Bhbj48L0xpbms+KVxuICAgIF19Lz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGcm9udHBhZ2VOYXZiYXIpO1xuIiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBQb3J0YWwgZnJvbSAnLi9wb3J0YWwuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjb250ZW50OiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGZvb3RlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uT3ZlcmxheUNsaWNrID0gdGhpcy5vbk92ZXJsYXlDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25PcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmJlZm9yZUNsb3NlID0gdGhpcy5iZWZvcmVDbG9zZS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBjbG9zZSgpe1xuICAgIHRoaXMucmVmcy5wb3J0YWwuY2xvc2VQb3J0YWwoKTtcbiAgfVxuICBvbk92ZXJsYXlDbGljayhlKXtcbiAgICBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCl7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIG9uT3Blbigpe1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9LCAxMCk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxQb3J0YWwgcmVmPVwicG9ydGFsXCIgb3BlbkJ5Q2xpY2tPbj17dGhpcy5wcm9wcy5jaGlsZHJlbn0gb25PcGVuPXt0aGlzLm9uT3Blbn0gYmVmb3JlQ2xvc2U9e3RoaXMuYmVmb3JlQ2xvc2V9IGNsb3NlT25Fc2M+XG48ZGl2IGNsYXNzTmFtZT17YGRpYWxvZyAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kaWFsb2cgJHt0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGVcIiA6IFwiXCJ9YH0gb25DbGljaz17dGhpcy5vbk92ZXJsYXlDbGlja30+XG4gIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLXdpbmRvd1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLXRpdGxlXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpYWxvZy1jbG9zZSBpY29uIGljb24tY2xvc2VcIiBvbkNsaWNrPXt0aGlzLmNsb3NlfT48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgIHt0aGlzLnByb3BzLmNvbnRlbnR9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWZvb3RlclwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5mb290ZXIodGhpcy5jbG9zZSl9XG4gICAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiAgICAgICAgPC9Qb3J0YWw+KTtcbiAgfVxufSIsImltcG9ydCBQb3J0YWwgZnJvbSAnLi9wb3J0YWwuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtmaW5kRE9NTm9kZX0gZnJvbSAncmVhY3QtZG9tJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG9wOiBudWxsLFxuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIGFycm93TGVmdDogbnVsbCxcbiAgICAgIGFycm93UmlnaHQ6IG51bGwsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbk9wZW4oRE9NTm9kZSl7XG4gICAgbGV0IGFjdGl2YXRvciA9IHRoaXMucmVmcy5hY3RpdmF0b3I7XG4gICAgaWYgKCEoYWN0aXZhdG9yIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKXtcbiAgICAgIGFjdGl2YXRvciA9IGZpbmRET01Ob2RlKGFjdGl2YXRvcik7XG4gICAgfVxuICAgIFxuICAgIGxldCAkdGFyZ2V0ID0gJChhY3RpdmF0b3IpO1xuICAgIGxldCAkYXJyb3cgPSAkKHRoaXMucmVmcy5hcnJvdyk7XG4gICAgbGV0ICRkcm9wZG93biA9ICQodGhpcy5yZWZzLmRyb3Bkb3duKTtcbiAgICAgIFxuICAgIGxldCBwb3NpdGlvbiA9ICR0YXJnZXQub2Zmc2V0KCk7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgbGV0IG1vcmVTcGFjZUluVGhlTGVmdFNpZGUgPSAod2luZG93V2lkdGggLSBwb3NpdGlvbi5sZWZ0KSA8IHBvc2l0aW9uLmxlZnQ7XG4gICAgXG4gICAgbGV0IGxlZnQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0IC0gJGRyb3Bkb3duLm91dGVyV2lkdGgoKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdDtcbiAgICB9XG4gICAgbGV0IHRvcCA9IHBvc2l0aW9uLnRvcCArICR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDU7XG4gICAgXG4gICAgbGV0IGFycm93TGVmdCA9IG51bGw7XG4gICAgbGV0IGFycm93UmlnaHQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGFycm93UmlnaHQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3dMZWZ0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe3RvcCwgbGVmdCwgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0LCB2aXNpYmxlOiB0cnVlfSk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICBjbG9zZSgpe1xuICAgIHRoaXMucmVmcy5wb3J0YWwuY2xvc2VQb3J0YWwoKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXtSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jaGlsZHJlbiwgeyByZWY6IFwiYWN0aXZhdG9yXCIgfSl9XG4gICAgICBjbG9zZU9uRXNjIGNsb3NlT25PdXRzaWRlQ2xpY2sgY2xvc2VPblNjcm9sbCBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0+XG4gICAgICA8ZGl2IHJlZj1cImRyb3Bkb3duXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubGVmdFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBkcm9wZG93biAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kcm9wZG93bi0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXJyb3dcIiByZWY9XCJhcnJvd1wiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5hcnJvd0xlZnQsIHJpZ2h0OiB0aGlzLnN0YXRlLmFycm93UmlnaHR9fT48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdHlwZW9mIGl0ZW0gPT09IFwiZnVuY3Rpb25cIiA/IGl0ZW0odGhpcy5jbG9zZSkgOiBpdGVtO1xuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAge2VsZW1lbnR9XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvUG9ydGFsPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgRmVlZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZW50cmllczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHB1YmxpY2F0aW9uRGF0ZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGVzY3JpcHRpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGxpbms6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwiZmVlZFwiPlxuICAgICAge3RoaXMucHJvcHMuZW50cmllcy5tYXAoKGVudHJ5LCBpbmRleCk9PntcbiAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJmZWVkLWl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmZWVkLWl0ZW0tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIDxhIGhyZWY9e2VudHJ5Lmxpbmt9IHRhcmdldD1cInRvcFwiPntlbnRyeS50aXRsZX08L2E+XG4gICAgICAgICAgICB7ZW50cnkuZGVzY3JpcHRpb259XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZlZWQtaXRlbS1kYXRlXCI+e3RoaXMucHJvcHMuaTE4bi50aW1lLmZvcm1hdChlbnRyeS5wdWJsaWNhdGlvbkRhdGUpfTwvc3Bhbj5cbiAgICAgICAgPC9saT5cbiAgICAgIH0pfVxuICAgIDwvdWw+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRmVlZCk7IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIHNjcm9sbFRvU2VjdGlvbihhbmNob3IpIHtcbiAgaWYgKCEkKGFuY2hvcikuc2l6ZSgpKXtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFuY2hvcjtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGxldCB0b3BPZmZzZXQgPSA5MDtcbiAgbGV0IHNjcm9sbFRvcCA9ICQoYW5jaG9yKS5vZmZzZXQoKS50b3AgLSB0b3BPZmZzZXQ7XG5cbiAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICBzY3JvbGxUb3AgOiBzY3JvbGxUb3BcbiAgfSwge1xuICAgIGR1cmF0aW9uIDogNTAwLFxuICAgIGVhc2luZyA6IFwiZWFzZUluT3V0UXVhZFwiXG4gIH0pO1xuICBcbiAgc2V0VGltZW91dCgoKT0+e1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYW5jaG9yO1xuICB9LCA1MDApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgb25DbGljayhlLCByZSl7XG4gICAgaWYgKHRoaXMucHJvcHMuaHJlZiAmJiB0aGlzLnByb3BzLmhyZWZbMF0gPT09ICcjJyl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzY3JvbGxUb1NlY3Rpb24odGhpcy5wcm9wcy5ocmVmKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMub25DbGljayl7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2soZSwgcmUpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSwgcmUpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uVG91Y2hTdGFydCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hTdGFydChlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hFbmQoZSwgcmUpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogZmFsc2V9KTtcbiAgICB0aGlzLm9uQ2xpY2soZSwgcmUpO1xuICAgIGlmICh0aGlzLnByb3BzLm9uVG91Y2hFbmQpe1xuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoRW5kKGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxhIHsuLi50aGlzLnByb3BzfVxuICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZSArICh0aGlzLnN0YXRlLmFjdGl2ZSA/IFwiIGFjdGl2ZVwiIDogXCJcIil9XG4gICAgICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0vPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMYW5ndWFnZVBpY2tlciBmcm9tICcuL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4JztcbmltcG9ydCBQcm9maWxlSXRlbSBmcm9tICcuL25hdmJhci9wcm9maWxlLWl0ZW0uanN4JztcbmltcG9ydCBNZW51IGZyb20gJy4vbmF2YmFyL21lbnUuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vcGVuTWVudSA9IHRoaXMub3Blbk1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlTWVudSA9IHRoaXMuY2xvc2VNZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzTWVudU9wZW46IGZhbHNlXG4gICAgfVxuICB9XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbmF2YmFySXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBpdGVtOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG4gICAgfSkpLmlzUmVxdWlyZWQsXG4gICAgbWVudUl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZCxcbiAgICBkZWZhdWx0T3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgbmF2aWdhdGlvbjogUHJvcFR5cGVzLmVsZW1lbnRcbiAgfVxuICBvcGVuTWVudSgpe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNNZW51T3BlbjogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGNsb3NlTWVudSgpe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9e2BuYXZiYXIgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn1gfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLW1lbnUtYnV0dG9uYH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstaWNvbiBsaW5rLWZ1bGxgfSBvbkNsaWNrPXt0aGlzLm9wZW5NZW51fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLW5hdmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5uYXZiYXJJdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSBrZXk9e2luZGV4fSBjbGFzc05hbWU9e2BuYXZiYXItaXRlbSAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1uYXZiYXItaXRlbS0ke2l0ZW0uY2xhc3NOYW1lU3VmZml4fWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5pdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pLmZpbHRlcihpdGVtPT4hIWl0ZW0pfVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZGVmYXVsdC1vcHRpb25zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmRlZmF1bHRPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgICAgIDxQcm9maWxlSXRlbSBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS8+XG4gICAgICAgICAgICAgICAgICAgICAgPExhbmd1YWdlUGlja2VyIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgICAgICA8TWVudSBvcGVuPXt0aGlzLnN0YXRlLmlzTWVudU9wZW59IG9uQ2xvc2U9e3RoaXMuY2xvc2VNZW51fVxuICAgICAgICAgICAgICAgIGl0ZW1zPXt0aGlzLnByb3BzLm1lbnVJdGVtc30gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbmF2aWdhdGlvbj17dGhpcy5wcm9wcy5uYXZpZ2F0aW9ufS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2UvbG9jYWxlcyc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvZHJvcGRvd24uanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmNsYXNzIExhbmd1YWdlUGlja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cImxhbmd1YWdlLXBpY2tlclwiIGl0ZW1zPXt0aGlzLnByb3BzLmxvY2FsZXMuYXZhbGlhYmxlLm1hcCgobG9jYWxlKT0+e1xuICAgICAgcmV0dXJuICg8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstZnVsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1saW5rLWxhbmd1YWdlLXBpY2tlcmB9IG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0TG9jYWxlLmJpbmQodGhpcywgbG9jYWxlLmxvY2FsZSl9PlxuICAgICAgICA8c3Bhbj57bG9jYWxlLm5hbWV9PC9zcGFuPlxuICAgICAgPC9hPik7XG4gICAgfSl9PlxuICAgICAgPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uLXBpbGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tYnV0dG9uLXBpbGwtbGFuZ3VhZ2VgfT5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMubG9jYWxlcy5jdXJyZW50fTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L0Ryb3Bkb3duPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbG9jYWxlczogc3RhdGUubG9jYWxlc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTGFuZ3VhZ2VQaWNrZXIpOyIsImltcG9ydCBMaW5rIGZyb20gJy4uL2xpbmsuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9zdGF0dXMnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5mdW5jdGlvbiBjaGVja0xpbmtDbGlja2VkKHRhcmdldCl7XG4gIHJldHVybiB0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIgfHwgKHRhcmdldC5wYXJlbnRFbGVtZW50ID8gY2hlY2tMaW5rQ2xpY2tlZCh0YXJnZXQucGFyZW50RWxlbWVudCkgOiBmYWxzZSk7XG59XG5cbmNsYXNzIE1lbnUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbmF2aWdhdGlvbjogUHJvcFR5cGVzLmVsZW1lbnRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub3BlbiA9IHRoaXMub3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZUJ5T3ZlcmxheSA9IHRoaXMuY2xvc2VCeU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlzcGxheWVkOiBwcm9wcy5vcGVuLFxuICAgICAgdmlzaWJsZTogcHJvcHMub3BlbixcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWc6IG51bGwsXG4gICAgICBvcGVuOiBwcm9wcy5vcGVuXG4gICAgfVxuICB9XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKXtcbiAgICBpZiAobmV4dFByb3BzLm9wZW4gJiYgIXRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMub3BlbiAmJiB0aGlzLnN0YXRlLm9wZW4pe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7J2RyYWdnaW5nJzogdHJ1ZX0pO1xuICAgIHRoaXMudG91Y2hDb3JkWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCA9IDA7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hNb3ZlKGUpe1xuICAgIGxldCBkaWZmWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoQ29yZFg7XG4gICAgbGV0IGFic29sdXRlRGlmZmVyZW5jZVggPSBNYXRoLmFicyhkaWZmWCAtIHRoaXMuc3RhdGUuZHJhZyk7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCArPSBhYnNvbHV0ZURpZmZlcmVuY2VYO1xuXG4gICAgaWYgKGRpZmZYID4gMCkge1xuICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBkaWZmWH0pO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvblRvdWNoRW5kKGUpe1xuICAgIGxldCB3aWR0aCA9ICQodGhpcy5yZWZzLm1lbnVDb250YWluZXIpLndpZHRoKCk7XG4gICAgbGV0IGRpZmYgPSB0aGlzLnN0YXRlLmRyYWc7XG4gICAgbGV0IG1vdmVtZW50ID0gdGhpcy50b3VjaE1vdmVtZW50WDtcbiAgICBcbiAgICBsZXQgbWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgPSBNYXRoLmFicyhkaWZmKSA+PSB3aWR0aCowLjMzO1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZFRoZU92ZXJsYXkgPSBlLnRhcmdldCA9PT0gdGhpcy5yZWZzLm1lbnUgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBsZXQgeW91SnVzdENsaWNrZWRBTGluayA9IGNoZWNrTGlua0NsaWNrZWQoZS50YXJnZXQpICYmIG1vdmVtZW50IDw9IDU7XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ2dpbmc6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZzogbnVsbH0pO1xuICAgICAgaWYgKG1lbnVIYXNTbGlkZWRFbm91Z2hGb3JDbG9zaW5nIHx8IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSB8fCB5b3VKdXN0Q2xpY2tlZEFMaW5rKXtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sIDEwKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb3Blbigpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogdHJ1ZSwgb3BlbjogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IHRydWV9KTtcbiAgICB9LCAxMCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5jc3MoeydvdmVyZmxvdyc6ICdoaWRkZW4nfSk7XG4gIH1cbiAgY2xvc2VCeU92ZXJsYXkoZSl7XG4gICAgbGV0IGlzT3ZlcmxheSA9IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGlzTGluayA9IGNoZWNrTGlua0NsaWNrZWQoZS50YXJnZXQpO1xuICAgIGlmICghdGhpcy5zdGF0ZS5kcmFnZ2luZyAmJiAoaXNPdmVybGF5IHx8IGlzTGluaykpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBjbG9zZSgpe1xuICAgICQoZG9jdW1lbnQuYm9keSkuY3NzKHsnb3ZlcmZsb3cnOiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiBmYWxzZSwgb3BlbjogZmFsc2V9KTtcbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH0sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IG1lbnUgJHt0aGlzLnN0YXRlLmRpc3BsYXllZCA/IFwiZGlzcGxheWVkXCIgOiBcIlwifSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLmRyYWdnaW5nID8gXCJkcmFnZ2luZ1wiIDogXCJcIn1gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNsb3NlQnlPdmVybGF5fSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoTW92ZT17dGhpcy5vblRvdWNoTW92ZX0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfSByZWY9XCJtZW51XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWNvbnRhaW5lclwiIHJlZj1cIm1lbnVDb250YWluZXJcIiBzdHlsZT17e2xlZnQ6IHRoaXMuc3RhdGUuZHJhZ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtZW51LWhlYWRlci1idXR0b24tY2xvc2UgaWNvbiBpY29uLWFycm93LWxlZnRcIj48L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5hdmlnYXRpb24gPyA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtZXh0cmFzXCI+e3RoaXMucHJvcHMubmF2aWdhdGlvbn08L2Rpdj4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm1lbnUtaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIga2V5PXtpbmRleH0+e2l0ZW19PC9saT5cbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW0gbWVudS1pdGVtLXNwYWNlXCI+PC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSBtYWluLWZ1bmN0aW9uLWxpbmstbWVudS1wcm9maWxlXCIgaHJlZj1cIi9wcm9maWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b2JqZWN0IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtcHJvZmlsZS1pbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE9e2AvcmVzdC91c2VyL2ZpbGVzL3VzZXIvJHt0aGlzLnByb3BzLnN0YXR1cy51c2VySWR9L2lkZW50aWZpZXIvcHJvZmlsZS1pbWFnZS05NmB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJpbWFnZS9qcGVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi11c2VyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9vYmplY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ucHJvZmlsZS5wcm9maWxlJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51IG1haW4tZnVuY3Rpb24tbGluay1tZW51LWluc3RydWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWZvcmdvdHBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5pbnN0cnVjdGlvbnMnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtaGVscGRlc2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1oZWxwZGVza1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5ob21lLmhlbHBkZXNrJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51IG1haW4tZnVuY3Rpb24tbGluay1tZW51LWxvZ291dFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMubG9nb3V0fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1zaWdub3V0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmxvZ291dC5sb2dvdXQnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE1lbnUpO1xuICBcbiIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvZHJvcGRvd24uanN4JztcbmltcG9ydCBMaW5rIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2xpbmsuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJ34vYWN0aW9ucy9iYXNlL3N0YXR1cyc7XG5cbmNsYXNzIFByb2ZpbGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICBpZiAoIXRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJ1c2VyXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4ucHJvZmlsZS5saW5rcy5wZXJzb25hbCcsXG4gICAgICAgIGhyZWY6IFwiL3Byb2ZpbGVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJmb3Jnb3RwYXNzd29yZFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmZvb3Rlci5pbnN0cnVjdGlvbnMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcImhlbHBkZXNrXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4uaG9tZS5oZWxwZGVzaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwic2lnbm91dFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmxvZ291dC5sb2dvdXQnLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLmxvZ291dFxuICAgICAgfVxuICAgIF1cbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cInByb2ZpbGUtbWVudVwiIGl0ZW1zPXtpdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgIHJldHVybiAoY2xvc2VEcm9wZG93bik9PntyZXR1cm4gPExpbmsgaHJlZj1cIi9wcm9maWxlXCJcbiAgICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstcHJvZmlsZS1tZW51YH1cbiAgICAgICAgIG9uQ2xpY2s9eyguLi5hcmdzKT0+e2Nsb3NlRHJvcGRvd24oKTtpdGVtLm9uQ2xpY2sgJiYgaXRlbS5vbkNsaWNrKC4uLmFyZ3MpfX0gaHJlZj17aXRlbS5ocmVmfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX08L3NwYW4+XG4gICAgICAgIDwvTGluaz59XG4gICAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGJ1dHRvbi1waWxsIG1haW4tZnVuY3Rpb24tYnV0dG9uLXBpbGwtcHJvZmlsZVwiPlxuICAgICAgICA8b2JqZWN0IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtZnVsbFwiXG4gICAgICAgICBkYXRhPXtgL3Jlc3QvdXNlci9maWxlcy91c2VyLyR7dGhpcy5wcm9wcy5zdGF0dXMudXNlcklkfS9pZGVudGlmaWVyL3Byb2ZpbGUtaW1hZ2UtOTZgfVxuICAgICAgICAgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdXNlclwiPjwvc3Bhbj5cbiAgICAgICAgPC9vYmplY3Q+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKFByb2ZpbGVJdGVtKTsiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7dW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIsIHVubW91bnRDb21wb25lbnRBdE5vZGUsIGZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nO1xuXG5jb25zdCBLRVlDT0RFUyA9IHtcbiAgRVNDQVBFOiAyN1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0geyBhY3RpdmU6IGZhbHNlIH07XG4gICAgdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2sgPSB0aGlzLmhhbmRsZVdyYXBwZXJDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwgPSB0aGlzLmNsb3NlUG9ydGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayA9IHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleWRvd24gPSB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmIChuZXh0U3RhdGUuYWN0aXZlKXtcbiAgICAgIHRoaXMucmVuZGVyUG9ydGFsKG5leHRQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUG9ydGFsKHRydWUpO1xuICB9XG5cbiAgaGFuZGxlV3JhcHBlckNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5vcGVuUG9ydGFsKCk7XG4gIH1cblxuICBvcGVuUG9ydGFsKHByb3BzID0gdGhpcy5wcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IHRydWUgfSk7XG4gICAgdGhpcy5yZW5kZXJQb3J0YWwocHJvcHMsIHRydWUpO1xuICB9XG5cbiAgY2xvc2VQb3J0YWwoaXNVbm1vdW50ZWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHJlc2V0UG9ydGFsU3RhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICAgIHVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5ub2RlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChpc1VubW91bnRlZCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5iZWZvcmVDbG9zZSkge1xuICAgICAgICB0aGlzLnByb3BzLmJlZm9yZUNsb3NlKHRoaXMubm9kZSwgcmVzZXRQb3J0YWxTdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNldFBvcnRhbFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IGZpbmRET01Ob2RlKHRoaXMucG9ydGFsKTtcbiAgICBpZiAocm9vdC5jb250YWlucyhlLnRhcmdldCkgfHwgKGUuYnV0dG9uICYmIGUuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICB9XG5cbiAgaGFuZGxlS2V5ZG93bihlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gS0VZQ09ERVMuRVNDQVBFICYmIHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLmNsb3NlUG9ydGFsKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyUG9ydGFsKHByb3BzLCBpc09wZW5pbmcpIHtcbiAgICBpZiAoIXRoaXMubm9kZSkge1xuICAgICAgdGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamltZmIvZDk5ZTA2NzhlOWRhNzE1Y2NmNjQ1NDk2MWVmMDRkMWJcbiAgICBpZiAodHlwZW9mIHByb3BzLmNoaWxkcmVuLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNoaWxkcmVuID0gUmVhY3QuY2xvbmVFbGVtZW50KHByb3BzLmNoaWxkcmVuLCB7XG4gICAgICAgIGNsb3NlUG9ydGFsOiB0aGlzLmNsb3NlUG9ydGFsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcnRhbCA9IHVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKFxuICAgICAgdGhpcyxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgdGhpcy5ub2RlLFxuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVxuICAgICk7XG4gICAgXG4gICAgaWYgKGlzT3BlbmluZykge1xuICAgICAgdGhpcy5wcm9wcy5vbk9wZW4odGhpcy5ub2RlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub3BlbkJ5Q2xpY2tPbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24sIHtcbiAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5Qb3J0YWwucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgb3BlbkJ5Q2xpY2tPbjogUHJvcFR5cGVzLmVsZW1lbnQsXG4gIGNsb3NlT25Fc2M6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPblNjcm9sbDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBiZWZvcmVDbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXBkYXRlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuUG9ydGFsLmRlZmF1bHRQcm9wcyA9IHtcbiAgb25PcGVuOiAoKSA9PiB7fSxcbiAgb25DbG9zZTogKCkgPT4ge30sXG4gIG9uVXBkYXRlOiAoKSA9PiB7fVxufTsiLCJpbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tICcuLi9jb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3gnO1xuaW1wb3J0IEJvZHkgZnJvbSAnLi4vY29tcG9uZW50cy9mcm9udHBhZ2UvYm9keS5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhGcm9udHBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgaWQ9XCJyb290XCI+XG4gICAgICA8Tm90aWZpY2F0aW9ucz48L05vdGlmaWNhdGlvbnM+XG4gICAgICA8Qm9keT48L0JvZHk+XG4gICAgPC9kaXY+KTtcbiAgfVxufSIsImltcG9ydCB7bG9nZ2VyfSBmcm9tICdyZWR1eC1sb2dnZXInO1xuaW1wb3J0IHRodW5rIGZyb20gJ3JlZHV4LXRodW5rJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1Byb3ZpZGVyLCBjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2NyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmV9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB7cmVuZGVyfSBmcm9tICdyZWFjdC1kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBydW5BcHAocmVkdWNlciwgQXBwLCBjYWxsYmFjayl7XG4gIGxldCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShsb2dnZXIsIHRodW5rKSk7XG5cbiAgcmVuZGVyKDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICAgIDxBcHAvPlxuICA8L1Byb3ZpZGVyPiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcHBcIikpO1xuICBcbiAgbGV0IG5ld1N0b3JlID0ge1xuICAgIGRpc3BhdGNoKGFjdGlvbil7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gYWN0aW9uKHN0b3JlLmRpc3BhdGNoLCBzdG9yZS5nZXRTdGF0ZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBzdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLnN1YnNjcmliZSguLi5hcmdzKTtcbiAgICB9LFxuICAgIGdldFN0YXRlKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLmdldFN0YXRlKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlZHVjZXIoLi4uYXJncyl7XG4gICAgICByZXR1cm4gc3RvcmUucmVwbGFjZVJlZHVjZXIoLi4uYXJncyk7XG4gICAgfVxuICB9XG4gIFxuLy8gIGNvbnN0IG9Db25uZWN0ID0gUmVhY3RSZWR1eC5jb25uZWN0O1xuLy8gIFJlYWN0UmVkdXguY29ubmVjdCA9IGZ1bmN0aW9uKG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKXtcbi8vICAgIHJldHVybiBvQ29ubmVjdCgoc3RhdGUpPT57XG4vLyAgICAgIGxldCB2YWx1ZSA9IG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSk7XG4vLyAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKChrZXkpPT57XG4vLyAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZVtrZXldID09PSBcInVuZGVmaW5lZFwiKXtcbi8vICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3Npbmcgc3RhdGUgdmFsdWUgZm9yIGtleSBcIiArIGtleSArIFwiIHlvdSBtb3N0IGxpa2VseSBmb3Jnb3QgdG8gY29tYmluZSB0aGUgcmVkdWNlcnMgd2l0aGluIHRoZSByb290IHJlZHVjZXIgZmlsZVwiKTtcbi8vICAgICAgICB9XG4vLyAgICAgIH0pO1xuLy8gICAgfSwgbWFwRGlzcGF0Y2hUb1Byb3BzKTtcbi8vICB9XG4gIFxuICBjYWxsYmFjayAmJiBjYWxsYmFjayhuZXdTdG9yZSk7XG59IiwiaW1wb3J0IEFwcCBmcm9tICcuL2NvbnRhaW5lcnMvaW5kZXguZnJvbnRwYWdlLmpzeCc7XG5pbXBvcnQgcmVkdWNlciBmcm9tICcuL3JlZHVjZXJzL2luZGV4LmZyb250cGFnZSc7XG5pbXBvcnQgcnVuQXBwIGZyb20gJy4vZGVmYXVsdC5kZWJ1Zy5qc3gnO1xuaW1wb3J0IHdlYnNvY2tldCBmcm9tICcuL3V0aWwvd2Vic29ja2V0JztcblxucnVuQXBwKHJlZHVjZXIsIEFwcCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG4gIHZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGludmFyaWFudCh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicsICclczogJXMgdHlwZSBgJXNgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tICcgKyAnUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSk7XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIHdhcm5pbmcoIWVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRXJyb3IsICclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUsIHR5cGVvZiBlcnJvcik7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICB3YXJuaW5nKGZhbHNlLCAnRmFpbGVkICVzIHR5cGU6ICVzJXMnLCBsb2NhdGlvbiwgZXJyb3IubWVzc2FnZSwgc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc2hpbShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGlmIChzZWNyZXQgPT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAvLyBJdCBpcyBzdGlsbCBzYWZlIHdoZW4gY2FsbGVkIGZyb20gUmVhY3QuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGludmFyaWFudChcbiAgICAgIGZhbHNlLFxuICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgJ1VzZSBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKSB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgKTtcbiAgfTtcbiAgc2hpbS5pc1JlcXVpcmVkID0gc2hpbTtcbiAgZnVuY3Rpb24gZ2V0U2hpbSgpIHtcbiAgICByZXR1cm4gc2hpbTtcbiAgfTtcbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBzaGltLFxuICAgIGJvb2w6IHNoaW0sXG4gICAgZnVuYzogc2hpbSxcbiAgICBudW1iZXI6IHNoaW0sXG4gICAgb2JqZWN0OiBzaGltLFxuICAgIHN0cmluZzogc2hpbSxcbiAgICBzeW1ib2w6IHNoaW0sXG5cbiAgICBhbnk6IHNoaW0sXG4gICAgYXJyYXlPZjogZ2V0U2hpbSxcbiAgICBlbGVtZW50OiBzaGltLFxuICAgIGluc3RhbmNlT2Y6IGdldFNoaW0sXG4gICAgbm9kZTogc2hpbSxcbiAgICBvYmplY3RPZjogZ2V0U2hpbSxcbiAgICBvbmVPZjogZ2V0U2hpbSxcbiAgICBvbmVPZlR5cGU6IGdldFNoaW0sXG4gICAgc2hhcGU6IGdldFNoaW1cbiAgfTtcblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGVtcHR5RnVuY3Rpb247XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXJcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgd2FybmluZyhcbiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCVzYCBwcm9wIG9uIGAlc2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICtcbiAgICAgICAgICAgICAgJ2FuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICAgJ1lvdSBtYXkgYmUgc2VlaW5nIHRoaXMgd2FybmluZyBkdWUgdG8gYSB0aGlyZC1wYXJ0eSBQcm9wVHlwZXMgJyArXG4gICAgICAgICAgICAgICdsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgJyArICdmb3IgZGV0YWlscy4nLFxuICAgICAgICAgICAgICBwcm9wRnVsbE5hbWUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIGFycmF5T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgd2FybmluZyhcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGlkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICVzIGF0IGluZGV4ICVzLicsXG4gICAgICAgICAgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpLFxuICAgICAgICAgIGlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wVmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuICFwcm9wVmFsdWU7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5ldmVyeShpc05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTm9kZShlbnRyeVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAgIC8vIE5hdGl2ZSBTeW1ib2wuXG4gICAgaWYgKHByb3BUeXBlID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIFN5bWJvbC5mb3IgJiZcbiAgICBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gICAgMHhlYWM3O1xuXG4gIHZhciBpc1ZhbGlkRWxlbWVudCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgb2JqZWN0ICE9PSBudWxsICYmXG4gICAgICBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUucmVkdXhMb2dnZXI9ZS5yZWR1eExvZ2dlcnx8e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSx0KXtlLnN1cGVyXz10LGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodC5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTplLGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pfWZ1bmN0aW9uIHIoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImtpbmRcIix7dmFsdWU6ZSxlbnVtZXJhYmxlOiEwfSksdCYmdC5sZW5ndGgmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicGF0aFwiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBuKGUsdCxyKXtuLnN1cGVyXy5jYWxsKHRoaXMsXCJFXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJsaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJyaHNcIix7dmFsdWU6cixlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbyhlLHQpe28uc3VwZXJfLmNhbGwodGhpcyxcIk5cIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInJoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBpKGUsdCl7aS5zdXBlcl8uY2FsbCh0aGlzLFwiRFwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwibGhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGEoZSx0LHIpe2Euc3VwZXJfLmNhbGwodGhpcyxcIkFcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImluZGV4XCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaXRlbVwiLHt2YWx1ZTpyLGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBmKGUsdCxyKXt2YXIgbj1lLnNsaWNlKChyfHx0KSsxfHxlLmxlbmd0aCk7cmV0dXJuIGUubGVuZ3RoPXQ8MD9lLmxlbmd0aCt0OnQsZS5wdXNoLmFwcGx5KGUsbiksZX1mdW5jdGlvbiB1KGUpe3ZhciB0PVwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6TihlKTtyZXR1cm5cIm9iamVjdFwiIT09dD90OmU9PT1NYXRoP1wibWF0aFwiOm51bGw9PT1lP1wibnVsbFwiOkFycmF5LmlzQXJyYXkoZSk/XCJhcnJheVwiOlwiW29iamVjdCBEYXRlXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpP1wiZGF0ZVwiOlwiZnVuY3Rpb25cIj09dHlwZW9mIGUudG9TdHJpbmcmJi9eXFwvLipcXC8vLnRlc3QoZS50b1N0cmluZygpKT9cInJlZ2V4cFwiOlwib2JqZWN0XCJ9ZnVuY3Rpb24gbChlLHQscixjLHMsZCxwKXtzPXN8fFtdLHA9cHx8W107dmFyIGc9cy5zbGljZSgwKTtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgZCl7aWYoYyl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYyYmYyhnLGQpKXJldHVybjtpZihcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBjP1widW5kZWZpbmVkXCI6TihjKSkpe2lmKGMucHJlZmlsdGVyJiZjLnByZWZpbHRlcihnLGQpKXJldHVybjtpZihjLm5vcm1hbGl6ZSl7dmFyIGg9Yy5ub3JtYWxpemUoZyxkLGUsdCk7aCYmKGU9aFswXSx0PWhbMV0pfX19Zy5wdXNoKGQpfVwicmVnZXhwXCI9PT11KGUpJiZcInJlZ2V4cFwiPT09dSh0KSYmKGU9ZS50b1N0cmluZygpLHQ9dC50b1N0cmluZygpKTt2YXIgeT1cInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOk4oZSksdj1cInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOk4odCksYj1cInVuZGVmaW5lZFwiIT09eXx8cCYmcFtwLmxlbmd0aC0xXS5saHMmJnBbcC5sZW5ndGgtMV0ubGhzLmhhc093blByb3BlcnR5KGQpLG09XCJ1bmRlZmluZWRcIiE9PXZ8fHAmJnBbcC5sZW5ndGgtMV0ucmhzJiZwW3AubGVuZ3RoLTFdLnJocy5oYXNPd25Qcm9wZXJ0eShkKTtpZighYiYmbSlyKG5ldyBvKGcsdCkpO2Vsc2UgaWYoIW0mJmIpcihuZXcgaShnLGUpKTtlbHNlIGlmKHUoZSkhPT11KHQpKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwiZGF0ZVwiPT09dShlKSYmZS10IT09MClyKG5ldyBuKGcsZSx0KSk7ZWxzZSBpZihcIm9iamVjdFwiPT09eSYmbnVsbCE9PWUmJm51bGwhPT10KWlmKHAuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0Lmxocz09PWV9KS5sZW5ndGgpZSE9PXQmJnIobmV3IG4oZyxlLHQpKTtlbHNle2lmKHAucHVzaCh7bGhzOmUscmhzOnR9KSxBcnJheS5pc0FycmF5KGUpKXt2YXIgdztlLmxlbmd0aDtmb3Iodz0wO3c8ZS5sZW5ndGg7dysrKXc+PXQubGVuZ3RoP3IobmV3IGEoZyx3LG5ldyBpKHZvaWQgMCxlW3ddKSkpOmwoZVt3XSx0W3ddLHIsYyxnLHcscCk7Zm9yKDt3PHQubGVuZ3RoOylyKG5ldyBhKGcsdyxuZXcgbyh2b2lkIDAsdFt3KytdKSkpfWVsc2V7dmFyIHg9T2JqZWN0LmtleXMoZSksUz1PYmplY3Qua2V5cyh0KTt4LmZvckVhY2goZnVuY3Rpb24obixvKXt2YXIgaT1TLmluZGV4T2Yobik7aT49MD8obChlW25dLHRbbl0scixjLGcsbixwKSxTPWYoUyxpKSk6bChlW25dLHZvaWQgMCxyLGMsZyxuLHApfSksUy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2wodm9pZCAwLHRbZV0scixjLGcsZSxwKX0pfXAubGVuZ3RoPXAubGVuZ3RoLTF9ZWxzZSBlIT09dCYmKFwibnVtYmVyXCI9PT15JiZpc05hTihlKSYmaXNOYU4odCl8fHIobmV3IG4oZyxlLHQpKSl9ZnVuY3Rpb24gYyhlLHQscixuKXtyZXR1cm4gbj1ufHxbXSxsKGUsdCxmdW5jdGlvbihlKXtlJiZuLnB1c2goZSl9LHIpLG4ubGVuZ3RoP246dm9pZCAwfWZ1bmN0aW9uIHMoZSx0LHIpe2lmKHIucGF0aCYmci5wYXRoLmxlbmd0aCl7dmFyIG4sbz1lW3RdLGk9ci5wYXRoLmxlbmd0aC0xO2ZvcihuPTA7bjxpO24rKylvPW9bci5wYXRoW25dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhvW3IucGF0aFtuXV0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpkZWxldGUgb1tyLnBhdGhbbl1dO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6b1tyLnBhdGhbbl1dPXIucmhzfX1lbHNlIHN3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKGVbdF0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjplPWYoZSx0KTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOmVbdF09ci5yaHN9cmV0dXJuIGV9ZnVuY3Rpb24gZChlLHQscil7aWYoZSYmdCYmciYmci5raW5kKXtmb3IodmFyIG49ZSxvPS0xLGk9ci5wYXRoP3IucGF0aC5sZW5ndGgtMTowOysrbzxpOylcInVuZGVmaW5lZFwiPT10eXBlb2YgbltyLnBhdGhbb11dJiYobltyLnBhdGhbb11dPVwibnVtYmVyXCI9PXR5cGVvZiByLnBhdGhbb10/W106e30pLG49bltyLnBhdGhbb11dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKHIucGF0aD9uW3IucGF0aFtvXV06bixyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBuW3IucGF0aFtvXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpuW3IucGF0aFtvXV09ci5yaHN9fX1mdW5jdGlvbiBwKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6b1tyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIkVcIjpvW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBvW3IucGF0aFtuXV19fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmVbdF09ci5saHM7YnJlYWs7Y2FzZVwiRVwiOmVbdF09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmU9ZihlLHQpfXJldHVybiBlfWZ1bmN0aW9uIGcoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7dmFyIG4sbyxpPWU7Zm9yKG89ci5wYXRoLmxlbmd0aC0xLG49MDtuPG87bisrKVwidW5kZWZpbmVkXCI9PXR5cGVvZiBpW3IucGF0aFtuXV0mJihpW3IucGF0aFtuXV09e30pLGk9aVtyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKGlbci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmlbci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJFXCI6aVtyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjpkZWxldGUgaVtyLnBhdGhbbl1dfX19ZnVuY3Rpb24gaChlLHQscil7aWYoZSYmdCl7dmFyIG49ZnVuY3Rpb24obil7ciYmIXIoZSx0LG4pfHxkKGUsdCxuKX07bChlLHQsbil9fWZ1bmN0aW9uIHkoZSl7cmV0dXJuXCJjb2xvcjogXCIrRltlXS5jb2xvcitcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIn1mdW5jdGlvbiB2KGUpe3ZhciB0PWUua2luZCxyPWUucGF0aCxuPWUubGhzLG89ZS5yaHMsaT1lLmluZGV4LGE9ZS5pdGVtO3N3aXRjaCh0KXtjYXNlXCJFXCI6cmV0dXJuW3Iuam9pbihcIi5cIiksbixcIuKGklwiLG9dO2Nhc2VcIk5cIjpyZXR1cm5bci5qb2luKFwiLlwiKSxvXTtjYXNlXCJEXCI6cmV0dXJuW3Iuam9pbihcIi5cIildO2Nhc2VcIkFcIjpyZXR1cm5bci5qb2luKFwiLlwiKStcIltcIitpK1wiXVwiLGFdO2RlZmF1bHQ6cmV0dXJuW119fWZ1bmN0aW9uIGIoZSx0LHIsbil7dmFyIG89YyhlLHQpO3RyeXtuP3IuZ3JvdXBDb2xsYXBzZWQoXCJkaWZmXCIpOnIuZ3JvdXAoXCJkaWZmXCIpfWNhdGNoKGUpe3IubG9nKFwiZGlmZlwiKX1vP28uZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgdD1lLmtpbmQsbj12KGUpO3IubG9nLmFwcGx5KHIsW1wiJWMgXCIrRlt0XS50ZXh0LHkodCldLmNvbmNhdChQKG4pKSl9KTpyLmxvZyhcIuKAlOKAlCBubyBkaWZmIOKAlOKAlFwiKTt0cnl7ci5ncm91cEVuZCgpfWNhdGNoKGUpe3IubG9nKFwi4oCU4oCUIGRpZmYgZW5kIOKAlOKAlCBcIil9fWZ1bmN0aW9uIG0oZSx0LHIsbil7c3dpdGNoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6TihlKSl7Y2FzZVwib2JqZWN0XCI6cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgZVtuXT9lW25dLmFwcGx5KGUsUChyKSk6ZVtuXTtjYXNlXCJmdW5jdGlvblwiOnJldHVybiBlKHQpO2RlZmF1bHQ6cmV0dXJuIGV9fWZ1bmN0aW9uIHcoZSl7dmFyIHQ9ZS50aW1lc3RhbXAscj1lLmR1cmF0aW9uO3JldHVybiBmdW5jdGlvbihlLG4sbyl7dmFyIGk9W1wiYWN0aW9uXCJdO3JldHVybiBpLnB1c2goXCIlY1wiK1N0cmluZyhlLnR5cGUpKSx0JiZpLnB1c2goXCIlY0AgXCIrbiksciYmaS5wdXNoKFwiJWMoaW4gXCIrby50b0ZpeGVkKDIpK1wiIG1zKVwiKSxpLmpvaW4oXCIgXCIpfX1mdW5jdGlvbiB4KGUsdCl7dmFyIHI9dC5sb2dnZXIsbj10LmFjdGlvblRyYW5zZm9ybWVyLG89dC50aXRsZUZvcm1hdHRlcixpPXZvaWQgMD09PW8/dyh0KTpvLGE9dC5jb2xsYXBzZWQsZj10LmNvbG9ycyx1PXQubGV2ZWwsbD10LmRpZmYsYz1cInVuZGVmaW5lZFwiPT10eXBlb2YgdC50aXRsZUZvcm1hdHRlcjtlLmZvckVhY2goZnVuY3Rpb24obyxzKXt2YXIgZD1vLnN0YXJ0ZWQscD1vLnN0YXJ0ZWRUaW1lLGc9by5hY3Rpb24saD1vLnByZXZTdGF0ZSx5PW8uZXJyb3Isdj1vLnRvb2ssdz1vLm5leHRTdGF0ZSx4PWVbcysxXTt4JiYodz14LnByZXZTdGF0ZSx2PXguc3RhcnRlZC1kKTt2YXIgUz1uKGcpLGs9XCJmdW5jdGlvblwiPT10eXBlb2YgYT9hKGZ1bmN0aW9uKCl7cmV0dXJuIHd9LGcsbyk6YSxqPUQocCksRT1mLnRpdGxlP1wiY29sb3I6IFwiK2YudGl0bGUoUykrXCI7XCI6XCJcIixBPVtcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIl07QS5wdXNoKEUpLHQudGltZXN0YW1wJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpLHQuZHVyYXRpb24mJkEucHVzaChcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIik7dmFyIE89aShTLGosdik7dHJ5e2s/Zi50aXRsZSYmYz9yLmdyb3VwQ29sbGFwc2VkLmFwcGx5KHIsW1wiJWMgXCIrT10uY29uY2F0KEEpKTpyLmdyb3VwQ29sbGFwc2VkKE8pOmYudGl0bGUmJmM/ci5ncm91cC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cChPKX1jYXRjaChlKXtyLmxvZyhPKX12YXIgTj1tKHUsUyxbaF0sXCJwcmV2U3RhdGVcIiksUD1tKHUsUyxbU10sXCJhY3Rpb25cIiksQz1tKHUsUyxbeSxoXSxcImVycm9yXCIpLEY9bSh1LFMsW3ddLFwibmV4dFN0YXRlXCIpO2lmKE4paWYoZi5wcmV2U3RhdGUpe3ZhciBMPVwiY29sb3I6IFwiK2YucHJldlN0YXRlKGgpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbTl0oXCIlYyBwcmV2IHN0YXRlXCIsTCxoKX1lbHNlIHJbTl0oXCJwcmV2IHN0YXRlXCIsaCk7aWYoUClpZihmLmFjdGlvbil7dmFyIFQ9XCJjb2xvcjogXCIrZi5hY3Rpb24oUykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltQXShcIiVjIGFjdGlvbiAgICBcIixULFMpfWVsc2UgcltQXShcImFjdGlvbiAgICBcIixTKTtpZih5JiZDKWlmKGYuZXJyb3Ipe3ZhciBNPVwiY29sb3I6IFwiK2YuZXJyb3IoeSxoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCI7cltDXShcIiVjIGVycm9yICAgICBcIixNLHkpfWVsc2UgcltDXShcImVycm9yICAgICBcIix5KTtpZihGKWlmKGYubmV4dFN0YXRlKXt2YXIgXz1cImNvbG9yOiBcIitmLm5leHRTdGF0ZSh3KStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW0ZdKFwiJWMgbmV4dCBzdGF0ZVwiLF8sdyl9ZWxzZSByW0ZdKFwibmV4dCBzdGF0ZVwiLHcpO2wmJmIoaCx3LHIsayk7dHJ5e3IuZ3JvdXBFbmQoKX1jYXRjaChlKXtyLmxvZyhcIuKAlOKAlCBsb2cgZW5kIOKAlOKAlFwiKX19KX1mdW5jdGlvbiBTKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9T2JqZWN0LmFzc2lnbih7fSxMLGUpLHI9dC5sb2dnZXIsbj10LnN0YXRlVHJhbnNmb3JtZXIsbz10LmVycm9yVHJhbnNmb3JtZXIsaT10LnByZWRpY2F0ZSxhPXQubG9nRXJyb3JzLGY9dC5kaWZmUHJlZGljYXRlO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiByKXJldHVybiBmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGUodCl9fX07aWYoZS5nZXRTdGF0ZSYmZS5kaXNwYXRjaClyZXR1cm4gY29uc29sZS5lcnJvcihcIltyZWR1eC1sb2dnZXJdIHJlZHV4LWxvZ2dlciBub3QgaW5zdGFsbGVkLiBNYWtlIHN1cmUgdG8gcGFzcyBsb2dnZXIgaW5zdGFuY2UgYXMgbWlkZGxld2FyZTpcXG4vLyBMb2dnZXIgd2l0aCBkZWZhdWx0IG9wdGlvbnNcXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdyZWR1eC1sb2dnZXInXFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG4vLyBPciB5b3UgY2FuIGNyZWF0ZSB5b3VyIG93biBsb2dnZXIgd2l0aCBjdXN0b20gb3B0aW9ucyBodHRwOi8vYml0Lmx5L3JlZHV4LWxvZ2dlci1vcHRpb25zXFxuaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICdyZWR1eC1sb2dnZXInXFxuY29uc3QgbG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcXG4gIC8vIC4uLm9wdGlvbnNcXG59KTtcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcblwiKSxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGUodCl9fX07dmFyIHU9W107cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciByPWUuZ2V0U3RhdGU7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbihsKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBpJiYhaShyLGwpKXJldHVybiBlKGwpO3ZhciBjPXt9O3UucHVzaChjKSxjLnN0YXJ0ZWQ9Ty5ub3coKSxjLnN0YXJ0ZWRUaW1lPW5ldyBEYXRlLGMucHJldlN0YXRlPW4ocigpKSxjLmFjdGlvbj1sO3ZhciBzPXZvaWQgMDtpZihhKXRyeXtzPWUobCl9Y2F0Y2goZSl7Yy5lcnJvcj1vKGUpfWVsc2Ugcz1lKGwpO2MudG9vaz1PLm5vdygpLWMuc3RhcnRlZCxjLm5leHRTdGF0ZT1uKHIoKSk7dmFyIGQ9dC5kaWZmJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBmP2YocixsKTp0LmRpZmY7aWYoeCh1LE9iamVjdC5hc3NpZ24oe30sdCx7ZGlmZjpkfSkpLHUubGVuZ3RoPTAsYy5lcnJvcil0aHJvdyBjLmVycm9yO3JldHVybiBzfX19fXZhciBrLGosRT1mdW5jdGlvbihlLHQpe3JldHVybiBuZXcgQXJyYXkodCsxKS5qb2luKGUpfSxBPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIEUoXCIwXCIsdC1lLnRvU3RyaW5nKCkubGVuZ3RoKStlfSxEPWZ1bmN0aW9uKGUpe3JldHVybiBBKGUuZ2V0SG91cnMoKSwyKStcIjpcIitBKGUuZ2V0TWludXRlcygpLDIpK1wiOlwiK0EoZS5nZXRTZWNvbmRzKCksMikrXCIuXCIrQShlLmdldE1pbGxpc2Vjb25kcygpLDMpfSxPPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBwZXJmb3JtYW5jZSYmbnVsbCE9PXBlcmZvcm1hbmNlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBwZXJmb3JtYW5jZS5ub3c/cGVyZm9ybWFuY2U6RGF0ZSxOPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJmUuY29uc3RydWN0b3I9PT1TeW1ib2wmJmUhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIGV9LFA9ZnVuY3Rpb24oZSl7aWYoQXJyYXkuaXNBcnJheShlKSl7Zm9yKHZhciB0PTAscj1BcnJheShlLmxlbmd0aCk7dDxlLmxlbmd0aDt0Kyspclt0XT1lW3RdO3JldHVybiByfXJldHVybiBBcnJheS5mcm9tKGUpfSxDPVtdO2s9XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZ2xvYmFsP1widW5kZWZpbmVkXCI6TihnbG9iYWwpKSYmZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp7fSxqPWsuRGVlcERpZmYsaiYmQy5wdXNoKGZ1bmN0aW9uKCl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGomJmsuRGVlcERpZmY9PT1jJiYoay5EZWVwRGlmZj1qLGo9dm9pZCAwKX0pLHQobixyKSx0KG8sciksdChpLHIpLHQoYSxyKSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjLHtkaWZmOnt2YWx1ZTpjLGVudW1lcmFibGU6ITB9LG9ic2VydmFibGVEaWZmOnt2YWx1ZTpsLGVudW1lcmFibGU6ITB9LGFwcGx5RGlmZjp7dmFsdWU6aCxlbnVtZXJhYmxlOiEwfSxhcHBseUNoYW5nZTp7dmFsdWU6ZCxlbnVtZXJhYmxlOiEwfSxyZXZlcnRDaGFuZ2U6e3ZhbHVlOmcsZW51bWVyYWJsZTohMH0saXNDb25mbGljdDp7dmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2Ygan0sZW51bWVyYWJsZTohMH0sbm9Db25mbGljdDp7dmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gQyYmKEMuZm9yRWFjaChmdW5jdGlvbihlKXtlKCl9KSxDPW51bGwpLGN9LGVudW1lcmFibGU6ITB9fSk7dmFyIEY9e0U6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJDSEFOR0VEOlwifSxOOntjb2xvcjpcIiM0Q0FGNTBcIix0ZXh0OlwiQURERUQ6XCJ9LEQ6e2NvbG9yOlwiI0Y0NDMzNlwiLHRleHQ6XCJERUxFVEVEOlwifSxBOntjb2xvcjpcIiMyMTk2RjNcIix0ZXh0OlwiQVJSQVk6XCJ9fSxMPXtsZXZlbDpcImxvZ1wiLGxvZ2dlcjpjb25zb2xlLGxvZ0Vycm9yczohMCxjb2xsYXBzZWQ6dm9pZCAwLHByZWRpY2F0ZTp2b2lkIDAsZHVyYXRpb246ITEsdGltZXN0YW1wOiEwLHN0YXRlVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGFjdGlvblRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxlcnJvclRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxjb2xvcnM6e3RpdGxlOmZ1bmN0aW9uKCl7cmV0dXJuXCJpbmhlcml0XCJ9LHByZXZTdGF0ZTpmdW5jdGlvbigpe3JldHVyblwiIzlFOUU5RVwifSxhY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5cIiMwM0E5RjRcIn0sbmV4dFN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjNENBRjUwXCJ9LGVycm9yOmZ1bmN0aW9uKCl7cmV0dXJuXCIjRjIwNDA0XCJ9fSxkaWZmOiExLGRpZmZQcmVkaWNhdGU6dm9pZCAwLHRyYW5zZm9ybWVyOnZvaWQgMH0sVD1mdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PWUuZGlzcGF0Y2gscj1lLmdldFN0YXRlO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHI/UygpKHtkaXNwYXRjaDp0LGdldFN0YXRlOnJ9KTp2b2lkIGNvbnNvbGUuZXJyb3IoXCJcXG5bcmVkdXgtbG9nZ2VyIHYzXSBCUkVBS0lORyBDSEFOR0VcXG5bcmVkdXgtbG9nZ2VyIHYzXSBTaW5jZSAzLjAuMCByZWR1eC1sb2dnZXIgZXhwb3J0cyBieSBkZWZhdWx0IGxvZ2dlciB3aXRoIGRlZmF1bHQgc2V0dGluZ3MuXFxuW3JlZHV4LWxvZ2dlciB2M10gQ2hhbmdlXFxuW3JlZHV4LWxvZ2dlciB2M10gaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICdyZWR1eC1sb2dnZXInXFxuW3JlZHV4LWxvZ2dlciB2M10gdG9cXG5bcmVkdXgtbG9nZ2VyIHYzXSBpbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICdyZWR1eC1sb2dnZXInXFxuXCIpfTtlLmRlZmF1bHRzPUwsZS5jcmVhdGVMb2dnZXI9UyxlLmxvZ2dlcj1ULGUuZGVmYXVsdD1ULE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpMThuKHN0YXRlPXtcbiAgdGV4dDoge1xuICAgIGdldChrZXksIC4uLmFyZ3Mpe1xuICAgICAgbGV0IHRleHQgPSBnZXRMb2NhbGVUZXh0KGtleSwgYXJncyk7XG4gICAgICBpZiAodGV4dCl7XG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKS5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH0sXG4gIHRpbWU6IHtcbiAgICBmb3JtYXQoZGF0ZT1uZXcgRGF0ZSgpLCBmb3JtYXQ9XCJMXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfSxcbiAgICBmcm9tTm93KGRhdGU9bmV3IERhdGUoKSl7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5mcm9tTm93KCk7XG4gICAgfSxcbiAgICBzdWJ0cmFjdChkYXRlPW5ldyBEYXRlKCksIGlucHV0PTEsIHZhbHVlPVwiZGF5c1wiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLnN1YnRyYWN0KGlucHV0LCB2YWx1ZSkuY2FsZW5kYXIoKTtcbiAgICB9LFxuICAgIGFkZChkYXRlPW5ldyBEYXRlKCksIGlucHV0PTEsIHZhbHVlPVwiZGF5c1wiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmFkZChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfVxuICB9XG59LCBhY3Rpb24pe1xuICByZXR1cm4gc3RhdGU7XG59IiwiLy9UT0RPIHRoaXMgcmVkdWNlciB1c2VzIHRoZSBhcGkgdGhhdCBpbnRlcmFjdHMgd2l0aCB0aGUgRE9NIGluIG9yZGVyIHRvXG4vL3JldHJpZXZlIGRhdGEsIHBsZWFzZSBmaXggaW4gbmV4dCB2ZXJzaW9uc1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2NhbGVzKHN0YXRlPXtcbiAgYXZhbGlhYmxlOiAkLm1ha2VBcnJheSgkKFwiI2xhbmd1YWdlLXBpY2tlciBhXCIpLm1hcCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICQoZWxlbWVudCkudGV4dCgpLnRyaW0oKSxcbiAgICAgIGxvY2FsZTogJChlbGVtZW50KS5kYXRhKCdsb2NhbGUnKVxuICAgIH1cbiAgfSkpLFxuICBjdXJyZW50OiAkKFwiI2xvY2FsZVwiKS50ZXh0KClcbn0sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9MT0NBTEUnKXtcbiAgICAkKCcjbGFuZ3VhZ2UtcGlja2VyIGFbZGF0YS1sb2NhbGU9XCInICsgYWN0aW9uLnBheWxvYWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtjdXJyZW50OiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RpZmljYXRpb25zKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBRERfTk9USUZJQ0FUSU9OJykge1xuICAgIHZhciBpZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHN0YXRlLmNvbmNhdChPYmplY3QuYXNzaWduKHtpZDogaWR9LCBhY3Rpb24ucGF5bG9hZCkpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnSElERV9OT1RJRklDQVRJT04nKSB7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiBlbGVtZW50LmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiLy9UaGlzIG9uZSBhbHNvIHVzZXMgYSBoYWNrIHRvIGFjY2VzcyB0aGUgZGF0YSBpbiB0aGUgZG9tXG4vL3BsZWFzZSByZXBsYWNlIGl0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9jZWR1cmVcbi8vMS4gQ3JlYXRlIGEgcmVzdCBlbmRwb2ludCB0byBnZXQgdGhlIHBlcm1pc3Npb25zIGxpc3Rcbi8vMi4gaW4gdGhlIG1haW4gZmlsZSBnYXRoZXIgdGhvc2UgcGVybWlzc2lvbnMuLi4gZXRjLi4uLCBlZy4gaW5kZXguanMgbWFrZSBhIGNhbGxcbi8vMy4gZGlzcGF0Y2ggdGhlIGFjdGlvbiB0byB0aGlzIHNhbWUgcmVkdWNlciBhbmQgZ2F0aGVyIHRoZSBhY3Rpb24gaGVyZVxuLy80LiBpdCB3b3JrcyA6RFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGF0dXMoc3RhdGU9e1xuICBsb2dnZWRJbjogISFNVUlLS1VfTE9HR0VEX1VTRVJfSUQsXG4gIHVzZXJJZDogTVVJS0tVX0xPR0dFRF9VU0VSX0lELFxuICBwZXJtaXNzaW9uczogTVVJS0tVX1BFUk1JU1NJT05TLFxuICBjb250ZXh0UGF0aDogQ09OVEVYVFBBVEhcbn0sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gXCJMT0dPVVRcIil7XG4gICAgJCgnI2xvZ291dCcpLmNsaWNrKCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJpbXBvcnQgbm90aWZpY2F0aW9ucyBmcm9tICcuL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgbG9jYWxlcyBmcm9tICcuL2Jhc2UvbG9jYWxlcyc7XG5pbXBvcnQgc3RhdHVzIGZyb20gJy4vYmFzZS9zdGF0dXMnO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi9iYXNlL2kxOG4nO1xuaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4JztcblxuZXhwb3J0IGRlZmF1bHQgY29tYmluZVJlZHVjZXJzKHtcbiAgbm90aWZpY2F0aW9ucyxcbiAgaTE4bixcbiAgbG9jYWxlcyxcbiAgc3RhdHVzXG59KTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11aWtrdVdlYnNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKHN0b3JlLCBsaXN0ZW5lcnM9W10sIG9wdGlvbnM9e1xuICAgIHJlY29ubmVjdEludGVydmFsOiAyMDAsXG4gICAgcGluZ1RpbWVTdGVwOiAxMDAwLFxuICAgIHBpbmdUaW1lb3V0OiAxMDAwMFxuICB9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmxpc3RlbmVycyA9IGxpc3RlbmVycztcbiAgICBcbiAgICB0aGlzLnRpY2tldCA9IG51bGw7XG4gICAgdGhpcy53ZWJTb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuc29ja2V0T3BlbiA9IGZhbHNlO1xuICAgIHRoaXMubWVzc2FnZXNQZW5kaW5nID0gW107XG4gICAgdGhpcy5waW5nSGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICBcbiAgICB0aGlzLmdldFRpY2tldCgodGlja2V0KT0+IHtcbiAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICB0aGlzLm9wZW5XZWJTb2NrZXQoKTtcbiAgICAgICAgdGhpcy5zdGFydFBpbmdpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGJlY2F1c2UgdGlja2V0IHdhcyBtaXNzaW5nXCIsICdlcnJvcicpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbihcImJlZm9yZXVubG9hZFwiLCB0aGlzLm9uQmVmb3JlV2luZG93VW5sb2FkLmJpbmQodGhpcykpO1xuICB9XG4gIHNlbmRNZXNzYWdlKGV2ZW50VHlwZSwgZGF0YSl7XG4gICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICBldmVudFR5cGUsXG4gICAgICBkYXRhXG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnNvY2tldE9wZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMud2ViU29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZy5wdXNoKHtcbiAgICAgICAgICBldmVudFR5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZy5wdXNoKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuICBcbiAgdHJpZ2dlcihldmVudCwgZGF0YT1udWxsKXtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICd0eXBlJzogJ1dFQlNPQ0tFVF9FVkVOVCcsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGRhdGFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBpZiAodGhpcy5saXN0ZW5lcnNbZXZlbnRdKXtcbiAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudF0gaW5zdGFuY2VvZiBBcnJheSA/IHRoaXMubGlzdGVuZXJzW2V2ZW50XSA6IHRoaXMubGlzdGVuZXJzW2V2ZW50XS5hY3Rpb25zO1xuICAgICAgaWYgKGxpc3RlbmVycyl7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycyhkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGFjdGlvbiBvZiBsaXN0ZW5lcnMpe1xuICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24oKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGV0IG90aGVyTGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnRdLmNhbGxiYWNrcztcbiAgICAgIGlmIChvdGhlckxpc3RlbmVycyl7XG4gICAgICAgIGZvciAoY2FsbGJhY2sgb2Ygb3RoZXJMaXN0ZW5lcnMpe1xuICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRUaWNrZXQoY2FsbGJhY2spIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHRoaXMudGlja2V0KSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYSB0aWNrZXQsIHNvIHdlIG5lZWQgdG8gdmFsaWRhdGUgaXQgYmVmb3JlIHVzaW5nIGl0XG4gICAgICAgIG1BcGkoKS53ZWJzb2NrZXQuY2FjaGVDbGVhcigpLnRpY2tldC5jaGVjay5yZWFkKHRoaXMudGlja2V0KS5jYWxsYmFjaygkLnByb3h5KGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgLy8gVGlja2V0IGRpZCBub3QgcGFzcyB2YWxpZGF0aW9uLCBzbyB3ZSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGlja2V0KCQucHJveHkoZnVuY3Rpb24gKHRpY2tldCkge1xuICAgICAgICAgICAgICB0aGlzLnRpY2tldCA9IHRpY2tldDtcbiAgICAgICAgICAgICAgY2FsbGJhY2sodGlja2V0KTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGlja2V0IHBhc3NlZCB2YWxpZGF0aW9uLCBzbyB3ZSB1c2UgaXRcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMudGlja2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgdGlja2V0XG4gICAgICAgIHRoaXMuY3JlYXRlVGlja2V0KCh0aWNrZXQpPT57XG4gICAgICAgICAgdGhpcy50aWNrZXQgPSB0aWNrZXQ7XG4gICAgICAgICAgY2FsbGJhY2sodGlja2V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJUaWNrZXQgY3JlYXRpb24gZmFpbGVkIG9uIGFuIGludGVybmFsIGVycm9yXCIsICdlcnJvcicpKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNyZWF0ZVRpY2tldChjYWxsYmFjaykge1xuICAgIG1BcGkoKS53ZWJzb2NrZXQudGlja2V0LmNyZWF0ZSgpXG4gICAgICAuY2FsbGJhY2soKGVyciwgdGlja2V0KT0+e1xuICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgIGNhbGxiYWNrKHRpY2tldC50aWNrZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IGNyZWF0ZSBXZWJTb2NrZXQgdGlja2V0XCIsICdlcnJvcicpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0Q29ubmVjdGVkKCkge1xuICAgIHRoaXMuc29ja2V0T3BlbiA9IHRydWU7XG4gICAgdGhpcy50cmlnZ2VyKFwid2ViU29ja2V0Q29ubmVjdGVkXCIpOyBcbiAgICBcbiAgICB3aGlsZSAodGhpcy5zb2NrZXRPcGVuICYmIHRoaXMubWVzc2FnZXNQZW5kaW5nLmxlbmd0aCkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VzUGVuZGluZy5zaGlmdCgpO1xuICAgICAgdGhpcy5zZW5kTWVzc2FnZShtZXNzYWdlLmV2ZW50VHlwZSwgbWVzc2FnZS5kYXRhKTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0RXJyb3IoKSB7XG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRDbG9zZSgpIHtcbiAgICB0aGlzLnRyaWdnZXIoXCJ3ZWJTb2NrZXREaXNjb25uZWN0ZWRcIik7IFxuICAgIHRoaXMucmVjb25uZWN0KCk7XG4gIH1cbiAgXG4gIG9wZW5XZWJTb2NrZXQoKSB7XG4gICAgbGV0IGhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICBsZXQgc2VjdXJlID0gbG9jYXRpb24ucHJvdG9jb2wgPT0gJ2h0dHBzOic7XG4gICAgdGhpcy53ZWJTb2NrZXQgPSB0aGlzLmNyZWF0ZVdlYlNvY2tldCgoc2VjdXJlID8gJ3dzczovLycgOiAnd3M6Ly8nKSArIGhvc3QgKyAnL3dzL3NvY2tldC8nICsgdGhpcy50aWNrZXQpO1xuICAgIFxuICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gdGhpcy5vbldlYlNvY2tldE1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSB0aGlzLm9uV2ViU29ja2V0RXJyb3IuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSB0aGlzLm9uV2ViU29ja2V0Q2xvc2UuYmluZCh0aGlzKTtcbiAgICAgIHN3aXRjaCAodGhpcy53ZWJTb2NrZXQucmVhZHlTdGF0ZSkge1xuICAgICAgICBjYXNlIHRoaXMud2ViU29ja2V0LkNPTk5FQ1RJTkc6XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25vcGVuID0gdGhpcy5vbldlYlNvY2tldENvbm5lY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB0aGlzLndlYlNvY2tldC5PUEVOOlxuICAgICAgICAgIHRoaXMub25XZWJTb2NrZXRDb25uZWN0ZWQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJXZWJTb2NrZXQgY29ubmVjdGlvbiBmYWlsZWRcIiwgJ2Vycm9yJykpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3Qgb3BlbiBXZWJTb2NrZXQgY29ubmVjdGlvblwiLCAnZXJyb3InKSk7XG4gICAgfVxuICB9XG4gIFxuICBjcmVhdGVXZWJTb2NrZXQodXJsKSB7XG4gICAgaWYgKCh0eXBlb2Ygd2luZG93LldlYlNvY2tldCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cuTW96V2ViU29ja2V0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgTW96V2ViU29ja2V0KHVybCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIFxuICBzdGFydFBpbmdpbmcoKSB7XG4gICAgdGhpcy5waW5nSGFuZGxlID0gc2V0SW50ZXJ2YWwoKCk9PntcbiAgICAgIGlmICh0aGlzLnNvY2tldE9wZW4gPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5waW5naW5nKSB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoXCJwaW5nOnBpbmdcIiwge30pO1xuICAgICAgICB0aGlzLnBpbmdpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5waW5nVGltZSArPSB0aGlzLm9wdGlvbnMucGluZ1RpbWVTdGVwO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMucGluZ1RpbWUgPiB0aGlzLm9wdGlvbnMucGluZ1RpbWVvdXQpIHtcbiAgICAgICAgICBpZiAoY29uc29sZSkgY29uc29sZS5sb2coXCJwaW5nIGZhaWxlZCwgcmVjb25uZWN0aW5nLi4uXCIpO1xuICAgICAgICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucGluZ1RpbWUgPSAwO1xuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzLm9wdGlvbnMucGluZ1RpbWVTdGVwKTtcbiAgfVxuICBcbiAgcmVjb25uZWN0KCkge1xuICAgIHZhciB3YXNPcGVuID0gdGhpcy5zb2NrZXRPcGVuOyBcbiAgICB0aGlzLnNvY2tldE9wZW4gPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWNvbm5lY3RUaW1lb3V0KTtcbiAgICBcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIGlmICh3YXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBJZ25vcmUgZXhjZXB0aW9ucyByZWxhdGVkIHRvIGRpc2NhcmRpbmcgYSBXZWJTb2NrZXQgXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuZ2V0VGlja2V0KCh0aWNrZXQpPT57XG4gICAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICAgIHRoaXMub3BlbldlYlNvY2tldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGJlY2F1c2UgdGlja2V0IHdhcyBtaXNzaW5nXCIsICdlcnJvcicpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICB9LCB0aGlzLm9wdGlvbnMucmVjb25uZWN0SW50ZXJ2YWwpO1xuICB9XG4gIFxuICBvbldlYlNvY2tldE1lc3NhZ2UoZXZlbnQpIHtcbiAgICB2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgdmFyIGV2ZW50VHlwZSA9IG1lc3NhZ2UuZXZlbnRUeXBlO1xuICAgIFxuICAgIGlmIChldmVudFR5cGUgPT0gXCJwaW5nOnBvbmdcIikge1xuICAgICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmlnZ2VyKGV2ZW50VHlwZSwgbWVzc2FnZS5kYXRhKTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uQmVmb3JlV2luZG93VW5sb2FkKCkge1xuICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gKCk9Pnt9O1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9ICgpPT57fTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSAoKT0+e307XG4gICAgICBpZiAodGhpcy5zb2NrZXRPcGVuKSB7XG4gICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59Il19
