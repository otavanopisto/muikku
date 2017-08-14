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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //loadModules([
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
//  
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-announcements.js.jsf",
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-important.js.jsf",
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-last-messages.js.jsf",
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-workspaces.js.jsf",
//  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-continue-studies.js.jsf"
//], function(){
//  $(document).muikkuWebSocket();
//  $(document.body).baseControllerWidget();
//  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
//  $.getWidgetContainerFor("panel-announcements").panelAnnouncementsControllerWidget();
//  $.getWidgetContainerFor("panel-continue-studies").panelContinueStudiesControllerWidget({
//    onResolved: function(self, lastWorkspace){
//      if (lastWorkspace){
//        self.element.parent().show();
//      }
//    }
//  });
//  $.getWidgetContainerFor("panel-important").panelImportantControllerWidget();
//  $.getWidgetContainerFor("panel-last-messages").panelMessagesControllerWidget();
//  $.getWidgetContainerFor("panel-workspaces").panelWorkspacesControllerWidget();
//});

var Index = function (_React$Component) {
  _inherits(Index, _React$Component);

  function Index() {
    _classCallCheck(this, Index);

    return _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).apply(this, arguments));
  }

  _createClass(Index, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'root' },
        React.createElement(_notifications2.default, null)
      );
    }
  }]);

  return Index;
}(React.Component);

exports.default = Index;

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

var _index = require('./containers/index.jsx');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./reducers/index');

var _index4 = _interopRequireDefault(_index3);

