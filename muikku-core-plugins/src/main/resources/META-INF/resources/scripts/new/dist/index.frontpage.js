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

      var content = React.createElement(
        'div',
        null,
        this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.instructions'),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement(
          'form',
          { className: 'form' },
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'forgotpassword-email' },
              this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.email')
            ),
            React.createElement('input', { type: 'text', name: 'email' }),
            React.createElement('input', { type: 'submit', className: 'form-hidden', id: 'form-reset-password-submit' })
          )
        )
      );
      var footer = function footer(closeDialog) {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'form-reset-password-submit', className: 'button button-large' },
            _this2.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.sendButtonLabel')
          ),
          React.createElement(
            'a',
            { className: 'button button-large button-warn', onClick: closeDialog },
            _this2.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.cancelButtonLabel')
          )
        );
      };
      return React.createElement(
        _dialog2.default,
        { title: this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.title'),
          content: content, footer: footer, classNameExtension: this.props.classNameExtension },
        this.props.children
      );
    }
  }]);

  return ForgotPasswordDialog;
}(React.Component);

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

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordDialog);

},{"../general/dialog.jsx":10,"prop-types":29}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _link = require('../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

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
      return React.createElement(
        _link2.default,
        { className: this.props.classNameExtension + ' button ' + this.props.classNameExtension + '-button-login', onClick: this.login },
        React.createElement(
          'span',
          null,
          this.props.i18n.text.get('plugin.login.buttonLabel')
        )
      );
    }
  }]);

  return LoginButton;
}(React.Component);

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

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginButton);

},{"../general/link.jsx":13,"prop-types":29}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require("../../actions/base/notifications");

var _notifications2 = _interopRequireDefault(_notifications);

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
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        { className: "notification-queue" },
        React.createElement(
          "div",
          { className: "notification-queue-items" },
          this.props.notifications.map(function (notification) {
            return React.createElement(
              "div",
              { key: notification.id, className: "notification-queue-item notification-queue-item-" + notification.severity },
              React.createElement(
                "span",
                null,
                notification.message
              ),
              React.createElement("a", { className: "notification-queue-item-close", onClick: _this2.props.hideNotification.bind(_this2, notification) })
            );
          })
        )
      );
    }
  }]);

  return Notifications;
}(React.Component);

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return Redux.bindActionCreators(_notifications2.default, dispatch);
};

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Notifications);

},{"../../actions/base/notifications":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('./navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _feed = require('./feed.jsx');

var _feed2 = _interopRequireDefault(_feed);

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
      return React.createElement(
        'div',
        { className: 'embed embed-full' },
        React.createElement(_navbar2.default, null),
        React.createElement(
          'header',
          { className: 'frontpage hero' },
          React.createElement(
            'div',
            { className: 'hero-wrapper' },
            React.createElement(
              'div',
              { className: 'hero-item' },
              React.createElement(
                'div',
                { className: 'bubble bubble-responsive' },
                React.createElement(
                  'div',
                  { className: 'bubble-title' },
                  this.props.i18n.text.get('plugin.header.studentApplicationBubble.title')
                ),
                React.createElement(
                  'div',
                  { className: 'bubble-content' },
                  this.props.i18n.text.get('plugin.header.studentApplicationBubble.description')
                ),
                React.createElement(
                  'div',
                  { className: 'bubble-button-container' },
                  React.createElement(
                    'a',
                    { className: 'button button-soft button-dynamic-height button-warn button-focus' },
                    this.props.i18n.text.get('plugin.header.studentApplicationBubble.link')
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'hero-item' },
              React.createElement(
                'div',
                { className: 'frontpage container frontpage-container-muikku-logo' },
                React.createElement('img', { className: 'frontpage logo frontpage-logo-muikku-verkko', src: '/gfx/of-site-logo.png' }),
                React.createElement(
                  'div',
                  { className: 'frontpage text text-uppercase' },
                  React.createElement(
                    'div',
                    { className: 'frontpage text frontpage-text-muikku-author' },
                    this.props.i18n.text.get('plugin.header.site.author')
                  ),
                  React.createElement(
                    'div',
                    { className: 'frontpage text frontpage-text-muikku' },
                    'MUIKKU'
                  ),
                  React.createElement(
                    'div',
                    { className: 'frontpage text frontpage-text-verkko' },
                    'VERKKO'
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'frontpage text text-uppercase frontpage-text-muikku-description' },
                this.props.i18n.text.get('plugin.header.site.description')
              )
            ),
            React.createElement(
              'div',
              { className: 'hero-item' },
              React.createElement(
                'div',
                { className: 'bubble bubble-responsive' },
                React.createElement(
                  'div',
                  { className: 'bubble-title' },
                  this.props.i18n.text.get('plugin.header.openMaterialsBubble.title')
                ),
                React.createElement(
                  'div',
                  { className: 'bubble-content' },
                  this.props.i18n.text.get('plugin.header.openMaterialsBubble.description')
                ),
                React.createElement(
                  'div',
                  { className: 'bubble-button-container' },
                  React.createElement(
                    'a',
                    { className: 'button button-soft button-dynamic-height button-warn' },
                    this.props.i18n.text.get('plugin.header.openMaterialsBubble.link')
                  )
                )
              )
            )
          )
        ),
        React.createElement('div', { className: 'frontpage separator' }),
        React.createElement(
          'div',
          { className: 'screen-container' },
          React.createElement(
            'div',
            { className: 'screen-container-wrapper' },
            React.createElement(
              'section',
              { id: 'studying', className: 'frontpage container frontpage-container-section' },
              React.createElement(
                'h2',
                { className: 'frontpage text frontpage-text-title' },
                this.props.i18n.text.get('plugin.sectionTitle.studying')
              ),
              React.createElement(
                'div',
                { className: 'frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-studying' },
                React.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  React.createElement(
                    'div',
                    { className: 'frontpage card frontpage-card-studying' },
                    React.createElement('img', { className: 'card-image', src: '/gfx/kuva_nettilukio.png', alt: '',
                      title: '' }),
                    React.createElement(
                      'div',
                      { className: 'card-content' },
                      React.createElement(
                        'div',
                        { className: 'card-title' },
                        this.props.i18n.text.get('plugin.studying.nettilukio.title')
                      ),
                      React.createElement(
                        'div',
                        { className: 'card-text' },
                        this.props.i18n.text.get('plugin.studying.nettilukio.description')
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'card-footer' },
                      React.createElement(
                        'a',
                        { href: 'http://www.nettilukio.fi/nettilukio_esittely',
                          className: 'frontpage button frontpage-button-studying-readmore' },
                        this.props.i18n.text.get('plugin.studying.readMore.link'),
                        ' '
                      )
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  React.createElement(
                    'div',
                    { className: 'frontpage card frontpage-card-school' },
                    React.createElement('img', { className: 'card-image', src: '/gfx/kuva_nettiperuskoulu.png',
                      alt: '', title: '' }),
                    React.createElement(
                      'div',
                      { className: 'card-content' },
                      React.createElement(
                        'div',
                        { className: 'card-title' },
                        this.props.i18n.text.get('plugin.studying.nettiperuskoulu.title')
                      ),
                      React.createElement(
                        'div',
                        { className: 'card-text' },
                        this.props.i18n.text.get('plugin.studying.nettiperuskoulu.description')
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'card-footer' },
                      React.createElement(
                        'a',
                        { href: 'http://www.nettilukio.fi/esittely_nettipk',
                          className: 'frontpage button frontpage-button-school-readmore' },
                        this.props.i18n.text.get('plugin.studying.readMore.link'),
                        ' '
                      )
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  React.createElement(
                    'div',
                    { className: 'frontpage card frontpage-card-courses' },
                    React.createElement('img', { className: 'card-image', src: '/gfx/kuva_aineopiskelu.png',
                      alt: '', title: '' }),
                    React.createElement(
                      'div',
                      { className: 'card-content' },
                      React.createElement(
                        'div',
                        { className: 'card-title' },
                        this.props.i18n.text.get('plugin.studying.aineopiskelu.title')
                      ),
                      React.createElement(
                        'div',
                        { className: 'card-text' },
                        this.props.i18n.text.get('plugin.studying.aineopiskelu.description')
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'card-footer' },
                      React.createElement(
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
            React.createElement(
              'section',
              { id: 'videos', className: 'frontpage container frontpage-container-section' },
              React.createElement(
                'div',
                { className: 'carousel' },
                React.createElement(
                  'div',
                  { className: 'carousel-item' },
                  React.createElement(
                    'div',
                    { className: 'carousel-video' },
                    React.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/OD5Oj50vyh0?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'carousel-item', style: { display: "none" } },
                  React.createElement(
                    'div',
                    { className: 'carousel-video' },
                    React.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'carousel-item', style: { display: "none" } },
                  React.createElement(
                    'div',
                    { className: 'carousel-video' },
                    React.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/EbJnWIyOJNg?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'carousel-item', style: { display: "none" } },
                  React.createElement(
                    'div',
                    { className: 'carousel-video' },
                    React.createElement('iframe', { width: '1280', height: '720',
                      src: 'https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&showinfo=0',
                      style: { border: 0, allowfullscreen: "allowfullscreen" } })
                  )
                )
              ),
              React.createElement('div', { className: 'carousel-controls' })
            ),
            React.createElement(
              'section',
              { id: 'news', className: 'frontpage container frontpage-container-section' },
              React.createElement(
                'h2',
                { className: 'frontpage text frontpage-text-title' },
                this.props.i18n.text.get('plugin.sectionTitle.news')
              ),
              React.createElement(
                'div',
                { className: 'frontpage ordered-container frontpage-ordered-container-news' },
                React.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  React.createElement(
                    'div',
                    { className: 'frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-news-subcontainer' },
                    React.createElement(
                      'div',
                      { className: 'ordered-container-item' },
                      React.createElement(
                        'div',
                        { className: 'card' },
                        React.createElement(
                          'div',
                          { className: 'card-content' },
                          React.createElement(
                            'h2',
                            { className: 'card-title' },
                            this.props.i18n.text.get('plugin.frontpageBoxTitle.events')
                          ),
                          React.createElement(
                            'div',
                            { className: 'frontpage-events-container' },
                            React.createElement(_feed2.default, { queryOptions: { numItems: 4, order: "ASCENDING" }, feedReadTarget: 'ooevents' })
                          )
                        )
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'ordered-container-item' },
                      React.createElement(
                        'div',
                        { className: 'card' },
                        React.createElement(
                          'div',
                          { className: 'card-content' },
                          React.createElement(
                            'h2',
                            { className: 'card-title' },
                            this.props.i18n.text.get('plugin.frontpageBoxTitle.news')
                          ),
                          React.createElement(
                            'div',
                            { className: 'frontpage-news-container' },
                            React.createElement(_feed2.default, { queryOptions: { numItems: 5 }, feedReadTarget: 'oonews' })
                          )
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'ordered-container-item' },
                  React.createElement(
                    'div',
                    { className: 'frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-news-subcontainer' },
                    React.createElement(
                      'div',
                      { className: 'ordered-container-item frontpage-card-container' },
                      React.createElement(
                        'div',
                        { className: 'card' },
                        React.createElement(
                          'div',
                          { className: 'carousel' },
                          React.createElement(
                            'div',
                            { className: 'carousel-item' },
                            React.createElement('img', { className: 'card-image', src: '/gfx/kuva1.jpg', alt: '', title: '' }),
                            React.createElement(
                              'div',
                              { className: 'card-content' },
                              React.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image1')
                              )
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            React.createElement('img', { className: 'card-image', src: '/gfx/kuva2.jpg', alt: '',
                              title: '' }),
                            React.createElement(
                              'div',
                              { className: 'card-content' },
                              React.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image2')
                              )
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            React.createElement('img', { className: 'card-image', src: '/gfx/kuva3.jpg', alt: '', title: '' }),
                            React.createElement(
                              'div',
                              { className: 'card-content' },
                              React.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image3')
                              )
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            React.createElement('img', { className: 'card-image', src: '/gfx/kuva4.jpg', alt: '',
                              title: '' }),
                            React.createElement(
                              'div',
                              { className: 'card-content' },
                              React.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image4')
                              )
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'carousel-item', style: { display: "none" } },
                            React.createElement('img', { className: 'card-image', src: '/gfx/kuva5.jpg', alt: '',
                              title: '' }),
                            React.createElement(
                              'div',
                              { className: 'card-content' },
                              React.createElement(
                                'div',
                                { className: 'card-text' },
                                this.props.i18n.text.get('plugin.images.description.image5')
                              )
                            )
                          )
                        ),
                        React.createElement('div', { className: 'carousel-controls' })
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'ordered-container-item frontpage-card-container' },
                      React.createElement(
                        'div',
                        { className: 'card' },
                        React.createElement(
                          'div',
                          { className: 'card-content' },
                          React.createElement(
                            'h2',
                            { className: 'card-title' },
                            this.props.i18n.text.get('plugin.frontpageBoxTitle.blogs')
                          ),
                          React.createElement(
                            'div',
                            { className: 'frontpage-blogs-container' },
                            React.createElement(_feed2.default, { queryOptions: { numItems: 6 },
                              feedReadTarget: 'eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia' })
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'section',
              { id: 'organization', className: 'frontpage container frontpage-container-section frontpage-card-container' },
              React.createElement(
                'div',
                { className: 'frontpage card frontpage-card-otavan-opisto' },
                React.createElement(
                  'div',
                  { className: 'frontpage ordered-container frontpage-ordered-container-otavan-opisto-info' },
                  React.createElement(
                    'div',
                    { className: 'ordered-container-item frontpage-ordered-container-item-otavan-opisto-social-media' },
                    React.createElement(
                      'div',
                      { className: 'frontpage container frontpage-container-otavan-opisto-social-media' },
                      React.createElement(
                        'h2',
                        { className: 'frontpage text text-uppercase frontpage-text-otavan-opisto-info-title' },
                        this.props.i18n.text.get('plugin.organization.some.title')
                      ),
                      React.createElement('a', { className: 'frontpage button-social icon icon-some-facebook', href: 'https://www.facebook.com/otavanopisto', target: 'top' }),
                      React.createElement('a', { className: 'frontpage button-social icon icon-some-twitter', href: 'https://twitter.com/OtavanOpisto', target: 'top' }),
                      React.createElement('a', { className: 'frontpage button-social icon icon-some-instagram', href: 'https://www.instagram.com/otavanopisto/', target: 'top' }),
                      React.createElement('a', { className: 'frontpage button-social icon icon-some-pinterest', href: 'https://fi.pinterest.com/otavanopisto/', target: 'top' }),
                      React.createElement('a', { className: 'frontpage button-social icon icon-some-linkedin', href: 'https://www.linkedin.com/company/106028', target: 'top' })
                    ),
                    React.createElement(
                      'div',
                      { className: 'frontpage container frontpage-container-otavan-opisto-description' },
                      React.createElement('div', { className: 'frontpage text text-multiparagraph frontpage-text-otavan-opisto-info-description',
                        dangerouslySetInnerHTML: { __html: this.props.i18n.text.get('plugin.organization.description') } }),
                      React.createElement(
                        'a',
                        { href: 'http://www.otavanopisto.fi', target: 'top', className: 'frontpage button frontpage-button-website' },
                        'www.otavanopisto.fi'
                      ),
                      React.createElement('br', null),
                      React.createElement(
                        'a',
                        { href: 'http://www.otavanopisto.fi/uutiskirje', target: 'top', className: 'frontpage button frontpage-button-newsletter' },
                        this.props.i18n.text.get('plugin.organization.newsletter.link')
                      )
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: 'ordered-container-item frontpage-ordered-container-item-otavan-opisto-logo' },
                    React.createElement('img', { src: '/gfx/of-organization-logo.jpg', alt: 'logo', title: 'logo' })
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          'footer',
          { className: 'frontpage footer', id: 'contact' },
          React.createElement(
            'div',
            { className: 'footer-container' },
            React.createElement(
              'div',
              { className: 'footer-item frontpage-footer-item-contact' },
              React.createElement(
                'h2',
                { className: 'frontpage text frontpage-text-contact-us' },
                this.props.i18n.text.get('plugin.footer.contact.title')
              ),
              React.createElement(
                'p',
                { className: 'frontpage text frontpage-text-contact-us-information' },
                React.createElement('span', { className: 'text-icon icon-location' }),
                React.createElement(
                  'b',
                  null,
                  this.props.i18n.text.get('plugin.footer.streetAddress.label')
                ),
                React.createElement(
                  'span',
                  null,
                  'Otavantie 2 B, 50670 Otava'
                )
              ),
              React.createElement(
                'p',
                { className: 'frontpage text frontpage-text-contact-us-information' },
                React.createElement('span', { className: 'text-icon icon-phone' }),
                React.createElement(
                  'b',
                  null,
                  this.props.i18n.text.get('plugin.footer.phoneNumber.label')
                ),
                React.createElement(
                  'span',
                  null,
                  '015 194\xA03552'
                )
              ),
              React.createElement(
                'p',
                { className: 'frontpage text frontpage-text-contact-us-information' },
                React.createElement('span', { className: 'text-icon icon-envelope' }),
                React.createElement(
                  'b',
                  null,
                  this.props.i18n.text.get('plugin.footer.emailAddress.label')
                ),
                React.createElement(
                  'span',
                  null,
                  'info@otavanopisto.fi'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'footer-item frontpage-footer-item-logos' },
              React.createElement('img', { src: '/gfx/alku_uudelle.jpg', alt: '', title: '', className: 'logo' }),
              React.createElement('img', { src: '/gfx/footer_logo.jpg', alt: '', title: '', className: 'logo' })
            )
          )
        )
      );
    }
  }]);

  return FrontpageBody;
}(React.Component);

function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FrontpageBody);

},{"./feed.jsx":8,"./navbar.jsx":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _feed = require('../general/feed.jsx');

var _feed2 = _interopRequireDefault(_feed);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
      return React.createElement(_feed2.default, { entries: this.state.entries });
    }
  }]);

  return FrontpageFeed;
}(React.Component);

FrontpageFeed.propTypes = {
  feedReadTarget: _propTypes2.default.string.isRequired,
  queryOptions: _propTypes2.default.object.isRequired
};
exports.default = FrontpageFeed;

},{"../general/feed.jsx":12,"prop-types":29}],9:[function(require,module,exports){
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
      return React.createElement(_navbar2.default, { classNameExtension: 'frontpage', navbarItems: [{
          classNameSuffix: "studying",
          item: React.createElement(
            _link2.default,
            { href: '#studying', className: 'link link-full' },
            React.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.studying')
            )
          )
        }, {
          classNameSuffix: "news",
          item: React.createElement(
            _link2.default,
            { href: '#news', className: 'link link-full' },
            React.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.news')
            )
          )
        }, {
          classNameSuffix: "otavan-opisto",
          item: React.createElement(
            _link2.default,
            { href: '#organization', className: 'link link-full' },
            React.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.otavanOpisto')
            )
          )
        }, {
          classNameSuffix: "contact",
          item: React.createElement(
            _link2.default,
            { href: '#contact', className: 'link link-full' },
            React.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.contact')
            )
          )
        }, {
          classNameSuffix: "open-materials",
          item: React.createElement(
            _link2.default,
            { href: '/coursepicker', className: 'link link-highlight link-full' },
            React.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.navigation.link.openMaterials')
            )
          )
        }], defaultOptions: [React.createElement(_loginButton2.default, { key: '0', classNameExtension: 'frontpage' }), React.createElement(
          _forgotPasswordDialog2.default,
          { key: '1', classNameExtension: 'frontpage' },
          React.createElement(
            _link2.default,
            { className: 'frontpage label label-dynamic-word-break label-clickable frontpage-label-forgot-password frontpage-interact-forgot-password' },
            React.createElement(
              'span',
              null,
              this.props.i18n.text.get('plugin.forgotpassword.forgotLink')
            )
          )
        )], menuItems: [React.createElement(
          _link2.default,
          { href: '#studying', className: 'link link-full' },
          React.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.studying')
          )
        ), React.createElement(
          _link2.default,
          { href: '#news', className: 'link link-full' },
          React.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.news')
          )
        ), React.createElement(
          _link2.default,
          { href: '#organization', className: 'link link-full' },
          React.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.otavanOpisto')
          )
        ), React.createElement(
          _link2.default,
          { href: '#contact', className: 'link link-full' },
          React.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.contact')
          )
        ), React.createElement(
          _link2.default,
          { href: '/coursepicker', className: 'link link-highlight link-full' },
          React.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.navigation.link.openMaterials')
          )
        )] });
    }
  }]);

  return FrontpageNavbar;
}(React.Component);

function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FrontpageNavbar);

},{"../base/forgot-password-dialog.jsx":4,"../base/login-button.jsx":5,"../general/link.jsx":13,"../general/navbar.jsx":14}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _portal = require('./portal.jsx');

