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

var _notifications = require('../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateAnnouncements: function updateAnnouncements() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { hideWorkspaceAnnouncements: "false" };

    return function (dispatch, getState) {
      mApi().announcer.announcements.read(options).callback(function (err, announcements) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_ANNOUNCEMENTS',
            payload: announcements
          });
        }
      });
    };
  }
};

},{"../base/notifications":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _announcements = require('./announcements');

var _announcements2 = _interopRequireDefault(_announcements);

var _messageCount = require('./message-count');

var _messageCount2 = _interopRequireDefault(_messageCount);

var _lastWorkspace = require('./last-workspace');

var _lastWorkspace2 = _interopRequireDefault(_lastWorkspace);

var _workspaces = require('./workspaces');

var _workspaces2 = _interopRequireDefault(_workspaces);

var _lastMessages = require('./last-messages');

var _lastMessages2 = _interopRequireDefault(_lastMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  announcements: _announcements2.default,
  messageCount: _messageCount2.default,
  lastWorkspace: _lastWorkspace2.default,
  workspaces: _workspaces2.default,
  lastMessages: _lastMessages2.default
};

},{"./announcements":4,"./last-messages":6,"./last-workspace":7,"./message-count":8,"./workspaces":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateLastMessages: function updateLastMessages(maxResults) {
    return function (dispatch, getState) {
      mApi().communicator.items.read({
        'firstResult': 0,
        'maxResults': maxResults
      }).callback(function (err, messages) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_LAST_MESSAGES',
            payload: messages
          });
        }
      });
    };
  }
};

},{"../base/notifications":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateLastWorkspace: function updateLastWorkspace() {
    return function (dispatch, getState) {
      mApi().user.property.read('last-workspace').callback(function (err, property) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_LAST_WORKSPACE',
            payload: property.value
          });
        }
      });
    };
  }
};

},{"../base/notifications":2}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateMessageCount: function updateMessageCount() {
    return function (dispatch, getState) {
      mApi().communicator.receiveditemscount.cacheClear().read().callback(function (err, result) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: "UPDATE_MESSAGE_COUNT",
            payload: result
          });
        }
      });
    };
  }
};

},{"../base/notifications":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateWorkspaces: function updateWorkspaces() {
    return function (dispatch, getState) {
      var userId = getState().status.userId;
      mApi().workspace.workspaces.read({ userId: userId }).callback(function (err, workspaces) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: "UPDATE_WORKSPACES",
            payload: workspaces
          });
        }
      });
    };
  }
};

},{"../base/notifications":2}],10:[function(require,module,exports){
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

},{"../../actions/base/notifications":2,"react":"react","react-redux":"react-redux","redux":"redux"}],11:[function(require,module,exports){
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

},{"./portal.jsx":17,"prop-types":35,"react":"react"}],12:[function(require,module,exports){
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

},{"prop-types":35,"react":"react"}],13:[function(require,module,exports){
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
        _react2.default.createElement(_menu2.default, { open: this.state.isMenuOpen, onClose: this.closeMenu, items: this.props.menuItems })
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

},{"./navbar/language-picker.jsx":14,"./navbar/menu.jsx":15,"./navbar/profile-item.jsx":16,"prop-types":35,"react":"react"}],14:[function(require,module,exports){
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

},{"../../../actions/base/locales":1,"../dropdown.jsx":11,"prop-types":35,"react":"react","react-redux":"react-redux","redux":"redux"}],15:[function(require,module,exports){
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
        { className: 'menu ' + (this.state.displayed ? "displayed" : "") + ' ' + (this.state.visible ? "visible" : "") + ' ' + (this.state.dragging ? "dragging" : ""),
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
              })
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
  items: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired
};
exports.default = Menu;

},{"../link.jsx":12,"prop-types":35,"react":"react"}],16:[function(require,module,exports){
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

},{"../../../actions/base/status":3,"../dropdown.jsx":11,"../link.jsx":12,"prop-types":35,"react":"react","react-redux":"react-redux","redux":"redux"}],17:[function(require,module,exports){
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

},{"prop-types":35,"react":"react","react-dom":"react-dom"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScreenContainer = function (_React$Component) {
  _inherits(ScreenContainer, _React$Component);

  function ScreenContainer() {
    _classCallCheck(this, ScreenContainer);

    return _possibleConstructorReturn(this, (ScreenContainer.__proto__ || Object.getPrototypeOf(ScreenContainer)).apply(this, arguments));
  }

  _createClass(ScreenContainer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'screen-container screen-container-full-height' },
        _react2.default.createElement(
          'div',
          { className: 'screen-container-wrapper' },
          this.props.children
        )
      );
    }
  }]);

  return ScreenContainer;
}(_react2.default.Component);

ScreenContainer.propTypes = {
  children: _propTypes2.default.element.isRequired
};
exports.default = ScreenContainer;

},{"prop-types":35,"react":"react"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('../main-function/navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _screenContainer = require('../general/screen-container.jsx');

var _screenContainer2 = _interopRequireDefault(_screenContainer);

var _announcementsPanel = require('./body/announcements-panel.jsx');

var _announcementsPanel2 = _interopRequireDefault(_announcementsPanel);

var _continueStudiesPanel = require('./body/continue-studies-panel.jsx');

var _continueStudiesPanel2 = _interopRequireDefault(_continueStudiesPanel);

var _importantPanel = require('./body/important-panel.jsx');

var _importantPanel2 = _interopRequireDefault(_importantPanel);

var _lastMessagesPanel = require('./body/last-messages-panel.jsx');

var _lastMessagesPanel2 = _interopRequireDefault(_lastMessagesPanel);

var _workspacesPanel = require('./body/workspaces-panel.jsx');

var _workspacesPanel2 = _interopRequireDefault(_workspacesPanel);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IndexBody = function (_React$Component) {
  _inherits(IndexBody, _React$Component);

  function IndexBody() {
    _classCallCheck(this, IndexBody);

    return _possibleConstructorReturn(this, (IndexBody.__proto__ || Object.getPrototypeOf(IndexBody)).apply(this, arguments));
  }

  _createClass(IndexBody, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'embed embed-full' },
        _react2.default.createElement(_navbar2.default, { activeTrail: 'index' }),
        _react2.default.createElement(
          _screenContainer2.default,
          null,
          _react2.default.createElement(
            'div',
            { className: 'index ordered-container ordered-container-row ordered-container-responsive index-ordered-container-for-panels' },
            _react2.default.createElement(
              'div',
              { className: 'ordered-container-item' },
              _react2.default.createElement(
                'div',
                { className: 'index ordered-container index-ordered-container-for-panels-column' },
                _react2.default.createElement(_continueStudiesPanel2.default, null),
                _react2.default.createElement(_workspacesPanel2.default, null)
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'ordered-container-item' },
              _react2.default.createElement(
                'div',
                { className: 'index ordered-container index-ordered-container-for-panels-column' },
                _react2.default.createElement(_lastMessagesPanel2.default, null),
                _react2.default.createElement(_importantPanel2.default, null)
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'ordered-container-item' },
              _react2.default.createElement(
                'div',
                { className: 'index ordered-container index-ordered-container-for-panels-column' },
                _react2.default.createElement(_announcementsPanel2.default, null)
              )
            )
          )
        )
      );
    }
  }]);

  return IndexBody;
}(_react2.default.Component);

exports.default = IndexBody;

},{"../general/screen-container.jsx":18,"../main-function/navbar.jsx":25,"./body/announcements-panel.jsx":20,"./body/continue-studies-panel.jsx":21,"./body/important-panel.jsx":22,"./body/last-messages-panel.jsx":23,"./body/workspaces-panel.jsx":24,"react":"react"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _link = require('../../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnnouncementsPanel = function (_React$Component) {
  _inherits(AnnouncementsPanel, _React$Component);

  function AnnouncementsPanel() {
    _classCallCheck(this, AnnouncementsPanel);

    return _possibleConstructorReturn(this, (AnnouncementsPanel.__proto__ || Object.getPrototypeOf(AnnouncementsPanel)).apply(this, arguments));
  }

  _createClass(AnnouncementsPanel, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'ordered-container-item index panel' },
        _react2.default.createElement(
          'div',
          { className: 'index text index-text-for-panels-title index-text-for-panels-title-announcements' },
          _react2.default.createElement('span', { className: 'icon icon-announcer' }),
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.frontPage.announcements')
          )
        ),
        this.props.announcements.length !== 0 ? _react2.default.createElement(
          'div',
          { className: 'index item-list index-item-list-panel-announcements' },
          this.props.announcements.map(function (announcement) {
            return _react2.default.createElement(
              _link2.default,
              { key: announcement.id, className: 'item-list-item ' + (announcement.workspaces ? "item-list-item-has-workspaces" : ""),
                href: _this2.props.status.contextPath + 'link' },
              _react2.default.createElement('span', { className: 'icon icon-announcer' }),
              _react2.default.createElement(
                'span',
                { className: 'text item-list-text-body item-list-text-body-multiline' },
                announcement.caption,
                _react2.default.createElement(
                  'span',
                  { className: 'index text index-text-announcements-date' },
                  _this2.props.i18n.time.format(announcement.created)
                )
              )
            );
          })
        ) : _react2.default.createElement(
          'div',
          { className: 'index text index-text-panel-no-announcements' },
          this.props.i18n.text.get("plugin.announcer.empty.title")
        )
      );
    }
  }]);

  return AnnouncementsPanel;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    status: state.status,
    i18n: state.i18n,
    announcements: state.announcements
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(AnnouncementsPanel);

},{"../../general/link.jsx":12,"react":"react","react-redux":"react-redux"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _link = require('../../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //TODO please translate this... >:c
//You see those language strings...

var ContinueStudiesPanel = function (_React$Component) {
  _inherits(ContinueStudiesPanel, _React$Component);

  function ContinueStudiesPanel() {
    _classCallCheck(this, ContinueStudiesPanel);

    return _possibleConstructorReturn(this, (ContinueStudiesPanel.__proto__ || Object.getPrototypeOf(ContinueStudiesPanel)).apply(this, arguments));
  }

  _createClass(ContinueStudiesPanel, [{
    key: 'render',
    value: function render() {
      if (!this.props.status.loggedIn) {
        return null;
      } else if (!this.props.lastWorkspace) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        { className: 'ordered-container-item index panel' },
        _react2.default.createElement(
          'div',
          { className: 'index text index-text-for-panels-title index-text-for-panels-title-continue-studies' },
          _react2.default.createElement('span', { className: 'icon icon-revert' }),
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.frontPage.lastWorkspace.continueStudiesLink')
          )
        ),
        _react2.default.createElement(
          'h2',
          { className: 'index text index-text-panel-continue-studies-workspace-name' },
          this.props.lastWorkspace.workspaceName
        ),
        _react2.default.createElement(
          'span',
          { className: 'index text index-text-panel-continue-studies' },
          'Olit vimeksi sivulla',
          " ",
          _react2.default.createElement(
            'b',
            null,
            _react2.default.createElement(
              'i',
              null,
              this.props.lastWorkspace.materialName
            )
          ),
          " ",
          _react2.default.createElement(
            _link2.default,
            { href: this.props.lastWorkspace.url },
            'Jatka opintoja'
          )
        )
      );
    }
  }]);

  return ContinueStudiesPanel;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.lastWorkspace
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ContinueStudiesPanel);

},{"../../general/link.jsx":12,"react":"react","react-redux":"react-redux"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //<!-- Discuss with Nina about implementation of these -->
//                <div class="ordered-container-item index panel">
//                  <div class="index text index-text-for-panels-title index-text-for-panels-title-important">
//                    <span class="icon icon-star"></span>
//                    <span>#{i18n.text['plugin.frontPage.important']}</span>
//                  </div>
//                  <div data-controller-widget="panel-important">
//                    <!-- The dust template, nor the css classes inside are implemented -->
//                  </div>
//                </div>

//TODO not implemented
//on the top the previous piece of code
var ImportantPanel = function (_React$Component) {
  _inherits(ImportantPanel, _React$Component);

  function ImportantPanel() {
    _classCallCheck(this, ImportantPanel);

    return _possibleConstructorReturn(this, (ImportantPanel.__proto__ || Object.getPrototypeOf(ImportantPanel)).apply(this, arguments));
  }

  _createClass(ImportantPanel, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return ImportantPanel;
}(_react2.default.Component);

exports.default = ImportantPanel;

},{"react":"react"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _link = require('../../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LastMessagesPanel = function (_React$Component) {
  _inherits(LastMessagesPanel, _React$Component);

  function LastMessagesPanel() {
    _classCallCheck(this, LastMessagesPanel);

    return _possibleConstructorReturn(this, (LastMessagesPanel.__proto__ || Object.getPrototypeOf(LastMessagesPanel)).apply(this, arguments));
  }

  _createClass(LastMessagesPanel, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'ordered-container-item index panel' },
        _react2.default.createElement(
          'div',
          { className: 'index text index-text-for-panels-title index-text-for-panels-title-last-messages' },
          _react2.default.createElement('span', { className: 'icon icon-envelope' }),
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.frontPage.communicator.lastMessages')
          )
        ),
        this.props.lastMessages ? _react2.default.createElement(
          'div',
          { className: 'index item-list index-item-list-panel-last-messages' },
          this.props.lastMessages.map(function (message) {
            return _react2.default.createElement(
              _link2.default,
              { key: message.id, className: 'item-list-item ' + (message.unreadMessagesInThread ? "item-list-item-unread" : ""),
                href: '/communicator#inbox/' + message.communicatorMessageId },
              _react2.default.createElement('span', { className: 'icon icon-envelope' + (message.unreadMessagesInThread ? "-alt" : "") }),
              _react2.default.createElement(
                'span',
                { className: 'text item-list-text-body item-list-text-body-multiline' },
                message.caption,
                _react2.default.createElement(
                  'span',
                  { className: 'index text index-text-last-message-date' },
                  _this2.props.i18n.time.format(message.created)
                )
              )
            );
          })
        ) : _react2.default.createElement(
          'div',
          { className: 'index text index-text-panel-no-last-messages' },
          this.props.i18n.text.get("plugin.frontPage.messages.noMessages")
        )
      );
    }
  }]);

  return LastMessagesPanel;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    lastMessages: state.lastMessages
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LastMessagesPanel);

},{"../../general/link.jsx":12,"react":"react","react-redux":"react-redux"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _link = require('../../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WorkspacesPanel = function (_React$Component) {
  _inherits(WorkspacesPanel, _React$Component);

  function WorkspacesPanel() {
    _classCallCheck(this, WorkspacesPanel);

    return _possibleConstructorReturn(this, (WorkspacesPanel.__proto__ || Object.getPrototypeOf(WorkspacesPanel)).apply(this, arguments));
  }

  _createClass(WorkspacesPanel, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'ordered-container-item index panel' },
        _react2.default.createElement(
          'div',
          { className: 'index text index-text-for-panels-title index-text-for-panels-title-workspaces' },
          _react2.default.createElement('span', { className: 'icon icon-books' }),
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get('plugin.frontPage.workspaces.title')
          )
        ),
        this.props.workspaces ? _react2.default.createElement(
          'div',
          { className: 'index item-list index-item-list-panel-workspaces' },
          this.props.workspaces.map(function (workspace) {
            return _react2.default.createElement(
              _link2.default,
              { key: workspace.id, className: 'item-list-item', href: '/workspace/' + workspace.urlName },
              _react2.default.createElement('span', { className: 'icon icon-books' }),
              _react2.default.createElement(
                'span',
                { className: 'item-list-text-body text' },
                workspace.name + ' ' + (workspace.nameExtension ? workspace.nameExtension : "")
              )
            );
          })
        ) : _react2.default.createElement(
          'div',
          { className: 'index text index-text-panel-no-workspaces' },
          this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part1'),
          _react2.default.createElement(
            _link2.default,
            { href: '/coursepicker' },
            this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.coursepicker')
          ),
          " ",
          this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part2')
        )
      );
    }
  }]);

  return WorkspacesPanel;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    workspaces: state.workspaces
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(WorkspacesPanel);

},{"../../general/link.jsx":12,"react":"react","react-redux":"react-redux"}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('../general/navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _link = require('../general/link.jsx');

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

var MainFunctionNavbar = function (_React$Component) {
  _inherits(MainFunctionNavbar, _React$Component);

  function MainFunctionNavbar() {
    _classCallCheck(this, MainFunctionNavbar);

    return _possibleConstructorReturn(this, (MainFunctionNavbar.__proto__ || Object.getPrototypeOf(MainFunctionNavbar)).apply(this, arguments));
  }

  _createClass(MainFunctionNavbar, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var itemData = [{
        classNameSuffix: "home",
        trail: "index",
        text: 'plugin.home.home',
        href: "/",
        icon: "home",
        condition: true
      }, {
        classNameSuffix: "coursepicker",
        trail: "coursepicker",
        text: 'plugin.coursepicker.coursepicker',
        href: "/coursepicker",
        icon: "books",
        condition: true
      }, {
        classNameSuffix: "communicator",
        trail: "communicator",
        text: 'plugin.communicator.communicator',
        href: "/communicator",
        icon: "envelope",
        condition: this.props.status.loggedIn,
        badge: this.props.status.messageCount
      }, {
        classNameSuffix: "discussion",
        trail: "discussion",
        text: 'plugin.forum.forum',
        href: "/discussion",
        icon: "bubble",
        condition: this.props.status.loggedIn && this.props.status.permissions.FORUM_ACCESSENVIRONMENTFORUM
      }, {
        classNameSuffix: "guider",
        trail: "guider",
        text: 'plugin.guider.guider',
        href: "/guider",
        icon: "members",
        condition: this.props.status.permissions.GUIDER_VIEW
      }, {
        classNameSuffix: "records",
        trail: "records",
        text: 'plugin.records.records',
        href: "/records",
        icon: "profile",
        condition: this.props.status.permissions.TRANSCRIPT_OF_RECORDS_VIEW
      }, {
        classNameSuffix: "evaluation",
        trail: "evaluation",
        text: 'plugin.evaluation.evaluation',
        href: "/evaluation",
        icon: "evaluate",
        condition: this.props.status.permissions.EVALUATION_VIEW_INDEX
      }, {
        classNameSuffix: "announcer",
        trail: "announcer",
        text: 'plugin.announcer.announcer',
        href: "/announcer",
        icon: "announcer",
        condition: this.props.status.permissions.ANNOUNCER_TOOL
      }];

      return _react2.default.createElement(_navbar2.default, { classNameExtension: 'main-function', navbarItems: itemData.map(function (item) {
          if (!item.condition) {
            return null;
          }
          return {
            classNameSuffix: item.classNameSuffix,
            item: _react2.default.createElement(
              _link2.default,
              { href: item.href, className: 'main-function link link-icon link-full ' + (_this2.props.activeTrail === item.trail ? 'active' : ''),
                title: _this2.props.i18n.text.get(item.text) },
              _react2.default.createElement('span', { className: 'icon icon-' + item.icon }),
              item.badge ? _react2.default.createElement(
                'span',
                { className: 'main-function indicator' },
                item.badge >= 100 ? "99+" : item.badge
              ) : null
            )
          };
        }), defaultOptions: [], menuItems: itemData.map(function (item) {
          if (!item.condition) {
            return null;
          }
          return _react2.default.createElement(
            _link2.default,
            { href: item.href, className: 'main-function link link-full main-function-link-menu ' + (_this2.props.activeTrail === item.trail ? 'active' : '') },
            _react2.default.createElement('span', { className: 'icon icon-' + item.icon }),
            item.badge ? _react2.default.createElement(
              'span',
              { className: 'main-function indicator' },
              item.badge >= 100 ? "99+" : item.badge
            ) : null,
            _this2.props.i18n.text.get(item.text)
          );
        }) });
    }
  }]);

  return MainFunctionNavbar;
}(_react2.default.Component);

