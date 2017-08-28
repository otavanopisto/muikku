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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  updateHash: function updateHash(hash) {
    return {
      type: "UPDATE_HASH",
      payload: hash
    };
  }
};

},{}],6:[function(require,module,exports){
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

var _hash = require('./hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  announcements: _announcements2.default,
  messageCount: _messageCount2.default,
  lastWorkspace: _lastWorkspace2.default,
  workspaces: _workspaces2.default,
  lastMessages: _lastMessages2.default,
  hash: _hash2.default
};

},{"./announcements":4,"./hash":5,"./last-messages":7,"./last-workspace":8,"./message-count":9,"./workspaces":10}],7:[function(require,module,exports){
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

},{"../base/notifications":2}],8:[function(require,module,exports){
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

},{"../base/notifications":2}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require("../base/notifications");

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateMessageCount: function updateMessageCount(value) {
    if (typeof value !== "undefined") {
      return {
        type: "UPDATE_MESSAGE_COUNT",
        payload: value
      };
    }

    return function (dispatch, getState) {
      mApi().communicator.receiveditemscount.cacheClear().read().callback(function (err) {
        var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

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

},{"../base/notifications":2}],10:[function(require,module,exports){
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
      mApi().workspace.workspaces.read({ userId: userId }).callback(function (err) {
        var workspaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

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

},{"../base/notifications":2}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('../../general/navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _link = require('../../general/link.jsx');

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
        badge: this.props.messageCount
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

      return _react2.default.createElement(_navbar2.default, { classNameExtension: 'main-function', navigation: this.props.navigation, navbarItems: itemData.map(function (item) {
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
  activeTrail: _propTypes2.default.string.isRequired,
  navigation: _propTypes2.default.element
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

},{"../../general/link.jsx":14,"../../general/navbar.jsx":15,"prop-types":37,"react":"react","react-redux":"react-redux"}],12:[function(require,module,exports){
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

},{"../../actions/base/notifications":2,"react":"react","react-redux":"react-redux","redux":"redux"}],13:[function(require,module,exports){
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

},{"./portal.jsx":19,"prop-types":37,"react":"react","react-dom":"react-dom"}],14:[function(require,module,exports){
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

},{"prop-types":37,"react":"react"}],15:[function(require,module,exports){
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

},{"./navbar/language-picker.jsx":16,"./navbar/menu.jsx":17,"./navbar/profile-item.jsx":18,"prop-types":37,"react":"react"}],16:[function(require,module,exports){
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

},{"../../../actions/base/locales":1,"../dropdown.jsx":13,"prop-types":37,"react":"react","react-redux":"react-redux","redux":"redux"}],17:[function(require,module,exports){
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

},{"../../../actions/base/status":3,"../link.jsx":14,"prop-types":37,"react":"react","react-redux":"react-redux","redux":"redux"}],18:[function(require,module,exports){
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

},{"../../../actions/base/status":3,"../dropdown.jsx":13,"../link.jsx":14,"prop-types":37,"react":"react","react-redux":"react-redux","redux":"redux"}],19:[function(require,module,exports){
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

},{"prop-types":37,"react":"react","react-dom":"react-dom"}],20:[function(require,module,exports){
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

},{"prop-types":37,"react":"react"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('../base/main-function/navbar.jsx');

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
        { className: 'embbed embbed-full' },
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

},{"../base/main-function/navbar.jsx":11,"../general/screen-container.jsx":20,"./body/announcements-panel.jsx":22,"./body/continue-studies-panel.jsx":23,"./body/important-panel.jsx":24,"./body/last-messages-panel.jsx":25,"./body/workspaces-panel.jsx":26,"react":"react"}],22:[function(require,module,exports){
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
                href: '/announcements?announcementId=' + announcement.id },
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

},{"../../general/link.jsx":14,"react":"react","react-redux":"react-redux"}],23:[function(require,module,exports){
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

},{"../../general/link.jsx":14,"react":"react","react-redux":"react-redux"}],24:[function(require,module,exports){
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

},{"react":"react"}],25:[function(require,module,exports){
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

},{"../../general/link.jsx":14,"react":"react","react-redux":"react-redux"}],26:[function(require,module,exports){
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

},{"../../general/link.jsx":14,"react":"react","react-redux":"react-redux"}],27:[function(require,module,exports){
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

},{"../components/base/notifications.jsx":12,"../components/index/body.jsx":21,"react":"react"}],28:[function(require,module,exports){
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

var _reduxDevtoolsExtension = require('redux-devtools-extension');

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runApp(reducer, App, callback) {
  var store = (0, _redux.createStore)(reducer, (0, _reduxDevtoolsExtension.composeWithDevTools)((0, _redux.applyMiddleware)(_reduxThunk2.default, _reduxLogger.logger)));

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

  window.STORE_DEBUG = newStore;
  callback && callback(newStore);
}

},{"react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","redux-devtools-extension":39,"redux-logger":40,"redux-thunk":"redux-thunk"}],29:[function(require,module,exports){
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
    "Communicator:newmessagereceived": [_mainFunction2.default.updateMessageCount, _mainFunction2.default.lastMessages.updateLastMessages.bind(null, 6)],
    "Communicator:messageread": [_mainFunction2.default.updateMessageCount, _mainFunction2.default.lastMessages.updateLastMessages.bind(null, 6)],
    "Communicator:threaddeleted": [_mainFunction2.default.updateMessageCount, _mainFunction2.default.lastMessages.updateLastMessages.bind(null, 6)]
  });
  store.dispatch(_mainFunction2.default.messageCount.updateMessageCount());
  store.dispatch(_mainFunction2.default.announcements.updateAnnouncements());
  store.dispatch(_mainFunction2.default.lastWorkspace.updateLastWorkspace());
  store.dispatch(_mainFunction2.default.workspaces.updateWorkspaces());
  store.dispatch(_mainFunction2.default.lastMessages.updateLastMessages(6));
});

},{"./actions/main-function":6,"./containers/index.jsx":27,"./default.debug.jsx":28,"./reducers/index":45,"./util/websocket":52}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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

},{"_process":33}],32:[function(require,module,exports){
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

},{"./emptyFunction":30,"_process":33}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":38,"_process":33,"fbjs/lib/invariant":31,"fbjs/lib/warning":32}],35:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":38,"fbjs/lib/emptyFunction":30,"fbjs/lib/invariant":31}],36:[function(require,module,exports){
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

},{"./checkPropTypes":34,"./lib/ReactPropTypesSecret":38,"_process":33,"fbjs/lib/emptyFunction":30,"fbjs/lib/invariant":31,"fbjs/lib/warning":32}],37:[function(require,module,exports){
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

},{"./factoryWithThrowingShims":35,"./factoryWithTypeCheckers":36,"_process":33}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
"use strict";

var compose = require('redux').compose;

exports.__esModule = true;
exports.composeWithDevTools = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
    function() {
      if (arguments.length === 0) return undefined;
      if (typeof arguments[0] === 'object') return compose;
      return compose.apply(null, arguments);
    }
);

exports.devToolsEnhancer = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__ :
    function() { return function(noop) { return noop; } }
);

},{"redux":"redux"}],40:[function(require,module,exports){
(function (global){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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
  lastMessages: _lastMessages2.default,
  messageCount: _messageCount2.default
});

},{"./base/i18n":41,"./base/locales":42,"./base/notifications":43,"./base/status":44,"./main-function/announcements":46,"./main-function/last-messages":47,"./main-function/last-workspace":48,"./main-function/message-count":49,"./main-function/workspaces":50,"./util/websocket":51,"redux":"redux"}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
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

},{"../actions/base/notifications":2}]},{},[29])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiYWN0aW9ucy9iYXNlL3N0YXR1cy5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9hbm5vdW5jZW1lbnRzLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2hhc2guanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vaW5kZXguanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vbGFzdC1tZXNzYWdlcy5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9sYXN0LXdvcmtzcGFjZS5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9tZXNzYWdlLWNvdW50LmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL3dvcmtzcGFjZXMuanMiLCJjb21wb25lbnRzL2Jhc2UvbWFpbi1mdW5jdGlvbi9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2Ryb3Bkb3duLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9tZW51LmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvcHJvZmlsZS1pdGVtLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9wb3J0YWwuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL3NjcmVlbi1jb250YWluZXIuanN4IiwiY29tcG9uZW50cy9pbmRleC9ib2R5LmpzeCIsImNvbXBvbmVudHMvaW5kZXgvYm9keS9hbm5vdW5jZW1lbnRzLXBhbmVsLmpzeCIsImNvbXBvbmVudHMvaW5kZXgvYm9keS9jb250aW51ZS1zdHVkaWVzLXBhbmVsLmpzeCIsImNvbXBvbmVudHMvaW5kZXgvYm9keS9pbXBvcnRhbnQtcGFuZWwuanN4IiwiY29tcG9uZW50cy9pbmRleC9ib2R5L2xhc3QtbWVzc2FnZXMtcGFuZWwuanN4IiwiY29tcG9uZW50cy9pbmRleC9ib2R5L3dvcmtzcGFjZXMtcGFuZWwuanN4IiwiY29udGFpbmVycy9pbmRleC5qc3giLCJkZWZhdWx0LmRlYnVnLmpzeCIsImluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL3dhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWRldnRvb2xzLWV4dGVuc2lvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC1sb2dnZXIvZGlzdC9yZWR1eC1sb2dnZXIuanMiLCJyZWR1Y2Vycy9iYXNlL2kxOG4uanMiLCJyZWR1Y2Vycy9iYXNlL2xvY2FsZXMuanMiLCJyZWR1Y2Vycy9iYXNlL25vdGlmaWNhdGlvbnMuanMiLCJyZWR1Y2Vycy9iYXNlL3N0YXR1cy5qcyIsInJlZHVjZXJzL2luZGV4LmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi9hbm5vdW5jZW1lbnRzLmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi9sYXN0LW1lc3NhZ2VzLmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi9sYXN0LXdvcmtzcGFjZS5qcyIsInJlZHVjZXJzL21haW4tZnVuY3Rpb24vbWVzc2FnZS1jb3VudC5qcyIsInJlZHVjZXJzL21haW4tZnVuY3Rpb24vd29ya3NwYWNlcy5qcyIsInJlZHVjZXJzL3V0aWwvd2Vic29ja2V0LmpzIiwidXRpbC93ZWJzb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNBZTtBQUNiLGFBQVcsbUJBQVMsTUFBVCxFQUFnQjtBQUN6QixXQUFPO0FBQ0wsY0FBUSxZQURIO0FBRUwsaUJBQVc7QUFGTixLQUFQO0FBSUQ7QUFOWSxDOzs7Ozs7OztrQkNBQTtBQUNiLHVCQUFxQiw2QkFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTJCO0FBQzlDLFdBQU87QUFDTCxjQUFRLGtCQURIO0FBRUwsaUJBQVc7QUFDVCxvQkFBWSxRQURIO0FBRVQsbUJBQVc7QUFGRjtBQUZOLEtBQVA7QUFPRCxHQVRZO0FBVWIsb0JBQWtCLDBCQUFTLFlBQVQsRUFBc0I7QUFDdEMsV0FBTztBQUNMLGNBQVEsbUJBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQWZZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsUUFEYSxvQkFDTDtBQUNOLFdBQU87QUFDTCxjQUFRO0FBREgsS0FBUDtBQUdEO0FBTFksQzs7Ozs7Ozs7O0FDQWY7Ozs7OztrQkFFZTtBQUNiLHFCQURhLGlDQUN1RDtBQUFBLFFBQWhELE9BQWdELHVFQUF4QyxFQUFFLDRCQUE0QixPQUE5QixFQUF3Qzs7QUFDbEUsV0FBTyxVQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXNCO0FBQzNCLGFBQ0csU0FESCxDQUVHLGFBRkgsQ0FHRyxJQUhILENBR1EsT0FIUixFQUlHLFFBSkgsQ0FJWSxVQUFTLEdBQVQsRUFBYyxhQUFkLEVBQTZCO0FBQ3JDLFlBQUksR0FBSixFQUFTO0FBQ1AsbUJBQVMsd0JBQVEsbUJBQVIsQ0FBNEIsSUFBSSxPQUFoQyxFQUF5QyxPQUF6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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QVEsSUFBaEM7QUFDRDtBQUNGOzs7MkNBRXNCO0FBQ3JCLFVBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLGFBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsWUFBSSxDQUFFLENBQWpDO0FBQ0EsYUFBSyxTQUFMLENBQWUsT0FBZixHQUF5QixZQUFJLENBQUUsQ0FBL0I7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLFlBQUksQ0FBRSxDQUEvQjtBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGVBQUssU0FBTCxDQUFlLEtBQWY7QUFDRDtBQUNGO0FBQ0Y7Ozs7OztrQkExUGtCLGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQge1xuICBzZXRMb2NhbGU6IGZ1bmN0aW9uKGxvY2FsZSl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ1NFVF9MT0NBTEUnLFxuICAgICAgJ3BheWxvYWQnOiBsb2NhbGVcbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBkaXNwbGF5Tm90aWZpY2F0aW9uOiBmdW5jdGlvbihtZXNzYWdlLCBzZXZlcml0eSl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0FERF9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICdzZXZlcml0eSc6IHNldmVyaXR5LFxuICAgICAgICAnbWVzc2FnZSc6IG1lc3NhZ2VcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGhpZGVOb3RpZmljYXRpb246IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbil7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0hJREVfTk9USUZJQ0FUSU9OJyxcbiAgICAgICdwYXlsb2FkJzogbm90aWZpY2F0aW9uXG4gICAgfVxuICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgbG9nb3V0KCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0xPR09VVCdcbiAgICB9XG4gIH1cbn07IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVBbm5vdW5jZW1lbnRzKG9wdGlvbnM9eyBoaWRlV29ya3NwYWNlQW5ub3VuY2VtZW50czogXCJmYWxzZVwiIH0pe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgbUFwaSgpXG4gICAgICAgIC5hbm5vdW5jZXJcbiAgICAgICAgLmFubm91bmNlbWVudHNcbiAgICAgICAgLnJlYWQob3B0aW9ucylcbiAgICAgICAgLmNhbGxiYWNrKGZ1bmN0aW9uKGVyciwgYW5ub3VuY2VtZW50cykge1xuICAgICAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfQU5OT1VOQ0VNRU5UUycsXG4gICAgICAgICAgICAgIHBheWxvYWQ6IGFubm91bmNlbWVudHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVIYXNoKGhhc2gpe1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcIlVQREFURV9IQVNIXCIsXG4gICAgICBwYXlsb2FkOiBoYXNoXG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGFubm91bmNlbWVudHMgZnJvbSAnLi9hbm5vdW5jZW1lbnRzJztcbmltcG9ydCBtZXNzYWdlQ291bnQgZnJvbSAnLi9tZXNzYWdlLWNvdW50JztcbmltcG9ydCBsYXN0V29ya3NwYWNlIGZyb20gJy4vbGFzdC13b3Jrc3BhY2UnO1xuaW1wb3J0IHdvcmtzcGFjZXMgZnJvbSAnLi93b3Jrc3BhY2VzJztcbmltcG9ydCBsYXN0TWVzc2FnZXMgZnJvbSAnLi9sYXN0LW1lc3NhZ2VzJztcbmltcG9ydCBoYXNoIGZyb20gJy4vaGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYW5ub3VuY2VtZW50cyxcbiAgbWVzc2FnZUNvdW50LFxuICBsYXN0V29ya3NwYWNlLFxuICB3b3Jrc3BhY2VzLFxuICBsYXN0TWVzc2FnZXMsXG4gIGhhc2hcbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUxhc3RNZXNzYWdlcyhtYXhSZXN1bHRzKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3IuaXRlbXMucmVhZCh7XG4gICAgICAgICdmaXJzdFJlc3VsdCc6IDAsXG4gICAgICAgICdtYXhSZXN1bHRzJzogbWF4UmVzdWx0c1xuICAgICAgfSkuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfTEFTVF9NRVNTQUdFUycsXG4gICAgICAgICAgICBwYXlsb2FkOiBtZXNzYWdlc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUxhc3RXb3Jrc3BhY2UoKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIG1BcGkoKS51c2VyLnByb3BlcnR5LnJlYWQoJ2xhc3Qtd29ya3NwYWNlJykuY2FsbGJhY2soZnVuY3Rpb24oZXJyLCBwcm9wZXJ0eSkge1xuICAgICAgICBpZiggZXJyICl7XG4gICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogJ1VQREFURV9MQVNUX1dPUktTUEFDRScsXG4gICAgICAgICAgICBwYXlsb2FkOiBwcm9wZXJ0eS52YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlTWVzc2FnZUNvdW50KHZhbHVlKXtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwiVVBEQVRFX01FU1NBR0VfQ09VTlRcIixcbiAgICAgICAgcGF5bG9hZDogdmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKClcbiAgICAgICAgLmNvbW11bmljYXRvclxuICAgICAgICAucmVjZWl2ZWRpdGVtc2NvdW50XG4gICAgICAgIC5jYWNoZUNsZWFyKClcbiAgICAgICAgLnJlYWQoKVxuICAgICAgICAuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgcmVzdWx0PTApIHtcbiAgICAgICAgICBpZiggZXJyICl7XG4gICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICB0eXBlOiBcIlVQREFURV9NRVNTQUdFX0NPVU5UXCIsXG4gICAgICAgICAgICAgIHBheWxvYWQ6IHJlc3VsdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZVdvcmtzcGFjZXMoKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIGxldCB1c2VySWQgPSBnZXRTdGF0ZSgpLnN0YXR1cy51c2VySWQ7XG4gICAgICBtQXBpKCkud29ya3NwYWNlLndvcmtzcGFjZXNcbiAgICAgICAucmVhZCh7dXNlcklkfSlcbiAgICAgICAuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgd29ya3NwYWNlcz1bXSkge1xuICAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICB0eXBlOiBcIlVQREFURV9XT1JLU1BBQ0VTXCIsXG4gICAgICAgICAgICAgcGF5bG9hZDogd29ya3NwYWNlc1xuICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCBOYXZiYXIgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIE1haW5GdW5jdGlvbk5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYWN0aXZlVHJhaWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gW3tcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJob21lXCIsXG4gICAgICB0cmFpbDogXCJpbmRleFwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ob21lLmhvbWUnLFxuICAgICAgaHJlZjogXCIvXCIsXG4gICAgICBpY29uOiBcImhvbWVcIixcbiAgICAgIGNvbmRpdGlvbjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJjb3Vyc2VwaWNrZXJcIixcbiAgICAgIHRyYWlsOiBcImNvdXJzZXBpY2tlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5jb3Vyc2VwaWNrZXIuY291cnNlcGlja2VyJyxcbiAgICAgIGhyZWY6IFwiL2NvdXJzZXBpY2tlclwiLFxuICAgICAgaWNvbjogXCJib29rc1wiLFxuICAgICAgY29uZGl0aW9uOiB0cnVlXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbW11bmljYXRvclwiLFxuICAgICAgdHJhaWw6IFwiY29tbXVuaWNhdG9yXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmNvbW11bmljYXRvci5jb21tdW5pY2F0b3InLFxuICAgICAgaHJlZjogXCIvY29tbXVuaWNhdG9yXCIsXG4gICAgICBpY29uOiBcImVudmVsb3BlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluLFxuICAgICAgYmFkZ2U6IHRoaXMucHJvcHMubWVzc2FnZUNvdW50XG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImRpc2N1c3Npb25cIixcbiAgICAgIHRyYWlsOiBcImRpc2N1c3Npb25cIixcbiAgICAgIHRleHQ6ICdwbHVnaW4uZm9ydW0uZm9ydW0nLFxuICAgICAgaHJlZjogXCIvZGlzY3Vzc2lvblwiLFxuICAgICAgaWNvbjogXCJidWJibGVcIixcbiAgICAgIGNvbmRpdGlvbjogdGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gJiYgdGhpcy5wcm9wcy5zdGF0dXMucGVybWlzc2lvbnMuRk9SVU1fQUNDRVNTRU5WSVJPTk1FTlRGT1JVTVxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJndWlkZXJcIixcbiAgICAgIHRyYWlsOiBcImd1aWRlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ndWlkZXIuZ3VpZGVyJyxcbiAgICAgIGhyZWY6IFwiL2d1aWRlclwiLFxuICAgICAgaWNvbjogXCJtZW1iZXJzXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkdVSURFUl9WSUVXXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcInJlY29yZHNcIixcbiAgICAgIHRyYWlsOiBcInJlY29yZHNcIixcbiAgICAgIHRleHQ6ICdwbHVnaW4ucmVjb3Jkcy5yZWNvcmRzJyxcbiAgICAgIGhyZWY6IFwiL3JlY29yZHNcIixcbiAgICAgIGljb246IFwicHJvZmlsZVwiLFxuICAgICAgY29uZGl0aW9uOiB0aGlzLnByb3BzLnN0YXR1cy5wZXJtaXNzaW9ucy5UUkFOU0NSSVBUX09GX1JFQ09SRFNfVklFV1xuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJldmFsdWF0aW9uXCIsXG4gICAgICB0cmFpbDogXCJldmFsdWF0aW9uXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmV2YWx1YXRpb24uZXZhbHVhdGlvbicsXG4gICAgICBocmVmOiBcIi9ldmFsdWF0aW9uXCIsXG4gICAgICBpY29uOiBcImV2YWx1YXRlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkVWQUxVQVRJT05fVklFV19JTkRFWFxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJhbm5vdW5jZXJcIixcbiAgICAgIHRyYWlsOiBcImFubm91bmNlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5hbm5vdW5jZXIuYW5ub3VuY2VyJyxcbiAgICAgIGhyZWY6IFwiL2Fubm91bmNlclwiLFxuICAgICAgaWNvbjogXCJhbm5vdW5jZXJcIixcbiAgICAgIGNvbmRpdGlvbjogdGhpcy5wcm9wcy5zdGF0dXMucGVybWlzc2lvbnMuQU5OT1VOQ0VSX1RPT0xcbiAgICB9XTtcbiAgICBcbiAgICByZXR1cm4gPE5hdmJhciBjbGFzc05hbWVFeHRlbnNpb249XCJtYWluLWZ1bmN0aW9uXCIgbmF2aWdhdGlvbj17dGhpcy5wcm9wcy5uYXZpZ2F0aW9ufSBuYXZiYXJJdGVtcz17aXRlbURhdGEubWFwKChpdGVtKT0+e1xuICAgICAgaWYgKCFpdGVtLmNvbmRpdGlvbil7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBpdGVtLmNsYXNzTmFtZVN1ZmZpeCxcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9e2l0ZW0uaHJlZn0gY2xhc3NOYW1lPXtgbWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstaWNvbiBsaW5rLWZ1bGwgJHt0aGlzLnByb3BzLmFjdGl2ZVRyYWlsID09PSBpdGVtLnRyYWlsID8gJ2FjdGl2ZScgOiAnJ31gfVxuICAgICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9Lz5cbiAgICAgICAgICB7aXRlbS5iYWRnZSA/IDxzcGFuIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gaW5kaWNhdG9yXCI+eyhpdGVtLmJhZGdlID49IDEwMCA/IFwiOTkrXCIgOiBpdGVtLmJhZGdlKX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgPC9MaW5rPilcbiAgICAgIH1cbiAgICB9KX0gZGVmYXVsdE9wdGlvbnM9e1tdfSBtZW51SXRlbXM9e2l0ZW1EYXRhLm1hcCgoaXRlbSk9PntcbiAgICAgIGlmICghaXRlbS5jb25kaXRpb24pe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiA8TGluayBocmVmPXtpdGVtLmhyZWZ9IGNsYXNzTmFtZT17YG1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgJHt0aGlzLnByb3BzLmFjdGl2ZVRyYWlsID09PSBpdGVtLnRyYWlsID8gJ2FjdGl2ZScgOiAnJ31gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9Lz5cbiAgICAgICAge2l0ZW0uYmFkZ2UgPyA8c3BhbiBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGluZGljYXRvclwiPnsoaXRlbS5iYWRnZSA+PSAxMDAgPyBcIjk5K1wiIDogaXRlbS5iYWRnZSl9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX1cbiAgICAgIDwvTGluaz5cbiAgICB9KX0vPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4bixcbiAgICBzdGF0dXM6IHN0YXRlLnN0YXR1cyxcbiAgICBtZXNzYWdlQ291bnQ6IHN0YXRlLm1lc3NhZ2VDb3VudFxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE1haW5GdW5jdGlvbk5hdmJhcik7XG4iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmNsYXNzIE5vdGlmaWNhdGlvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5ub3RpZmljYXRpb25zLm1hcCgobm90aWZpY2F0aW9uKT0+e1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e25vdGlmaWNhdGlvbi5pZH0gY2xhc3NOYW1lPXtcIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtIG5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLVwiICsgbm90aWZpY2F0aW9uLnNldmVyaXR5fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57bm90aWZpY2F0aW9uLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLWNsb3NlXCIgb25DbGljaz17dGhpcy5wcm9wcy5oaWRlTm90aWZpY2F0aW9uLmJpbmQodGhpcywgbm90aWZpY2F0aW9uKX0+PC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuICBcbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbm90aWZpY2F0aW9uczogc3RhdGUubm90aWZpY2F0aW9uc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTm90aWZpY2F0aW9ucyk7IiwiaW1wb3J0IFBvcnRhbCBmcm9tICcuL3BvcnRhbC5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2ZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcm9wZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pKS5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB0b3A6IG51bGwsXG4gICAgICBsZWZ0OiBudWxsLFxuICAgICAgYXJyb3dMZWZ0OiBudWxsLFxuICAgICAgYXJyb3dSaWdodDogbnVsbCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfVxuICB9XG4gIG9uT3BlbihET01Ob2RlKXtcbiAgICBsZXQgYWN0aXZhdG9yID0gdGhpcy5yZWZzLmFjdGl2YXRvcjtcbiAgICBpZiAoIShhY3RpdmF0b3IgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpe1xuICAgICAgYWN0aXZhdG9yID0gZmluZERPTU5vZGUoYWN0aXZhdG9yKTtcbiAgICB9XG4gICAgXG4gICAgbGV0ICR0YXJnZXQgPSAkKGFjdGl2YXRvcik7XG4gICAgbGV0ICRhcnJvdyA9ICQodGhpcy5yZWZzLmFycm93KTtcbiAgICBsZXQgJGRyb3Bkb3duID0gJCh0aGlzLnJlZnMuZHJvcGRvd24pO1xuICAgICAgXG4gICAgbGV0IHBvc2l0aW9uID0gJHRhcmdldC5vZmZzZXQoKTtcbiAgICBsZXQgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICBsZXQgbW9yZVNwYWNlSW5UaGVMZWZ0U2lkZSA9ICh3aW5kb3dXaWR0aCAtIHBvc2l0aW9uLmxlZnQpIDwgcG9zaXRpb24ubGVmdDtcbiAgICBcbiAgICBsZXQgbGVmdCA9IG51bGw7XG4gICAgaWYgKG1vcmVTcGFjZUluVGhlTGVmdFNpZGUpe1xuICAgICAgbGVmdCA9IHBvc2l0aW9uLmxlZnQgLSAkZHJvcGRvd24ub3V0ZXJXaWR0aCgpICsgJHRhcmdldC5vdXRlcldpZHRoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0O1xuICAgIH1cbiAgICBsZXQgdG9wID0gcG9zaXRpb24udG9wICsgJHRhcmdldC5vdXRlckhlaWdodCgpICsgNTtcbiAgICBcbiAgICBsZXQgYXJyb3dMZWZ0ID0gbnVsbDtcbiAgICBsZXQgYXJyb3dSaWdodCA9IG51bGw7XG4gICAgaWYgKG1vcmVTcGFjZUluVGhlTGVmdFNpZGUpe1xuICAgICAgYXJyb3dSaWdodCA9ICgkdGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDIpICsgKCRhcnJvdy53aWR0aCgpLzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJvd0xlZnQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7dG9wLCBsZWZ0LCBhcnJvd0xlZnQsIGFycm93UmlnaHQsIHZpc2libGU6IHRydWV9KTtcbiAgfVxuICBiZWZvcmVDbG9zZShET01Ob2RlLCByZW1vdmVGcm9tRE9NKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChyZW1vdmVGcm9tRE9NLCAzMDApO1xuICB9XG4gIGNsb3NlKCl7XG4gICAgdGhpcy5yZWZzLnBvcnRhbC5jbG9zZVBvcnRhbCgpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8UG9ydGFsIHJlZj1cInBvcnRhbFwiIG9wZW5CeUNsaWNrT249e1JlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLmNoaWxkcmVuLCB7IHJlZjogXCJhY3RpdmF0b3JcIiB9KX1cbiAgICAgIGNsb3NlT25Fc2MgY2xvc2VPbk91dHNpZGVDbGljayBjbG9zZU9uU2Nyb2xsIG9uT3Blbj17dGhpcy5vbk9wZW59IGJlZm9yZUNsb3NlPXt0aGlzLmJlZm9yZUNsb3NlfT5cbiAgICAgIDxkaXYgcmVmPVwiZHJvcGRvd25cIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS50b3AsXG4gICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5sZWZ0XG4gICAgICAgIH19XG4gICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGRyb3Bkb3duICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWRyb3Bkb3duLSR7dGhpcy5wcm9wcy5jbGFzc05hbWVTdWZmaXh9ICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhcnJvd1wiIHJlZj1cImFycm93XCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmFycm93TGVmdCwgcmlnaHQ6IHRoaXMuc3RhdGUuYXJyb3dSaWdodH19Pjwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0eXBlb2YgaXRlbSA9PT0gXCJmdW5jdGlvblwiID8gaXRlbSh0aGlzLmNsb3NlKSA6IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICB7ZWxlbWVudH1cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9Qb3J0YWw+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZnVuY3Rpb24gc2Nyb2xsVG9TZWN0aW9uKGFuY2hvcikge1xuICBpZiAoISQoYW5jaG9yKS5zaXplKCkpe1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYW5jaG9yO1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgbGV0IHRvcE9mZnNldCA9IDkwO1xuICBsZXQgc2Nyb2xsVG9wID0gJChhbmNob3IpLm9mZnNldCgpLnRvcCAtIHRvcE9mZnNldDtcblxuICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgIHNjcm9sbFRvcCA6IHNjcm9sbFRvcFxuICB9LCB7XG4gICAgZHVyYXRpb24gOiA1MDAsXG4gICAgZWFzaW5nIDogXCJlYXNlSW5PdXRRdWFkXCJcbiAgfSk7XG4gIFxuICBzZXRUaW1lb3V0KCgpPT57XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhbmNob3I7XG4gIH0sIDUwMCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbkNsaWNrKGUsIHJlKXtcbiAgICBpZiAodGhpcy5wcm9wcy5ocmVmICYmIHRoaXMucHJvcHMuaHJlZlswXSA9PT0gJyMnKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNjcm9sbFRvU2VjdGlvbih0aGlzLnByb3BzLmhyZWYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKXtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiB0cnVlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZChlLCByZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBmYWxzZX0pO1xuICAgIHRoaXMub25DbGljayhlLCByZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Ub3VjaEVuZCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hFbmQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPGEgey4uLnRoaXMucHJvcHN9XG4gICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lICsgKHRoaXMuc3RhdGUuYWN0aXZlID8gXCIgYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja30gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfS8+XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExhbmd1YWdlUGlja2VyIGZyb20gJy4vbmF2YmFyL2xhbmd1YWdlLXBpY2tlci5qc3gnO1xuaW1wb3J0IFByb2ZpbGVJdGVtIGZyb20gJy4vbmF2YmFyL3Byb2ZpbGUtaXRlbS5qc3gnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi9uYXZiYXIvbWVudS5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9wZW5NZW51ID0gdGhpcy5vcGVuTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VNZW51ID0gdGhpcy5jbG9zZU1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9XG4gIH1cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZiYXJJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGl0ZW06IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWRcbiAgICB9KSkuaXNSZXF1aXJlZCxcbiAgICBtZW51SXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkLFxuICAgIGRlZmF1bHRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZCxcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudFxuICB9XG4gIG9wZW5NZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgY2xvc2VNZW51KCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH0pO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufWB9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWxvZ29cIj48L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tbWVudS1idXR0b25gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1pY29uIGxpbmstZnVsbGB9IG9uQ2xpY2s9e3RoaXMub3Blbk1lbnV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbmF2aWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5hdmJhckl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLSR7aXRlbS5jbGFzc05hbWVTdWZmaXh9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLml0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGl0ZW09PiEhaXRlbSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZGVmYXVsdE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgPFByb2ZpbGVJdGVtIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3VhZ2VQaWNrZXIgY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICAgIDxNZW51IG9wZW49e3RoaXMuc3RhdGUuaXNNZW51T3Blbn0gb25DbG9zZT17dGhpcy5jbG9zZU1lbnV9XG4gICAgICAgICAgICAgICAgaXRlbXM9e3RoaXMucHJvcHMubWVudUl0ZW1zfSBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBuYXZpZ2F0aW9uPXt0aGlzLnByb3BzLm5hdmlnYXRpb259Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgfVxufSIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9sb2NhbGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuY2xhc3MgTGFuZ3VhZ2VQaWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8RHJvcGRvd24gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gY2xhc3NOYW1lU3VmZml4PVwibGFuZ3VhZ2UtcGlja2VyXCIgaXRlbXM9e3RoaXMucHJvcHMubG9jYWxlcy5hdmFsaWFibGUubWFwKChsb2NhbGUpPT57XG4gICAgICByZXR1cm4gKDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstbGFuZ3VhZ2UtcGlja2VyYH0gb25DbGljaz17dGhpcy5wcm9wcy5zZXRMb2NhbGUuYmluZCh0aGlzLCBsb2NhbGUubG9jYWxlKX0+XG4gICAgICAgIDxzcGFuPntsb2NhbGUubmFtZX08L3NwYW4+XG4gICAgICA8L2E+KTtcbiAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBidXR0b24tcGlsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1idXR0b24tcGlsbC1sYW5ndWFnZWB9PlxuICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5sb2NhbGVzLmN1cnJlbnR9PC9zcGFuPlxuICAgICAgPC9hPlxuICAgIDwvRHJvcGRvd24+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBsb2NhbGVzOiBzdGF0ZS5sb2NhbGVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYW5ndWFnZVBpY2tlcik7IiwiaW1wb3J0IExpbmsgZnJvbSAnLi4vbGluay5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJ34vYWN0aW9ucy9iYXNlL3N0YXR1cyc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmZ1bmN0aW9uIGNoZWNrTGlua0NsaWNrZWQodGFyZ2V0KXtcbiAgcmV0dXJuIHRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImFcIiB8fCAodGFyZ2V0LnBhcmVudEVsZW1lbnQgPyBjaGVja0xpbmtDbGlja2VkKHRhcmdldC5wYXJlbnRFbGVtZW50KSA6IGZhbHNlKTtcbn1cblxuY2xhc3MgTWVudSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaE1vdmUgPSB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vcGVuID0gdGhpcy5vcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlQnlPdmVybGF5ID0gdGhpcy5jbG9zZUJ5T3ZlcmxheS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkaXNwbGF5ZWQ6IHByb3BzLm9wZW4sXG4gICAgICB2aXNpYmxlOiBwcm9wcy5vcGVuLFxuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZzogbnVsbCxcbiAgICAgIG9wZW46IHByb3BzLm9wZW5cbiAgICB9XG4gIH1cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xuICAgIGlmIChuZXh0UHJvcHMub3BlbiAmJiAhdGhpcy5zdGF0ZS5vcGVuKXtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy5vcGVuICYmIHRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hTdGFydChlKXtcbiAgICB0aGlzLnNldFN0YXRlKHsnZHJhZ2dpbmcnOiB0cnVlfSk7XG4gICAgdGhpcy50b3VjaENvcmRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYID0gMDtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb25Ub3VjaE1vdmUoZSl7XG4gICAgbGV0IGRpZmZYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHRoaXMudG91Y2hDb3JkWDtcbiAgICBsZXQgYWJzb2x1dGVEaWZmZXJlbmNlWCA9IE1hdGguYWJzKGRpZmZYIC0gdGhpcy5zdGF0ZS5kcmFnKTtcbiAgICB0aGlzLnRvdWNoTW92ZW1lbnRYICs9IGFic29sdXRlRGlmZmVyZW5jZVg7XG5cbiAgICBpZiAoZGlmZlggPiAwKSB7XG4gICAgICBkaWZmWCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWc6IGRpZmZYfSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hFbmQoZSl7XG4gICAgbGV0IHdpZHRoID0gJCh0aGlzLnJlZnMubWVudUNvbnRhaW5lcikud2lkdGgoKTtcbiAgICBsZXQgZGlmZiA9IHRoaXMuc3RhdGUuZHJhZztcbiAgICBsZXQgbW92ZW1lbnQgPSB0aGlzLnRvdWNoTW92ZW1lbnRYO1xuICAgIFxuICAgIGxldCBtZW51SGFzU2xpZGVkRW5vdWdoRm9yQ2xvc2luZyA9IE1hdGguYWJzKGRpZmYpID49IHdpZHRoKjAuMzM7XG4gICAgbGV0IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSA9IGUudGFyZ2V0ID09PSB0aGlzLnJlZnMubWVudSAmJiBtb3ZlbWVudCA8PSA1O1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZEFMaW5rID0gY2hlY2tMaW5rQ2xpY2tlZChlLnRhcmdldCkgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2luZzogZmFsc2V9KTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBudWxsfSk7XG4gICAgICBpZiAobWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgfHwgeW91SnVzdENsaWNrZWRUaGVPdmVybGF5IHx8IHlvdUp1c3RDbGlja2VkQUxpbmspe1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvcGVuKCl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiB0cnVlLCBvcGVuOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmlzaWJsZTogdHJ1ZX0pO1xuICAgIH0sIDEwKTtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJ2hpZGRlbid9KTtcbiAgfVxuICBjbG9zZUJ5T3ZlcmxheShlKXtcbiAgICBsZXQgaXNPdmVybGF5ID0gZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldDtcbiAgICBsZXQgaXNMaW5rID0gY2hlY2tMaW5rQ2xpY2tlZChlLnRhcmdldCk7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRyYWdnaW5nICYmIChpc092ZXJsYXkgfHwgaXNMaW5rKSl7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIGNsb3NlKCl7XG4gICAgJChkb2N1bWVudC5ib2R5KS5jc3MoeydvdmVyZmxvdyc6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dmlzaWJsZTogZmFsc2V9KTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtkaXNwbGF5ZWQ6IGZhbHNlLCBvcGVuOiBmYWxzZX0pO1xuICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKCk7XG4gICAgfSwgMzAwKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbWVudSAke3RoaXMuc3RhdGUuZGlzcGxheWVkID8gXCJkaXNwbGF5ZWRcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifSAke3RoaXMuc3RhdGUuZHJhZ2dpbmcgPyBcImRyYWdnaW5nXCIgOiBcIlwifWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2xvc2VCeU92ZXJsYXl9IG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9IG9uVG91Y2hNb3ZlPXt0aGlzLm9uVG91Y2hNb3ZlfSBvblRvdWNoRW5kPXt0aGlzLm9uVG91Y2hFbmR9IHJlZj1cIm1lbnVcIj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtY29udGFpbmVyXCIgcmVmPVwibWVudUNvbnRhaW5lclwiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5kcmFnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWxvZ29cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1lbnUtaGVhZGVyLWJ1dHRvbi1jbG9zZSBpY29uIGljb24tYXJyb3ctbGVmdFwiPjwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtYm9keVwiPlxuICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMubmF2aWdhdGlvbiA/IDxkaXYgY2xhc3NOYW1lPVwibWVudS1leHRyYXNcIj57dGhpcy5wcm9wcy5uYXZpZ2F0aW9ufTwvZGl2PiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibWVudS1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBrZXk9e2luZGV4fT57aXRlbX08L2xpPlxuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbSBtZW51LWl0ZW0tc3BhY2VcIj48L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51IG1haW4tZnVuY3Rpb24tbGluay1tZW51LXByb2ZpbGVcIiBocmVmPVwiL3Byb2ZpbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvYmplY3QgY2xhc3NOYW1lPVwiZW1iYmVkIGVtYmJlZC1wcm9maWxlLWltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17YC9yZXN0L3VzZXIvZmlsZXMvdXNlci8ke3RoaXMucHJvcHMuc3RhdHVzLnVzZXJJZH0vaWRlbnRpZmllci9wcm9maWxlLWltYWdlLTk2YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXVzZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L29iamVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5wcm9maWxlLnByb2ZpbGUnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtaW5zdHJ1Y3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tZm9yZ290cGFzc3dvcmRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZm9vdGVyLmluc3RydWN0aW9ucycpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSBtYWluLWZ1bmN0aW9uLWxpbmstbWVudS1oZWxwZGVza1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWhlbHBkZXNrXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmhvbWUuaGVscGRlc2snKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtbG9nb3V0XCIgb25DbGljaz17dGhpcy5wcm9wcy5sb2dvdXR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXNpZ25vdXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ubG9nb3V0LmxvZ291dCcpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4bixcbiAgICBzdGF0dXM6IHN0YXRlLnN0YXR1c1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTWVudSk7XG4gIFxuIiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBEcm9wZG93biBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2Uvc3RhdHVzJztcblxuY2xhc3MgUHJvZmlsZUl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGlmICghdGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4pe1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICBpY29uOiBcInVzZXJcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5wcm9maWxlLmxpbmtzLnBlcnNvbmFsJyxcbiAgICAgICAgaHJlZjogXCIvcHJvZmlsZVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcImZvcmdvdHBhc3N3b3JkXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4uZm9vdGVyLmluc3RydWN0aW9ucydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwiaGVscGRlc2tcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5ob21lLmhlbHBkZXNrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJzaWdub3V0XCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4ubG9nb3V0LmxvZ291dCcsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMucHJvcHMubG9nb3V0XG4gICAgICB9XG4gICAgXVxuICAgIHJldHVybiA8RHJvcGRvd24gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gY2xhc3NOYW1lU3VmZml4PVwicHJvZmlsZS1tZW51XCIgaXRlbXM9e2l0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgcmV0dXJuIChjbG9zZURyb3Bkb3duKT0+e3JldHVybiA8TGluayBocmVmPVwiL3Byb2ZpbGVcIlxuICAgICAgICAgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbGluayBsaW5rLWZ1bGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbGluay1wcm9maWxlLW1lbnVgfVxuICAgICAgICAgb25DbGljaz17KC4uLmFyZ3MpPT57Y2xvc2VEcm9wZG93bigpO2l0ZW0ub25DbGljayAmJiBpdGVtLm9uQ2xpY2soLi4uYXJncyl9fSBocmVmPXtpdGVtLmhyZWZ9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gaWNvbi0ke2l0ZW0uaWNvbn1gfT48L3NwYW4+XG4gICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChpdGVtLnRleHQpfTwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPn1cbiAgICAgIH0pfT5cbiAgICAgIDxhIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gYnV0dG9uLXBpbGwgbWFpbi1mdW5jdGlvbi1idXR0b24tcGlsbC1wcm9maWxlXCI+XG4gICAgICAgIDxvYmplY3QgY2xhc3NOYW1lPVwiZW1iYmVkIGVtYmJlZC1mdWxsXCJcbiAgICAgICAgIGRhdGE9e2AvcmVzdC91c2VyL2ZpbGVzL3VzZXIvJHt0aGlzLnByb3BzLnN0YXR1cy51c2VySWR9L2lkZW50aWZpZXIvcHJvZmlsZS1pbWFnZS05NmB9XG4gICAgICAgICB0eXBlPVwiaW1hZ2UvanBlZ1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi11c2VyXCI+PC9zcGFuPlxuICAgICAgICA8L29iamVjdD5cbiAgICAgIDwvYT5cbiAgICA8L0Ryb3Bkb3duPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4bixcbiAgICBzdGF0dXM6IHN0YXRlLnN0YXR1c1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoUHJvZmlsZUl0ZW0pOyIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHt1bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lciwgdW5tb3VudENvbXBvbmVudEF0Tm9kZSwgZmluZERPTU5vZGV9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmNvbnN0IEtFWUNPREVTID0ge1xuICBFU0NBUEU6IDI3XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3J0YWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7IGFjdGl2ZTogZmFsc2UgfTtcbiAgICB0aGlzLmhhbmRsZVdyYXBwZXJDbGljayA9IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCA9IHRoaXMuY2xvc2VQb3J0YWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlS2V5ZG93biA9IHRoaXMuaGFuZGxlS2V5ZG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICB0aGlzLm5vZGUgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRTdGF0ZS5hY3RpdmUpe1xuICAgICAgdGhpcy5yZW5kZXJQb3J0YWwobmV4dFByb3BzKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uRXNjKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TY3JvbGwpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VQb3J0YWwodHJ1ZSk7XG4gIH1cblxuICBoYW5kbGVXcmFwcGVyQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm9wZW5Qb3J0YWwoKTtcbiAgfVxuXG4gIG9wZW5Qb3J0YWwocHJvcHMgPSB0aGlzLnByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICB0aGlzLnJlbmRlclBvcnRhbChwcm9wcywgdHJ1ZSk7XG4gIH1cblxuICBjbG9zZVBvcnRhbChpc1VubW91bnRlZCA9IGZhbHNlKSB7XG4gICAgY29uc3QgcmVzZXRQb3J0YWxTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgICAgdW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgICB0aGlzLm5vZGUgPSBudWxsO1xuICAgICAgaWYgKGlzVW5tb3VudGVkICE9PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmJlZm9yZUNsb3NlKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYmVmb3JlQ2xvc2UodGhpcy5ub2RlLCByZXNldFBvcnRhbFN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc2V0UG9ydGFsU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2soZSkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gZmluZERPTU5vZGUodGhpcy5wb3J0YWwpO1xuICAgIGlmIChyb290LmNvbnRhaW5zKGUudGFyZ2V0KSB8fCAoZS5idXR0b24gJiYgZS5idXR0b24gIT09IDApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmNsb3NlUG9ydGFsKCk7XG4gIH1cblxuICBoYW5kbGVLZXlkb3duKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSBLRVlDT0RFUy5FU0NBUEUgJiYgdGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuY2xvc2VQb3J0YWwoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJQb3J0YWwocHJvcHMsIGlzT3BlbmluZykge1xuICAgIGlmICghdGhpcy5ub2RlKSB7XG4gICAgICB0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5ub2RlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW4gPSBwcm9wcy5jaGlsZHJlbjtcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qaW1mYi9kOTllMDY3OGU5ZGE3MTVjY2Y2NDU0OTYxZWYwNGQxYlxuICAgIGlmICh0eXBlb2YgcHJvcHMuY2hpbGRyZW4udHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2hpbGRyZW4gPSBSZWFjdC5jbG9uZUVsZW1lbnQocHJvcHMuY2hpbGRyZW4sIHtcbiAgICAgICAgY2xvc2VQb3J0YWw6IHRoaXMuY2xvc2VQb3J0YWxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucG9ydGFsID0gdW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIoXG4gICAgICB0aGlzLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICB0aGlzLm5vZGUsXG4gICAgICB0aGlzLnByb3BzLm9uVXBkYXRlXG4gICAgKTtcbiAgICBcbiAgICBpZiAoaXNPcGVuaW5nKSB7XG4gICAgICB0aGlzLnByb3BzLm9uT3Blbih0aGlzLm5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vcGVuQnlDbGlja09uKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucHJvcHMub3BlbkJ5Q2xpY2tPbiwge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZVdyYXBwZXJDbGlja1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblBvcnRhbC5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICBvcGVuQnlDbGlja09uOiBQcm9wVHlwZXMuZWxlbWVudCxcbiAgY2xvc2VPbkVzYzogUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25PdXRzaWRlQ2xpY2s6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZU9uU2Nyb2xsOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25PcGVuOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGJlZm9yZUNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25VcGRhdGU6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5Qb3J0YWwuZGVmYXVsdFByb3BzID0ge1xuICBvbk9wZW46ICgpID0+IHt9LFxuICBvbkNsb3NlOiAoKSA9PiB7fSxcbiAgb25VcGRhdGU6ICgpID0+IHt9XG59OyIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5Db250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuLWNvbnRhaW5lciBzY3JlZW4tY29udGFpbmVyLWZ1bGwtaGVpZ2h0XCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW4tY29udGFpbmVyLXdyYXBwZXJcIj57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj48L2Rpdj5cbiAgfVxufSIsImltcG9ydCBNYWluRnVuY3Rpb25OYXZiYXIgZnJvbSAnLi4vYmFzZS9tYWluLWZ1bmN0aW9uL25hdmJhci5qc3gnO1xuaW1wb3J0IFNjcmVlbkNvbnRhaW5lciBmcm9tICcuLi9nZW5lcmFsL3NjcmVlbi1jb250YWluZXIuanN4JztcblxuaW1wb3J0IEFubm91bmNlbWVudHNQYW5lbCBmcm9tICcuL2JvZHkvYW5ub3VuY2VtZW50cy1wYW5lbC5qc3gnO1xuaW1wb3J0IENvbnRpbnVlU3R1ZGllc1BhbmVsIGZyb20gJy4vYm9keS9jb250aW51ZS1zdHVkaWVzLXBhbmVsLmpzeCc7XG5pbXBvcnQgSW1wb3J0YW50UGFuZWwgZnJvbSAnLi9ib2R5L2ltcG9ydGFudC1wYW5lbC5qc3gnO1xuaW1wb3J0IExhc3RNZXNzYWdlc1BhbmVsIGZyb20gJy4vYm9keS9sYXN0LW1lc3NhZ2VzLXBhbmVsLmpzeCc7XG5pbXBvcnQgV29ya3NwYWNlc1BhbmVsIGZyb20gJy4vYm9keS93b3Jrc3BhY2VzLXBhbmVsLmpzeCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4Qm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLWZ1bGxcIj5cbiAgICAgIDxNYWluRnVuY3Rpb25OYXZiYXIgYWN0aXZlVHJhaWw9XCJpbmRleFwiLz5cbiAgICAgIDxTY3JlZW5Db250YWluZXI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5kZXggb3JkZXJlZC1jb250YWluZXIgb3JkZXJlZC1jb250YWluZXItcm93IG9yZGVyZWQtY29udGFpbmVyLXJlc3BvbnNpdmUgaW5kZXgtb3JkZXJlZC1jb250YWluZXItZm9yLXBhbmVsc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCBvcmRlcmVkLWNvbnRhaW5lciBpbmRleC1vcmRlcmVkLWNvbnRhaW5lci1mb3ItcGFuZWxzLWNvbHVtblwiPlxuICAgICAgICAgICAgICA8Q29udGludWVTdHVkaWVzUGFuZWwvPlxuICAgICAgICAgICAgICA8V29ya3NwYWNlc1BhbmVsLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCBvcmRlcmVkLWNvbnRhaW5lciBpbmRleC1vcmRlcmVkLWNvbnRhaW5lci1mb3ItcGFuZWxzLWNvbHVtblwiPlxuICAgICAgICAgICAgICA8TGFzdE1lc3NhZ2VzUGFuZWwvPlxuICAgICAgICAgICAgICA8SW1wb3J0YW50UGFuZWwvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IG9yZGVyZWQtY29udGFpbmVyIGluZGV4LW9yZGVyZWQtY29udGFpbmVyLWZvci1wYW5lbHMtY29sdW1uXCI+XG4gICAgICAgICAgICAgIDxBbm5vdW5jZW1lbnRzUGFuZWwvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9TY3JlZW5Db250YWluZXI+XG4gICAgPC9kaXY+KTtcbiAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4uLy4uL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBBbm5vdW5jZW1lbnRzUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1mb3ItcGFuZWxzLXRpdGxlIGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZS1hbm5vdW5jZW1lbnRzXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1hbm5vdW5jZXJcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udFBhZ2UuYW5ub3VuY2VtZW50cycpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAge3RoaXMucHJvcHMuYW5ub3VuY2VtZW50cy5sZW5ndGggIT09IDAgP1xuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IGl0ZW0tbGlzdCBpbmRleC1pdGVtLWxpc3QtcGFuZWwtYW5ub3VuY2VtZW50c1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmFubm91bmNlbWVudHMubWFwKChhbm5vdW5jZW1lbnQpPT57XG4gICAgICAgICAgICByZXR1cm4gPExpbmsga2V5PXthbm5vdW5jZW1lbnQuaWR9IGNsYXNzTmFtZT17YGl0ZW0tbGlzdC1pdGVtICR7YW5ub3VuY2VtZW50LndvcmtzcGFjZXMgPyBcIml0ZW0tbGlzdC1pdGVtLWhhcy13b3Jrc3BhY2VzXCIgOiBcIlwifWB9XG4gICAgICAgICAgICAgIGhyZWY9e2AvYW5ub3VuY2VtZW50cz9hbm5vdW5jZW1lbnRJZD0ke2Fubm91bmNlbWVudC5pZH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWFubm91bmNlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dCBpdGVtLWxpc3QtdGV4dC1ib2R5IGl0ZW0tbGlzdC10ZXh0LWJvZHktbXVsdGlsaW5lXCI+XG4gICAgICAgICAgICAgICAge2Fubm91bmNlbWVudC5jYXB0aW9ufVxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1hbm5vdW5jZW1lbnRzLWRhdGVcIj5cbiAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGltZS5mb3JtYXQoYW5ub3VuY2VtZW50LmNyZWF0ZWQpfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj4gIFxuICAgICAgOlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1wYW5lbC1uby1hbm5vdW5jZW1lbnRzXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChcInBsdWdpbi5hbm5vdW5jZXIuZW1wdHkudGl0bGVcIil9PC9kaXY+XG4gICAgICB9XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzLFxuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgYW5ub3VuY2VtZW50czogc3RhdGUuYW5ub3VuY2VtZW50c1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEFubm91bmNlbWVudHNQYW5lbCk7IiwiLy9UT0RPIHBsZWFzZSB0cmFuc2xhdGUgdGhpcy4uLiA+OmNcbi8vWW91IHNlZSB0aG9zZSBsYW5ndWFnZSBzdHJpbmdzLi4uXG5cbmltcG9ydCBMaW5rIGZyb20gJy4uLy4uL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5jbGFzcyBDb250aW51ZVN0dWRpZXNQYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIGlmICghdGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4pe1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICghdGhpcy5wcm9wcy5sYXN0V29ya3NwYWNlKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCB0ZXh0IGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZSBpbmRleC10ZXh0LWZvci1wYW5lbHMtdGl0bGUtY29udGludWUtc3R1ZGllc1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tcmV2ZXJ0XCI+PC9zcGFuPlxuICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRQYWdlLmxhc3RXb3Jrc3BhY2UuY29udGludWVTdHVkaWVzTGluaycpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGgyIGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1wYW5lbC1jb250aW51ZS1zdHVkaWVzLXdvcmtzcGFjZS1uYW1lXCI+XG4gICAgICAgIHt0aGlzLnByb3BzLmxhc3RXb3Jrc3BhY2Uud29ya3NwYWNlTmFtZX1cbiAgICAgIDwvaDI+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmRleCB0ZXh0IGluZGV4LXRleHQtcGFuZWwtY29udGludWUtc3R1ZGllc1wiPlxuICAgICAgICBPbGl0IHZpbWVrc2kgc2l2dWxsYXtcIiBcIn08Yj48aT57dGhpcy5wcm9wcy5sYXN0V29ya3NwYWNlLm1hdGVyaWFsTmFtZX08L2k+PC9iPntcIiBcIn1cbiAgICAgICAgPExpbmsgaHJlZj17dGhpcy5wcm9wcy5sYXN0V29ya3NwYWNlLnVybH0+SmF0a2Egb3BpbnRvamE8L0xpbms+XG4gICAgICA8L3NwYW4+XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzLFxuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgbGFzdFdvcmtzcGFjZTogc3RhdGUubGFzdFdvcmtzcGFjZVxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKENvbnRpbnVlU3R1ZGllc1BhbmVsKTsiLCIvLzwhLS0gRGlzY3VzcyB3aXRoIE5pbmEgYWJvdXQgaW1wbGVtZW50YXRpb24gb2YgdGhlc2UgLS0+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5kZXggdGV4dCBpbmRleC10ZXh0LWZvci1wYW5lbHMtdGl0bGUgaW5kZXgtdGV4dC1mb3ItcGFuZWxzLXRpdGxlLWltcG9ydGFudFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbiBpY29uLXN0YXJcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4+I3tpMThuLnRleHRbJ3BsdWdpbi5mcm9udFBhZ2UuaW1wb3J0YW50J119PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWNvbnRyb2xsZXItd2lkZ2V0PVwicGFuZWwtaW1wb3J0YW50XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPCEtLSBUaGUgZHVzdCB0ZW1wbGF0ZSwgbm9yIHRoZSBjc3MgY2xhc3NlcyBpbnNpZGUgYXJlIGltcGxlbWVudGVkIC0tPlxuLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG4vL1RPRE8gbm90IGltcGxlbWVudGVkXG4vL29uIHRoZSB0b3AgdGhlIHByZXZpb3VzIHBpZWNlIG9mIGNvZGVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcG9ydGFudFBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgTGluayBmcm9tICcuLi8uLi9nZW5lcmFsL2xpbmsuanN4JztcblxuY2xhc3MgTGFzdE1lc3NhZ2VzUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwib3JkZXJlZC1jb250YWluZXItaXRlbSBpbmRleCBwYW5lbFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmRleCB0ZXh0IGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZSBpbmRleC10ZXh0LWZvci1wYW5lbHMtdGl0bGUtbGFzdC1tZXNzYWdlc1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tZW52ZWxvcGVcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udFBhZ2UuY29tbXVuaWNhdG9yLmxhc3RNZXNzYWdlcycpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAge3RoaXMucHJvcHMubGFzdE1lc3NhZ2VzID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IGl0ZW0tbGlzdCBpbmRleC1pdGVtLWxpc3QtcGFuZWwtbGFzdC1tZXNzYWdlc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhc3RNZXNzYWdlcy5tYXAoKG1lc3NhZ2UpPT57XG4gICAgICAgICAgICByZXR1cm4gKDxMaW5rIGtleT17bWVzc2FnZS5pZH0gY2xhc3NOYW1lPXtgaXRlbS1saXN0LWl0ZW0gJHttZXNzYWdlLnVucmVhZE1lc3NhZ2VzSW5UaHJlYWQgPyBcIml0ZW0tbGlzdC1pdGVtLXVucmVhZFwiIDogXCJcIn1gfVxuICAgICAgICAgICAgICAgICAgICBocmVmPXtgL2NvbW11bmljYXRvciNpbmJveC8ke21lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkfWB9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tZW52ZWxvcGUke21lc3NhZ2UudW5yZWFkTWVzc2FnZXNJblRocmVhZCA/IFwiLWFsdFwiIDogXCJcIn1gfT48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQgaXRlbS1saXN0LXRleHQtYm9keSBpdGVtLWxpc3QtdGV4dC1ib2R5LW11bHRpbGluZVwiPlxuICAgICAgICAgICAgICAgIHttZXNzYWdlLmNhcHRpb259XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5kZXggdGV4dCBpbmRleC10ZXh0LWxhc3QtbWVzc2FnZS1kYXRlXCI+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRpbWUuZm9ybWF0KG1lc3NhZ2UuY3JlYXRlZCl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L0xpbms+KTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1wYW5lbC1uby1sYXN0LW1lc3NhZ2VzXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldChcInBsdWdpbi5mcm9udFBhZ2UubWVzc2FnZXMubm9NZXNzYWdlc1wiKX08L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgbGFzdE1lc3NhZ2VzOiBzdGF0ZS5sYXN0TWVzc2FnZXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShMYXN0TWVzc2FnZXNQYW5lbCk7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IExpbmsgZnJvbSAnLi4vLi4vZ2VuZXJhbC9saW5rLmpzeCc7XG5cbmNsYXNzIFdvcmtzcGFjZXNQYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJvcmRlcmVkLWNvbnRhaW5lci1pdGVtIGluZGV4IHBhbmVsXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IHRleHQgaW5kZXgtdGV4dC1mb3ItcGFuZWxzLXRpdGxlIGluZGV4LXRleHQtZm9yLXBhbmVscy10aXRsZS13b3Jrc3BhY2VzXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1ib29rc1wiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZyb250UGFnZS53b3Jrc3BhY2VzLnRpdGxlJyl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICB7dGhpcy5wcm9wcy53b3Jrc3BhY2VzID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGV4IGl0ZW0tbGlzdCBpbmRleC1pdGVtLWxpc3QtcGFuZWwtd29ya3NwYWNlc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLndvcmtzcGFjZXMubWFwKCh3b3Jrc3BhY2UpPT57XG4gICAgICAgICAgICByZXR1cm4gPExpbmsga2V5PXt3b3Jrc3BhY2UuaWR9IGNsYXNzTmFtZT1cIml0ZW0tbGlzdC1pdGVtXCIgaHJlZj17YC93b3Jrc3BhY2UvJHt3b3Jrc3BhY2UudXJsTmFtZX1gfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWJvb2tzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpdGVtLWxpc3QtdGV4dC1ib2R5IHRleHRcIj5cbiAgICAgICAgICAgICAgICB7YCR7d29ya3NwYWNlLm5hbWV9ICR7d29ya3NwYWNlLm5hbWVFeHRlbnNpb24gPyB3b3Jrc3BhY2UubmFtZUV4dGVuc2lvbiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5kZXggdGV4dCBpbmRleC10ZXh0LXBhbmVsLW5vLXdvcmtzcGFjZXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRQYWdlLndvcmtzcGFjZXMubm9Xb3Jrc3BhY2VzLnBhcnQxJyl9XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9jb3Vyc2VwaWNrZXJcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mcm9udFBhZ2Uud29ya3NwYWNlcy5ub1dvcmtzcGFjZXMuY291cnNlcGlja2VyJyl9XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIHtcIiBcIn17dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uZnJvbnRQYWdlLndvcmtzcGFjZXMubm9Xb3Jrc3BhY2VzLnBhcnQyJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgd29ya3NwYWNlczogc3RhdGUud29ya3NwYWNlc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKFdvcmtzcGFjZXNQYW5lbCk7IiwiaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4JztcbmltcG9ydCBCb2R5IGZyb20gJy4uL2NvbXBvbmVudHMvaW5kZXgvYm9keS5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgaWQ9XCJyb290XCI+XG4gICAgICA8Tm90aWZpY2F0aW9ucz48L05vdGlmaWNhdGlvbnM+XG4gICAgICA8Qm9keT48L0JvZHk+XG4gICAgPC9kaXY+KTtcbiAgfVxufSIsImltcG9ydCB7bG9nZ2VyfSBmcm9tICdyZWR1eC1sb2dnZXInO1xuaW1wb3J0IHRodW5rIGZyb20gJ3JlZHV4LXRodW5rJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1Byb3ZpZGVyLCBjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2NyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmV9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB7IGNvbXBvc2VXaXRoRGV2VG9vbHMgfSBmcm9tICdyZWR1eC1kZXZ0b29scy1leHRlbnNpb24nO1xuaW1wb3J0IHtyZW5kZXJ9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJ1bkFwcChyZWR1Y2VyLCBBcHAsIGNhbGxiYWNrKXtcbiAgbGV0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgY29tcG9zZVdpdGhEZXZUb29scyhhcHBseU1pZGRsZXdhcmUodGh1bmssIGxvZ2dlcikpKTtcblxuICByZW5kZXIoPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgPEFwcC8+XG4gIDwvUHJvdmlkZXI+LCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FwcFwiKSk7XG4gIFxuICBsZXQgbmV3U3RvcmUgPSB7XG4gICAgZGlzcGF0Y2goYWN0aW9uKXtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24oc3RvcmUuZGlzcGF0Y2gsIHN0b3JlLmdldFN0YXRlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgfSxcbiAgICBzdWJzY3JpYmUoLi4uYXJncyl7XG4gICAgICByZXR1cm4gc3RvcmUuc3Vic2NyaWJlKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgZ2V0U3RhdGUoLi4uYXJncyl7XG4gICAgICByZXR1cm4gc3RvcmUuZ2V0U3RhdGUoLi4uYXJncyk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVkdWNlciguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5yZXBsYWNlUmVkdWNlciguLi5hcmdzKTtcbiAgICB9XG4gIH1cbiAgXG4vLyAgY29uc3Qgb0Nvbm5lY3QgPSBSZWFjdFJlZHV4LmNvbm5lY3Q7XG4vLyAgUmVhY3RSZWR1eC5jb25uZWN0ID0gZnVuY3Rpb24obWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpe1xuLy8gICAgcmV0dXJuIG9Db25uZWN0KChzdGF0ZSk9Pntcbi8vICAgICAgbGV0IHZhbHVlID0gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKTtcbi8vICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goKGtleSk9Pntcbi8vICAgICAgICBpZiAodHlwZW9mIHZhbHVlW2tleV0gPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBzdGF0ZSB2YWx1ZSBmb3Iga2V5IFwiICsga2V5ICsgXCIgeW91IG1vc3QgbGlrZWx5IGZvcmdvdCB0byBjb21iaW5lIHRoZSByZWR1Y2VycyB3aXRoaW4gdGhlIHJvb3QgcmVkdWNlciBmaWxlXCIpO1xuLy8gICAgICAgIH1cbi8vICAgICAgfSk7XG4vLyAgICB9LCBtYXBEaXNwYXRjaFRvUHJvcHMpO1xuLy8gIH1cbiAgXG4gIHdpbmRvdy5TVE9SRV9ERUJVRyA9IG5ld1N0b3JlO1xuICBjYWxsYmFjayAmJiBjYWxsYmFjayhuZXdTdG9yZSk7XG59IiwiaW1wb3J0IEFwcCBmcm9tICcuL2NvbnRhaW5lcnMvaW5kZXguanN4JztcbmltcG9ydCByZWR1Y2VyIGZyb20gJy4vcmVkdWNlcnMvaW5kZXgnO1xuaW1wb3J0IHJ1bkFwcCBmcm9tICcuL2RlZmF1bHQuZGVidWcuanN4JztcbmltcG9ydCBXZWJzb2NrZXQgZnJvbSAnLi91dGlsL3dlYnNvY2tldCc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucy9tYWluLWZ1bmN0aW9uJztcblxucnVuQXBwKHJlZHVjZXIsIEFwcCwgKHN0b3JlKT0+e1xuICBsZXQgd2Vic29ja2V0ID0gbmV3IFdlYnNvY2tldChzdG9yZSwge1xuICAgIFwiQ29tbXVuaWNhdG9yOm5ld21lc3NhZ2VyZWNlaXZlZFwiOiBbYWN0aW9ucy51cGRhdGVNZXNzYWdlQ291bnQsIGFjdGlvbnMubGFzdE1lc3NhZ2VzLnVwZGF0ZUxhc3RNZXNzYWdlcy5iaW5kKG51bGwsIDYpXSxcbiAgICBcIkNvbW11bmljYXRvcjptZXNzYWdlcmVhZFwiOiBbYWN0aW9ucy51cGRhdGVNZXNzYWdlQ291bnQsIGFjdGlvbnMubGFzdE1lc3NhZ2VzLnVwZGF0ZUxhc3RNZXNzYWdlcy5iaW5kKG51bGwsIDYpXSxcbiAgICBcIkNvbW11bmljYXRvcjp0aHJlYWRkZWxldGVkXCI6IFthY3Rpb25zLnVwZGF0ZU1lc3NhZ2VDb3VudCwgYWN0aW9ucy5sYXN0TWVzc2FnZXMudXBkYXRlTGFzdE1lc3NhZ2VzLmJpbmQobnVsbCwgNildXG4gIH0pO1xuICBzdG9yZS5kaXNwYXRjaChhY3Rpb25zLm1lc3NhZ2VDb3VudC51cGRhdGVNZXNzYWdlQ291bnQoKSk7XG4gIHN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuYW5ub3VuY2VtZW50cy51cGRhdGVBbm5vdW5jZW1lbnRzKCkpO1xuICBzdG9yZS5kaXNwYXRjaChhY3Rpb25zLmxhc3RXb3Jrc3BhY2UudXBkYXRlTGFzdFdvcmtzcGFjZSgpKTtcbiAgc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy53b3Jrc3BhY2VzLnVwZGF0ZVdvcmtzcGFjZXMoKSk7XG4gIHN0b3JlLmRpc3BhdGNoKGFjdGlvbnMubGFzdE1lc3NhZ2VzLnVwZGF0ZUxhc3RNZXNzYWdlcyg2KSk7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCk7XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9lbXB0eUZ1bmN0aW9uJyk7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZW1wdHlGdW5jdGlvbjtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgIHJldHVybjsgLy8gSWdub3JlIENvbXBvc2l0ZUNvbXBvbmVudCBwcm9wdHlwZSBjaGVjay5cbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbiAgdmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaW52YXJpYW50KHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSA9PT0gJ2Z1bmN0aW9uJywgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gJyArICdSZWFjdC5Qcm9wVHlwZXMuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lKTtcbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgJXMgdHlwZTogJXMlcycsIGxvY2F0aW9uLCBlcnJvci5tZXNzYWdlLCBzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzaGltKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgaWYgKHNlY3JldCA9PT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgIC8vIEl0IGlzIHN0aWxsIHNhZmUgd2hlbiBjYWxsZWQgZnJvbSBSZWFjdC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW52YXJpYW50KFxuICAgICAgZmFsc2UsXG4gICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAnVXNlIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICApO1xuICB9O1xuICBzaGltLmlzUmVxdWlyZWQgPSBzaGltO1xuICBmdW5jdGlvbiBnZXRTaGltKCkge1xuICAgIHJldHVybiBzaGltO1xuICB9O1xuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IHNoaW0sXG4gICAgYm9vbDogc2hpbSxcbiAgICBmdW5jOiBzaGltLFxuICAgIG51bWJlcjogc2hpbSxcbiAgICBvYmplY3Q6IHNoaW0sXG4gICAgc3RyaW5nOiBzaGltLFxuICAgIHN5bWJvbDogc2hpbSxcblxuICAgIGFueTogc2hpbSxcbiAgICBhcnJheU9mOiBnZXRTaGltLFxuICAgIGVsZW1lbnQ6IHNoaW0sXG4gICAgaW5zdGFuY2VPZjogZ2V0U2hpbSxcbiAgICBub2RlOiBzaGltLFxuICAgIG9iamVjdE9mOiBnZXRTaGltLFxuICAgIG9uZU9mOiBnZXRTaGltLFxuICAgIG9uZU9mVHlwZTogZ2V0U2hpbSxcbiAgICBzaGFwZTogZ2V0U2hpbVxuICB9O1xuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gZW1wdHlGdW5jdGlvbjtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vY2hlY2tQcm9wVHlwZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAvKiBnbG9iYWwgU3ltYm9sICovXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIG1ldGhvZCBmdW5jdGlvbiBjb250YWluZWQgb24gdGhlIGl0ZXJhYmxlIG9iamVjdC5cbiAgICpcbiAgICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gICAqXG4gICAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gICAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgKiAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobXlJdGVyYWJsZSk7XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICAgKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICAgKlxuICAgKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gICAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gICAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAgICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAgICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICAgKiAgICAgfSxcbiAgICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAgICpcbiAgICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gICAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICAgKlxuICAgKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gICAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAgICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICAgKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICogICAgICAgICAgKTtcbiAgICogICAgICAgIH1cbiAgICogICAgICB9XG4gICAqICAgIH0sXG4gICAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICAgKiAgfSk7XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICB2YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJXMgYXQgaW5kZXggJXMuJyxcbiAgICAgICAgICBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlciksXG4gICAgICAgICAgaVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9ICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmXG4gICAgU3ltYm9sLmZvciAmJlxuICAgIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSkgfHxcbiAgICAweGVhYzc7XG5cbiAgdmFyIGlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICBvYmplY3QgIT09IG51bGwgJiZcbiAgICAgIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICB9O1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29tcG9zZSA9IHJlcXVpcmUoJ3JlZHV4JykuY29tcG9zZTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY29tcG9zZVdpdGhEZXZUb29scyA9IChcbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA/XG4gICAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA6XG4gICAgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JykgcmV0dXJuIGNvbXBvc2U7XG4gICAgICByZXR1cm4gY29tcG9zZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbik7XG5cbmV4cG9ydHMuZGV2VG9vbHNFbmhhbmNlciA9IChcbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gP1xuICAgIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fIDpcbiAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGZ1bmN0aW9uKG5vb3ApIHsgcmV0dXJuIG5vb3A7IH0gfVxuKTtcbiIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5yZWR1eExvZ2dlcj1lLnJlZHV4TG9nZ2VyfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Uuc3VwZXJfPXQsZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmUsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSl9ZnVuY3Rpb24gcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwia2luZFwiLHt2YWx1ZTplLGVudW1lcmFibGU6ITB9KSx0JiZ0Lmxlbmd0aCYmT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJwYXRoXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG4oZSx0LHIpe24uc3VwZXJfLmNhbGwodGhpcyxcIkVcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInJoc1wiLHt2YWx1ZTpyLGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBvKGUsdCl7by5zdXBlcl8uY2FsbCh0aGlzLFwiTlwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGkoZSx0KXtpLnN1cGVyXy5jYWxsKHRoaXMsXCJEXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJsaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gYShlLHQscil7YS5zdXBlcl8uY2FsbCh0aGlzLFwiQVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaW5kZXhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpdGVtXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGYoZSx0LHIpe3ZhciBuPWUuc2xpY2UoKHJ8fHQpKzF8fGUubGVuZ3RoKTtyZXR1cm4gZS5sZW5ndGg9dDwwP2UubGVuZ3RoK3Q6dCxlLnB1c2guYXBwbHkoZSxuKSxlfWZ1bmN0aW9uIHUoZSl7dmFyIHQ9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpO3JldHVyblwib2JqZWN0XCIhPT10P3Q6ZT09PU1hdGg/XCJtYXRoXCI6bnVsbD09PWU/XCJudWxsXCI6QXJyYXkuaXNBcnJheShlKT9cImFycmF5XCI6XCJbb2JqZWN0IERhdGVdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSk/XCJkYXRlXCI6XCJmdW5jdGlvblwiPT10eXBlb2YgZS50b1N0cmluZyYmL15cXC8uKlxcLy8udGVzdChlLnRvU3RyaW5nKCkpP1wicmVnZXhwXCI6XCJvYmplY3RcIn1mdW5jdGlvbiBsKGUsdCxyLGMscyxkLHApe3M9c3x8W10scD1wfHxbXTt2YXIgZz1zLnNsaWNlKDApO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkKXtpZihjKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBjJiZjKGcsZCkpcmV0dXJuO2lmKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGM/XCJ1bmRlZmluZWRcIjpOKGMpKSl7aWYoYy5wcmVmaWx0ZXImJmMucHJlZmlsdGVyKGcsZCkpcmV0dXJuO2lmKGMubm9ybWFsaXplKXt2YXIgaD1jLm5vcm1hbGl6ZShnLGQsZSx0KTtoJiYoZT1oWzBdLHQ9aFsxXSl9fX1nLnB1c2goZCl9XCJyZWdleHBcIj09PXUoZSkmJlwicmVnZXhwXCI9PT11KHQpJiYoZT1lLnRvU3RyaW5nKCksdD10LnRvU3RyaW5nKCkpO3ZhciB5PVwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6TihlKSx2PVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6Tih0KSxiPVwidW5kZWZpbmVkXCIhPT15fHxwJiZwW3AubGVuZ3RoLTFdLmxocyYmcFtwLmxlbmd0aC0xXS5saHMuaGFzT3duUHJvcGVydHkoZCksbT1cInVuZGVmaW5lZFwiIT09dnx8cCYmcFtwLmxlbmd0aC0xXS5yaHMmJnBbcC5sZW5ndGgtMV0ucmhzLmhhc093blByb3BlcnR5KGQpO2lmKCFiJiZtKXIobmV3IG8oZyx0KSk7ZWxzZSBpZighbSYmYilyKG5ldyBpKGcsZSkpO2Vsc2UgaWYodShlKSE9PXUodCkpcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJkYXRlXCI9PT11KGUpJiZlLXQhPT0wKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwib2JqZWN0XCI9PT15JiZudWxsIT09ZSYmbnVsbCE9PXQpaWYocC5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHQubGhzPT09ZX0pLmxlbmd0aCllIT09dCYmcihuZXcgbihnLGUsdCkpO2Vsc2V7aWYocC5wdXNoKHtsaHM6ZSxyaHM6dH0pLEFycmF5LmlzQXJyYXkoZSkpe3ZhciB3O2UubGVuZ3RoO2Zvcih3PTA7dzxlLmxlbmd0aDt3Kyspdz49dC5sZW5ndGg/cihuZXcgYShnLHcsbmV3IGkodm9pZCAwLGVbd10pKSk6bChlW3ddLHRbd10scixjLGcsdyxwKTtmb3IoO3c8dC5sZW5ndGg7KXIobmV3IGEoZyx3LG5ldyBvKHZvaWQgMCx0W3crK10pKSl9ZWxzZXt2YXIgeD1PYmplY3Qua2V5cyhlKSxTPU9iamVjdC5rZXlzKHQpO3guZm9yRWFjaChmdW5jdGlvbihuLG8pe3ZhciBpPVMuaW5kZXhPZihuKTtpPj0wPyhsKGVbbl0sdFtuXSxyLGMsZyxuLHApLFM9ZihTLGkpKTpsKGVbbl0sdm9pZCAwLHIsYyxnLG4scCl9KSxTLmZvckVhY2goZnVuY3Rpb24oZSl7bCh2b2lkIDAsdFtlXSxyLGMsZyxlLHApfSl9cC5sZW5ndGg9cC5sZW5ndGgtMX1lbHNlIGUhPT10JiYoXCJudW1iZXJcIj09PXkmJmlzTmFOKGUpJiZpc05hTih0KXx8cihuZXcgbihnLGUsdCkpKX1mdW5jdGlvbiBjKGUsdCxyLG4pe3JldHVybiBuPW58fFtdLGwoZSx0LGZ1bmN0aW9uKGUpe2UmJm4ucHVzaChlKX0sciksbi5sZW5ndGg/bjp2b2lkIDB9ZnVuY3Rpb24gcyhlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBvW3IucGF0aFtuXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpvW3IucGF0aFtuXV09ci5yaHN9fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmU9ZihlLHQpO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6ZVt0XT1yLnJoc31yZXR1cm4gZX1mdW5jdGlvbiBkKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe2Zvcih2YXIgbj1lLG89LTEsaT1yLnBhdGg/ci5wYXRoLmxlbmd0aC0xOjA7KytvPGk7KVwidW5kZWZpbmVkXCI9PXR5cGVvZiBuW3IucGF0aFtvXV0mJihuW3IucGF0aFtvXV09XCJudW1iZXJcIj09dHlwZW9mIHIucGF0aFtvXT9bXTp7fSksbj1uW3IucGF0aFtvXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoci5wYXRoP25bci5wYXRoW29dXTpuLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG5bci5wYXRoW29dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm5bci5wYXRoW29dXT1yLnJoc319fWZ1bmN0aW9uIHAoZSx0LHIpe2lmKHIucGF0aCYmci5wYXRoLmxlbmd0aCl7dmFyIG4sbz1lW3RdLGk9ci5wYXRoLmxlbmd0aC0xO2ZvcihuPTA7bjxpO24rKylvPW9bci5wYXRoW25dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChvW3IucGF0aFtuXV0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpvW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiRVwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIG9bci5wYXRoW25dXX19ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZVt0XT1yLmxoczticmVhaztjYXNlXCJFXCI6ZVt0XT1yLmxoczticmVhaztjYXNlXCJOXCI6ZT1mKGUsdCl9cmV0dXJuIGV9ZnVuY3Rpb24gZyhlLHQscil7aWYoZSYmdCYmciYmci5raW5kKXt2YXIgbixvLGk9ZTtmb3Iobz1yLnBhdGgubGVuZ3RoLTEsbj0wO248bztuKyspXCJ1bmRlZmluZWRcIj09dHlwZW9mIGlbci5wYXRoW25dXSYmKGlbci5wYXRoW25dXT17fSksaT1pW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoaVtyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6aVtyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIkVcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBpW3IucGF0aFtuXV19fX1mdW5jdGlvbiBoKGUsdCxyKXtpZihlJiZ0KXt2YXIgbj1mdW5jdGlvbihuKXtyJiYhcihlLHQsbil8fGQoZSx0LG4pfTtsKGUsdCxuKX19ZnVuY3Rpb24geShlKXtyZXR1cm5cImNvbG9yOiBcIitGW2VdLmNvbG9yK1wiOyBmb250LXdlaWdodDogYm9sZFwifWZ1bmN0aW9uIHYoZSl7dmFyIHQ9ZS5raW5kLHI9ZS5wYXRoLG49ZS5saHMsbz1lLnJocyxpPWUuaW5kZXgsYT1lLml0ZW07c3dpdGNoKHQpe2Nhc2VcIkVcIjpyZXR1cm5bci5qb2luKFwiLlwiKSxuLFwi4oaSXCIsb107Y2FzZVwiTlwiOnJldHVybltyLmpvaW4oXCIuXCIpLG9dO2Nhc2VcIkRcIjpyZXR1cm5bci5qb2luKFwiLlwiKV07Y2FzZVwiQVwiOnJldHVybltyLmpvaW4oXCIuXCIpK1wiW1wiK2krXCJdXCIsYV07ZGVmYXVsdDpyZXR1cm5bXX19ZnVuY3Rpb24gYihlLHQscixuKXt2YXIgbz1jKGUsdCk7dHJ5e24/ci5ncm91cENvbGxhcHNlZChcImRpZmZcIik6ci5ncm91cChcImRpZmZcIil9Y2F0Y2goZSl7ci5sb2coXCJkaWZmXCIpfW8/by5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWUua2luZCxuPXYoZSk7ci5sb2cuYXBwbHkocixbXCIlYyBcIitGW3RdLnRleHQseSh0KV0uY29uY2F0KFAobikpKX0pOnIubG9nKFwi4oCU4oCUIG5vIGRpZmYg4oCU4oCUXCIpO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgZGlmZiBlbmQg4oCU4oCUIFwiKX19ZnVuY3Rpb24gbShlLHQscixuKXtzd2l0Y2goXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpKXtjYXNlXCJvYmplY3RcIjpyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlW25dP2Vbbl0uYXBwbHkoZSxQKHIpKTplW25dO2Nhc2VcImZ1bmN0aW9uXCI6cmV0dXJuIGUodCk7ZGVmYXVsdDpyZXR1cm4gZX19ZnVuY3Rpb24gdyhlKXt2YXIgdD1lLnRpbWVzdGFtcCxyPWUuZHVyYXRpb247cmV0dXJuIGZ1bmN0aW9uKGUsbixvKXt2YXIgaT1bXCJhY3Rpb25cIl07cmV0dXJuIGkucHVzaChcIiVjXCIrU3RyaW5nKGUudHlwZSkpLHQmJmkucHVzaChcIiVjQCBcIituKSxyJiZpLnB1c2goXCIlYyhpbiBcIitvLnRvRml4ZWQoMikrXCIgbXMpXCIpLGkuam9pbihcIiBcIil9fWZ1bmN0aW9uIHgoZSx0KXt2YXIgcj10LmxvZ2dlcixuPXQuYWN0aW9uVHJhbnNmb3JtZXIsbz10LnRpdGxlRm9ybWF0dGVyLGk9dm9pZCAwPT09bz93KHQpOm8sYT10LmNvbGxhcHNlZCxmPXQuY29sb3JzLHU9dC5sZXZlbCxsPXQuZGlmZixjPVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0LnRpdGxlRm9ybWF0dGVyO2UuZm9yRWFjaChmdW5jdGlvbihvLHMpe3ZhciBkPW8uc3RhcnRlZCxwPW8uc3RhcnRlZFRpbWUsZz1vLmFjdGlvbixoPW8ucHJldlN0YXRlLHk9by5lcnJvcix2PW8udG9vayx3PW8ubmV4dFN0YXRlLHg9ZVtzKzFdO3gmJih3PXgucHJldlN0YXRlLHY9eC5zdGFydGVkLWQpO3ZhciBTPW4oZyksaz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBhP2EoZnVuY3Rpb24oKXtyZXR1cm4gd30sZyxvKTphLGo9RChwKSxFPWYudGl0bGU/XCJjb2xvcjogXCIrZi50aXRsZShTKStcIjtcIjpcIlwiLEE9W1wiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiXTtBLnB1c2goRSksdC50aW1lc3RhbXAmJkEucHVzaChcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIiksdC5kdXJhdGlvbiYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKTt2YXIgTz1pKFMsaix2KTt0cnl7az9mLnRpdGxlJiZjP3IuZ3JvdXBDb2xsYXBzZWQuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXBDb2xsYXBzZWQoTyk6Zi50aXRsZSYmYz9yLmdyb3VwLmFwcGx5KHIsW1wiJWMgXCIrT10uY29uY2F0KEEpKTpyLmdyb3VwKE8pfWNhdGNoKGUpe3IubG9nKE8pfXZhciBOPW0odSxTLFtoXSxcInByZXZTdGF0ZVwiKSxQPW0odSxTLFtTXSxcImFjdGlvblwiKSxDPW0odSxTLFt5LGhdLFwiZXJyb3JcIiksRj1tKHUsUyxbd10sXCJuZXh0U3RhdGVcIik7aWYoTilpZihmLnByZXZTdGF0ZSl7dmFyIEw9XCJjb2xvcjogXCIrZi5wcmV2U3RhdGUoaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltOXShcIiVjIHByZXYgc3RhdGVcIixMLGgpfWVsc2UgcltOXShcInByZXYgc3RhdGVcIixoKTtpZihQKWlmKGYuYWN0aW9uKXt2YXIgVD1cImNvbG9yOiBcIitmLmFjdGlvbihTKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW1BdKFwiJWMgYWN0aW9uICAgIFwiLFQsUyl9ZWxzZSByW1BdKFwiYWN0aW9uICAgIFwiLFMpO2lmKHkmJkMpaWYoZi5lcnJvcil7dmFyIE09XCJjb2xvcjogXCIrZi5lcnJvcih5LGgpK1wiOyBmb250LXdlaWdodDogYm9sZDtcIjtyW0NdKFwiJWMgZXJyb3IgICAgIFwiLE0seSl9ZWxzZSByW0NdKFwiZXJyb3IgICAgIFwiLHkpO2lmKEYpaWYoZi5uZXh0U3RhdGUpe3ZhciBfPVwiY29sb3I6IFwiK2YubmV4dFN0YXRlKHcpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbRl0oXCIlYyBuZXh0IHN0YXRlXCIsXyx3KX1lbHNlIHJbRl0oXCJuZXh0IHN0YXRlXCIsdyk7bCYmYihoLHcscixrKTt0cnl7ci5ncm91cEVuZCgpfWNhdGNoKGUpe3IubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpfX0pfWZ1bmN0aW9uIFMoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sdD1PYmplY3QuYXNzaWduKHt9LEwsZSkscj10LmxvZ2dlcixuPXQuc3RhdGVUcmFuc2Zvcm1lcixvPXQuZXJyb3JUcmFuc2Zvcm1lcixpPXQucHJlZGljYXRlLGE9dC5sb2dFcnJvcnMsZj10LmRpZmZQcmVkaWNhdGU7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHIpcmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTtpZihlLmdldFN0YXRlJiZlLmRpc3BhdGNoKXJldHVybiBjb25zb2xlLmVycm9yKFwiW3JlZHV4LWxvZ2dlcl0gcmVkdXgtbG9nZ2VyIG5vdCBpbnN0YWxsZWQuIE1ha2Ugc3VyZSB0byBwYXNzIGxvZ2dlciBpbnN0YW5jZSBhcyBtaWRkbGV3YXJlOlxcbi8vIExvZ2dlciB3aXRoIGRlZmF1bHQgb3B0aW9uc1xcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcbi8vIE9yIHlvdSBjYW4gY3JlYXRlIHlvdXIgb3duIGxvZ2dlciB3aXRoIGN1c3RvbSBvcHRpb25zIGh0dHA6Ly9iaXQubHkvcmVkdXgtbG9nZ2VyLW9wdGlvbnNcXG5pbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBsb2dnZXIgPSBjcmVhdGVMb2dnZXIoe1xcbiAgLy8gLi4ub3B0aW9uc1xcbn0pO1xcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoXFxuICByZWR1Y2VyLFxcbiAgYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcilcXG4pXFxuXCIpLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTt2YXIgdT1bXTtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIHI9ZS5nZXRTdGF0ZTtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKGwpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGkmJiFpKHIsbCkpcmV0dXJuIGUobCk7dmFyIGM9e307dS5wdXNoKGMpLGMuc3RhcnRlZD1PLm5vdygpLGMuc3RhcnRlZFRpbWU9bmV3IERhdGUsYy5wcmV2U3RhdGU9bihyKCkpLGMuYWN0aW9uPWw7dmFyIHM9dm9pZCAwO2lmKGEpdHJ5e3M9ZShsKX1jYXRjaChlKXtjLmVycm9yPW8oZSl9ZWxzZSBzPWUobCk7Yy50b29rPU8ubm93KCktYy5zdGFydGVkLGMubmV4dFN0YXRlPW4ocigpKTt2YXIgZD10LmRpZmYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGY/ZihyLGwpOnQuZGlmZjtpZih4KHUsT2JqZWN0LmFzc2lnbih7fSx0LHtkaWZmOmR9KSksdS5sZW5ndGg9MCxjLmVycm9yKXRocm93IGMuZXJyb3I7cmV0dXJuIHN9fX19dmFyIGssaixFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIG5ldyBBcnJheSh0KzEpLmpvaW4oZSl9LEE9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gRShcIjBcIix0LWUudG9TdHJpbmcoKS5sZW5ndGgpK2V9LEQ9ZnVuY3Rpb24oZSl7cmV0dXJuIEEoZS5nZXRIb3VycygpLDIpK1wiOlwiK0EoZS5nZXRNaW51dGVzKCksMikrXCI6XCIrQShlLmdldFNlY29uZHMoKSwyKStcIi5cIitBKGUuZ2V0TWlsbGlzZWNvbmRzKCksMyl9LE89XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHBlcmZvcm1hbmNlJiZudWxsIT09cGVyZm9ybWFuY2UmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHBlcmZvcm1hbmNlLm5vdz9wZXJmb3JtYW5jZTpEYXRlLE49XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX0sUD1mdW5jdGlvbihlKXtpZihBcnJheS5pc0FycmF5KGUpKXtmb3IodmFyIHQ9MCxyPUFycmF5KGUubGVuZ3RoKTt0PGUubGVuZ3RoO3QrKylyW3RdPWVbdF07cmV0dXJuIHJ9cmV0dXJuIEFycmF5LmZyb20oZSl9LEM9W107az1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBnbG9iYWw/XCJ1bmRlZmluZWRcIjpOKGdsb2JhbCkpJiZnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9LGo9ay5EZWVwRGlmZixqJiZDLnB1c2goZnVuY3Rpb24oKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgaiYmay5EZWVwRGlmZj09PWMmJihrLkRlZXBEaWZmPWosaj12b2lkIDApfSksdChuLHIpLHQobyxyKSx0KGksciksdChhLHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGMse2RpZmY6e3ZhbHVlOmMsZW51bWVyYWJsZTohMH0sb2JzZXJ2YWJsZURpZmY6e3ZhbHVlOmwsZW51bWVyYWJsZTohMH0sYXBwbHlEaWZmOnt2YWx1ZTpoLGVudW1lcmFibGU6ITB9LGFwcGx5Q2hhbmdlOnt2YWx1ZTpkLGVudW1lcmFibGU6ITB9LHJldmVydENoYW5nZTp7dmFsdWU6ZyxlbnVtZXJhYmxlOiEwfSxpc0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBqfSxlbnVtZXJhYmxlOiEwfSxub0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBDJiYoQy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UoKX0pLEM9bnVsbCksY30sZW51bWVyYWJsZTohMH19KTt2YXIgRj17RTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkNIQU5HRUQ6XCJ9LE46e2NvbG9yOlwiIzRDQUY1MFwiLHRleHQ6XCJBRERFRDpcIn0sRDp7Y29sb3I6XCIjRjQ0MzM2XCIsdGV4dDpcIkRFTEVURUQ6XCJ9LEE6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJBUlJBWTpcIn19LEw9e2xldmVsOlwibG9nXCIsbG9nZ2VyOmNvbnNvbGUsbG9nRXJyb3JzOiEwLGNvbGxhcHNlZDp2b2lkIDAscHJlZGljYXRlOnZvaWQgMCxkdXJhdGlvbjohMSx0aW1lc3RhbXA6ITAsc3RhdGVUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sYWN0aW9uVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGVycm9yVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGNvbG9yczp7dGl0bGU6ZnVuY3Rpb24oKXtyZXR1cm5cImluaGVyaXRcIn0scHJldlN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjOUU5RTlFXCJ9LGFjdGlvbjpmdW5jdGlvbigpe3JldHVyblwiIzAzQTlGNFwifSxuZXh0U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM0Q0FGNTBcIn0sZXJyb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIiNGMjA0MDRcIn19LGRpZmY6ITEsZGlmZlByZWRpY2F0ZTp2b2lkIDAsdHJhbnNmb3JtZXI6dm9pZCAwfSxUPWZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9ZS5kaXNwYXRjaCxyPWUuZ2V0U3RhdGU7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2Ygcj9TKCkoe2Rpc3BhdGNoOnQsZ2V0U3RhdGU6cn0pOnZvaWQgY29uc29sZS5lcnJvcihcIlxcbltyZWR1eC1sb2dnZXIgdjNdIEJSRUFLSU5HIENIQU5HRVxcbltyZWR1eC1sb2dnZXIgdjNdIFNpbmNlIDMuMC4wIHJlZHV4LWxvZ2dlciBleHBvcnRzIGJ5IGRlZmF1bHQgbG9nZ2VyIHdpdGggZGVmYXVsdCBzZXR0aW5ncy5cXG5bcmVkdXgtbG9nZ2VyIHYzXSBDaGFuZ2VcXG5bcmVkdXgtbG9nZ2VyIHYzXSBpbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5bcmVkdXgtbG9nZ2VyIHYzXSB0b1xcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5cIil9O2UuZGVmYXVsdHM9TCxlLmNyZWF0ZUxvZ2dlcj1TLGUubG9nZ2VyPVQsZS5kZWZhdWx0PVQsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGkxOG4oc3RhdGU9e1xuICB0ZXh0OiB7XG4gICAgZ2V0KGtleSwgLi4uYXJncyl7XG4gICAgICBsZXQgdGV4dCA9IGdldExvY2FsZVRleHQoa2V5LCBhcmdzKTtcbiAgICAgIGlmICh0ZXh0KXtcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfSxcbiAgdGltZToge1xuICAgIGZvcm1hdChkYXRlPW5ldyBEYXRlKCksIGZvcm1hdD1cIkxcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9LFxuICAgIGZyb21Ob3coZGF0ZT1uZXcgRGF0ZSgpKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZyb21Ob3coKTtcbiAgICB9LFxuICAgIHN1YnRyYWN0KGRhdGU9bmV3IERhdGUoKSwgaW5wdXQ9MSwgdmFsdWU9XCJkYXlzXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuc3VidHJhY3QoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH0sXG4gICAgYWRkKGRhdGU9bmV3IERhdGUoKSwgaW5wdXQ9MSwgdmFsdWU9XCJkYXlzXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuYWRkKGlucHV0LCB2YWx1ZSkuY2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cbn0sIGFjdGlvbil7XG4gIHJldHVybiBzdGF0ZTtcbn0iLCIvL1RPRE8gdGhpcyByZWR1Y2VyIHVzZXMgdGhlIGFwaSB0aGF0IGludGVyYWN0cyB3aXRoIHRoZSBET00gaW4gb3JkZXIgdG9cbi8vcmV0cmlldmUgZGF0YSwgcGxlYXNlIGZpeCBpbiBuZXh0IHZlcnNpb25zXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZXMoc3RhdGU9e1xuICBhdmFsaWFibGU6ICQubWFrZUFycmF5KCQoXCIjbGFuZ3VhZ2UtcGlja2VyIGFcIikubWFwKChpbmRleCwgZWxlbWVudCk9PntcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJChlbGVtZW50KS50ZXh0KCkudHJpbSgpLFxuICAgICAgbG9jYWxlOiAkKGVsZW1lbnQpLmRhdGEoJ2xvY2FsZScpXG4gICAgfVxuICB9KSksXG4gIGN1cnJlbnQ6ICQoXCIjbG9jYWxlXCIpLnRleHQoKVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0xPQ0FMRScpe1xuICAgICQoJyNsYW5ndWFnZS1waWNrZXIgYVtkYXRhLWxvY2FsZT1cIicgKyBhY3Rpb24ucGF5bG9hZCArICdcIl0nKS5jbGljaygpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge2N1cnJlbnQ6IGFjdGlvbi5wYXlsb2FkfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnMoc3RhdGU9W10sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0FERF9OT1RJRklDQVRJT04nKSB7XG4gICAgdmFyIGlkID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gc3RhdGUuY29uY2F0KE9iamVjdC5hc3NpZ24oe2lkOiBpZH0sIGFjdGlvbi5wYXlsb2FkKSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09ICdISURFX05PVElGSUNBVElPTicpIHtcbiAgICByZXR1cm4gc3RhdGUuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgcmV0dXJuIGVsZW1lbnQuaWQgIT09IGFjdGlvbi5wYXlsb2FkLmlkO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCIvL1RoaXMgb25lIGFsc28gdXNlcyBhIGhhY2sgdG8gYWNjZXNzIHRoZSBkYXRhIGluIHRoZSBkb21cbi8vcGxlYXNlIHJlcGxhY2UgaXQgd2l0aCB0aGUgZm9sbG93aW5nIHByb2NlZHVyZVxuLy8xLiBDcmVhdGUgYSByZXN0IGVuZHBvaW50IHRvIGdldCB0aGUgcGVybWlzc2lvbnMgbGlzdFxuLy8yLiBpbiB0aGUgbWFpbiBmaWxlIGdhdGhlciB0aG9zZSBwZXJtaXNzaW9ucy4uLiBldGMuLi4sIGVnLiBpbmRleC5qcyBtYWtlIGEgY2FsbFxuLy8zLiBkaXNwYXRjaCB0aGUgYWN0aW9uIHRvIHRoaXMgc2FtZSByZWR1Y2VyIGFuZCBnYXRoZXIgdGhlIGFjdGlvbiBoZXJlXG4vLzQuIGl0IHdvcmtzIDpEXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXR1cyhzdGF0ZT17XG4gIGxvZ2dlZEluOiAhIU1VSUtLVV9MT0dHRURfVVNFUl9JRCxcbiAgdXNlcklkOiBNVUlLS1VfTE9HR0VEX1VTRVJfSUQsXG4gIHBlcm1pc3Npb25zOiBNVUlLS1VfUEVSTUlTU0lPTlMsXG4gIGNvbnRleHRQYXRoOiBDT05URVhUUEFUSFxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBcIkxPR09VVFwiKXtcbiAgICAkKCcjbG9nb3V0JykuY2xpY2soKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBub3RpZmljYXRpb25zIGZyb20gJy4vYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vYmFzZS9sb2NhbGVzJztcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi9iYXNlL3N0YXR1cyc7XG5pbXBvcnQgaTE4biBmcm9tICcuL2Jhc2UvaTE4bic7XG5pbXBvcnQgd2Vic29ja2V0IGZyb20gJy4vdXRpbC93ZWJzb2NrZXQnO1xuaW1wb3J0IG1lc3NhZ2VDb3VudCBmcm9tICcuL21haW4tZnVuY3Rpb24vbWVzc2FnZS1jb3VudCc7XG5pbXBvcnQgYW5ub3VuY2VtZW50cyBmcm9tICcuL21haW4tZnVuY3Rpb24vYW5ub3VuY2VtZW50cyc7XG5pbXBvcnQgbGFzdFdvcmtzcGFjZSBmcm9tICcuL21haW4tZnVuY3Rpb24vbGFzdC13b3Jrc3BhY2UnO1xuaW1wb3J0IGxhc3RNZXNzYWdlcyBmcm9tICcuL21haW4tZnVuY3Rpb24vbGFzdC1tZXNzYWdlcyc7XG5pbXBvcnQgd29ya3NwYWNlcyBmcm9tICcuL21haW4tZnVuY3Rpb24vd29ya3NwYWNlcyc7XG5cbmltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIG5vdGlmaWNhdGlvbnMsXG4gIGkxOG4sXG4gIGxvY2FsZXMsXG4gIHN0YXR1cyxcbiAgd2Vic29ja2V0LFxuICBhbm5vdW5jZW1lbnRzLFxuICBsYXN0V29ya3NwYWNlLFxuICB3b3Jrc3BhY2VzLFxuICBsYXN0TWVzc2FnZXMsXG4gIG1lc3NhZ2VDb3VudFxufSk7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYW5ub3VuY2VtZW50cyhzdGF0ZT1bXSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnVVBEQVRFX0FOTk9VTkNFTUVOVFMnKXtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxhc3RNZXNzYWdlcyhzdGF0ZT1bXSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnVVBEQVRFX0xBU1RfTUVTU0FHRVMnKXtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFubm91bmNlbWVudHMoc3RhdGU9bnVsbCwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnVVBEQVRFX0xBU1RfV09SS1NQQUNFJyl7XG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXNzYWdlQ291bnQoc3RhdGU9MCwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBcIlVQREFURV9NRVNTQUdFX0NPVU5UXCIpe1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd29ya3NwYWNlcyhzdGF0ZT1bXSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnVVBEQVRFX1dPUktTUEFDRVMnKXtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdlYnNvY2tldChzdGF0ZT17XG4gIGNvbm5lY3RlZDogZmFsc2Vcbn0sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gXCJXRUJTT0NLRVRfRVZFTlRcIiAmJiBhY3Rpb24ucGF5bG9hZC5ldmVudCA9PT0gXCJ3ZWJTb2NrZXRDb25uZWN0ZWRcIil7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7Y29ubmVjdGVkOiB0cnVlfSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IFwiV0VCU09DS0VUX0VWRU5UXCIgJiYgYWN0aW9uLnBheWxvYWQuZXZlbnQgPT09IFwid2ViU29ja2V0RGlzY29ubmVjdGVkXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge2Nvbm5lY3RlZDogZmFsc2V9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWlra3VXZWJzb2NrZXQge1xuICBjb25zdHJ1Y3RvcihzdG9yZSwgbGlzdGVuZXJzPVtdLCBvcHRpb25zPXtcbiAgICByZWNvbm5lY3RJbnRlcnZhbDogMjAwLFxuICAgIHBpbmdUaW1lU3RlcDogMTAwMCxcbiAgICBwaW5nVGltZW91dDogMTAwMDBcbiAgfSkge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XG4gICAgXG4gICAgdGhpcy50aWNrZXQgPSBudWxsO1xuICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLnNvY2tldE9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLm1lc3NhZ2VzUGVuZGluZyA9IFtdO1xuICAgIHRoaXMucGluZ0hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgXG4gICAgdGhpcy5nZXRUaWNrZXQoKHRpY2tldCk9PiB7XG4gICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgdGhpcy5vcGVuV2ViU29ja2V0KCk7XG4gICAgICAgIHRoaXMuc3RhcnRQaW5naW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBiZWNhdXNlIHRpY2tldCB3YXMgbWlzc2luZ1wiLCAnZXJyb3InKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgdGhpcy5vbkJlZm9yZVdpbmRvd1VubG9hZC5iaW5kKHRoaXMpKTtcbiAgfVxuICBzZW5kTWVzc2FnZShldmVudFR5cGUsIGRhdGEpe1xuICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgZXZlbnRUeXBlLFxuICAgICAgZGF0YVxuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5zb2NrZXRPcGVuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcucHVzaCh7XG4gICAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcucHVzaChtZXNzYWdlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHRyaWdnZXIoZXZlbnQsIGRhdGE9bnVsbCl7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAndHlwZSc6ICdXRUJTT0NLRVRfRVZFTlQnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBkYXRhXG4gICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2V2ZW50XSl7XG4gICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnRdIGluc3RhbmNlb2YgQXJyYXkgPyB0aGlzLmxpc3RlbmVyc1tldmVudF0gOiB0aGlzLmxpc3RlbmVyc1tldmVudF0uYWN0aW9ucztcbiAgICAgIGlmIChsaXN0ZW5lcnMpe1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChhY3Rpb24gb2YgbGlzdGVuZXJzKXtcbiAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGxldCBvdGhlckxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XS5jYWxsYmFja3M7XG4gICAgICBpZiAob3RoZXJMaXN0ZW5lcnMpe1xuICAgICAgICBmb3IgKGNhbGxiYWNrIG9mIG90aGVyTGlzdGVuZXJzKXtcbiAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0VGlja2V0KGNhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLnRpY2tldCkge1xuICAgICAgICAvLyBXZSBoYXZlIGEgdGlja2V0LCBzbyB3ZSBuZWVkIHRvIHZhbGlkYXRlIGl0IGJlZm9yZSB1c2luZyBpdFxuICAgICAgICBtQXBpKCkud2Vic29ja2V0LmNhY2hlQ2xlYXIoKS50aWNrZXQuY2hlY2sucmVhZCh0aGlzLnRpY2tldCkuY2FsbGJhY2soJC5wcm94eShmdW5jdGlvbiAoZXJyLCByZXNwb25zZSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFRpY2tldCBkaWQgbm90IHBhc3MgdmFsaWRhdGlvbiwgc28gd2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgb25lXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpY2tldCgkLnByb3h5KGZ1bmN0aW9uICh0aWNrZXQpIHtcbiAgICAgICAgICAgICAgdGhpcy50aWNrZXQgPSB0aWNrZXQ7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHRpY2tldCk7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRpY2tldCBwYXNzZWQgdmFsaWRhdGlvbiwgc28gd2UgdXNlIGl0XG4gICAgICAgICAgICBjYWxsYmFjayh0aGlzLnRpY2tldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IHRpY2tldFxuICAgICAgICB0aGlzLmNyZWF0ZVRpY2tldCgodGlja2V0KT0+e1xuICAgICAgICAgIHRoaXMudGlja2V0ID0gdGlja2V0O1xuICAgICAgICAgIGNhbGxiYWNrKHRpY2tldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiVGlja2V0IGNyZWF0aW9uIGZhaWxlZCBvbiBhbiBpbnRlcm5hbCBlcnJvclwiLCAnZXJyb3InKSk7XG4gICAgfVxuICB9XG4gIFxuICBjcmVhdGVUaWNrZXQoY2FsbGJhY2spIHtcbiAgICBtQXBpKCkud2Vic29ja2V0LnRpY2tldC5jcmVhdGUoKVxuICAgICAgLmNhbGxiYWNrKChlcnIsIHRpY2tldCk9PntcbiAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayh0aWNrZXQudGlja2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBjcmVhdGUgV2ViU29ja2V0IHRpY2tldFwiLCAnZXJyb3InKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG4gIFxuICBvbldlYlNvY2tldENvbm5lY3RlZCgpIHtcbiAgICB0aGlzLnNvY2tldE9wZW4gPSB0cnVlO1xuICAgIHRoaXMudHJpZ2dlcihcIndlYlNvY2tldENvbm5lY3RlZFwiKTsgXG4gICAgXG4gICAgd2hpbGUgKHRoaXMuc29ja2V0T3BlbiAmJiB0aGlzLm1lc3NhZ2VzUGVuZGluZy5sZW5ndGgpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tZXNzYWdlc1BlbmRpbmcuc2hpZnQoKTtcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobWVzc2FnZS5ldmVudFR5cGUsIG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG4gIFxuICBvbldlYlNvY2tldEVycm9yKCkge1xuICAgIHRoaXMucmVjb25uZWN0KCk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0Q2xvc2UoKSB7XG4gICAgdGhpcy50cmlnZ2VyKFwid2ViU29ja2V0RGlzY29ubmVjdGVkXCIpOyBcbiAgICB0aGlzLnJlY29ubmVjdCgpO1xuICB9XG4gIFxuICBvcGVuV2ViU29ja2V0KCkge1xuICAgIGxldCBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgbGV0IHNlY3VyZSA9IGxvY2F0aW9uLnByb3RvY29sID09ICdodHRwczonO1xuICAgIHRoaXMud2ViU29ja2V0ID0gdGhpcy5jcmVhdGVXZWJTb2NrZXQoKHNlY3VyZSA/ICd3c3M6Ly8nIDogJ3dzOi8vJykgKyBob3N0ICsgJy93cy9zb2NrZXQvJyArIHRoaXMudGlja2V0KTtcbiAgICBcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMub25XZWJTb2NrZXRNZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gdGhpcy5vbldlYlNvY2tldEVycm9yLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gdGhpcy5vbldlYlNvY2tldENsb3NlLmJpbmQodGhpcyk7XG4gICAgICBzd2l0Y2ggKHRoaXMud2ViU29ja2V0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgY2FzZSB0aGlzLndlYlNvY2tldC5DT05ORUNUSU5HOlxuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9ub3BlbiA9IHRoaXMub25XZWJTb2NrZXRDb25uZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdGhpcy53ZWJTb2NrZXQuT1BFTjpcbiAgICAgICAgICB0aGlzLm9uV2ViU29ja2V0Q29ubmVjdGVkKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiV2ViU29ja2V0IGNvbm5lY3Rpb24gZmFpbGVkXCIsICdlcnJvcicpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiQ291bGQgbm90IG9wZW4gV2ViU29ja2V0IGNvbm5lY3Rpb25cIiwgJ2Vycm9yJykpO1xuICAgIH1cbiAgfVxuICBcbiAgY3JlYXRlV2ViU29ja2V0KHVybCkge1xuICAgIGlmICgodHlwZW9mIHdpbmRvdy5XZWJTb2NrZXQpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93Lk1veldlYlNvY2tldCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE1veldlYlNvY2tldCh1cmwpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgc3RhcnRQaW5naW5nKCkge1xuICAgIHRoaXMucGluZ0hhbmRsZSA9IHNldEludGVydmFsKCgpPT57XG4gICAgICBpZiAodGhpcy5zb2NrZXRPcGVuID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMucGluZ2luZykge1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKFwicGluZzpwaW5nXCIsIHt9KTtcbiAgICAgICAgdGhpcy5waW5naW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGluZ1RpbWUgKz0gdGhpcy5vcHRpb25zLnBpbmdUaW1lU3RlcDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnBpbmdUaW1lID4gdGhpcy5vcHRpb25zLnBpbmdUaW1lb3V0KSB7XG4gICAgICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUubG9nKFwicGluZyBmYWlsZWQsIHJlY29ubmVjdGluZy4uLlwiKTtcbiAgICAgICAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnBpbmdUaW1lID0gMDtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcy5vcHRpb25zLnBpbmdUaW1lU3RlcCk7XG4gIH1cbiAgXG4gIHJlY29ubmVjdCgpIHtcbiAgICB2YXIgd2FzT3BlbiA9IHRoaXMuc29ja2V0T3BlbjsgXG4gICAgdGhpcy5zb2NrZXRPcGVuID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dCk7XG4gICAgXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lb3V0ID0gc2V0VGltZW91dCgoKT0+e1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICBpZiAod2FzT3Blbikge1xuICAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMgcmVsYXRlZCB0byBkaXNjYXJkaW5nIGEgV2ViU29ja2V0IFxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLmdldFRpY2tldCgodGlja2V0KT0+e1xuICAgICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgICB0aGlzLm9wZW5XZWJTb2NrZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBiZWNhdXNlIHRpY2tldCB3YXMgbWlzc2luZ1wiLCAnZXJyb3InKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgfSwgdGhpcy5vcHRpb25zLnJlY29ubmVjdEludGVydmFsKTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRNZXNzYWdlKGV2ZW50KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHZhciBldmVudFR5cGUgPSBtZXNzYWdlLmV2ZW50VHlwZTtcbiAgICBcbiAgICBpZiAoZXZlbnRUeXBlID09IFwicGluZzpwb25nXCIpIHtcbiAgICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJpZ2dlcihldmVudFR5cGUsIG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG4gIFxuICBvbkJlZm9yZVdpbmRvd1VubG9hZCgpIHtcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQpIHtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9ICgpPT57fTtcbiAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSAoKT0+e307XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gKCk9Pnt9O1xuICAgICAgaWYgKHRoaXMuc29ja2V0T3Blbikge1xuICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSJdfQ==