var _portal2 = _interopRequireDefault(_portal);

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
      return React.createElement(
        _portal2.default,
        { ref: 'portal', openByClickOn: this.props.children, onOpen: this.onOpen, beforeClose: this.beforeClose, closeOnEsc: true },
        React.createElement(
          'div',
          { className: 'dialog ' + this.props.classNameExtension + '-dialog ' + (this.state.visible ? "visible" : ""), onClick: this.onOverlayClick },
          React.createElement(
            'div',
            { className: 'dialog-window' },
            React.createElement(
              'div',
              { className: 'dialog-header' },
              React.createElement(
                'div',
                { className: 'dialog-title' },
                this.props.title,
                React.createElement('span', { className: 'dialog-close icon icon-close', onClick: this.close })
              )
            ),
            React.createElement(
              'div',
              { className: 'dialog-content' },
              this.props.content
            ),
            React.createElement(
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
}(React.Component);

Dialog.propTypes = {
  children: _propTypes2.default.element.isRequired,
  title: _propTypes2.default.string.isRequired,
  classNameExtension: _propTypes2.default.string.isRequired,
  content: _propTypes2.default.element.isRequired,
  footer: _propTypes2.default.func.isRequired
};
exports.default = Dialog;

},{"./portal.jsx":18,"prop-types":29}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _portal = require('./portal.jsx');

var _portal2 = _interopRequireDefault(_portal);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

      return React.createElement(
        _portal2.default,
        { ref: 'portal', openByClickOn: React.cloneElement(this.props.children, { ref: "activator" }),
          closeOnEsc: true, closeOnOutsideClick: true, closeOnScroll: true, onOpen: this.onOpen, beforeClose: this.beforeClose },
        React.createElement(
          'div',
          { ref: 'dropdown',
            style: {
              top: this.state.top,
              left: this.state.left
            },
            className: this.props.classNameExtension + ' dropdown ' + this.props.classNameExtension + '-dropdown-' + this.props.classNameSuffix + ' ' + (this.state.visible ? "visible" : "") },
          React.createElement('span', { className: 'arrow', ref: 'arrow', style: { left: this.state.arrowLeft, right: this.state.arrowRight } }),
          React.createElement(
            'div',
            { className: 'dropdown-container' },
            this.props.items.map(function (item, index) {
              var element = typeof item === "function" ? item(_this2.close) : item;
              return React.createElement(
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
}(React.Component);

Dropdown.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired,
  classNameSuffix: _propTypes2.default.string.isRequired,
  children: _propTypes2.default.element.isRequired,
  items: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func])).isRequired
};
exports.default = Dropdown;

},{"./portal.jsx":18,"prop-types":29}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

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
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "ul",
        { className: "feed" },
        this.props.entries.map(function (entry, index) {
          return React.createElement(
            "li",
            { className: "feed-item" },
            React.createElement(
              "span",
              { className: "feed-item-description" },
              React.createElement(
                "a",
                { href: entry.link, target: "top" },
                entry.title
              ),
              entry.description
            ),
            React.createElement(
              "span",
              { className: "feed-item-date" },
              _this2.props.i18n.time.format(entry.publicationDate)
            )
          );
        })
      );
    }
  }]);

  return Feed;
}(React.Component);

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

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Feed);

},{"prop-types":29}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
      return React.createElement('a', _extends({}, this.props, {
        className: this.props.className + (this.state.active ? " active" : ""),
        onClick: this.onClick, onTouchStart: this.onTouchStart, onTouchEnd: this.onTouchEnd }));
    }
  }]);

  return Link;
}(React.Component);

exports.default = Link;

},{"prop-types":29}],14:[function(require,module,exports){
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

      return React.createElement(
        'div',
        null,
        React.createElement(
          'nav',
          { className: 'navbar ' + this.props.classNameExtension },
          React.createElement(
            'div',
            { className: 'navbar-wrapper' },
            React.createElement('div', { className: 'navbar-logo' }),
            React.createElement(
              'div',
              { className: 'navbar-items' },
              React.createElement(
                'ul',
                { className: 'navbar-items-container' },
                React.createElement(
                  'li',
                  { className: 'navbar-item ' + this.props.classNameExtension + '-navbar-item-menu-button' },
                  React.createElement(
                    'a',
                    { className: this.props.classNameExtension + ' link link-icon link-full', onClick: this.openMenu },
                    React.createElement('span', { className: 'icon icon-navicon' })
                  )
                ),
                this.props.navbarItems.map(function (item, index) {
                  if (!item) {
                    return null;
                  }
                  return React.createElement(
                    'li',
                    { key: index, className: 'navbar-item ' + _this2.props.classNameExtension + '-navbar-item-' + item.classNameSuffix },
                    item.item
                  );
                }).filter(function (item) {
                  return !!item;
                })
              )
            ),
            React.createElement(
              'div',
              { className: 'navbar-default-options' },
              React.createElement(
                'div',
                { className: 'navbar-default-options-container' },
                this.props.defaultOptions,
                React.createElement(_profileItem2.default, { classNameExtension: this.props.classNameExtension }),
                React.createElement(_languagePicker2.default, { classNameExtension: this.props.classNameExtension })
              )
            )
          )
        ),
        React.createElement(_menu2.default, { open: this.state.isMenuOpen, onClose: this.closeMenu, items: this.props.menuItems })
      );
    }
  }]);

  return Navbar;
}(React.Component);

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

},{"./navbar/language-picker.jsx":15,"./navbar/menu.jsx":16,"./navbar/profile-item.jsx":17,"prop-types":29}],15:[function(require,module,exports){
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

      return React.createElement(
        _dropdown2.default,
        { classNameExtension: this.props.classNameExtension, classNameSuffix: 'language-picker', items: this.props.locales.avaliable.map(function (locale) {
            return React.createElement(
              'a',
              { className: _this2.props.classNameExtension + ' link link-full ' + _this2.props.classNameExtension + '-link-language-picker', onClick: _this2.props.setLocale.bind(_this2, locale.locale) },
              React.createElement(
                'span',
                null,
                locale.name
              )
            );
          }) },
        React.createElement(
          'a',
          { className: this.props.classNameExtension + ' button-pill ' + this.props.classNameExtension + '-button-pill-language' },
          React.createElement(
            'span',
            null,
            this.props.locales.current
          )
        )
      );
    }
  }]);

  return LanguagePicker;
}(React.Component);

LanguagePicker.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    locales: state.locales
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return Redux.bindActionCreators(_locales2.default, dispatch);
};

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LanguagePicker);

},{"../../../actions/base/locales":1,"../dropdown.jsx":11,"prop-types":29}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _link = require('../link.jsx');

var _link2 = _interopRequireDefault(_link);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
      return React.createElement(
        'div',
        { className: 'menu ' + (this.state.displayed ? "displayed" : "") + ' ' + (this.state.visible ? "visible" : "") + ' ' + (this.state.dragging ? "dragging" : ""),
          onClick: this.closeByOverlay, onTouchStart: this.onTouchStart, onTouchMove: this.onTouchMove, onTouchEnd: this.onTouchEnd, ref: 'menu' },
        React.createElement(
          'div',
          { className: 'menu-container', ref: 'menuContainer', style: { left: this.state.drag } },
          React.createElement(
            'div',
            { className: 'menu-header' },
            React.createElement('div', { className: 'menu-logo' }),
            React.createElement(_link2.default, { className: 'menu-header-button-close icon icon-arrow-left' })
          ),
          React.createElement(
            'div',
            { className: 'menu-body' },
            React.createElement(
              'ul',
              { className: 'menu-items' },
              this.props.items.map(function (item, index) {
                if (!item) {
                  return null;
                }
                return React.createElement(
                  'li',
                  { className: 'menu-item', key: index },
                  item
                );
              })
            )
          )
        )
      );
    }
  }]);

  return Menu;
}(React.Component);

Menu.propTypes = {
  open: _propTypes2.default.bool.isRequired,
  onClose: _propTypes2.default.func.isRequired,
  items: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired
};
exports.default = Menu;

},{"../link.jsx":13,"prop-types":29}],17:[function(require,module,exports){
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
      return React.createElement(
        _dropdown2.default,
        { classNameExtension: this.props.classNameExtension, classNameSuffix: 'profile-menu', items: items.map(function (item) {
            return function (closeDropdown) {
              return React.createElement(
                _link2.default,
                _defineProperty({ href: '/profile',
                  className: _this2.props.classNameExtension + ' link link-full ' + _this2.props.classNameExtension + '-link-profile-menu',
                  onClick: function onClick() {
                    closeDropdown();item.onClick && item.onClick.apply(item, arguments);
                  } }, 'href', item.href),
                React.createElement('span', { className: 'icon icon-' + item.icon }),
                React.createElement(
                  'span',
                  null,
                  _this2.props.i18n.text.get(item.text)
                )
              );
            };
          }) },
        React.createElement(
          'a',
          { className: 'main-function button-pill main-function-button-pill-profile' },
          React.createElement(
            'object',
            { className: 'embbed embbed-full',
              data: '/rest/user/files/user/' + this.props.status.userId + '/identifier/profile-image-96',
              type: 'image/jpeg' },
            React.createElement('span', { className: 'icon icon-user' })
          )
        )
      );
    }
  }]);

  return ProfileItem;
}(React.Component);

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
  return Redux.bindActionCreators(_status2.default, dispatch);
};

exports.default = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ProfileItem);

},{"../../../actions/base/status":3,"../dropdown.jsx":11,"../link.jsx":13,"prop-types":29}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
          ReactDOM.unmountComponentAtNode(_this2.node);
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

      var root = ReactDOM.findDOMNode(this.portal);
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
        children = React.cloneElement(props.children, {
          closePortal: this.closePortal
        });
      }

      this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, children, this.node, this.props.onUpdate);

      if (isOpening) {
        this.props.onOpen(this.node);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.openByClickOn) {
        return React.cloneElement(this.props.openByClickOn, {
          onClick: this.handleWrapperClick
        });
      }
      return null;
    }
  }]);

  return Portal;
}(React.Component);

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

},{"prop-types":29}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require('../components/base/notifications.jsx');

var _notifications2 = _interopRequireDefault(_notifications);

var _body = require('../components/frontpage/body.jsx');

var _body2 = _interopRequireDefault(_body);

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
      return React.createElement(
        'div',
        { id: 'root' },
        React.createElement(_notifications2.default, null),
        React.createElement(_body2.default, null)
      );
    }
  }]);

  return IndexFrontpage;
}(React.Component);

