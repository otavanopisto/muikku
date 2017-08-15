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

var _indexFrontpage = require('./containers/index.frontpage.jsx');

var _indexFrontpage2 = _interopRequireDefault(_indexFrontpage);

var _index = require('./reducers/index.frontpage');

var _index2 = _interopRequireDefault(_index);

var _reduxLogger = require('./debug/redux-logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = Redux.createStore(_index2.default, Redux.applyMiddleware(_reduxLogger.logger));
//let store = Redux.createStore(reducer);

var Provider = ReactRedux.Provider;

ReactDOM.render(React.createElement(
  Provider,
  { store: store },
  React.createElement(_indexFrontpage2.default, null)
), document.querySelector("#app"));

},{"./containers/index.frontpage.jsx":19,"./debug/redux-logger":20,"./reducers/index.frontpage":35}],22:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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
    permissions: MUIKKU_PERMISSIONS
  };
  var action = arguments[1];

  if (action.type === "LOGOUT") {
    $('#logout').click();
    return state;
  }
  return state;
}

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

var _i18n = require('./general/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Redux.combineReducers({
  notifications: _notifications2.default,
  i18n: _i18n2.default,
  locales: _locales2.default,
  status: _status2.default
});

},{"./base/locales":31,"./base/notifications":32,"./base/status":33,"./general/i18n":34}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiYWN0aW9ucy9iYXNlL3N0YXR1cy5qcyIsImNvbXBvbmVudHMvYmFzZS9mb3Jnb3QtcGFzc3dvcmQtZGlhbG9nLmpzeCIsImNvbXBvbmVudHMvYmFzZS9sb2dpbi1idXR0b24uanN4IiwiY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4IiwiY29tcG9uZW50cy9mcm9udHBhZ2UvYm9keS5qc3giLCJjb21wb25lbnRzL2Zyb250cGFnZS9mZWVkLmpzeCIsImNvbXBvbmVudHMvZnJvbnRwYWdlL25hdmJhci5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZGlhbG9nLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZmVlZC5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvbGFuZ3VhZ2UtcGlja2VyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvbWVudS5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvcG9ydGFsLmpzeCIsImNvbnRhaW5lcnMvaW5kZXguZnJvbnRwYWdlLmpzeCIsImRlYnVnL3JlZHV4LWxvZ2dlci5qcyIsImluZGV4LmZyb250cGFnZS5qc3giLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJyZWR1Y2Vycy9iYXNlL2xvY2FsZXMuanMiLCJyZWR1Y2Vycy9iYXNlL25vdGlmaWNhdGlvbnMuanMiLCJyZWR1Y2Vycy9iYXNlL3N0YXR1cy5qcyIsInJlZHVjZXJzL2dlbmVyYWwvaTE4bi5qcyIsInJlZHVjZXJzL2luZGV4LmZyb250cGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0FlO0FBQ2IsYUFBVyxtQkFBUyxNQUFULEVBQWdCO0FBQ3pCLFdBQU87QUFDTCxjQUFRLFlBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQU5ZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsdUJBQXFCLDZCQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBMkI7QUFDOUMsV0FBTztBQUNMLGNBQVEsa0JBREg7QUFFTCxpQkFBVztBQUNULG9CQUFZLFFBREg7QUFFVCxtQkFBVztBQUZGO0FBRk4sS0FBUDtBQU9ELEdBVFk7QUFVYixvQkFBa0IsMEJBQVMsWUFBVCxFQUFzQjtBQUN0QyxXQUFPO0FBQ0wsY0FBUSxtQkFESDtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBZlksQzs7Ozs7Ozs7a0JDQUE7QUFDYixRQURhLG9CQUNMO0FBQ04sV0FBTztBQUNMLGNBQVE7QUFESCxLQUFQO0FBR0Q7QUFMWSxDOzs7Ozs7Ozs7OztBQ0FmOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLG9COzs7Ozs7Ozs7Ozs2QkFLSTtBQUFBOztBQUNOLFVBQUksVUFBVztB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QURtQztBQUVuQyxzQkFGbUM7QUFHbkMsNEJBSG1DO0FBSW5DO0FBSm1DLENBQXRCLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQge1xuICBzZXRMb2NhbGU6IGZ1bmN0aW9uKGxvY2FsZSl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ1NFVF9MT0NBTEUnLFxuICAgICAgJ3BheWxvYWQnOiBsb2NhbGVcbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBkaXNwbGF5Tm90aWZpY2F0aW9uOiBmdW5jdGlvbihtZXNzYWdlLCBzZXZlcml0eSl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0FERF9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICdzZXZlcml0eSc6IHNldmVyaXR5LFxuICAgICAgICAnbWVzc2FnZSc6IG1lc3NhZ2VcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGhpZGVOb3RpZmljYXRpb246IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbil7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0hJREVfTk9USUZJQ0FUSU9OJyxcbiAgICAgICdwYXlsb2FkJzogbm90aWZpY2F0aW9uXG4gICAgfVxuICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgbG9nb3V0KCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0xPR09VVCdcbiAgICB9XG4gIH1cbn07IiwiaW1wb3J0IERpYWxvZyBmcm9tICcuLi9nZW5lcmFsL2RpYWxvZy5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY2xhc3MgRm9yZ290UGFzc3dvcmREaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgbGV0IGNvbnRlbnQgPSAoPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLmluc3RydWN0aW9ucycpfVxuICAgICAgICA8YnIvPlxuICAgICAgICA8YnIvPlxuICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLXJvd1wiPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3Jnb3RwYXNzd29yZC1lbWFpbFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5lbWFpbCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiLz5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJmb3JtLWhpZGRlblwiIGlkPVwiZm9ybS1yZXNldC1wYXNzd29yZC1zdWJtaXRcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2Pik7XG4gICAgbGV0IGZvb3RlciA9IChjbG9zZURpYWxvZyk9PntcbiAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcm0tcmVzZXQtcGFzc3dvcmQtc3VibWl0XCIgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1sYXJnZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5zZW5kQnV0dG9uTGFiZWwnKX1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1sYXJnZSBidXR0b24td2FyblwiIG9uQ2xpY2s9e2Nsb3NlRGlhbG9nfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuY2FuY2VsQnV0dG9uTGFiZWwnKX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9kaXY+XG4gICAgfVxuICAgIHJldHVybiA8RGlhbG9nIHRpdGxlPXt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy50aXRsZScpfVxuICAgICAgY29udGVudD17Y29udGVudH0gZm9vdGVyPXtmb290ZXJ9IGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259PlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICA8L0RpYWxvZz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZvcmdvdFBhc3N3b3JkRGlhbG9nKTsiLCIvL1RPRE8gdW5saWtlIGxhbmd1YWdlIGNoYW5nZSwgbG9naW4gaW4gbmVlZHMgdG8gZXNjYXBlIHRoZSBjdXJyZW50XG4vL3BhZ2UgaGVuY2UgaXQgZG9lc24ndCByZWFsbHkgbmVlZCBhIHJlZHVjZXIsIGhvd2V2ZXIgaXQgY291bGQgYmUgaW1wbG1lbnRlZFxuLy9pZiBldmVyIHdlIHdpc2ggdG8gdHVybiBpdCBpbnRvIGEgU1BBXG5cbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9nZW5lcmFsL2xpbmsuanN4JztcblxuY2xhc3MgTG9naW5CdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLmxvZ2luID0gdGhpcy5sb2dpbi5iaW5kKHRoaXMpO1xuICB9XG4gIGxvZ2luKCl7XG4gICAgLy9UT0RPIHBsZWFzZSBsZXQncyBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzIHJhdGhlciB0aGFuIHRoZSBlbXVsYXRlZCB3YXlcbiAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgkKFwiI2xvZ2luXCIpLmF0dHIoXCJocmVmXCIpKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxMaW5rIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGJ1dHRvbiAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1idXR0b24tbG9naW5gfSBvbkNsaWNrPXt0aGlzLmxvZ2lufT5cbiAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5sb2dpbi5idXR0b25MYWJlbCcpfTwvc3Bhbj5cbiAgICA8L0xpbms+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKExvZ2luQnV0dG9uKTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmNsYXNzIE5vdGlmaWNhdGlvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5ub3RpZmljYXRpb25zLm1hcCgobm90aWZpY2F0aW9uKT0+e1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e25vdGlmaWNhdGlvbi5pZH0gY2xhc3NOYW1lPXtcIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtIG5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLVwiICsgbm90aWZpY2F0aW9uLnNldmVyaXR5fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57bm90aWZpY2F0aW9uLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLWNsb3NlXCIgb25DbGljaz17dGhpcy5wcm9wcy5oaWRlTm90aWZpY2F0aW9uLmJpbmQodGhpcywgbm90aWZpY2F0aW9uKX0+PC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuICBcbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbm90aWZpY2F0aW9uczogc3RhdGUubm90aWZpY2F0aW9uc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBSZWR1eC5iaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShOb3RpZmljYXRpb25zKTsiLCJpbXBvcnQgRnJvbnRwYWdlTmF2YmFyIGZyb20gJy4vbmF2YmFyLmpzeCc7XG5pbXBvcnQgRnJvbnRwYWdlRmVlZCBmcm9tICcuL2ZlZWQuanN4JztcblxuY2xhc3MgRnJvbnRwYWdlQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgdGhpcy5hZGRDYXJvdXNlbHMoKTtcbiAgfVxuICBhZGRDYXJvdXNlbHMoKXtcbiAgICAvL1RPRE8gdGhpcyBwaWVjZSBvZiBjb2RlIHVzIGRlcHJlY2F0ZWQgYW5kIHVzZXMganF1ZXJ5LCBub3RpY2UgdGhhdCB0aGlzXG4gICAgLy93aWxsIGJlIHZlcnkgYnVnZ3kgaWYgZXZlciB0aGUgZnJvbnRwYWdlIGJvZHkgdXBkYXRlcywgZWcgbWFraW5nIHRoZSBpMTggcmVkdWNlciBtb3JlIGVmZmljaWVudFxuICAgIC8vb3IgYWRkaW5nIGFub3RoZXIgcmVkdWNlciB0aGF0IGNhdXNlcyBjaGFuZ2VzIHRvIHRoZSBib2R5IHByb3BlcnRpZXNcbiAgICAvL3dlIG5lZWQgdG8gcmVwYWNlIHRoaXMgaWYgZXZlciBnb2luZyB0byBtYWtlIGJvZHkgdG8gdXBkYXRlXG4gICAgICBcbiAgICAkKCc8bGluay8+Jywge1xuICAgICAgcmVsOiAnc3R5bGVzaGVldCcsXG4gICAgICB0eXBlOiAndGV4dC9jc3MnLFxuICAgICAgaHJlZjogJy8vY2RuLm11aWtrdXZlcmtrby5maS9saWJzL3NsaWNrLzEuNi4wL3NsaWNrLmNzcydcbiAgICB9KS5hcHBlbmRUbygnaGVhZCcpO1xuICAgICAgXG4gICAgJC5nZXRTY3JpcHQoXCIvL2Nkbi5tdWlra3V2ZXJra28uZmkvbGlicy9zbGljay8xLjYuMC9zbGljay5taW4uanNcIiwgZnVuY3Rpb24oIGRhdGEsIHRleHRTdGF0dXMsIGpxeGhyICkge1xuICAgICAgJChcIi5jYXJvdXNlbC1pdGVtXCIpLmVhY2goKGluZGV4LCBlbGVtZW50KT0+e1xuICAgICAgICAkKGVsZW1lbnQpLnNob3coKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKFwiLmNhcm91c2VsXCIpLmVhY2goKGluZGV4LCBlbGVtZW50KT0+e1xuICAgICAgICAkKGVsZW1lbnQpLnNsaWNrKHtcbiAgICAgICAgICBhcHBlbmREb3RzOiAkKGVsZW1lbnQpLnNpYmxpbmdzKFwiLmNhcm91c2VsLWNvbnRyb2xzXCIpLFxuICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICBkb3RzQ2xhc3M6IFwiY2Fyb3VzZWwtZG90c1wiLFxuICAgICAgICAgIGZhZGU6IHRydWUsXG4gICAgICAgICAgc3BlZWQ6IDc1MCxcbiAgICAgICAgICB3YWl0Rm9yQW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY5LFxuICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGZhZGU6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImVtYmVkIGVtYmVkLWZ1bGxcIj5cbjxGcm9udHBhZ2VOYXZiYXIgLz5cbiAgICAgICAgICAgIFxuPGhlYWRlciBjbGFzc05hbWU9XCJmcm9udHBhZ2UgaGVyb1wiPlxuICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8td3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZSBidWJibGUtcmVzcG9uc2l2ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS10aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc3R1ZGVudEFwcGxpY2F0aW9uQnViYmxlLnRpdGxlJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1jb250ZW50XCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUuZGVzY3JpcHRpb24nKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLXNvZnQgYnV0dG9uLWR5bmFtaWMtaGVpZ2h0IGJ1dHRvbi13YXJuIGJ1dHRvbi1mb2N1c1wiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUubGluaycpfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItbXVpa2t1LWxvZ29cIj5cbiAgICAgICAgPGltZyBjbGFzc05hbWU9XCJmcm9udHBhZ2UgbG9nbyBmcm9udHBhZ2UtbG9nby1tdWlra3UtdmVya2tvXCIgc3JjPVwiL2dmeC9vZi1zaXRlLWxvZ28ucG5nXCI+PC9pbWc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC11cHBlcmNhc2VcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LW11aWtrdS1hdXRob3JcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnNpdGUuYXV0aG9yJyl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1tdWlra3VcIj5NVUlLS1U8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXZlcmtrb1wiPlZFUktLTzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LXVwcGVyY2FzZSBmcm9udHBhZ2UtdGV4dC1tdWlra3UtZGVzY3JpcHRpb25cIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnNpdGUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUgYnViYmxlLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLm9wZW5NYXRlcmlhbHNCdWJibGUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtY29udGVudFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1idXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1zb2Z0IGJ1dHRvbi1keW5hbWljLWhlaWdodCBidXR0b24td2FyblwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS5saW5rJyl9PC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvaGVhZGVyPlxuXG48ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBzZXBhcmF0b3JcIj48L2Rpdj5cblxuPGRpdiBjbGFzc05hbWU9XCJzY3JlZW4tY29udGFpbmVyXCI+XG4gIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuLWNvbnRhaW5lci13cmFwcGVyXCI+XG4gICAgICAgICAgXG4gICAgPHNlY3Rpb24gaWQ9XCJzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uXCI+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc2VjdGlvblRpdGxlLnN0dWR5aW5nJyl9PC9oMj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIG9yZGVyZWQtY29udGFpbmVyLXJvdyBvcmRlcmVkLWNvbnRhaW5lci1yZXNwb25zaXZlIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1zdHVkeWluZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLXN0dWR5aW5nXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfbmV0dGlsdWtpby5wbmdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlsdWtpby50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aWx1a2lvLmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9uZXR0aWx1a2lvX2VzaXR0ZWx5XCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tc3R1ZHlpbmctcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtc2Nob29sXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfbmV0dGlwZXJ1c2tvdWx1LnBuZ1wiXG4gICAgICAgICAgICAgIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aXBlcnVza291bHUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlwZXJ1c2tvdWx1LmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9lc2l0dGVseV9uZXR0aXBrXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tc2Nob29sLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLWNvdXJzZXNcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9haW5lb3Bpc2tlbHUucG5nXCJcbiAgICAgICAgICAgICAgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLmFpbmVvcGlza2VsdS50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5haW5lb3Bpc2tlbHUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL2VzaXR0ZWx5X25ldHRpcGtcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1jb3Vyc2VzLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJ2aWRlb3NcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL09ENU9qNTB2eWgwP3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL0NKY3BXWkQwVlQ4P3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9FYkpuV0l5T0pOZz9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvaU9LVW9BQVE3VWs/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWNvbnRyb2xzXCI+PC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJuZXdzXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb25cIj5cblxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnNlY3Rpb25UaXRsZS5uZXdzJyl9PC9oMj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3NcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBvcmRlcmVkLWNvbnRhaW5lci1yb3cgb3JkZXJlZC1jb250YWluZXItcmVzcG9uc2l2ZSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3cy1zdWJjb250YWluZXJcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5ldmVudHMnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtZXZlbnRzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNCwgb3JkZXI6IFwiQVNDRU5ESU5HXCJ9fSBmZWVkUmVhZFRhcmdldD1cIm9vZXZlbnRzXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUubmV3cycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1uZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNX19IGZlZWRSZWFkVGFyZ2V0PVwib29uZXdzXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3Mtc3ViY29udGFpbmVyXCI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2UtY2FyZC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTEuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTEnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTIuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMicpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMy5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMycpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhNC5qcGdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2U0Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmE1LmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlNScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtY29udHJvbHNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1jYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUuYmxvZ3MnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtYmxvZ3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA2fX1cbiAgICAgICAgICAgICAgICAgICAgIGZlZWRSZWFkVGFyZ2V0PVwiZW9wcGltaXNrZXNrdXMsb3BlbixlYmFyb21ldHJpLG1hdHNrdWxhLG9wcGltaW5lbixwb2xrdWphLHJlaXNzdXZpaGtvLGphbGtpYVwiPjwvRnJvbnRwYWdlRmVlZD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cblxuICAgIDxzZWN0aW9uIGlkPVwib3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb24gZnJvbnRwYWdlLWNhcmQtY29udGFpbmVyXCI+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtb3RhdmFuLW9waXN0b1wiPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLWluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLWl0ZW0tb3RhdmFuLW9waXN0by1zb2NpYWwtbWVkaWFcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItb3RhdmFuLW9waXN0by1zb2NpYWwtbWVkaWFcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtdXBwZXJjYXNlIGZyb250cGFnZS10ZXh0LW90YXZhbi1vcGlzdG8taW5mby10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24uc29tZS50aXRsZScpfVxuICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1mYWNlYm9va1wiIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vb3RhdmFub3Bpc3RvXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS10d2l0dGVyXCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vT3RhdmFuT3Bpc3RvXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1pbnN0YWdyYW1cIiBocmVmPVwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9vdGF2YW5vcGlzdG8vXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1waW50ZXJlc3RcIiBocmVmPVwiaHR0cHM6Ly9maS5waW50ZXJlc3QuY29tL290YXZhbm9waXN0by9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWxpbmtlZGluXCIgaHJlZj1cImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9jb21wYW55LzEwNjAyOFwiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC1tdWx0aXBhcmFncmFwaCBmcm9udHBhZ2UtdGV4dC1vdGF2YW4tb3Bpc3RvLWluZm8tZGVzY3JpcHRpb25cIlxuICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24uZGVzY3JpcHRpb24nKX19PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3RhdmFub3Bpc3RvLmZpXCIgdGFyZ2V0PVwidG9wXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLXdlYnNpdGVcIj5cbiAgICAgICAgICAgICAgICB3d3cub3RhdmFub3Bpc3RvLmZpXG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3RhdmFub3Bpc3RvLmZpL3V1dGlza2lyamVcIiB0YXJnZXQ9XCJ0b3BcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tbmV3c2xldHRlclwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24ubmV3c2xldHRlci5saW5rJyl9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1pdGVtLW90YXZhbi1vcGlzdG8tbG9nb1wiPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIvZ2Z4L29mLW9yZ2FuaXphdGlvbi1sb2dvLmpwZ1wiIGFsdD1cImxvZ29cIiB0aXRsZT1cImxvZ29cIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48Zm9vdGVyIGNsYXNzTmFtZT1cImZyb250cGFnZSBmb290ZXJcIiBpZD1cImNvbnRhY3RcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItaXRlbSBmcm9udHBhZ2UtZm9vdGVyLWl0ZW0tY29udGFjdFwiPlxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXNcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmNvbnRhY3QudGl0bGUnKX08L2gyPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11cy1pbmZvcm1hdGlvblwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWljb24gaWNvbi1sb2NhdGlvblwiPjwvc3Bhbj5cbiAgICAgICAgPGI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5zdHJlZXRBZGRyZXNzLmxhYmVsJyl9PC9iPlxuICAgICAgICA8c3Bhbj5PdGF2YW50aWUgMiBCLCA1MDY3MCBPdGF2YTwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXMtaW5mb3JtYXRpb25cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pY29uIGljb24tcGhvbmVcIj48L3NwYW4+XG4gICAgICAgIDxiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIucGhvbmVOdW1iZXIubGFiZWwnKX08L2I+XG4gICAgICAgIDxzcGFuPjAxNSAxOTTCoDM1NTI8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzLWluZm9ybWF0aW9uXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaWNvbiBpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxuICAgICAgICA8Yj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmVtYWlsQWRkcmVzcy5sYWJlbCcpfTwvYj5cbiAgICAgICAgPHNwYW4+aW5mb0BvdGF2YW5vcGlzdG8uZmk8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItaXRlbSBmcm9udHBhZ2UtZm9vdGVyLWl0ZW0tbG9nb3NcIj5cbiAgICAgIDxpbWcgc3JjPVwiL2dmeC9hbGt1X3V1ZGVsbGUuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiBjbGFzc05hbWU9XCJsb2dvXCIgLz5cbiAgICAgIDxpbWcgc3JjPVwiL2dmeC9mb290ZXJfbG9nby5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIGNsYXNzTmFtZT1cImxvZ29cIiAvPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZm9vdGVyPlxuICAgICAgICA8L2Rpdj4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRnJvbnRwYWdlQm9keSk7IiwiaW1wb3J0IEZlZWQgZnJvbSAnLi4vZ2VuZXJhbC9mZWVkLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcm9udHBhZ2VGZWVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBmZWVkUmVhZFRhcmdldDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5T3B0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW50cmllczogW11cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICBtQXBpKCkuZmVlZC5mZWVkcy5yZWFkKHRoaXMucHJvcHMuZmVlZFJlYWRUYXJnZXQsIHRoaXMucHJvcHMucXVlcnlPcHRpb25zKS5jYWxsYmFjaygoZXJyLCBlbnRyaWVzKT0+e1xuICAgICAgaWYgKCFlcnIpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlbnRyaWVzfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxGZWVkIGVudHJpZXM9e3RoaXMuc3RhdGUuZW50cmllc30+PC9GZWVkPlxuICB9XG59IiwiaW1wb3J0IE5hdmJhciBmcm9tICcuLi9nZW5lcmFsL25hdmJhci5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgTG9naW5CdXR0b24gZnJvbSAnLi4vYmFzZS9sb2dpbi1idXR0b24uanN4JztcbmltcG9ydCBGb3Jnb3RQYXNzd29yZERpYWxvZyBmcm9tICcuLi9iYXNlL2ZvcmdvdC1wYXNzd29yZC1kaWFsb2cuanN4JztcblxuY2xhc3MgRnJvbnRwYWdlTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPE5hdmJhciBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIiBuYXZiYXJJdGVtcz17W1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwic3R1ZHlpbmdcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjc3R1ZHlpbmdcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsuc3R1ZHlpbmcnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJuZXdzXCIsXG4gICAgICAgIGl0ZW06ICg8TGluayBocmVmPVwiI25ld3NcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsubmV3cycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcIm90YXZhbi1vcGlzdG9cIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjb3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm90YXZhbk9waXN0bycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbnRhY3RcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjY29udGFjdFwiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5jb250YWN0Jyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwib3Blbi1tYXRlcmlhbHNcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIvY291cnNlcGlja2VyXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWhpZ2hsaWdodCBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm9wZW5NYXRlcmlhbHMnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH1cbiAgICBdfSBkZWZhdWx0T3B0aW9ucz17W1xuICAgICAgKDxMb2dpbkJ1dHRvbiBrZXk9XCIwXCIgY2xhc3NOYW1lRXh0ZW5zaW9uPVwiZnJvbnRwYWdlXCIvPiksXG4gICAgICAoPEZvcmdvdFBhc3N3b3JkRGlhbG9nIGtleT1cIjFcIiBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIj48TGluayBjbGFzc05hbWU9XCJmcm9udHBhZ2UgbGFiZWwgbGFiZWwtZHluYW1pYy13b3JkLWJyZWFrIGxhYmVsLWNsaWNrYWJsZSBmcm9udHBhZ2UtbGFiZWwtZm9yZ290LXBhc3N3b3JkIGZyb250cGFnZS1pbnRlcmFjdC1mb3Jnb3QtcGFzc3dvcmRcIj5cbiAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RMaW5rJyl9PC9zcGFuPlxuICAgICAgIDwvTGluaz48L0ZvcmdvdFBhc3N3b3JkRGlhbG9nPilcbiAgICBdfSBtZW51SXRlbXM9e1tcbiAgICAgICAoPExpbmsgaHJlZj1cIiNzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5zdHVkeWluZycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNuZXdzXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm5ld3MnKX08L3NwYW4+PC9MaW5rPiksXG4gICAgICAgKDxMaW5rIGhyZWY9XCIjb3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm90YXZhbk9waXN0bycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNjb250YWN0XCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLmNvbnRhY3QnKX08L3NwYW4+PC9MaW5rPiksXG4gICAgICAgKDxMaW5rIGhyZWY9XCIvY291cnNlcGlja2VyXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWhpZ2hsaWdodCBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm9wZW5NYXRlcmlhbHMnKX08L3NwYW4+PC9MaW5rPilcbiAgICBdfS8+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGcm9udHBhZ2VOYXZiYXIpO1xuIiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBQb3J0YWwgZnJvbSAnLi9wb3J0YWwuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNvbnRlbnQ6IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgZm9vdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25PdmVybGF5Q2xpY2sgPSB0aGlzLm9uT3ZlcmxheUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfVxuICB9XG4gIGNsb3NlKCl7XG4gICAgdGhpcy5yZWZzLnBvcnRhbC5jbG9zZVBvcnRhbCgpO1xuICB9XG4gIG9uT3ZlcmxheUNsaWNrKGUpe1xuICAgIGlmIChlLnRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0KXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgb25PcGVuKCl7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0sIDEwKTtcbiAgfVxuICBiZWZvcmVDbG9zZShET01Ob2RlLCByZW1vdmVGcm9tRE9NKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChyZW1vdmVGcm9tRE9NLCAzMDApO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXt0aGlzLnByb3BzLmNoaWxkcmVufSBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0gY2xvc2VPbkVzYz5cbjxkaXYgY2xhc3NOYW1lPXtgZGlhbG9nICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWRpYWxvZyAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfSBvbkNsaWNrPXt0aGlzLm9uT3ZlcmxheUNsaWNrfT5cbiAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctd2luZG93XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctdGl0bGVcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGlhbG9nLWNsb3NlIGljb24gaWNvbi1jbG9zZVwiIG9uQ2xpY2s9e3RoaXMuY2xvc2V9Pjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAge3RoaXMucHJvcHMuY29udGVudH1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctZm9vdGVyXCI+XG4gICAgICAgIHt0aGlzLnByb3BzLmZvb3Rlcih0aGlzLmNsb3NlKX1cbiAgICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuICAgICAgICA8L1BvcnRhbD4pO1xuICB9XG59IiwiaW1wb3J0IFBvcnRhbCBmcm9tICcuL3BvcnRhbC5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG9wOiBudWxsLFxuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIGFycm93TGVmdDogbnVsbCxcbiAgICAgIGFycm93UmlnaHQ6IG51bGwsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbk9wZW4oRE9NTm9kZSl7XG4gICAgbGV0ICR0YXJnZXQgPSAkKHRoaXMucmVmcy5hY3RpdmF0b3IpO1xuICAgIGxldCAkYXJyb3cgPSAkKHRoaXMucmVmcy5hcnJvdyk7XG4gICAgbGV0ICRkcm9wZG93biA9ICQodGhpcy5yZWZzLmRyb3Bkb3duKTtcbiAgICAgIFxuICAgIGxldCBwb3NpdGlvbiA9ICR0YXJnZXQub2Zmc2V0KCk7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgbGV0IG1vcmVTcGFjZUluVGhlTGVmdFNpZGUgPSAod2luZG93V2lkdGggLSBwb3NpdGlvbi5sZWZ0KSA8IHBvc2l0aW9uLmxlZnQ7XG4gICAgXG4gICAgbGV0IGxlZnQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0IC0gJGRyb3Bkb3duLm91dGVyV2lkdGgoKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdDtcbiAgICB9XG4gICAgbGV0IHRvcCA9IHBvc2l0aW9uLnRvcCArICR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDU7XG4gICAgXG4gICAgbGV0IGFycm93TGVmdCA9IG51bGw7XG4gICAgbGV0IGFycm93UmlnaHQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGFycm93UmlnaHQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3dMZWZ0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe3RvcCwgbGVmdCwgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0LCB2aXNpYmxlOiB0cnVlfSk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICBjbG9zZSgpe1xuICAgIHRoaXMucmVmcy5wb3J0YWwuY2xvc2VQb3J0YWwoKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXtSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jaGlsZHJlbiwgeyByZWY6IFwiYWN0aXZhdG9yXCIgfSl9XG4gICAgICBjbG9zZU9uRXNjIGNsb3NlT25PdXRzaWRlQ2xpY2sgY2xvc2VPblNjcm9sbCBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0+XG4gICAgICA8ZGl2IHJlZj1cImRyb3Bkb3duXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubGVmdFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBkcm9wZG93biAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kcm9wZG93bi0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXJyb3dcIiByZWY9XCJhcnJvd1wiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5hcnJvd0xlZnQsIHJpZ2h0OiB0aGlzLnN0YXRlLmFycm93UmlnaHR9fT48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdHlwZW9mIGl0ZW0gPT09IFwiZnVuY3Rpb25cIiA/IGl0ZW0odGhpcy5jbG9zZSkgOiBpdGVtO1xuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAge2VsZW1lbnR9XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvUG9ydGFsPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY2xhc3MgRmVlZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZW50cmllczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHB1YmxpY2F0aW9uRGF0ZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGVzY3JpcHRpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGxpbms6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwiZmVlZFwiPlxuICAgICAge3RoaXMucHJvcHMuZW50cmllcy5tYXAoKGVudHJ5LCBpbmRleCk9PntcbiAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJmZWVkLWl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmZWVkLWl0ZW0tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIDxhIGhyZWY9e2VudHJ5Lmxpbmt9IHRhcmdldD1cInRvcFwiPntlbnRyeS50aXRsZX08L2E+XG4gICAgICAgICAgICB7ZW50cnkuZGVzY3JpcHRpb259XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZlZWQtaXRlbS1kYXRlXCI+e3RoaXMucHJvcHMuaTE4bi50aW1lLmZvcm1hdChlbnRyeS5wdWJsaWNhdGlvbkRhdGUpfTwvc3Bhbj5cbiAgICAgICAgPC9saT5cbiAgICAgIH0pfVxuICAgIDwvdWw+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGZWVkKTsiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5mdW5jdGlvbiBzY3JvbGxUb1NlY3Rpb24oYW5jaG9yKSB7XG4gIGxldCB0b3BPZmZzZXQgPSA5MDtcbiAgbGV0IHNjcm9sbFRvcCA9ICQoYW5jaG9yKS5vZmZzZXQoKS50b3AgLSB0b3BPZmZzZXQ7XG5cbiAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICBzY3JvbGxUb3AgOiBzY3JvbGxUb3BcbiAgfSwge1xuICAgIGR1cmF0aW9uIDogNTAwLFxuICAgIGVhc2luZyA6IFwiZWFzZUluT3V0UXVhZFwiXG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgb25DbGljayhlLCByZSl7XG4gICAgaWYgKHRoaXMucHJvcHMuaHJlZiAmJiB0aGlzLnByb3BzLmhyZWZbMF0gPT09ICcjJyl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzY3JvbGxUb1NlY3Rpb24odGhpcy5wcm9wcy5ocmVmKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMub25DbGljayl7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2soZSwgcmUpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSwgcmUpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uVG91Y2hTdGFydCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hTdGFydChlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hFbmQoZSwgcmUpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogZmFsc2V9KTtcbiAgICB0aGlzLm9uQ2xpY2soZSwgcmUpO1xuICAgIGlmICh0aGlzLnByb3BzLm9uVG91Y2hFbmQpe1xuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoRW5kKGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxhIHsuLi50aGlzLnByb3BzfVxuICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZSArICh0aGlzLnN0YXRlLmFjdGl2ZSA/IFwiIGFjdGl2ZVwiIDogXCJcIil9XG4gICAgICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0vPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMYW5ndWFnZVBpY2tlciBmcm9tICcuL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4JztcbmltcG9ydCBQcm9maWxlSXRlbSBmcm9tICcuL25hdmJhci9wcm9maWxlLWl0ZW0uanN4JztcbmltcG9ydCBNZW51IGZyb20gJy4vbmF2YmFyL21lbnUuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9wZW5NZW51ID0gdGhpcy5vcGVuTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VNZW51ID0gdGhpcy5jbG9zZU1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9XG4gIH1cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZiYXJJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGl0ZW06IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZCxcbiAgICBtZW51SXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkLFxuICAgIGRlZmF1bHRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZFxuICB9XG4gIG9wZW5NZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgY2xvc2VNZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH0pO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufWB9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWxvZ29cIj48L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tbWVudS1idXR0b25gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1pY29uIGxpbmstZnVsbGB9IG9uQ2xpY2s9e3RoaXMub3Blbk1lbnV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbmF2aWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5hdmJhckl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLSR7aXRlbS5jbGFzc05hbWVTdWZmaXh9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLml0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGl0ZW09PiEhaXRlbSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZGVmYXVsdE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgPFByb2ZpbGVJdGVtIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3VhZ2VQaWNrZXIgY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICAgIDxNZW51IG9wZW49e3RoaXMuc3RhdGUuaXNNZW51T3Blbn0gb25DbG9zZT17dGhpcy5jbG9zZU1lbnV9IGl0ZW1zPXt0aGlzLnByb3BzLm1lbnVJdGVtc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uLy4uL2FjdGlvbnMvYmFzZS9sb2NhbGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICcuLi9kcm9wZG93bi5qc3gnO1xuXG5jbGFzcyBMYW5ndWFnZVBpY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxEcm9wZG93biBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBjbGFzc05hbWVTdWZmaXg9XCJsYW5ndWFnZS1waWNrZXJcIiBpdGVtcz17dGhpcy5wcm9wcy5sb2NhbGVzLmF2YWxpYWJsZS5tYXAoKGxvY2FsZSk9PntcbiAgICAgIHJldHVybiAoPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbGluayBsaW5rLWZ1bGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbGluay1sYW5ndWFnZS1waWNrZXJgfSBvbkNsaWNrPXt0aGlzLnByb3BzLnNldExvY2FsZS5iaW5kKHRoaXMsIGxvY2FsZS5sb2NhbGUpfT5cbiAgICAgICAgPHNwYW4+e2xvY2FsZS5uYW1lfTwvc3Bhbj5cbiAgICAgIDwvYT4pO1xuICAgIH0pfT5cbiAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGJ1dHRvbi1waWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1waWxsLWxhbmd1YWdlYH0+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmxvY2FsZXMuY3VycmVudH08L3NwYW4+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGxvY2FsZXM6IHN0YXRlLmxvY2FsZXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gUmVkdXguYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTGFuZ3VhZ2VQaWNrZXIpOyIsImltcG9ydCBMaW5rIGZyb20gJy4uL2xpbmsuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub3BlbiA9IHRoaXMub3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZUJ5T3ZlcmxheSA9IHRoaXMuY2xvc2VCeU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlzcGxheWVkOiBwcm9wcy5vcGVuLFxuICAgICAgdmlzaWJsZTogcHJvcHMub3BlbixcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWc6IG51bGwsXG4gICAgICBvcGVuOiBwcm9wcy5vcGVuXG4gICAgfVxuICB9XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKXtcbiAgICBpZiAobmV4dFByb3BzLm9wZW4gJiYgIXRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMub3BlbiAmJiB0aGlzLnN0YXRlLm9wZW4pe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7J2RyYWdnaW5nJzogdHJ1ZX0pO1xuICAgIHRoaXMudG91Y2hDb3JkWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCA9IDA7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hNb3ZlKGUpe1xuICAgIGxldCBkaWZmWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoQ29yZFg7XG4gICAgbGV0IGFic29sdXRlRGlmZmVyZW5jZVggPSBNYXRoLmFicyhkaWZmWCAtIHRoaXMuc3RhdGUuZHJhZyk7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCArPSBhYnNvbHV0ZURpZmZlcmVuY2VYO1xuXG4gICAgaWYgKGRpZmZYID4gMCkge1xuICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBkaWZmWH0pO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvblRvdWNoRW5kKGUpe1xuICAgIGxldCB3aWR0aCA9ICQodGhpcy5yZWZzLm1lbnVDb250YWluZXIpLndpZHRoKCk7XG4gICAgbGV0IGRpZmYgPSB0aGlzLnN0YXRlLmRyYWc7XG4gICAgbGV0IG1vdmVtZW50ID0gdGhpcy50b3VjaE1vdmVtZW50WDtcbiAgICBcbiAgICBsZXQgbWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgPSBNYXRoLmFicyhkaWZmKSA+PSB3aWR0aCowLjMzO1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZFRoZU92ZXJsYXkgPSBlLnRhcmdldCA9PT0gdGhpcy5yZWZzLm1lbnUgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBsZXQgeW91SnVzdENsaWNrZWRBTGluayA9IGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYVwiICYmIG1vdmVtZW50IDw9IDU7XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ2dpbmc6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZzogbnVsbH0pO1xuICAgICAgaWYgKG1lbnVIYXNTbGlkZWRFbm91Z2hGb3JDbG9zaW5nIHx8IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSB8fCB5b3VKdXN0Q2xpY2tlZEFMaW5rKXtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sIDEwKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb3Blbigpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogdHJ1ZSwgb3BlbjogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IHRydWV9KTtcbiAgICB9LCAxMCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5jc3MoeydvdmVyZmxvdyc6ICdoaWRkZW4nfSk7XG4gIH1cbiAgY2xvc2VCeU92ZXJsYXkoZSl7XG4gICAgbGV0IGlzT3ZlcmxheSA9IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGlzTGluayA9ICEhZS50YXJnZXQuaHJlZjtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZHJhZ2dpbmcgJiYgKGlzT3ZlcmxheSB8fCBpc0xpbmspKXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJyd9KTtcbiAgICB0aGlzLnNldFN0YXRlKHt2aXNpYmxlOiBmYWxzZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogZmFsc2UsIG9wZW46IGZhbHNlfSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9LCAzMDApO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e2BtZW51ICR7dGhpcy5zdGF0ZS5kaXNwbGF5ZWQgPyBcImRpc3BsYXllZFwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGVcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS5kcmFnZ2luZyA/IFwiZHJhZ2dpbmdcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jbG9zZUJ5T3ZlcmxheX0gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaE1vdmU9e3RoaXMub25Ub3VjaE1vdmV9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0gcmVmPVwibWVudVwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1jb250YWluZXJcIiByZWY9XCJtZW51Q29udGFpbmVyXCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmRyYWd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWVudS1oZWFkZXItYnV0dG9uLWNsb3NlIGljb24gaWNvbi1hcnJvdy1sZWZ0XCI+PC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibWVudS1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBrZXk9e2luZGV4fT57aXRlbX08L2xpPlxuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+KTtcbiAgfVxufVxuICAiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4uL2Ryb3Bkb3duLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9saW5rLmpzeCc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uLy4uL2FjdGlvbnMvYmFzZS9zdGF0dXMnO1xuXG5jbGFzcyBQcm9maWxlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgaWYgKCF0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbil7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIGljb246IFwidXNlclwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLnByb2ZpbGUubGlua3MucGVyc29uYWwnLFxuICAgICAgICBocmVmOiBcIi9wcm9maWxlXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwiZm9yZ290cGFzc3dvcmRcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5mb290ZXIuaW5zdHJ1Y3Rpb25zJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJoZWxwZGVza1wiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmhvbWUuaGVscGRlc2snXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcInNpZ25vdXRcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5sb2dvdXQubG9nb3V0JyxcbiAgICAgICAgb25DbGljazogdGhpcy5wcm9wcy5sb2dvdXRcbiAgICAgIH1cbiAgICBdXG4gICAgcmV0dXJuIDxEcm9wZG93biBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBjbGFzc05hbWVTdWZmaXg9XCJwcm9maWxlLW1lbnVcIiBpdGVtcz17aXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICByZXR1cm4gKGNsb3NlRHJvcGRvd24pPT57cmV0dXJuIDxMaW5rIGhyZWY9XCIvcHJvZmlsZVwiXG4gICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstZnVsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1saW5rLXByb2ZpbGUtbWVudWB9XG4gICAgICAgICBvbkNsaWNrPXsoLi4uYXJncyk9PntjbG9zZURyb3Bkb3duKCk7aXRlbS5vbkNsaWNrICYmIGl0ZW0ub25DbGljayguLi5hcmdzKX19IGhyZWY9e2l0ZW0uaHJlZn0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9Pjwvc3Bhbj5cbiAgICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KGl0ZW0udGV4dCl9PC9zcGFuPlxuICAgICAgICA8L0xpbms+fVxuICAgICAgfSl9PlxuICAgICAgPGEgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBidXR0b24tcGlsbCBtYWluLWZ1bmN0aW9uLWJ1dHRvbi1waWxsLXByb2ZpbGVcIj5cbiAgICAgICAgPG9iamVjdCBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLWZ1bGxcIlxuICAgICAgICAgZGF0YT17YC9yZXN0L3VzZXIvZmlsZXMvdXNlci8ke3RoaXMucHJvcHMuc3RhdHVzLnVzZXJJZH0vaWRlbnRpZmllci9wcm9maWxlLWltYWdlLTk2YH1cbiAgICAgICAgIHR5cGU9XCJpbWFnZS9qcGVnXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXVzZXJcIj48L3NwYW4+XG4gICAgICAgIDwvb2JqZWN0PlxuICAgICAgPC9hPlxuICAgIDwvRHJvcGRvd24+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuLFxuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIFJlZHV4LmJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKFByb2ZpbGVJdGVtKTsiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jb25zdCBLRVlDT0RFUyA9IHtcbiAgRVNDQVBFOiAyN1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0geyBhY3RpdmU6IGZhbHNlIH07XG4gICAgdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2sgPSB0aGlzLmhhbmRsZVdyYXBwZXJDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwgPSB0aGlzLmNsb3NlUG9ydGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayA9IHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleWRvd24gPSB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKG5ld1Byb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBvcnRhbCh0cnVlKTtcbiAgfVxuXG4gIGhhbmRsZVdyYXBwZXJDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMub3BlblBvcnRhbCgpO1xuICB9XG5cbiAgb3BlblBvcnRhbChwcm9wcyA9IHRoaXMucHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKHByb3BzLCB0cnVlKTtcbiAgfVxuXG4gIGNsb3NlUG9ydGFsKGlzVW5tb3VudGVkID0gZmFsc2UpIHtcbiAgICBjb25zdCByZXNldFBvcnRhbFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICBSZWFjdERPTS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMubm9kZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICBpZiAoaXNVbm1vdW50ZWQgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuYmVmb3JlQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5iZWZvcmVDbG9zZSh0aGlzLm5vZGUsIHJlc2V0UG9ydGFsU3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzZXRQb3J0YWxTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVPdXRzaWRlTW91c2VDbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnBvcnRhbCk7XG4gICAgaWYgKHJvb3QuY29udGFpbnMoZS50YXJnZXQpIHx8IChlLmJ1dHRvbiAmJiBlLmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwoKTtcbiAgfVxuXG4gIGhhbmRsZUtleWRvd24oZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IEtFWUNPREVTLkVTQ0FQRSAmJiB0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclBvcnRhbChwcm9wcywgaXNPcGVuaW5nKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2ppbWZiL2Q5OWUwNjc4ZTlkYTcxNWNjZjY0NTQ5NjFlZjA0ZDFiXG4gICAgaWYgKHR5cGVvZiBwcm9wcy5jaGlsZHJlbi50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjaGlsZHJlbiA9IFJlYWN0LmNsb25lRWxlbWVudChwcm9wcy5jaGlsZHJlbiwge1xuICAgICAgICBjbG9zZVBvcnRhbDogdGhpcy5jbG9zZVBvcnRhbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3J0YWwgPSBSZWFjdERPTS51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcihcbiAgICAgIHRoaXMsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHRoaXMubm9kZSxcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGVcbiAgICApO1xuICAgIFxuICAgIGlmIChpc09wZW5pbmcpIHtcbiAgICAgIHRoaXMucHJvcHMub25PcGVuKHRoaXMubm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5vcGVuQnlDbGlja09uLCB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuUG9ydGFsLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIG9wZW5CeUNsaWNrT246IFByb3BUeXBlcy5lbGVtZW50LFxuICBjbG9zZU9uRXNjOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPbk91dHNpZGVDbGljazogUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25TY3JvbGw6IFByb3BUeXBlcy5ib29sLFxuICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgYmVmb3JlQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblVwZGF0ZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cblBvcnRhbC5kZWZhdWx0UHJvcHMgPSB7XG4gIG9uT3BlbjogKCkgPT4ge30sXG4gIG9uQ2xvc2U6ICgpID0+IHt9LFxuICBvblVwZGF0ZTogKCkgPT4ge31cbn07IiwiaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4JztcbmltcG9ydCBCb2R5IGZyb20gJy4uL2NvbXBvbmVudHMvZnJvbnRwYWdlL2JvZHkuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhGcm9udHBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgaWQ9XCJyb290XCI+XG4gICAgICA8Tm90aWZpY2F0aW9ucz48L05vdGlmaWNhdGlvbnM+XG4gICAgICA8Qm9keT48L0JvZHk+XG4gICAgPC9kaXY+KTtcbiAgfVxufSIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5yZWR1eExvZ2dlcj1lLnJlZHV4TG9nZ2VyfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Uuc3VwZXJfPXQsZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmUsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSl9ZnVuY3Rpb24gcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwia2luZFwiLHt2YWx1ZTplLGVudW1lcmFibGU6ITB9KSx0JiZ0Lmxlbmd0aCYmT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJwYXRoXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG4oZSx0LHIpe24uc3VwZXJfLmNhbGwodGhpcyxcIkVcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInJoc1wiLHt2YWx1ZTpyLGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBvKGUsdCl7by5zdXBlcl8uY2FsbCh0aGlzLFwiTlwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGkoZSx0KXtpLnN1cGVyXy5jYWxsKHRoaXMsXCJEXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJsaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gYShlLHQscil7YS5zdXBlcl8uY2FsbCh0aGlzLFwiQVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaW5kZXhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpdGVtXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGwoZSx0LHIpe3ZhciBuPWUuc2xpY2UoKHJ8fHQpKzF8fGUubGVuZ3RoKTtyZXR1cm4gZS5sZW5ndGg9dDwwP2UubGVuZ3RoK3Q6dCxlLnB1c2guYXBwbHkoZSxuKSxlfWZ1bmN0aW9uIGMoZSl7dmFyIHQ9dm9pZCAwPT09ZT9cInVuZGVmaW5lZFwiOk4oZSk7cmV0dXJuXCJvYmplY3RcIiE9PXQ/dDplPT09TWF0aD9cIm1hdGhcIjpudWxsPT09ZT9cIm51bGxcIjpBcnJheS5pc0FycmF5KGUpP1wiYXJyYXlcIjpcIltvYmplY3QgRGF0ZV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKT9cImRhdGVcIjpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvU3RyaW5nJiYvXlxcLy4qXFwvLy50ZXN0KGUudG9TdHJpbmcoKSk/XCJyZWdleHBcIjpcIm9iamVjdFwifWZ1bmN0aW9uIHUoZSx0LHIsZixzLGQscCl7cz1zfHxbXSxwPXB8fFtdO3ZhciBnPXMuc2xpY2UoMCk7aWYodm9pZCAwIT09ZCl7aWYoZil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZiYmZihnLGQpKXJldHVybjtpZihcIm9iamVjdFwiPT09KHZvaWQgMD09PWY/XCJ1bmRlZmluZWRcIjpOKGYpKSl7aWYoZi5wcmVmaWx0ZXImJmYucHJlZmlsdGVyKGcsZCkpcmV0dXJuO2lmKGYubm9ybWFsaXplKXt2YXIgaD1mLm5vcm1hbGl6ZShnLGQsZSx0KTtoJiYoZT1oWzBdLHQ9aFsxXSl9fX1nLnB1c2goZCl9XCJyZWdleHBcIj09PWMoZSkmJlwicmVnZXhwXCI9PT1jKHQpJiYoZT1lLnRvU3RyaW5nKCksdD10LnRvU3RyaW5nKCkpO3ZhciB2PXZvaWQgMD09PWU/XCJ1bmRlZmluZWRcIjpOKGUpLHk9dm9pZCAwPT09dD9cInVuZGVmaW5lZFwiOk4odCksYj1cInVuZGVmaW5lZFwiIT09dnx8cCYmcFtwLmxlbmd0aC0xXS5saHMmJnBbcC5sZW5ndGgtMV0ubGhzLmhhc093blByb3BlcnR5KGQpLG09XCJ1bmRlZmluZWRcIiE9PXl8fHAmJnBbcC5sZW5ndGgtMV0ucmhzJiZwW3AubGVuZ3RoLTFdLnJocy5oYXNPd25Qcm9wZXJ0eShkKTtpZighYiYmbSlyKG5ldyBvKGcsdCkpO2Vsc2UgaWYoIW0mJmIpcihuZXcgaShnLGUpKTtlbHNlIGlmKGMoZSkhPT1jKHQpKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwiZGF0ZVwiPT09YyhlKSYmZS10IT0wKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwib2JqZWN0XCI9PT12JiZudWxsIT09ZSYmbnVsbCE9PXQpaWYocC5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHQubGhzPT09ZX0pLmxlbmd0aCllIT09dCYmcihuZXcgbihnLGUsdCkpO2Vsc2V7aWYocC5wdXNoKHtsaHM6ZSxyaHM6dH0pLEFycmF5LmlzQXJyYXkoZSkpe3ZhciB3O2UubGVuZ3RoO2Zvcih3PTA7dzxlLmxlbmd0aDt3Kyspdz49dC5sZW5ndGg/cihuZXcgYShnLHcsbmV3IGkodm9pZCAwLGVbd10pKSk6dShlW3ddLHRbd10scixmLGcsdyxwKTtmb3IoO3c8dC5sZW5ndGg7KXIobmV3IGEoZyx3LG5ldyBvKHZvaWQgMCx0W3crK10pKSl9ZWxzZXt2YXIgeD1PYmplY3Qua2V5cyhlKSxTPU9iamVjdC5rZXlzKHQpO3guZm9yRWFjaChmdW5jdGlvbihuLG8pe3ZhciBpPVMuaW5kZXhPZihuKTtpPj0wPyh1KGVbbl0sdFtuXSxyLGYsZyxuLHApLFM9bChTLGkpKTp1KGVbbl0sdm9pZCAwLHIsZixnLG4scCl9KSxTLmZvckVhY2goZnVuY3Rpb24oZSl7dSh2b2lkIDAsdFtlXSxyLGYsZyxlLHApfSl9cC5sZW5ndGg9cC5sZW5ndGgtMX1lbHNlIGUhPT10JiYoXCJudW1iZXJcIj09PXYmJmlzTmFOKGUpJiZpc05hTih0KXx8cihuZXcgbihnLGUsdCkpKX1mdW5jdGlvbiBmKGUsdCxyLG4pe3JldHVybiBuPW58fFtdLHUoZSx0LGZ1bmN0aW9uKGUpe2UmJm4ucHVzaChlKX0sciksbi5sZW5ndGg/bjp2b2lkIDB9ZnVuY3Rpb24gcyhlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBvW3IucGF0aFtuXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpvW3IucGF0aFtuXV09ci5yaHN9fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmU9bChlLHQpO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6ZVt0XT1yLnJoc31yZXR1cm4gZX1mdW5jdGlvbiBkKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe2Zvcih2YXIgbj1lLG89LTEsaT1yLnBhdGg/ci5wYXRoLmxlbmd0aC0xOjA7KytvPGk7KXZvaWQgMD09PW5bci5wYXRoW29dXSYmKG5bci5wYXRoW29dXT1cIm51bWJlclwiPT10eXBlb2Ygci5wYXRoW29dP1tdOnt9KSxuPW5bci5wYXRoW29dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhyLnBhdGg/bltyLnBhdGhbb11dOm4sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpkZWxldGUgbltyLnBhdGhbb11dO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6bltyLnBhdGhbb11dPXIucmhzfX19ZnVuY3Rpb24gcChlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmNhc2VcIkVcIjpvW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBvW3IucGF0aFtuXV19fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmNhc2VcIkVcIjplW3RdPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjplPWwoZSx0KX1yZXR1cm4gZX1mdW5jdGlvbiBnKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe3ZhciBuLG8saT1lO2ZvcihvPXIucGF0aC5sZW5ndGgtMSxuPTA7bjxvO24rKyl2b2lkIDA9PT1pW3IucGF0aFtuXV0mJihpW3IucGF0aFtuXV09e30pLGk9aVtyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKGlbci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmNhc2VcIkVcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBpW3IucGF0aFtuXV19fX1mdW5jdGlvbiBoKGUsdCxyKXtpZihlJiZ0KXt1KGUsdCxmdW5jdGlvbihuKXtyJiYhcihlLHQsbil8fGQoZSx0LG4pfSl9fWZ1bmN0aW9uIHYoZSl7cmV0dXJuXCJjb2xvcjogXCIrRltlXS5jb2xvcitcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIn1mdW5jdGlvbiB5KGUpe3ZhciB0PWUua2luZCxyPWUucGF0aCxuPWUubGhzLG89ZS5yaHMsaT1lLmluZGV4LGE9ZS5pdGVtO3N3aXRjaCh0KXtjYXNlXCJFXCI6cmV0dXJuW3Iuam9pbihcIi5cIiksbixcIuKGklwiLG9dO2Nhc2VcIk5cIjpyZXR1cm5bci5qb2luKFwiLlwiKSxvXTtjYXNlXCJEXCI6cmV0dXJuW3Iuam9pbihcIi5cIildO2Nhc2VcIkFcIjpyZXR1cm5bci5qb2luKFwiLlwiKStcIltcIitpK1wiXVwiLGFdO2RlZmF1bHQ6cmV0dXJuW119fWZ1bmN0aW9uIGIoZSx0LHIsbil7dmFyIG89ZihlLHQpO3RyeXtuP3IuZ3JvdXBDb2xsYXBzZWQoXCJkaWZmXCIpOnIuZ3JvdXAoXCJkaWZmXCIpfWNhdGNoKGUpe3IubG9nKFwiZGlmZlwiKX1vP28uZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgdD1lLmtpbmQsbj15KGUpO3IubG9nLmFwcGx5KHIsW1wiJWMgXCIrRlt0XS50ZXh0LHYodCldLmNvbmNhdChQKG4pKSl9KTpyLmxvZyhcIuKAlOKAlCBubyBkaWZmIOKAlOKAlFwiKTt0cnl7ci5ncm91cEVuZCgpfWNhdGNoKGUpe3IubG9nKFwi4oCU4oCUIGRpZmYgZW5kIOKAlOKAlCBcIil9fWZ1bmN0aW9uIG0oZSx0LHIsbil7c3dpdGNoKHZvaWQgMD09PWU/XCJ1bmRlZmluZWRcIjpOKGUpKXtjYXNlXCJvYmplY3RcIjpyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlW25dP2Vbbl0uYXBwbHkoZSxQKHIpKTplW25dO2Nhc2VcImZ1bmN0aW9uXCI6cmV0dXJuIGUodCk7ZGVmYXVsdDpyZXR1cm4gZX19ZnVuY3Rpb24gdyhlKXt2YXIgdD1lLnRpbWVzdGFtcCxyPWUuZHVyYXRpb247cmV0dXJuIGZ1bmN0aW9uKGUsbixvKXt2YXIgaT1bXCJhY3Rpb25cIl07cmV0dXJuIGkucHVzaChcIiVjXCIrU3RyaW5nKGUudHlwZSkpLHQmJmkucHVzaChcIiVjQCBcIituKSxyJiZpLnB1c2goXCIlYyhpbiBcIitvLnRvRml4ZWQoMikrXCIgbXMpXCIpLGkuam9pbihcIiBcIil9fWZ1bmN0aW9uIHgoZSx0KXt2YXIgcj10LmxvZ2dlcixuPXQuYWN0aW9uVHJhbnNmb3JtZXIsbz10LnRpdGxlRm9ybWF0dGVyLGk9dm9pZCAwPT09bz93KHQpOm8sYT10LmNvbGxhcHNlZCxsPXQuY29sb3JzLGM9dC5sZXZlbCx1PXQuZGlmZixmPXZvaWQgMD09PXQudGl0bGVGb3JtYXR0ZXI7ZS5mb3JFYWNoKGZ1bmN0aW9uKG8scyl7dmFyIGQ9by5zdGFydGVkLHA9by5zdGFydGVkVGltZSxnPW8uYWN0aW9uLGg9by5wcmV2U3RhdGUsdj1vLmVycm9yLHk9by50b29rLHc9by5uZXh0U3RhdGUseD1lW3MrMV07eCYmKHc9eC5wcmV2U3RhdGUseT14LnN0YXJ0ZWQtZCk7dmFyIFM9bihnKSxqPVwiZnVuY3Rpb25cIj09dHlwZW9mIGE/YShmdW5jdGlvbigpe3JldHVybiB3fSxnLG8pOmEsaz1EKHApLEU9bC50aXRsZT9cImNvbG9yOiBcIitsLnRpdGxlKFMpK1wiO1wiOlwiXCIsQT1bXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCJdO0EucHVzaChFKSx0LnRpbWVzdGFtcCYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKSx0LmR1cmF0aW9uJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpO3ZhciBPPWkoUyxrLHkpO3RyeXtqP2wudGl0bGUmJmY/ci5ncm91cENvbGxhcHNlZC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cENvbGxhcHNlZChPKTpsLnRpdGxlJiZmP3IuZ3JvdXAuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXAoTyl9Y2F0Y2goZSl7ci5sb2coTyl9dmFyIE49bShjLFMsW2hdLFwicHJldlN0YXRlXCIpLFA9bShjLFMsW1NdLFwiYWN0aW9uXCIpLEM9bShjLFMsW3YsaF0sXCJlcnJvclwiKSxGPW0oYyxTLFt3XSxcIm5leHRTdGF0ZVwiKTtpZihOKWlmKGwucHJldlN0YXRlKXt2YXIgTD1cImNvbG9yOiBcIitsLnByZXZTdGF0ZShoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW05dKFwiJWMgcHJldiBzdGF0ZVwiLEwsaCl9ZWxzZSByW05dKFwicHJldiBzdGF0ZVwiLGgpO2lmKFApaWYobC5hY3Rpb24pe3ZhciBUPVwiY29sb3I6IFwiK2wuYWN0aW9uKFMpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbUF0oXCIlYyBhY3Rpb24gICAgXCIsVCxTKX1lbHNlIHJbUF0oXCJhY3Rpb24gICAgXCIsUyk7aWYodiYmQylpZihsLmVycm9yKXt2YXIgTT1cImNvbG9yOiBcIitsLmVycm9yKHYsaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiO3JbQ10oXCIlYyBlcnJvciAgICAgXCIsTSx2KX1lbHNlIHJbQ10oXCJlcnJvciAgICAgXCIsdik7aWYoRilpZihsLm5leHRTdGF0ZSl7dmFyIF89XCJjb2xvcjogXCIrbC5uZXh0U3RhdGUodykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltGXShcIiVjIG5leHQgc3RhdGVcIixfLHcpfWVsc2UgcltGXShcIm5leHQgc3RhdGVcIix3KTt1JiZiKGgsdyxyLGopO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgbG9nIGVuZCDigJTigJRcIil9fSl9ZnVuY3Rpb24gUygpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PU9iamVjdC5hc3NpZ24oe30sTCxlKSxyPXQubG9nZ2VyLG49dC5zdGF0ZVRyYW5zZm9ybWVyLG89dC5lcnJvclRyYW5zZm9ybWVyLGk9dC5wcmVkaWNhdGUsYT10LmxvZ0Vycm9ycyxsPXQuZGlmZlByZWRpY2F0ZTtpZih2b2lkIDA9PT1yKXJldHVybiBmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGUodCl9fX07aWYoZS5nZXRTdGF0ZSYmZS5kaXNwYXRjaClyZXR1cm4gY29uc29sZS5lcnJvcihcIltyZWR1eC1sb2dnZXJdIHJlZHV4LWxvZ2dlciBub3QgaW5zdGFsbGVkLiBNYWtlIHN1cmUgdG8gcGFzcyBsb2dnZXIgaW5zdGFuY2UgYXMgbWlkZGxld2FyZTpcXG4vLyBMb2dnZXIgd2l0aCBkZWZhdWx0IG9wdGlvbnNcXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdyZWR1eC1sb2dnZXInXFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG4vLyBPciB5b3UgY2FuIGNyZWF0ZSB5b3VyIG93biBsb2dnZXIgd2l0aCBjdXN0b20gb3B0aW9ucyBodHRwOi8vYml0Lmx5L3JlZHV4LWxvZ2dlci1vcHRpb25zXFxuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbmNvbnN0IGxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XFxuICAvLyAuLi5vcHRpb25zXFxufSk7XFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG5cIiksZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBlKHQpfX19O3ZhciBjPVtdO3JldHVybiBmdW5jdGlvbihlKXt2YXIgcj1lLmdldFN0YXRlO3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odSl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgaSYmIWkocix1KSlyZXR1cm4gZSh1KTt2YXIgZj17fTtjLnB1c2goZiksZi5zdGFydGVkPU8ubm93KCksZi5zdGFydGVkVGltZT1uZXcgRGF0ZSxmLnByZXZTdGF0ZT1uKHIoKSksZi5hY3Rpb249dTt2YXIgcz12b2lkIDA7aWYoYSl0cnl7cz1lKHUpfWNhdGNoKGUpe2YuZXJyb3I9byhlKX1lbHNlIHM9ZSh1KTtmLnRvb2s9Ty5ub3coKS1mLnN0YXJ0ZWQsZi5uZXh0U3RhdGU9bihyKCkpO3ZhciBkPXQuZGlmZiYmXCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHIsdSk6dC5kaWZmO2lmKHgoYyxPYmplY3QuYXNzaWduKHt9LHQse2RpZmY6ZH0pKSxjLmxlbmd0aD0wLGYuZXJyb3IpdGhyb3cgZi5lcnJvcjtyZXR1cm4gc319fX12YXIgaixrLEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gbmV3IEFycmF5KHQrMSkuam9pbihlKX0sQT1mdW5jdGlvbihlLHQpe3JldHVybiBFKFwiMFwiLHQtZS50b1N0cmluZygpLmxlbmd0aCkrZX0sRD1mdW5jdGlvbihlKXtyZXR1cm4gQShlLmdldEhvdXJzKCksMikrXCI6XCIrQShlLmdldE1pbnV0ZXMoKSwyKStcIjpcIitBKGUuZ2V0U2Vjb25kcygpLDIpK1wiLlwiK0EoZS5nZXRNaWxsaXNlY29uZHMoKSwzKX0sTz1cInVuZGVmaW5lZFwiIT10eXBlb2YgcGVyZm9ybWFuY2UmJm51bGwhPT1wZXJmb3JtYW5jZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgcGVyZm9ybWFuY2Uubm93P3BlcmZvcm1hbmNlOkRhdGUsTj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfSxQPWZ1bmN0aW9uKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpe2Zvcih2YXIgdD0wLHI9QXJyYXkoZS5sZW5ndGgpO3Q8ZS5sZW5ndGg7dCsrKXJbdF09ZVt0XTtyZXR1cm4gcn1yZXR1cm4gQXJyYXkuZnJvbShlKX0sQz1bXTtqPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGdsb2JhbD9cInVuZGVmaW5lZFwiOk4oZ2xvYmFsKSkmJmdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30saz1qLkRlZXBEaWZmLGsmJkMucHVzaChmdW5jdGlvbigpe3ZvaWQgMCE9PWsmJmouRGVlcERpZmY9PT1mJiYoai5EZWVwRGlmZj1rLGs9dm9pZCAwKX0pLHQobixyKSx0KG8sciksdChpLHIpLHQoYSxyKSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhmLHtkaWZmOnt2YWx1ZTpmLGVudW1lcmFibGU6ITB9LG9ic2VydmFibGVEaWZmOnt2YWx1ZTp1LGVudW1lcmFibGU6ITB9LGFwcGx5RGlmZjp7dmFsdWU6aCxlbnVtZXJhYmxlOiEwfSxhcHBseUNoYW5nZTp7dmFsdWU6ZCxlbnVtZXJhYmxlOiEwfSxyZXZlcnRDaGFuZ2U6e3ZhbHVlOmcsZW51bWVyYWJsZTohMH0saXNDb25mbGljdDp7dmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdm9pZCAwIT09a30sZW51bWVyYWJsZTohMH0sbm9Db25mbGljdDp7dmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gQyYmKEMuZm9yRWFjaChmdW5jdGlvbihlKXtlKCl9KSxDPW51bGwpLGZ9LGVudW1lcmFibGU6ITB9fSk7dmFyIEY9e0U6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJDSEFOR0VEOlwifSxOOntjb2xvcjpcIiM0Q0FGNTBcIix0ZXh0OlwiQURERUQ6XCJ9LEQ6e2NvbG9yOlwiI0Y0NDMzNlwiLHRleHQ6XCJERUxFVEVEOlwifSxBOntjb2xvcjpcIiMyMTk2RjNcIix0ZXh0OlwiQVJSQVk6XCJ9fSxMPXtsZXZlbDpcImxvZ1wiLGxvZ2dlcjpjb25zb2xlLGxvZ0Vycm9yczohMCxjb2xsYXBzZWQ6dm9pZCAwLHByZWRpY2F0ZTp2b2lkIDAsZHVyYXRpb246ITEsdGltZXN0YW1wOiEwLHN0YXRlVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGFjdGlvblRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxlcnJvclRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxjb2xvcnM6e3RpdGxlOmZ1bmN0aW9uKCl7cmV0dXJuXCJpbmhlcml0XCJ9LHByZXZTdGF0ZTpmdW5jdGlvbigpe3JldHVyblwiIzlFOUU5RVwifSxhY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5cIiMwM0E5RjRcIn0sbmV4dFN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjNENBRjUwXCJ9LGVycm9yOmZ1bmN0aW9uKCl7cmV0dXJuXCIjRjIwNDA0XCJ9fSxkaWZmOiExLGRpZmZQcmVkaWNhdGU6dm9pZCAwLHRyYW5zZm9ybWVyOnZvaWQgMH0sVD1mdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PWUuZGlzcGF0Y2gscj1lLmdldFN0YXRlO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHIpcmV0dXJuIFMoKSh7ZGlzcGF0Y2g6dCxnZXRTdGF0ZTpyfSk7Y29uc29sZS5lcnJvcihcIlxcbltyZWR1eC1sb2dnZXIgdjNdIEJSRUFLSU5HIENIQU5HRVxcbltyZWR1eC1sb2dnZXIgdjNdIFNpbmNlIDMuMC4wIHJlZHV4LWxvZ2dlciBleHBvcnRzIGJ5IGRlZmF1bHQgbG9nZ2VyIHdpdGggZGVmYXVsdCBzZXR0aW5ncy5cXG5bcmVkdXgtbG9nZ2VyIHYzXSBDaGFuZ2VcXG5bcmVkdXgtbG9nZ2VyIHYzXSBpbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5bcmVkdXgtbG9nZ2VyIHYzXSB0b1xcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5cIil9O2UuZGVmYXVsdHM9TCxlLmNyZWF0ZUxvZ2dlcj1TLGUubG9nZ2VyPVQsZS5kZWZhdWx0PVQsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImltcG9ydCBBcHAgZnJvbSAnLi9jb250YWluZXJzL2luZGV4LmZyb250cGFnZS5qc3gnO1xuaW1wb3J0IHJlZHVjZXIgZnJvbSAnLi9yZWR1Y2Vycy9pbmRleC5mcm9udHBhZ2UnO1xuXG5pbXBvcnQge2xvZ2dlcn0gZnJvbSAnLi9kZWJ1Zy9yZWR1eC1sb2dnZXInO1xubGV0IHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUocmVkdWNlciwgUmVkdXguYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcikpO1xuLy9sZXQgc3RvcmUgPSBSZWR1eC5jcmVhdGVTdG9yZShyZWR1Y2VyKTtcblxubGV0IFByb3ZpZGVyID0gUmVhY3RSZWR1eC5Qcm92aWRlcjtcblxuUmVhY3RET00ucmVuZGVyKDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICA8QXBwLz5cbjwvUHJvdmlkZXI+LCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FwcFwiKSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG4gIHZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGludmFyaWFudCh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicsICclczogJXMgdHlwZSBgJXNgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tICcgKyAnUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSk7XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIHdhcm5pbmcoIWVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRXJyb3IsICclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUsIHR5cGVvZiBlcnJvcik7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICB3YXJuaW5nKGZhbHNlLCAnRmFpbGVkICVzIHR5cGU6ICVzJXMnLCBsb2NhdGlvbiwgZXJyb3IubWVzc2FnZSwgc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc2hpbShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGlmIChzZWNyZXQgPT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAvLyBJdCBpcyBzdGlsbCBzYWZlIHdoZW4gY2FsbGVkIGZyb20gUmVhY3QuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGludmFyaWFudChcbiAgICAgIGZhbHNlLFxuICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgJ1VzZSBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKSB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgKTtcbiAgfTtcbiAgc2hpbS5pc1JlcXVpcmVkID0gc2hpbTtcbiAgZnVuY3Rpb24gZ2V0U2hpbSgpIHtcbiAgICByZXR1cm4gc2hpbTtcbiAgfTtcbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBzaGltLFxuICAgIGJvb2w6IHNoaW0sXG4gICAgZnVuYzogc2hpbSxcbiAgICBudW1iZXI6IHNoaW0sXG4gICAgb2JqZWN0OiBzaGltLFxuICAgIHN0cmluZzogc2hpbSxcbiAgICBzeW1ib2w6IHNoaW0sXG5cbiAgICBhbnk6IHNoaW0sXG4gICAgYXJyYXlPZjogZ2V0U2hpbSxcbiAgICBlbGVtZW50OiBzaGltLFxuICAgIGluc3RhbmNlT2Y6IGdldFNoaW0sXG4gICAgbm9kZTogc2hpbSxcbiAgICBvYmplY3RPZjogZ2V0U2hpbSxcbiAgICBvbmVPZjogZ2V0U2hpbSxcbiAgICBvbmVPZlR5cGU6IGdldFNoaW0sXG4gICAgc2hhcGU6IGdldFNoaW1cbiAgfTtcblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGVtcHR5RnVuY3Rpb247XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXJcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgd2FybmluZyhcbiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCVzYCBwcm9wIG9uIGAlc2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICtcbiAgICAgICAgICAgICAgJ2FuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICAgJ1lvdSBtYXkgYmUgc2VlaW5nIHRoaXMgd2FybmluZyBkdWUgdG8gYSB0aGlyZC1wYXJ0eSBQcm9wVHlwZXMgJyArXG4gICAgICAgICAgICAgICdsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgJyArICdmb3IgZGV0YWlscy4nLFxuICAgICAgICAgICAgICBwcm9wRnVsbE5hbWUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIGFycmF5T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgd2FybmluZyhcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGlkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICVzIGF0IGluZGV4ICVzLicsXG4gICAgICAgICAgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpLFxuICAgICAgICAgIGlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wVmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuICFwcm9wVmFsdWU7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5ldmVyeShpc05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTm9kZShlbnRyeVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAgIC8vIE5hdGl2ZSBTeW1ib2wuXG4gICAgaWYgKHByb3BUeXBlID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIFN5bWJvbC5mb3IgJiZcbiAgICBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gICAgMHhlYWM3O1xuXG4gIHZhciBpc1ZhbGlkRWxlbWVudCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgb2JqZWN0ICE9PSBudWxsICYmXG4gICAgICBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIvL1RPRE8gdGhpcyByZWR1Y2VyIHVzZXMgdGhlIGFwaSB0aGF0IGludGVyYWN0cyB3aXRoIHRoZSBET00gaW4gb3JkZXIgdG9cbi8vcmV0cmlldmUgZGF0YSwgcGxlYXNlIGZpeCBpbiBuZXh0IHZlcnNpb25zXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZXMoc3RhdGU9e1xuICBhdmFsaWFibGU6ICQubWFrZUFycmF5KCQoXCIjbGFuZ3VhZ2UtcGlja2VyIGFcIikubWFwKChpbmRleCwgZWxlbWVudCk9PntcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJChlbGVtZW50KS50ZXh0KCkudHJpbSgpLFxuICAgICAgbG9jYWxlOiAkKGVsZW1lbnQpLmRhdGEoJ2xvY2FsZScpXG4gICAgfVxuICB9KSksXG4gIGN1cnJlbnQ6ICQoXCIjbG9jYWxlXCIpLnRleHQoKVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0xPQ0FMRScpe1xuICAgIC8vVE9ETyBGb3Igc29tZSByZWFzb24gdGhpcyBkb2Vzbid0IHdhbnQgdG8gd29yaywgdGhpcyByZWR1Y2VyIG5lZWRzIHVyZ2VudCBmaXhcbiAgICAkKCcjbGFuZ3VhZ2UtcGlja2VyIGFbZGF0YS1sb2NhbGU9XCInICsgYWN0aW9uLnBheWxvYWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtjdXJyZW50OiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RpZmljYXRpb25zKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBRERfTk9USUZJQ0FUSU9OJykge1xuICAgIHZhciBpZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHN0YXRlLmNvbmNhdChPYmplY3QuYXNzaWduKHtpZDogaWR9LCBhY3Rpb24ucGF5bG9hZCkpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnSElERV9OT1RJRklDQVRJT04nKSB7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiBlbGVtZW50LmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiLy9UaGlzIG9uZSBhbHNvIHVzZXMgYSBoYWNrIHRvIGFjY2VzcyB0aGUgZGF0YSBpbiB0aGUgZG9tXG4vL3BsZWFzZSByZXBsYWNlIGl0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9jZWR1cmVcbi8vMS4gQ3JlYXRlIGEgcmVzdCBlbmRwb2ludCB0byBnZXQgdGhlIHBlcm1pc3Npb25zIGxpc3Rcbi8vMi4gaW4gdGhlIG1haW4gZmlsZSBnYXRoZXIgdGhvc2UgcGVybWlzc2lvbnMuLi4gZXRjLi4uLCBlZy4gaW5kZXguanMgbWFrZSBhIGNhbGxcbi8vMy4gZGlzcGF0Y2ggdGhlIGFjdGlvbiB0byB0aGlzIHNhbWUgcmVkdWNlciBhbmQgZ2F0aGVyIHRoZSBhY3Rpb24gaGVyZVxuLy80LiBpdCB3b3JrcyA6RFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGF0dXMoc3RhdGU9e1xuICBsb2dnZWRJbjogISFNVUlLS1VfTE9HR0VEX1VTRVJfSUQsXG4gIHVzZXJJZDogTVVJS0tVX0xPR0dFRF9VU0VSX0lELFxuICBwZXJtaXNzaW9uczogTVVJS0tVX1BFUk1JU1NJT05TXG59LCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09IFwiTE9HT1VUXCIpe1xuICAgICQoJyNsb2dvdXQnKS5jbGljaygpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaTE4bihzdGF0ZT17XG4gIHRleHQ6IHtcbiAgICBnZXQoa2V5LCAuLi5hcmdzKXtcbiAgICAgIGxldCB0ZXh0ID0gZ2V0TG9jYWxlVGV4dChrZXksIGFyZ3MpO1xuICAgICAgaWYgKHRleHQpe1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9ybWF0KGRhdGU9bmV3IERhdGUoKSwgZm9ybWF0PVwiTFwiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZvcm1hdChmb3JtYXQpO1xuICAgIH0sXG4gICAgZnJvbU5vdyhkYXRlPW5ldyBEYXRlKCkpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZnJvbU5vdygpO1xuICAgIH0sXG4gICAgc3VidHJhY3QoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5zdWJ0cmFjdChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfSxcbiAgICBhZGQoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5hZGQoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH1cbiAgfVxufSwgYWN0aW9uKXtcbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBub3RpZmljYXRpb25zIGZyb20gJy4vYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vYmFzZS9sb2NhbGVzJztcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi9iYXNlL3N0YXR1cyc7XG5pbXBvcnQgaTE4biBmcm9tICcuL2dlbmVyYWwvaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IFJlZHV4LmNvbWJpbmVSZWR1Y2Vycyh7XG4gIG5vdGlmaWNhdGlvbnMsXG4gIGkxOG4sXG4gIGxvY2FsZXMsXG4gIHN0YXR1c1xufSk7Il19