MainFunctionNavbar.propTypes = {
  activeTrail: _propTypes2.default.string.isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    status: state.status,
    messageCount: state.messageCount
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MainFunctionNavbar);

},{"../general/link.jsx":12,"../general/navbar.jsx":13,"prop-types":35,"react":"react","react-redux":"react-redux"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require('../components/base/notifications.jsx');

var _notifications2 = _interopRequireDefault(_notifications);

var _body = require('../components/index/body.jsx');

var _body2 = _interopRequireDefault(_body);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Index = function (_React$Component) {
  _inherits(Index, _React$Component);

  function Index() {
    _classCallCheck(this, Index);

    return _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).apply(this, arguments));
  }

  _createClass(Index, [{
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

  return Index;
}(_react2.default.Component);

exports.default = Index;

},{"../components/base/notifications.jsx":10,"../components/index/body.jsx":19,"react":"react"}],27:[function(require,module,exports){
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

},{"react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","redux-logger":37,"redux-thunk":"redux-thunk"}],28:[function(require,module,exports){
'use strict';

var _index = require('./containers/index.jsx');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./reducers/index');

var _index4 = _interopRequireDefault(_index3);

var _defaultDebug = require('./default.debug.jsx');

var _defaultDebug2 = _interopRequireDefault(_defaultDebug);

var _websocket = require('./util/websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _mainFunction = require('./actions/main-function');

var _mainFunction2 = _interopRequireDefault(_mainFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _defaultDebug2.default)(_index4.default, _index2.default, function (store) {
  var websocket = new _websocket2.default(store, {
    "Communicator:newmessagereceived": [_mainFunction2.default.updateMessageCount],
    "Communicator:messageread": [_mainFunction2.default.updateMessageCount],
    "Communicator:threaddeleted": [_mainFunction2.default.updateMessageCount]
  });
  store.dispatch(_mainFunction2.default.messageCount.updateMessageCount());
  store.dispatch(_mainFunction2.default.announcements.updateAnnouncements());
  store.dispatch(_mainFunction2.default.lastWorkspace.updateLastWorkspace());
  store.dispatch(_mainFunction2.default.workspaces.updateWorkspaces());
  store.dispatch(_mainFunction2.default.lastMessages.updateLastMessages(6));
});

},{"./actions/main-function":5,"./containers/index.jsx":26,"./default.debug.jsx":27,"./reducers/index":42,"./util/websocket":49}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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

},{"_process":50}],31:[function(require,module,exports){
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

},{"./emptyFunction":29,"_process":50}],32:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":36,"_process":50,"fbjs/lib/invariant":30,"fbjs/lib/warning":31}],33:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":36,"fbjs/lib/emptyFunction":29,"fbjs/lib/invariant":30}],34:[function(require,module,exports){
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

},{"./checkPropTypes":32,"./lib/ReactPropTypesSecret":36,"_process":50,"fbjs/lib/emptyFunction":29,"fbjs/lib/invariant":30,"fbjs/lib/warning":31}],35:[function(require,module,exports){
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

},{"./factoryWithThrowingShims":33,"./factoryWithTypeCheckers":34,"_process":50}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
(function (global){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

var _websocket = require('./util/websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _messageCount = require('./main-function/message-count');

var _messageCount2 = _interopRequireDefault(_messageCount);

var _announcements = require('./main-function/announcements');

var _announcements2 = _interopRequireDefault(_announcements);

var _lastWorkspace = require('./main-function/last-workspace');

var _lastWorkspace2 = _interopRequireDefault(_lastWorkspace);

var _lastMessages = require('./main-function/last-messages');

var _lastMessages2 = _interopRequireDefault(_lastMessages);

var _workspaces = require('./main-function/workspaces');

var _workspaces2 = _interopRequireDefault(_workspaces);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  notifications: _notifications2.default,
  i18n: _i18n2.default,
  locales: _locales2.default,
  status: _status2.default,
  websocket: _websocket2.default,
  announcements: _announcements2.default,
  lastWorkspace: _lastWorkspace2.default,
  workspaces: _workspaces2.default,
  lastMessages: _lastMessages2.default
});

},{"./base/i18n":38,"./base/locales":39,"./base/notifications":40,"./base/status":41,"./main-function/announcements":43,"./main-function/last-messages":44,"./main-function/last-workspace":45,"./main-function/message-count":46,"./main-function/workspaces":47,"./util/websocket":48,"redux":"redux"}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = announcements;
function announcements() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  if (action.type === 'UPDATE_ANNOUNCEMENTS') {
    return action.payload;
  }
  return state;
}

},{}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lastMessages;
function lastMessages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  if (action.type === 'UPDATE_LAST_MESSAGES') {
    return action.payload;
  }
  return state;
}

},{}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = announcements;
function announcements() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments[1];

  if (action.type === 'UPDATE_LAST_WORKSPACE') {
    return action.payload;
  }
  return state;
}

},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = messageCount;
function messageCount() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var action = arguments[1];

  if (action.type === "UPDATE_MESSAGE_COUNT") {
    return action.payload;
  }
  return state;
}

},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = workspaces;
function workspaces() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  if (action.type === 'UPDATE_WORKSPACES') {
    return action.payload;
  }
  return state;
}

},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = websocket;
function websocket() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    connected: false
  };
  var action = arguments[1];

  if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketConnected") {
    return Object.assign({}, state, { connected: true });
  } else if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketDisconnected") {
    return Object.assign({}, state, { connected: false });
  }
  return state;
}

},{}],49:[function(require,module,exports){
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

},{"../actions/base/notifications":2}],50:[function(require,module,exports){
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

},{}]},{},[28])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFjdGlvbnMvYmFzZS9sb2NhbGVzLmpzIiwiYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMuanMiLCJhY3Rpb25zL2Jhc2Uvc3RhdHVzLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2Fubm91bmNlbWVudHMuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vaW5kZXguanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vbGFzdC1tZXNzYWdlcy5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9sYXN0LXdvcmtzcGFjZS5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9tZXNzYWdlLWNvdW50LmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL3dvcmtzcGFjZXMuanMiLCJjb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvZHJvcGRvd24uanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2xpbmsuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyL2xhbmd1YWdlLXBpY2tlci5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyL21lbnUuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9wcm9maWxlLWl0ZW0uanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL3BvcnRhbC5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvc2NyZWVuLWNvbnRhaW5lci5qc3giLCJjb21wb25lbnRzL2luZGV4L2JvZHkuanN4IiwiY29tcG9uZW50cy9pbmRleC9ib2R5L2Fubm91bmNlbWVudHMtcGFuZWwuanN4IiwiY29tcG9uZW50cy9pbmRleC9ib2R5L2NvbnRpbnVlLXN0dWRpZXMtcGFuZWwuanN4IiwiY29tcG9uZW50cy9pbmRleC9ib2R5L2ltcG9ydGFudC1wYW5lbC5qc3giLCJjb21wb25lbnRzL2luZGV4L2JvZHkvbGFzdC1tZXNzYWdlcy1wYW5lbC5qc3giLCJjb21wb25lbnRzL2luZGV4L2JvZHkvd29ya3NwYWNlcy1wYW5lbC5qc3giLCJjb21wb25lbnRzL21haW4tZnVuY3Rpb24vbmF2YmFyLmpzeCIsImNvbnRhaW5lcnMvaW5kZXguanN4IiwiZGVmYXVsdC5kZWJ1Zy5qc3giLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9lbXB0eUZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi93YXJuaW5nLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9kaXN0L3JlZHV4LWxvZ2dlci5qcyIsInJlZHVjZXJzL2Jhc2UvaTE4bi5qcyIsInJlZHVjZXJzL2Jhc2UvbG9jYWxlcy5qcyIsInJlZHVjZXJzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qcyIsInJlZHVjZXJzL2Jhc2Uvc3RhdHVzLmpzIiwicmVkdWNlcnMvaW5kZXguanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL2Fubm91bmNlbWVudHMuanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL2xhc3QtbWVzc2FnZXMuanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL2xhc3Qtd29ya3NwYWNlLmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi9tZXNzYWdlLWNvdW50LmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi93b3Jrc3BhY2VzLmpzIiwicmVkdWNlcnMvdXRpbC93ZWJzb2NrZXQuanMiLCJ1dGlsL3dlYnNvY2tldC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0FlO0FBQ2IsYUFBVyxtQkFBUyxNQUFULEVBQWdCO0FBQ3pCLFdBQU87QUFDTCxjQUFRLFlBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQU5ZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsdUJBQXFCLDZCQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBMkI7QUFDOUMsV0FBTztBQUNMLGNBQVEsa0JBREg7QUFFTCxpQkFBVztBQUNULG9CQUFZLFFBREg7QUFFVCxtQkFBVztBQUZGO0FBRk4sS0FBUDtBQU9ELEdBVFk7QUFVYixvQkFBa0IsMEJBQVMsWUFBVCxFQUFzQjtBQUN0QyxXQUFPO0FBQ0wsY0FBUSxtQkFESDtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBZlksQzs7Ozs7Ozs7a0JDQUE7QUFDYixRQURhLG9CQUNMO0FBQ04sV0FBTztBQUNMLGNBQVE7QUFESCxLQUFQO0FBR0Q7QUFMWSxDOzs7Ozs7Ozs7QUNBZjs7Ozs7O2tCQUVlO0FBQ2IscUJBRGEsaUNBQ3VEO0FBQUEsUUFBaEQsT0FBZ0QsdUVBQXhDLEVBQUUsNEJBQTRCLE9BQTlCLEVBQXdDOztBQUNsRSxXQUFPLFVBQUMsUUFBRCxFQUFXLFFBQVgsRUFBc0I7QUFDM0IsYUFDRyxTQURILENBRUcsYUFGSCxDQUdHLElBSEgsQ0FHUSxPQUhSLEVBSUcsUUFKSCxDQUlZLFVBQVMsR0FBVCxFQUFjLGFBQWQsRUFBNkI7QUFDckMsWUFBSSxHQUFKLEVBQVM7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCB7XG4gIHNldExvY2FsZTogZnVuY3Rpb24obG9jYWxlKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnU0VUX0xPQ0FMRScsXG4gICAgICAncGF5bG9hZCc6IGxvY2FsZVxuICAgIH1cbiAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gIGRpc3BsYXlOb3RpZmljYXRpb246IGZ1bmN0aW9uKG1lc3NhZ2UsIHNldmVyaXR5KXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnQUREX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3NldmVyaXR5Jzogc2V2ZXJpdHksXG4gICAgICAgICdtZXNzYWdlJzogbWVzc2FnZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaGlkZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obm90aWZpY2F0aW9uKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnSElERV9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiBub3RpZmljYXRpb25cbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBsb2dvdXQoKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnTE9HT1VUJ1xuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUFubm91bmNlbWVudHMob3B0aW9ucz17IGhpZGVXb3Jrc3BhY2VBbm5vdW5jZW1lbnRzOiBcImZhbHNlXCIgfSl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKClcbiAgICAgICAgLmFubm91bmNlclxuICAgICAgICAuYW5ub3VuY2VtZW50c1xuICAgICAgICAucmVhZChvcHRpb25zKVxuICAgICAgICAuY2FsbGJhY2soZnVuY3Rpb24oZXJyLCBhbm5vdW5jZW1lbnRzKSB7XG4gICAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ1VQREFURV9BTk5PVU5DRU1FTlRTJyxcbiAgICAgICAgICAgICAgcGF5bG9hZDogYW5ub3VuY2VtZW50c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYW5ub3VuY2VtZW50cyBmcm9tICcuL2Fubm91bmNlbWVudHMnO1xuaW1wb3J0IG1lc3NhZ2VDb3VudCBmcm9tICcuL21lc3NhZ2UtY291bnQnO1xuaW1wb3J0IGxhc3RXb3Jrc3BhY2UgZnJvbSAnLi9sYXN0LXdvcmtzcGFjZSc7XG5pbXBvcnQgd29ya3NwYWNlcyBmcm9tICcuL3dvcmtzcGFjZXMnO1xuaW1wb3J0IGxhc3RNZXNzYWdlcyBmcm9tICcuL2xhc3QtbWVzc2FnZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFubm91bmNlbWVudHMsXG4gIG1lc3NhZ2VDb3VudCxcbiAgbGFzdFdvcmtzcGFjZSxcbiAgd29ya3NwYWNlcyxcbiAgbGFzdE1lc3NhZ2VzXG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVMYXN0TWVzc2FnZXMobWF4UmVzdWx0cyl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKCkuY29tbXVuaWNhdG9yLml0ZW1zLnJlYWQoe1xuICAgICAgICAnZmlyc3RSZXN1bHQnOiAwLFxuICAgICAgICAnbWF4UmVzdWx0cyc6IG1heFJlc3VsdHNcbiAgICAgIH0pLmNhbGxiYWNrKGZ1bmN0aW9uIChlcnIsIG1lc3NhZ2VzKSB7XG4gICAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiAnVVBEQVRFX0xBU1RfTUVTU0FHRVMnLFxuICAgICAgICAgICAgcGF5bG9hZDogbWVzc2FnZXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVMYXN0V29ya3NwYWNlKCl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKCkudXNlci5wcm9wZXJ0eS5yZWFkKCdsYXN0LXdvcmtzcGFjZScpLmNhbGxiYWNrKGZ1bmN0aW9uKGVyciwgcHJvcGVydHkpIHtcbiAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfTEFTVF9XT1JLU1BBQ0UnLFxuICAgICAgICAgICAgcGF5bG9hZDogcHJvcGVydHkudmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZU1lc3NhZ2VDb3VudCgpe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgbUFwaSgpXG4gICAgICAgIC5jb21tdW5pY2F0b3JcbiAgICAgICAgLnJlY2VpdmVkaXRlbXNjb3VudFxuICAgICAgICAuY2FjaGVDbGVhcigpXG4gICAgICAgIC5yZWFkKClcbiAgICAgICAgLmNhbGxiYWNrKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgIHR5cGU6IFwiVVBEQVRFX01FU1NBR0VfQ09VTlRcIixcbiAgICAgICAgICAgICAgcGF5bG9hZDogcmVzdWx0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlV29ya3NwYWNlcygpe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgbGV0IHVzZXJJZCA9IGdldFN0YXRlKCkuc3RhdHVzLnVzZXJJZDtcbiAgICAgIG1BcGkoKS53b3Jrc3BhY2Uud29ya3NwYWNlc1xuICAgICAgIC5yZWFkKHt1c2VySWR9KVxuICAgICAgIC5jYWxsYmFjayhmdW5jdGlvbiAoZXJyLCB3b3Jrc3BhY2VzKSB7XG4gICAgICAgICBpZiggZXJyICl7XG4gICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgIHR5cGU6IFwiVVBEQVRFX1dPUktTUEFDRVNcIixcbiAgICAgICAgICAgICBwYXlsb2FkOiB3b3Jrc3BhY2VzXG4gICAgICAgICAgIH0pO1xuICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuY2xhc3MgTm90aWZpY2F0aW9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbnMubWFwKChub3RpZmljYXRpb24pPT57XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17bm90aWZpY2F0aW9uLmlkfSBjbGFzc05hbWU9e1wibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0gbm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0tXCIgKyBub3RpZmljYXRpb24uc2V2ZXJpdHl9PlxuICAgICAgICAgICAgICAgIDxzcGFuPntub3RpZmljYXRpb24ubWVzc2FnZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW0tY2xvc2VcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmhpZGVOb3RpZmljYXRpb24uYmluZCh0aGlzLCBub3RpZmljYXRpb24pfT48L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4gIFxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBub3RpZmljYXRpb25zOiBzdGF0ZS5ub3RpZmljYXRpb25zXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShOb3RpZmljYXRpb25zKTsiLCJpbXBvcnQgUG9ydGFsIGZyb20gJy4vcG9ydGFsLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG9wOiBudWxsLFxuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIGFycm93TGVmdDogbnVsbCxcbiAgICAgIGFycm93UmlnaHQ6IG51bGwsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbk9wZW4oRE9NTm9kZSl7XG4gICAgbGV0ICR0YXJnZXQgPSAkKHRoaXMucmVmcy5hY3RpdmF0b3IpO1xuICAgIGxldCAkYXJyb3cgPSAkKHRoaXMucmVmcy5hcnJvdyk7XG4gICAgbGV0ICRkcm9wZG93biA9ICQodGhpcy5yZWZzLmRyb3Bkb3duKTtcbiAgICAgIFxuICAgIGxldCBwb3NpdGlvbiA9ICR0YXJnZXQub2Zmc2V0KCk7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgbGV0IG1vcmVTcGFjZUluVGhlTGVmdFNpZGUgPSAod2luZG93V2lkdGggLSBwb3NpdGlvbi5sZWZ0KSA8IHBvc2l0aW9uLmxlZnQ7XG4gICAgXG4gICAgbGV0IGxlZnQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0IC0gJGRyb3Bkb3duLm91dGVyV2lkdGgoKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdDtcbiAgICB9XG4gICAgbGV0IHRvcCA9IHBvc2l0aW9uLnRvcCArICR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDU7XG4gICAgXG4gICAgbGV0IGFycm93TGVmdCA9IG51bGw7XG4gICAgbGV0IGFycm93UmlnaHQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGFycm93UmlnaHQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3dMZWZ0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe3RvcCwgbGVmdCwgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0LCB2aXNpYmxlOiB0cnVlfSk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICBjbG9zZSgpe1xuICAgIHRoaXMucmVmcy5wb3J0YWwuY2xvc2VQb3J0YWwoKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXtSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jaGlsZHJlbiwgeyByZWY6IFwiYWN0aXZhdG9yXCIgfSl9XG4gICAgICBjbG9zZU9uRXNjIGNsb3NlT25PdXRzaWRlQ2xpY2sgY2xvc2VPblNjcm9sbCBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0+XG4gICAgICA8ZGl2IHJlZj1cImRyb3Bkb3duXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubGVmdFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBkcm9wZG93biAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kcm9wZG93bi0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXJyb3dcIiByZWY9XCJhcnJvd1wiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5hcnJvd0xlZnQsIHJpZ2h0OiB0aGlzLnN0YXRlLmFycm93UmlnaHR9fT48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdHlwZW9mIGl0ZW0gPT09IFwiZnVuY3Rpb25cIiA/IGl0ZW0odGhpcy5jbG9zZSkgOiBpdGVtO1xuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAge2VsZW1lbnR9XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvUG9ydGFsPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIHNjcm9sbFRvU2VjdGlvbihhbmNob3IpIHtcbiAgbGV0IHRvcE9mZnNldCA9IDkwO1xuICBsZXQgc2Nyb2xsVG9wID0gJChhbmNob3IpLm9mZnNldCgpLnRvcCAtIHRvcE9mZnNldDtcblxuICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgIHNjcm9sbFRvcCA6IHNjcm9sbFRvcFxuICB9LCB7XG4gICAgZHVyYXRpb24gOiA1MDAsXG4gICAgZWFzaW5nIDogXCJlYXNlSW5PdXRRdWFkXCJcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbkNsaWNrKGUsIHJlKXtcbiAgICBpZiAodGhpcy5wcm9wcy5ocmVmICYmIHRoaXMucHJvcHMuaHJlZlswXSA9PT0gJyMnKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNjcm9sbFRvU2VjdGlvbih0aGlzLnByb3BzLmhyZWYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKXtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiB0cnVlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBmYWxzZX0pO1xuICAgIHRoaXMub25DbGljayhlLCByZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaEVuZCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hFbmQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPGEgey4uLnRoaXMucHJvcHN9XG4gICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lICsgKHRoaXMuc3RhdGUuYWN0aXZlID8gXCIgYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja30gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfS8+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExhbmd1YWdlUGlja2VyIGZyb20gJy4vbmF2YmFyL2xhbmd1YWdlLXBpY2tlci5qc3gnO1xuaW1wb3J0IFByb2ZpbGVJdGVtIGZyb20gJy4vbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3gnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi9uYXZiYXIvbWVudS5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9wZW5NZW51ID0gdGhpcy5vcGVuTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VNZW51ID0gdGhpcy5jbG9zZU1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9XG4gIH1cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZiYXJJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGl0ZW06IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZCxcbiAgICBtZW51SXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkLFxuICAgIGRlZmF1bHRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZFxuICB9XG4gIG9wZW5NZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgY2xvc2VNZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH0pO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufWB9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWxvZ29cIj48L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tbWVudS1idXR0b25gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1pY29uIGxpbmstZnVsbGB9IG9uQ2xpY2s9e3RoaXMub3Blbk1lbnV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbmF2aWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5hdmJhckl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLSR7aXRlbS5jbGFzc05hbWVTdWZmaXh9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLml0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGl0ZW09PiEhaXRlbSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZGVmYXVsdE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgPFByb2ZpbGVJdGVtIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3VhZ2VQaWNrZXIgY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICAgIDxNZW51IG9wZW49e3RoaXMuc3RhdGUuaXNNZW51T3Blbn0gb25DbG9zZT17dGhpcy5jbG9zZU1lbnV9IGl0ZW1zPXt0aGlzLnByb3BzLm1lbnVJdGVtc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uLy4uL2FjdGlvbnMvYmFzZS9sb2NhbGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICcuLi9kcm9wZG93bi5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuY2xhc3MgTGFuZ3VhZ2VQaWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8RHJvcGRvd24gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gY2xhc3NOYW1lU3VmZml4PVwibGFuZ3VhZ2UtcGlja2VyXCIgaXRlbXM9e3RoaXMucHJvcHMubG9jYWxlcy5hdmFsaWFibGUubWFwKChsb2NhbGUpPT57XG4gICAgICByZXR1cm4gKDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstbGFuZ3VhZ2UtcGlja2VyYH0gb25DbGljaz17dGhpcy5wcm9wcy5zZXRMb2NhbGUuYmluZCh0aGlzLCBsb2NhbGUubG9jYWxlKX0+XG4gICAgICAgIDxzcGFuPntsb2NhbGUubmFtZX08L3NwYW4+XG4gICAgICA8L2E+KTtcbiAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBidXR0b24tcGlsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1idXR0b24tcGlsbC1sYW5ndWFnZWB9PlxuICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5sb2NhbGVzLmN1cnJlbnR9PC9zcGFuPlxuICAgICAgPC9hPlxuICAgIDwvRHJvcGRvd24+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBsb2NhbGVzOiBzdGF0ZS5sb2NhbGVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYW5ndWFnZVBpY2tlcik7IiwiaW1wb3J0IExpbmsgZnJvbSAnLi4vbGluay5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub3BlbiA9IHRoaXMub3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZUJ5T3ZlcmxheSA9IHRoaXMuY2xvc2VCeU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlzcGxheWVkOiBwcm9wcy5vcGVuLFxuICAgICAgdmlzaWJsZTogcHJvcHMub3BlbixcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWc6IG51bGwsXG4gICAgICBvcGVuOiBwcm9wcy5vcGVuXG4gICAgfVxuICB9XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKXtcbiAgICBpZiAobmV4dFByb3BzLm9wZW4gJiYgIXRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMub3BlbiAmJiB0aGlzLnN0YXRlLm9wZW4pe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7J2RyYWdnaW5nJzogdHJ1ZX0pO1xuICAgIHRoaXMudG91Y2hDb3JkWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCA9IDA7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hNb3ZlKGUpe1xuICAgIGxldCBkaWZmWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoQ29yZFg7XG4gICAgbGV0IGFic29sdXRlRGlmZmVyZW5jZVggPSBNYXRoLmFicyhkaWZmWCAtIHRoaXMuc3RhdGUuZHJhZyk7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCArPSBhYnNvbHV0ZURpZmZlcmVuY2VYO1xuXG4gICAgaWYgKGRpZmZYID4gMCkge1xuICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBkaWZmWH0pO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvblRvdWNoRW5kKGUpe1xuICAgIGxldCB3aWR0aCA9ICQodGhpcy5yZWZzLm1lbnVDb250YWluZXIpLndpZHRoKCk7XG4gICAgbGV0IGRpZmYgPSB0aGlzLnN0YXRlLmRyYWc7XG4gICAgbGV0IG1vdmVtZW50ID0gdGhpcy50b3VjaE1vdmVtZW50WDtcbiAgICBcbiAgICBsZXQgbWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgPSBNYXRoLmFicyhkaWZmKSA+PSB3aWR0aCowLjMzO1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZFRoZU92ZXJsYXkgPSBlLnRhcmdldCA9PT0gdGhpcy5yZWZzLm1lbnUgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBsZXQgeW91SnVzdENsaWNrZWRBTGluayA9IGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYVwiICYmIG1vdmVtZW50IDw9IDU7XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ2dpbmc6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZzogbnVsbH0pO1xuICAgICAgaWYgKG1lbnVIYXNTbGlkZWRFbm91Z2hGb3JDbG9zaW5nIHx8IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSB8fCB5b3VKdXN0Q2xpY2tlZEFMaW5rKXtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sIDEwKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb3Blbigpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogdHJ1ZSwgb3BlbjogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IHRydWV9KTtcbiAgICB9LCAxMCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5jc3MoeydvdmVyZmxvdyc6ICdoaWRkZW4nfSk7XG4gIH1cbiAgY2xvc2VCeU92ZXJsYXkoZSl7XG4gICAgbGV0IGlzT3ZlcmxheSA9IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGlzTGluayA9ICEhZS50YXJnZXQuaHJlZjtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZHJhZ2dpbmcgJiYgKGlzT3ZlcmxheSB8fCBpc0xpbmspKXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJyd9KTtcbiAgICB0aGlzLnNldFN0YXRlKHt2aXNpYmxlOiBmYWxzZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogZmFsc2UsIG9wZW46IGZhbHNlfSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9LCAzMDApO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e2BtZW51ICR7dGhpcy5zdGF0ZS5kaXNwbGF5ZWQgPyBcImRpc3BsYXllZFwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGVcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS5kcmFnZ2luZyA/IFwiZHJhZ2dpbmdcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jbG9zZUJ5T3ZlcmxheX0gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaE1vdmU9e3RoaXMub25Ub3VjaE1vdmV9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0gcmVmPVwibWVudVwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1jb250YWluZXJcIiByZWY9XCJtZW51Q29udGFpbmVyXCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmRyYWd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWVudS1oZWFkZXItYnV0dG9uLWNsb3NlIGljb24gaWNvbi1hcnJvdy1sZWZ0XCI+PC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibWVudS1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBrZXk9e2luZGV4fT57aXRlbX08L2xpPlxuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+KTtcbiAgfVxufVxuICAiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4uL2Ryb3Bkb3duLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi9saW5rLmpzeCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5pbXBvcnQgYWN0aW9ucyBmcm9tICcuLi8uLi8uLi9hY3Rpb25zL2Jhc2Uvc3RhdHVzJztcblxuY2xhc3MgUHJvZmlsZUl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGlmICghdGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4pe1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICBpY29uOiBcInVzZXJcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5wcm9maWxlLmxpbmtzLnBlcnNvbmFsJyxcbiAgICAgICAgaHJlZjogXCIvcHJvZmlsZVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcImZvcmdvdHBhc3N3b3JkXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4uZm9vdGVyLmluc3RydWN0aW9ucydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwiaGVscGRlc2tcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5ob21lLmhlbHBkZXNrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJzaWdub3V0XCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4ubG9nb3V0LmxvZ291dCcsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMucHJvcHMubG9nb3V0XG4gICAgICB9XG4gICAgXVxuICAgIHJldHVybiA8RHJvcGRvd24gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gY2xhc3NOYW1lU3VmZml4PVwicHJvZmlsZS1tZW51XCIgaXRlbXM9e2l0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgcmV0dXJuIChjbG9zZURyb3Bkb3duKT0+e3JldHVybiA8TGluayBocmVmPVwiL3Byb2ZpbGVcIlxuICAgICAgICAgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbGluayBsaW5rLWZ1bGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbGluay1wcm9maWxlLW1lbnVgfVxuICAgICAgICAgb25DbGljaz17KC4uLmFyZ3MpPT57Y2xvc2VEcm9wZG93bigpO2l0ZW0ub25DbGljayAmJiBpdGVtLm9uQ2xpY2soLi4uYXJncyl9fSBocmVmPXtpdGVtLmhyZWZ9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gaWNvbi0ke2l0ZW0uaWNvbn1gfT48L3NwYW4+XG4gICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChpdGVtLnRleHQpfTwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPn1cbiAgICAgIH0pfT5cbiAgICAgIDxhIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gYnV0dG9uLXBpbGwgbWFpbi1mdW5jdGlvbi1idXR0b24tcGlsbC1wcm9maWxlXCI+XG4gICAgICAgIDxvYmplY3QgY2xhc3NOYW1lPVwiZW1iYmVkIGVtYmJlZC1mdWxsXCJcbiAgICAgICAgIGRhdGE9e2AvcmVzdC91c2VyL2ZpbGVzL3VzZXIvJHt0aGlzLnByb3BzLnN0YXR1cy51c2VySWR9L2lkZW50aWZpZXIvcHJvZmlsZS1pbWFnZS05NmB9XG4gICAgICAgICB0eXBlPVwiaW1hZ2UvanBlZ1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi11c2VyXCI+PC9zcGFuPlxuICAgICAgICA8L29iamVjdD5cbiAgICAgIDwvYT5cbiAgICA8L0Ryb3Bkb3duPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4bixcbiAgICBzdGF0dXM6IHN0YXRlLnN0YXR1c1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoUHJvZmlsZUl0ZW0pOyIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHt1bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lciwgdW5tb3VudENvbXBvbmVudEF0Tm9kZSwgZmluZERPTU5vZGV9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmNvbnN0IEtFWUNPREVTID0ge1xuICBFU0NBUEU6IDI3XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3J0YWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7IGFjdGl2ZTogZmFsc2UgfTtcbiAgICB0aGlzLmhhbmRsZVdyYXBwZXJDbGljayA9IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCA9IHRoaXMuY2xvc2VQb3J0YWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlS2V5ZG93biA9IHRoaXMuaGFuZGxlS2V5ZG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICB0aGlzLm5vZGUgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgdGhpcy5yZW5kZXJQb3J0YWwobmV3UHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUG9ydGFsKHRydWUpO1xuICB9XG5cbiAgaGFuZGxlV3JhcHBlckNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5vcGVuUG9ydGFsKCk7XG4gIH1cblxuICBvcGVuUG9ydGFsKHByb3BzID0gdGhpcy5wcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IHRydWUgfSk7XG4gICAgdGhpcy5yZW5kZXJQb3J0YWwocHJvcHMsIHRydWUpO1xuICB9XG5cbiAgY2xvc2VQb3J0YWwoaXNVbm1vdW50ZWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHJlc2V0UG9ydGFsU3RhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICAgIHVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5ub2RlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChpc1VubW91bnRlZCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5iZWZvcmVDbG9zZSkge1xuICAgICAgICB0aGlzLnByb3BzLmJlZm9yZUNsb3NlKHRoaXMubm9kZSwgcmVzZXRQb3J0YWxTdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNldFBvcnRhbFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IGZpbmRET01Ob2RlKHRoaXMucG9ydGFsKTtcbiAgICBpZiAocm9vdC5jb250YWlucyhlLnRhcmdldCkgfHwgKGUuYnV0dG9uICYmIGUuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICB9XG5cbiAgaGFuZGxlS2V5ZG93bihlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gS0VZQ09ERVMuRVNDQVBFICYmIHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLmNsb3NlUG9ydGFsKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyUG9ydGFsKHByb3BzLCBpc09wZW5pbmcpIHtcbiAgICBpZiAoIXRoaXMubm9kZSkge1xuICAgICAgdGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamltZmIvZDk5ZTA2NzhlOWRhNzE1Y2NmNjQ1NDk2MWVmMDRkMWJcbiAgICBpZiAodHlwZW9mIHByb3BzLmNoaWxkcmVuLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNoaWxkcmVuID0gUmVhY3QuY2xvbmVFbGVtZW50KHByb3BzLmNoaWxkcmVuLCB7XG4gICAgICAgIGNsb3NlUG9ydGFsOiB0aGlzLmNsb3NlUG9ydGFsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcnRhbCA9IHVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKFxuICAgICAgdGhpcyxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgdGhpcy5ub2RlLFxuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVxuICAgICk7XG4gICAgXG4gICAgaWYgKGlzT3BlbmluZykge1xuICAgICAgdGhpcy5wcm9wcy5vbk9wZW4odGhpcy5ub2RlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub3BlbkJ5Q2xpY2tPbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24sIHtcbiAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5Qb3J0YWwucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgb3BlbkJ5Q2xpY2tPbjogUHJvcFR5cGVzLmVsZW1lbnQsXG4gIGNsb3NlT25Fc2M6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPblNjcm9sbDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBiZWZvcmVDbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXBkYXRlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuUG9ydGFsLmRlZmF1bHRQcm9wcyA9IHtcbiAgb25PcGVuOiAoKSA9PiB7fSxcbiAgb25DbG9zZTogKCkgPT4ge30sXG4gIG9uVXBkYXRlOiAoKSA9PiB7fVxufTsiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbi1jb250YWluZXIgc2NyZWVuLWNvbnRhaW5lci1mdWxsLWhlaWdodFwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuLWNvbnRhaW5lci13cmFwcGVyXCI+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+PC9kaXY+XG4gIH1cbn0iLCJpbXBvcnQgTWFpbkZ1bmN0aW9uTmF2YmFyIGZyb20gJy4uL21haW4tZnVuY3Rpb24vbmF2YmFyLmpzeCc7XG5pbXBvcnQgU2NyZWVuQ29udGFpbmVyIGZyb20gJy4uL2dlbmVyYWwvc2NyZWVuLWNvbnRhaW5lci5qc3gnO1xuXG5pbXBvcnQgQW5ub3VuY2VtZW50c1BhbmVsIGZyb20gJy4vYm9keS9hbm5vdW5jZW1lbnRzLXBhbmVsLmpzeCc7XG5pbXBvcnQgQ29udGludWVTdHVkaWVzUGFuZWwgZnJvbSAnLi9ib2R5L2NvbnRpbnVlLXN0dWRpZXMtcGFuZWwuanN4JztcbmltcG9ydCBJbXBvcnRhbnRQYW5lbCBmcm9tICcuL2JvZHkvaW1wb3J0YW50LXBhbmVsLmpzeCc7XG5pbXBvcnQgTGFzdE1lc3NhZ2VzUGFuZWwgZnJvbSAnLi9ib2R5L2xhc3QtbWVzc2FnZXMtcGFuZWwuanN4JztcbmltcG9ydCBXb3Jrc3BhY2VzUGFuZWwgZnJvbSAnLi9ib2R5L3dvcmtzcGFjZXMtcGFuZWwuanN4JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImVtYmVkIGVtYmVkLWZ1bGxcIj5cbiAgICAgIDxNYWluRnVuY3Rpb25OYXZiYXIgYWN0aXZlVHJhaWw9XCJpbmRleFwiLz5cbiAgICAgIDxTY3JlZW5Db250YWluZXI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5kZXggb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgaW5kZXgtb3JkZXJlZC1jb250YWluZXItZm9yLXBhbmVsc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCBvcmRlcmVkLWNvbnRhaW5lciBpbmRleC1vcmRlcmVkLWNvbnRhaW5lci1mb3ItcGFuZWxzLWNvbHVtblwiPlxuICAgICAgICAgICAgICA8Q29udGludWVTdHVkaWVzUGFuZWwvPlxuICAgICAgICAgICAgICA8V29ya3NwYWNlc1BhbmVsLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCBvcmRlcmVkLWNvbnRhaW5lciBpbmRleC1vcmRlcmVkLWNvbnRhaW5lci1mb3ItcGFuZWxzLWNvbHVtblwiPlxuICAgICAgICAgICAgICA8TGFzdE1lc3NhZ2VzUGFuZWwvPlxuICAgICAgICAgICAgICA8SW1wb3J0YW50UGFuZWwvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IG9yZGVyZWQtY29udGFpbmVyIGluZGV4LW9yZGVyZWQtY29udGFpbmVyLWZvci1wYW5lbHMtY29sdW1uXCI+XG4gICAgICAgICAgICAgIDxBbm5vdW5jZW1lbnRzUGFuZWwvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9TY3JlZW5Db250YWluZXI+XG4gICAgPC9kaXY+KTtcbiAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4uLy4uL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBBbm5vdW5jZW1lbnRzUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1mb3ItcGFuZWxzLXRpdGxlIGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZS1hbm5vdW5jZW1lbnRzXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1hbm5vdW5jZXJcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udFBhZ2UuYW5ub3VuY2VtZW50cycpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAge3RoaXMucHJvcHMuYW5ub3VuY2VtZW50cy5sZW5ndGggIT09IDAgP1xuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IGl0ZW0tbGlzdCBpbmRleC1pdGVtLWxpc3QtcGFuZWwtYW5ub3VuY2VtZW50c1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmFubm91bmNlbWVudHMubWFwKChhbm5vdW5jZW1lbnQpPT57XG4gICAgICAgICAgICByZXR1cm4gPExpbmsga2V5PXthbm5vdW5jZW1lbnQuaWR9IGNsYXNzTmFtZT17YGl0ZW0tbGlzdC1pdGVtICR7YW5ub3VuY2VtZW50LndvcmtzcGFjZXMgPyBcIml0ZW0tbGlzdC1pdGVtLWhhcy13b3Jrc3BhY2VzXCIgOiBcIlwifWB9XG4gICAgICAgICAgICAgIGhyZWY9e2Ake3RoaXMucHJvcHMuc3RhdHVzLmNvbnRleHRQYXRofWxpbmtgfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWFubm91bmNlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dCBpdGVtLWxpc3QtdGV4dC1ib2R5IGl0ZW0tbGlzdC10ZXh0LWJvZHktbXVsdGlsaW5lXCI+XG4gICAgICAgICAgICAgICAge2Fubm91bmNlbWVudC5jYXB0aW9ufVxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1hbm5vdW5jZW1lbnRzLWRhdGVcIj5cbiAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGltZS5mb3JtYXQoYW5ub3VuY2VtZW50LmNyZWF0ZWQpfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj4gIFxuICAgICAgOlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1wYW5lbC1uby1hbm5vdW5jZW1lbnRzXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChcInBsdWdpbi5hbm5vdW5jZXIuZW1wdHkudGl0bGVcIil9PC9kaXY+XG4gICAgICB9XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzLFxuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgYW5ub3VuY2VtZW50czogc3RhdGUuYW5ub3VuY2VtZW50c1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEFubm91bmNlbWVudHNQYW5lbCk7IiwiLy9UT0RPIHBsZWFzZSB0cmFuc2xhdGUgdGhpcy4uLiA+OmNcbi8vWW91IHNlZSB0aG9zZSBsYW5ndWFnZSBzdHJpbmdzLi4uXG5cbmltcG9ydCBMaW5rIGZyb20gJy4uLy4uL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBDb250aW51ZVN0dWRpZXNQYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIGlmICghdGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4pe1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICghdGhpcy5wcm9wcy5sYXN0V29ya3NwYWNlKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCB0ZXh0IGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZSBpbmRleC10ZXh0LWZvci1wYW5lbHMtdGl0bGUtY29udGludWUtc3R1ZGllc1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tcmV2ZXJ0XCI+PC9zcGFuPlxuICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRQYWdlLmxhc3RXb3Jrc3BhY2UuY29udGludWVTdHVkaWVzTGluaycpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGgyIGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1wYW5lbC1jb250aW51ZS1zdHVkaWVzLXdvcmtzcGFjZS1uYW1lXCI+XG4gICAgICAgIHt0aGlzLnByb3BzLmxhc3RXb3Jrc3BhY2Uud29ya3NwYWNlTmFtZX1cbiAgICAgIDwvaDI+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmRleCB0ZXh0IGluZGV4LXRleHQtcGFuZWwtY29udGludWUtc3R1ZGllc1wiPlxuICAgICAgICBPbGl0IHZpbWVrc2kgc2l2dWxsYXtcIiBcIn08Yj48aT57dGhpcy5wcm9wcy5sYXN0V29ya3NwYWNlLm1hdGVyaWFsTmFtZX08L2k+PC9iPntcIiBcIn1cbiAgICAgICAgPExpbmsgaHJlZj17dGhpcy5wcm9wcy5sYXN0V29ya3NwYWNlLnVybH0+SmF0a2Egb3BpbnRvamE8L0xpbms+XG4gICAgICA8L3NwYW4+XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzLFxuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgbGFzdFdvcmtzcGFjZTogc3RhdGUubGFzdFdvcmtzcGFjZVxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKENvbnRpbnVlU3R1ZGllc1BhbmVsKTsiLCIvLzwhLS0gRGlzY3VzcyB3aXRoIE5pbmEgYWJvdXQgaW1wbGVtZW50YXRpb24gb2YgdGhlc2UgLS0+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5kZXggdGV4dCBpbmRleC10ZXh0LWZvci1wYW5lbHMtdGl0bGUgaW5kZXgtdGV4dC1mb3ItcGFuZWxzLXRpdGxlLWltcG9ydGFudFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbiBpY29uLXN0YXJcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4+I3tpMThuLnRleHRbJ3BsdWdpbi5mcm9udFBhZ2UuaW1wb3J0YW50J119PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWNvbnRyb2xsZXItd2lkZ2V0PVwicGFuZWwtaW1wb3J0YW50XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPCEtLSBUaGUgZHVzdCB0ZW1wbGF0ZSwgbm9yIHRoZSBjc3MgY2xhc3NlcyBpbnNpZGUgYXJlIGltcGxlbWVudGVkIC0tPlxuLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG4vL1RPRE8gbm90IGltcGxlbWVudGVkXG4vL29uIHRoZSB0b3AgdGhlIHByZXZpb3VzIHBpZWNlIG9mIGNvZGVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcG9ydGFudFBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi8uLi9nZW5lcmFsL2xpbmsuanN4JztcblxuY2xhc3MgTGFzdE1lc3NhZ2VzUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCB0ZXh0IGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZSBpbmRleC10ZXh0LWZvci1wYW5lbHMtdGl0bGUtbGFzdC1tZXNzYWdlc1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tZW52ZWxvcGVcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udFBhZ2UuY29tbXVuaWNhdG9yLmxhc3RNZXNzYWdlcycpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAge3RoaXMucHJvcHMubGFzdE1lc3NhZ2VzID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IGl0ZW0tbGlzdCBpbmRleC1pdGVtLWxpc3QtcGFuZWwtbGFzdC1tZXNzYWdlc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhc3RNZXNzYWdlcy5tYXAoKG1lc3NhZ2UpPT57XG4gICAgICAgICAgICByZXR1cm4gKDxMaW5rIGtleT17bWVzc2FnZS5pZH0gY2xhc3NOYW1lPXtgaXRlbS1saXN0LWl0ZW0gJHttZXNzYWdlLnVucmVhZE1lc3NhZ2VzSW5UaHJlYWQgPyBcIml0ZW0tbGlzdC1pdGVtLXVucmVhZFwiIDogXCJcIn1gfVxuICAgICAgICAgICAgICAgICAgICBocmVmPXtgL2NvbW11bmljYXRvciNpbmJveC8ke21lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkfWB9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tZW52ZWxvcGUke21lc3NhZ2UudW5yZWFkTWVzc2FnZXNJblRocmVhZCA/IFwiLWFsdFwiIDogXCJcIn1gfT48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQgaXRlbS1saXN0LXRleHQtYm9keSBpdGVtLWxpc3QtdGV4dC1ib2R5LW11bHRpbGluZVwiPlxuICAgICAgICAgICAgICAgIHttZXNzYWdlLmNhcHRpb259XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5kZXggdGV4dCBpbmRleC10ZXh0LWxhc3QtbWVzc2FnZS1kYXRlXCI+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRpbWUuZm9ybWF0KG1lc3NhZ2UuY3JlYXRlZCl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L0xpbms+KTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1wYW5lbC1uby1sYXN0LW1lc3NhZ2VzXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChcInBsdWdpbi5mcm9udFBhZ2UubWVzc2FnZXMubm9NZXNzYWdlc1wiKX08L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgbGFzdE1lc3NhZ2VzOiBzdGF0ZS5sYXN0TWVzc2FnZXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYXN0TWVzc2FnZXNQYW5lbCk7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vLi4vZ2VuZXJhbC9saW5rLmpzeCc7XG5cbmNsYXNzIFdvcmtzcGFjZXNQYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGluZGV4IHBhbmVsXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1mb3ItcGFuZWxzLXRpdGxlIGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZS13b3Jrc3BhY2VzXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1ib29rc1wiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZyb250UGFnZS53b3Jrc3BhY2VzLnRpdGxlJyl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICB7dGhpcy5wcm9wcy53b3Jrc3BhY2VzID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IGl0ZW0tbGlzdCBpbmRleC1pdGVtLWxpc3QtcGFuZWwtd29ya3NwYWNlc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLndvcmtzcGFjZXMubWFwKCh3b3Jrc3BhY2UpPT57XG4gICAgICAgICAgICByZXR1cm4gPExpbmsga2V5PXt3b3Jrc3BhY2UuaWR9IGNsYXNzTmFtZT1cIml0ZW0tbGlzdC1pdGVtXCIgaHJlZj17YC93b3Jrc3BhY2UvJHt3b3Jrc3BhY2UudXJsTmFtZX1gfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWJvb2tzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpdGVtLWxpc3QtdGV4dC1ib2R5IHRleHRcIj5cbiAgICAgICAgICAgICAgICB7YCR7d29ya3NwYWNlLm5hbWV9ICR7d29ya3NwYWNlLm5hbWVFeHRlbnNpb24gPyB3b3Jrc3BhY2UubmFtZUV4dGVuc2lvbiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5kZXggdGV4dCBpbmRleC10ZXh0LXBhbmVsLW5vLXdvcmtzcGFjZXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRQYWdlLndvcmtzcGFjZXMubm9Xb3Jrc3BhY2VzLnBhcnQxJyl9XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udFBhZ2Uud29ya3NwYWNlcy5ub1dvcmtzcGFjZXMuY291cnNlcGlja2VyJyl9XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIHtcIiBcIn17dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRQYWdlLndvcmtzcGFjZXMubm9Xb3Jrc3BhY2VzLnBhcnQyJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgd29ya3NwYWNlczogc3RhdGUud29ya3NwYWNlc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKFdvcmtzcGFjZXNQYW5lbCk7IiwiaW1wb3J0IE5hdmJhciBmcm9tICcuLi9nZW5lcmFsL25hdmJhci5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIE1haW5GdW5jdGlvbk5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYWN0aXZlVHJhaWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gW3tcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJob21lXCIsXG4gICAgICB0cmFpbDogXCJpbmRleFwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ob21lLmhvbWUnLFxuICAgICAgaHJlZjogXCIvXCIsXG4gICAgICBpY29uOiBcImhvbWVcIixcbiAgICAgIGNvbmRpdGlvbjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJjb3Vyc2VwaWNrZXJcIixcbiAgICAgIHRyYWlsOiBcImNvdXJzZXBpY2tlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5jb3Vyc2VwaWNrZXIuY291cnNlcGlja2VyJyxcbiAgICAgIGhyZWY6IFwiL2NvdXJzZXBpY2tlclwiLFxuICAgICAgaWNvbjogXCJib29rc1wiLFxuICAgICAgY29uZGl0aW9uOiB0cnVlXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbW11bmljYXRvclwiLFxuICAgICAgdHJhaWw6IFwiY29tbXVuaWNhdG9yXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmNvbW11bmljYXRvci5jb21tdW5pY2F0b3InLFxuICAgICAgaHJlZjogXCIvY29tbXVuaWNhdG9yXCIsXG4gICAgICBpY29uOiBcImVudmVsb3BlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluLFxuICAgICAgYmFkZ2U6IHRoaXMucHJvcHMuc3RhdHVzLm1lc3NhZ2VDb3VudFxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJkaXNjdXNzaW9uXCIsXG4gICAgICB0cmFpbDogXCJkaXNjdXNzaW9uXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmZvcnVtLmZvcnVtJyxcbiAgICAgIGhyZWY6IFwiL2Rpc2N1c3Npb25cIixcbiAgICAgIGljb246IFwiYnViYmxlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluICYmIHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkZPUlVNX0FDQ0VTU0VOVklST05NRU5URk9SVU1cbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFwiZ3VpZGVyXCIsXG4gICAgICB0cmFpbDogXCJndWlkZXJcIixcbiAgICAgIHRleHQ6ICdwbHVnaW4uZ3VpZGVyLmd1aWRlcicsXG4gICAgICBocmVmOiBcIi9ndWlkZXJcIixcbiAgICAgIGljb246IFwibWVtYmVyc1wiLFxuICAgICAgY29uZGl0aW9uOiB0aGlzLnByb3BzLnN0YXR1cy5wZXJtaXNzaW9ucy5HVUlERVJfVklFV1xuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJyZWNvcmRzXCIsXG4gICAgICB0cmFpbDogXCJyZWNvcmRzXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLnJlY29yZHMucmVjb3JkcycsXG4gICAgICBocmVmOiBcIi9yZWNvcmRzXCIsXG4gICAgICBpY29uOiBcInByb2ZpbGVcIixcbiAgICAgIGNvbmRpdGlvbjogdGhpcy5wcm9wcy5zdGF0dXMucGVybWlzc2lvbnMuVFJBTlNDUklQVF9PRl9SRUNPUkRTX1ZJRVdcbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFwiZXZhbHVhdGlvblwiLFxuICAgICAgdHJhaWw6IFwiZXZhbHVhdGlvblwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ldmFsdWF0aW9uLmV2YWx1YXRpb24nLFxuICAgICAgaHJlZjogXCIvZXZhbHVhdGlvblwiLFxuICAgICAgaWNvbjogXCJldmFsdWF0ZVwiLFxuICAgICAgY29uZGl0aW9uOiB0aGlzLnByb3BzLnN0YXR1cy5wZXJtaXNzaW9ucy5FVkFMVUFUSU9OX1ZJRVdfSU5ERVhcbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFwiYW5ub3VuY2VyXCIsXG4gICAgICB0cmFpbDogXCJhbm5vdW5jZXJcIixcbiAgICAgIHRleHQ6ICdwbHVnaW4uYW5ub3VuY2VyLmFubm91bmNlcicsXG4gICAgICBocmVmOiBcIi9hbm5vdW5jZXJcIixcbiAgICAgIGljb246IFwiYW5ub3VuY2VyXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkFOTk9VTkNFUl9UT09MXG4gICAgfV07XG4gICAgXG4gICAgcmV0dXJuIDxOYXZiYXIgY2xhc3NOYW1lRXh0ZW5zaW9uPVwibWFpbi1mdW5jdGlvblwiIG5hdmJhckl0ZW1zPXtpdGVtRGF0YS5tYXAoKGl0ZW0pPT57XG4gICAgICBpZiAoIWl0ZW0uY29uZGl0aW9uKXtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjbGFzc05hbWVTdWZmaXg6IGl0ZW0uY2xhc3NOYW1lU3VmZml4LFxuICAgICAgICBpdGVtOiAoPExpbmsgaHJlZj17aXRlbS5ocmVmfSBjbGFzc05hbWU9e2BtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1pY29uIGxpbmstZnVsbCAke3RoaXMucHJvcHMuYWN0aXZlVHJhaWwgPT09IGl0ZW0udHJhaWwgPyAnYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChpdGVtLnRleHQpfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0vPlxuICAgICAgICAgIHtpdGVtLmJhZGdlID8gPHNwYW4gY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBpbmRpY2F0b3JcIj57KGl0ZW0uYmFkZ2UgPj0gMTAwID8gXCI5OStcIiA6IGl0ZW0uYmFkZ2UpfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICA8L0xpbms+KVxuICAgICAgfVxuICAgIH0pfSBkZWZhdWx0T3B0aW9ucz17W119IG1lbnVJdGVtcz17aXRlbURhdGEubWFwKChpdGVtKT0+e1xuICAgICAgaWYgKCFpdGVtLmNvbmRpdGlvbil7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDxMaW5rIGhyZWY9e2l0ZW0uaHJlZn0gY2xhc3NOYW1lPXtgbWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSAke3RoaXMucHJvcHMuYWN0aXZlVHJhaWwgPT09IGl0ZW0udHJhaWwgPyAnYWN0aXZlJyA6ICcnfWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0vPlxuICAgICAgICB7aXRlbS5iYWRnZSA/IDxzcGFuIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gaW5kaWNhdG9yXCI+eyhpdGVtLmJhZGdlID49IDEwMCA/IFwiOTkrXCIgOiBpdGVtLmJhZGdlKX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChpdGVtLnRleHQpfVxuICAgICAgPC9MaW5rPlxuICAgIH0pfS8+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuLFxuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzLFxuICAgIG1lc3NhZ2VDb3VudDogc3RhdGUubWVzc2FnZUNvdW50XG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTWFpbkZ1bmN0aW9uTmF2YmFyKTtcbiIsImltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gJy4uL2NvbXBvbmVudHMvYmFzZS9ub3RpZmljYXRpb25zLmpzeCc7XG5pbXBvcnQgQm9keSBmcm9tICcuLi9jb21wb25lbnRzL2luZGV4L2JvZHkuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGlkPVwicm9vdFwiPlxuICAgICAgPE5vdGlmaWNhdGlvbnM+PC9Ob3RpZmljYXRpb25zPlxuICAgICAgPEJvZHk+PC9Cb2R5PlxuICAgIDwvZGl2Pik7XG4gIH1cbn0iLCJpbXBvcnQge2xvZ2dlcn0gZnJvbSAncmVkdXgtbG9nZ2VyJztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQcm92aWRlciwgY29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQge3JlbmRlcn0gZnJvbSAncmVhY3QtZG9tJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuQXBwKHJlZHVjZXIsIEFwcCwgY2FsbGJhY2spe1xuICBsZXQgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUobG9nZ2VyLCB0aHVuaykpO1xuXG4gIHJlbmRlcig8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICA8QXBwLz5cbiAgPC9Qcm92aWRlcj4sIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXBwXCIpKTtcbiAgXG4gIGxldCBuZXdTdG9yZSA9IHtcbiAgICBkaXNwYXRjaChhY3Rpb24pe1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbihzdG9yZS5kaXNwYXRjaCwgc3RvcmUuZ2V0U3RhdGUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICB9LFxuICAgIHN1YnNjcmliZSguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5zdWJzY3JpYmUoLi4uYXJncyk7XG4gICAgfSxcbiAgICBnZXRTdGF0ZSguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5nZXRTdGF0ZSguLi5hcmdzKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWR1Y2VyKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLnJlcGxhY2VSZWR1Y2VyKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuICBcbi8vICBjb25zdCBvQ29ubmVjdCA9IFJlYWN0UmVkdXguY29ubmVjdDtcbi8vICBSZWFjdFJlZHV4LmNvbm5lY3QgPSBmdW5jdGlvbihtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcyl7XG4vLyAgICByZXR1cm4gb0Nvbm5lY3QoKHN0YXRlKT0+e1xuLy8gICAgICBsZXQgdmFsdWUgPSBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpO1xuLy8gICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaCgoa2V5KT0+e1xuLy8gICAgICAgIGlmICh0eXBlb2YgdmFsdWVba2V5XSA9PT0gXCJ1bmRlZmluZWRcIil7XG4vLyAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIHN0YXRlIHZhbHVlIGZvciBrZXkgXCIgKyBrZXkgKyBcIiB5b3UgbW9zdCBsaWtlbHkgZm9yZ290IHRvIGNvbWJpbmUgdGhlIHJlZHVjZXJzIHdpdGhpbiB0aGUgcm9vdCByZWR1Y2VyIGZpbGVcIik7XG4vLyAgICAgICAgfVxuLy8gICAgICB9KTtcbi8vICAgIH0sIG1hcERpc3BhdGNoVG9Qcm9wcyk7XG4vLyAgfVxuICBcbiAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobmV3U3RvcmUpO1xufSIsImltcG9ydCBBcHAgZnJvbSAnLi9jb250YWluZXJzL2luZGV4LmpzeCc7XG5pbXBvcnQgcmVkdWNlciBmcm9tICcuL3JlZHVjZXJzL2luZGV4JztcbmltcG9ydCBydW5BcHAgZnJvbSAnLi9kZWZhdWx0LmRlYnVnLmpzeCc7XG5pbXBvcnQgV2Vic29ja2V0IGZyb20gJy4vdXRpbC93ZWJzb2NrZXQnO1xuXG5pbXBvcnQgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMvbWFpbi1mdW5jdGlvbic7XG5cbnJ1bkFwcChyZWR1Y2VyLCBBcHAsIChzdG9yZSk9PntcbiAgbGV0IHdlYnNvY2tldCA9IG5ldyBXZWJzb2NrZXQoc3RvcmUsIHtcbiAgICBcIkNvbW11bmljYXRvcjpuZXdtZXNzYWdlcmVjZWl2ZWRcIjogW2FjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50XSxcbiAgICBcIkNvbW11bmljYXRvcjptZXNzYWdlcmVhZFwiOiBbYWN0aW9ucy51cGRhdGVNZXNzYWdlQ291bnRdLFxuICAgIFwiQ29tbXVuaWNhdG9yOnRocmVhZGRlbGV0ZWRcIjogW2FjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50XVxuICB9KTtcbiAgc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5tZXNzYWdlQ291bnQudXBkYXRlTWVzc2FnZUNvdW50KCkpO1xuICBzdG9yZS5kaXNwYXRjaChhY3Rpb25zLmFubm91bmNlbWVudHMudXBkYXRlQW5ub3VuY2VtZW50cygpKTtcbiAgc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5sYXN0V29ya3NwYWNlLnVwZGF0ZUxhc3RXb3Jrc3BhY2UoKSk7XG4gIHN0b3JlLmRpc3BhdGNoKGFjdGlvbnMud29ya3NwYWNlcy51cGRhdGVXb3Jrc3BhY2VzKCkpO1xuICBzdG9yZS5kaXNwYXRjaChhY3Rpb25zLmxhc3RNZXNzYWdlcy51cGRhdGVMYXN0TWVzc2FnZXMoNikpO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbiAgdmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaW52YXJpYW50KHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSA9PT0gJ2Z1bmN0aW9uJywgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gJyArICdSZWFjdC5Qcm9wVHlwZXMuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lKTtcbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgJXMgdHlwZTogJXMlcycsIGxvY2F0aW9uLCBlcnJvci5tZXNzYWdlLCBzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzaGltKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgaWYgKHNlY3JldCA9PT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgIC8vIEl0IGlzIHN0aWxsIHNhZmUgd2hlbiBjYWxsZWQgZnJvbSBSZWFjdC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW52YXJpYW50KFxuICAgICAgZmFsc2UsXG4gICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAnVXNlIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICApO1xuICB9O1xuICBzaGltLmlzUmVxdWlyZWQgPSBzaGltO1xuICBmdW5jdGlvbiBnZXRTaGltKCkge1xuICAgIHJldHVybiBzaGltO1xuICB9O1xuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IHNoaW0sXG4gICAgYm9vbDogc2hpbSxcbiAgICBmdW5jOiBzaGltLFxuICAgIG51bWJlcjogc2hpbSxcbiAgICBvYmplY3Q6IHNoaW0sXG4gICAgc3RyaW5nOiBzaGltLFxuICAgIHN5bWJvbDogc2hpbSxcblxuICAgIGFueTogc2hpbSxcbiAgICBhcnJheU9mOiBnZXRTaGltLFxuICAgIGVsZW1lbnQ6IHNoaW0sXG4gICAgaW5zdGFuY2VPZjogZ2V0U2hpbSxcbiAgICBub2RlOiBzaGltLFxuICAgIG9iamVjdE9mOiBnZXRTaGltLFxuICAgIG9uZU9mOiBnZXRTaGltLFxuICAgIG9uZU9mVHlwZTogZ2V0U2hpbSxcbiAgICBzaGFwZTogZ2V0U2hpbVxuICB9O1xuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gZW1wdHlGdW5jdGlvbjtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vY2hlY2tQcm9wVHlwZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAvKiBnbG9iYWwgU3ltYm9sICovXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIG1ldGhvZCBmdW5jdGlvbiBjb250YWluZWQgb24gdGhlIGl0ZXJhYmxlIG9iamVjdC5cbiAgICpcbiAgICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gICAqXG4gICAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gICAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgKiAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobXlJdGVyYWJsZSk7XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICAgKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICAgKlxuICAgKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gICAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gICAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAgICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAgICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICAgKiAgICAgfSxcbiAgICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAgICpcbiAgICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gICAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICAgKlxuICAgKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gICAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAgICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICAgKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICogICAgICAgICAgKTtcbiAgICogICAgICAgIH1cbiAgICogICAgICB9XG4gICAqICAgIH0sXG4gICAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICAgKiAgfSk7XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICB2YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJXMgYXQgaW5kZXggJXMuJyxcbiAgICAgICAgICBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlciksXG4gICAgICAgICAgaVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9ICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmXG4gICAgU3ltYm9sLmZvciAmJlxuICAgIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSkgfHxcbiAgICAweGVhYzc7XG5cbiAgdmFyIGlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICBvYmplY3QgIT09IG51bGwgJiZcbiAgICAgIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICB9O1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5yZWR1eExvZ2dlcj1lLnJlZHV4TG9nZ2VyfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Uuc3VwZXJfPXQsZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmUsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSl9ZnVuY3Rpb24gcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwia2luZFwiLHt2YWx1ZTplLGVudW1lcmFibGU6ITB9KSx0JiZ0Lmxlbmd0aCYmT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJwYXRoXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG4oZSx0LHIpe24uc3VwZXJfLmNhbGwodGhpcyxcIkVcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInJoc1wiLHt2YWx1ZTpyLGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBvKGUsdCl7by5zdXBlcl8uY2FsbCh0aGlzLFwiTlwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGkoZSx0KXtpLnN1cGVyXy5jYWxsKHRoaXMsXCJEXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJsaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gYShlLHQscil7YS5zdXBlcl8uY2FsbCh0aGlzLFwiQVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaW5kZXhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpdGVtXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGYoZSx0LHIpe3ZhciBuPWUuc2xpY2UoKHJ8fHQpKzF8fGUubGVuZ3RoKTtyZXR1cm4gZS5sZW5ndGg9dDwwP2UubGVuZ3RoK3Q6dCxlLnB1c2guYXBwbHkoZSxuKSxlfWZ1bmN0aW9uIHUoZSl7dmFyIHQ9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpO3JldHVyblwib2JqZWN0XCIhPT10P3Q6ZT09PU1hdGg/XCJtYXRoXCI6bnVsbD09PWU/XCJudWxsXCI6QXJyYXkuaXNBcnJheShlKT9cImFycmF5XCI6XCJbb2JqZWN0IERhdGVdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSk/XCJkYXRlXCI6XCJmdW5jdGlvblwiPT10eXBlb2YgZS50b1N0cmluZyYmL15cXC8uKlxcLy8udGVzdChlLnRvU3RyaW5nKCkpP1wicmVnZXhwXCI6XCJvYmplY3RcIn1mdW5jdGlvbiBsKGUsdCxyLGMscyxkLHApe3M9c3x8W10scD1wfHxbXTt2YXIgZz1zLnNsaWNlKDApO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkKXtpZihjKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBjJiZjKGcsZCkpcmV0dXJuO2lmKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGM/XCJ1bmRlZmluZWRcIjpOKGMpKSl7aWYoYy5wcmVmaWx0ZXImJmMucHJlZmlsdGVyKGcsZCkpcmV0dXJuO2lmKGMubm9ybWFsaXplKXt2YXIgaD1jLm5vcm1hbGl6ZShnLGQsZSx0KTtoJiYoZT1oWzBdLHQ9aFsxXSl9fX1nLnB1c2goZCl9XCJyZWdleHBcIj09PXUoZSkmJlwicmVnZXhwXCI9PT11KHQpJiYoZT1lLnRvU3RyaW5nKCksdD10LnRvU3RyaW5nKCkpO3ZhciB5PVwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6TihlKSx2PVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6Tih0KSxiPVwidW5kZWZpbmVkXCIhPT15fHxwJiZwW3AubGVuZ3RoLTFdLmxocyYmcFtwLmxlbmd0aC0xXS5saHMuaGFzT3duUHJvcGVydHkoZCksbT1cInVuZGVmaW5lZFwiIT09dnx8cCYmcFtwLmxlbmd0aC0xXS5yaHMmJnBbcC5sZW5ndGgtMV0ucmhzLmhhc093blByb3BlcnR5KGQpO2lmKCFiJiZtKXIobmV3IG8oZyx0KSk7ZWxzZSBpZighbSYmYilyKG5ldyBpKGcsZSkpO2Vsc2UgaWYodShlKSE9PXUodCkpcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJkYXRlXCI9PT11KGUpJiZlLXQhPT0wKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwib2JqZWN0XCI9PT15JiZudWxsIT09ZSYmbnVsbCE9PXQpaWYocC5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHQubGhzPT09ZX0pLmxlbmd0aCllIT09dCYmcihuZXcgbihnLGUsdCkpO2Vsc2V7aWYocC5wdXNoKHtsaHM6ZSxyaHM6dH0pLEFycmF5LmlzQXJyYXkoZSkpe3ZhciB3O2UubGVuZ3RoO2Zvcih3PTA7dzxlLmxlbmd0aDt3Kyspdz49dC5sZW5ndGg/cihuZXcgYShnLHcsbmV3IGkodm9pZCAwLGVbd10pKSk6bChlW3ddLHRbd10scixjLGcsdyxwKTtmb3IoO3c8dC5sZW5ndGg7KXIobmV3IGEoZyx3LG5ldyBvKHZvaWQgMCx0W3crK10pKSl9ZWxzZXt2YXIgeD1PYmplY3Qua2V5cyhlKSxTPU9iamVjdC5rZXlzKHQpO3guZm9yRWFjaChmdW5jdGlvbihuLG8pe3ZhciBpPVMuaW5kZXhPZihuKTtpPj0wPyhsKGVbbl0sdFtuXSxyLGMsZyxuLHApLFM9ZihTLGkpKTpsKGVbbl0sdm9pZCAwLHIsYyxnLG4scCl9KSxTLmZvckVhY2goZnVuY3Rpb24oZSl7bCh2b2lkIDAsdFtlXSxyLGMsZyxlLHApfSl9cC5sZW5ndGg9cC5sZW5ndGgtMX1lbHNlIGUhPT10JiYoXCJudW1iZXJcIj09PXkmJmlzTmFOKGUpJiZpc05hTih0KXx8cihuZXcgbihnLGUsdCkpKX1mdW5jdGlvbiBjKGUsdCxyLG4pe3JldHVybiBuPW58fFtdLGwoZSx0LGZ1bmN0aW9uKGUpe2UmJm4ucHVzaChlKX0sciksbi5sZW5ndGg/bjp2b2lkIDB9ZnVuY3Rpb24gcyhlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBvW3IucGF0aFtuXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpvW3IucGF0aFtuXV09ci5yaHN9fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmU9ZihlLHQpO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6ZVt0XT1yLnJoc31yZXR1cm4gZX1mdW5jdGlvbiBkKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe2Zvcih2YXIgbj1lLG89LTEsaT1yLnBhdGg/ci5wYXRoLmxlbmd0aC0xOjA7KytvPGk7KVwidW5kZWZpbmVkXCI9PXR5cGVvZiBuW3IucGF0aFtvXV0mJihuW3IucGF0aFtvXV09XCJudW1iZXJcIj09dHlwZW9mIHIucGF0aFtvXT9bXTp7fSksbj1uW3IucGF0aFtvXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoci5wYXRoP25bci5wYXRoW29dXTpuLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG5bci5wYXRoW29dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm5bci5wYXRoW29dXT1yLnJoc319fWZ1bmN0aW9uIHAoZSx0LHIpe2lmKHIucGF0aCYmci5wYXRoLmxlbmd0aCl7dmFyIG4sbz1lW3RdLGk9ci5wYXRoLmxlbmd0aC0xO2ZvcihuPTA7bjxpO24rKylvPW9bci5wYXRoW25dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChvW3IucGF0aFtuXV0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpvW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiRVwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIG9bci5wYXRoW25dXX19ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZVt0XT1yLmxoczticmVhaztjYXNlXCJFXCI6ZVt0XT1yLmxoczticmVhaztjYXNlXCJOXCI6ZT1mKGUsdCl9cmV0dXJuIGV9ZnVuY3Rpb24gZyhlLHQscil7aWYoZSYmdCYmciYmci5raW5kKXt2YXIgbixvLGk9ZTtmb3Iobz1yLnBhdGgubGVuZ3RoLTEsbj0wO248bztuKyspXCJ1bmRlZmluZWRcIj09dHlwZW9mIGlbci5wYXRoW25dXSYmKGlbci5wYXRoW25dXT17fSksaT1pW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoaVtyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6aVtyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIkVcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBpW3IucGF0aFtuXV19fX1mdW5jdGlvbiBoKGUsdCxyKXtpZihlJiZ0KXt2YXIgbj1mdW5jdGlvbihuKXtyJiYhcihlLHQsbil8fGQoZSx0LG4pfTtsKGUsdCxuKX19ZnVuY3Rpb24geShlKXtyZXR1cm5cImNvbG9yOiBcIitGW2VdLmNvbG9yK1wiOyBmb250LXdlaWdodDogYm9sZFwifWZ1bmN0aW9uIHYoZSl7dmFyIHQ9ZS5raW5kLHI9ZS5wYXRoLG49ZS5saHMsbz1lLnJocyxpPWUuaW5kZXgsYT1lLml0ZW07c3dpdGNoKHQpe2Nhc2VcIkVcIjpyZXR1cm5bci5qb2luKFwiLlwiKSxuLFwi4oaSXCIsb107Y2FzZVwiTlwiOnJldHVybltyLmpvaW4oXCIuXCIpLG9dO2Nhc2VcIkRcIjpyZXR1cm5bci5qb2luKFwiLlwiKV07Y2FzZVwiQVwiOnJldHVybltyLmpvaW4oXCIuXCIpK1wiW1wiK2krXCJdXCIsYV07ZGVmYXVsdDpyZXR1cm5bXX19ZnVuY3Rpb24gYihlLHQscixuKXt2YXIgbz1jKGUsdCk7dHJ5e24/ci5ncm91cENvbGxhcHNlZChcImRpZmZcIik6ci5ncm91cChcImRpZmZcIil9Y2F0Y2goZSl7ci5sb2coXCJkaWZmXCIpfW8/by5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWUua2luZCxuPXYoZSk7ci5sb2cuYXBwbHkocixbXCIlYyBcIitGW3RdLnRleHQseSh0KV0uY29uY2F0KFAobikpKX0pOnIubG9nKFwi4oCU4oCUIG5vIGRpZmYg4oCU4oCUXCIpO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgZGlmZiBlbmQg4oCU4oCUIFwiKX19ZnVuY3Rpb24gbShlLHQscixuKXtzd2l0Y2goXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpKXtjYXNlXCJvYmplY3RcIjpyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlW25dP2Vbbl0uYXBwbHkoZSxQKHIpKTplW25dO2Nhc2VcImZ1bmN0aW9uXCI6cmV0dXJuIGUodCk7ZGVmYXVsdDpyZXR1cm4gZX19ZnVuY3Rpb24gdyhlKXt2YXIgdD1lLnRpbWVzdGFtcCxyPWUuZHVyYXRpb247cmV0dXJuIGZ1bmN0aW9uKGUsbixvKXt2YXIgaT1bXCJhY3Rpb25cIl07cmV0dXJuIGkucHVzaChcIiVjXCIrU3RyaW5nKGUudHlwZSkpLHQmJmkucHVzaChcIiVjQCBcIituKSxyJiZpLnB1c2goXCIlYyhpbiBcIitvLnRvRml4ZWQoMikrXCIgbXMpXCIpLGkuam9pbihcIiBcIil9fWZ1bmN0aW9uIHgoZSx0KXt2YXIgcj10LmxvZ2dlcixuPXQuYWN0aW9uVHJhbnNmb3JtZXIsbz10LnRpdGxlRm9ybWF0dGVyLGk9dm9pZCAwPT09bz93KHQpOm8sYT10LmNvbGxhcHNlZCxmPXQuY29sb3JzLHU9dC5sZXZlbCxsPXQuZGlmZixjPVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0LnRpdGxlRm9ybWF0dGVyO2UuZm9yRWFjaChmdW5jdGlvbihvLHMpe3ZhciBkPW8uc3RhcnRlZCxwPW8uc3RhcnRlZFRpbWUsZz1vLmFjdGlvbixoPW8ucHJldlN0YXRlLHk9by5lcnJvcix2PW8udG9vayx3PW8ubmV4dFN0YXRlLHg9ZVtzKzFdO3gmJih3PXgucHJldlN0YXRlLHY9eC5zdGFydGVkLWQpO3ZhciBTPW4oZyksaz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBhP2EoZnVuY3Rpb24oKXtyZXR1cm4gd30sZyxvKTphLGo9RChwKSxFPWYudGl0bGU/XCJjb2xvcjogXCIrZi50aXRsZShTKStcIjtcIjpcIlwiLEE9W1wiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiXTtBLnB1c2goRSksdC50aW1lc3RhbXAmJkEucHVzaChcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIiksdC5kdXJhdGlvbiYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKTt2YXIgTz1pKFMsaix2KTt0cnl7az9mLnRpdGxlJiZjP3IuZ3JvdXBDb2xsYXBzZWQuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXBDb2xsYXBzZWQoTyk6Zi50aXRsZSYmYz9yLmdyb3VwLmFwcGx5KHIsW1wiJWMgXCIrT10uY29uY2F0KEEpKTpyLmdyb3VwKE8pfWNhdGNoKGUpe3IubG9nKE8pfXZhciBOPW0odSxTLFtoXSxcInByZXZTdGF0ZVwiKSxQPW0odSxTLFtTXSxcImFjdGlvblwiKSxDPW0odSxTLFt5LGhdLFwiZXJyb3JcIiksRj1tKHUsUyxbd10sXCJuZXh0U3RhdGVcIik7aWYoTilpZihmLnByZXZTdGF0ZSl7dmFyIEw9XCJjb2xvcjogXCIrZi5wcmV2U3RhdGUoaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltOXShcIiVjIHByZXYgc3RhdGVcIixMLGgpfWVsc2UgcltOXShcInByZXYgc3RhdGVcIixoKTtpZihQKWlmKGYuYWN0aW9uKXt2YXIgVD1cImNvbG9yOiBcIitmLmFjdGlvbihTKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW1BdKFwiJWMgYWN0aW9uICAgIFwiLFQsUyl9ZWxzZSByW1BdKFwiYWN0aW9uICAgIFwiLFMpO2lmKHkmJkMpaWYoZi5lcnJvcil7dmFyIE09XCJjb2xvcjogXCIrZi5lcnJvcih5LGgpK1wiOyBmb250LXdlaWdodDogYm9sZDtcIjtyW0NdKFwiJWMgZXJyb3IgICAgIFwiLE0seSl9ZWxzZSByW0NdKFwiZXJyb3IgICAgIFwiLHkpO2lmKEYpaWYoZi5uZXh0U3RhdGUpe3ZhciBfPVwiY29sb3I6IFwiK2YubmV4dFN0YXRlKHcpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbRl0oXCIlYyBuZXh0IHN0YXRlXCIsXyx3KX1lbHNlIHJbRl0oXCJuZXh0IHN0YXRlXCIsdyk7bCYmYihoLHcscixrKTt0cnl7ci5ncm91cEVuZCgpfWNhdGNoKGUpe3IubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpfX0pfWZ1bmN0aW9uIFMoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sdD1PYmplY3QuYXNzaWduKHt9LEwsZSkscj10LmxvZ2dlcixuPXQuc3RhdGVUcmFuc2Zvcm1lcixvPXQuZXJyb3JUcmFuc2Zvcm1lcixpPXQucHJlZGljYXRlLGE9dC5sb2dFcnJvcnMsZj10LmRpZmZQcmVkaWNhdGU7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHIpcmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTtpZihlLmdldFN0YXRlJiZlLmRpc3BhdGNoKXJldHVybiBjb25zb2xlLmVycm9yKFwiW3JlZHV4LWxvZ2dlcl0gcmVkdXgtbG9nZ2VyIG5vdCBpbnN0YWxsZWQuIE1ha2Ugc3VyZSB0byBwYXNzIGxvZ2dlciBpbnN0YW5jZSBhcyBtaWRkbGV3YXJlOlxcbi8vIExvZ2dlciB3aXRoIGRlZmF1bHQgb3B0aW9uc1xcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcbi8vIE9yIHlvdSBjYW4gY3JlYXRlIHlvdXIgb3duIGxvZ2dlciB3aXRoIGN1c3RvbSBvcHRpb25zIGh0dHA6Ly9iaXQubHkvcmVkdXgtbG9nZ2VyLW9wdGlvbnNcXG5pbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBsb2dnZXIgPSBjcmVhdGVMb2dnZXIoe1xcbiAgLy8gLi4ub3B0aW9uc1xcbn0pO1xcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoXFxuICByZWR1Y2VyLFxcbiAgYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcilcXG4pXFxuXCIpLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTt2YXIgdT1bXTtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIHI9ZS5nZXRTdGF0ZTtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKGwpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGkmJiFpKHIsbCkpcmV0dXJuIGUobCk7dmFyIGM9e307dS5wdXNoKGMpLGMuc3RhcnRlZD1PLm5vdygpLGMuc3RhcnRlZFRpbWU9bmV3IERhdGUsYy5wcmV2U3RhdGU9bihyKCkpLGMuYWN0aW9uPWw7dmFyIHM9dm9pZCAwO2lmKGEpdHJ5e3M9ZShsKX1jYXRjaChlKXtjLmVycm9yPW8oZSl9ZWxzZSBzPWUobCk7Yy50b29rPU8ubm93KCktYy5zdGFydGVkLGMubmV4dFN0YXRlPW4ocigpKTt2YXIgZD10LmRpZmYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGY/ZihyLGwpOnQuZGlmZjtpZih4KHUsT2JqZWN0LmFzc2lnbih7fSx0LHtkaWZmOmR9KSksdS5sZW5ndGg9MCxjLmVycm9yKXRocm93IGMuZXJyb3I7cmV0dXJuIHN9fX19dmFyIGssaixFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIG5ldyBBcnJheSh0KzEpLmpvaW4oZSl9LEE9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gRShcIjBcIix0LWUudG9TdHJpbmcoKS5sZW5ndGgpK2V9LEQ9ZnVuY3Rpb24oZSl7cmV0dXJuIEEoZS5nZXRIb3VycygpLDIpK1wiOlwiK0EoZS5nZXRNaW51dGVzKCksMikrXCI6XCIrQShlLmdldFNlY29uZHMoKSwyKStcIi5cIitBKGUuZ2V0TWlsbGlzZWNvbmRzKCksMyl9LE89XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHBlcmZvcm1hbmNlJiZudWxsIT09cGVyZm9ybWFuY2UmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHBlcmZvcm1hbmNlLm5vdz9wZXJmb3JtYW5jZTpEYXRlLE49XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX0sUD1mdW5jdGlvbihlKXtpZihBcnJheS5pc0FycmF5KGUpKXtmb3IodmFyIHQ9MCxyPUFycmF5KGUubGVuZ3RoKTt0PGUubGVuZ3RoO3QrKylyW3RdPWVbdF07cmV0dXJuIHJ9cmV0dXJuIEFycmF5LmZyb20oZSl9LEM9W107az1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBnbG9iYWw/XCJ1bmRlZmluZWRcIjpOKGdsb2JhbCkpJiZnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9LGo9ay5EZWVwRGlmZixqJiZDLnB1c2goZnVuY3Rpb24oKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgaiYmay5EZWVwRGlmZj09PWMmJihrLkRlZXBEaWZmPWosaj12b2lkIDApfSksdChuLHIpLHQobyxyKSx0KGksciksdChhLHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGMse2RpZmY6e3ZhbHVlOmMsZW51bWVyYWJsZTohMH0sb2JzZXJ2YWJsZURpZmY6e3ZhbHVlOmwsZW51bWVyYWJsZTohMH0sYXBwbHlEaWZmOnt2YWx1ZTpoLGVudW1lcmFibGU6ITB9LGFwcGx5Q2hhbmdlOnt2YWx1ZTpkLGVudW1lcmFibGU6ITB9LHJldmVydENoYW5nZTp7dmFsdWU6ZyxlbnVtZXJhYmxlOiEwfSxpc0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBqfSxlbnVtZXJhYmxlOiEwfSxub0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBDJiYoQy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UoKX0pLEM9bnVsbCksY30sZW51bWVyYWJsZTohMH19KTt2YXIgRj17RTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkNIQU5HRUQ6XCJ9LE46e2NvbG9yOlwiIzRDQUY1MFwiLHRleHQ6XCJBRERFRDpcIn0sRDp7Y29sb3I6XCIjRjQ0MzM2XCIsdGV4dDpcIkRFTEVURUQ6XCJ9LEE6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJBUlJBWTpcIn19LEw9e2xldmVsOlwibG9nXCIsbG9nZ2VyOmNvbnNvbGUsbG9nRXJyb3JzOiEwLGNvbGxhcHNlZDp2b2lkIDAscHJlZGljYXRlOnZvaWQgMCxkdXJhdGlvbjohMSx0aW1lc3RhbXA6ITAsc3RhdGVUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sYWN0aW9uVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGVycm9yVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGNvbG9yczp7dGl0bGU6ZnVuY3Rpb24oKXtyZXR1cm5cImluaGVyaXRcIn0scHJldlN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjOUU5RTlFXCJ9LGFjdGlvbjpmdW5jdGlvbigpe3JldHVyblwiIzAzQTlGNFwifSxuZXh0U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM0Q0FGNTBcIn0sZXJyb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIiNGMjA0MDRcIn19LGRpZmY6ITEsZGlmZlByZWRpY2F0ZTp2b2lkIDAsdHJhbnNmb3JtZXI6dm9pZCAwfSxUPWZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9ZS5kaXNwYXRjaCxyPWUuZ2V0U3RhdGU7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2Ygcj9TKCkoe2Rpc3BhdGNoOnQsZ2V0U3RhdGU6cn0pOnZvaWQgY29uc29sZS5lcnJvcihcIlxcbltyZWR1eC1sb2dnZXIgdjNdIEJSRUFLSU5HIENIQU5HRVxcbltyZWR1eC1sb2dnZXIgdjNdIFNpbmNlIDMuMC4wIHJlZHV4LWxvZ2dlciBleHBvcnRzIGJ5IGRlZmF1bHQgbG9nZ2VyIHdpdGggZGVmYXVsdCBzZXR0aW5ncy5cXG5bcmVkdXgtbG9nZ2VyIHYzXSBDaGFuZ2VcXG5bcmVkdXgtbG9nZ2VyIHYzXSBpbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5bcmVkdXgtbG9nZ2VyIHYzXSB0b1xcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5cIil9O2UuZGVmYXVsdHM9TCxlLmNyZWF0ZUxvZ2dlcj1TLGUubG9nZ2VyPVQsZS5kZWZhdWx0PVQsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGkxOG4oc3RhdGU9e1xuICB0ZXh0OiB7XG4gICAgZ2V0KGtleSwgLi4uYXJncyl7XG4gICAgICBsZXQgdGV4dCA9IGdldExvY2FsZVRleHQoa2V5LCBhcmdzKTtcbiAgICAgIGlmICh0ZXh0KXtcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfSxcbiAgdGltZToge1xuICAgIGZvcm1hdChkYXRlPW5ldyBEYXRlKCksIGZvcm1hdD1cIkxcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9LFxuICAgIGZyb21Ob3coZGF0ZT1uZXcgRGF0ZSgpKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZyb21Ob3coKTtcbiAgICB9LFxuICAgIHN1YnRyYWN0KGRhdGU9bmV3IERhdGUoKSwgaW5wdXQ9MSwgdmFsdWU9XCJkYXlzXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuc3VidHJhY3QoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH0sXG4gICAgYWRkKGRhdGU9bmV3IERhdGUoKSwgaW5wdXQ9MSwgdmFsdWU9XCJkYXlzXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuYWRkKGlucHV0LCB2YWx1ZSkuY2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cbn0sIGFjdGlvbil7XG4gIHJldHVybiBzdGF0ZTtcbn0iLCIvL1RPRE8gdGhpcyByZWR1Y2VyIHVzZXMgdGhlIGFwaSB0aGF0IGludGVyYWN0cyB3aXRoIHRoZSBET00gaW4gb3JkZXIgdG9cbi8vcmV0cmlldmUgZGF0YSwgcGxlYXNlIGZpeCBpbiBuZXh0IHZlcnNpb25zXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZXMoc3RhdGU9e1xuICBhdmFsaWFibGU6ICQubWFrZUFycmF5KCQoXCIjbGFuZ3VhZ2UtcGlja2VyIGFcIikubWFwKChpbmRleCwgZWxlbWVudCk9PntcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJChlbGVtZW50KS50ZXh0KCkudHJpbSgpLFxuICAgICAgbG9jYWxlOiAkKGVsZW1lbnQpLmRhdGEoJ2xvY2FsZScpXG4gICAgfVxuICB9KSksXG4gIGN1cnJlbnQ6ICQoXCIjbG9jYWxlXCIpLnRleHQoKVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0xPQ0FMRScpe1xuICAgIC8vVE9ETyBGb3Igc29tZSByZWFzb24gdGhpcyBkb2Vzbid0IHdhbnQgdG8gd29yaywgdGhpcyByZWR1Y2VyIG5lZWRzIHVyZ2VudCBmaXhcbiAgICAkKCcjbGFuZ3VhZ2UtcGlja2VyIGFbZGF0YS1sb2NhbGU9XCInICsgYWN0aW9uLnBheWxvYWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtjdXJyZW50OiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RpZmljYXRpb25zKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBRERfTk9USUZJQ0FUSU9OJykge1xuICAgIHZhciBpZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHN0YXRlLmNvbmNhdChPYmplY3QuYXNzaWduKHtpZDogaWR9LCBhY3Rpb24ucGF5bG9hZCkpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnSElERV9OT1RJRklDQVRJT04nKSB7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiBlbGVtZW50LmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiLy9UaGlzIG9uZSBhbHNvIHVzZXMgYSBoYWNrIHRvIGFjY2VzcyB0aGUgZGF0YSBpbiB0aGUgZG9tXG4vL3BsZWFzZSByZXBsYWNlIGl0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9jZWR1cmVcbi8vMS4gQ3JlYXRlIGEgcmVzdCBlbmRwb2ludCB0byBnZXQgdGhlIHBlcm1pc3Npb25zIGxpc3Rcbi8vMi4gaW4gdGhlIG1haW4gZmlsZSBnYXRoZXIgdGhvc2UgcGVybWlzc2lvbnMuLi4gZXRjLi4uLCBlZy4gaW5kZXguanMgbWFrZSBhIGNhbGxcbi8vMy4gZGlzcGF0Y2ggdGhlIGFjdGlvbiB0byB0aGlzIHNhbWUgcmVkdWNlciBhbmQgZ2F0aGVyIHRoZSBhY3Rpb24gaGVyZVxuLy80LiBpdCB3b3JrcyA6RFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGF0dXMoc3RhdGU9e1xuICBsb2dnZWRJbjogISFNVUlLS1VfTE9HR0VEX1VTRVJfSUQsXG4gIHVzZXJJZDogTVVJS0tVX0xPR0dFRF9VU0VSX0lELFxuICBwZXJtaXNzaW9uczogTVVJS0tVX1BFUk1JU1NJT05TLFxuICBjb250ZXh0UGF0aDogQ09OVEVYVFBBVEhcbn0sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gXCJMT0dPVVRcIil7XG4gICAgJCgnI2xvZ291dCcpLmNsaWNrKCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJpbXBvcnQgbm90aWZpY2F0aW9ucyBmcm9tICcuL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgbG9jYWxlcyBmcm9tICcuL2Jhc2UvbG9jYWxlcyc7XG5pbXBvcnQgc3RhdHVzIGZyb20gJy4vYmFzZS9zdGF0dXMnO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi9iYXNlL2kxOG4nO1xuaW1wb3J0IHdlYnNvY2tldCBmcm9tICcuL3V0aWwvd2Vic29ja2V0JztcbmltcG9ydCBtZXNzYWdlQ291bnQgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL21lc3NhZ2UtY291bnQnO1xuaW1wb3J0IGFubm91bmNlbWVudHMgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL2Fubm91bmNlbWVudHMnO1xuaW1wb3J0IGxhc3RXb3Jrc3BhY2UgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL2xhc3Qtd29ya3NwYWNlJztcbmltcG9ydCBsYXN0TWVzc2FnZXMgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL2xhc3QtbWVzc2FnZXMnO1xuaW1wb3J0IHdvcmtzcGFjZXMgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL3dvcmtzcGFjZXMnO1xuXG5pbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnO1xuXG5leHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICBub3RpZmljYXRpb25zLFxuICBpMThuLFxuICBsb2NhbGVzLFxuICBzdGF0dXMsXG4gIHdlYnNvY2tldCxcbiAgYW5ub3VuY2VtZW50cyxcbiAgbGFzdFdvcmtzcGFjZSxcbiAgd29ya3NwYWNlcyxcbiAgbGFzdE1lc3NhZ2VzXG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbm5vdW5jZW1lbnRzKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdVUERBVEVfQU5OT1VOQ0VNRU5UUycpe1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGFzdE1lc3NhZ2VzKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdVUERBVEVfTEFTVF9NRVNTQUdFUycpe1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYW5ub3VuY2VtZW50cyhzdGF0ZT1udWxsLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdVUERBVEVfTEFTVF9XT1JLU1BBQ0UnKXtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lc3NhZ2VDb3VudChzdGF0ZT0wLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09IFwiVVBEQVRFX01FU1NBR0VfQ09VTlRcIil7XG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3b3Jrc3BhY2VzKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdVUERBVEVfV09SS1NQQUNFUycpe1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2Vic29ja2V0KHN0YXRlPXtcbiAgY29ubmVjdGVkOiBmYWxzZVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBcIldFQlNPQ0tFVF9FVkVOVFwiICYmIGFjdGlvbi5wYXlsb2FkLmV2ZW50ID09PSBcIndlYlNvY2tldENvbm5lY3RlZFwiKXtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtjb25uZWN0ZWQ6IHRydWV9KTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gXCJXRUJTT0NLRVRfRVZFTlRcIiAmJiBhY3Rpb24ucGF5bG9hZC5ldmVudCA9PT0gXCJ3ZWJTb2NrZXREaXNjb25uZWN0ZWRcIil7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7Y29ubmVjdGVkOiBmYWxzZX0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11aWtrdVdlYnNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKHN0b3JlLCBsaXN0ZW5lcnM9W10sIG9wdGlvbnM9e1xuICAgIHJlY29ubmVjdEludGVydmFsOiAyMDAsXG4gICAgcGluZ1RpbWVTdGVwOiAxMDAwLFxuICAgIHBpbmdUaW1lb3V0OiAxMDAwMFxuICB9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmxpc3RlbmVycyA9IGxpc3RlbmVycztcbiAgICBcbiAgICB0aGlzLnRpY2tldCA9IG51bGw7XG4gICAgdGhpcy53ZWJTb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuc29ja2V0T3BlbiA9IGZhbHNlO1xuICAgIHRoaXMubWVzc2FnZXNQZW5kaW5nID0gW107XG4gICAgdGhpcy5waW5nSGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICBcbiAgICB0aGlzLmdldFRpY2tldCgodGlja2V0KT0+IHtcbiAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICB0aGlzLm9wZW5XZWJTb2NrZXQoKTtcbiAgICAgICAgdGhpcy5zdGFydFBpbmdpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGJlY2F1c2UgdGlja2V0IHdhcyBtaXNzaW5nXCIsICdlcnJvcicpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbihcImJlZm9yZXVubG9hZFwiLCB0aGlzLm9uQmVmb3JlV2luZG93VW5sb2FkLmJpbmQodGhpcykpO1xuICB9XG4gIHNlbmRNZXNzYWdlKGV2ZW50VHlwZSwgZGF0YSl7XG4gICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICBldmVudFR5cGUsXG4gICAgICBkYXRhXG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnNvY2tldE9wZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMud2ViU29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZy5wdXNoKHtcbiAgICAgICAgICBldmVudFR5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZy5wdXNoKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuICBcbiAgdHJpZ2dlcihldmVudCwgZGF0YT1udWxsKXtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICd0eXBlJzogJ1dFQlNPQ0tFVF9FVkVOVCcsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGRhdGFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBpZiAodGhpcy5saXN0ZW5lcnNbZXZlbnRdKXtcbiAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudF07XG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgbGlzdGVuZXJzKGRhdGEpO1xuICAgICAgfVxuICAgICAgZm9yIChhY3Rpb24gb2YgbGlzdGVuZXJzKXtcbiAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24oKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRUaWNrZXQoY2FsbGJhY2spIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHRoaXMudGlja2V0KSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYSB0aWNrZXQsIHNvIHdlIG5lZWQgdG8gdmFsaWRhdGUgaXQgYmVmb3JlIHVzaW5nIGl0XG4gICAgICAgIG1BcGkoKS53ZWJzb2NrZXQuY2FjaGVDbGVhcigpLnRpY2tldC5jaGVjay5yZWFkKHRoaXMudGlja2V0KS5jYWxsYmFjaygkLnByb3h5KGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgLy8gVGlja2V0IGRpZCBub3QgcGFzcyB2YWxpZGF0aW9uLCBzbyB3ZSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGlja2V0KCQucHJveHkoZnVuY3Rpb24gKHRpY2tldCkge1xuICAgICAgICAgICAgICB0aGlzLnRpY2tldCA9IHRpY2tldDtcbiAgICAgICAgICAgICAgY2FsbGJhY2sodGlja2V0KTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGlja2V0IHBhc3NlZCB2YWxpZGF0aW9uLCBzbyB3ZSB1c2UgaXRcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMudGlja2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgdGlja2V0XG4gICAgICAgIHRoaXMuY3JlYXRlVGlja2V0KCh0aWNrZXQpPT57XG4gICAgICAgICAgdGhpcy50aWNrZXQgPSB0aWNrZXQ7XG4gICAgICAgICAgY2FsbGJhY2sodGlja2V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJUaWNrZXQgY3JlYXRpb24gZmFpbGVkIG9uIGFuIGludGVybmFsIGVycm9yXCIsICdlcnJvcicpKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNyZWF0ZVRpY2tldChjYWxsYmFjaykge1xuICAgIG1BcGkoKS53ZWJzb2NrZXQudGlja2V0LmNyZWF0ZSgpXG4gICAgICAuY2FsbGJhY2soKGVyciwgdGlja2V0KT0+e1xuICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgIGNhbGxiYWNrKHRpY2tldC50aWNrZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IGNyZWF0ZSBXZWJTb2NrZXQgdGlja2V0XCIsICdlcnJvcicpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0Q29ubmVjdGVkKCkge1xuICAgIHRoaXMuc29ja2V0T3BlbiA9IHRydWU7XG4gICAgdGhpcy50cmlnZ2VyKFwid2ViU29ja2V0Q29ubmVjdGVkXCIpOyBcbiAgICBcbiAgICB3aGlsZSAodGhpcy5zb2NrZXRPcGVuICYmIHRoaXMubWVzc2FnZXNQZW5kaW5nLmxlbmd0aCkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VzUGVuZGluZy5zaGlmdCgpO1xuICAgICAgdGhpcy5zZW5kTWVzc2FnZShtZXNzYWdlLmV2ZW50VHlwZSwgbWVzc2FnZS5kYXRhKTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0RXJyb3IoKSB7XG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRDbG9zZSgpIHtcbiAgICB0aGlzLnRyaWdnZXIoXCJ3ZWJTb2NrZXREaXNjb25uZWN0ZWRcIik7IFxuICAgIHRoaXMucmVjb25uZWN0KCk7XG4gIH1cbiAgXG4gIG9wZW5XZWJTb2NrZXQoKSB7XG4gICAgbGV0IGhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICBsZXQgc2VjdXJlID0gbG9jYXRpb24ucHJvdG9jb2wgPT0gJ2h0dHBzOic7XG4gICAgdGhpcy53ZWJTb2NrZXQgPSB0aGlzLmNyZWF0ZVdlYlNvY2tldCgoc2VjdXJlID8gJ3dzczovLycgOiAnd3M6Ly8nKSArIGhvc3QgKyAnL3dzL3NvY2tldC8nICsgdGhpcy50aWNrZXQpO1xuICAgIFxuICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gdGhpcy5vbldlYlNvY2tldE1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSB0aGlzLm9uV2ViU29ja2V0RXJyb3IuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSB0aGlzLm9uV2ViU29ja2V0Q2xvc2UuYmluZCh0aGlzKTtcbiAgICAgIHN3aXRjaCAodGhpcy53ZWJTb2NrZXQucmVhZHlTdGF0ZSkge1xuICAgICAgICBjYXNlIHRoaXMud2ViU29ja2V0LkNPTk5FQ1RJTkc6XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25vcGVuID0gdGhpcy5vbldlYlNvY2tldENvbm5lY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB0aGlzLndlYlNvY2tldC5PUEVOOlxuICAgICAgICAgIHRoaXMub25XZWJTb2NrZXRDb25uZWN0ZWQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJXZWJTb2NrZXQgY29ubmVjdGlvbiBmYWlsZWRcIiwgJ2Vycm9yJykpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3Qgb3BlbiBXZWJTb2NrZXQgY29ubmVjdGlvblwiLCAnZXJyb3InKSk7XG4gICAgfVxuICB9XG4gIFxuICBjcmVhdGVXZWJTb2NrZXQodXJsKSB7XG4gICAgaWYgKCh0eXBlb2Ygd2luZG93LldlYlNvY2tldCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cuTW96V2ViU29ja2V0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgTW96V2ViU29ja2V0KHVybCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIFxuICBzdGFydFBpbmdpbmcoKSB7XG4gICAgdGhpcy5waW5nSGFuZGxlID0gc2V0SW50ZXJ2YWwoKCk9PntcbiAgICAgIGlmICh0aGlzLnNvY2tldE9wZW4gPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5waW5naW5nKSB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoXCJwaW5nOnBpbmdcIiwge30pO1xuICAgICAgICB0aGlzLnBpbmdpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5waW5nVGltZSArPSB0aGlzLm9wdGlvbnMucGluZ1RpbWVTdGVwO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMucGluZ1RpbWUgPiB0aGlzLm9wdGlvbnMucGluZ1RpbWVvdXQpIHtcbiAgICAgICAgICBpZiAoY29uc29sZSkgY29uc29sZS5sb2coXCJwaW5nIGZhaWxlZCwgcmVjb25uZWN0aW5nLi4uXCIpO1xuICAgICAgICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucGluZ1RpbWUgPSAwO1xuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzLm9wdGlvbnMucGluZ1RpbWVTdGVwKTtcbiAgfVxuICBcbiAgcmVjb25uZWN0KCkge1xuICAgIHZhciB3YXNPcGVuID0gdGhpcy5zb2NrZXRPcGVuOyBcbiAgICB0aGlzLnNvY2tldE9wZW4gPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWNvbm5lY3RUaW1lb3V0KTtcbiAgICBcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIGlmICh3YXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBJZ25vcmUgZXhjZXB0aW9ucyByZWxhdGVkIHRvIGRpc2NhcmRpbmcgYSBXZWJTb2NrZXQgXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuZ2V0VGlja2V0KCh0aWNrZXQpPT57XG4gICAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICAgIHRoaXMub3BlbldlYlNvY2tldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGJlY2F1c2UgdGlja2V0IHdhcyBtaXNzaW5nXCIsICdlcnJvcicpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICB9LCB0aGlzLm9wdGlvbnMucmVjb25uZWN0SW50ZXJ2YWwpO1xuICB9XG4gIFxuICBvbldlYlNvY2tldE1lc3NhZ2UoZXZlbnQpIHtcbiAgICB2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgdmFyIGV2ZW50VHlwZSA9IG1lc3NhZ2UuZXZlbnRUeXBlO1xuICAgIFxuICAgIGlmIChldmVudFR5cGUgPT0gXCJwaW5nOnBvbmdcIikge1xuICAgICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmlnZ2VyKGV2ZW50VHlwZSwgbWVzc2FnZS5kYXRhKTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uQmVmb3JlV2luZG93VW5sb2FkKCkge1xuICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gKCk9Pnt9O1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9ICgpPT57fTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSAoKT0+e307XG4gICAgICBpZiAodGhpcy5zb2NrZXRPcGVuKSB7XG4gICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