exports.default = IndexFrontpage;

},{"../components/base/notifications.jsx":6,"../components/frontpage/body.jsx":7}],20:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.reduxLogger = e.reduxLogger || {});
}(undefined, function (e) {
  "use strict";
  function t(e, t) {
    e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } });
  }function r(e, t) {
    Object.defineProperty(this, "kind", { value: e, enumerable: !0 }), t && t.length && Object.defineProperty(this, "path", { value: t, enumerable: !0 });
  }function n(e, t, r) {
    n.super_.call(this, "E", e), Object.defineProperty(this, "lhs", { value: t, enumerable: !0 }), Object.defineProperty(this, "rhs", { value: r, enumerable: !0 });
  }function o(e, t) {
    o.super_.call(this, "N", e), Object.defineProperty(this, "rhs", { value: t, enumerable: !0 });
  }function i(e, t) {
    i.super_.call(this, "D", e), Object.defineProperty(this, "lhs", { value: t, enumerable: !0 });
  }function a(e, t, r) {
    a.super_.call(this, "A", e), Object.defineProperty(this, "index", { value: t, enumerable: !0 }), Object.defineProperty(this, "item", { value: r, enumerable: !0 });
  }function l(e, t, r) {
    var n = e.slice((r || t) + 1 || e.length);return e.length = t < 0 ? e.length + t : t, e.push.apply(e, n), e;
  }function c(e) {
    var t = void 0 === e ? "undefined" : N(e);return "object" !== t ? t : e === Math ? "math" : null === e ? "null" : Array.isArray(e) ? "array" : "[object Date]" === Object.prototype.toString.call(e) ? "date" : "function" == typeof e.toString && /^\/.*\//.test(e.toString()) ? "regexp" : "object";
  }function u(e, t, r, f, s, d, p) {
    s = s || [], p = p || [];var g = s.slice(0);if (void 0 !== d) {
      if (f) {
        if ("function" == typeof f && f(g, d)) return;if ("object" === (void 0 === f ? "undefined" : N(f))) {
          if (f.prefilter && f.prefilter(g, d)) return;if (f.normalize) {
            var h = f.normalize(g, d, e, t);h && (e = h[0], t = h[1]);
          }
        }
      }g.push(d);
    }"regexp" === c(e) && "regexp" === c(t) && (e = e.toString(), t = t.toString());var v = void 0 === e ? "undefined" : N(e),
        y = void 0 === t ? "undefined" : N(t),
        b = "undefined" !== v || p && p[p.length - 1].lhs && p[p.length - 1].lhs.hasOwnProperty(d),
        m = "undefined" !== y || p && p[p.length - 1].rhs && p[p.length - 1].rhs.hasOwnProperty(d);if (!b && m) r(new o(g, t));else if (!m && b) r(new i(g, e));else if (c(e) !== c(t)) r(new n(g, e, t));else if ("date" === c(e) && e - t != 0) r(new n(g, e, t));else if ("object" === v && null !== e && null !== t) {
      if (p.filter(function (t) {
        return t.lhs === e;
      }).length) e !== t && r(new n(g, e, t));else {
        if (p.push({ lhs: e, rhs: t }), Array.isArray(e)) {
          var w;e.length;for (w = 0; w < e.length; w++) {
            w >= t.length ? r(new a(g, w, new i(void 0, e[w]))) : u(e[w], t[w], r, f, g, w, p);
          }for (; w < t.length;) {
            r(new a(g, w, new o(void 0, t[w++])));
          }
        } else {
          var x = Object.keys(e),
              S = Object.keys(t);x.forEach(function (n, o) {
            var i = S.indexOf(n);i >= 0 ? (u(e[n], t[n], r, f, g, n, p), S = l(S, i)) : u(e[n], void 0, r, f, g, n, p);
          }), S.forEach(function (e) {
            u(void 0, t[e], r, f, g, e, p);
          });
        }p.length = p.length - 1;
      }
    } else e !== t && ("number" === v && isNaN(e) && isNaN(t) || r(new n(g, e, t)));
  }function f(e, t, r, n) {
    return n = n || [], u(e, t, function (e) {
      e && n.push(e);
    }, r), n.length ? n : void 0;
  }function s(e, t, r) {
    if (r.path && r.path.length) {
      var n,
          o = e[t],
          i = r.path.length - 1;for (n = 0; n < i; n++) {
        o = o[r.path[n]];
      }switch (r.kind) {case "A":
          s(o[r.path[n]], r.index, r.item);break;case "D":
          delete o[r.path[n]];break;case "E":case "N":
          o[r.path[n]] = r.rhs;}
    } else switch (r.kind) {case "A":
        s(e[t], r.index, r.item);break;case "D":
        e = l(e, t);break;case "E":case "N":
        e[t] = r.rhs;}return e;
  }function d(e, t, r) {
    if (e && t && r && r.kind) {
      for (var n = e, o = -1, i = r.path ? r.path.length - 1 : 0; ++o < i;) {
        void 0 === n[r.path[o]] && (n[r.path[o]] = "number" == typeof r.path[o] ? [] : {}), n = n[r.path[o]];
      }switch (r.kind) {case "A":
          s(r.path ? n[r.path[o]] : n, r.index, r.item);break;case "D":
          delete n[r.path[o]];break;case "E":case "N":
          n[r.path[o]] = r.rhs;}
    }
  }function p(e, t, r) {
    if (r.path && r.path.length) {
      var n,
          o = e[t],
          i = r.path.length - 1;for (n = 0; n < i; n++) {
        o = o[r.path[n]];
      }switch (r.kind) {case "A":
          p(o[r.path[n]], r.index, r.item);break;case "D":case "E":
          o[r.path[n]] = r.lhs;break;case "N":
          delete o[r.path[n]];}
    } else switch (r.kind) {case "A":
        p(e[t], r.index, r.item);break;case "D":case "E":
        e[t] = r.lhs;break;case "N":
        e = l(e, t);}return e;
  }function g(e, t, r) {
    if (e && t && r && r.kind) {
      var n,
          o,
          i = e;for (o = r.path.length - 1, n = 0; n < o; n++) {
        void 0 === i[r.path[n]] && (i[r.path[n]] = {}), i = i[r.path[n]];
      }switch (r.kind) {case "A":
          p(i[r.path[n]], r.index, r.item);break;case "D":case "E":
          i[r.path[n]] = r.lhs;break;case "N":
          delete i[r.path[n]];}
    }
  }function h(e, t, r) {
    if (e && t) {
      u(e, t, function (n) {
        r && !r(e, t, n) || d(e, t, n);
      });
    }
  }function v(e) {
    return "color: " + F[e].color + "; font-weight: bold";
  }function y(e) {
    var t = e.kind,
        r = e.path,
        n = e.lhs,
        o = e.rhs,
        i = e.index,
        a = e.item;switch (t) {case "E":
        return [r.join("."), n, "→", o];case "N":
        return [r.join("."), o];case "D":
        return [r.join(".")];case "A":
        return [r.join(".") + "[" + i + "]", a];default:
        return [];}
  }function b(e, t, r, n) {
    var o = f(e, t);try {
      n ? r.groupCollapsed("diff") : r.group("diff");
    } catch (e) {
      r.log("diff");
    }o ? o.forEach(function (e) {
      var t = e.kind,
          n = y(e);r.log.apply(r, ["%c " + F[t].text, v(t)].concat(P(n)));
    }) : r.log("—— no diff ——");try {
      r.groupEnd();
    } catch (e) {
      r.log("—— diff end —— ");
    }
  }function m(e, t, r, n) {
    switch (void 0 === e ? "undefined" : N(e)) {case "object":
        return "function" == typeof e[n] ? e[n].apply(e, P(r)) : e[n];case "function":
        return e(t);default:
        return e;}
  }function w(e) {
    var t = e.timestamp,
        r = e.duration;return function (e, n, o) {
      var i = ["action"];return i.push("%c" + String(e.type)), t && i.push("%c@ " + n), r && i.push("%c(in " + o.toFixed(2) + " ms)"), i.join(" ");
    };
  }function x(e, t) {
    var r = t.logger,
        n = t.actionTransformer,
        o = t.titleFormatter,
        i = void 0 === o ? w(t) : o,
        a = t.collapsed,
        l = t.colors,
        c = t.level,
        u = t.diff,
        f = void 0 === t.titleFormatter;e.forEach(function (o, s) {
      var d = o.started,
          p = o.startedTime,
          g = o.action,
          h = o.prevState,
          v = o.error,
          y = o.took,
          w = o.nextState,
          x = e[s + 1];x && (w = x.prevState, y = x.started - d);var S = n(g),
          j = "function" == typeof a ? a(function () {
        return w;
      }, g, o) : a,
          k = D(p),
          E = l.title ? "color: " + l.title(S) + ";" : "",
          A = ["color: gray; font-weight: lighter;"];A.push(E), t.timestamp && A.push("color: gray; font-weight: lighter;"), t.duration && A.push("color: gray; font-weight: lighter;");var O = i(S, k, y);try {
        j ? l.title && f ? r.groupCollapsed.apply(r, ["%c " + O].concat(A)) : r.groupCollapsed(O) : l.title && f ? r.group.apply(r, ["%c " + O].concat(A)) : r.group(O);
      } catch (e) {
        r.log(O);
      }var N = m(c, S, [h], "prevState"),
          P = m(c, S, [S], "action"),
          C = m(c, S, [v, h], "error"),
          F = m(c, S, [w], "nextState");if (N) if (l.prevState) {
        var L = "color: " + l.prevState(h) + "; font-weight: bold";r[N]("%c prev state", L, h);
      } else r[N]("prev state", h);if (P) if (l.action) {
        var T = "color: " + l.action(S) + "; font-weight: bold";r[P]("%c action    ", T, S);
      } else r[P]("action    ", S);if (v && C) if (l.error) {
        var M = "color: " + l.error(v, h) + "; font-weight: bold;";r[C]("%c error     ", M, v);
      } else r[C]("error     ", v);if (F) if (l.nextState) {
        var _ = "color: " + l.nextState(w) + "; font-weight: bold";r[F]("%c next state", _, w);
      } else r[F]("next state", w);u && b(h, w, r, j);try {
        r.groupEnd();
      } catch (e) {
        r.log("—— log end ——");
      }
    });
  }function S() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = Object.assign({}, L, e),
        r = t.logger,
        n = t.stateTransformer,
        o = t.errorTransformer,
        i = t.predicate,
        a = t.logErrors,
        l = t.diffPredicate;if (void 0 === r) return function () {
      return function (e) {
        return function (t) {
          return e(t);
        };
      };
    };if (e.getState && e.dispatch) return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport { createLogger } from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"), function () {
      return function (e) {
        return function (t) {
          return e(t);
        };
      };
    };var c = [];return function (e) {
      var r = e.getState;return function (e) {
        return function (u) {
          if ("function" == typeof i && !i(r, u)) return e(u);var f = {};c.push(f), f.started = O.now(), f.startedTime = new Date(), f.prevState = n(r()), f.action = u;var s = void 0;if (a) try {
            s = e(u);
          } catch (e) {
            f.error = o(e);
          } else s = e(u);f.took = O.now() - f.started, f.nextState = n(r());var d = t.diff && "function" == typeof l ? l(r, u) : t.diff;if (x(c, Object.assign({}, t, { diff: d })), c.length = 0, f.error) throw f.error;return s;
        };
      };
    };
  }var j,
      k,
      E = function E(e, t) {
    return new Array(t + 1).join(e);
  },
      A = function A(e, t) {
    return E("0", t - e.toString().length) + e;
  },
      D = function D(e) {
    return A(e.getHours(), 2) + ":" + A(e.getMinutes(), 2) + ":" + A(e.getSeconds(), 2) + "." + A(e.getMilliseconds(), 3);
  },
      O = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance : Date,
      N = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
    return typeof e === "undefined" ? "undefined" : _typeof(e);
  } : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
  },
      P = function P(e) {
    if (Array.isArray(e)) {
      for (var t = 0, r = Array(e.length); t < e.length; t++) {
        r[t] = e[t];
      }return r;
    }return Array.from(e);
  },
      C = [];j = "object" === ("undefined" == typeof global ? "undefined" : N(global)) && global ? global : "undefined" != typeof window ? window : {}, k = j.DeepDiff, k && C.push(function () {
    void 0 !== k && j.DeepDiff === f && (j.DeepDiff = k, k = void 0);
  }), t(n, r), t(o, r), t(i, r), t(a, r), Object.defineProperties(f, { diff: { value: f, enumerable: !0 }, observableDiff: { value: u, enumerable: !0 }, applyDiff: { value: h, enumerable: !0 }, applyChange: { value: d, enumerable: !0 }, revertChange: { value: g, enumerable: !0 }, isConflict: { value: function value() {
        return void 0 !== k;
      }, enumerable: !0 }, noConflict: { value: function value() {
        return C && (C.forEach(function (e) {
          e();
        }), C = null), f;
      }, enumerable: !0 } });var F = { E: { color: "#2196F3", text: "CHANGED:" }, N: { color: "#4CAF50", text: "ADDED:" }, D: { color: "#F44336", text: "DELETED:" }, A: { color: "#2196F3", text: "ARRAY:" } },
      L = { level: "log", logger: console, logErrors: !0, collapsed: void 0, predicate: void 0, duration: !1, timestamp: !0, stateTransformer: function stateTransformer(e) {
      return e;
    }, actionTransformer: function actionTransformer(e) {
      return e;
    }, errorTransformer: function errorTransformer(e) {
      return e;
    }, colors: { title: function title() {
        return "inherit";
      }, prevState: function prevState() {
        return "#9E9E9E";
      }, action: function action() {
        return "#03A9F4";
      }, nextState: function nextState() {
        return "#4CAF50";
      }, error: function error() {
        return "#F20404";
      } }, diff: !1, diffPredicate: void 0, transformer: void 0 },
      T = function T() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = e.dispatch,
        r = e.getState;if ("function" == typeof t || "function" == typeof r) return S()({ dispatch: t, getState: r });console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n");
  };e.defaults = L, e.createLogger = S, e.logger = T, e.default = T, Object.defineProperty(e, "__esModule", { value: !0 });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runApp;