var _reduxLogger = require('./debug/redux-logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = Redux.createStore(_index4.default, Redux.applyMiddleware(_reduxLogger.logger));
//let store = Redux.createStore(reducer);

var Provider = ReactRedux.Provider;

ReactDOM.render(React.createElement(
  Provider,
  { store: store },
  React.createElement(_index2.default, null)
), document.querySelector("#app"));

},{"./containers/index.jsx":17,"./debug/redux-logger":18,"./reducers/index":32}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiY29tcG9uZW50cy9iYXNlL2ZvcmdvdC1wYXNzd29yZC1kaWFsb2cuanN4IiwiY29tcG9uZW50cy9iYXNlL2xvZ2luLWJ1dHRvbi5qc3giLCJjb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3giLCJjb21wb25lbnRzL2Zyb250cGFnZS9ib2R5LmpzeCIsImNvbXBvbmVudHMvZnJvbnRwYWdlL2ZlZWQuanN4IiwiY29tcG9uZW50cy9mcm9udHBhZ2UvbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kaWFsb2cuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2Ryb3Bkb3duLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9mZWVkLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9tZW51LmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9wb3J0YWwuanN4IiwiY29udGFpbmVycy9pbmRleC5qc3giLCJkZWJ1Zy9yZWR1eC1sb2dnZXIuanMiLCJpbmRleC5qc3giLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJyZWR1Y2Vycy9iYXNlL2xvY2FsZXMuanMiLCJyZWR1Y2Vycy9iYXNlL25vdGlmaWNhdGlvbnMuanMiLCJyZWR1Y2Vycy9nZW5lcmFsL2kxOG4uanMiLCJyZWR1Y2Vycy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0FlO0FBQ2IsYUFBVyxtQkFBUyxNQUFULEVBQWdCO0FBQ3pCLFdBQU87QUFDTCxjQUFRLFlBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQU5ZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsdUJBQXFCLDZCQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBMkI7QUFDOUMsV0FBTztBQUNMLGNBQVEsa0JBREg7QUFFTCxpQkFBVztBQUNULG9CQUFZLFFBREg7QUFFVCxtQkFBVztBQUZGO0FBRk4sS0FBUDtBQU9ELEdBVFk7QUFVYixvQkFBa0IsMEJBQVMsWUFBVCxFQUFzQjtBQUN0QyxXQUFPO0FBQ0wsY0FBUSxtQkFESDtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBZlksQzs7Ozs7Ozs7Ozs7QUNBZjs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxvQjs7Ozs7Ozs7Ozs7NkJBS0k7QUFBQTs7QUFDTixVQUFJLFVBQVc7QUFBQTtBQUFBO0FBQ1YsYUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUF5Qix5REFBekIsQ0FEVTtBQUVYLHVDQUZXO0FBR1gsdUNBSFc7QUFJWDtBQUFBO0FBQUEsWUFBTSxXQUFVLE1BQWhCO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0U7QUFBQTtBQUFBLGdCQUFPLFNBQVEsc0JBQWY7QUFBdUMs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaGdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFPOztBQUM5QyxlQUFPLE9BQU8sSUFBSSxJQUFKLENBQVMsSUFBVCxDQUFQLEVBQXVCLFFBQXZCLENBQWdDLEtBQWhDLEVBQXVDLEtBQXZDLEVBQThDLFFBQTlDLEVBQVA7QUFDRCxPQVRHO0FBVUosU0FWSSxpQkFVdUM7QUFBQSxZQUF2QyxJQUF1Qyx1RUFBbEMsSUFBSSxJQUFKLEVBQWtDO0FBQUEsWUFBdEIsS0FBc0IsdUVBQWhCLENBQWdCO0FBQUEsWUFBYixLQUFhLHVFQUFQLE1BQU87O0FBQ3pDLGVBQU8sT0FBTyxJQUFJLElBQUosQ0FBUyxJQUFULENBQVAsRUFBdUIsR0FBdkIsQ0FBMkIsS0FBM0IsRUFBa0MsS0FBbEMsRUFBeUMsUUFBekMsRUFBUDtBQUNEO0FBWkc7QUFYMkIsR0F5QnpCO0FBQUEsTUFBUCxNQUFPOztBQUNSLFNBQU8sS0FBUDtBQUNEOzs7Ozs7Ozs7QUMzQkQ7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBRWUsTUFBTSxlQUFOLENBQXNCO0FBQ25DLHdDQURtQztBQUVuQyxzQkFGbUM7QUFHbkM7QUFIbUMsQ0FBdEIsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCB7XG4gIHNldExvY2FsZTogZnVuY3Rpb24obG9jYWxlKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnU0VUX0xPQ0FMRScsXG4gICAgICAncGF5bG9hZCc6IGxvY2FsZVxuICAgIH1cbiAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gIGRpc3BsYXlOb3RpZmljYXRpb246IGZ1bmN0aW9uKG1lc3NhZ2UsIHNldmVyaXR5KXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnQUREX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3NldmVyaXR5Jzogc2V2ZXJpdHksXG4gICAgICAgICdtZXNzYWdlJzogbWVzc2FnZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaGlkZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obm90aWZpY2F0aW9uKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnSElERV9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiBub3RpZmljYXRpb25cbiAgICB9XG4gIH1cbn07IiwiaW1wb3J0IERpYWxvZyBmcm9tICcuLi9nZW5lcmFsL2RpYWxvZy5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY2xhc3MgRm9yZ290UGFzc3dvcmREaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgbGV0IGNvbnRlbnQgPSAoPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvcmdvdHBhc3N3b3JkLmZvcmdvdFBhc3N3b3JkRGlhbG9nLmluc3RydWN0aW9ucycpfVxuICAgICAgICA8YnIvPlxuICAgICAgICA8YnIvPlxuICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLXJvd1wiPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3Jnb3RwYXNzd29yZC1lbWFpbFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5lbWFpbCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiLz5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJmb3JtLWhpZGRlblwiIGlkPVwiZm9ybS1yZXNldC1wYXNzd29yZC1zdWJtaXRcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2Pik7XG4gICAgbGV0IGZvb3RlciA9IChjbG9zZURpYWxvZyk9PntcbiAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcm0tcmVzZXQtcGFzc3dvcmQtc3VibWl0XCIgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1sYXJnZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy5zZW5kQnV0dG9uTGFiZWwnKX1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1sYXJnZSBidXR0b24td2FyblwiIG9uQ2xpY2s9e2Nsb3NlRGlhbG9nfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9yZ290cGFzc3dvcmQuZm9yZ290UGFzc3dvcmREaWFsb2cuY2FuY2VsQnV0dG9uTGFiZWwnKX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9kaXY+XG4gICAgfVxuICAgIHJldHVybiA8RGlhbG9nIHRpdGxlPXt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RQYXNzd29yZERpYWxvZy50aXRsZScpfVxuICAgICAgY29udGVudD17Y29udGVudH0gZm9vdGVyPXtmb290ZXJ9IGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259PlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICA8L0RpYWxvZz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZvcmdvdFBhc3N3b3JkRGlhbG9nKTsiLCIvL1RPRE8gdW5saWtlIGxhbmd1YWdlIGNoYW5nZSwgbG9naW4gaW4gbmVlZHMgdG8gZXNjYXBlIHRoZSBjdXJyZW50XG4vL3BhZ2UgaGVuY2UgaXQgZG9lc24ndCByZWFsbHkgbmVlZCBhIHJlZHVjZXIsIGhvd2V2ZXIgaXQgY291bGQgYmUgaW1wbG1lbnRlZFxuLy9pZiBldmVyIHdlIHdpc2ggdG8gdHVybiBpdCBpbnRvIGEgU1BBXG5cbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9nZW5lcmFsL2xpbmsuanN4JztcblxuY2xhc3MgTG9naW5CdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLmxvZ2luID0gdGhpcy5sb2dpbi5iaW5kKHRoaXMpO1xuICB9XG4gIGxvZ2luKCl7XG4gICAgLy9UT0RPIHBsZWFzZSBsZXQncyBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzIHJhdGhlciB0aGFuIHRoZSBlbXVsYXRlZCB3YXlcbiAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgkKFwiI2xvZ2luXCIpLmF0dHIoXCJocmVmXCIpKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxMaW5rIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGJ1dHRvbiAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1idXR0b24tbG9naW5gfSBvbkNsaWNrPXt0aGlzLmxvZ2lufT5cbiAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5sb2dpbi5idXR0b25MYWJlbCcpfTwvc3Bhbj5cbiAgICA8L0xpbms+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKExvZ2luQnV0dG9uKTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmNsYXNzIE5vdGlmaWNhdGlvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5ub3RpZmljYXRpb25zLm1hcCgobm90aWZpY2F0aW9uKT0+e1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e25vdGlmaWNhdGlvbi5pZH0gY2xhc3NOYW1lPXtcIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtIG5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLVwiICsgbm90aWZpY2F0aW9uLnNldmVyaXR5fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57bm90aWZpY2F0aW9uLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLWNsb3NlXCIgb25DbGljaz17dGhpcy5wcm9wcy5oaWRlTm90aWZpY2F0aW9uLmJpbmQodGhpcywgbm90aWZpY2F0aW9uKX0+PC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuICBcbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbm90aWZpY2F0aW9uczogc3RhdGUubm90aWZpY2F0aW9uc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBSZWR1eC5iaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShOb3RpZmljYXRpb25zKTsiLCJpbXBvcnQgRnJvbnRwYWdlTmF2YmFyIGZyb20gJy4vbmF2YmFyLmpzeCc7XG5pbXBvcnQgRnJvbnRwYWdlRmVlZCBmcm9tICcuL2ZlZWQuanN4JztcblxuY2xhc3MgRnJvbnRwYWdlQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgdGhpcy5hZGRDYXJvdXNlbHMoKTtcbiAgfVxuICBhZGRDYXJvdXNlbHMoKXtcbiAgICAvL1RPRE8gdGhpcyBwaWVjZSBvZiBjb2RlIHVzIGRlcHJlY2F0ZWQgYW5kIHVzZXMganF1ZXJ5LCBub3RpY2UgdGhhdCB0aGlzXG4gICAgLy93aWxsIGJlIHZlcnkgYnVnZ3kgaWYgZXZlciB0aGUgZnJvbnRwYWdlIGJvZHkgdXBkYXRlcywgZWcgbWFraW5nIHRoZSBpMTggcmVkdWNlciBtb3JlIGVmZmljaWVudFxuICAgIC8vb3IgYWRkaW5nIGFub3RoZXIgcmVkdWNlciB0aGF0IGNhdXNlcyBjaGFuZ2VzIHRvIHRoZSBib2R5IHByb3BlcnRpZXNcbiAgICAvL3dlIG5lZWQgdG8gcmVwYWNlIHRoaXMgaWYgZXZlciBnb2luZyB0byBtYWtlIGJvZHkgdG8gdXBkYXRlXG4gICAgICBcbiAgICAkKCc8bGluay8+Jywge1xuICAgICAgcmVsOiAnc3R5bGVzaGVldCcsXG4gICAgICB0eXBlOiAndGV4dC9jc3MnLFxuICAgICAgaHJlZjogJy8vY2RuLm11aWtrdXZlcmtrby5maS9saWJzL3NsaWNrLzEuNi4wL3NsaWNrLmNzcydcbiAgICB9KS5hcHBlbmRUbygnaGVhZCcpO1xuICAgICAgXG4gICAgJC5nZXRTY3JpcHQoXCIvL2Nkbi5tdWlra3V2ZXJra28uZmkvbGlicy9zbGljay8xLjYuMC9zbGljay5taW4uanNcIiwgZnVuY3Rpb24oIGRhdGEsIHRleHRTdGF0dXMsIGpxeGhyICkge1xuICAgICAgJChcIi5jYXJvdXNlbC1pdGVtXCIpLmVhY2goKGluZGV4LCBlbGVtZW50KT0+e1xuICAgICAgICAkKGVsZW1lbnQpLnNob3coKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKFwiLmNhcm91c2VsXCIpLmVhY2goKGluZGV4LCBlbGVtZW50KT0+e1xuICAgICAgICAkKGVsZW1lbnQpLnNsaWNrKHtcbiAgICAgICAgICBhcHBlbmREb3RzOiAkKGVsZW1lbnQpLnNpYmxpbmdzKFwiLmNhcm91c2VsLWNvbnRyb2xzXCIpLFxuICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICBkb3RzQ2xhc3M6IFwiY2Fyb3VzZWwtZG90c1wiLFxuICAgICAgICAgIGZhZGU6IHRydWUsXG4gICAgICAgICAgc3BlZWQ6IDc1MCxcbiAgICAgICAgICB3YWl0Rm9yQW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY5LFxuICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGZhZGU6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImVtYmVkIGVtYmVkLWZ1bGxcIj5cbjxGcm9udHBhZ2VOYXZiYXIgLz5cbiAgICAgICAgICAgIFxuPGhlYWRlciBjbGFzc05hbWU9XCJmcm9udHBhZ2UgaGVyb1wiPlxuICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8td3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1pdGVtXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZSBidWJibGUtcmVzcG9uc2l2ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS10aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIuc3R1ZGVudEFwcGxpY2F0aW9uQnViYmxlLnRpdGxlJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1jb250ZW50XCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUuZGVzY3JpcHRpb24nKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlLWJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gYnV0dG9uLXNvZnQgYnV0dG9uLWR5bmFtaWMtaGVpZ2h0IGJ1dHRvbi13YXJuIGJ1dHRvbi1mb2N1c1wiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhlYWRlci5zdHVkZW50QXBwbGljYXRpb25CdWJibGUubGluaycpfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItbXVpa2t1LWxvZ29cIj5cbiAgICAgICAgPGltZyBjbGFzc05hbWU9XCJmcm9udHBhZ2UgbG9nbyBmcm9udHBhZ2UtbG9nby1tdWlra3UtdmVya2tvXCIgc3JjPVwiL2dmeC9vZi1zaXRlLWxvZ28ucG5nXCI+PC9pbWc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC11cHBlcmNhc2VcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LW11aWtrdS1hdXRob3JcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnNpdGUuYXV0aG9yJyl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1tdWlra3VcIj5NVUlLS1U8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXZlcmtrb1wiPlZFUktLTzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCB0ZXh0LXVwcGVyY2FzZSBmcm9udHBhZ2UtdGV4dC1tdWlra3UtZGVzY3JpcHRpb25cIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLnNpdGUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taXRlbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUgYnViYmxlLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaGVhZGVyLm9wZW5NYXRlcmlhbHNCdWJibGUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUtY29udGVudFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS5kZXNjcmlwdGlvbicpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1YmJsZS1idXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uIGJ1dHRvbi1zb2Z0IGJ1dHRvbi1keW5hbWljLWhlaWdodCBidXR0b24td2FyblwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5oZWFkZXIub3Blbk1hdGVyaWFsc0J1YmJsZS5saW5rJyl9PC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvaGVhZGVyPlxuXG48ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBzZXBhcmF0b3JcIj48L2Rpdj5cblxuPGRpdiBjbGFzc05hbWU9XCJzY3JlZW4tY29udGFpbmVyXCI+XG4gIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuLWNvbnRhaW5lci13cmFwcGVyXCI+XG4gICAgICAgICAgXG4gICAgPHNlY3Rpb24gaWQ9XCJzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1zZWN0aW9uXCI+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc2VjdGlvblRpdGxlLnN0dWR5aW5nJyl9PC9oMj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIG9yZGVyZWQtY29udGFpbmVyLXJvdyBvcmRlcmVkLWNvbnRhaW5lci1yZXNwb25zaXZlIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1zdHVkeWluZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLXN0dWR5aW5nXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfbmV0dGlsdWtpby5wbmdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlsdWtpby50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aWx1a2lvLmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9uZXR0aWx1a2lvX2VzaXR0ZWx5XCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tc3R1ZHlpbmctcmVhZG1vcmVcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcucmVhZE1vcmUubGluaycpfSA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtc2Nob29sXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmFfbmV0dGlwZXJ1c2tvdWx1LnBuZ1wiXG4gICAgICAgICAgICAgIGFsdD1cIlwiIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5uZXR0aXBlcnVza291bHUudGl0bGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uc3R1ZHlpbmcubmV0dGlwZXJ1c2tvdWx1LmRlc2NyaXB0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cubmV0dGlsdWtpby5maS9lc2l0dGVseV9uZXR0aXBrXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tc2Nob29sLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjYXJkIGZyb250cGFnZS1jYXJkLWNvdXJzZXNcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YV9haW5lb3Bpc2tlbHUucG5nXCJcbiAgICAgICAgICAgICAgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLmFpbmVvcGlza2VsdS50aXRsZScpfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5zdHVkeWluZy5haW5lb3Bpc2tlbHUuZGVzY3JpcHRpb24nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uZXR0aWx1a2lvLmZpL2VzaXR0ZWx5X25ldHRpcGtcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24gZnJvbnRwYWdlLWJ1dHRvbi1jb3Vyc2VzLXJlYWRtb3JlXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnN0dWR5aW5nLnJlYWRNb3JlLmxpbmsnKX0gPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJ2aWRlb3NcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItc2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL09ENU9qNTB2eWgwP3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLXZpZGVvXCI+XG4gICAgICAgICAgICA8aWZyYW1lIHdpZHRoPVwiMTI4MFwiIGhlaWdodD1cIjcyMFwiXG4gICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL0NKY3BXWkQwVlQ4P3JlbD0wJmFtcDtzaG93aW5mbz0wXCJcbiAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyOiAwLCBhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIn19PjwvaWZyYW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC12aWRlb1wiPlxuICAgICAgICAgICAgPGlmcmFtZSB3aWR0aD1cIjEyODBcIiBoZWlnaHQ9XCI3MjBcIlxuICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9FYkpuV0l5T0pOZz9yZWw9MCZhbXA7c2hvd2luZm89MFwiXG4gICAgICAgICAgICBzdHlsZT17e2JvcmRlcjogMCwgYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCJ9fT48L2lmcmFtZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtdmlkZW9cIj5cbiAgICAgICAgICAgIDxpZnJhbWUgd2lkdGg9XCIxMjgwXCIgaGVpZ2h0PVwiNzIwXCJcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvaU9LVW9BQVE3VWs/cmVsPTAmYW1wO3Nob3dpbmZvPTBcIlxuICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6IDAsIGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwifX0+PC9pZnJhbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWNvbnRyb2xzXCI+PC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPHNlY3Rpb24gaWQ9XCJuZXdzXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb25cIj5cblxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnNlY3Rpb25UaXRsZS5uZXdzJyl9PC9oMj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3NcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBvcmRlcmVkLWNvbnRhaW5lciBvcmRlcmVkLWNvbnRhaW5lci1yb3cgb3JkZXJlZC1jb250YWluZXItcmVzcG9uc2l2ZSBmcm9udHBhZ2Utb3JkZXJlZC1jb250YWluZXItbmV3cy1zdWJjb250YWluZXJcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udHBhZ2VCb3hUaXRsZS5ldmVudHMnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtZXZlbnRzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNCwgb3JkZXI6IFwiQVNDRU5ESU5HXCJ9fSBmZWVkUmVhZFRhcmdldD1cIm9vZXZlbnRzXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUubmV3cycpfTwvaDI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZS1uZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8RnJvbnRwYWdlRmVlZCBxdWVyeU9wdGlvbnM9e3tudW1JdGVtczogNX19IGZlZWRSZWFkVGFyZ2V0PVwib29uZXdzXCI+PC9Gcm9udHBhZ2VGZWVkPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2Ugb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLW5ld3Mtc3ViY29udGFpbmVyXCI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBmcm9udHBhZ2UtY2FyZC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTEuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmltYWdlcy5kZXNjcmlwdGlvbi5pbWFnZTEnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJvdXNlbC1pdGVtXCIgc3R5bGU9e3tkaXNwbGF5Olwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiY2FyZC1pbWFnZVwiIHNyYz1cIi9nZngva3V2YTIuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMicpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhMy5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLXRleHRcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlMycpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcm91c2VsLWl0ZW1cIiBzdHlsZT17e2Rpc3BsYXk6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJjYXJkLWltYWdlXCIgc3JjPVwiL2dmeC9rdXZhNC5qcGdcIiBhbHQ9XCJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtdGV4dFwiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5pbWFnZXMuZGVzY3JpcHRpb24uaW1hZ2U0Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaXRlbVwiIHN0eWxlPXt7ZGlzcGxheTpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImNhcmQtaW1hZ2VcIiBzcmM9XCIvZ2Z4L2t1dmE1LmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaW1hZ2VzLmRlc2NyaXB0aW9uLmltYWdlNScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtY29udHJvbHNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1jYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRwYWdlQm94VGl0bGUuYmxvZ3MnKX08L2gyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UtYmxvZ3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGcm9udHBhZ2VGZWVkIHF1ZXJ5T3B0aW9ucz17e251bUl0ZW1zOiA2fX1cbiAgICAgICAgICAgICAgICAgICAgIGZlZWRSZWFkVGFyZ2V0PVwiZW9wcGltaXNrZXNrdXMsb3BlbixlYmFyb21ldHJpLG1hdHNrdWxhLG9wcGltaW5lbixwb2xrdWphLHJlaXNzdXZpaGtvLGphbGtpYVwiPjwvRnJvbnRwYWdlRmVlZD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cblxuICAgIDxzZWN0aW9uIGlkPVwib3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNvbnRhaW5lciBmcm9udHBhZ2UtY29udGFpbmVyLXNlY3Rpb24gZnJvbnRwYWdlLWNhcmQtY29udGFpbmVyXCI+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGNhcmQgZnJvbnRwYWdlLWNhcmQtb3RhdmFuLW9waXN0b1wiPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIG9yZGVyZWQtY29udGFpbmVyIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLWluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyZWQtY29udGFpbmVyLWl0ZW0gZnJvbnRwYWdlLW9yZGVyZWQtY29udGFpbmVyLWl0ZW0tb3RhdmFuLW9waXN0by1zb2NpYWwtbWVkaWFcIj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgY29udGFpbmVyIGZyb250cGFnZS1jb250YWluZXItb3RhdmFuLW9waXN0by1zb2NpYWwtbWVkaWFcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IHRleHQtdXBwZXJjYXNlIGZyb250cGFnZS10ZXh0LW90YXZhbi1vcGlzdG8taW5mby10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24uc29tZS50aXRsZScpfVxuICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1mYWNlYm9va1wiIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vb3RhdmFub3Bpc3RvXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS10d2l0dGVyXCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vT3RhdmFuT3Bpc3RvXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1pbnN0YWdyYW1cIiBocmVmPVwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9vdGF2YW5vcGlzdG8vXCIgdGFyZ2V0PVwidG9wXCI+PC9hPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uLXNvY2lhbCBpY29uIGljb24tc29tZS1waW50ZXJlc3RcIiBocmVmPVwiaHR0cHM6Ly9maS5waW50ZXJlc3QuY29tL290YXZhbm9waXN0by9cIiB0YXJnZXQ9XCJ0b3BcIj48L2E+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBidXR0b24tc29jaWFsIGljb24gaWNvbi1zb21lLWxpbmtlZGluXCIgaHJlZj1cImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9jb21wYW55LzEwNjAyOFwiIHRhcmdldD1cInRvcFwiPjwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyb250cGFnZSBjb250YWluZXIgZnJvbnRwYWdlLWNvbnRhaW5lci1vdGF2YW4tb3Bpc3RvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgdGV4dC1tdWx0aXBhcmFncmFwaCBmcm9udHBhZ2UtdGV4dC1vdGF2YW4tb3Bpc3RvLWluZm8tZGVzY3JpcHRpb25cIlxuICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24uZGVzY3JpcHRpb24nKX19PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3RhdmFub3Bpc3RvLmZpXCIgdGFyZ2V0PVwidG9wXCIgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIGJ1dHRvbiBmcm9udHBhZ2UtYnV0dG9uLXdlYnNpdGVcIj5cbiAgICAgICAgICAgICAgICB3d3cub3RhdmFub3Bpc3RvLmZpXG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3RhdmFub3Bpc3RvLmZpL3V1dGlza2lyamVcIiB0YXJnZXQ9XCJ0b3BcIiBjbGFzc05hbWU9XCJmcm9udHBhZ2UgYnV0dG9uIGZyb250cGFnZS1idXR0b24tbmV3c2xldHRlclwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5vcmdhbml6YXRpb24ubmV3c2xldHRlci5saW5rJyl9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGZyb250cGFnZS1vcmRlcmVkLWNvbnRhaW5lci1pdGVtLW90YXZhbi1vcGlzdG8tbG9nb1wiPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIvZ2Z4L29mLW9yZ2FuaXphdGlvbi1sb2dvLmpwZ1wiIGFsdD1cImxvZ29cIiB0aXRsZT1cImxvZ29cIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48Zm9vdGVyIGNsYXNzTmFtZT1cImZyb250cGFnZSBmb290ZXJcIiBpZD1cImNvbnRhY3RcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItaXRlbSBmcm9udHBhZ2UtZm9vdGVyLWl0ZW0tY29udGFjdFwiPlxuICAgICAgPGgyIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXNcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmNvbnRhY3QudGl0bGUnKX08L2gyPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZnJvbnRwYWdlIHRleHQgZnJvbnRwYWdlLXRleHQtY29udGFjdC11cy1pbmZvcm1hdGlvblwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWljb24gaWNvbi1sb2NhdGlvblwiPjwvc3Bhbj5cbiAgICAgICAgPGI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5zdHJlZXRBZGRyZXNzLmxhYmVsJyl9PC9iPlxuICAgICAgICA8c3Bhbj5PdGF2YW50aWUgMiBCLCA1MDY3MCBPdGF2YTwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImZyb250cGFnZSB0ZXh0IGZyb250cGFnZS10ZXh0LWNvbnRhY3QtdXMtaW5mb3JtYXRpb25cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pY29uIGljb24tcGhvbmVcIj48L3NwYW4+XG4gICAgICAgIDxiPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIucGhvbmVOdW1iZXIubGFiZWwnKX08L2I+XG4gICAgICAgIDxzcGFuPjAxNSAxOTTCoDM1NTI8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJmcm9udHBhZ2UgdGV4dCBmcm9udHBhZ2UtdGV4dC1jb250YWN0LXVzLWluZm9ybWF0aW9uXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaWNvbiBpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxuICAgICAgICA8Yj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmVtYWlsQWRkcmVzcy5sYWJlbCcpfTwvYj5cbiAgICAgICAgPHNwYW4+aW5mb0BvdGF2YW5vcGlzdG8uZmk8L3NwYW4+XG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItaXRlbSBmcm9udHBhZ2UtZm9vdGVyLWl0ZW0tbG9nb3NcIj5cbiAgICAgIDxpbWcgc3JjPVwiL2dmeC9hbGt1X3V1ZGVsbGUuanBnXCIgYWx0PVwiXCIgdGl0bGU9XCJcIiBjbGFzc05hbWU9XCJsb2dvXCIgLz5cbiAgICAgIDxpbWcgc3JjPVwiL2dmeC9mb290ZXJfbG9nby5qcGdcIiBhbHQ9XCJcIiB0aXRsZT1cIlwiIGNsYXNzTmFtZT1cImxvZ29cIiAvPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZm9vdGVyPlxuICAgICAgICA8L2Rpdj4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoRnJvbnRwYWdlQm9keSk7IiwiaW1wb3J0IEZlZWQgZnJvbSAnLi4vZ2VuZXJhbC9mZWVkLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcm9udHBhZ2VGZWVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBmZWVkUmVhZFRhcmdldDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5T3B0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW50cmllczogW11cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICBtQXBpKCkuZmVlZC5mZWVkcy5yZWFkKHRoaXMucHJvcHMuZmVlZFJlYWRUYXJnZXQsIHRoaXMucHJvcHMucXVlcnlPcHRpb25zKS5jYWxsYmFjaygoZXJyLCBlbnRyaWVzKT0+e1xuICAgICAgaWYgKCFlcnIpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlbnRyaWVzfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxGZWVkIGVudHJpZXM9e3RoaXMuc3RhdGUuZW50cmllc30+PC9GZWVkPlxuICB9XG59IiwiaW1wb3J0IE5hdmJhciBmcm9tICcuLi9nZW5lcmFsL25hdmJhci5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgTG9naW5CdXR0b24gZnJvbSAnLi4vYmFzZS9sb2dpbi1idXR0b24uanN4JztcbmltcG9ydCBGb3Jnb3RQYXNzd29yZERpYWxvZyBmcm9tICcuLi9iYXNlL2ZvcmdvdC1wYXNzd29yZC1kaWFsb2cuanN4JztcblxuY2xhc3MgRnJvbnRwYWdlTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPE5hdmJhciBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIiBuYXZiYXJJdGVtcz17W1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwic3R1ZHlpbmdcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjc3R1ZHlpbmdcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsuc3R1ZHlpbmcnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJuZXdzXCIsXG4gICAgICAgIGl0ZW06ICg8TGluayBocmVmPVwiI25ld3NcIiBjbGFzc05hbWU9XCJsaW5rIGxpbmstZnVsbFwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5uYXZpZ2F0aW9uLmxpbmsubmV3cycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcIm90YXZhbi1vcGlzdG9cIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjb3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm90YXZhbk9waXN0bycpfTwvc3Bhbj48L0xpbms+KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbnRhY3RcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIjY29udGFjdFwiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5jb250YWN0Jyl9PC9zcGFuPjwvTGluaz4pXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IFwib3Blbi1tYXRlcmlhbHNcIixcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9XCIvY291cnNlcGlja2VyXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWhpZ2hsaWdodCBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm9wZW5NYXRlcmlhbHMnKX08L3NwYW4+PC9MaW5rPilcbiAgICAgIH1cbiAgICBdfSBkZWZhdWx0T3B0aW9ucz17W1xuICAgICAgKDxMb2dpbkJ1dHRvbiBrZXk9XCIwXCIgY2xhc3NOYW1lRXh0ZW5zaW9uPVwiZnJvbnRwYWdlXCIvPiksXG4gICAgICAoPEZvcmdvdFBhc3N3b3JkRGlhbG9nIGtleT1cIjFcIiBjbGFzc05hbWVFeHRlbnNpb249XCJmcm9udHBhZ2VcIj48TGluayBjbGFzc05hbWU9XCJmcm9udHBhZ2UgbGFiZWwgbGFiZWwtZHluYW1pYy13b3JkLWJyZWFrIGxhYmVsLWNsaWNrYWJsZSBmcm9udHBhZ2UtbGFiZWwtZm9yZ290LXBhc3N3b3JkIGZyb250cGFnZS1pbnRlcmFjdC1mb3Jnb3QtcGFzc3dvcmRcIj5cbiAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb3Jnb3RwYXNzd29yZC5mb3Jnb3RMaW5rJyl9PC9zcGFuPlxuICAgICAgIDwvTGluaz48L0ZvcmdvdFBhc3N3b3JkRGlhbG9nPilcbiAgICBdfSBtZW51SXRlbXM9e1tcbiAgICAgICAoPExpbmsgaHJlZj1cIiNzdHVkeWluZ1wiIGNsYXNzTmFtZT1cImxpbmsgbGluay1mdWxsXCI+PHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLm5hdmlnYXRpb24ubGluay5zdHVkeWluZycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNuZXdzXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm5ld3MnKX08L3NwYW4+PC9MaW5rPiksXG4gICAgICAgKDxMaW5rIGhyZWY9XCIjb3JnYW5pemF0aW9uXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm90YXZhbk9waXN0bycpfTwvc3Bhbj48L0xpbms+KSxcbiAgICAgICAoPExpbmsgaHJlZj1cIiNjb250YWN0XCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLmNvbnRhY3QnKX08L3NwYW4+PC9MaW5rPiksXG4gICAgICAgKDxMaW5rIGhyZWY9XCIvY291cnNlcGlja2VyXCIgY2xhc3NOYW1lPVwibGluayBsaW5rLWhpZ2hsaWdodCBsaW5rLWZ1bGxcIj48c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubmF2aWdhdGlvbi5saW5rLm9wZW5NYXRlcmlhbHMnKX08L3NwYW4+PC9MaW5rPilcbiAgICBdfS8+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RSZWR1eC5jb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShGcm9udHBhZ2VOYXZiYXIpO1xuIiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBQb3J0YWwgZnJvbSAnLi9wb3J0YWwuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNvbnRlbnQ6IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgZm9vdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25PdmVybGF5Q2xpY2sgPSB0aGlzLm9uT3ZlcmxheUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfVxuICB9XG4gIGNsb3NlKCl7XG4gICAgdGhpcy5yZWZzLnBvcnRhbC5jbG9zZVBvcnRhbCgpO1xuICB9XG4gIG9uT3ZlcmxheUNsaWNrKGUpe1xuICAgIGlmIChlLnRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0KXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgb25PcGVuKCl7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0sIDEwKTtcbiAgfVxuICBiZWZvcmVDbG9zZShET01Ob2RlLCByZW1vdmVGcm9tRE9NKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChyZW1vdmVGcm9tRE9NLCAzMDApO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXt0aGlzLnByb3BzLmNoaWxkcmVufSBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0gY2xvc2VPbkVzYz5cbjxkaXYgY2xhc3NOYW1lPXtgZGlhbG9nICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWRpYWxvZyAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfSBvbkNsaWNrPXt0aGlzLm9uT3ZlcmxheUNsaWNrfT5cbiAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctd2luZG93XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctdGl0bGVcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGlhbG9nLWNsb3NlIGljb24gaWNvbi1jbG9zZVwiIG9uQ2xpY2s9e3RoaXMuY2xvc2V9Pjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAge3RoaXMucHJvcHMuY29udGVudH1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctZm9vdGVyXCI+XG4gICAgICAgIHt0aGlzLnByb3BzLmZvb3Rlcih0aGlzLmNsb3NlKX1cbiAgICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuICAgICAgICA8L1BvcnRhbD4pO1xuICB9XG59IiwiaW1wb3J0IFBvcnRhbCBmcm9tICcuL3BvcnRhbC5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHRvcDogbnVsbCxcbiAgICAgIGxlZnQ6IG51bGwsXG4gICAgICBhcnJvd0xlZnQ6IG51bGwsXG4gICAgICBhcnJvd1JpZ2h0OiBudWxsLFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgb25PcGVuKERPTU5vZGUpe1xuICAgIGxldCAkdGFyZ2V0ID0gJCh0aGlzLnJlZnMuYWN0aXZhdG9yKTtcbiAgICBsZXQgJGFycm93ID0gJCh0aGlzLnJlZnMuYXJyb3cpO1xuICAgIGxldCAkZHJvcGRvd24gPSAkKHRoaXMucmVmcy5kcm9wZG93bik7XG4gICAgICBcbiAgICBsZXQgcG9zaXRpb24gPSAkdGFyZ2V0Lm9mZnNldCgpO1xuICAgIGxldCB3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgIGxldCBtb3JlU3BhY2VJblRoZUxlZnRTaWRlID0gKHdpbmRvd1dpZHRoIC0gcG9zaXRpb24ubGVmdCkgPCBwb3NpdGlvbi5sZWZ0O1xuICAgIFxuICAgIGxldCBsZWZ0ID0gbnVsbDtcbiAgICBpZiAobW9yZVNwYWNlSW5UaGVMZWZ0U2lkZSl7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdCAtICRkcm9wZG93bi5vdXRlcldpZHRoKCkgKyAkdGFyZ2V0Lm91dGVyV2lkdGgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdCA9IHBvc2l0aW9uLmxlZnQ7XG4gICAgfVxuICAgIGxldCB0b3AgPSBwb3NpdGlvbi50b3AgKyAkdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyA1O1xuICAgIFxuICAgIGxldCBhcnJvd0xlZnQgPSBudWxsO1xuICAgIGxldCBhcnJvd1JpZ2h0ID0gbnVsbDtcbiAgICBpZiAobW9yZVNwYWNlSW5UaGVMZWZ0U2lkZSl7XG4gICAgICBhcnJvd1JpZ2h0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycm93TGVmdCA9ICgkdGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDIpICsgKCRhcnJvdy53aWR0aCgpLzIpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnNldFN0YXRlKHt0b3AsIGxlZnQsIGFycm93TGVmdCwgYXJyb3dSaWdodCwgdmlzaWJsZTogdHJ1ZX0pO1xuICB9XG4gIGJlZm9yZUNsb3NlKERPTU5vZGUsIHJlbW92ZUZyb21ET00pe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KHJlbW92ZUZyb21ET00sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxQb3J0YWwgcmVmPVwicG9ydGFsXCIgb3BlbkJ5Q2xpY2tPbj17UmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucHJvcHMuY2hpbGRyZW4sIHsgcmVmOiBcImFjdGl2YXRvclwiIH0pfVxuICAgICAgY2xvc2VPbkVzYyBjbG9zZU9uT3V0c2lkZUNsaWNrIGNsb3NlT25TY3JvbGwgb25PcGVuPXt0aGlzLm9uT3Blbn0gYmVmb3JlQ2xvc2U9e3RoaXMuYmVmb3JlQ2xvc2V9PlxuICAgICAgPGRpdiByZWY9XCJkcm9wZG93blwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLnRvcCxcbiAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLmxlZnRcbiAgICAgICAgfX1cbiAgICAgICAgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gZHJvcGRvd24gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tZHJvcGRvd24tJHt0aGlzLnByb3BzLmNsYXNzTmFtZVN1ZmZpeH0gJHt0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGVcIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFycm93XCIgcmVmPVwiYXJyb3dcIiBzdHlsZT17e2xlZnQ6IHRoaXMuc3RhdGUuYXJyb3dMZWZ0LCByaWdodDogdGhpcy5zdGF0ZS5hcnJvd1JpZ2h0fX0+PC9zcGFuPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICB7aXRlbX1cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9Qb3J0YWw+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBGZWVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbnRyaWVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcHVibGljYXRpb25EYXRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbGluazogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKS5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJmZWVkXCI+XG4gICAgICB7dGhpcy5wcm9wcy5lbnRyaWVzLm1hcCgoZW50cnksIGluZGV4KT0+e1xuICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImZlZWQtaXRlbVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZlZWQtaXRlbS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgPGEgaHJlZj17ZW50cnkubGlua30gdGFyZ2V0PVwidG9wXCI+e2VudHJ5LnRpdGxlfTwvYT5cbiAgICAgICAgICAgIHtlbnRyeS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmVlZC1pdGVtLWRhdGVcIj57dGhpcy5wcm9wcy5pMThuLnRpbWUuZm9ybWF0KGVudHJ5LnB1YmxpY2F0aW9uRGF0ZSl9PC9zcGFuPlxuICAgICAgICA8L2xpPlxuICAgICAgfSl9XG4gICAgPC91bD5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFJlZHV4LmNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEZlZWQpOyIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmZ1bmN0aW9uIHNjcm9sbFRvU2VjdGlvbihhbmNob3IpIHtcbiAgbGV0IHRvcE9mZnNldCA9IDkwO1xuICBsZXQgc2Nyb2xsVG9wID0gJChhbmNob3IpLm9mZnNldCgpLnRvcCAtIHRvcE9mZnNldDtcblxuICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgIHNjcm9sbFRvcCA6IHNjcm9sbFRvcFxuICB9LCB7XG4gICAgZHVyYXRpb24gOiA1MDAsXG4gICAgZWFzaW5nIDogXCJlYXNlSW5PdXRRdWFkXCJcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbkNsaWNrKGUsIHJlKXtcbiAgICBpZiAodGhpcy5wcm9wcy5ocmVmICYmIHRoaXMucHJvcHMuaHJlZlswXSA9PT0gJyMnKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNjcm9sbFRvU2VjdGlvbih0aGlzLnByb3BzLmhyZWYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKXtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiB0cnVlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBmYWxzZX0pO1xuICAgIHRoaXMub25DbGljayhlLCByZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaEVuZCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hFbmQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPGEgey4uLnRoaXMucHJvcHN9XG4gICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lICsgKHRoaXMuc3RhdGUuYWN0aXZlID8gXCIgYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja30gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfS8+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExhbmd1YWdlUGlja2VyIGZyb20gJy4vbmF2YmFyL2xhbmd1YWdlLXBpY2tlci5qc3gnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi9uYXZiYXIvbWVudS5qc3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub3Blbk1lbnUgPSB0aGlzLm9wZW5NZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZU1lbnUgPSB0aGlzLmNsb3NlTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH1cbiAgfVxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG5hdmJhckl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgaXRlbTogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuICAgIG1lbnVJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgZGVmYXVsdE9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkXG4gIH1cbiAgb3Blbk1lbnUoKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzTWVudU9wZW46IHRydWVcbiAgICB9KTtcbiAgfVxuICBjbG9zZU1lbnUoKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzTWVudU9wZW46IGZhbHNlXG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPXtgbmF2YmFyICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259YH0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2BuYXZiYXItaXRlbSAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1uYXZiYXItaXRlbS1tZW51LWJ1dHRvbmB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibGluayBsaW5rLWljb24gbGluay1mdWxsXCIgb25DbGljaz17dGhpcy5vcGVuTWVudX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1uYXZpY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMubmF2YmFySXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLSR7aXRlbS5jbGFzc05hbWVTdWZmaXh9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLml0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZGVmYXVsdE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgPExhbmd1YWdlUGlja2VyIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgICAgICA8TWVudSBvcGVuPXt0aGlzLnN0YXRlLmlzTWVudU9wZW59IG9uQ2xvc2U9e3RoaXMuY2xvc2VNZW51fSBpdGVtcz17dGhpcy5wcm9wcy5tZW51SXRlbXN9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgfVxufSIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgYWN0aW9ucyBmcm9tICcuLi8uLi8uLi9hY3Rpb25zL2Jhc2UvbG9jYWxlcyc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi4vZHJvcGRvd24uanN4JztcblxuY2xhc3MgTGFuZ3VhZ2VQaWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8RHJvcGRvd24gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gY2xhc3NOYW1lU3VmZml4PVwibGFuZ3VhZ2UtcGlja2VyXCIgaXRlbXM9e3RoaXMucHJvcHMubG9jYWxlcy5hdmFsaWFibGUubWFwKChsb2NhbGUpPT57XG4gICAgICByZXR1cm4gKDxhIGNsYXNzTmFtZT1cImZyb250cGFnZSBsaW5rIGxpbmstZnVsbCBmcm9udHBhZ2UtbGluay1sYW5ndWFnZS1waWNrZXJcIiBvbkNsaWNrPXt0aGlzLnByb3BzLnNldExvY2FsZS5iaW5kKHRoaXMsIGxvY2FsZS5sb2NhbGUpfT5cbiAgICAgICAgPHNwYW4+e2xvY2FsZS5uYW1lfTwvc3Bhbj5cbiAgICAgIDwvYT4pO1xuICAgIH0pfT5cbiAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGJ1dHRvbi1waWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1waWxsLWxhbmd1YWdlYH0+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmxvY2FsZXMuY3VycmVudH08L3NwYW4+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGxvY2FsZXM6IHN0YXRlLmxvY2FsZXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gUmVkdXguYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXguY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTGFuZ3VhZ2VQaWNrZXIpOyIsImltcG9ydCBMaW5rIGZyb20gJy4uL2xpbmsuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub3BlbiA9IHRoaXMub3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZUJ5T3ZlcmxheSA9IHRoaXMuY2xvc2VCeU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlzcGxheWVkOiBwcm9wcy5vcGVuLFxuICAgICAgdmlzaWJsZTogcHJvcHMub3BlbixcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWc6IG51bGwsXG4gICAgICBvcGVuOiBwcm9wcy5vcGVuXG4gICAgfVxuICB9XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKXtcbiAgICBpZiAobmV4dFByb3BzLm9wZW4gJiYgIXRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMub3BlbiAmJiB0aGlzLnN0YXRlLm9wZW4pe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7J2RyYWdnaW5nJzogdHJ1ZX0pO1xuICAgIHRoaXMudG91Y2hDb3JkWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCA9IDA7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hNb3ZlKGUpe1xuICAgIGxldCBkaWZmWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoQ29yZFg7XG4gICAgbGV0IGFic29sdXRlRGlmZmVyZW5jZVggPSBNYXRoLmFicyhkaWZmWCAtIHRoaXMuc3RhdGUuZHJhZyk7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCArPSBhYnNvbHV0ZURpZmZlcmVuY2VYO1xuXG4gICAgaWYgKGRpZmZYID4gMCkge1xuICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBkaWZmWH0pO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvblRvdWNoRW5kKGUpe1xuICAgIGxldCB3aWR0aCA9ICQodGhpcy5yZWZzLm1lbnVDb250YWluZXIpLndpZHRoKCk7XG4gICAgbGV0IGRpZmYgPSB0aGlzLnN0YXRlLmRyYWc7XG4gICAgbGV0IG1vdmVtZW50ID0gdGhpcy50b3VjaE1vdmVtZW50WDtcbiAgICBcbiAgICBsZXQgbWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgPSBNYXRoLmFicyhkaWZmKSA+PSB3aWR0aCowLjMzO1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZFRoZU92ZXJsYXkgPSBlLnRhcmdldCA9PT0gdGhpcy5yZWZzLm1lbnUgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBsZXQgeW91SnVzdENsaWNrZWRBTGluayA9IGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYVwiICYmIG1vdmVtZW50IDw9IDU7XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ2dpbmc6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZzogbnVsbH0pO1xuICAgICAgaWYgKG1lbnVIYXNTbGlkZWRFbm91Z2hGb3JDbG9zaW5nIHx8IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSB8fCB5b3VKdXN0Q2xpY2tlZEFMaW5rKXtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sIDEwKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb3Blbigpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogdHJ1ZSwgb3BlbjogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IHRydWV9KTtcbiAgICB9LCAxMCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5jc3MoeydvdmVyZmxvdyc6ICdoaWRkZW4nfSk7XG4gIH1cbiAgY2xvc2VCeU92ZXJsYXkoZSl7XG4gICAgbGV0IGlzT3ZlcmxheSA9IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGlzTGluayA9ICEhZS50YXJnZXQuaHJlZjtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZHJhZ2dpbmcgJiYgKGlzT3ZlcmxheSB8fCBpc0xpbmspKXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJyd9KTtcbiAgICB0aGlzLnNldFN0YXRlKHt2aXNpYmxlOiBmYWxzZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogZmFsc2UsIG9wZW46IGZhbHNlfSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9LCAzMDApO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e2BtZW51ICR7dGhpcy5zdGF0ZS5kaXNwbGF5ZWQgPyBcImRpc3BsYXllZFwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGVcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS5kcmFnZ2luZyA/IFwiZHJhZ2dpbmdcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jbG9zZUJ5T3ZlcmxheX0gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaE1vdmU9e3RoaXMub25Ub3VjaE1vdmV9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0gcmVmPVwibWVudVwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1jb250YWluZXJcIiByZWY9XCJtZW51Q29udGFpbmVyXCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmRyYWd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWVudS1oZWFkZXItYnV0dG9uLWNsb3NlIGljb24gaWNvbi1hcnJvdy1sZWZ0XCI+PC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibWVudS1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIga2V5PXtpbmRleH0+e2l0ZW19PC9saT5cbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gIH1cbn1cbiAgIiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY29uc3QgS0VZQ09ERVMgPSB7XG4gIEVTQ0FQRTogMjdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcnRhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHsgYWN0aXZlOiBmYWxzZSB9O1xuICAgIHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrID0gdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlUG9ydGFsID0gdGhpcy5jbG9zZVBvcnRhbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVLZXlkb3duID0gdGhpcy5oYW5kbGVLZXlkb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgIHRoaXMubm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uRXNjKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TY3JvbGwpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICB0aGlzLnJlbmRlclBvcnRhbChuZXdQcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uRXNjKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TY3JvbGwpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VQb3J0YWwodHJ1ZSk7XG4gIH1cblxuICBoYW5kbGVXcmFwcGVyQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm9wZW5Qb3J0YWwoKTtcbiAgfVxuXG4gIG9wZW5Qb3J0YWwocHJvcHMgPSB0aGlzLnByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICB0aGlzLnJlbmRlclBvcnRhbChwcm9wcywgdHJ1ZSk7XG4gIH1cblxuICBjbG9zZVBvcnRhbChpc1VubW91bnRlZCA9IGZhbHNlKSB7XG4gICAgY29uc3QgcmVzZXRQb3J0YWxTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgICB0aGlzLm5vZGUgPSBudWxsO1xuICAgICAgaWYgKGlzVW5tb3VudGVkICE9PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmJlZm9yZUNsb3NlKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYmVmb3JlQ2xvc2UodGhpcy5ub2RlLCByZXNldFBvcnRhbFN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc2V0UG9ydGFsU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2soZSkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5wb3J0YWwpO1xuICAgIGlmIChyb290LmNvbnRhaW5zKGUudGFyZ2V0KSB8fCAoZS5idXR0b24gJiYgZS5idXR0b24gIT09IDApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmNsb3NlUG9ydGFsKCk7XG4gIH1cblxuICBoYW5kbGVLZXlkb3duKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSBLRVlDT0RFUy5FU0NBUEUgJiYgdGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuY2xvc2VQb3J0YWwoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJQb3J0YWwocHJvcHMsIGlzT3BlbmluZykge1xuICAgIGlmICghdGhpcy5ub2RlKSB7XG4gICAgICB0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5ub2RlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW4gPSBwcm9wcy5jaGlsZHJlbjtcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qaW1mYi9kOTllMDY3OGU5ZGE3MTVjY2Y2NDU0OTYxZWYwNGQxYlxuICAgIGlmICh0eXBlb2YgcHJvcHMuY2hpbGRyZW4udHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2hpbGRyZW4gPSBSZWFjdC5jbG9uZUVsZW1lbnQocHJvcHMuY2hpbGRyZW4sIHtcbiAgICAgICAgY2xvc2VQb3J0YWw6IHRoaXMuY2xvc2VQb3J0YWxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucG9ydGFsID0gUmVhY3RET00udW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIoXG4gICAgICB0aGlzLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICB0aGlzLm5vZGUsXG4gICAgICB0aGlzLnByb3BzLm9uVXBkYXRlXG4gICAgKTtcbiAgICBcbiAgICBpZiAoaXNPcGVuaW5nKSB7XG4gICAgICB0aGlzLnByb3BzLm9uT3Blbih0aGlzLm5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vcGVuQnlDbGlja09uKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucHJvcHMub3BlbkJ5Q2xpY2tPbiwge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZVdyYXBwZXJDbGlja1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblBvcnRhbC5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICBvcGVuQnlDbGlja09uOiBQcm9wVHlwZXMuZWxlbWVudCxcbiAgY2xvc2VPbkVzYzogUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25PdXRzaWRlQ2xpY2s6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZU9uU2Nyb2xsOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25PcGVuOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGJlZm9yZUNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25VcGRhdGU6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5Qb3J0YWwuZGVmYXVsdFByb3BzID0ge1xuICBvbk9wZW46ICgpID0+IHt9LFxuICBvbkNsb3NlOiAoKSA9PiB7fSxcbiAgb25VcGRhdGU6ICgpID0+IHt9XG59OyIsIi8vbG9hZE1vZHVsZXMoW1xuLy8gIENPTlRFWFRQQVRIICsgXCIvamF2YXguZmFjZXMucmVzb3VyY2Uvc2NyaXB0cy93aWRnZXRzL2NvbnRyb2xsZXJzL2Jhc2UuanMuanNmXCIsXG4vLyAgQ09OVEVYVFBBVEggKyBcIi9qYXZheC5mYWNlcy5yZXNvdXJjZS9zY3JpcHRzL3dpZGdldHMvY29udHJvbGxlcnMvd2Vic29ja2V0LmpzLmpzZlwiLFxuLy8gIENPTlRFWFRQQVRIICsgXCIvamF2YXguZmFjZXMucmVzb3VyY2Uvc2NyaXB0cy93aWRnZXRzL2NvbnRyb2xsZXJzL2dlbmVyaWMtZW52aXJvbm1lbnQuanMuanNmXCIsXG4vLyAgXG4vLyAgQ09OVEVYVFBBVEggKyBcIi9qYXZheC5mYWNlcy5yZXNvdXJjZS9zY3JpcHRzL3dpZGdldHMvY29udHJvbGxlcnMvaW5kZXgvcGFuZWwtYW5ub3VuY2VtZW50cy5qcy5qc2ZcIixcbi8vICBDT05URVhUUEFUSCArIFwiL2phdmF4LmZhY2VzLnJlc291cmNlL3NjcmlwdHMvd2lkZ2V0cy9jb250cm9sbGVycy9pbmRleC9wYW5lbC1pbXBvcnRhbnQuanMuanNmXCIsXG4vLyAgQ09OVEVYVFBBVEggKyBcIi9qYXZheC5mYWNlcy5yZXNvdXJjZS9zY3JpcHRzL3dpZGdldHMvY29udHJvbGxlcnMvaW5kZXgvcGFuZWwtbGFzdC1tZXNzYWdlcy5qcy5qc2ZcIixcbi8vICBDT05URVhUUEFUSCArIFwiL2phdmF4LmZhY2VzLnJlc291cmNlL3NjcmlwdHMvd2lkZ2V0cy9jb250cm9sbGVycy9pbmRleC9wYW5lbC13b3Jrc3BhY2VzLmpzLmpzZlwiLFxuLy8gIENPTlRFWFRQQVRIICsgXCIvamF2YXguZmFjZXMucmVzb3VyY2Uvc2NyaXB0cy93aWRnZXRzL2NvbnRyb2xsZXJzL2luZGV4L3BhbmVsLWNvbnRpbnVlLXN0dWRpZXMuanMuanNmXCJcbi8vXSwgZnVuY3Rpb24oKXtcbi8vICAkKGRvY3VtZW50KS5tdWlra3VXZWJTb2NrZXQoKTtcbi8vICAkKGRvY3VtZW50LmJvZHkpLmJhc2VDb250cm9sbGVyV2lkZ2V0KCk7XG4vLyAgJC5nZXRXaWRnZXRDb250YWluZXJGb3IoXCJnZW5lcmljLWVudmlyb25tZW50XCIpLmdlbmVyaWNFdmlyb25tZW50Q29udHJvbGxlcldpZGdldCgpO1xuLy8gICQuZ2V0V2lkZ2V0Q29udGFpbmVyRm9yKFwicGFuZWwtYW5ub3VuY2VtZW50c1wiKS5wYW5lbEFubm91bmNlbWVudHNDb250cm9sbGVyV2lkZ2V0KCk7XG4vLyAgJC5nZXRXaWRnZXRDb250YWluZXJGb3IoXCJwYW5lbC1jb250aW51ZS1zdHVkaWVzXCIpLnBhbmVsQ29udGludWVTdHVkaWVzQ29udHJvbGxlcldpZGdldCh7XG4vLyAgICBvblJlc29sdmVkOiBmdW5jdGlvbihzZWxmLCBsYXN0V29ya3NwYWNlKXtcbi8vICAgICAgaWYgKGxhc3RXb3Jrc3BhY2Upe1xuLy8gICAgICAgIHNlbGYuZWxlbWVudC5wYXJlbnQoKS5zaG93KCk7XG4vLyAgICAgIH1cbi8vICAgIH1cbi8vICB9KTtcbi8vICAkLmdldFdpZGdldENvbnRhaW5lckZvcihcInBhbmVsLWltcG9ydGFudFwiKS5wYW5lbEltcG9ydGFudENvbnRyb2xsZXJXaWRnZXQoKTtcbi8vICAkLmdldFdpZGdldENvbnRhaW5lckZvcihcInBhbmVsLWxhc3QtbWVzc2FnZXNcIikucGFuZWxNZXNzYWdlc0NvbnRyb2xsZXJXaWRnZXQoKTtcbi8vICAkLmdldFdpZGdldENvbnRhaW5lckZvcihcInBhbmVsLXdvcmtzcGFjZXNcIikucGFuZWxXb3Jrc3BhY2VzQ29udHJvbGxlcldpZGdldCgpO1xuLy99KTtcblxuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4JztcbmltcG9ydCBCb2R5IGZyb20gJy4uL2NvbXBvbmVudHMvZnJvbnRwYWdlL2JvZHkuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgaWQ9XCJyb290XCI+XG4gICAgICA8Tm90aWZpY2F0aW9ucz48L05vdGlmaWNhdGlvbnM+XG4gICAgICBcbiAgICA8L2Rpdj4pO1xuICB9XG59IiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLnJlZHV4TG9nZ2VyPWUucmVkdXhMb2dnZXJ8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZS5zdXBlcl89dCxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6ZSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KX1mdW5jdGlvbiByKGUsdCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJraW5kXCIse3ZhbHVlOmUsZW51bWVyYWJsZTohMH0pLHQmJnQubGVuZ3RoJiZPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInBhdGhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbihlLHQscil7bi5zdXBlcl8uY2FsbCh0aGlzLFwiRVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwibGhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG8oZSx0KXtvLnN1cGVyXy5jYWxsKHRoaXMsXCJOXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJyaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gaShlLHQpe2kuc3VwZXJfLmNhbGwodGhpcyxcIkRcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBhKGUsdCxyKXthLnN1cGVyXy5jYWxsKHRoaXMsXCJBXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpbmRleFwiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcIml0ZW1cIix7dmFsdWU6cixlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbChlLHQscil7dmFyIG49ZS5zbGljZSgocnx8dCkrMXx8ZS5sZW5ndGgpO3JldHVybiBlLmxlbmd0aD10PDA/ZS5sZW5ndGgrdDp0LGUucHVzaC5hcHBseShlLG4pLGV9ZnVuY3Rpb24gYyhlKXt2YXIgdD12b2lkIDA9PT1lP1widW5kZWZpbmVkXCI6TihlKTtyZXR1cm5cIm9iamVjdFwiIT09dD90OmU9PT1NYXRoP1wibWF0aFwiOm51bGw9PT1lP1wibnVsbFwiOkFycmF5LmlzQXJyYXkoZSk/XCJhcnJheVwiOlwiW29iamVjdCBEYXRlXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpP1wiZGF0ZVwiOlwiZnVuY3Rpb25cIj09dHlwZW9mIGUudG9TdHJpbmcmJi9eXFwvLipcXC8vLnRlc3QoZS50b1N0cmluZygpKT9cInJlZ2V4cFwiOlwib2JqZWN0XCJ9ZnVuY3Rpb24gdShlLHQscixmLHMsZCxwKXtzPXN8fFtdLHA9cHx8W107dmFyIGc9cy5zbGljZSgwKTtpZih2b2lkIDAhPT1kKXtpZihmKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiZmKGcsZCkpcmV0dXJuO2lmKFwib2JqZWN0XCI9PT0odm9pZCAwPT09Zj9cInVuZGVmaW5lZFwiOk4oZikpKXtpZihmLnByZWZpbHRlciYmZi5wcmVmaWx0ZXIoZyxkKSlyZXR1cm47aWYoZi5ub3JtYWxpemUpe3ZhciBoPWYubm9ybWFsaXplKGcsZCxlLHQpO2gmJihlPWhbMF0sdD1oWzFdKX19fWcucHVzaChkKX1cInJlZ2V4cFwiPT09YyhlKSYmXCJyZWdleHBcIj09PWModCkmJihlPWUudG9TdHJpbmcoKSx0PXQudG9TdHJpbmcoKSk7dmFyIHY9dm9pZCAwPT09ZT9cInVuZGVmaW5lZFwiOk4oZSkseT12b2lkIDA9PT10P1widW5kZWZpbmVkXCI6Tih0KSxiPVwidW5kZWZpbmVkXCIhPT12fHxwJiZwW3AubGVuZ3RoLTFdLmxocyYmcFtwLmxlbmd0aC0xXS5saHMuaGFzT3duUHJvcGVydHkoZCksbT1cInVuZGVmaW5lZFwiIT09eXx8cCYmcFtwLmxlbmd0aC0xXS5yaHMmJnBbcC5sZW5ndGgtMV0ucmhzLmhhc093blByb3BlcnR5KGQpO2lmKCFiJiZtKXIobmV3IG8oZyx0KSk7ZWxzZSBpZighbSYmYilyKG5ldyBpKGcsZSkpO2Vsc2UgaWYoYyhlKSE9PWModCkpcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJkYXRlXCI9PT1jKGUpJiZlLXQhPTApcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJvYmplY3RcIj09PXYmJm51bGwhPT1lJiZudWxsIT09dClpZihwLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdC5saHM9PT1lfSkubGVuZ3RoKWUhPT10JiZyKG5ldyBuKGcsZSx0KSk7ZWxzZXtpZihwLnB1c2goe2xoczplLHJoczp0fSksQXJyYXkuaXNBcnJheShlKSl7dmFyIHc7ZS5sZW5ndGg7Zm9yKHc9MDt3PGUubGVuZ3RoO3crKyl3Pj10Lmxlbmd0aD9yKG5ldyBhKGcsdyxuZXcgaSh2b2lkIDAsZVt3XSkpKTp1KGVbd10sdFt3XSxyLGYsZyx3LHApO2Zvcig7dzx0Lmxlbmd0aDspcihuZXcgYShnLHcsbmV3IG8odm9pZCAwLHRbdysrXSkpKX1lbHNle3ZhciB4PU9iamVjdC5rZXlzKGUpLFM9T2JqZWN0LmtleXModCk7eC5mb3JFYWNoKGZ1bmN0aW9uKG4sbyl7dmFyIGk9Uy5pbmRleE9mKG4pO2k+PTA/KHUoZVtuXSx0W25dLHIsZixnLG4scCksUz1sKFMsaSkpOnUoZVtuXSx2b2lkIDAscixmLGcsbixwKX0pLFMuZm9yRWFjaChmdW5jdGlvbihlKXt1KHZvaWQgMCx0W2VdLHIsZixnLGUscCl9KX1wLmxlbmd0aD1wLmxlbmd0aC0xfWVsc2UgZSE9PXQmJihcIm51bWJlclwiPT09diYmaXNOYU4oZSkmJmlzTmFOKHQpfHxyKG5ldyBuKGcsZSx0KSkpfWZ1bmN0aW9uIGYoZSx0LHIsbil7cmV0dXJuIG49bnx8W10sdShlLHQsZnVuY3Rpb24oZSl7ZSYmbi5wdXNoKGUpfSxyKSxuLmxlbmd0aD9uOnZvaWQgMH1mdW5jdGlvbiBzKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG9bci5wYXRoW25dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm9bci5wYXRoW25dXT1yLnJoc319ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZT1sKGUsdCk7YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjplW3RdPXIucmhzfXJldHVybiBlfWZ1bmN0aW9uIGQoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7Zm9yKHZhciBuPWUsbz0tMSxpPXIucGF0aD9yLnBhdGgubGVuZ3RoLTE6MDsrK288aTspdm9pZCAwPT09bltyLnBhdGhbb11dJiYobltyLnBhdGhbb11dPVwibnVtYmVyXCI9PXR5cGVvZiByLnBhdGhbb10/W106e30pLG49bltyLnBhdGhbb11dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKHIucGF0aD9uW3IucGF0aFtvXV06bixyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBuW3IucGF0aFtvXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpuW3IucGF0aFtvXV09ci5yaHN9fX1mdW5jdGlvbiBwKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6Y2FzZVwiRVwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIG9bci5wYXRoW25dXX19ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6Y2FzZVwiRVwiOmVbdF09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmU9bChlLHQpfXJldHVybiBlfWZ1bmN0aW9uIGcoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7dmFyIG4sbyxpPWU7Zm9yKG89ci5wYXRoLmxlbmd0aC0xLG49MDtuPG87bisrKXZvaWQgMD09PWlbci5wYXRoW25dXSYmKGlbci5wYXRoW25dXT17fSksaT1pW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoaVtyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6Y2FzZVwiRVwiOmlbci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIGlbci5wYXRoW25dXX19fWZ1bmN0aW9uIGgoZSx0LHIpe2lmKGUmJnQpe3UoZSx0LGZ1bmN0aW9uKG4pe3ImJiFyKGUsdCxuKXx8ZChlLHQsbil9KX19ZnVuY3Rpb24gdihlKXtyZXR1cm5cImNvbG9yOiBcIitGW2VdLmNvbG9yK1wiOyBmb250LXdlaWdodDogYm9sZFwifWZ1bmN0aW9uIHkoZSl7dmFyIHQ9ZS5raW5kLHI9ZS5wYXRoLG49ZS5saHMsbz1lLnJocyxpPWUuaW5kZXgsYT1lLml0ZW07c3dpdGNoKHQpe2Nhc2VcIkVcIjpyZXR1cm5bci5qb2luKFwiLlwiKSxuLFwi4oaSXCIsb107Y2FzZVwiTlwiOnJldHVybltyLmpvaW4oXCIuXCIpLG9dO2Nhc2VcIkRcIjpyZXR1cm5bci5qb2luKFwiLlwiKV07Y2FzZVwiQVwiOnJldHVybltyLmpvaW4oXCIuXCIpK1wiW1wiK2krXCJdXCIsYV07ZGVmYXVsdDpyZXR1cm5bXX19ZnVuY3Rpb24gYihlLHQscixuKXt2YXIgbz1mKGUsdCk7dHJ5e24/ci5ncm91cENvbGxhcHNlZChcImRpZmZcIik6ci5ncm91cChcImRpZmZcIil9Y2F0Y2goZSl7ci5sb2coXCJkaWZmXCIpfW8/by5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWUua2luZCxuPXkoZSk7ci5sb2cuYXBwbHkocixbXCIlYyBcIitGW3RdLnRleHQsdih0KV0uY29uY2F0KFAobikpKX0pOnIubG9nKFwi4oCU4oCUIG5vIGRpZmYg4oCU4oCUXCIpO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgZGlmZiBlbmQg4oCU4oCUIFwiKX19ZnVuY3Rpb24gbShlLHQscixuKXtzd2l0Y2godm9pZCAwPT09ZT9cInVuZGVmaW5lZFwiOk4oZSkpe2Nhc2VcIm9iamVjdFwiOnJldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGVbbl0/ZVtuXS5hcHBseShlLFAocikpOmVbbl07Y2FzZVwiZnVuY3Rpb25cIjpyZXR1cm4gZSh0KTtkZWZhdWx0OnJldHVybiBlfX1mdW5jdGlvbiB3KGUpe3ZhciB0PWUudGltZXN0YW1wLHI9ZS5kdXJhdGlvbjtyZXR1cm4gZnVuY3Rpb24oZSxuLG8pe3ZhciBpPVtcImFjdGlvblwiXTtyZXR1cm4gaS5wdXNoKFwiJWNcIitTdHJpbmcoZS50eXBlKSksdCYmaS5wdXNoKFwiJWNAIFwiK24pLHImJmkucHVzaChcIiVjKGluIFwiK28udG9GaXhlZCgyKStcIiBtcylcIiksaS5qb2luKFwiIFwiKX19ZnVuY3Rpb24geChlLHQpe3ZhciByPXQubG9nZ2VyLG49dC5hY3Rpb25UcmFuc2Zvcm1lcixvPXQudGl0bGVGb3JtYXR0ZXIsaT12b2lkIDA9PT1vP3codCk6byxhPXQuY29sbGFwc2VkLGw9dC5jb2xvcnMsYz10LmxldmVsLHU9dC5kaWZmLGY9dm9pZCAwPT09dC50aXRsZUZvcm1hdHRlcjtlLmZvckVhY2goZnVuY3Rpb24obyxzKXt2YXIgZD1vLnN0YXJ0ZWQscD1vLnN0YXJ0ZWRUaW1lLGc9by5hY3Rpb24saD1vLnByZXZTdGF0ZSx2PW8uZXJyb3IseT1vLnRvb2ssdz1vLm5leHRTdGF0ZSx4PWVbcysxXTt4JiYodz14LnByZXZTdGF0ZSx5PXguc3RhcnRlZC1kKTt2YXIgUz1uKGcpLGo9XCJmdW5jdGlvblwiPT10eXBlb2YgYT9hKGZ1bmN0aW9uKCl7cmV0dXJuIHd9LGcsbyk6YSxrPUQocCksRT1sLnRpdGxlP1wiY29sb3I6IFwiK2wudGl0bGUoUykrXCI7XCI6XCJcIixBPVtcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIl07QS5wdXNoKEUpLHQudGltZXN0YW1wJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpLHQuZHVyYXRpb24mJkEucHVzaChcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIik7dmFyIE89aShTLGsseSk7dHJ5e2o/bC50aXRsZSYmZj9yLmdyb3VwQ29sbGFwc2VkLmFwcGx5KHIsW1wiJWMgXCIrT10uY29uY2F0KEEpKTpyLmdyb3VwQ29sbGFwc2VkKE8pOmwudGl0bGUmJmY/ci5ncm91cC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cChPKX1jYXRjaChlKXtyLmxvZyhPKX12YXIgTj1tKGMsUyxbaF0sXCJwcmV2U3RhdGVcIiksUD1tKGMsUyxbU10sXCJhY3Rpb25cIiksQz1tKGMsUyxbdixoXSxcImVycm9yXCIpLEY9bShjLFMsW3ddLFwibmV4dFN0YXRlXCIpO2lmKE4paWYobC5wcmV2U3RhdGUpe3ZhciBMPVwiY29sb3I6IFwiK2wucHJldlN0YXRlKGgpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbTl0oXCIlYyBwcmV2IHN0YXRlXCIsTCxoKX1lbHNlIHJbTl0oXCJwcmV2IHN0YXRlXCIsaCk7aWYoUClpZihsLmFjdGlvbil7dmFyIFQ9XCJjb2xvcjogXCIrbC5hY3Rpb24oUykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltQXShcIiVjIGFjdGlvbiAgICBcIixULFMpfWVsc2UgcltQXShcImFjdGlvbiAgICBcIixTKTtpZih2JiZDKWlmKGwuZXJyb3Ipe3ZhciBNPVwiY29sb3I6IFwiK2wuZXJyb3IodixoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCI7cltDXShcIiVjIGVycm9yICAgICBcIixNLHYpfWVsc2UgcltDXShcImVycm9yICAgICBcIix2KTtpZihGKWlmKGwubmV4dFN0YXRlKXt2YXIgXz1cImNvbG9yOiBcIitsLm5leHRTdGF0ZSh3KStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW0ZdKFwiJWMgbmV4dCBzdGF0ZVwiLF8sdyl9ZWxzZSByW0ZdKFwibmV4dCBzdGF0ZVwiLHcpO3UmJmIoaCx3LHIsaik7dHJ5e3IuZ3JvdXBFbmQoKX1jYXRjaChlKXtyLmxvZyhcIuKAlOKAlCBsb2cgZW5kIOKAlOKAlFwiKX19KX1mdW5jdGlvbiBTKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9T2JqZWN0LmFzc2lnbih7fSxMLGUpLHI9dC5sb2dnZXIsbj10LnN0YXRlVHJhbnNmb3JtZXIsbz10LmVycm9yVHJhbnNmb3JtZXIsaT10LnByZWRpY2F0ZSxhPXQubG9nRXJyb3JzLGw9dC5kaWZmUHJlZGljYXRlO2lmKHZvaWQgMD09PXIpcmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTtpZihlLmdldFN0YXRlJiZlLmRpc3BhdGNoKXJldHVybiBjb25zb2xlLmVycm9yKFwiW3JlZHV4LWxvZ2dlcl0gcmVkdXgtbG9nZ2VyIG5vdCBpbnN0YWxsZWQuIE1ha2Ugc3VyZSB0byBwYXNzIGxvZ2dlciBpbnN0YW5jZSBhcyBtaWRkbGV3YXJlOlxcbi8vIExvZ2dlciB3aXRoIGRlZmF1bHQgb3B0aW9uc1xcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcbi8vIE9yIHlvdSBjYW4gY3JlYXRlIHlvdXIgb3duIGxvZ2dlciB3aXRoIGN1c3RvbSBvcHRpb25zIGh0dHA6Ly9iaXQubHkvcmVkdXgtbG9nZ2VyLW9wdGlvbnNcXG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICdyZWR1eC1sb2dnZXInXFxuY29uc3QgbG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcXG4gIC8vIC4uLm9wdGlvbnNcXG59KTtcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcblwiKSxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGUodCl9fX07dmFyIGM9W107cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciByPWUuZ2V0U3RhdGU7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih1KXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBpJiYhaShyLHUpKXJldHVybiBlKHUpO3ZhciBmPXt9O2MucHVzaChmKSxmLnN0YXJ0ZWQ9Ty5ub3coKSxmLnN0YXJ0ZWRUaW1lPW5ldyBEYXRlLGYucHJldlN0YXRlPW4ocigpKSxmLmFjdGlvbj11O3ZhciBzPXZvaWQgMDtpZihhKXRyeXtzPWUodSl9Y2F0Y2goZSl7Zi5lcnJvcj1vKGUpfWVsc2Ugcz1lKHUpO2YudG9vaz1PLm5vdygpLWYuc3RhcnRlZCxmLm5leHRTdGF0ZT1uKHIoKSk7dmFyIGQ9dC5kaWZmJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wocix1KTp0LmRpZmY7aWYoeChjLE9iamVjdC5hc3NpZ24oe30sdCx7ZGlmZjpkfSkpLGMubGVuZ3RoPTAsZi5lcnJvcil0aHJvdyBmLmVycm9yO3JldHVybiBzfX19fXZhciBqLGssRT1mdW5jdGlvbihlLHQpe3JldHVybiBuZXcgQXJyYXkodCsxKS5qb2luKGUpfSxBPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIEUoXCIwXCIsdC1lLnRvU3RyaW5nKCkubGVuZ3RoKStlfSxEPWZ1bmN0aW9uKGUpe3JldHVybiBBKGUuZ2V0SG91cnMoKSwyKStcIjpcIitBKGUuZ2V0TWludXRlcygpLDIpK1wiOlwiK0EoZS5nZXRTZWNvbmRzKCksMikrXCIuXCIrQShlLmdldE1pbGxpc2Vjb25kcygpLDMpfSxPPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBwZXJmb3JtYW5jZSYmbnVsbCE9PXBlcmZvcm1hbmNlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBwZXJmb3JtYW5jZS5ub3c/cGVyZm9ybWFuY2U6RGF0ZSxOPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJmUuY29uc3RydWN0b3I9PT1TeW1ib2wmJmUhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIGV9LFA9ZnVuY3Rpb24oZSl7aWYoQXJyYXkuaXNBcnJheShlKSl7Zm9yKHZhciB0PTAscj1BcnJheShlLmxlbmd0aCk7dDxlLmxlbmd0aDt0Kyspclt0XT1lW3RdO3JldHVybiByfXJldHVybiBBcnJheS5mcm9tKGUpfSxDPVtdO2o9XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZ2xvYmFsP1widW5kZWZpbmVkXCI6TihnbG9iYWwpKSYmZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp7fSxrPWouRGVlcERpZmYsayYmQy5wdXNoKGZ1bmN0aW9uKCl7dm9pZCAwIT09ayYmai5EZWVwRGlmZj09PWYmJihqLkRlZXBEaWZmPWssaz12b2lkIDApfSksdChuLHIpLHQobyxyKSx0KGksciksdChhLHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGYse2RpZmY6e3ZhbHVlOmYsZW51bWVyYWJsZTohMH0sb2JzZXJ2YWJsZURpZmY6e3ZhbHVlOnUsZW51bWVyYWJsZTohMH0sYXBwbHlEaWZmOnt2YWx1ZTpoLGVudW1lcmFibGU6ITB9LGFwcGx5Q2hhbmdlOnt2YWx1ZTpkLGVudW1lcmFibGU6ITB9LHJldmVydENoYW5nZTp7dmFsdWU6ZyxlbnVtZXJhYmxlOiEwfSxpc0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB2b2lkIDAhPT1rfSxlbnVtZXJhYmxlOiEwfSxub0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBDJiYoQy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UoKX0pLEM9bnVsbCksZn0sZW51bWVyYWJsZTohMH19KTt2YXIgRj17RTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkNIQU5HRUQ6XCJ9LE46e2NvbG9yOlwiIzRDQUY1MFwiLHRleHQ6XCJBRERFRDpcIn0sRDp7Y29sb3I6XCIjRjQ0MzM2XCIsdGV4dDpcIkRFTEVURUQ6XCJ9LEE6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJBUlJBWTpcIn19LEw9e2xldmVsOlwibG9nXCIsbG9nZ2VyOmNvbnNvbGUsbG9nRXJyb3JzOiEwLGNvbGxhcHNlZDp2b2lkIDAscHJlZGljYXRlOnZvaWQgMCxkdXJhdGlvbjohMSx0aW1lc3RhbXA6ITAsc3RhdGVUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sYWN0aW9uVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGVycm9yVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGNvbG9yczp7dGl0bGU6ZnVuY3Rpb24oKXtyZXR1cm5cImluaGVyaXRcIn0scHJldlN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjOUU5RTlFXCJ9LGFjdGlvbjpmdW5jdGlvbigpe3JldHVyblwiIzAzQTlGNFwifSxuZXh0U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM0Q0FGNTBcIn0sZXJyb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIiNGMjA0MDRcIn19LGRpZmY6ITEsZGlmZlByZWRpY2F0ZTp2b2lkIDAsdHJhbnNmb3JtZXI6dm9pZCAwfSxUPWZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9ZS5kaXNwYXRjaCxyPWUuZ2V0U3RhdGU7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgcilyZXR1cm4gUygpKHtkaXNwYXRjaDp0LGdldFN0YXRlOnJ9KTtjb25zb2xlLmVycm9yKFwiXFxuW3JlZHV4LWxvZ2dlciB2M10gQlJFQUtJTkcgQ0hBTkdFXFxuW3JlZHV4LWxvZ2dlciB2M10gU2luY2UgMy4wLjAgcmVkdXgtbG9nZ2VyIGV4cG9ydHMgYnkgZGVmYXVsdCBsb2dnZXIgd2l0aCBkZWZhdWx0IHNldHRpbmdzLlxcbltyZWR1eC1sb2dnZXIgdjNdIENoYW5nZVxcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbltyZWR1eC1sb2dnZXIgdjNdIHRvXFxuW3JlZHV4LWxvZ2dlciB2M10gaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcblwiKX07ZS5kZWZhdWx0cz1MLGUuY3JlYXRlTG9nZ2VyPVMsZS5sb2dnZXI9VCxlLmRlZmF1bHQ9VCxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuIiwiaW1wb3J0IEFwcCBmcm9tICcuL2NvbnRhaW5lcnMvaW5kZXguanN4JztcbmltcG9ydCByZWR1Y2VyIGZyb20gJy4vcmVkdWNlcnMvaW5kZXgnO1xuXG5pbXBvcnQge2xvZ2dlcn0gZnJvbSAnLi9kZWJ1Zy9yZWR1eC1sb2dnZXInO1xubGV0IHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUocmVkdWNlciwgUmVkdXguYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcikpO1xuLy9sZXQgc3RvcmUgPSBSZWR1eC5jcmVhdGVTdG9yZShyZWR1Y2VyKTtcblxubGV0IFByb3ZpZGVyID0gUmVhY3RSZWR1eC5Qcm92aWRlcjtcblxuUmVhY3RET00ucmVuZGVyKDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICA8QXBwLz5cbjwvUHJvdmlkZXI+LCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FwcFwiKSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG4gIHZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGludmFyaWFudCh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicsICclczogJXMgdHlwZSBgJXNgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tICcgKyAnUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSk7XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIHdhcm5pbmcoIWVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRXJyb3IsICclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUsIHR5cGVvZiBlcnJvcik7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICB3YXJuaW5nKGZhbHNlLCAnRmFpbGVkICVzIHR5cGU6ICVzJXMnLCBsb2NhdGlvbiwgZXJyb3IubWVzc2FnZSwgc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc2hpbShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGlmIChzZWNyZXQgPT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAvLyBJdCBpcyBzdGlsbCBzYWZlIHdoZW4gY2FsbGVkIGZyb20gUmVhY3QuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGludmFyaWFudChcbiAgICAgIGZhbHNlLFxuICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgJ1VzZSBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKSB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgKTtcbiAgfTtcbiAgc2hpbS5pc1JlcXVpcmVkID0gc2hpbTtcbiAgZnVuY3Rpb24gZ2V0U2hpbSgpIHtcbiAgICByZXR1cm4gc2hpbTtcbiAgfTtcbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBzaGltLFxuICAgIGJvb2w6IHNoaW0sXG4gICAgZnVuYzogc2hpbSxcbiAgICBudW1iZXI6IHNoaW0sXG4gICAgb2JqZWN0OiBzaGltLFxuICAgIHN0cmluZzogc2hpbSxcbiAgICBzeW1ib2w6IHNoaW0sXG5cbiAgICBhbnk6IHNoaW0sXG4gICAgYXJyYXlPZjogZ2V0U2hpbSxcbiAgICBlbGVtZW50OiBzaGltLFxuICAgIGluc3RhbmNlT2Y6IGdldFNoaW0sXG4gICAgbm9kZTogc2hpbSxcbiAgICBvYmplY3RPZjogZ2V0U2hpbSxcbiAgICBvbmVPZjogZ2V0U2hpbSxcbiAgICBvbmVPZlR5cGU6IGdldFNoaW0sXG4gICAgc2hhcGU6IGdldFNoaW1cbiAgfTtcblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGVtcHR5RnVuY3Rpb247XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXJcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgd2FybmluZyhcbiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCVzYCBwcm9wIG9uIGAlc2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICtcbiAgICAgICAgICAgICAgJ2FuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICAgJ1lvdSBtYXkgYmUgc2VlaW5nIHRoaXMgd2FybmluZyBkdWUgdG8gYSB0aGlyZC1wYXJ0eSBQcm9wVHlwZXMgJyArXG4gICAgICAgICAgICAgICdsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgJyArICdmb3IgZGV0YWlscy4nLFxuICAgICAgICAgICAgICBwcm9wRnVsbE5hbWUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIGFycmF5T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgd2FybmluZyhcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGlkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICVzIGF0IGluZGV4ICVzLicsXG4gICAgICAgICAgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpLFxuICAgICAgICAgIGlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wVmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuICFwcm9wVmFsdWU7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5ldmVyeShpc05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTm9kZShlbnRyeVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAgIC8vIE5hdGl2ZSBTeW1ib2wuXG4gICAgaWYgKHByb3BUeXBlID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIFN5bWJvbC5mb3IgJiZcbiAgICBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gICAgMHhlYWM3O1xuXG4gIHZhciBpc1ZhbGlkRWxlbWVudCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgb2JqZWN0ICE9PSBudWxsICYmXG4gICAgICBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIvL1RPRE8gdGhpcyByZWR1Y2VyIHVzZXMgdGhlIGFwaSB0aGF0IGludGVyYWN0cyB3aXRoIHRoZSBET00gaW4gb3JkZXIgdG9cbi8vcmV0cmlldmUgZGF0YSwgcGxlYXNlIGZpeCBpbiBuZXh0IHZlcnNpb25zXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZXMoc3RhdGU9e1xuICBhdmFsaWFibGU6ICQubWFrZUFycmF5KCQoXCIjbGFuZ3VhZ2UtcGlja2VyIGFcIikubWFwKChpbmRleCwgZWxlbWVudCk9PntcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJChlbGVtZW50KS50ZXh0KCkudHJpbSgpLFxuICAgICAgbG9jYWxlOiAkKGVsZW1lbnQpLmRhdGEoJ2xvY2FsZScpXG4gICAgfVxuICB9KSksXG4gIGN1cnJlbnQ6ICQoXCIjbG9jYWxlXCIpLnRleHQoKVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0xPQ0FMRScpe1xuICAgIC8vVE9ETyBGb3Igc29tZSByZWFzb24gdGhpcyBkb2Vzbid0IHdhbnQgdG8gd29yaywgdGhpcyByZWR1Y2VyIG5lZWRzIHVyZ2VudCBmaXhcbiAgICAkKCcjbGFuZ3VhZ2UtcGlja2VyIGFbZGF0YS1sb2NhbGU9XCInICsgYWN0aW9uLnBheWxvYWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtjdXJyZW50OiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RpZmljYXRpb25zKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBRERfTk9USUZJQ0FUSU9OJykge1xuICAgIHZhciBpZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHN0YXRlLmNvbmNhdChPYmplY3QuYXNzaWduKHtpZDogaWR9LCBhY3Rpb24ucGF5bG9hZCkpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnSElERV9OT1RJRklDQVRJT04nKSB7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiBlbGVtZW50LmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaTE4bihzdGF0ZT17XG4gIHRleHQ6IHtcbiAgICBnZXQoa2V5LCAuLi5hcmdzKXtcbiAgICAgIGxldCB0ZXh0ID0gZ2V0TG9jYWxlVGV4dChrZXksIGFyZ3MpO1xuICAgICAgaWYgKHRleHQpe1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9ybWF0KGRhdGU9bmV3IERhdGUoKSwgZm9ybWF0PVwiTFwiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZvcm1hdChmb3JtYXQpO1xuICAgIH0sXG4gICAgZnJvbU5vdyhkYXRlPW5ldyBEYXRlKCkpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZnJvbU5vdygpO1xuICAgIH0sXG4gICAgc3VidHJhY3QoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5zdWJ0cmFjdChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfSxcbiAgICBhZGQoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5hZGQoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH1cbiAgfVxufSwgYWN0aW9uKXtcbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBub3RpZmljYXRpb25zIGZyb20gJy4vYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vYmFzZS9sb2NhbGVzJztcbmltcG9ydCBpMThuIGZyb20gJy4vZ2VuZXJhbC9pMThuJztcblxuZXhwb3J0IGRlZmF1bHQgUmVkdXguY29tYmluZVJlZHVjZXJzKHtcbiAgbm90aWZpY2F0aW9ucyxcbiAgaTE4bixcbiAgbG9jYWxlc1xufSk7Il19
