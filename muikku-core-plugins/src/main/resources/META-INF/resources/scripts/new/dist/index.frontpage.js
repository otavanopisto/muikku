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

},{"../general/dialog.jsx":9,"prop-types":27}],4:[function(require,module,exports){
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

},{"../general/link.jsx":12,"prop-types":27}],5:[function(require,module,exports){
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

},{"../../actions/base/notifications":2}],6:[function(require,module,exports){
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

},{"./feed.jsx":7,"./navbar.jsx":8}],7:[function(require,module,exports){
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

},{"../general/feed.jsx":11,"prop-types":27}],8:[function(require,module,exports){
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

},{"../base/forgot-password-dialog.jsx":3,"../base/login-button.jsx":4,"../general/link.jsx":12,"../general/navbar.jsx":13}],9:[function(require,module,exports){
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

},{"./portal.jsx":16,"prop-types":27}],10:[function(require,module,exports){
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
    key: 'render',
    value: function render() {
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
              return React.createElement(
                'div',
                { className: 'dropdown-item', key: index },
                item
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
  items: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired
};
exports.default = Dropdown;

},{"./portal.jsx":16,"prop-types":27}],11:[function(require,module,exports){
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

},{"prop-types":27}],12:[function(require,module,exports){
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

},{"prop-types":27}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _languagePicker = require('./navbar/language-picker.jsx');

var _languagePicker2 = _interopRequireDefault(_languagePicker);

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
                    { className: 'link link-icon link-full', onClick: this.openMenu },
                    React.createElement('span', { className: 'icon icon-navicon' })
                  )
                ),
                this.props.navbarItems.map(function (item, index) {
                  return React.createElement(
                    'li',
                    { key: index, className: 'navbar-item ' + _this2.props.classNameExtension + '-navbar-item-' + item.classNameSuffix },
                    item.item
                  );
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

},{"./navbar/language-picker.jsx":14,"./navbar/menu.jsx":15,"prop-types":27}],14:[function(require,module,exports){
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
              { className: 'frontpage link link-full frontpage-link-language-picker', onClick: _this2.props.setLocale.bind(_this2, locale.locale) },
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

},{"../../../actions/base/locales":1,"../dropdown.jsx":10,"prop-types":27}],15:[function(require,module,exports){
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

},{"../link.jsx":12,"prop-types":27}],16:[function(require,module,exports){
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

},{"prop-types":27}],17:[function(require,module,exports){
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

},{"../components/base/notifications.jsx":5,"../components/frontpage/body.jsx":6}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"./containers/index.frontpage.jsx":17,"./debug/redux-logger":18,"./reducers/index.frontpage":32}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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

},{"_process":23}],22:[function(require,module,exports){
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

},{"./emptyFunction":20,"_process":23}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":28,"_process":23,"fbjs/lib/invariant":21,"fbjs/lib/warning":22}],25:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":28,"fbjs/lib/emptyFunction":20,"fbjs/lib/invariant":21}],26:[function(require,module,exports){
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

},{"./checkPropTypes":24,"./lib/ReactPropTypesSecret":28,"_process":23,"fbjs/lib/emptyFunction":20,"fbjs/lib/invariant":21,"fbjs/lib/warning":22}],27:[function(require,module,exports){
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

},{"./factoryWithThrowingShims":25,"./factoryWithTypeCheckers":26,"_process":23}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('./base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _locales = require('./base/locales');

var _locales2 = _interopRequireDefault(_locales);

var _i18n = require('./general/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Redux.combineReducers({
  notifications: _notifications2.default,
  i18n: _i18n2.default,
  locales: _locales2.default
});

},{"./base/locales":29,"./base/notifications":30,"./general/i18n":31}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiY29tcG9uZW50cy9iYXNlL2ZvcmdvdC1wYXNzd29yZC1kaWFsb2cuanN4IiwiY29tcG9uZW50cy9iYXNlL2xvZ2luLWJ1dHRvbi5qc3giLCJjb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3giLCJjb21wb25lbnRzL2Zyb250cGFnZS9ib2R5LmpzeCIsImNvbXBvbmVudHMvZnJvbnRwYWdlL2ZlZWQuanN4IiwiY29tcG9uZW50cy9mcm9udHBhZ2UvbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kaWFsb2cuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2Ryb3Bkb3duLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9mZWVkLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9tZW51LmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9wb3J0YWwuanN4IiwiY29udGFpbmVycy9pbmRleC5mcm9udHBhZ2UuanN4IiwiZGVidWcvcmVkdXgtbG9nZ2VyLmpzIiwiaW5kZXguZnJvbnRwYWdlLmpzeCIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9lbXB0eUZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi93YXJuaW5nLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsInJlZHVjZXJzL2Jhc2UvbG9jYWxlcy5qcyIsInJlZHVjZXJzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qcyIsInJlZHVjZXJzL2dlbmVyYWwvaTE4bi5qcyIsInJlZHVjZXJzL2luZGV4LmZyb250cGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0FlO0FBQ2IsYUFBVyxtQkFBUyxNQUFULEVBQWdCO0FBQ3pCLFdBQU87QUFDTCxjQUFRLFlBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQU5ZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsdUJBQXFCLDZCQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBMkI7QUFDOUMsV0FBTztBQUNMLGNBQVEsa0JBREg7QUFFTCxpQkFBVztBQUNULG9CQUFZLFFBREg7QUFFVCxtQkFBVztBQUZGO0FBRk4sS0FBUDtBQU9ELEdBVFk7QUFVYixvQkFBa0IsMEJBQVMsWUFBVCxFQUFzQjtBQUN0QyxXQUFPO0FBQ0wsY0FBUSxtQkFESDtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBZlksQzs7Ozs7Ozs7Ozs7QUNBZjs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxvQjs7Ozs7Ozs7Ozs7NkJBS0k7QUFBQTs7QUFDTixVQUFJLFVBQVc7QUFBQTtBQUFBO0FBQ1YsYUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qix5REFBekIsQ0FEVTtBQUVYLHVDQUZXO0FBR1gsdUNBSFc7QUFJWDtBQUFBO0FBQUEsWUFBTSxXQUFVLE1BQWhCO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0U7QUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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OUMsRUFBUDtBQUNELE9BVEc7QUFVSixTQVZJLGlCQVV1QztBQUFBLFlBQXZDLElBQXVDLHVFQUFsQyxJQUFJLElBQUosRUFBa0M7QUFBQSxZQUF0QixLQUFzQix1RUFBaEIsQ0FBZ0I7QUFBQSxZQUFiLEtBQWEsdUVBQVAsTUFBTzs7QUFDekMsZUFBTyxPQUFPLElBQUksSUFBSixDQUFTLElBQVQsQ0FBUCxFQUF1QixHQUF2QixDQUEyQixLQUEzQixFQUFrQyxLQUFsQyxFQUF5QyxRQUF6QyxFQUFQO0FBQ0Q7QUFaRztBQVgyQixHQXlCekI7QUFBQSxNQUFQLE1BQU87O0FBQ1IsU0FBTyxLQUFQO0FBQ0Q7Ozs7Ozs7OztBQzNCRDs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZSxNQUFNLGVBQU4sQ0FBc0I7QUFDbkMsd0NBRG1DO0FBRW5DLHNCQUZtQztBQUduQztBQUhtQyxDQUF0QixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgc2V0TG9jYWxlOiBmdW5jdGlvbihsb2NhbGUpe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdTRVRfTE9DQUxFJyxcbiAgICAgICdwYXlsb2FkJzogbG9jYWxlXG4gICAgfVxuICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgZGlzcGxheU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obWVzc2FnZSwgc2V2ZXJpdHkpe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdBRERfTk9USUZJQ0FUSU9OJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAnc2V2ZXJpdHknOiBzZXZlcml0eSxcbiAgICAgICAgJ21lc3NhZ2UnOiBtZXNzYWdlXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBoaWRlTm90aWZpY2F0aW9uOiBmdW5jdGlvbihub3RpZmljYXRpb24pe1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdISURFX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IG5vdGlmaWNhdGlvblxuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgRGlhbG9nIGZyb20gJy4uL2dlbmVyYWwvZGlhbG9nLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBGb3Jnb3RQYXNzd29yZERpYWxvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuICByZW5kZXIoKXtcbiAgICBsZXQgY29udGVudCA9ICg8ZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuaW5zdHJ1Y3Rpb25zJyl9XG4gICAgICAgIDxici8+XG4gICAgICAgIDxici8+XG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tcm93XCI+XG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcmdvdHBhc3N3b3JkLWVtYWlsXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLmVtYWlsJyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImVtYWlsXCIvPlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImZvcm0taGlkZGVuXCIgaWQ9XCJmb3JtLXJlc2V0LXBhc3N3b3JkLXN1Ym1pdFwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+KTtcbiAgICBsZXQgZm9vdGVyID0gKGNsb3NlRGlhbG9nKT0+e1xuICAgICAgcmV0dXJuIDxkaXY+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZm9ybS1yZXNldC1wYXNzd29yZC1zdWJtaXRcIiBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLWxhcmdlXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLnNlbmRCdXR0b25MYWJlbCcpfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLWxhcmdlIGJ1dHRvbi13YXJuXCIgb25DbGljaz17Y2xvc2VEaWFsb2d9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5jYW5jZWxCdXR0b25MYWJlbCcpfVxuICAgICAgICA8L2E+XG4gICAgICA8L2Rpdj5cbiAgICB9XG4gICAgcmV0dXJuIDxEaWFsb2cgdGl0bGU9e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLnRpdGxlJyl9XG4gICAgICBjb250ZW50PXtjb250ZW50fSBmb290ZXI9e2Zvb3Rlcn0gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgIDwvRGlhbG9nPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRm9yZ290UGFzc3dvcmREaWFsb2cpOyIsIi8vVE9ETyB1bmxpa2UgbGFuZ3VhZ2UgY2hhbmdlLCBsb2dpbiBpbiBuZWVkcyB0byBlc2NhcGUgdGhlIGN1cnJlbnRcbi8vcGFnZSBoZW5jZSBpdCBkb2Vzbid0IHJlYWxseSBuZWVkIGEgcmVkdWNlciwgaG93ZXZlciBpdCBjb3VsZCBiZSBpbXBsbWVudGVkXG4vL2lmIGV2ZXIgd2Ugd2lzaCB0byB0dXJuIGl0IGludG8gYSBTUEFcblxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMaW5rIGZyb20gJy4uL2dlbmVyYWwvbGluay5qc3gnO1xuXG5jbGFzcyBMb2dpbkJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMubG9naW4gPSB0aGlzLmxvZ2luLmJpbmQodGhpcyk7XG4gIH1cbiAgbG9naW4oKXtcbiAgICAvL1RPRE8gcGxlYXNlIGxldCdzIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMgcmF0aGVyIHRoYW4gdGhlIGVtdWxhdGVkIHdheVxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCQoXCIjbG9naW5cIikuYXR0cihcImhyZWZcIikpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPExpbmsgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1sb2dpbmB9IG9uQ2xpY2s9e3RoaXMubG9naW59PlxuICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmxvZ2luLmJ1dHRvbkxhYmVsJyl9PC9zcGFuPlxuICAgIDwvTGluaz4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTG9naW5CdXR0b24pOyIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uL2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcblxuY2xhc3MgTm90aWZpY2F0aW9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbnMubWFwKChub3RpZmljYXRpb24pPT57XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17bm90aWZpY2F0aW9uLmlkfSBjbGFzc05hbWU9e1wibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0gbm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0tXCIgKyBub3RpZmljYXRpb24uc2V2ZXJpdHl9PlxuICAgICAgICAgICAgICAgIDxzcGFuPntub3RpZmljYXRpb24ubWVzc2FnZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0tY2xvc2VcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmhpZGVOb3RpZmljYXRpb24uYmluZCh0aGlzLCBub3RpZmljYXRpb24pfT48L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4gIFxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBub3RpZmljYXRpb25zOiBzdGF0ZS5ub3RpZmljYXRpb25zXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIFJlZHV4LmJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE5vdGlmaWNhdGlvbnMpOyIsImltcG9ydCBGcm9udHBhZ2VOYXZiYXIgZnJvbSAnLi9uYXZiYXIuanN4JztcbmltcG9ydCBGcm9udHBhZ2VGZWVkIGZyb20gJy4vZmVlZC5qc3gnO1xuXG5jbGFzcyBGcm9udHBhZ2VCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICB0aGlzLmFkZENhcm91c2VscygpO1xuICB9XG4gIGFkZENhcm91c2Vscygpe1xuICAgIC8vVE9ETyB0aGlzIHBpZWNlIG9mIGNvZGUgdXMgZGVwcmVjYXRlZCBhbmQgdXNlcyBqcXVlcnksIG5vdGljZSB0aGF0IHRoaXNcbiAgICAvL3dpbGwgYmUgdmVyeSBidWdneSBpZiBldmVyIHRoZSBmcm9udHBhZ2UgYm9keSB1cGRhdGVzLCBlZyBtYWtpbmcgdGhlIGkxOCByZWR1Y2VyIG1vcmUgZWZmaWNpZW50XG4gICAgLy9vciBhZGRpbmcgYW5vdGhlciByZWR1Y2VyIHRoYXQgY2F1c2VzIGNoYW5nZXMgdG8gdGhlIGJvZHkgcHJvcGVydGllc1xuICAgIC8vd2UgbmVlZCB0byByZXBhY2UgdGhpcyBpZiBldmVyIGdvaW5nIHRvIG1ha2UgYm9keSB0byB1cGRhdGVcbiAgICAgIFxuICAgICQoJzxsaW5rLz4nLCB7XG4gICAgICByZWw6ICdzdHlsZXNoZWV0JyxcbiAgICAgIHR5cGU6ICd0ZXh0L2NzcycsXG4gICAgICBocmVmOiAnLy9jZG4ubXVpa2t1dmVya2tvLmZpL2xpYnMvc2xpY2svMS42LjAvc2xpY2suY3NzJ1xuICAgIH0pLmFwcGVuZFRvKCdoZWFkJyk7XG4gICAgICBcbiAgICAkLmdldFNjcmlwdChcIi8vY2RuLm11aWtrdXZlcmtrby5maS9saWJzL3NsaWNrLzEuNi4wL3NsaWNrLm1pbi5qc1wiLCBmdW5jdGlvbiggZGF0YSwgdGV4dFN0YXR1cywganF4aHIgKSB7XG4gICAgICAkKFwiLmNhcm91c2VsLWl0ZW1cIikuZWFjaCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgICAgICQoZWxlbWVudCkuc2hvdygpO1xuICAgICAgfSk7XG5cbiAgICAgICQoXCIuY2Fyb3VzZWxcIikuZWFjaCgoaW5kZXgsIGVsZW1lbnQpPT57XG4gICAgICAgICQoZWxlbWVudCkuc2xpY2soe1xuICAgICAgICAgIGFwcGVuZERvdHM6ICQoZWxlbWVudCkuc2libGluZ3MoXCIuY2Fyb3VzZWwtY29udHJvbHNcIiksXG4gICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgIGRvdHNDbGFzczogXCJjYXJvdXNlbC1kb3RzXCIsXG4gICAgICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgICAgICBzcGVlZDogNzUwLFxuICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiBmYWxzZSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjksXG4gICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZmFkZTogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZW1iZWQgZW1iZWQtZnVsbFwiPlxuPEZyb250cGFnZU5hdmJhciAvPlxuICAgICAgICAgICAgXG48aGVhZGVyIGNsYXNzTmFtZT1cImZyb250cGFnZSBoZXJvXCI+XG4gIDxkaXYgY2xhc3NOYW1lPVwiaGVyby13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLWl0ZW1cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlIGJ1YmJsZS1yZXNwb25zaXZlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLXRpdGxlXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUudGl0bGUnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWNvbnRlbnRcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnN0dWRlbnRBcHBsaWNhdGlvbkJ1YmJsZS5kZXNjcmlwdGlvbicpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tc29mdCBidXR0b24tZHluYW1pYy1oZWlnaHQgYnV0dG9uLXdhcm4gYnV0dG9uLWZvY3VzXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnN0dWRlbnRBcHBsaWNhdGlvbkJ1YmJsZS5saW5rJyl9XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1tdWlra3UtbG9nb1wiPlxuICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImZyb250cGFnZSBsb2dvIGZyb250cGFnZS1sb2dvLW11aWtrdS12ZXJra29cIiBzcmM9XCIvZ2Z4L29mLXNpdGUtbG9nby5wbmdcIj48L2ltZz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LXVwcGVyY2FzZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtbXVpa2t1LWF1dGhvclwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc2l0ZS5hdXRob3InKX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LW11aWtrdVwiPk1VSUtLVTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdmVya2tvXCI+VkVSS0tPPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtdXBwZXJjYXNlIGZyb250cGFnZS10ZXh0LW11aWtrdS1kZXNjcmlwdGlvblwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc2l0ZS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZSBidWJibGUtcmVzcG9uc2l2ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS50aXRsZScpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1jb250ZW50XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5vcGVuTWF0ZXJpYWxzQnViYmxlLmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLXNvZnQgYnV0dG9uLWR5bmFtaWMtaGVpZ2h0IGJ1dHRvbi13YXJuXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5vcGVuTWF0ZXJpYWxzQnViYmxlLmxpbmsnKX08L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9oZWFkZXI+XG5cbjxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHNlcGFyYXRvclwiPjwvZGl2PlxuXG48ZGl2IGNsYXNzTmFtZT1cInNjcmVlbi1jb250YWluZXJcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW4tY29udGFpbmVyLXdyYXBwZXJcIj5cbiAgICAgICAgICBcbiAgICA8c2VjdGlvbiBpZD1cInN0dWR5aW5nXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb25cIj5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zZWN0aW9uVGl0bGUuc3R1ZHlpbmcnKX08L2gyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLXN0dWR5aW5nXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtc3R1ZHlpbmdcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9uZXR0aWx1a2lvLnBuZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aWx1a2lvLnRpdGxlJyl9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLm5ldHRpbHVraW8uZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL25ldHRpbHVraW9fZXNpdHRlbHlcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1zdHVkeWluZy1yZWFkbW9yZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5yZWFkTW9yZS5saW5rJyl9IDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY2FyZCBmcm9udHBhZ2UtY2FyZC1zY2hvb2xcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9uZXR0aXBlcnVza291bHUucG5nXCJcbiAgICAgICAgICAgICAgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLm5ldHRpcGVydXNrb3VsdS50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aXBlcnVza291bHUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL2VzaXR0ZWx5X25ldHRpcGtcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1zY2hvb2wtcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtY291cnNlc1wiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhX2FpbmVvcGlza2VsdS5wbmdcIlxuICAgICAgICAgICAgICBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcuYWluZW9waXNrZWx1LnRpdGxlJyl9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLmFpbmVvcGlza2VsdS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtZm9vdGVyXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm5ldHRpbHVraW8uZmkvZXNpdHRlbHlfbmV0dGlwa1wiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLWNvdXJzZXMtcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG5cbiAgICA8c2VjdGlvbiBpZD1cInZpZGVvc1wiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvT0Q1T2o1MHZ5aDA/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvQ0pjcFdaRDBWVDg/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL0ViSm5XSXlPSk5nP3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9pT0tVb0FBUTdVaz9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtY29udHJvbHNcIj48L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG5cbiAgICA8c2VjdGlvbiBpZD1cIm5ld3NcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvblwiPlxuXG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc2VjdGlvblRpdGxlLm5ld3MnKX08L2gyPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3c1wiPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIG9yZGVyZWQtY29udGFpbmVyLXJvdyBvcmRlcmVkLWNvbnRhaW5lci1yZXNwb25zaXZlIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1uZXdzLXN1YmNvbnRhaW5lclwiPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZyb250cGFnZUJveFRpdGxlLmV2ZW50cycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1ldmVudHMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA0LCBvcmRlcjogXCJBU0NFTkRJTkdcIn19IGZlZWRSZWFkVGFyZ2V0PVwib29ldmVudHNcIj48L0Zyb250cGFnZUZlZWQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5uZXdzJyl9PC9oMj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlLW5ld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA1fX0gZmVlZFJlYWRUYXJnZXQ9XCJvb25ld3NcIj48L0Zyb250cGFnZUZlZWQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBvcmRlcmVkLWNvbnRhaW5lci1yb3cgb3JkZXJlZC1jb250YWluZXItcmVzcG9uc2l2ZSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3cy1zdWJjb250YWluZXJcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1jYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMS5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMi5qcGdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2UyJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmEzLmpwZ1wiIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2UzJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmE0LmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTQnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTUuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2U1Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1jb250cm9sc1wiPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLWNhcmQtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5ibG9ncycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1ibG9ncy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZyb250cGFnZUZlZWQgcXVlcnlPcHRpb25zPXt7bnVtSXRlbXM6IDZ9fVxuICAgICAgICAgICAgICAgICAgICAgZmVlZFJlYWRUYXJnZXQ9XCJlb3BwaW1pc2tlc2t1cyxvcGVuLGViYXJvbWV0cmksbWF0c2t1bGEsb3BwaW1pbmVuLHBvbGt1amEscmVpc3N1dmloa28samFsa2lhXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvbiBmcm9udHBhZ2UtY2FyZC1jb250YWluZXJcIj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY2FyZCBmcm9udHBhZ2UtY2FyZC1vdGF2YW4tb3Bpc3RvXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW90YXZhbi1vcGlzdG8taW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItaXRlbS1vdGF2YW4tb3Bpc3RvLXNvY2lhbC1tZWRpYVwiPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLXNvY2lhbC1tZWRpYVwiPlxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC11cHBlcmNhc2UgZnJvbnRwYWdlLXRleHQtb3RhdmFuLW9waXN0by1pbmZvLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm9yZ2FuaXphdGlvbi5zb21lLnRpdGxlJyl9XG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWZhY2Vib29rXCIgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9vdGF2YW5vcGlzdG9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLXR3aXR0ZXJcIiBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9PdGF2YW5PcGlzdG9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWluc3RhZ3JhbVwiIGhyZWY9XCJodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL290YXZhbm9waXN0by9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLXBpbnRlcmVzdFwiIGhyZWY9XCJodHRwczovL2ZpLnBpbnRlcmVzdC5jb20vb3RhdmFub3Bpc3RvL1wiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbi1zb2NpYWwgaWNvbiBpY29uLXNvbWUtbGlua2VkaW5cIiBocmVmPVwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvMTA2MDI4XCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLW90YXZhbi1vcGlzdG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LW11bHRpcGFyYWdyYXBoIGZyb250cGFnZS10ZXh0LW90YXZhbi1vcGlzdG8taW5mby1kZXNjcmlwdGlvblwiXG4gICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHRoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm9yZ2FuaXphdGlvbi5kZXNjcmlwdGlvbicpfX0+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5vdGF2YW5vcGlzdG8uZmlcIiB0YXJnZXQ9XCJ0b3BcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24td2Vic2l0ZVwiPlxuICAgICAgICAgICAgICAgIHd3dy5vdGF2YW5vcGlzdG8uZmlcbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8YnIvPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5vdGF2YW5vcGlzdG8uZmkvdXV0aXNraXJqZVwiIHRhcmdldD1cInRvcFwiIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1uZXdzbGV0dGVyXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm9yZ2FuaXphdGlvbi5uZXdzbGV0dGVyLmxpbmsnKX1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLWl0ZW0tb3RhdmFuLW9waXN0by1sb2dvXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIi9nZngvb2Ytb3JnYW5pemF0aW9uLWxvZ28uanBnXCIgYWx0PVwibG9nb1wiIHRpdGxlPVwibG9nb1wiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxmb290ZXIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGZvb3RlclwiIGlkPVwiY29udGFjdFwiPlxuICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1jb250YWluZXJcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1pdGVtIGZyb250cGFnZS1mb290ZXItaXRlbS1jb250YWN0XCI+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11c1wiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIuY29udGFjdC50aXRsZScpfTwvaDI+XG4gICAgICA8cCBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzLWluZm9ybWF0aW9uXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaWNvbiBpY29uLWxvY2F0aW9uXCI+PC9zcGFuPlxuICAgICAgICA8Yj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLnN0cmVldEFkZHJlc3MubGFiZWwnKX08L2I+XG4gICAgICAgIDxzcGFuPk90YXZhbnRpZSAyIEIsIDUwNjcwIE90YXZhPC9zcGFuPlxuICAgICAgPC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11cy1pbmZvcm1hdGlvblwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWljb24gaWNvbi1waG9uZVwiPjwvc3Bhbj5cbiAgICAgICAgPGI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5waG9uZU51bWJlci5sYWJlbCcpfTwvYj5cbiAgICAgICAgPHNwYW4+MDE1IDE5NMKgMzU1Mjwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXMtaW5mb3JtYXRpb25cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pY29uIGljb24tZW52ZWxvcGVcIj48L3NwYW4+XG4gICAgICAgIDxiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIuZW1haWxBZGRyZXNzLmxhYmVsJyl9PC9iPlxuICAgICAgICA8c3Bhbj5pbmZvQG90YXZhbm9waXN0by5maTwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1pdGVtIGZyb250cGFnZS1mb290ZXItaXRlbS1sb2dvc1wiPlxuICAgICAgPGltZyBzcmM9XCIvZ2Z4L2Fsa3VfdXVkZWxsZS5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIGNsYXNzTmFtZT1cImxvZ29cIiAvPlxuICAgICAgPGltZyBzcmM9XCIvZ2Z4L2Zvb3Rlcl9sb2dvLmpwZ1wiIGFsdD1cIlwiIHRpdGxlPVwiXCIgY2xhc3NOYW1lPVwibG9nb1wiIC8+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9mb290ZXI+XG4gICAgICAgIDwvZGl2Pik7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGcm9udHBhZ2VCb2R5KTsiLCJpbXBvcnQgRmVlZCBmcm9tICcuLi9nZW5lcmFsL2ZlZWQuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyb250cGFnZUZlZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGZlZWRSZWFkVGFyZ2V0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcXVlcnlPcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbnRyaWVzOiBbXVxuICAgIH1cbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIG1BcGkoKS5mZWVkLmZlZWRzLnJlYWQodGhpcy5wcm9wcy5mZWVkUmVhZFRhcmdldCwgdGhpcy5wcm9wcy5xdWVyeU9wdGlvbnMpLmNhbGxiYWNrKChlcnIsIGVudHJpZXMpPT57XG4gICAgICBpZiAoIWVycil7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2VudHJpZXN9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPEZlZWQgZW50cmllcz17dGhpcy5zdGF0ZS5lbnRyaWVzfT48L0ZlZWQ+XG4gIH1cbn0iLCJpbXBvcnQgTmF2YmFyIGZyb20gJy4uL2dlbmVyYWwvbmF2YmFyLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9nZW5lcmFsL2xpbmsuanN4JztcbmltcG9ydCBMb2dpbkJ1dHRvbiBmcm9tICcuLi9iYXNlL2xvZ2luLWJ1dHRvbi5qc3gnO1xuaW1wb3J0IEZvcmdvdFBhc3N3b3JkRGlhbG9nIGZyb20gJy4uL2Jhc2UvZm9yZ290LXBhc3N3b3JkLWRpYWxvZy5qc3gnO1xuXG5jbGFzcyBGcm9udHBhZ2VOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8TmF2YmFyIGNsYXNzTmFtZUV4dGVuc2lvbj1cImZyb250cGFnZVwiIG5hdmJhckl0ZW1zPXtbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJzdHVkeWluZ1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5zdHVkeWluZycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcIm5ld3NcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjbmV3c1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5uZXdzJyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwib3RhdmFuLW9waXN0b1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3RhdmFuT3Bpc3RvJyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwiY29udGFjdFwiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIiNjb250YWN0XCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLmNvbnRhY3QnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJvcGVuLW1hdGVyaWFsc1wiLFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstaGlnaGxpZ2h0IGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3Blbk1hdGVyaWFscycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfVxuICAgIF19IGRlZmF1bHRPcHRpb25zPXtbXG4gICAgICAoPExvZ2luQnV0dG9uIGtleT1cIjBcIiBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIi8+KSxcbiAgICAgICg8Rm9yZ290UGFzc3dvcmREaWFsb2cga2V5PVwiMVwiIGNsYXNzTmFtZUV4dGVuc2lvbj1cImZyb250cGFnZVwiPjxMaW5rIGNsYXNzTmFtZT1cImZyb250cGFnZSBsYWJlbCBsYWJlbC1keW5hbWljLXdvcmQtYnJlYWsgbGFiZWwtY2xpY2thYmxlIGZyb250cGFnZS1sYWJlbC1mb3Jnb3QtcGFzc3dvcmQgZnJvbnRwYWdlLWludGVyYWN0LWZvcmdvdC1wYXNzd29yZFwiPlxuICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdExpbmsnKX08L3NwYW4+XG4gICAgICAgPC9MaW5rPjwvRm9yZ290UGFzc3dvcmREaWFsb2c+KVxuICAgIF19IG1lbnVJdGVtcz17W1xuICAgICAgICg8TGluayBocmVmPVwiI3N0dWR5aW5nXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLnN0dWR5aW5nJyl9PC9zcGFuPjwvTGluaz4pLFxuICAgICAgICg8TGluayBocmVmPVwiI25ld3NcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsubmV3cycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNvcmdhbml6YXRpb25cIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3RhdmFuT3Bpc3RvJyl9PC9zcGFuPjwvTGluaz4pLFxuICAgICAgICg8TGluayBocmVmPVwiI2NvbnRhY3RcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsuY29udGFjdCcpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstaGlnaGxpZ2h0IGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsub3Blbk1hdGVyaWFscycpfTwvc3Bhbj48L0xpbms+KVxuICAgIF19Lz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZyb250cGFnZU5hdmJhcik7XG4iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFBvcnRhbCBmcm9tICcuL3BvcnRhbC5qc3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY29udGVudDogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBmb290ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk92ZXJsYXlDbGljayA9IHRoaXMub25PdmVybGF5Q2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICB0aGlzLnJlZnMucG9ydGFsLmNsb3NlUG9ydGFsKCk7XG4gIH1cbiAgb25PdmVybGF5Q2xpY2soZSl7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvbk9wZW4oKXtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSwgMTApO1xuICB9XG4gIGJlZm9yZUNsb3NlKERPTU5vZGUsIHJlbW92ZUZyb21ET00pe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KHJlbW92ZUZyb21ET00sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8UG9ydGFsIHJlZj1cInBvcnRhbFwiIG9wZW5CeUNsaWNrT249e3RoaXMucHJvcHMuY2hpbGRyZW59IG9uT3Blbj17dGhpcy5vbk9wZW59IGJlZm9yZUNsb3NlPXt0aGlzLmJlZm9yZUNsb3NlfSBjbG9zZU9uRXNjPlxuPGRpdiBjbGFzc05hbWU9e2BkaWFsb2cgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tZGlhbG9nICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifWB9IG9uQ2xpY2s9e3RoaXMub25PdmVybGF5Q2xpY2t9PlxuICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy13aW5kb3dcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy10aXRsZVwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaWFsb2ctY2xvc2UgaWNvbiBpY29uLWNsb3NlXCIgb25DbGljaz17dGhpcy5jbG9zZX0+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5jb250ZW50fVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1mb290ZXJcIj5cbiAgICAgICAge3RoaXMucHJvcHMuZm9vdGVyKHRoaXMuY2xvc2UpfVxuICAgICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4gICAgICAgIDwvUG9ydGFsPik7XG4gIH1cbn0iLCJpbXBvcnQgUG9ydGFsIGZyb20gJy4vcG9ydGFsLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcm9wZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG9wOiBudWxsLFxuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIGFycm93TGVmdDogbnVsbCxcbiAgICAgIGFycm93UmlnaHQ6IG51bGwsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbk9wZW4oRE9NTm9kZSl7XG4gICAgbGV0ICR0YXJnZXQgPSAkKHRoaXMucmVmcy5hY3RpdmF0b3IpO1xuICAgIGxldCAkYXJyb3cgPSAkKHRoaXMucmVmcy5hcnJvdyk7XG4gICAgbGV0ICRkcm9wZG93biA9ICQodGhpcy5yZWZzLmRyb3Bkb3duKTtcbiAgICAgIFxuICAgIGxldCBwb3NpdGlvbiA9ICR0YXJnZXQub2Zmc2V0KCk7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgbGV0IG1vcmVTcGFjZUluVGhlTGVmdFNpZGUgPSAod2luZG93V2lkdGggLSBwb3NpdGlvbi5sZWZ0KSA8IHBvc2l0aW9uLmxlZnQ7XG4gICAgXG4gICAgbGV0IGxlZnQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0IC0gJGRyb3Bkb3duLm91dGVyV2lkdGgoKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdDtcbiAgICB9XG4gICAgbGV0IHRvcCA9IHBvc2l0aW9uLnRvcCArICR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDU7XG4gICAgXG4gICAgbGV0IGFycm93TGVmdCA9IG51bGw7XG4gICAgbGV0IGFycm93UmlnaHQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGFycm93UmlnaHQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3dMZWZ0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe3RvcCwgbGVmdCwgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0LCB2aXNpYmxlOiB0cnVlfSk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXtSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jaGlsZHJlbiwgeyByZWY6IFwiYWN0aXZhdG9yXCIgfSl9XG4gICAgICBjbG9zZU9uRXNjIGNsb3NlT25PdXRzaWRlQ2xpY2sgY2xvc2VPblNjcm9sbCBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0+XG4gICAgICA8ZGl2IHJlZj1cImRyb3Bkb3duXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubGVmdFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBkcm9wZG93biAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kcm9wZG93bi0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXJyb3dcIiByZWY9XCJhcnJvd1wiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5hcnJvd0xlZnQsIHJpZ2h0OiB0aGlzLnN0YXRlLmFycm93UmlnaHR9fT48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1pdGVtXCIga2V5PXtpbmRleH0+XG4gICAgICAgICAgICAgIHtpdGVtfVxuICAgICAgICAgICAgPC9kaXY+KTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L1BvcnRhbD5cbiAgfVxufSIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNsYXNzIEZlZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVudHJpZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBwdWJsaWNhdGlvbkRhdGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBsaW5rOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gICAgfSkpLmlzUmVxdWlyZWRcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPHVsIGNsYXNzTmFtZT1cImZlZWRcIj5cbiAgICAgIHt0aGlzLnByb3BzLmVudHJpZXMubWFwKChlbnRyeSwgaW5kZXgpPT57XG4gICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwiZmVlZC1pdGVtXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmVlZC1pdGVtLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICA8YSBocmVmPXtlbnRyeS5saW5rfSB0YXJnZXQ9XCJ0b3BcIj57ZW50cnkudGl0bGV9PC9hPlxuICAgICAgICAgICAge2VudHJ5LmRlc2NyaXB0aW9ufVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmZWVkLWl0ZW0tZGF0ZVwiPnt0aGlzLnByb3BzLmkxOG4udGltZS5mb3JtYXQoZW50cnkucHVibGljYXRpb25EYXRlKX08L3NwYW4+XG4gICAgICAgIDwvbGk+XG4gICAgICB9KX1cbiAgICA8L3VsPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRmVlZCk7IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZnVuY3Rpb24gc2Nyb2xsVG9TZWN0aW9uKGFuY2hvcikge1xuICBsZXQgdG9wT2Zmc2V0ID0gOTA7XG4gIGxldCBzY3JvbGxUb3AgPSAkKGFuY2hvcikub2Zmc2V0KCkudG9wIC0gdG9wT2Zmc2V0O1xuXG4gICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgc2Nyb2xsVG9wIDogc2Nyb2xsVG9wXG4gIH0sIHtcbiAgICBkdXJhdGlvbiA6IDUwMCxcbiAgICBlYXNpbmcgOiBcImVhc2VJbk91dFF1YWRcIlxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5vbkNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhY3RpdmU6IGZhbHNlXG4gICAgfVxuICB9XG4gIG9uQ2xpY2soZSwgcmUpe1xuICAgIGlmICh0aGlzLnByb3BzLmhyZWYgJiYgdGhpcy5wcm9wcy5ocmVmWzBdID09PSAnIycpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2Nyb2xsVG9TZWN0aW9uKHRoaXMucHJvcHMuaHJlZik7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spe1xuICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrKGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaFN0YXJ0KGUsIHJlKXtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmU6IHRydWV9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vblRvdWNoU3RhcnQpe1xuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoU3RhcnQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoRW5kKGUsIHJlKXtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmU6IGZhbHNlfSk7XG4gICAgdGhpcy5vbkNsaWNrKGUsIHJlKTtcbiAgICBpZiAodGhpcy5wcm9wcy5vblRvdWNoRW5kKXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaEVuZChlLCByZSk7XG4gICAgfVxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8YSB7Li4udGhpcy5wcm9wc31cbiAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWUgKyAodGhpcy5zdGF0ZS5hY3RpdmUgPyBcIiBhY3RpdmVcIiA6IFwiXCIpfVxuICAgICAgb25DbGljaz17dGhpcy5vbkNsaWNrfSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoRW5kPXt0aGlzLm9uVG91Y2hFbmR9Lz5cbiAgfVxufSIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTGFuZ3VhZ2VQaWNrZXIgZnJvbSAnLi9uYXZiYXIvbGFuZ3VhZ2UtcGlja2VyLmpzeCc7XG5pbXBvcnQgTWVudSBmcm9tICcuL25hdmJhci9tZW51LmpzeCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vcGVuTWVudSA9IHRoaXMub3Blbk1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlTWVudSA9IHRoaXMuY2xvc2VNZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzTWVudU9wZW46IGZhbHNlXG4gICAgfVxuICB9XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbmF2YmFySXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBpdGVtOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG4gICAgfSkpLmlzUmVxdWlyZWQsXG4gICAgbWVudUl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZCxcbiAgICBkZWZhdWx0T3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWRcbiAgfVxuICBvcGVuTWVudSgpe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNNZW51T3BlbjogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGNsb3NlTWVudSgpe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9e2BuYXZiYXIgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn1gfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLW1lbnUtYnV0dG9uYH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJsaW5rIGxpbmstaWNvbiBsaW5rLWZ1bGxcIiBvbkNsaWNrPXt0aGlzLm9wZW5NZW51fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLW5hdmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5uYXZiYXJJdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tJHtpdGVtLmNsYXNzTmFtZVN1ZmZpeH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0uaXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZGVmYXVsdC1vcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9ucy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5kZWZhdWx0T3B0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3VhZ2VQaWNrZXIgY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICAgIDxNZW51IG9wZW49e3RoaXMuc3RhdGUuaXNNZW51T3Blbn0gb25DbG9zZT17dGhpcy5jbG9zZU1lbnV9IGl0ZW1zPXt0aGlzLnByb3BzLm1lbnVJdGVtc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uLy4uL2FjdGlvbnMvYmFzZS9sb2NhbGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICcuLi9kcm9wZG93bi5qc3gnO1xuXG5jbGFzcyBMYW5ndWFnZVBpY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxEcm9wZG93biBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBjbGFzc05hbWVTdWZmaXg9XCJsYW5ndWFnZS1waWNrZXJcIiBpdGVtcz17dGhpcy5wcm9wcy5sb2NhbGVzLmF2YWxpYWJsZS5tYXAoKGxvY2FsZSk9PntcbiAgICAgIHJldHVybiAoPGEgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGxpbmsgbGluay1mdWxsIGZyb250cGFnZS1saW5rLWxhbmd1YWdlLXBpY2tlclwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0TG9jYWxlLmJpbmQodGhpcywgbG9jYWxlLmxvY2FsZSl9PlxuICAgICAgICA8c3Bhbj57bG9jYWxlLm5hbWV9PC9zcGFuPlxuICAgICAgPC9hPik7XG4gICAgfSl9PlxuICAgICAgPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uLXBpbGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tYnV0dG9uLXBpbGwtbGFuZ3VhZ2VgfT5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMubG9jYWxlcy5jdXJyZW50fTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L0Ryb3Bkb3duPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbG9jYWxlczogc3RhdGUubG9jYWxlc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBSZWR1eC5iaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYW5ndWFnZVBpY2tlcik7IiwiaW1wb3J0IExpbmsgZnJvbSAnLi4vbGluay5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaE1vdmUgPSB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vcGVuID0gdGhpcy5vcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlQnlPdmVybGF5ID0gdGhpcy5jbG9zZUJ5T3ZlcmxheS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkaXNwbGF5ZWQ6IHByb3BzLm9wZW4sXG4gICAgICB2aXNpYmxlOiBwcm9wcy5vcGVuLFxuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZzogbnVsbCxcbiAgICAgIG9wZW46IHByb3BzLm9wZW5cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xuICAgIGlmIChuZXh0UHJvcHMub3BlbiAmJiAhdGhpcy5zdGF0ZS5vcGVuKXtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy5vcGVuICYmIHRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlKXtcbiAgICB0aGlzLnNldFN0YXRlKHsnZHJhZ2dpbmcnOiB0cnVlfSk7XG4gICAgdGhpcy50b3VjaENvcmRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYID0gMDtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb25Ub3VjaE1vdmUoZSl7XG4gICAgbGV0IGRpZmZYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHRoaXMudG91Y2hDb3JkWDtcbiAgICBsZXQgYWJzb2x1dGVEaWZmZXJlbmNlWCA9IE1hdGguYWJzKGRpZmZYIC0gdGhpcy5zdGF0ZS5kcmFnKTtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYICs9IGFic29sdXRlRGlmZmVyZW5jZVg7XG5cbiAgICBpZiAoZGlmZlggPiAwKSB7XG4gICAgICBkaWZmWCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWc6IGRpZmZYfSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hFbmQoZSl7XG4gICAgbGV0IHdpZHRoID0gJCh0aGlzLnJlZnMubWVudUNvbnRhaW5lcikud2lkdGgoKTtcbiAgICBsZXQgZGlmZiA9IHRoaXMuc3RhdGUuZHJhZztcbiAgICBsZXQgbW92ZW1lbnQgPSB0aGlzLnRvdWNoTW92ZW1lbnRYO1xuICAgIFxuICAgIGxldCBtZW51SGFzU2xpZGVkRW5vdWdoRm9yQ2xvc2luZyA9IE1hdGguYWJzKGRpZmYpID49IHdpZHRoKjAuMzM7XG4gICAgbGV0IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSA9IGUudGFyZ2V0ID09PSB0aGlzLnJlZnMubWVudSAmJiBtb3ZlbWVudCA8PSA1O1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZEFMaW5rID0gZS50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2luZzogZmFsc2V9KTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBudWxsfSk7XG4gICAgICBpZiAobWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgfHwgeW91SnVzdENsaWNrZWRUaGVPdmVybGF5IHx8IHlvdUp1c3RDbGlja2VkQUxpbmspe1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvcGVuKCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiB0cnVlLCBvcGVuOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmlzaWJsZTogdHJ1ZX0pO1xuICAgIH0sIDEwKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJ2hpZGRlbid9KTtcbiAgfVxuICBjbG9zZUJ5T3ZlcmxheShlKXtcbiAgICBsZXQgaXNPdmVybGF5ID0gZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldDtcbiAgICBsZXQgaXNMaW5rID0gISFlLnRhcmdldC5ocmVmO1xuICAgIGlmICghdGhpcy5zdGF0ZS5kcmFnZ2luZyAmJiAoaXNPdmVybGF5IHx8IGlzTGluaykpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBjbG9zZSgpe1xuICAgICQoZG9jdW1lbnQuYm9keSkuY3NzKHsnb3ZlcmZsb3cnOiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiBmYWxzZSwgb3BlbjogZmFsc2V9KTtcbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH0sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YG1lbnUgJHt0aGlzLnN0YXRlLmRpc3BsYXllZCA/IFwiZGlzcGxheWVkXCIgOiBcIlwifSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLmRyYWdnaW5nID8gXCJkcmFnZ2luZ1wiIDogXCJcIn1gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNsb3NlQnlPdmVybGF5fSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoTW92ZT17dGhpcy5vblRvdWNoTW92ZX0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfSByZWY9XCJtZW51XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWNvbnRhaW5lclwiIHJlZj1cIm1lbnVDb250YWluZXJcIiBzdHlsZT17e2xlZnQ6IHRoaXMuc3RhdGUuZHJhZ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtZW51LWhlYWRlci1idXR0b24tY2xvc2UgaWNvbiBpY29uLWFycm93LWxlZnRcIj48L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJtZW51LWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBrZXk9e2luZGV4fT57aXRlbX08L2xpPlxuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+KTtcbiAgfVxufVxuICAiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jb25zdCBLRVlDT0RFUyA9IHtcbiAgRVNDQVBFOiAyN1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0geyBhY3RpdmU6IGZhbHNlIH07XG4gICAgdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2sgPSB0aGlzLmhhbmRsZVdyYXBwZXJDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwgPSB0aGlzLmNsb3NlUG9ydGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayA9IHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleWRvd24gPSB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKG5ld1Byb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBvcnRhbCh0cnVlKTtcbiAgfVxuXG4gIGhhbmRsZVdyYXBwZXJDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMub3BlblBvcnRhbCgpO1xuICB9XG5cbiAgb3BlblBvcnRhbChwcm9wcyA9IHRoaXMucHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKHByb3BzLCB0cnVlKTtcbiAgfVxuXG4gIGNsb3NlUG9ydGFsKGlzVW5tb3VudGVkID0gZmFsc2UpIHtcbiAgICBjb25zdCByZXNldFBvcnRhbFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICBSZWFjdERPTS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMubm9kZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICBpZiAoaXNVbm1vdW50ZWQgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuYmVmb3JlQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5iZWZvcmVDbG9zZSh0aGlzLm5vZGUsIHJlc2V0UG9ydGFsU3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzZXRQb3J0YWxTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVPdXRzaWRlTW91c2VDbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnBvcnRhbCk7XG4gICAgaWYgKHJvb3QuY29udGFpbnMoZS50YXJnZXQpIHx8IChlLmJ1dHRvbiAmJiBlLmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwoKTtcbiAgfVxuXG4gIGhhbmRsZUtleWRvd24oZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IEtFWUNPREVTLkVTQ0FQRSAmJiB0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclBvcnRhbChwcm9wcywgaXNPcGVuaW5nKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2ppbWZiL2Q5OWUwNjc4ZTlkYTcxNWNjZjY0NTQ5NjFlZjA0ZDFiXG4gICAgaWYgKHR5cGVvZiBwcm9wcy5jaGlsZHJlbi50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjaGlsZHJlbiA9IFJlYWN0LmNsb25lRWxlbWVudChwcm9wcy5jaGlsZHJlbiwge1xuICAgICAgICBjbG9zZVBvcnRhbDogdGhpcy5jbG9zZVBvcnRhbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3J0YWwgPSBSZWFjdERPTS51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcihcbiAgICAgIHRoaXMsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHRoaXMubm9kZSxcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGVcbiAgICApO1xuICAgIFxuICAgIGlmIChpc09wZW5pbmcpIHtcbiAgICAgIHRoaXMucHJvcHMub25PcGVuKHRoaXMubm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5vcGVuQnlDbGlja09uLCB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuUG9ydGFsLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIG9wZW5CeUNsaWNrT246IFByb3BUeXBlcy5lbGVtZW50LFxuICBjbG9zZU9uRXNjOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPbk91dHNpZGVDbGljazogUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25TY3JvbGw6IFByb3BUeXBlcy5ib29sLFxuICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgYmVmb3JlQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblVwZGF0ZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cblBvcnRhbC5kZWZhdWx0UHJvcHMgPSB7XG4gIG9uT3BlbjogKCkgPT4ge30sXG4gIG9uQ2xvc2U6ICgpID0+IHt9LFxuICBvblVwZGF0ZTogKCkgPT4ge31cbn07IiwiaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4JztcbmltcG9ydCBCb2R5IGZyb20gJy4uL2NvbXBvbmVudHMvZnJvbnRwYWdlL2JvZHkuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhGcm9udHBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgaWQ9XCJyb290XCI+XG4gICAgICA8Tm90aWZpY2F0aW9ucz48L05vdGlmaWNhdGlvbnM+XG4gICAgICA8Qm9keT48L0JvZHk+XG4gICAgPC9kaXY+KTtcbiAgfVxufSIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5yZWR1eExvZ2dlcj1lLnJlZHV4TG9nZ2VyfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Uuc3VwZXJfPXQsZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmUsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSl9ZnVuY3Rpb24gcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwia2luZFwiLHt2YWx1ZTplLGVudW1lcmFibGU6ITB9KSx0JiZ0Lmxlbmd0aCYmT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJwYXRoXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG4oZSx0LHIpe24uc3VwZXJfLmNhbGwodGhpcyxcIkVcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInJoc1wiLHt2YWx1ZTpyLGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBvKGUsdCl7by5zdXBlcl8uY2FsbCh0aGlzLFwiTlwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGkoZSx0KXtpLnN1cGVyXy5jYWxsKHRoaXMsXCJEXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJsaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gYShlLHQscil7YS5zdXBlcl8uY2FsbCh0aGlzLFwiQVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaW5kZXhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpdGVtXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGwoZSx0LHIpe3ZhciBuPWUuc2xpY2UoKHJ8fHQpKzF8fGUubGVuZ3RoKTtyZXR1cm4gZS5sZW5ndGg9dDwwP2UubGVuZ3RoK3Q6dCxlLnB1c2guYXBwbHkoZSxuKSxlfWZ1bmN0aW9uIGMoZSl7dmFyIHQ9dm9pZCAwPT09ZT9cInVuZGVmaW5lZFwiOk4oZSk7cmV0dXJuXCJvYmplY3RcIiE9PXQ/dDplPT09TWF0aD9cIm1hdGhcIjpudWxsPT09ZT9cIm51bGxcIjpBcnJheS5pc0FycmF5KGUpP1wiYXJyYXlcIjpcIltvYmplY3QgRGF0ZV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKT9cImRhdGVcIjpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvU3RyaW5nJiYvXlxcLy4qXFwvLy50ZXN0KGUudG9TdHJpbmcoKSk/XCJyZWdleHBcIjpcIm9iamVjdFwifWZ1bmN0aW9uIHUoZSx0LHIsZixzLGQscCl7cz1zfHxbXSxwPXB8fFtdO3ZhciBnPXMuc2xpY2UoMCk7aWYodm9pZCAwIT09ZCl7aWYoZil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZiYmZihnLGQpKXJldHVybjtpZihcIm9iamVjdFwiPT09KHZvaWQgMD09PWY/XCJ1bmRlZmluZWRcIjpOKGYpKSl7aWYoZi5wcmVmaWx0ZXImJmYucHJlZmlsdGVyKGcsZCkpcmV0dXJuO2lmKGYubm9ybWFsaXplKXt2YXIgaD1mLm5vcm1hbGl6ZShnLGQsZSx0KTtoJiYoZT1oWzBdLHQ9aFsxXSl9fX1nLnB1c2goZCl9XCJyZWdleHBcIj09PWMoZSkmJlwicmVnZXhwXCI9PT1jKHQpJiYoZT1lLnRvU3RyaW5nKCksdD10LnRvU3RyaW5nKCkpO3ZhciB2PXZvaWQgMD09PWU/XCJ1bmRlZmluZWRcIjpOKGUpLHk9dm9pZCAwPT09dD9cInVuZGVmaW5lZFwiOk4odCksYj1cInVuZGVmaW5lZFwiIT09dnx8cCYmcFtwLmxlbmd0aC0xXS5saHMmJnBbcC5sZW5ndGgtMV0ubGhzLmhhc093blByb3BlcnR5KGQpLG09XCJ1bmRlZmluZWRcIiE9PXl8fHAmJnBbcC5sZW5ndGgtMV0ucmhzJiZwW3AubGVuZ3RoLTFdLnJocy5oYXNPd25Qcm9wZXJ0eShkKTtpZighYiYmbSlyKG5ldyBvKGcsdCkpO2Vsc2UgaWYoIW0mJmIpcihuZXcgaShnLGUpKTtlbHNlIGlmKGMoZSkhPT1jKHQpKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwiZGF0ZVwiPT09YyhlKSYmZS10IT0wKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwib2JqZWN0XCI9PT12JiZudWxsIT09ZSYmbnVsbCE9PXQpaWYocC5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHQubGhzPT09ZX0pLmxlbmd0aCllIT09dCYmcihuZXcgbihnLGUsdCkpO2Vsc2V7aWYocC5wdXNoKHtsaHM6ZSxyaHM6dH0pLEFycmF5LmlzQXJyYXkoZSkpe3ZhciB3O2UubGVuZ3RoO2Zvcih3PTA7dzxlLmxlbmd0aDt3Kyspdz49dC5sZW5ndGg/cihuZXcgYShnLHcsbmV3IGkodm9pZCAwLGVbd10pKSk6dShlW3ddLHRbd10scixmLGcsdyxwKTtmb3IoO3c8dC5sZW5ndGg7KXIobmV3IGEoZyx3LG5ldyBvKHZvaWQgMCx0W3crK10pKSl9ZWxzZXt2YXIgeD1PYmplY3Qua2V5cyhlKSxTPU9iamVjdC5rZXlzKHQpO3guZm9yRWFjaChmdW5jdGlvbihuLG8pe3ZhciBpPVMuaW5kZXhPZihuKTtpPj0wPyh1KGVbbl0sdFtuXSxyLGYsZyxuLHApLFM9bChTLGkpKTp1KGVbbl0sdm9pZCAwLHIsZixnLG4scCl9KSxTLmZvckVhY2goZnVuY3Rpb24oZSl7dSh2b2lkIDAsdFtlXSxyLGYsZyxlLHApfSl9cC5sZW5ndGg9cC5sZW5ndGgtMX1lbHNlIGUhPT10JiYoXCJudW1iZXJcIj09PXYmJmlzTmFOKGUpJiZpc05hTih0KXx8cihuZXcgbihnLGUsdCkpKX1mdW5jdGlvbiBmKGUsdCxyLG4pe3JldHVybiBuPW58fFtdLHUoZSx0LGZ1bmN0aW9uKGUpe2UmJm4ucHVzaChlKX0sciksbi5sZW5ndGg/bjp2b2lkIDB9ZnVuY3Rpb24gcyhlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBvW3IucGF0aFtuXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpvW3IucGF0aFtuXV09ci5yaHN9fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmU9bChlLHQpO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6ZVt0XT1yLnJoc31yZXR1cm4gZX1mdW5jdGlvbiBkKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe2Zvcih2YXIgbj1lLG89LTEsaT1yLnBhdGg/ci5wYXRoLmxlbmd0aC0xOjA7KytvPGk7KXZvaWQgMD09PW5bci5wYXRoW29dXSYmKG5bci5wYXRoW29dXT1cIm51bWJlclwiPT10eXBlb2Ygci5wYXRoW29dP1tdOnt9KSxuPW5bci5wYXRoW29dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhyLnBhdGg/bltyLnBhdGhbb11dOm4sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpkZWxldGUgbltyLnBhdGhbb11dO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6bltyLnBhdGhbb11dPXIucmhzfX19ZnVuY3Rpb24gcChlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmNhc2VcIkVcIjpvW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBvW3IucGF0aFtuXV19fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmNhc2VcIkVcIjplW3RdPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjplPWwoZSx0KX1yZXR1cm4gZX1mdW5jdGlvbiBnKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe3ZhciBuLG8saT1lO2ZvcihvPXIucGF0aC5sZW5ndGgtMSxuPTA7bjxvO24rKyl2b2lkIDA9PT1pW3IucGF0aFtuXV0mJihpW3IucGF0aFtuXV09e30pLGk9aVtyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKGlbci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmNhc2VcIkVcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBpW3IucGF0aFtuXV19fX1mdW5jdGlvbiBoKGUsdCxyKXtpZihlJiZ0KXt1KGUsdCxmdW5jdGlvbihuKXtyJiYhcihlLHQsbil8fGQoZSx0LG4pfSl9fWZ1bmN0aW9uIHYoZSl7cmV0dXJuXCJjb2xvcjogXCIrRltlXS5jb2xvcitcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIn1mdW5jdGlvbiB5KGUpe3ZhciB0PWUua2luZCxyPWUucGF0aCxuPWUubGhzLG89ZS5yaHMsaT1lLmluZGV4LGE9ZS5pdGVtO3N3aXRjaCh0KXtjYXNlXCJFXCI6cmV0dXJuW3Iuam9pbihcIi5cIiksbixcIuKGklwiLG9dO2Nhc2VcIk5cIjpyZXR1cm5bci5qb2luKFwiLlwiKSxvXTtjYXNlXCJEXCI6cmV0dXJuW3Iuam9pbihcIi5cIildO2Nhc2VcIkFcIjpyZXR1cm5bci5qb2luKFwiLlwiKStcIltcIitpK1wiXVwiLGFdO2RlZmF1bHQ6cmV0dXJuW119fWZ1bmN0aW9uIGIoZSx0LHIsbil7dmFyIG89ZihlLHQpO3RyeXtuP3IuZ3JvdXBDb2xsYXBzZWQoXCJkaWZmXCIpOnIuZ3JvdXAoXCJkaWZmXCIpfWNhdGNoKGUpe3IubG9nKFwiZGlmZlwiKX1vP28uZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgdD1lLmtpbmQsbj15KGUpO3IubG9nLmFwcGx5KHIsW1wiJWMgXCIrRlt0XS50ZXh0LHYodCldLmNvbmNhdChQKG4pKSl9KTpyLmxvZyhcIuKAlOKAlCBubyBkaWZmIOKAlOKAlFwiKTt0cnl7ci5ncm91cEVuZCgpfWNhdGNoKGUpe3IubG9nKFwi4oCU4oCUIGRpZmYgZW5kIOKAlOKAlCBcIil9fWZ1bmN0aW9uIG0oZSx0LHIsbil7c3dpdGNoKHZvaWQgMD09PWU/XCJ1bmRlZmluZWRcIjpOKGUpKXtjYXNlXCJvYmplY3RcIjpyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlW25dP2Vbbl0uYXBwbHkoZSxQKHIpKTplW25dO2Nhc2VcImZ1bmN0aW9uXCI6cmV0dXJuIGUodCk7ZGVmYXVsdDpyZXR1cm4gZX19ZnVuY3Rpb24gdyhlKXt2YXIgdD1lLnRpbWVzdGFtcCxyPWUuZHVyYXRpb247cmV0dXJuIGZ1bmN0aW9uKGUsbixvKXt2YXIgaT1bXCJhY3Rpb25cIl07cmV0dXJuIGkucHVzaChcIiVjXCIrU3RyaW5nKGUudHlwZSkpLHQmJmkucHVzaChcIiVjQCBcIituKSxyJiZpLnB1c2goXCIlYyhpbiBcIitvLnRvRml4ZWQoMikrXCIgbXMpXCIpLGkuam9pbihcIiBcIil9fWZ1bmN0aW9uIHgoZSx0KXt2YXIgcj10LmxvZ2dlcixuPXQuYWN0aW9uVHJhbnNmb3JtZXIsbz10LnRpdGxlRm9ybWF0dGVyLGk9dm9pZCAwPT09bz93KHQpOm8sYT10LmNvbGxhcHNlZCxsPXQuY29sb3JzLGM9dC5sZXZlbCx1PXQuZGlmZixmPXZvaWQgMD09PXQudGl0bGVGb3JtYXR0ZXI7ZS5mb3JFYWNoKGZ1bmN0aW9uKG8scyl7dmFyIGQ9by5zdGFydGVkLHA9by5zdGFydGVkVGltZSxnPW8uYWN0aW9uLGg9by5wcmV2U3RhdGUsdj1vLmVycm9yLHk9by50b29rLHc9by5uZXh0U3RhdGUseD1lW3MrMV07eCYmKHc9eC5wcmV2U3RhdGUseT14LnN0YXJ0ZWQtZCk7dmFyIFM9bihnKSxqPVwiZnVuY3Rpb25cIj09dHlwZW9mIGE/YShmdW5jdGlvbigpe3JldHVybiB3fSxnLG8pOmEsaz1EKHApLEU9bC50aXRsZT9cImNvbG9yOiBcIitsLnRpdGxlKFMpK1wiO1wiOlwiXCIsQT1bXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCJdO0EucHVzaChFKSx0LnRpbWVzdGFtcCYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKSx0LmR1cmF0aW9uJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpO3ZhciBPPWkoUyxrLHkpO3RyeXtqP2wudGl0bGUmJmY/ci5ncm91cENvbGxhcHNlZC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cENvbGxhcHNlZChPKTpsLnRpdGxlJiZmP3IuZ3JvdXAuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXAoTyl9Y2F0Y2goZSl7ci5sb2coTyl9dmFyIE49bShjLFMsW2hdLFwicHJldlN0YXRlXCIpLFA9bShjLFMsW1NdLFwiYWN0aW9uXCIpLEM9bShjLFMsW3YsaF0sXCJlcnJvclwiKSxGPW0oYyxTLFt3XSxcIm5leHRTdGF0ZVwiKTtpZihOKWlmKGwucHJldlN0YXRlKXt2YXIgTD1cImNvbG9yOiBcIitsLnByZXZTdGF0ZShoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW05dKFwiJWMgcHJldiBzdGF0ZVwiLEwsaCl9ZWxzZSByW05dKFwicHJldiBzdGF0ZVwiLGgpO2lmKFApaWYobC5hY3Rpb24pe3ZhciBUPVwiY29sb3I6IFwiK2wuYWN0aW9uKFMpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbUF0oXCIlYyBhY3Rpb24gICAgXCIsVCxTKX1lbHNlIHJbUF0oXCJhY3Rpb24gICAgXCIsUyk7aWYodiYmQylpZihsLmVycm9yKXt2YXIgTT1cImNvbG9yOiBcIitsLmVycm9yKHYsaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiO3JbQ10oXCIlYyBlcnJvciAgICAgXCIsTSx2KX1lbHNlIHJbQ10oXCJlcnJvciAgICAgXCIsdik7aWYoRilpZihsLm5leHRTdGF0ZSl7dmFyIF89XCJjb2xvcjogXCIrbC5uZXh0U3RhdGUodykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltGXShcIiVjIG5leHQgc3RhdGVcIixfLHcpfWVsc2UgcltGXShcIm5leHQgc3RhdGVcIix3KTt1JiZiKGgsdyxyLGopO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgbG9nIGVuZCDigJTigJRcIil9fSl9ZnVuY3Rpb24gUygpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PU9iamVjdC5hc3NpZ24oe30sTCxlKSxyPXQubG9nZ2VyLG49dC5zdGF0ZVRyYW5zZm9ybWVyLG89dC5lcnJvclRyYW5zZm9ybWVyLGk9dC5wcmVkaWNhdGUsYT10LmxvZ0Vycm9ycyxsPXQuZGlmZlByZWRpY2F0ZTtpZih2b2lkIDA9PT1yKXJldHVybiBmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGUodCl9fX07aWYoZS5nZXRTdGF0ZSYmZS5kaXNwYXRjaClyZXR1cm4gY29uc29sZS5lcnJvcihcIltyZWR1eC1sb2dnZXJdIHJlZHV4LWxvZ2dlciBub3QgaW5zdGFsbGVkLiBNYWtlIHN1cmUgdG8gcGFzcyBsb2dnZXIgaW5zdGFuY2UgYXMgbWlkZGxld2FyZTpcXG4vLyBMb2dnZXIgd2l0aCBkZWZhdWx0IG9wdGlvbnNcXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdyZWR1eC1sb2dnZXInXFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG4vLyBPciB5b3UgY2FuIGNyZWF0ZSB5b3VyIG93biBsb2dnZXIgd2l0aCBjdXN0b20gb3B0aW9ucyBodHRwOi8vYml0Lmx5L3JlZHV4LWxvZ2dlci1vcHRpb25zXFxuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbmNvbnN0IGxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XFxuICAvLyAuLi5vcHRpb25zXFxufSk7XFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG5cIiksZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBlKHQpfX19O3ZhciBjPVtdO3JldHVybiBmdW5jdGlvbihlKXt2YXIgcj1lLmdldFN0YXRlO3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odSl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgaSYmIWkocix1KSlyZXR1cm4gZSh1KTt2YXIgZj17fTtjLnB1c2goZiksZi5zdGFydGVkPU8ubm93KCksZi5zdGFydGVkVGltZT1uZXcgRGF0ZSxmLnByZXZTdGF0ZT1uKHIoKSksZi5hY3Rpb249dTt2YXIgcz12b2lkIDA7aWYoYSl0cnl7cz1lKHUpfWNhdGNoKGUpe2YuZXJyb3I9byhlKX1lbHNlIHM9ZSh1KTtmLnRvb2s9Ty5ub3coKS1mLnN0YXJ0ZWQsZi5uZXh0U3RhdGU9bihyKCkpO3ZhciBkPXQuZGlmZiYmXCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHIsdSk6dC5kaWZmO2lmKHgoYyxPYmplY3QuYXNzaWduKHt9LHQse2RpZmY6ZH0pKSxjLmxlbmd0aD0wLGYuZXJyb3IpdGhyb3cgZi5lcnJvcjtyZXR1cm4gc319fX12YXIgaixrLEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gbmV3IEFycmF5KHQrMSkuam9pbihlKX0sQT1mdW5jdGlvbihlLHQpe3JldHVybiBFKFwiMFwiLHQtZS50b1N0cmluZygpLmxlbmd0aCkrZX0sRD1mdW5jdGlvbihlKXtyZXR1cm4gQShlLmdldEhvdXJzKCksMikrXCI6XCIrQShlLmdldE1pbnV0ZXMoKSwyKStcIjpcIitBKGUuZ2V0U2Vjb25kcygpLDIpK1wiLlwiK0EoZS5nZXRNaWxsaXNlY29uZHMoKSwzKX0sTz1cInVuZGVmaW5lZFwiIT10eXBlb2YgcGVyZm9ybWFuY2UmJm51bGwhPT1wZXJmb3JtYW5jZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgcGVyZm9ybWFuY2Uubm93P3BlcmZvcm1hbmNlOkRhdGUsTj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfSxQPWZ1bmN0aW9uKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpe2Zvcih2YXIgdD0wLHI9QXJyYXkoZS5sZW5ndGgpO3Q8ZS5sZW5ndGg7dCsrKXJbdF09ZVt0XTtyZXR1cm4gcn1yZXR1cm4gQXJyYXkuZnJvbShlKX0sQz1bXTtqPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGdsb2JhbD9cInVuZGVmaW5lZFwiOk4oZ2xvYmFsKSkmJmdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30saz1qLkRlZXBEaWZmLGsmJkMucHVzaChmdW5jdGlvbigpe3ZvaWQgMCE9PWsmJmouRGVlcERpZmY9PT1mJiYoai5EZWVwRGlmZj1rLGs9dm9pZCAwKX0pLHQobixyKSx0KG8sciksdChpLHIpLHQoYSxyKSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhmLHtkaWZmOnt2YWx1ZTpmLGVudW1lcmFibGU6ITB9LG9ic2VydmFibGVEaWZmOnt2YWx1ZTp1LGVudW1lcmFibGU6ITB9LGFwcGx5RGlmZjp7dmFsdWU6aCxlbnVtZXJhYmxlOiEwfSxhcHBseUNoYW5nZTp7dmFsdWU6ZCxlbnVtZXJhYmxlOiEwfSxyZXZlcnRDaGFuZ2U6e3ZhbHVlOmcsZW51bWVyYWJsZTohMH0saXNDb25mbGljdDp7dmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdm9pZCAwIT09a30sZW51bWVyYWJsZTohMH0sbm9Db25mbGljdDp7dmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gQyYmKEMuZm9yRWFjaChmdW5jdGlvbihlKXtlKCl9KSxDPW51bGwpLGZ9LGVudW1lcmFibGU6ITB9fSk7dmFyIEY9e0U6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJDSEFOR0VEOlwifSxOOntjb2xvcjpcIiM0Q0FGNTBcIix0ZXh0OlwiQURERUQ6XCJ9LEQ6e2NvbG9yOlwiI0Y0NDMzNlwiLHRleHQ6XCJERUxFVEVEOlwifSxBOntjb2xvcjpcIiMyMTk2RjNcIix0ZXh0OlwiQVJSQVk6XCJ9fSxMPXtsZXZlbDpcImxvZ1wiLGxvZ2dlcjpjb25zb2xlLGxvZ0Vycm9yczohMCxjb2xsYXBzZWQ6dm9pZCAwLHByZWRpY2F0ZTp2b2lkIDAsZHVyYXRpb246ITEsdGltZXN0YW1wOiEwLHN0YXRlVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGFjdGlvblRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxlcnJvclRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxjb2xvcnM6e3RpdGxlOmZ1bmN0aW9uKCl7cmV0dXJuXCJpbmhlcml0XCJ9LHByZXZTdGF0ZTpmdW5jdGlvbigpe3JldHVyblwiIzlFOUU5RVwifSxhY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5cIiMwM0E5RjRcIn0sbmV4dFN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjNENBRjUwXCJ9LGVycm9yOmZ1bmN0aW9uKCl7cmV0dXJuXCIjRjIwNDA0XCJ9fSxkaWZmOiExLGRpZmZQcmVkaWNhdGU6dm9pZCAwLHRyYW5zZm9ybWVyOnZvaWQgMH0sVD1mdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PWUuZGlzcGF0Y2gscj1lLmdldFN0YXRlO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHIpcmV0dXJuIFMoKSh7ZGlzcGF0Y2g6dCxnZXRTdGF0ZTpyfSk7Y29uc29sZS5lcnJvcihcIlxcbltyZWR1eC1sb2dnZXIgdjNdIEJSRUFLSU5HIENIQU5HRVxcbltyZWR1eC1sb2dnZXIgdjNdIFNpbmNlIDMuMC4wIHJlZHV4LWxvZ2dlciBleHBvcnRzIGJ5IGRlZmF1bHQgbG9nZ2VyIHdpdGggZGVmYXVsdCBzZXR0aW5ncy5cXG5bcmVkdXgtbG9nZ2VyIHYzXSBDaGFuZ2VcXG5bcmVkdXgtbG9nZ2VyIHYzXSBpbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5bcmVkdXgtbG9nZ2VyIHYzXSB0b1xcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5cIil9O2UuZGVmYXVsdHM9TCxlLmNyZWF0ZUxvZ2dlcj1TLGUubG9nZ2VyPVQsZS5kZWZhdWx0PVQsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImltcG9ydCBBcHAgZnJvbSAnLi9jb250YWluZXJzL2luZGV4LmZyb250cGFnZS5qc3gnO1xuaW1wb3J0IHJlZHVjZXIgZnJvbSAnLi9yZWR1Y2Vycy9pbmRleC5mcm9udHBhZ2UnO1xuXG5pbXBvcnQge2xvZ2dlcn0gZnJvbSAnLi9kZWJ1Zy9yZWR1eC1sb2dnZXInO1xubGV0IHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUocmVkdWNlciwgUmVkdXguYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcikpO1xuLy9sZXQgc3RvcmUgPSBSZWR1eC5jcmVhdGVTdG9yZShyZWR1Y2VyKTtcblxubGV0IFByb3ZpZGVyID0gUmVhY3RSZWR1eC5Qcm92aWRlcjtcblxuUmVhY3RET00ucmVuZGVyKDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICA8QXBwLz5cbjwvUHJvdmlkZXI+LCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FwcFwiKSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG4gIHZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGludmFyaWFudCh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicsICclczogJXMgdHlwZSBgJXNgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tICcgKyAnUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSk7XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIHdhcm5pbmcoIWVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRXJyb3IsICclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUsIHR5cGVvZiBlcnJvcik7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICB3YXJuaW5nKGZhbHNlLCAnRmFpbGVkICVzIHR5cGU6ICVzJXMnLCBsb2NhdGlvbiwgZXJyb3IubWVzc2FnZSwgc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc2hpbShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGlmIChzZWNyZXQgPT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAvLyBJdCBpcyBzdGlsbCBzYWZlIHdoZW4gY2FsbGVkIGZyb20gUmVhY3QuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGludmFyaWFudChcbiAgICAgIGZhbHNlLFxuICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgJ1VzZSBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKSB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgKTtcbiAgfTtcbiAgc2hpbS5pc1JlcXVpcmVkID0gc2hpbTtcbiAgZnVuY3Rpb24gZ2V0U2hpbSgpIHtcbiAgICByZXR1cm4gc2hpbTtcbiAgfTtcbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBzaGltLFxuICAgIGJvb2w6IHNoaW0sXG4gICAgZnVuYzogc2hpbSxcbiAgICBudW1iZXI6IHNoaW0sXG4gICAgb2JqZWN0OiBzaGltLFxuICAgIHN0cmluZzogc2hpbSxcbiAgICBzeW1ib2w6IHNoaW0sXG5cbiAgICBhbnk6IHNoaW0sXG4gICAgYXJyYXlPZjogZ2V0U2hpbSxcbiAgICBlbGVtZW50OiBzaGltLFxuICAgIGluc3RhbmNlT2Y6IGdldFNoaW0sXG4gICAgbm9kZTogc2hpbSxcbiAgICBvYmplY3RPZjogZ2V0U2hpbSxcbiAgICBvbmVPZjogZ2V0U2hpbSxcbiAgICBvbmVPZlR5cGU6IGdldFNoaW0sXG4gICAgc2hhcGU6IGdldFNoaW1cbiAgfTtcblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGVtcHR5RnVuY3Rpb247XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXJcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgd2FybmluZyhcbiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCVzYCBwcm9wIG9uIGAlc2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICtcbiAgICAgICAgICAgICAgJ2FuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICAgJ1lvdSBtYXkgYmUgc2VlaW5nIHRoaXMgd2FybmluZyBkdWUgdG8gYSB0aGlyZC1wYXJ0eSBQcm9wVHlwZXMgJyArXG4gICAgICAgICAgICAgICdsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgJyArICdmb3IgZGV0YWlscy4nLFxuICAgICAgICAgICAgICBwcm9wRnVsbE5hbWUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIGFycmF5T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgd2FybmluZyhcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGlkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICVzIGF0IGluZGV4ICVzLicsXG4gICAgICAgICAgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpLFxuICAgICAgICAgIGlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wVmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuICFwcm9wVmFsdWU7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5ldmVyeShpc05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTm9kZShlbnRyeVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAgIC8vIE5hdGl2ZSBTeW1ib2wuXG4gICAgaWYgKHByb3BUeXBlID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIFN5bWJvbC5mb3IgJiZcbiAgICBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gICAgMHhlYWM3O1xuXG4gIHZhciBpc1ZhbGlkRWxlbWVudCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgb2JqZWN0ICE9PSBudWxsICYmXG4gICAgICBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIvL1RPRE8gdGhpcyByZWR1Y2VyIHVzZXMgdGhlIGFwaSB0aGF0IGludGVyYWN0cyB3aXRoIHRoZSBET00gaW4gb3JkZXIgdG9cbi8vcmV0cmlldmUgZGF0YSwgcGxlYXNlIGZpeCBpbiBuZXh0IHZlcnNpb25zXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZXMoc3RhdGU9e1xuICBhdmFsaWFibGU6ICQubWFrZUFycmF5KCQoXCIjbGFuZ3VhZ2UtcGlja2VyIGFcIikubWFwKChpbmRleCwgZWxlbWVudCk9PntcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJChlbGVtZW50KS50ZXh0KCkudHJpbSgpLFxuICAgICAgbG9jYWxlOiAkKGVsZW1lbnQpLmRhdGEoJ2xvY2FsZScpXG4gICAgfVxuICB9KSksXG4gIGN1cnJlbnQ6ICQoXCIjbG9jYWxlXCIpLnRleHQoKVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0xPQ0FMRScpe1xuICAgIC8vVE9ETyBGb3Igc29tZSByZWFzb24gdGhpcyBkb2Vzbid0IHdhbnQgdG8gd29yaywgdGhpcyByZWR1Y2VyIG5lZWRzIHVyZ2VudCBmaXhcbiAgICAkKCcjbGFuZ3VhZ2UtcGlja2VyIGFbZGF0YS1sb2NhbGU9XCInICsgYWN0aW9uLnBheWxvYWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtjdXJyZW50OiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RpZmljYXRpb25zKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBRERfTk9USUZJQ0FUSU9OJykge1xuICAgIHZhciBpZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHN0YXRlLmNvbmNhdChPYmplY3QuYXNzaWduKHtpZDogaWR9LCBhY3Rpb24ucGF5bG9hZCkpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnSElERV9OT1RJRklDQVRJT04nKSB7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiBlbGVtZW50LmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaTE4bihzdGF0ZT17XG4gIHRleHQ6IHtcbiAgICBnZXQoa2V5LCAuLi5hcmdzKXtcbiAgICAgIGxldCB0ZXh0ID0gZ2V0TG9jYWxlVGV4dChrZXksIGFyZ3MpO1xuICAgICAgaWYgKHRleHQpe1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9ybWF0KGRhdGU9bmV3IERhdGUoKSwgZm9ybWF0PVwiTFwiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZvcm1hdChmb3JtYXQpO1xuICAgIH0sXG4gICAgZnJvbU5vdyhkYXRlPW5ldyBEYXRlKCkpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZnJvbU5vdygpO1xuICAgIH0sXG4gICAgc3VidHJhY3QoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5zdWJ0cmFjdChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfSxcbiAgICBhZGQoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5hZGQoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH1cbiAgfVxufSwgYWN0aW9uKXtcbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBub3RpZmljYXRpb25zIGZyb20gJy4vYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vYmFzZS9sb2NhbGVzJztcbmltcG9ydCBpMThuIGZyb20gJy4vZ2VuZXJhbC9pMThuJztcblxuZXhwb3J0IGRlZmF1bHQgUmVkdXguY29tYmluZVJlZHVjZXJzKHtcbiAgbm90aWZpY2F0aW9ucyxcbiAgaTE4bixcbiAgbG9jYWxlc1xufSk7Il19