var _reduxLogger = require('./debug/redux-logger');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runApp(reducer, App, callback) {
  var store = Redux.createStore(reducer, Redux.applyMiddleware(_reduxLogger.logger, _reduxThunk2.default));
  var Provider = ReactRedux.Provider;

  ReactDOM.render(React.createElement(
    Provider,
    { store: store },
    React.createElement(App, null)
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

  var oConnect = ReactRedux.connect;
  ReactRedux.connect = function (mapStateToProps, mapDispatchToProps) {
    return oConnect(function (state) {
      var value = mapStateToProps(state);
      Object.keys(value).forEach(function (key) {
        if (typeof value[key] === "undefined") {
          throw new Error("Missing state value for key " + key + " you most likely forgot to combine the reducers within the root reducer file");
        }
      });
    }, mapDispatchToProps);
  };

  callback && callback(newStore);
}

},{"./debug/redux-logger":20,"redux-thunk":31}],22:[function(require,module,exports){
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

},{"./containers/index.frontpage.jsx":19,"./default.debug.jsx":21,"./reducers/index.frontpage":36,"./util/websocket":37}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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

},{"_process":38}],25:[function(require,module,exports){
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

},{"./emptyFunction":23,"_process":38}],26:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":30,"_process":38,"fbjs/lib/invariant":24,"fbjs/lib/warning":25}],27:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":30,"fbjs/lib/emptyFunction":23,"fbjs/lib/invariant":24}],28:[function(require,module,exports){
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

},{"./checkPropTypes":26,"./lib/ReactPropTypesSecret":30,"_process":38,"fbjs/lib/emptyFunction":23,"fbjs/lib/invariant":24,"fbjs/lib/warning":25}],29:[function(require,module,exports){
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

},{"./factoryWithThrowingShims":27,"./factoryWithTypeCheckers":28,"_process":38}],30:[function(require,module,exports){
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
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
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
    //TODO For some reason this doesn't want to work, this reducer needs urgent fix
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Redux.combineReducers({
  notifications: _notifications2.default,
  i18n: _i18n2.default,
  locales: _locales2.default,
  status: _status2.default
});

},{"./base/i18n":32,"./base/locales":33,"./base/notifications":34,"./base/status":35}],37:[function(require,module,exports){
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

},{"../actions/base/notifications":2}],38:[function(require,module,exports){
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

},{}]},{},[22])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFjdGlvbnMvYmFzZS9sb2NhbGVzLmpzIiwiYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMuanMiLCJhY3Rpb25zL2Jhc2Uvc3RhdHVzLmpzIiwiY29tcG9uZW50cy9iYXNlL2ZvcmdvdC1wYXNzd29yZC1kaWFsb2cuanN4IiwiY29tcG9uZW50cy9iYXNlL2xvZ2luLWJ1dHRvbi5qc3giLCJjb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3giLCJjb21wb25lbnRzL2Zyb250cGFnZS9ib2R5LmpzeCIsImNvbXBvbmVudHMvZnJvbnRwYWdlL2ZlZWQuanN4IiwiY29tcG9uZW50cy9mcm9udHBhZ2UvbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kaWFsb2cuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2Ryb3Bkb3duLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9mZWVkLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9tZW51LmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvcHJvZmlsZS1pdGVtLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9wb3J0YWwuanN4IiwiY29udGFpbmVycy9pbmRleC5mcm9udHBhZ2UuanN4IiwiZGVidWcvcmVkdXgtbG9nZ2VyLmpzIiwiZGVmYXVsdC5kZWJ1Zy5qc3giLCJpbmRleC5mcm9udHBhZ2UuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC10aHVuay9saWIvaW5kZXguanMiLCJyZWR1Y2Vycy9iYXNlL2kxOG4uanMiLCJyZWR1Y2Vycy9iYXNlL2xvY2FsZXMuanMiLCJyZWR1Y2Vycy9iYXNlL25vdGlmaWNhdGlvbnMuanMiLCJyZWR1Y2Vycy9iYXNlL3N0YXR1cy5qcyIsInJlZHVjZXJzL2luZGV4LmZyb250cGFnZS5qcyIsInV0aWwvd2Vic29ja2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7a0JDQWU7QUFDYixhQUFXLG1CQUFTLE1BQVQsRUFBZ0I7QUFDekIsV0FBTztBQUNMLGNBQVEsWUFESDtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBTlksQzs7Ozs7Ozs7a0JDQUE7QUFDYix1QkFBcUIsNkJBQVMsT0FBVCxFQUFrQixRQUFsQixFQUEyQjtBQUM5QyxXQUFPO0FBQ0wsY0FBUSxrQkFESDtBQUVMLGlCQUFXO0FBQ1Qsb0JBQVksUUFESDtBQUVULG1CQUFXO0FBRkY7QUFGTixLQUFQO0FBT0QsR0FUWTtBQVViLG9CQUFrQiwwQkFBUyxZQUFULEVBQXNC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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCB7XG4gIHNldExvY2FsZTogZnVuY3Rpb24obG9jYWxlKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnU0VUX0xPQ0FMRScsXG4gICAgICAncGF5bG9hZCc6IGxvY2FsZVxuICAgIH1cbiAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gIGRpc3BsYXlOb3RpZmljYXRpb246IGZ1bmN0aW9uKG1lc3NhZ2UsIHNldmVyaXR5KXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnQUREX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3NldmVyaXR5Jzogc2V2ZXJpdHksXG4gICAgICAgICdtZXNzYWdlJzogbWVzc2FnZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaGlkZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obm90aWZpY2F0aW9uKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnSElERV9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiBub3RpZmljYXRpb25cbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBsb2dvdXQoKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnTE9HT1VUJ1xuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgRGlhbG9nIGZyb20gJy4uL2dlbmVyYWwvZGlhbG9nLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBGb3Jnb3RQYXNzd29yZERpYWxvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuICByZW5kZXIoKXtcbiAgICBsZXQgY29udGVudCA9ICg8ZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuaW5zdHJ1Y3Rpb25zJyl9XG4gICAgICAgIDxici8+XG4gICAgICAgIDxici8+XG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tcm93XCI+XG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcmdvdHBhc3N3b3JkLWVtYWlsXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLmVtYWlsJyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImVtYWlsXCIvPlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImZvcm0taGlkZGVuXCIgaWQ9XCJmb3JtLXJlc2V0LXBhc3N3b3JkLXN1Ym1pdFwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+KTtcbiAgICBsZXQgZm9vdGVyID0gKGNsb3NlRGlhbG9nKT0+e1xuICAgICAgcmV0dXJuIDxkaXY+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZm9ybS1yZXNldC1wYXNzd29yZC1zdWJtaXRcIiBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLWxhcmdlXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLnNlbmRCdXR0b25MYWJlbCcpfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLWxhcmdlIGJ1dHRvbi13YXJuXCIgb25DbGljaz17Y2xvc2VEaWFsb2d9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5jYW5jZWxCdXR0b25MYWJlbCcpfVxuICAgICAgICA8L2E+XG4gICAgICA8L2Rpdj5cbiAgICB9XG4gICAgcmV0dXJuIDxEaWFsb2cgdGl0bGU9e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLnRpdGxlJyl9XG4gICAgICBjb250ZW50PXtjb250ZW50fSBmb290ZXI9e2Zvb3Rlcn0gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgIDwvRGlhbG9nPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRm9yZ290UGFzc3dvcmREaWFsb2cpOyIsIi8vVE9ETyB1bmxpa2UgbGFuZ3VhZ2UgY2hhbmdlLCBsb2dpbiBpbiBuZWVkcyB0byBlc2NhcGUgdGhlIGN1cnJlbnRcbi8vcGFnZSBoZW5jZSBpdCBkb2Vzbid0IHJlYWxseSBuZWVkIGEgcmVkdWNlciwgaG93ZXZlciBpdCBjb3VsZCBiZSBpbXBsbWVudGVkXG4vL2lmIGV2ZXIgd2Ugd2lzaCB0byB0dXJuIGl0IGludG8gYSBTUEFcblxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMaW5rIGZyb20gJy4uL2dlbmVyYWwvbGluay5qc3gnO1xuXG5jbGFzcyBMb2dpbkJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMubG9naW4gPSB0aGlzLmxvZ2luLmJpbmQodGhpcyk7XG4gIH1cbiAgbG9naW4oKXtcbiAgICAvL1RPRE8gcGxlYXNlIGxldCdzIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMgcmF0aGVyIHRoYW4gdGhlIGVtdWxhdGVkIHdheVxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCQoXCIjbG9naW5cIikuYXR0cihcImhyZWZcIikpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPExpbmsgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1sb2dpbmB9IG9uQ2xpY2s9e3RoaXMubG9naW59PlxuICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmxvZ2luLmJ1dHRvbkxhYmVsJyl9PC9zcGFuPlxuICAgIDwvTGluaz4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTG9naW5CdXR0b24pOyIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uL2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcblxuY2xhc3MgTm90aWZpY2F0aW9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbnMubWFwKChub3RpZmljYXRpb24pPT57XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17bm90aWZpY2F0aW9uLmlkfSBjbGFzc05hbWU9e1wibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0gbm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0tXCIgKyBub3RpZmljYXRpb24uc2V2ZXJpdHl9PlxuICAgICAgICAgICAgICAgIDxzcGFuPntub3RpZmljYXRpb24ubWVzc2FnZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0tY2xvc2VcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmhpZGVOb3RpZmljYXRpb24uYmluZCh0aGlzLCBub3RpZmljYXRpb24pfT48L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4gIFxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBub3RpZmljYXRpb25zOiBzdGF0ZS5ub3RpZmljYXRpb25zXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIFJlZHV4LmJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE5vdGlmaWNhdGlvbnMpOyIsImltcG9ydCBGcm9udHBhZ2VOYXZiYXIgZnJvbSAnLi9uYXZiYXIuanN4JztcbmltcG9ydCBGcm9udHBhZ2VGZWVkIGZyb20gJy4vZmVlZC5qc3gnO1xuXG5jbGFzcyBGcm9udHBhZ2VCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICB0aGlzLmFkZENhcm91c2VscygpO1xuICB9XG4gIGFkZENhcm91c2Vscygpe1xuICAgIC8vVE9ETyB0aGlzIHBpZWNlIG9mIGNvZGUgdXMgZGVwcmVjYXRlZCBhbmQgdXNlcyBqcXVlcnksIG5vdGljZSB0aGF0IHRoaXNcbiAgICAvL3dpbGwgYmUgdmVyeSBidWdneSBpZiBldmVyIHRoZSBmcm9udHBhZ2UgYm9keSB1cGRhdGVzLCBlZyBtYWtpbmcgdGhlIGkxOCByZWR1Y2VyIG1vcmUgZWZmaWNpZW50XG4gICAgLy9vciBhZGRpbmcgYW5vdGhlciByZWR1Y2VyIHRoYXQgY2F1c2VzIGNoYW5nZXMgdG8gdGhlIGJvZHkgcHJvcGVydGllc1xuICAgIC8vd2UgbmVlZCB0byByZXBhY2UgdGhpcyBpZiBldmVyIGdvaW5nIHRvIG1ha2UgYm9keSB0byB1cGRhdGVcbiAgICAgIFxuICAgICQoJzxsaW5rLz4nLCB7XG4gICAgICByZWw6ICdzdHlsZXNoZWV0JyxcbiAgICAgIHR5cGU6ICd0ZXh0L2NzcycsXG4gICAgICBocmVmOiAnLy9jZG4ubXVpa2t1dmVya2tvLmZpL2xpYnMvc2xpY2svMS42LjAvc2xpY2suY3NzJ1xuICAgIH0pLmFwcGVuZFRvKCdoZWFkJyk7XG4gICAgICBcbiAgICAkLmdldFNjcmlwdChcIi8vY2RuLm11aWtrdXZlcmtrby5maS9saWJzL3NsaWNrLzEuNi4wL3NsaWNrLm1pbi5qc1wiLCBmdW5jdGlvbiggZGF0YSwgdGV4dFN0YXR1cywganF4aHIgKSB7XG4gICAgICAkKFwiLmNhcm91c2VsLWl0ZW1cIikuZWFjaCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgICAgICQoZWxlbWVudCkuc2hvdygpO1xuICAgICAgfSk7XG5cbiAgICAgICQoXCIuY2Fyb3VzZWxcIikuZWFjaCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgICAgICQoZWxlbWVudCkuc2xpY2soe1xuICAgICAgICAgIGFwcGVuZERvdHM6ICQoZWxlbWVudCkuc2libGluZ3MoXCIuY2Fyb3VzZWwtY29udHJvbHNcIiksXG4gICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgIGRvdHNDbGFzczogXCJjYXJvdXNlbC1kb3RzXCIsXG4gICAgICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgICAgICBzcGVlZDogNzUwLFxuICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiBmYWxzZSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjksXG4gICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZmFkZTogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZW1iZWQgZW1iZWQtZnVsbFwiPlxuPEZyb250cGFnZU5hdmJhciAvPlxuICAgICAgICAgICAgXG48aGVhZGVyIGNsYXNzTmFtZT1cImZyb250cGFnZSBoZXJvXCI+XG4gIDxkaXYgY2xhc3NOYW1lPVwiaGVyby13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLWl0ZW1cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlIGJ1YmJsZS1yZXNwb25zaXZlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLXRpdGxlXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUudGl0bGUnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWNvbnRlbnRcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnN0dWRlbnRBcHBsaWNhdGlvbkJ1YmJsZS5kZXNjcmlwdGlvbicpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tc29mdCBidXR0b24tZHluYW1pYy1oZWlnaHQgYnV0dG9uLXdhcm4gYnV0dG9uLWZvY3VzXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnN0dWRlbnRBcHBsaWNhdGlvbkJ1YmJsZS5saW5rJyl9XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1tdWlra3UtbG9nb1wiPlxuICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImZyb250cGFnZSBsb2dvIGZyb250cGFnZS1sb2dvLW11aWtrdS12ZXJra29cIiBzcmM9XCIvZ2Z4L29mLXNpdGUtbG9nby5wbmdcIj48L2ltZz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LXVwcGVyY2FzZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtbXVpa2t1LWF1dGhvclwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc2l0ZS5hdXRob3InKX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LW11aWtrdVwiPk1VSUtLVTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdmVya2tvXCI+VkVSS0tPPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtdXBwZXJjYXNlIGZyb250cGFnZS10ZXh0LW11aWtrdS1kZXNjcmlwdGlvblwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc2l0ZS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZSBidWJibGUtcmVzcG9uc2l2ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS50aXRsZScpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1jb250ZW50XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5vcGVuTWF0ZXJpYWxzQnViYmxlLmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLXNvZnQgYnV0dG9uLWR5bmFtaWMtaGVpZ2h0IGJ1dHRvbi13YXJuXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5vcGVuTWF0ZXJpYWxzQnViYmxlLmxpbmsnKX08L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9oZWFkZXI+XG5cbjxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHNlcGFyYXRvclwiPjwvZGl2PlxuXG48ZGl2IGNsYXNzTmFtZT1cInNjcmVlbi1jb250YWluZXJcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW4tY29udGFpbmVyLXdyYXBwZXJcIj5cbiAgICAgICAgICBcbiAgICA8c2VjdGlvbiBpZD1cInN0dWR5aW5nXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb25cIj5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zZWN0aW9uVGl0bGUuc3R1ZHlpbmcnKX08L2gyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLXN0dWR5aW5nXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtc3R1ZHlpbmdcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9uZXR0aWx1a2lvLnBuZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aWx1a2lvLnRpdGxlJyl9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLm5ldHRpbHVraW8uZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL25ldHRpbHVraW9fZXNpdHRlbHlcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1zdHVkeWluZy1yZWFkbW9yZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5yZWFkTW9yZS5saW5rJyl9IDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY2FyZCBmcm9udHBhZ2UtY2FyZC1zY2hvb2xcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9uZXR0aXBlcnVza291bHUucG5nXCJcbiAgICAgICAgICAgICAgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLm5ldHRpcGVydXNrb3VsdS50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aXBlcnVza291bHUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL2VzaXR0ZWx5X25ldHRpcGtcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1zY2hvb2wtcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtY291cnNlc1wiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhX2FpbmVvcGlza2VsdS5wbmdcIlxuICAgICAgICAgICAgICBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcuYWluZW9waXNrZWx1LnRpdGxlJyl9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLmFpbmVvcGlza2VsdS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtZm9vdGVyXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm5ldHRpbHVraW8uZmkvZXNpdHRlbHlfbmV0dGlwa1wiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLWNvdXJzZXMtcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG5cbiAgICA8c2VjdGlvbiBpZD1cInZpZGVvc1wiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvT0Q1T2o1MHZ5aDA/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvQ0pjcFdaRDBWVDg/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL0ViSm5XSXlPSk5nP3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9pT0tVb0FBUTdVaz9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtY29udHJvbHNcIj48L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG5cbiAgICA8c2VjdGlvbiBpZD1cIm5ld3NcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvblwiPlxuXG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc2VjdGlvblRpdGxlLm5ld3MnKX08L2gyPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3c1wiPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIG9yZGVyZWQtY29udGFpbmVyLXJvdyBvcmRlcmVkLWNvbnRhaW5lci1yZXNwb25zaXZlIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1uZXdzLXN1YmNvbnRhaW5lclwiPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZyb250cGFnZUJveFRpdGxlLmV2ZW50cycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1ldmVudHMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA0LCBvcmRlcjogXCJBU0NFTkRJTkdcIn19IGZlZWRSZWFkVGFyZ2V0PVwib29ldmVudHNcIj48L0Zyb250cGFnZUZlZWQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5uZXdzJyl9PC9oMj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlLW5ld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA1fX0gZmVlZFJlYWRUYXJnZXQ9XCJvb25ld3NcIj48L0Zyb250cGFnZUZlZWQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBvcmRlcmVkLWNvbnRhaW5lci1yb3cgb3JkZXJlZC1jb250YWluZXItcmVzcG9uc2l2ZSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3cy1zdWJjb250YWluZXJcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1jYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMS5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMi5qcGdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2UyJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmEzLmpwZ1wiIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2UzJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmE0LmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTQnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTUuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2U1Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1jb250cm9sc1wiPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLWNhcmQtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5ibG9ncycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1ibG9ncy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZyb250cGFnZUZlZWQgcXVlcnlPcHRpb25zPXt7bnVtSXRlbXM6IDZ9fVxuICAgICAgICAgICAgICAgICAgICAgZmVlZFJlYWRUYXJnZXQ9XCJlb3BwaW1pc2tlc2t1cyxvcGVuLGViYXJvbWV0cmksbWF0c2t1bGEsb3BwaW1pbmVuLHBvbGt1amEscmVpc3N1dmloa28samFsa2lhXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvbiBmcm9udHBhZ2UtY2FyZC1jb250YWluZXJcIj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY2FyZCBmcm9udHBhZ2UtY2FyZC1vdGF2YW4tb3Bpc3RvXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW90YXZhbi1vcGlzdG8taW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItaXRlbS1vdGF2YW4tb3Bpc3RvLXNvY2lhbC1tZWRpYVwiPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLXNvY2lhbC1tZWRpYVwiPlxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC11cHBlcmNhc2UgZnJvbnRwYWdlLXRleHQtb3RhdmFuLW9waXN0by1pbmZvLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm9yZ2FuaXphdGlvbi5zb21lLnRpdGxlJyl9XG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWZhY2Vib29rXCIgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9vdGF2YW5vcGlzdG9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLXR3aXR0ZXJcIiBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9PdGF2YW5PcGlzdG9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWluc3RhZ3JhbVwiIGhyZWY9XCJodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL290YXZhbm9waXN0by9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLXBpbnRlcmVzdFwiIGhyZWY9XCJodHRwczovL2ZpLnBpbnRlcmVzdC5jb20vb3RhdmFub3Bpc3RvL1wiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbi1zb2NpYWwgaWNvbiBpY29uLXNvbWUtbGlua2VkaW5cIiBocmVmPVwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvMTA2MDI4XCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLW90YXZhbi1vcGlzdG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LW11bHRpcGFyYWdyYXBoIGZyb250cGFnZS10ZXh0LW90YXZhbi1vcGlzdG8taW5mby1kZXNjcmlwdGlvblwiXG4gICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHRoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm9yZ2FuaXphdGlvbi5kZXNjcmlwdGlvbicpfX0+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5vdGF2YW5vcGlzdG8uZmlcIiB0YXJnZXQ9XCJ0b3BcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24td2Vic2l0ZVwiPlxuICAgICAgICAgICAgICAgIHd3dy5vdGF2YW5vcGlzdG8uZmlcbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8YnIvPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5vdGF2YW5vcGlzdG8uZmkvdXV0aXNraXJqZVwiIHRhcmdldD1cInRvcFwiIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1uZXdzbGV0dGVyXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm9yZ2FuaXphdGlvbi5uZXdzbGV0dGVyLmxpbmsnKX1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLWl0ZW0tb3RhdmFuLW9waXN0by1sb2dvXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIi9nZngvb2Ytb3JnYW5pemF0aW9uLWxvZ28uanBnXCIgYWx0PVwibG9nb1wiIHRpdGxlPVwibG9nb1wiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxmb290ZXIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGZvb3RlclwiIGlkPVwiY29udGFjdFwiPlxuICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1jb250YWluZXJcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1pdGVtIGZyb250cGFnZS1mb290ZXItaXRlbS1jb250YWN0XCI+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11c1wiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIuY29udGFjdC50aXRsZScpfTwvaDI+XG4gICAgICA8cCBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzLWluZm9ybWF0aW9uXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaWNvbiBpY29uLWxvY2F0aW9uXCI+PC9zcGFuPlxuICAgICAgICA8Yj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLnN0cmVldEFkZHJlc3MubGFiZWwnKX08L2I+XG4gICAgICAgIDxzcGFuPk90YXZhbnRpZSAyIEIsIDUwNjcwIE90YXZhPC9zcGFuPlxuICAgICAgPC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11cy1pbmZvcm1hdGlvblwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWljb24gaWNvbi1waG9uZVwiPjwvc3Bhbj5cbiAgICAgICAgPGI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5waG9uZU51bWJlci5sYWJlbCcpfTwvYj5cbiAgICAgICAgPHNwYW4+MDE1IDE5NMKgMzU1Mjwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXMtaW5mb3JtYXRpb25cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pY29uIGljb24tZW52ZWxvcGVcIj48L3NwYW4+XG4gICAgICAgIDxiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIuZW1haWxBZGRyZXNzLmxhYmVsJyl9PC9iPlxuICAgICAgICA8c3Bhbj5pbmZvQG90YXZhbm9waXN0by5maTwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1pdGVtIGZyb250cGFnZS1mb290ZXItaXRlbS1sb2dvc1wiPlxuICAgICAgPGltZyBzcmM9XCIvZ2Z4L2Fsa3VfdXVkZWxsZS5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIGNsYXNzTmFtZT1cImxvZ29cIiAvPlxuICAgICAgPGltZyBzcmM9XCIvZ2Z4L2Zvb3Rlcl9sb2dvLmpwZ1wiIGFsdD1cIlwiIHRpdGxlPVwiXCIgY2xhc3NOYW1lPVwibG9nb1wiIC8+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9mb290ZXI+XG4gICAgICAgIDwvZGl2Pik7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGcm9udHBhZ2VCb2R5KTsiLCJpbXBvcnQgRmVlZCBmcm9tICcuLi9nZW5lcmFsL2ZlZWQuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyb250cGFnZUZlZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGZlZWRSZWFkVGFyZ2V0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcXVlcnlPcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbnRyaWVzOiBbXVxuICAgIH1cbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIG1BcGkoKS5mZWVkLmZlZWRzLnJlYWQodGhpcy5wcm9wcy5mZWVkUmVhZFRhcmdldCwgdGhpcy5wcm9wcy5xdWVyeU9wdGlvbnMpLmNhbGxiYWNrKChlcnIsIGVudHJpZXMpPT57XG4gICAgICBpZiAoIWVycil7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2VudHJpZXN9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPEZlZWQgZW50cmllcz17dGhpcy5zdGF0ZS5lbnRyaWVzfT48L0ZlZWQ+XG4gIH1cbn0iLCJpbXBvcnQgTmF2YmFyIGZyb20gJy4uL2dlbmVyYWwvbmF2YmFyLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9nZW5lcmFsL2xpbmsuanN4JztcbmltcG9ydCBMb2dpbkJ1dHRvbiBmcm9tICcuLi9iYXNlL2xvZ2luLWJ1dHRvbi5qc3gnO1xuaW1wb3J0IEZvcmdvdFBhc3N3b3JkRGlhbG9nIGZyb20gJy4uL2Jhc2UvZm9yZ290LXBhc3N3b3JkLWRpYWxvZy5qc3gnO1xuXG5jbGFzcyBGcm9udHBhZ2VOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8TmF2YmFyIGNsYXNzTmFtZUV4dGVuc2lvbj1cImZyb250cGFnZVwiIG5hdmJhckl0ZW1zPXtbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJzdHVkeWluZ1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5zdHVkeWluZycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcIm5ld3NcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjbmV3c1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5uZXdzJyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwib3RhdmFuLW9waXN0b1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3RhdmFuT3Bpc3RvJyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwiY29udGFjdFwiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNjb250YWN0XCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLmNvbnRhY3QnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJvcGVuLW1hdGVyaWFsc1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstaGlnaGxpZ2h0IGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3Blbk1hdGVyaWFscycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfVxuICAgIF19IGRlZmF1bHRPcHRpb25zPXtbXG4gICAgICAoPExvZ2luQnV0dG9uIGtleT1cIjBcIiBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIi8+KSxcbiAgICAgICg8Rm9yZ290UGFzc3dvcmREaWFsb2cga2V5PVwiMVwiIGNsYXNzTmFtZUV4dGVuc2lvbj1cImZyb250cGFnZVwiPjxMaW5rIGNsYXNzTmFtZT1cImZyb250cGFnZSBsYWJlbCBsYWJlbC1keW5hbWljLXdvcmQtYnJlYWsgbGFiZWwtY2xpY2thYmxlIGZyb250cGFnZS1sYWJlbC1mb3Jnb3QtcGFzc3dvcmQgZnJvbnRwYWdlLWludGVyYWN0LWZvcmdvdC1wYXNzd29yZFwiPlxuICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdExpbmsnKX08L3NwYW4+XG4gICAgICAgPC9MaW5rPjwvRm9yZ290UGFzc3dvcmREaWFsb2c+KVxuICAgIF19IG1lbnVJdGVtcz17W1xuICAgICAgICg8TGluayBocmVmPVwiI3N0dWR5aW5nXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLnN0dWR5aW5nJyl9PC9zcGFuPjwvTGluaz4pLFxuICAgICAgICg8TGluayBocmVmPVwiI25ld3NcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsubmV3cycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3RhdmFuT3Bpc3RvJyl9PC9zcGFuPjwvTGluaz4pLFxuICAgICAgICg8TGluayBocmVmPVwiI2NvbnRhY3RcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsuY29udGFjdCcpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstaGlnaGxpZ2h0IGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3Blbk1hdGVyaWFscycpfTwvc3Bhbj48L0xpbms+KVxuICAgIF19Lz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZyb250cGFnZU5hdmJhcik7XG4iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFBvcnRhbCBmcm9tICcuL3BvcnRhbC5qc3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY29udGVudDogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBmb290ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk92ZXJsYXlDbGljayA9IHRoaXMub25PdmVybGF5Q2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICB0aGlzLnJlZnMucG9ydGFsLmNsb3NlUG9ydGFsKCk7XG4gIH1cbiAgb25PdmVybGF5Q2xpY2soZSl7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvbk9wZW4oKXtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSwgMTApO1xuICB9XG4gIGJlZm9yZUNsb3NlKERPTU5vZGUsIHJlbW92ZUZyb21ET00pe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KHJlbW92ZUZyb21ET00sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8UG9ydGFsIHJlZj1cInBvcnRhbFwiIG9wZW5CeUNsaWNrT249e3RoaXMucHJvcHMuY2hpbGRyZW59IG9uT3Blbj17dGhpcy5vbk9wZW59IGJlZm9yZUNsb3NlPXt0aGlzLmJlZm9yZUNsb3NlfSBjbG9zZU9uRXNjPlxuPGRpdiBjbGFzc05hbWU9e2BkaWFsb2cgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tZGlhbG9nICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifWB9IG9uQ2xpY2s9e3RoaXMub25PdmVybGF5Q2xpY2t9PlxuICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy13aW5kb3dcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy10aXRsZVwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaWFsb2ctY2xvc2UgaWNvbiBpY29uLWNsb3NlXCIgb25DbGljaz17dGhpcy5jbG9zZX0+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5jb250ZW50fVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1mb290ZXJcIj5cbiAgICAgICAge3RoaXMucHJvcHMuZm9vdGVyKHRoaXMuY2xvc2UpfVxuICAgICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4gICAgICAgIDwvUG9ydGFsPik7XG4gIH1cbn0iLCJpbXBvcnQgUG9ydGFsIGZyb20gJy4vcG9ydGFsLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcm9wZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pKS5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB0b3A6IG51bGwsXG4gICAgICBsZWZ0OiBudWxsLFxuICAgICAgYXJyb3dMZWZ0OiBudWxsLFxuICAgICAgYXJyb3dSaWdodDogbnVsbCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfVxuICB9XG4gIG9uT3BlbihET01Ob2RlKXtcbiAgICBsZXQgJHRhcmdldCA9ICQodGhpcy5yZWZzLmFjdGl2YXRvcik7XG4gICAgbGV0ICRhcnJvdyA9ICQodGhpcy5yZWZzLmFycm93KTtcbiAgICBsZXQgJGRyb3Bkb3duID0gJCh0aGlzLnJlZnMuZHJvcGRvd24pO1xuICAgICAgXG4gICAgbGV0IHBvc2l0aW9uID0gJHRhcmdldC5vZmZzZXQoKTtcbiAgICBsZXQgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICBsZXQgbW9yZVNwYWNlSW5UaGVMZWZ0U2lkZSA9ICh3aW5kb3dXaWR0aCAtIHBvc2l0aW9uLmxlZnQpIDwgcG9zaXRpb24ubGVmdDtcbiAgICBcbiAgICBsZXQgbGVmdCA9IG51bGw7XG4gICAgaWYgKG1vcmVTcGFjZUluVGhlTGVmdFNpZGUpe1xuICAgICAgbGVmdCA9IHBvc2l0aW9uLmxlZnQgLSAkZHJvcGRvd24ub3V0ZXJXaWR0aCgpICsgJHRhcmdldC5vdXRlcldpZHRoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0O1xuICAgIH1cbiAgICBsZXQgdG9wID0gcG9zaXRpb24udG9wICsgJHRhcmdldC5vdXRlckhlaWdodCgpICsgNTtcbiAgICBcbiAgICBsZXQgYXJyb3dMZWZ0ID0gbnVsbDtcbiAgICBsZXQgYXJyb3dSaWdodCA9IG51bGw7XG4gICAgaWYgKG1vcmVTcGFjZUluVGhlTGVmdFNpZGUpe1xuICAgICAgYXJyb3dSaWdodCA9ICgkdGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDIpICsgKCRhcnJvdy53aWR0aCgpLzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJvd0xlZnQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7dG9wLCBsZWZ0LCBhcnJvd0xlZnQsIGFycm93UmlnaHQsIHZpc2libGU6IHRydWV9KTtcbiAgfVxuICBiZWZvcmVDbG9zZShET01Ob2RlLCByZW1vdmVGcm9tRE9NKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChyZW1vdmVGcm9tRE9NLCAzMDApO1xuICB9XG4gIGNsb3NlKCl7XG4gICAgdGhpcy5yZWZzLnBvcnRhbC5jbG9zZVBvcnRhbCgpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8UG9ydGFsIHJlZj1cInBvcnRhbFwiIG9wZW5CeUNsaWNrT249e1JlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLmNoaWxkcmVuLCB7IHJlZjogXCJhY3RpdmF0b3JcIiB9KX1cbiAgICAgIGNsb3NlT25Fc2MgY2xvc2VPbk91dHNpZGVDbGljayBjbG9zZU9uU2Nyb2xsIG9uT3Blbj17dGhpcy5vbk9wZW59IGJlZm9yZUNsb3NlPXt0aGlzLmJlZm9yZUNsb3NlfT5cbiAgICAgIDxkaXYgcmVmPVwiZHJvcGRvd25cIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS50b3AsXG4gICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5sZWZ0XG4gICAgICAgIH19XG4gICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGRyb3Bkb3duICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWRyb3Bkb3duLSR7dGhpcy5wcm9wcy5jbGFzc05hbWVTdWZmaXh9ICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhcnJvd1wiIHJlZj1cImFycm93XCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmFycm93TGVmdCwgcmlnaHQ6IHRoaXMuc3RhdGUuYXJyb3dSaWdodH19Pjwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0eXBlb2YgaXRlbSA9PT0gXCJmdW5jdGlvblwiID8gaXRlbSh0aGlzLmNsb3NlKSA6IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICB7ZWxlbWVudH1cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9Qb3J0YWw+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBGZWVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbnRyaWVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcHVibGljYXRpb25EYXRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbGluazogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKS5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJmZWVkXCI+XG4gICAgICB7dGhpcy5wcm9wcy5lbnRyaWVzLm1hcCgoZW50cnksIGluZGV4KT0+e1xuICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImZlZWQtaXRlbVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZlZWQtaXRlbS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgPGEgaHJlZj17ZW50cnkubGlua30gdGFyZ2V0PVwidG9wXCI+e2VudHJ5LnRpdGxlfTwvYT5cbiAgICAgICAgICAgIHtlbnRyeS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmVlZC1pdGVtLWRhdGVcIj57dGhpcy5wcm9wcy5pMThuLnRpbWUuZm9ybWF0KGVudHJ5LnB1YmxpY2F0aW9uRGF0ZSl9PC9zcGFuPlxuICAgICAgICA8L2xpPlxuICAgICAgfSl9XG4gICAgPC91bD5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZlZWQpOyIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmZ1bmN0aW9uIHNjcm9sbFRvU2VjdGlvbihhbmNob3IpIHtcbiAgbGV0IHRvcE9mZnNldCA9IDkwO1xuICBsZXQgc2Nyb2xsVG9wID0gJChhbmNob3IpLm9mZnNldCgpLnRvcCAtIHRvcE9mZnNldDtcblxuICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgIHNjcm9sbFRvcCA6IHNjcm9sbFRvcFxuICB9LCB7XG4gICAgZHVyYXRpb24gOiA1MDAsXG4gICAgZWFzaW5nIDogXCJlYXNlSW5PdXRRdWFkXCJcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbkNsaWNrKGUsIHJlKXtcbiAgICBpZiAodGhpcy5wcm9wcy5ocmVmICYmIHRoaXMucHJvcHMuaHJlZlswXSA9PT0gJyMnKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNjcm9sbFRvU2VjdGlvbih0aGlzLnByb3BzLmhyZWYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKXtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiB0cnVlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBmYWxzZX0pO1xuICAgIHRoaXMub25DbGljayhlLCByZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaEVuZCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hFbmQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPGEgey4uLnRoaXMucHJvcHN9XG4gICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lICsgKHRoaXMuc3RhdGUuYWN0aXZlID8gXCIgYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja30gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfS8+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExhbmd1YWdlUGlja2VyIGZyb20gJy4vbmF2YmFyL2xhbmd1YWdlLXBpY2tlci5qc3gnO1xuaW1wb3J0IFByb2ZpbGVJdGVtIGZyb20gJy4vbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3gnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi9uYXZiYXIvbWVudS5qc3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub3Blbk1lbnUgPSB0aGlzLm9wZW5NZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZU1lbnUgPSB0aGlzLmNsb3NlTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH1cbiAgfVxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG5hdmJhckl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgaXRlbTogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuICAgIG1lbnVJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgZGVmYXVsdE9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkXG4gIH1cbiAgb3Blbk1lbnUoKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzTWVudU9wZW46IHRydWVcbiAgICB9KTtcbiAgfVxuICBjbG9zZU1lbnUoKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzTWVudU9wZW46IGZhbHNlXG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPXtgbmF2YmFyICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259YH0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2BuYXZiYXItaXRlbSAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1uYXZiYXItaXRlbS1tZW51LWJ1dHRvbmB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbGluayBsaW5rLWljb24gbGluay1mdWxsYH0gb25DbGljaz17dGhpcy5vcGVuTWVudX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1uYXZpY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMubmF2YmFySXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tJHtpdGVtLmNsYXNzTmFtZVN1ZmZpeH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0uaXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoaXRlbT0+ISFpdGVtKX1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZGVmYXVsdC1vcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9ucy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5kZWZhdWx0T3B0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICA8UHJvZmlsZUl0ZW0gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0vPlxuICAgICAgICAgICAgICAgICAgICAgIDxMYW5ndWFnZVBpY2tlciBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L25hdj5cbiAgICAgICAgICAgICAgPE1lbnUgb3Blbj17dGhpcy5zdGF0ZS5pc01lbnVPcGVufSBvbkNsb3NlPXt0aGlzLmNsb3NlTWVudX0gaXRlbXM9e3RoaXMucHJvcHMubWVudUl0ZW1zfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vLi4vYWN0aW9ucy9iYXNlL2xvY2FsZXMnO1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4uL2Ryb3Bkb3duLmpzeCc7XG5cbmNsYXNzIExhbmd1YWdlUGlja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cImxhbmd1YWdlLXBpY2tlclwiIGl0ZW1zPXt0aGlzLnByb3BzLmxvY2FsZXMuYXZhbGlhYmxlLm1hcCgobG9jYWxlKT0+e1xuICAgICAgcmV0dXJuICg8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstZnVsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1saW5rLWxhbmd1YWdlLXBpY2tlcmB9IG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0TG9jYWxlLmJpbmQodGhpcywgbG9jYWxlLmxvY2FsZSl9PlxuICAgICAgICA8c3Bhbj57bG9jYWxlLm5hbWV9PC9zcGFuPlxuICAgICAgPC9hPik7XG4gICAgfSl9PlxuICAgICAgPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uLXBpbGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tYnV0dG9uLXBpbGwtbGFuZ3VhZ2VgfT5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMubG9jYWxlcy5jdXJyZW50fTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L0Ryb3Bkb3duPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbG9jYWxlczogc3RhdGUubG9jYWxlc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBSZWR1eC5iaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYW5ndWFnZVBpY2tlcik7IiwiaW1wb3J0IExpbmsgZnJvbSAnLi4vbGluay5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaE1vdmUgPSB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vcGVuID0gdGhpcy5vcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlQnlPdmVybGF5ID0gdGhpcy5jbG9zZUJ5T3ZlcmxheS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkaXNwbGF5ZWQ6IHByb3BzLm9wZW4sXG4gICAgICB2aXNpYmxlOiBwcm9wcy5vcGVuLFxuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZzogbnVsbCxcbiAgICAgIG9wZW46IHByb3BzLm9wZW5cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xuICAgIGlmIChuZXh0UHJvcHMub3BlbiAmJiAhdGhpcy5zdGF0ZS5vcGVuKXtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy5vcGVuICYmIHRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlKXtcbiAgICB0aGlzLnNldFN0YXRlKHsnZHJhZ2dpbmcnOiB0cnVlfSk7XG4gICAgdGhpcy50b3VjaENvcmRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYID0gMDtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb25Ub3VjaE1vdmUoZSl7XG4gICAgbGV0IGRpZmZYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHRoaXMudG91Y2hDb3JkWDtcbiAgICBsZXQgYWJzb2x1dGVEaWZmZXJlbmNlWCA9IE1hdGguYWJzKGRpZmZYIC0gdGhpcy5zdGF0ZS5kcmFnKTtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYICs9IGFic29sdXRlRGlmZmVyZW5jZVg7XG5cbiAgICBpZiAoZGlmZlggPiAwKSB7XG4gICAgICBkaWZmWCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWc6IGRpZmZYfSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hFbmQoZSl7XG4gICAgbGV0IHdpZHRoID0gJCh0aGlzLnJlZnMubWVudUNvbnRhaW5lcikud2lkdGgoKTtcbiAgICBsZXQgZGlmZiA9IHRoaXMuc3RhdGUuZHJhZztcbiAgICBsZXQgbW92ZW1lbnQgPSB0aGlzLnRvdWNoTW92ZW1lbnRYO1xuICAgIFxuICAgIGxldCBtZW51SGFzU2xpZGVkRW5vdWdoRm9yQ2xvc2luZyA9IE1hdGguYWJzKGRpZmYpID49IHdpZHRoKjAuMzM7XG4gICAgbGV0IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSA9IGUudGFyZ2V0ID09PSB0aGlzLnJlZnMubWVudSAmJiBtb3ZlbWVudCA8PSA1O1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZEFMaW5rID0gZS50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2luZzogZmFsc2V9KTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBudWxsfSk7XG4gICAgICBpZiAobWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgfHwgeW91SnVzdENsaWNrZWRUaGVPdmVybGF5IHx8IHlvdUp1c3RDbGlja2VkQUxpbmspe1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvcGVuKCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiB0cnVlLCBvcGVuOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmlzaWJsZTogdHJ1ZX0pO1xuICAgIH0sIDEwKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJ2hpZGRlbid9KTtcbiAgfVxuICBjbG9zZUJ5T3ZlcmxheShlKXtcbiAgICBsZXQgaXNPdmVybGF5ID0gZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldDtcbiAgICBsZXQgaXNMaW5rID0gISFlLnRhcmdldC5ocmVmO1xuICAgIGlmICghdGhpcy5zdGF0ZS5kcmFnZ2luZyAmJiAoaXNPdmVybGF5IHx8IGlzTGluaykpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBjbG9zZSgpe1xuICAgICQoZG9jdW1lbnQuYm9keSkuY3NzKHsnb3ZlcmZsb3cnOiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiBmYWxzZSwgb3BlbjogZmFsc2V9KTtcbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH0sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YG1lbnUgJHt0aGlzLnN0YXRlLmRpc3BsYXllZCA/IFwiZGlzcGxheWVkXCIgOiBcIlwifSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLmRyYWdnaW5nID8gXCJkcmFnZ2luZ1wiIDogXCJcIn1gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNsb3NlQnlPdmVybGF5fSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoTW92ZT17dGhpcy5vblRvdWNoTW92ZX0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfSByZWY9XCJtZW51XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWNvbnRhaW5lclwiIHJlZj1cIm1lbnVDb250YWluZXJcIiBzdHlsZT17e2xlZnQ6IHRoaXMuc3RhdGUuZHJhZ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtZW51LWhlYWRlci1idXR0b24tY2xvc2UgaWNvbiBpY29uLWFycm93LWxlZnRcIj48L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJtZW51LWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGtleT17aW5kZXh9PntpdGVtfTwvbGk+XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICB9XG59XG4gICIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi4vZHJvcGRvd24uanN4JztcbmltcG9ydCBMaW5rIGZyb20gJy4uL2xpbmsuanN4JztcblxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vLi4vYWN0aW9ucy9iYXNlL3N0YXR1cyc7XG5cbmNsYXNzIFByb2ZpbGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICBpZiAoIXRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJ1c2VyXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4ucHJvZmlsZS5saW5rcy5wZXJzb25hbCcsXG4gICAgICAgIGhyZWY6IFwiL3Byb2ZpbGVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJmb3Jnb3RwYXNzd29yZFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmZvb3Rlci5pbnN0cnVjdGlvbnMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcImhlbHBkZXNrXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4uaG9tZS5oZWxwZGVzaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwic2lnbm91dFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmxvZ291dC5sb2dvdXQnLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLmxvZ291dFxuICAgICAgfVxuICAgIF1cbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cInByb2ZpbGUtbWVudVwiIGl0ZW1zPXtpdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgIHJldHVybiAoY2xvc2VEcm9wZG93bik9PntyZXR1cm4gPExpbmsgaHJlZj1cIi9wcm9maWxlXCJcbiAgICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstcHJvZmlsZS1tZW51YH1cbiAgICAgICAgIG9uQ2xpY2s9eyguLi5hcmdzKT0+e2Nsb3NlRHJvcGRvd24oKTtpdGVtLm9uQ2xpY2sgJiYgaXRlbS5vbkNsaWNrKC4uLmFyZ3MpfX0gaHJlZj17aXRlbS5ocmVmfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX08L3NwYW4+XG4gICAgICAgIDwvTGluaz59XG4gICAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGJ1dHRvbi1waWxsIG1haW4tZnVuY3Rpb24tYnV0dG9uLXBpbGwtcHJvZmlsZVwiPlxuICAgICAgICA8b2JqZWN0IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtZnVsbFwiXG4gICAgICAgICBkYXRhPXtgL3Jlc3QvdXNlci9maWxlcy91c2VyLyR7dGhpcy5wcm9wcy5zdGF0dXMudXNlcklkfS9pZGVudGlmaWVyL3Byb2ZpbGUtaW1hZ2UtOTZgfVxuICAgICAgICAgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdXNlclwiPjwvc3Bhbj5cbiAgICAgICAgPC9vYmplY3Q+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gUmVkdXguYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoUHJvZmlsZUl0ZW0pOyIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNvbnN0IEtFWUNPREVTID0ge1xuICBFU0NBUEU6IDI3XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3J0YWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7IGFjdGl2ZTogZmFsc2UgfTtcbiAgICB0aGlzLmhhbmRsZVdyYXBwZXJDbGljayA9IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCA9IHRoaXMuY2xvc2VQb3J0YWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlS2V5ZG93biA9IHRoaXMuaGFuZGxlS2V5ZG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICB0aGlzLm5vZGUgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgdGhpcy5yZW5kZXJQb3J0YWwobmV3UHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUG9ydGFsKHRydWUpO1xuICB9XG5cbiAgaGFuZGxlV3JhcHBlckNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5vcGVuUG9ydGFsKCk7XG4gIH1cblxuICBvcGVuUG9ydGFsKHByb3BzID0gdGhpcy5wcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IHRydWUgfSk7XG4gICAgdGhpcy5yZW5kZXJQb3J0YWwocHJvcHMsIHRydWUpO1xuICB9XG5cbiAgY2xvc2VQb3J0YWwoaXNVbm1vdW50ZWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHJlc2V0UG9ydGFsU3RhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5ub2RlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChpc1VubW91bnRlZCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5iZWZvcmVDbG9zZSkge1xuICAgICAgICB0aGlzLnByb3BzLmJlZm9yZUNsb3NlKHRoaXMubm9kZSwgcmVzZXRQb3J0YWxTdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNldFBvcnRhbFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucG9ydGFsKTtcbiAgICBpZiAocm9vdC5jb250YWlucyhlLnRhcmdldCkgfHwgKGUuYnV0dG9uICYmIGUuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICB9XG5cbiAgaGFuZGxlS2V5ZG93bihlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gS0VZQ09ERVMuRVNDQVBFICYmIHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLmNsb3NlUG9ydGFsKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyUG9ydGFsKHByb3BzLCBpc09wZW5pbmcpIHtcbiAgICBpZiAoIXRoaXMubm9kZSkge1xuICAgICAgdGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamltZmIvZDk5ZTA2NzhlOWRhNzE1Y2NmNjQ1NDk2MWVmMDRkMWJcbiAgICBpZiAodHlwZW9mIHByb3BzLmNoaWxkcmVuLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNoaWxkcmVuID0gUmVhY3QuY2xvbmVFbGVtZW50KHByb3BzLmNoaWxkcmVuLCB7XG4gICAgICAgIGNsb3NlUG9ydGFsOiB0aGlzLmNsb3NlUG9ydGFsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcnRhbCA9IFJlYWN0RE9NLnVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKFxuICAgICAgdGhpcyxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgdGhpcy5ub2RlLFxuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVxuICAgICk7XG4gICAgXG4gICAgaWYgKGlzT3BlbmluZykge1xuICAgICAgdGhpcy5wcm9wcy5vbk9wZW4odGhpcy5ub2RlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub3BlbkJ5Q2xpY2tPbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24sIHtcbiAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5Qb3J0YWwucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgb3BlbkJ5Q2xpY2tPbjogUHJvcFR5cGVzLmVsZW1lbnQsXG4gIGNsb3NlT25Fc2M6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPblNjcm9sbDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBiZWZvcmVDbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXBkYXRlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuUG9ydGFsLmRlZmF1bHRQcm9wcyA9IHtcbiAgb25PcGVuOiAoKSA9PiB7fSxcbiAgb25DbG9zZTogKCkgPT4ge30sXG4gIG9uVXBkYXRlOiAoKSA9PiB7fVxufTsiLCJpbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tICcuLi9jb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3gnO1xuaW1wb3J0IEJvZHkgZnJvbSAnLi4vY29tcG9uZW50cy9mcm9udHBhZ2UvYm9keS5qc3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRleEZyb250cGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBpZD1cInJvb3RcIj5cbiAgICAgIDxOb3RpZmljYXRpb25zPjwvTm90aWZpY2F0aW9ucz5cbiAgICAgIDxCb2R5PjwvQm9keT5cbiAgICA8L2Rpdj4pO1xuICB9XG59IiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLnJlZHV4TG9nZ2VyPWUucmVkdXhMb2dnZXJ8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZS5zdXBlcl89dCxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6ZSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KX1mdW5jdGlvbiByKGUsdCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJraW5kXCIse3ZhbHVlOmUsZW51bWVyYWJsZTohMH0pLHQmJnQubGVuZ3RoJiZPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInBhdGhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbihlLHQscil7bi5zdXBlcl8uY2FsbCh0aGlzLFwiRVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwibGhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG8oZSx0KXtvLnN1cGVyXy5jYWxsKHRoaXMsXCJOXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJyaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gaShlLHQpe2kuc3VwZXJfLmNhbGwodGhpcyxcIkRcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBhKGUsdCxyKXthLnN1cGVyXy5jYWxsKHRoaXMsXCJBXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpbmRleFwiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcIml0ZW1cIix7dmFsdWU6cixlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbChlLHQscil7dmFyIG49ZS5zbGljZSgocnx8dCkrMXx8ZS5sZW5ndGgpO3JldHVybiBlLmxlbmd0aD10PDA/ZS5sZW5ndGgrdDp0LGUucHVzaC5hcHBseShlLG4pLGV9ZnVuY3Rpb24gYyhlKXt2YXIgdD12b2lkIDA9PT1lP1widW5kZWZpbmVkXCI6TihlKTtyZXR1cm5cIm9iamVjdFwiIT09dD90OmU9PT1NYXRoP1wibWF0aFwiOm51bGw9PT1lP1wibnVsbFwiOkFycmF5LmlzQXJyYXkoZSk/XCJhcnJheVwiOlwiW29iamVjdCBEYXRlXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpP1wiZGF0ZVwiOlwiZnVuY3Rpb25cIj09dHlwZW9mIGUudG9TdHJpbmcmJi9eXFwvLipcXC8vLnRlc3QoZS50b1N0cmluZygpKT9cInJlZ2V4cFwiOlwib2JqZWN0XCJ9ZnVuY3Rpb24gdShlLHQscixmLHMsZCxwKXtzPXN8fFtdLHA9cHx8W107dmFyIGc9cy5zbGljZSgwKTtpZih2b2lkIDAhPT1kKXtpZihmKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiZmKGcsZCkpcmV0dXJuO2lmKFwib2JqZWN0XCI9PT0odm9pZCAwPT09Zj9cInVuZGVmaW5lZFwiOk4oZikpKXtpZihmLnByZWZpbHRlciYmZi5wcmVmaWx0ZXIoZyxkKSlyZXR1cm47aWYoZi5ub3JtYWxpemUpe3ZhciBoPWYubm9ybWFsaXplKGcsZCxlLHQpO2gmJihlPWhbMF0sdD1oWzFdKX19fWcucHVzaChkKX1cInJlZ2V4cFwiPT09YyhlKSYmXCJyZWdleHBcIj09PWModCkmJihlPWUudG9TdHJpbmcoKSx0PXQudG9TdHJpbmcoKSk7dmFyIHY9dm9pZCAwPT09ZT9cInVuZGVmaW5lZFwiOk4oZSkseT12b2lkIDA9PT10P1widW5kZWZpbmVkXCI6Tih0KSxiPVwidW5kZWZpbmVkXCIhPT12fHxwJiZwW3AubGVuZ3RoLTFdLmxocyYmcFtwLmxlbmd0aC0xXS5saHMuaGFzT3duUHJvcGVydHkoZCksbT1cInVuZGVmaW5lZFwiIT09eXx8cCYmcFtwLmxlbmd0aC0xXS5yaHMmJnBbcC5sZW5ndGgtMV0ucmhzLmhhc093blByb3BlcnR5KGQpO2lmKCFiJiZtKXIobmV3IG8oZyx0KSk7ZWxzZSBpZighbSYmYilyKG5ldyBpKGcsZSkpO2Vsc2UgaWYoYyhlKSE9PWModCkpcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJkYXRlXCI9PT1jKGUpJiZlLXQhPTApcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJvYmplY3RcIj09PXYmJm51bGwhPT1lJiZudWxsIT09dClpZihwLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdC5saHM9PT1lfSkubGVuZ3RoKWUhPT10JiZyKG5ldyBuKGcsZSx0KSk7ZWxzZXtpZihwLnB1c2goe2xoczplLHJoczp0fSksQXJyYXkuaXNBcnJheShlKSl7dmFyIHc7ZS5sZW5ndGg7Zm9yKHc9MDt3PGUubGVuZ3RoO3crKyl3Pj10Lmxlbmd0aD9yKG5ldyBhKGcsdyxuZXcgaSh2b2lkIDAsZVt3XSkpKTp1KGVbd10sdFt3XSxyLGYsZyx3LHApO2Zvcig7dzx0Lmxlbmd0aDspcihuZXcgYShnLHcsbmV3IG8odm9pZCAwLHRbdysrXSkpKX1lbHNle3ZhciB4PU9iamVjdC5rZXlzKGUpLFM9T2JqZWN0LmtleXModCk7eC5mb3JFYWNoKGZ1bmN0aW9uKG4sbyl7dmFyIGk9Uy5pbmRleE9mKG4pO2k+PTA/KHUoZVtuXSx0W25dLHIsZixnLG4scCksUz1sKFMsaSkpOnUoZVtuXSx2b2lkIDAscixmLGcsbixwKX0pLFMuZm9yRWFjaChmdW5jdGlvbihlKXt1KHZvaWQgMCx0W2VdLHIsZixnLGUscCl9KX1wLmxlbmd0aD1wLmxlbmd0aC0xfWVsc2UgZSE9PXQmJihcIm51bWJlclwiPT09diYmaXNOYU4oZSkmJmlzTmFOKHQpfHxyKG5ldyBuKGcsZSx0KSkpfWZ1bmN0aW9uIGYoZSx0LHIsbil7cmV0dXJuIG49bnx8W10sdShlLHQsZnVuY3Rpb24oZSl7ZSYmbi5wdXNoKGUpfSxyKSxuLmxlbmd0aD9uOnZvaWQgMH1mdW5jdGlvbiBzKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG9bci5wYXRoW25dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm9bci5wYXRoW25dXT1yLnJoc319ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZT1sKGUsdCk7YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjplW3RdPXIucmhzfXJldHVybiBlfWZ1bmN0aW9uIGQoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7Zm9yKHZhciBuPWUsbz0tMSxpPXIucGF0aD9yLnBhdGgubGVuZ3RoLTE6MDsrK288aTspdm9pZCAwPT09bltyLnBhdGhbb11dJiYobltyLnBhdGhbb11dPVwibnVtYmVyXCI9PXR5cGVvZiByLnBhdGhbb10/W106e30pLG49bltyLnBhdGhbb11dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKHIucGF0aD9uW3IucGF0aFtvXV06bixyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBuW3IucGF0aFtvXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpuW3IucGF0aFtvXV09ci5yaHN9fX1mdW5jdGlvbiBwKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6Y2FzZVwiRVwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIG9bci5wYXRoW25dXX19ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6Y2FzZVwiRVwiOmVbdF09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmU9bChlLHQpfXJldHVybiBlfWZ1bmN0aW9uIGcoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7dmFyIG4sbyxpPWU7Zm9yKG89ci5wYXRoLmxlbmd0aC0xLG49MDtuPG87bisrKXZvaWQgMD09PWlbci5wYXRoW25dXSYmKGlbci5wYXRoW25dXT17fSksaT1pW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoaVtyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6Y2FzZVwiRVwiOmlbci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIGlbci5wYXRoW25dXX19fWZ1bmN0aW9uIGgoZSx0LHIpe2lmKGUmJnQpe3UoZSx0LGZ1bmN0aW9uKG4pe3ImJiFyKGUsdCxuKXx8ZChlLHQsbil9KX19ZnVuY3Rpb24gdihlKXtyZXR1cm5cImNvbG9yOiBcIitGW2VdLmNvbG9yK1wiOyBmb250LXdlaWdodDogYm9sZFwifWZ1bmN0aW9uIHkoZSl7dmFyIHQ9ZS5raW5kLHI9ZS5wYXRoLG49ZS5saHMsbz1lLnJocyxpPWUuaW5kZXgsYT1lLml0ZW07c3dpdGNoKHQpe2Nhc2VcIkVcIjpyZXR1cm5bci5qb2luKFwiLlwiKSxuLFwi4oaSXCIsb107Y2FzZVwiTlwiOnJldHVybltyLmpvaW4oXCIuXCIpLG9dO2Nhc2VcIkRcIjpyZXR1cm5bci5qb2luKFwiLlwiKV07Y2FzZVwiQVwiOnJldHVybltyLmpvaW4oXCIuXCIpK1wiW1wiK2krXCJdXCIsYV07ZGVmYXVsdDpyZXR1cm5bXX19ZnVuY3Rpb24gYihlLHQscixuKXt2YXIgbz1mKGUsdCk7dHJ5e24/ci5ncm91cENvbGxhcHNlZChcImRpZmZcIik6ci5ncm91cChcImRpZmZcIil9Y2F0Y2goZSl7ci5sb2coXCJkaWZmXCIpfW8/by5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWUua2luZCxuPXkoZSk7ci5sb2cuYXBwbHkocixbXCIlYyBcIitGW3RdLnRleHQsdih0KV0uY29uY2F0KFAobikpKX0pOnIubG9nKFwi4oCU4oCUIG5vIGRpZmYg4oCU4oCUXCIpO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgZGlmZiBlbmQg4oCU4oCUIFwiKX19ZnVuY3Rpb24gbShlLHQscixuKXtzd2l0Y2godm9pZCAwPT09ZT9cInVuZGVmaW5lZFwiOk4oZSkpe2Nhc2VcIm9iamVjdFwiOnJldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGVbbl0/ZVtuXS5hcHBseShlLFAocikpOmVbbl07Y2FzZVwiZnVuY3Rpb25cIjpyZXR1cm4gZSh0KTtkZWZhdWx0OnJldHVybiBlfX1mdW5jdGlvbiB3KGUpe3ZhciB0PWUudGltZXN0YW1wLHI9ZS5kdXJhdGlvbjtyZXR1cm4gZnVuY3Rpb24oZSxuLG8pe3ZhciBpPVtcImFjdGlvblwiXTtyZXR1cm4gaS5wdXNoKFwiJWNcIitTdHJpbmcoZS50eXBlKSksdCYmaS5wdXNoKFwiJWNAIFwiK24pLHImJmkucHVzaChcIiVjKGluIFwiK28udG9GaXhlZCgyKStcIiBtcylcIiksaS5qb2luKFwiIFwiKX19ZnVuY3Rpb24geChlLHQpe3ZhciByPXQubG9nZ2VyLG49dC5hY3Rpb25UcmFuc2Zvcm1lcixvPXQudGl0bGVGb3JtYXR0ZXIsaT12b2lkIDA9PT1vP3codCk6byxhPXQuY29sbGFwc2VkLGw9dC5jb2xvcnMsYz10LmxldmVsLHU9dC5kaWZmLGY9dm9pZCAwPT09dC50aXRsZUZvcm1hdHRlcjtlLmZvckVhY2goZnVuY3Rpb24obyxzKXt2YXIgZD1vLnN0YXJ0ZWQscD1vLnN0YXJ0ZWRUaW1lLGc9by5hY3Rpb24saD1vLnByZXZTdGF0ZSx2PW8uZXJyb3IseT1vLnRvb2ssdz1vLm5leHRTdGF0ZSx4PWVbcysxXTt4JiYodz14LnByZXZTdGF0ZSx5PXguc3RhcnRlZC1kKTt2YXIgUz1uKGcpLGo9XCJmdW5jdGlvblwiPT10eXBlb2YgYT9hKGZ1bmN0aW9uKCl7cmV0dXJuIHd9LGcsbyk6YSxrPUQocCksRT1sLnRpdGxlP1wiY29sb3I6IFwiK2wudGl0bGUoUykrXCI7XCI6XCJcIixBPVtcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIl07QS5wdXNoKEUpLHQudGltZXN0YW1wJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpLHQuZHVyYXRpb24mJkEucHVzaChcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIik7dmFyIE89aShTLGsseSk7dHJ5e2o/bC50aXRsZSYmZj9yLmdyb3VwQ29sbGFwc2VkLmFwcGx5KHIsW1wiJWMgXCIrT10uY29uY2F0KEEpKTpyLmdyb3VwQ29sbGFwc2VkKE8pOmwudGl0bGUmJmY/ci5ncm91cC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cChPKX1jYXRjaChlKXtyLmxvZyhPKX12YXIgTj1tKGMsUyxbaF0sXCJwcmV2U3RhdGVcIiksUD1tKGMsUyxbU10sXCJhY3Rpb25cIiksQz1tKGMsUyxbdixoXSxcImVycm9yXCIpLEY9bShjLFMsW3ddLFwibmV4dFN0YXRlXCIpO2lmKE4paWYobC5wcmV2U3RhdGUpe3ZhciBMPVwiY29sb3I6IFwiK2wucHJldlN0YXRlKGgpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbTl0oXCIlYyBwcmV2IHN0YXRlXCIsTCxoKX1lbHNlIHJbTl0oXCJwcmV2IHN0YXRlXCIsaCk7aWYoUClpZihsLmFjdGlvbil7dmFyIFQ9XCJjb2xvcjogXCIrbC5hY3Rpb24oUykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltQXShcIiVjIGFjdGlvbiAgICBcIixULFMpfWVsc2UgcltQXShcImFjdGlvbiAgICBcIixTKTtpZih2JiZDKWlmKGwuZXJyb3Ipe3ZhciBNPVwiY29sb3I6IFwiK2wuZXJyb3IodixoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCI7cltDXShcIiVjIGVycm9yICAgICBcIixNLHYpfWVsc2UgcltDXShcImVycm9yICAgICBcIix2KTtpZihGKWlmKGwubmV4dFN0YXRlKXt2YXIgXz1cImNvbG9yOiBcIitsLm5leHRTdGF0ZSh3KStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW0ZdKFwiJWMgbmV4dCBzdGF0ZVwiLF8sdyl9ZWxzZSByW0ZdKFwibmV4dCBzdGF0ZVwiLHcpO3UmJmIoaCx3LHIsaik7dHJ5e3IuZ3JvdXBFbmQoKX1jYXRjaChlKXtyLmxvZyhcIuKAlOKAlCBsb2cgZW5kIOKAlOKAlFwiKX19KX1mdW5jdGlvbiBTKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9T2JqZWN0LmFzc2lnbih7fSxMLGUpLHI9dC5sb2dnZXIsbj10LnN0YXRlVHJhbnNmb3JtZXIsbz10LmVycm9yVHJhbnNmb3JtZXIsaT10LnByZWRpY2F0ZSxhPXQubG9nRXJyb3JzLGw9dC5kaWZmUHJlZGljYXRlO2lmKHZvaWQgMD09PXIpcmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTtpZihlLmdldFN0YXRlJiZlLmRpc3BhdGNoKXJldHVybiBjb25zb2xlLmVycm9yKFwiW3JlZHV4LWxvZ2dlcl0gcmVkdXgtbG9nZ2VyIG5vdCBpbnN0YWxsZWQuIE1ha2Ugc3VyZSB0byBwYXNzIGxvZ2dlciBpbnN0YW5jZSBhcyBtaWRkbGV3YXJlOlxcbi8vIExvZ2dlciB3aXRoIGRlZmF1bHQgb3B0aW9uc1xcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcbi8vIE9yIHlvdSBjYW4gY3JlYXRlIHlvdXIgb3duIGxvZ2dlciB3aXRoIGN1c3RvbSBvcHRpb25zIGh0dHA6Ly9iaXQubHkvcmVkdXgtbG9nZ2VyLW9wdGlvbnNcXG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICdyZWR1eC1sb2dnZXInXFxuY29uc3QgbG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcXG4gIC8vIC4uLm9wdGlvbnNcXG59KTtcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcblwiKSxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGUodCl9fX07dmFyIGM9W107cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciByPWUuZ2V0U3RhdGU7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih1KXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBpJiYhaShyLHUpKXJldHVybiBlKHUpO3ZhciBmPXt9O2MucHVzaChmKSxmLnN0YXJ0ZWQ9Ty5ub3coKSxmLnN0YXJ0ZWRUaW1lPW5ldyBEYXRlLGYucHJldlN0YXRlPW4ocigpKSxmLmFjdGlvbj11O3ZhciBzPXZvaWQgMDtpZihhKXRyeXtzPWUodSl9Y2F0Y2goZSl7Zi5lcnJvcj1vKGUpfWVsc2Ugcz1lKHUpO2YudG9vaz1PLm5vdygpLWYuc3RhcnRlZCxmLm5leHRTdGF0ZT1uKHIoKSk7dmFyIGQ9dC5kaWZmJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wocix1KTp0LmRpZmY7aWYoeChjLE9iamVjdC5hc3NpZ24oe30sdCx7ZGlmZjpkfSkpLGMubGVuZ3RoPTAsZi5lcnJvcil0aHJvdyBmLmVycm9yO3JldHVybiBzfX19fXZhciBqLGssRT1mdW5jdGlvbihlLHQpe3JldHVybiBuZXcgQXJyYXkodCsxKS5qb2luKGUpfSxBPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIEUoXCIwXCIsdC1lLnRvU3RyaW5nKCkubGVuZ3RoKStlfSxEPWZ1bmN0aW9uKGUpe3JldHVybiBBKGUuZ2V0SG91cnMoKSwyKStcIjpcIitBKGUuZ2V0TWludXRlcygpLDIpK1wiOlwiK0EoZS5nZXRTZWNvbmRzKCksMikrXCIuXCIrQShlLmdldE1pbGxpc2Vjb25kcygpLDMpfSxPPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBwZXJmb3JtYW5jZSYmbnVsbCE9PXBlcmZvcm1hbmNlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBwZXJmb3JtYW5jZS5ub3c/cGVyZm9ybWFuY2U6RGF0ZSxOPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJmUuY29uc3RydWN0b3I9PT1TeW1ib2wmJmUhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIGV9LFA9ZnVuY3Rpb24oZSl7aWYoQXJyYXkuaXNBcnJheShlKSl7Zm9yKHZhciB0PTAscj1BcnJheShlLmxlbmd0aCk7dDxlLmxlbmd0aDt0Kyspclt0XT1lW3RdO3JldHVybiByfXJldHVybiBBcnJheS5mcm9tKGUpfSxDPVtdO2o9XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZ2xvYmFsP1widW5kZWZpbmVkXCI6TihnbG9iYWwpKSYmZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp7fSxrPWouRGVlcERpZmYsayYmQy5wdXNoKGZ1bmN0aW9uKCl7dm9pZCAwIT09ayYmai5EZWVwRGlmZj09PWYmJihqLkRlZXBEaWZmPWssaz12b2lkIDApfSksdChuLHIpLHQobyxyKSx0KGksciksdChhLHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGYse2RpZmY6e3ZhbHVlOmYsZW51bWVyYWJsZTohMH0sb2JzZXJ2YWJsZURpZmY6e3ZhbHVlOnUsZW51bWVyYWJsZTohMH0sYXBwbHlEaWZmOnt2YWx1ZTpoLGVudW1lcmFibGU6ITB9LGFwcGx5Q2hhbmdlOnt2YWx1ZTpkLGVudW1lcmFibGU6ITB9LHJldmVydENoYW5nZTp7dmFsdWU6ZyxlbnVtZXJhYmxlOiEwfSxpc0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB2b2lkIDAhPT1rfSxlbnVtZXJhYmxlOiEwfSxub0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBDJiYoQy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UoKX0pLEM9bnVsbCksZn0sZW51bWVyYWJsZTohMH19KTt2YXIgRj17RTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkNIQU5HRUQ6XCJ9LE46e2NvbG9yOlwiIzRDQUY1MFwiLHRleHQ6XCJBRERFRDpcIn0sRDp7Y29sb3I6XCIjRjQ0MzM2XCIsdGV4dDpcIkRFTEVURUQ6XCJ9LEE6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJBUlJBWTpcIn19LEw9e2xldmVsOlwibG9nXCIsbG9nZ2VyOmNvbnNvbGUsbG9nRXJyb3JzOiEwLGNvbGxhcHNlZDp2b2lkIDAscHJlZGljYXRlOnZvaWQgMCxkdXJhdGlvbjohMSx0aW1lc3RhbXA6ITAsc3RhdGVUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sYWN0aW9uVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGVycm9yVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGNvbG9yczp7dGl0bGU6ZnVuY3Rpb24oKXtyZXR1cm5cImluaGVyaXRcIn0scHJldlN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjOUU5RTlFXCJ9LGFjdGlvbjpmdW5jdGlvbigpe3JldHVyblwiIzAzQTlGNFwifSxuZXh0U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM0Q0FGNTBcIn0sZXJyb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIiNGMjA0MDRcIn19LGRpZmY6ITEsZGlmZlByZWRpY2F0ZTp2b2lkIDAsdHJhbnNmb3JtZXI6dm9pZCAwfSxUPWZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9ZS5kaXNwYXRjaCxyPWUuZ2V0U3RhdGU7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgcilyZXR1cm4gUygpKHtkaXNwYXRjaDp0LGdldFN0YXRlOnJ9KTtjb25zb2xlLmVycm9yKFwiXFxuW3JlZHV4LWxvZ2dlciB2M10gQlJFQUtJTkcgQ0hBTkdFXFxuW3JlZHV4LWxvZ2dlciB2M10gU2luY2UgMy4wLjAgcmVkdXgtbG9nZ2VyIGV4cG9ydHMgYnkgZGVmYXVsdCBsb2dnZXIgd2l0aCBkZWZhdWx0IHNldHRpbmdzLlxcbltyZWR1eC1sb2dnZXIgdjNdIENoYW5nZVxcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbltyZWR1eC1sb2dnZXIgdjNdIHRvXFxuW3JlZHV4LWxvZ2dlciB2M10gaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcblwiKX07ZS5kZWZhdWx0cz1MLGUuY3JlYXRlTG9nZ2VyPVMsZS5sb2dnZXI9VCxlLmRlZmF1bHQ9VCxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuIiwiaW1wb3J0IHtsb2dnZXJ9IGZyb20gJy4vZGVidWcvcmVkdXgtbG9nZ2VyJztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuaydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuQXBwKHJlZHVjZXIsIEFwcCwgY2FsbGJhY2spe1xuICBsZXQgc3RvcmUgPSBSZWR1eC5jcmVhdGVTdG9yZShyZWR1Y2VyLCBSZWR1eC5hcHBseU1pZGRsZXdhcmUobG9nZ2VyLCB0aHVuaykpO1xuICBsZXQgUHJvdmlkZXIgPSBSZWFjdFJlZHV4LlByb3ZpZGVyO1xuXG4gIFJlYWN0RE9NLnJlbmRlcig8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICA8QXBwLz5cbiAgPC9Qcm92aWRlcj4sIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXBwXCIpKTtcbiAgXG4gIGxldCBuZXdTdG9yZSA9IHtcbiAgICBkaXNwYXRjaChhY3Rpb24pe1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbihzdG9yZS5kaXNwYXRjaCwgc3RvcmUuZ2V0U3RhdGUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICB9LFxuICAgIHN1YnNjcmliZSguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5zdWJzY3JpYmUoLi4uYXJncyk7XG4gICAgfSxcbiAgICBnZXRTdGF0ZSguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5nZXRTdGF0ZSguLi5hcmdzKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWR1Y2VyKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLnJlcGxhY2VSZWR1Y2VyKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuICBcbiAgY29uc3Qgb0Nvbm5lY3QgPSBSZWFjdFJlZHV4LmNvbm5lY3Q7XG4gIFJlYWN0UmVkdXguY29ubmVjdCA9IGZ1bmN0aW9uKG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKXtcbiAgICByZXR1cm4gb0Nvbm5lY3QoKHN0YXRlKT0+e1xuICAgICAgbGV0IHZhbHVlID0gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKTtcbiAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKChrZXkpPT57XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVba2V5XSA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBzdGF0ZSB2YWx1ZSBmb3Iga2V5IFwiICsga2V5ICsgXCIgeW91IG1vc3QgbGlrZWx5IGZvcmdvdCB0byBjb21iaW5lIHRoZSByZWR1Y2VycyB3aXRoaW4gdGhlIHJvb3QgcmVkdWNlciBmaWxlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCBtYXBEaXNwYXRjaFRvUHJvcHMpO1xuICB9XG4gIFxuICBjYWxsYmFjayAmJiBjYWxsYmFjayhuZXdTdG9yZSk7XG59IiwiaW1wb3J0IEFwcCBmcm9tICcuL2NvbnRhaW5lcnMvaW5kZXguZnJvbnRwYWdlLmpzeCc7XG5pbXBvcnQgcmVkdWNlciBmcm9tICcuL3JlZHVjZXJzL2luZGV4LmZyb250cGFnZSc7XG5pbXBvcnQgcnVuQXBwIGZyb20gJy4vZGVmYXVsdC5kZWJ1Zy5qc3gnO1xuaW1wb3J0IHdlYnNvY2tldCBmcm9tICcuL3V0aWwvd2Vic29ja2V0JztcblxucnVuQXBwKHJlZHVjZXIsIEFwcCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbiAgdmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaW52YXJpYW50KHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSA9PT0gJ2Z1bmN0aW9uJywgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gJyArICdSZWFjdC5Qcm9wVHlwZXMuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lKTtcbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgJXMgdHlwZTogJXMlcycsIGxvY2F0aW9uLCBlcnJvci5tZXNzYWdlLCBzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzaGltKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgaWYgKHNlY3JldCA9PT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgIC8vIEl0IGlzIHN0aWxsIHNhZmUgd2hlbiBjYWxsZWQgZnJvbSBSZWFjdC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW52YXJpYW50KFxuICAgICAgZmFsc2UsXG4gICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAnVXNlIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICApO1xuICB9O1xuICBzaGltLmlzUmVxdWlyZWQgPSBzaGltO1xuICBmdW5jdGlvbiBnZXRTaGltKCkge1xuICAgIHJldHVybiBzaGltO1xuICB9O1xuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IHNoaW0sXG4gICAgYm9vbDogc2hpbSxcbiAgICBmdW5jOiBzaGltLFxuICAgIG51bWJlcjogc2hpbSxcbiAgICBvYmplY3Q6IHNoaW0sXG4gICAgc3RyaW5nOiBzaGltLFxuICAgIHN5bWJvbDogc2hpbSxcblxuICAgIGFueTogc2hpbSxcbiAgICBhcnJheU9mOiBnZXRTaGltLFxuICAgIGVsZW1lbnQ6IHNoaW0sXG4gICAgaW5zdGFuY2VPZjogZ2V0U2hpbSxcbiAgICBub2RlOiBzaGltLFxuICAgIG9iamVjdE9mOiBnZXRTaGltLFxuICAgIG9uZU9mOiBnZXRTaGltLFxuICAgIG9uZU9mVHlwZTogZ2V0U2hpbSxcbiAgICBzaGFwZTogZ2V0U2hpbVxuICB9O1xuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gZW1wdHlGdW5jdGlvbjtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vY2hlY2tQcm9wVHlwZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAvKiBnbG9iYWwgU3ltYm9sICovXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIG1ldGhvZCBmdW5jdGlvbiBjb250YWluZWQgb24gdGhlIGl0ZXJhYmxlIG9iamVjdC5cbiAgICpcbiAgICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gICAqXG4gICAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gICAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgKiAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobXlJdGVyYWJsZSk7XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICAgKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICAgKlxuICAgKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gICAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gICAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAgICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAgICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICAgKiAgICAgfSxcbiAgICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAgICpcbiAgICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gICAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICAgKlxuICAgKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gICAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAgICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICAgKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICogICAgICAgICAgKTtcbiAgICogICAgICAgIH1cbiAgICogICAgICB9XG4gICAqICAgIH0sXG4gICAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICAgKiAgfSk7XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICB2YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJXMgYXQgaW5kZXggJXMuJyxcbiAgICAgICAgICBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlciksXG4gICAgICAgICAgaVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9ICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmXG4gICAgU3ltYm9sLmZvciAmJlxuICAgIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSkgfHxcbiAgICAweGVhYzc7XG5cbiAgdmFyIGlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICBvYmplY3QgIT09IG51bGwgJiZcbiAgICAgIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICB9O1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmZ1bmN0aW9uIGNyZWF0ZVRodW5rTWlkZGxld2FyZShleHRyYUFyZ3VtZW50KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBkaXNwYXRjaCA9IF9yZWYuZGlzcGF0Y2gsXG4gICAgICAgIGdldFN0YXRlID0gX3JlZi5nZXRTdGF0ZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUsIGV4dHJhQXJndW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbn1cblxudmFyIHRodW5rID0gY3JlYXRlVGh1bmtNaWRkbGV3YXJlKCk7XG50aHVuay53aXRoRXh0cmFBcmd1bWVudCA9IGNyZWF0ZVRodW5rTWlkZGxld2FyZTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gdGh1bms7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaTE4bihzdGF0ZT17XG4gIHRleHQ6IHtcbiAgICBnZXQoa2V5LCAuLi5hcmdzKXtcbiAgICAgIGxldCB0ZXh0ID0gZ2V0TG9jYWxlVGV4dChrZXksIGFyZ3MpO1xuICAgICAgaWYgKHRleHQpe1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9ybWF0KGRhdGU9bmV3IERhdGUoKSwgZm9ybWF0PVwiTFwiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZvcm1hdChmb3JtYXQpO1xuICAgIH0sXG4gICAgZnJvbU5vdyhkYXRlPW5ldyBEYXRlKCkpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZnJvbU5vdygpO1xuICAgIH0sXG4gICAgc3VidHJhY3QoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5zdWJ0cmFjdChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfSxcbiAgICBhZGQoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5hZGQoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH1cbiAgfVxufSwgYWN0aW9uKXtcbiAgcmV0dXJuIHN0YXRlO1xufSIsIi8vVE9ETyB0aGlzIHJlZHVjZXIgdXNlcyB0aGUgYXBpIHRoYXQgaW50ZXJhY3RzIHdpdGggdGhlIERPTSBpbiBvcmRlciB0b1xuLy9yZXRyaWV2ZSBkYXRhLCBwbGVhc2UgZml4IGluIG5leHQgdmVyc2lvbnNcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlcyhzdGF0ZT17XG4gIGF2YWxpYWJsZTogJC5tYWtlQXJyYXkoJChcIiNsYW5ndWFnZS1waWNrZXIgYVwiKS5tYXAoKGluZGV4LCBlbGVtZW50KT0+e1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAkKGVsZW1lbnQpLnRleHQoKS50cmltKCksXG4gICAgICBsb2NhbGU6ICQoZWxlbWVudCkuZGF0YSgnbG9jYWxlJylcbiAgICB9XG4gIH0pKSxcbiAgY3VycmVudDogJChcIiNsb2NhbGVcIikudGV4dCgpXG59LCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRVRfTE9DQUxFJyl7XG4gICAgLy9UT0RPIEZvciBzb21lIHJlYXNvbiB0aGlzIGRvZXNuJ3Qgd2FudCB0byB3b3JrLCB0aGlzIHJlZHVjZXIgbmVlZHMgdXJnZW50IGZpeFxuICAgICQoJyNsYW5ndWFnZS1waWNrZXIgYVtkYXRhLWxvY2FsZT1cIicgKyBhY3Rpb24ucGF5bG9hZCArICdcIl0nKS5jbGljaygpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge2N1cnJlbnQ6IGFjdGlvbi5wYXlsb2FkfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnMoc3RhdGU9W10sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0FERF9OT1RJRklDQVRJT04nKSB7XG4gICAgdmFyIGlkID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gc3RhdGUuY29uY2F0KE9iamVjdC5hc3NpZ24oe2lkOiBpZH0sIGFjdGlvbi5wYXlsb2FkKSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09ICdISURFX05PVElGSUNBVElPTicpIHtcbiAgICByZXR1cm4gc3RhdGUuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgcmV0dXJuIGVsZW1lbnQuaWQgIT09IGFjdGlvbi5wYXlsb2FkLmlkO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCIvL1RoaXMgb25lIGFsc28gdXNlcyBhIGhhY2sgdG8gYWNjZXNzIHRoZSBkYXRhIGluIHRoZSBkb21cbi8vcGxlYXNlIHJlcGxhY2UgaXQgd2l0aCB0aGUgZm9sbG93aW5nIHByb2NlZHVyZVxuLy8xLiBDcmVhdGUgYSByZXN0IGVuZHBvaW50IHRvIGdldCB0aGUgcGVybWlzc2lvbnMgbGlzdFxuLy8yLiBpbiB0aGUgbWFpbiBmaWxlIGdhdGhlciB0aG9zZSBwZXJtaXNzaW9ucy4uLiBldGMuLi4sIGVnLiBpbmRleC5qcyBtYWtlIGEgY2FsbFxuLy8zLiBkaXNwYXRjaCB0aGUgYWN0aW9uIHRvIHRoaXMgc2FtZSByZWR1Y2VyIGFuZCBnYXRoZXIgdGhlIGFjdGlvbiBoZXJlXG4vLzQuIGl0IHdvcmtzIDpEXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXR1cyhzdGF0ZT17XG4gIGxvZ2dlZEluOiAhIU1VSUtLVV9MT0dHRURfVVNFUl9JRCxcbiAgdXNlcklkOiBNVUlLS1VfTE9HR0VEX1VTRVJfSUQsXG4gIHBlcm1pc3Npb25zOiBNVUlLS1VfUEVSTUlTU0lPTlMsXG4gIGNvbnRleHRQYXRoOiBDT05URVhUUEFUSFxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBcIkxPR09VVFwiKXtcbiAgICAkKCcjbG9nb3V0JykuY2xpY2soKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBub3RpZmljYXRpb25zIGZyb20gJy4vYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vYmFzZS9sb2NhbGVzJztcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi9iYXNlL3N0YXR1cyc7XG5pbXBvcnQgaTE4biBmcm9tICcuL2Jhc2UvaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IFJlZHV4LmNvbWJpbmVSZWR1Y2Vycyh7XG4gIG5vdGlmaWNhdGlvbnMsXG4gIGkxOG4sXG4gIGxvY2FsZXMsXG4gIHN0YXR1c1xufSk7IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWlra3VXZWJzb2NrZXQge1xuICBjb25zdHJ1Y3RvcihzdG9yZSwgbGlzdGVuZXJzPVtdLCBvcHRpb25zPXtcbiAgICByZWNvbm5lY3RJbnRlcnZhbDogMjAwLFxuICAgIHBpbmdUaW1lU3RlcDogMTAwMCxcbiAgICBwaW5nVGltZW91dDogMTAwMDBcbiAgfSkge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XG4gICAgXG4gICAgdGhpcy50aWNrZXQgPSBudWxsO1xuICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLnNvY2tldE9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZyA9IFtdO1xuICAgIHRoaXMucGluZ0hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgXG4gICAgdGhpcy5nZXRUaWNrZXQoKHRpY2tldCk9PiB7XG4gICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgdGhpcy5vcGVuV2ViU29ja2V0KCk7XG4gICAgICAgIHRoaXMuc3RhcnRQaW5naW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBiZWNhdXNlIHRpY2tldCB3YXMgbWlzc2luZ1wiLCAnZXJyb3InKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgdGhpcy5vbkJlZm9yZVdpbmRvd1VubG9hZC5iaW5kKHRoaXMpKTtcbiAgfVxuICBzZW5kTWVzc2FnZShldmVudFR5cGUsIGRhdGEpe1xuICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgZXZlbnRUeXBlLFxuICAgICAgZGF0YVxuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5zb2NrZXRPcGVuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcucHVzaCh7XG4gICAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcucHVzaChtZXNzYWdlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHRyaWdnZXIoZXZlbnQsIGRhdGE9bnVsbCl7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAndHlwZSc6ICdXRUJTT0NLRVRfRVZFTlQnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBkYXRhXG4gICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2V2ZW50XSl7XG4gICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnRdO1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgIGxpc3RlbmVycyhkYXRhKTtcbiAgICAgIH1cbiAgICAgIGZvciAoYWN0aW9uIG9mIGxpc3RlbmVycyl7XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0VGlja2V0KGNhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICAvLyBXZSBoYXZlIGEgdGlja2V0LCBzbyB3ZSBuZWVkIHRvIHZhbGlkYXRlIGl0IGJlZm9yZSB1c2luZyBpdFxuICAgICAgICBtQXBpKCkud2Vic29ja2V0LmNhY2hlQ2xlYXIoKS50aWNrZXQuY2hlY2sucmVhZCh0aGlzLnRpY2tldCkuY2FsbGJhY2soJC5wcm94eShmdW5jdGlvbiAoZXJyLCByZXNwb25zZSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFRpY2tldCBkaWQgbm90IHBhc3MgdmFsaWRhdGlvbiwgc28gd2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgb25lXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpY2tldCgkLnByb3h5KGZ1bmN0aW9uICh0aWNrZXQpIHtcbiAgICAgICAgICAgICAgdGhpcy50aWNrZXQgPSB0aWNrZXQ7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHRpY2tldCk7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRpY2tldCBwYXNzZWQgdmFsaWRhdGlvbiwgc28gd2UgdXNlIGl0XG4gICAgICAgICAgICBjYWxsYmFjayh0aGlzLnRpY2tldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IHRpY2tldFxuICAgICAgICB0aGlzLmNyZWF0ZVRpY2tldCgodGlja2V0KT0+e1xuICAgICAgICAgIHRoaXMudGlja2V0ID0gdGlja2V0O1xuICAgICAgICAgIGNhbGxiYWNrKHRpY2tldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiVGlja2V0IGNyZWF0aW9uIGZhaWxlZCBvbiBhbiBpbnRlcm5hbCBlcnJvclwiLCAnZXJyb3InKSk7XG4gICAgfVxuICB9XG4gIFxuICBjcmVhdGVUaWNrZXQoY2FsbGJhY2spIHtcbiAgICBtQXBpKCkud2Vic29ja2V0LnRpY2tldC5jcmVhdGUoKVxuICAgICAgLmNhbGxiYWNrKChlcnIsIHRpY2tldCk9PntcbiAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayh0aWNrZXQudGlja2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBjcmVhdGUgV2ViU29ja2V0IHRpY2tldFwiLCAnZXJyb3InKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG4gIFxuICBvbldlYlNvY2tldENvbm5lY3RlZCgpIHtcbiAgICB0aGlzLnNvY2tldE9wZW4gPSB0cnVlO1xuICAgIHRoaXMudHJpZ2dlcihcIndlYlNvY2tldENvbm5lY3RlZFwiKTsgXG4gICAgXG4gICAgd2hpbGUgKHRoaXMuc29ja2V0T3BlbiAmJiB0aGlzLm1lc3NhZ2VzUGVuZGluZy5sZW5ndGgpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tZXNzYWdlc1BlbmRpbmcuc2hpZnQoKTtcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobWVzc2FnZS5ldmVudFR5cGUsIG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG4gIFxuICBvbldlYlNvY2tldEVycm9yKCkge1xuICAgIHRoaXMucmVjb25uZWN0KCk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0Q2xvc2UoKSB7XG4gICAgdGhpcy50cmlnZ2VyKFwid2ViU29ja2V0RGlzY29ubmVjdGVkXCIpOyBcbiAgICB0aGlzLnJlY29ubmVjdCgpO1xuICB9XG4gIFxuICBvcGVuV2ViU29ja2V0KCkge1xuICAgIGxldCBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgbGV0IHNlY3VyZSA9IGxvY2F0aW9uLnByb3RvY29sID09ICdodHRwczonO1xuICAgIHRoaXMud2ViU29ja2V0ID0gdGhpcy5jcmVhdGVXZWJTb2NrZXQoKHNlY3VyZSA/ICd3c3M6Ly8nIDogJ3dzOi8vJykgKyBob3N0ICsgJy93cy9zb2NrZXQvJyArIHRoaXMudGlja2V0KTtcbiAgICBcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMub25XZWJTb2NrZXRNZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gdGhpcy5vbldlYlNvY2tldEVycm9yLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gdGhpcy5vbldlYlNvY2tldENsb3NlLmJpbmQodGhpcyk7XG4gICAgICBzd2l0Y2ggKHRoaXMud2ViU29ja2V0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgY2FzZSB0aGlzLndlYlNvY2tldC5DT05ORUNUSU5HOlxuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9ub3BlbiA9IHRoaXMub25XZWJTb2NrZXRDb25uZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdGhpcy53ZWJTb2NrZXQuT1BFTjpcbiAgICAgICAgICB0aGlzLm9uV2ViU29ja2V0Q29ubmVjdGVkKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiV2ViU29ja2V0IGNvbm5lY3Rpb24gZmFpbGVkXCIsICdlcnJvcicpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGNvbm5lY3Rpb25cIiwgJ2Vycm9yJykpO1xuICAgIH1cbiAgfVxuICBcbiAgY3JlYXRlV2ViU29ja2V0KHVybCkge1xuICAgIGlmICgodHlwZW9mIHdpbmRvdy5XZWJTb2NrZXQpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93Lk1veldlYlNvY2tldCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE1veldlYlNvY2tldCh1cmwpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgc3RhcnRQaW5naW5nKCkge1xuICAgIHRoaXMucGluZ0hhbmRsZSA9IHNldEludGVydmFsKCgpPT57XG4gICAgICBpZiAodGhpcy5zb2NrZXRPcGVuID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMucGluZ2luZykge1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKFwicGluZzpwaW5nXCIsIHt9KTtcbiAgICAgICAgdGhpcy5waW5naW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGluZ1RpbWUgKz0gdGhpcy5vcHRpb25zLnBpbmdUaW1lU3RlcDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnBpbmdUaW1lID4gdGhpcy5vcHRpb25zLnBpbmdUaW1lb3V0KSB7XG4gICAgICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUubG9nKFwicGluZyBmYWlsZWQsIHJlY29ubmVjdGluZy4uLlwiKTtcbiAgICAgICAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcy5vcHRpb25zLnBpbmdUaW1lU3RlcCk7XG4gIH1cbiAgXG4gIHJlY29ubmVjdCgpIHtcbiAgICB2YXIgd2FzT3BlbiA9IHRoaXMuc29ja2V0T3BlbjsgXG4gICAgdGhpcy5zb2NrZXRPcGVuID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dCk7XG4gICAgXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lb3V0ID0gc2V0VGltZW91dCgoKT0+e1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICBpZiAod2FzT3Blbikge1xuICAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMgcmVsYXRlZCB0byBkaXNjYXJkaW5nIGEgV2ViU29ja2V0IFxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLmdldFRpY2tldCgodGlja2V0KT0+e1xuICAgICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgICB0aGlzLm9wZW5XZWJTb2NrZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBiZWNhdXNlIHRpY2tldCB3YXMgbWlzc2luZ1wiLCAnZXJyb3InKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgfSwgdGhpcy5vcHRpb25zLnJlY29ubmVjdEludGVydmFsKTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRNZXNzYWdlKGV2ZW50KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHZhciBldmVudFR5cGUgPSBtZXNzYWdlLmV2ZW50VHlwZTtcbiAgICBcbiAgICBpZiAoZXZlbnRUeXBlID09IFwicGluZzpwb25nXCIpIHtcbiAgICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJpZ2dlcihldmVudFR5cGUsIG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG4gIFxuICBvbkJlZm9yZVdpbmRvd1VubG9hZCgpIHtcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9ICgpPT57fTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSAoKT0+e307XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gKCk9Pnt9O1xuICAgICAgaWYgKHRoaXMuc29ja2V0T3Blbikge1xuICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
