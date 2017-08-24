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

var _notifications = require('../../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processMessages(dispatch, err, messages) {
  if (err) {
    dispatch(_notifications2.default.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  } else {
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "READY"
    });
    dispatch({
      type: "UPDATE_SELECTED_MESSAGES",
      payload: []
    });
    dispatch({
      type: "UPDATE_MESSAGES",
      payload: messages
    });
  }
}

exports.default = {
  updateCommunicatorMessagesForLocation: function updateCommunicatorMessagesForLocation(location, page) {
    var _this = this;

    return function (dispatch, getState) {
      dispatch({
        type: "UPDATE_MESSAGES_STATE",
        payload: "WAIT"
      });

      var _getState = getState(),
          communicatorNavigation = _getState.communicatorNavigation;

      var item = communicatorNavigation.find(function (item) {
        return item.location === location;
      });
      if (!item) {
        return dispatch({
          type: "UPDATE_MESSAGES_STATE",
          payload: "ERROR"
        });
      }

      if (item.type === 'folder') {
        var params = {
          firstResult: 0,
          maxResults: 31
        };
        switch (item.id) {
          case "inbox":
            params.onlyUnread = false;
            mApi().communicator.items.read(params).callback(processMessages.bind(_this, dispatch));
            break;
          case "unread":
            params.onlyUnread = true;
            mApi().communicator.items.read(params).callback(processMessages.bind(_this, dispatch));
            break;
          case "sent":
            mApi().communicator.sentitems.read(params).callback(processMessages.bind(_this, dispatch));
            break;
          case "trash":
            mApi().communicator.trash.read(params).callback(processMessages.bind(_this, dispatch));
            break;
        }
      } else if (item.type === 'label') {
        var _params = {
          labelId: item.id,
          firstResult: 0,
          maxResults: 31
        };
        mApi().communicator.items.read(_params).callback(processMessages.bind(_this, dispatch));
      } else {
        return dispatch({
          type: "UPDATE_MESSAGES_STATE",
          payload: "ERROR"
        });
      }
    };
  },
  updateCommunicatorSelectedMessages: function updateCommunicatorSelectedMessages(messages) {
    return {
      type: "UPDATE_SELECTED_MESSAGES",
      payload: messages
    };
  },
  addToCommunicatorSelectedMessages: function addToCommunicatorSelectedMessages(message) {
    return {
      type: "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES",
      payload: message
    };
  },
  removeFromCommunicatorSelectedMessages: function removeFromCommunicatorSelectedMessages(message) {
    return {
      type: "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES",
      payload: message
    };
  }
};

},{"../../base/notifications":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('../../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _modifiers = require('../../../util/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateCommunicatorNavigationLabels: function updateCommunicatorNavigationLabels() {
    return function (dispatch, getState) {
      mApi().communicator.userLabels.read().callback(function (err, labels) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_COMMUNICATOR_NAVIGATION_LABELS',
            payload: labels.map(function (label) {
              return {
                location: "label-" + label.id,
                id: label.id,
                type: "label",
                icon: "tag",
                text: function text() {
                  return label.name;
                },

                color: (0, _modifiers.colorIntToHex)(label.color)
              };
            })
          });
        }
      });
    };
  }
};

},{"../../../util/modifiers":52,"../../base/notifications":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _communicatorNavigation = require('./communicator-navigation');

var _communicatorNavigation2 = _interopRequireDefault(_communicatorNavigation);

var _communicatorMessages = require('./communicator-messages');

var _communicatorMessages2 = _interopRequireDefault(_communicatorMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  communicatorNavigation: _communicatorNavigation2.default,
  communicatorMessages: _communicatorMessages2.default
};

},{"./communicator-messages":5,"./communicator-navigation":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./announcements":4,"./hash":8,"./last-messages":10,"./last-workspace":11,"./message-count":12,"./workspaces":13}],10:[function(require,module,exports){
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

},{"../base/notifications":2}],11:[function(require,module,exports){
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

},{"../base/notifications":2}],12:[function(require,module,exports){
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

},{"../base/notifications":2}],13:[function(require,module,exports){
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

},{"../base/notifications":2}],14:[function(require,module,exports){
'use strict';

var _communicator = require('./containers/communicator.jsx');

var _communicator2 = _interopRequireDefault(_communicator);

var _communicator3 = require('./reducers/communicator');

var _communicator4 = _interopRequireDefault(_communicator3);

var _defaultDebug = require('./default.debug.jsx');

var _defaultDebug2 = _interopRequireDefault(_defaultDebug);

var _websocket = require('./util/websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _mainFunction = require('./actions/main-function');

var _mainFunction2 = _interopRequireDefault(_mainFunction);

var _communicator5 = require('./actions/main-function/communicator');

var _communicator6 = _interopRequireDefault(_communicator5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _defaultDebug2.default)(_communicator4.default, _communicator2.default, function (store) {
  var websocket = new _websocket2.default(store, {
    "Communicator:newmessagereceived": {
      actions: [_mainFunction2.default.updateMessageCount],
      callbacks: [function () {
        return mApi().communicator.cacheClear;
      }]
    },
    "Communicator:messageread": {
      actions: [_mainFunction2.default.updateMessageCount],
      callbacks: [function () {
        return mApi().communicator.cacheClear;
      }]
    },
    "Communicator:threaddeleted": {
      actions: [_mainFunction2.default.updateMessageCount],
      callbacks: [function () {
        return mApi().communicator.cacheClear;
      }]
    }
  });
  store.dispatch(_mainFunction2.default.messageCount.updateMessageCount());
  store.dispatch(_communicator6.default.communicatorNavigation.updateCommunicatorNavigationLabels());

  window.addEventListener("hashchange", function () {
    var newLocation = window.location.hash.replace("#", "");
    store.dispatch(_mainFunction2.default.hash.updateHash(newLocation));
    store.dispatch(_communicator6.default.communicatorMessages.updateCommunicatorMessagesForLocation(newLocation));
  }, false);
  if (!window.location.hash) {
    window.location.hash = "#inbox";
  } else {
    var currentLocation = window.location.hash.replace("#", "");
    store.dispatch(_mainFunction2.default.hash.updateHash(currentLocation));
    store.dispatch(_communicator6.default.communicatorMessages.updateCommunicatorMessagesForLocation(currentLocation));
  }
});

},{"./actions/main-function":9,"./actions/main-function/communicator":7,"./containers/communicator.jsx":31,"./default.debug.jsx":32,"./reducers/communicator":47,"./util/websocket":53}],15:[function(require,module,exports){
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

},{"../../general/link.jsx":25,"../../general/navbar.jsx":26,"prop-types":40,"react":"react","react-redux":"react-redux"}],16:[function(require,module,exports){
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

},{"../../actions/base/notifications":2,"react":"react","react-redux":"react-redux","redux":"redux"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navbar = require('../base/main-function/navbar.jsx');

var _navbar2 = _interopRequireDefault(_navbar);

var _application = require('./body/application.jsx');

var _application2 = _interopRequireDefault(_application);

var _navigation = require('./body/navigation.jsx');

var _navigation2 = _interopRequireDefault(_navigation);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommunicatorBody = function (_React$Component) {
  _inherits(CommunicatorBody, _React$Component);

  function CommunicatorBody() {
    _classCallCheck(this, CommunicatorBody);

    return _possibleConstructorReturn(this, (CommunicatorBody.__proto__ || Object.getPrototypeOf(CommunicatorBody)).apply(this, arguments));
  }

  _createClass(CommunicatorBody, [{
    key: 'render',
    value: function render() {
      var navigation = _react2.default.createElement(_navigation2.default, null);
      return _react2.default.createElement(
        'div',
        { className: 'embbed embbed-full' },
        _react2.default.createElement(_navbar2.default, { activeTrail: 'communicator', navigation: navigation }),
        _react2.default.createElement(_application2.default, { navigation: navigation })
      );
    }
  }]);

  return CommunicatorBody;
}(_react2.default.Component);

exports.default = CommunicatorBody;

},{"../base/main-function/navbar.jsx":15,"./body/application.jsx":18,"./body/navigation.jsx":21,"react":"react"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _applicationPanel = require('../../general/application-panel.jsx');

var _applicationPanel2 = _interopRequireDefault(_applicationPanel);

var _hoverButton = require('../../general/hover-button.jsx');

var _hoverButton2 = _interopRequireDefault(_hoverButton);

var _toolbar = require('./application/toolbar.jsx');

var _toolbar2 = _interopRequireDefault(_toolbar);

var _messages = require('./application/messages.jsx');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommunicatorApplication = function (_React$Component) {
  _inherits(CommunicatorApplication, _React$Component);

  function CommunicatorApplication() {
    _classCallCheck(this, CommunicatorApplication);

    return _possibleConstructorReturn(this, (CommunicatorApplication.__proto__ || Object.getPrototypeOf(CommunicatorApplication)).apply(this, arguments));
  }

  _createClass(CommunicatorApplication, [{
    key: 'render',
    value: function render() {
      var title = _react2.default.createElement(
        'h2',
        { className: 'communicator text text-panel-application-title communicator-text-title' },
        this.props.i18n.text.get('plugin.communicator.pageTitle')
      );
      var icon = _react2.default.createElement(
        'a',
        { className: 'communicator button-pill communicator-button-pill-settings' },
        _react2.default.createElement('span', { className: 'icon icon-settings' })
      );
      var primaryOption = _react2.default.createElement(
        'a',
        { className: 'communicator button communicator-button-new-message' },
        this.props.i18n.text.get('plugin.communicator.newMessage')
      );
      var toolbar = _react2.default.createElement(_toolbar2.default, null);
      return _react2.default.createElement(
        'div',
        { className: 'embbed embbed-full' },
        _react2.default.createElement(
          _applicationPanel2.default,
          { classNameExtension: 'communicator', toolbar: toolbar, title: title, icon: icon, primaryOption: primaryOption, navigation: this.props.navigation },
          _react2.default.createElement(_messages2.default, null)
        ),
        _react2.default.createElement(_hoverButton2.default, { icon: 'edit', classNameSuffix: 'new-message', classNameExtension: 'communicator' })
      );
    }
  }]);

  return CommunicatorApplication;
}(_react2.default.Component);

CommunicatorApplication.propTypes = {
  navigation: _propTypes2.default.element.isRequired
};


function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CommunicatorApplication);

},{"../../general/application-panel.jsx":22,"../../general/hover-button.jsx":24,"./application/messages.jsx":19,"./application/toolbar.jsx":20,"prop-types":40,"react":"react","react-redux":"react-redux"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _modifiers = require('../../../../util/modifiers');

var _communicatorMessages = require('../../../../actions/main-function/communicator/communicator-messages');

var _communicatorMessages2 = _interopRequireDefault(_communicatorMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommunicatorMessages = function (_React$Component) {
  _inherits(CommunicatorMessages, _React$Component);

  function CommunicatorMessages(props) {
    _classCallCheck(this, CommunicatorMessages);

    var _this = _possibleConstructorReturn(this, (CommunicatorMessages.__proto__ || Object.getPrototypeOf(CommunicatorMessages)).call(this, props));

    _this.touchModeTimeout = null;
    _this.firstWasJustSelected = false;
    _this.state = {
      touchMode: false
    };

    _this.toggleMessageSelection = _this.toggleMessageSelection.bind(_this);
    return _this;
  }

  _createClass(CommunicatorMessages, [{
    key: 'onTouchStartMessage',
    value: function onTouchStartMessage(message) {
      var _this2 = this;

      if (!this.state.touchMode) {
        this.touchModeTimeout = setTimeout(function () {
          _this2.toggleMessageSelection(message);
          _this2.firstWasJustSelected = true;
          _this2.setState({
            touchMode: true
          });
        }, 300);
      }
    }
  }, {
    key: 'onTouchEndMessage',
    value: function onTouchEndMessage(message) {
      clearTimeout(this.touchModeTimeout);
      if (this.state.touchMode && !this.firstWasJustSelected) {
        var isSelected = this.toggleMessageSelection(message);
        if (isSelected && this.props.communicatorMessages.selectedIds.length === 1) {
          this.setState({
            touchMode: false
          });
        }
      } else if (this.firstWasJustSelected) {
        this.firstWasJustSelected = false;
      }
    }
  }, {
    key: 'toggleMessageSelection',
    value: function toggleMessageSelection(message) {
      var isSelected = this.props.communicatorMessages.selectedIds.includes(message.id);
      if (isSelected) {
        this.props.removeFromCommunicatorSelectedMessages(message);
      } else {
        this.props.addToCommunicatorSelectedMessages(message);
      }
      return isSelected;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.props.communicatorMessages.state === "WAIT") {
        return null;
      } else if (this.props.communicatorMessages.state === "ERROR") {
        //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
        //message but here we got to put something
        return _react2.default.createElement(
          'div',
          { className: 'empty' },
          _react2.default.createElement(
            'span',
            null,
            "ERROR"
          )
        );
      } else if (this.props.communicatorMessages.messages.length === 0) {
        return _react2.default.createElement(
          'div',
          { className: 'empty' },
          _react2.default.createElement(
            'span',
            null,
            this.props.i18n.text.get("plugin.communicator.empty.topic")
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { className: 'communicator application-list ' + (this.state.touchMode ? "application-list-select-mode" : "") },
        this.props.communicatorMessages.messages.map(function (message, index) {
          var isSelected = _this3.props.communicatorMessages.selectedIds.includes(message.id);
          return _react2.default.createElement(
            'div',
            { key: message.id,
              className: 'application-list-item ' + (message.unreadMessagesInThread ? "communicator-application-list-item-unread" : "") + ' ' + (isSelected ? "selected" : ""),
              onTouchStart: _this3.onTouchStartMessage.bind(_this3, message), onTouchEnd: _this3.onTouchEndMessage.bind(_this3, message) },
            _react2.default.createElement(
              'div',
              { className: 'application-list-item-header' },
              _react2.default.createElement('input', { type: 'checkbox', checked: isSelected, onClick: _this3.toggleMessageSelection.bind(_this3, message) }),
              _react2.default.createElement(
                'span',
                { className: 'communicator text communicator-text-username' },
                message.sender.firstName ? message.sender.firstName + " " : "",
                message.sender.lastName ? message.sender.lastName : ""
              ),
              _react2.default.createElement(
                'span',
                { className: 'communicator-application-list-item-labels' },
                message.labels.map(function (label) {
                  return _react2.default.createElement(
                    'span',
                    { className: 'communicator text communicator-text-tag', key: label.id },
                    _react2.default.createElement('span', { className: 'icon icon-tag', style: { color: (0, _modifiers.colorIntToHex)(label.labelColor) } }),
                    label.labelName
                  );
                })
              ),
              message.messageCountInthread ? _react2.default.createElement(
                'span',
                { className: 'communicator text communicator-text-counter' },
                message.messageCountInthread
              ) : null,
              _react2.default.createElement(
                'span',
                { className: 'communicator text communicator-text-date' },
                _this3.props.i18n.time.format(message.threadLatestMessageDate)
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'application-list-item-body' },
              _react2.default.createElement(
                'span',
                { className: 'communicator text communicator-text-body' },
                message.caption
              )
            )
          );
        })
      );
    }
  }]);

  return CommunicatorMessages;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    communicatorMessages: state.communicatorMessages,
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)(_communicatorMessages2.default, dispatch);
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CommunicatorMessages);

},{"../../../../actions/main-function/communicator/communicator-messages":5,"../../../../util/modifiers":52,"react":"react","react-redux":"react-redux","redux":"redux"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _dropdown = require('../../../general/dropdown.jsx');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _link = require('../../../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

var _modifiers = require('../../../../util/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommunicatorToolbar = function (_React$Component) {
  _inherits(CommunicatorToolbar, _React$Component);

  function CommunicatorToolbar(props) {
    _classCallCheck(this, CommunicatorToolbar);

    var _this = _possibleConstructorReturn(this, (CommunicatorToolbar.__proto__ || Object.getPrototypeOf(CommunicatorToolbar)).call(this, props));

    _this.updateLabelFilter = _this.updateLabelFilter.bind(_this);

    _this.state = {
      labelFilter: ""
    };
    return _this;
  }

  _createClass(CommunicatorToolbar, [{
    key: 'updateLabelFilter',
    value: function updateLabelFilter(e) {
      this.setState({ labelFilter: e.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var currentLocation = this.props.communicatorNavigation.find(function (item) {
        return item.location === _this2.props.hash;
      });

      if (!currentLocation) {
        return null;
      }

      if (this.props.inMessage) {
        return _react2.default.createElement(
          'div',
          { className: 'communicator-navigation' },
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-go-back communicator-interact-go-back' },
            _react2.default.createElement('span', { className: 'icon icon-goback' })
          ),
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator text communicator-text-current-folder' },
            this.props.folder
          ),
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-delete communicator-toolbar-interact-delete' },
            _react2.default.createElement('span', { className: 'icon icon-forgotpassword' })
          ),
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-label communicator-toolbar-interact-label' },
            _react2.default.createElement('span', { className: 'icon icon-tag' })
          ),
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-toggle-read communicator-toolbar-interact-toggle-read' },
            _react2.default.createElement('span', { className: 'icon {?currentMessageHasUnreadMessages}icon-message-read{:else}icon-message-unread{/currentMessageHasUnreadMessages}' })
          ),
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-next-page communicator-toolbar-interact-toggle-next-page' },
            _react2.default.createElement('span', { className: 'icon icon-arrow-right' })
          ),
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-prev-page communicator-toolbar-interact-toggle-prev-page' },
            _react2.default.createElement('span', { className: 'icon icon-arrow-left' })
          )
        );
      }

      var allInCommon = [];
      var onlyInSome = [];
      var isAtLeastOneSelected = this.props.communicatorMessages.selected.length >= 1;
      if (isAtLeastOneSelected) {
        var partialIds = this.props.communicatorMessages.selected.map(function (message) {
          return message.labels.map(function (l) {
            return l.labelId;
          });
        });
        allInCommon = _modifiers.intersect.apply(undefined, _toConsumableArray(partialIds));
        onlyInSome = _modifiers.difference.apply(undefined, _toConsumableArray(partialIds));
      }
      return _react2.default.createElement(
        'div',
        { className: 'communicator-navigation' },
        _react2.default.createElement(
          _link2.default,
          { className: 'communicator text communicator-text-current-folder' },
          currentLocation.text(this.props.i18n)
        ),
        _react2.default.createElement(
          _link2.default,
          { className: 'communicator button button-pill communicator-button-pill-delete ' + (this.props.communicatorMessages.selected.length == 0 ? "disabled" : "") },
          _react2.default.createElement('span', { className: 'icon icon-forgotpassword' })
        ),
        _react2.default.createElement(
          _dropdown2.default,
          { classNameExtension: 'communicator', classNameSuffix: 'labels', items: [_react2.default.createElement('input', { className: 'form-field', id: 'communicator-toolbar-labels-dropdown-input', value: this.state.labelFilter, onChange: this.updateLabelFilter,
              type: 'text', placeholder: this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder') }), _react2.default.createElement(
              'span',
              { className: 'communicator link link-full communicator-link-new' },
              this.props.i18n.text.get("plugin.communicator.label.create")
            )].concat(this.props.communicatorNavigation.filter(function (item) {
              return item.type === "label" && (0, _modifiers.filterMatch)(item.text(_this2.props.i18n), _this2.state.labelFilter);
            }).map(function (item) {
              var isSelected = allInCommon.includes(item.id);
              var isPartiallySelected = onlyInSome.includes(item.id);
              return _react2.default.createElement(
                _link2.default,
                { className: 'communicator link link-full communicator-link-label ' + (isSelected ? "selected" : "") + ' ' + (isPartiallySelected ? "semi-selected" : "") + ' ' + (isAtLeastOneSelected ? "" : "disabled") },
                _react2.default.createElement('span', { className: 'icon icon-tag', style: { color: item.color } }),
                _react2.default.createElement(
                  'span',
                  { className: 'text' },
                  (0, _modifiers.filterHighlight)(item.text(_this2.props.i18n), _this2.state.labelFilter)
                )
              );
            })) },
          _react2.default.createElement(
            _link2.default,
            { className: 'communicator button button-pill communicator-button-pill-label' },
            _react2.default.createElement('span', { className: 'icon icon-tag' })
          )
        ),
        _react2.default.createElement(
          _link2.default,
          { className: 'communicator button button-pill communicator-button-pill-toggle-read ' + (this.props.communicatorMessages.selected.length !== 1 ? "disabled" : "") },
          _react2.default.createElement('span', { className: 'icon icon-message-' + (this.props.communicatorMessages.selected.length === 1 && this.props.communicatorMessages.selected[0].unreadMessagesInThread ? "un" : "") + 'read' })
        )
      );
    }
  }]);

  return CommunicatorToolbar;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    communicatorNavigation: state.communicatorNavigation,
    communicatorMessages: state.communicatorMessages,
    hash: state.hash,
    i18n: state.i18n
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CommunicatorToolbar);

},{"../../../../util/modifiers":52,"../../../general/dropdown.jsx":23,"../../../general/link.jsx":25,"react":"react","react-redux":"react-redux"}],21:[function(require,module,exports){
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

var Navigation = function (_React$Component) {
  _inherits(Navigation, _React$Component);

  function Navigation() {
    _classCallCheck(this, Navigation);

    return _possibleConstructorReturn(this, (Navigation.__proto__ || Object.getPrototypeOf(Navigation)).apply(this, arguments));
  }

  _createClass(Navigation, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'communicator item-list communicator-item-list-navigation' },
        this.props.communicatorNavigation.map(function (item, index) {
          var style = {};
          if (item.color) {
            style.color = item.color;
          }
          return _react2.default.createElement(
            _link2.default,
            { key: index, className: 'item-list-item ' + (_this2.props.hash === item.location ? "active" : ""), href: '#' + item.location },
            _react2.default.createElement('span', { className: 'icon icon-' + item.icon, style: style }),
            _react2.default.createElement(
              'span',
              { className: 'item-list-text-body text' },
              item.text(_this2.props.i18n)
            )
          );
        })
      );
    }
  }]);

  return Navigation;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    labels: state.labels,
    hash: state.hash,
    i18n: state.i18n,
    communicatorNavigation: state.communicatorNavigation
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Navigation);

},{"../../general/link.jsx":25,"react":"react","react-redux":"react-redux"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApplicationPanel = function (_React$Component) {
  _inherits(ApplicationPanel, _React$Component);

  function ApplicationPanel() {
    _classCallCheck(this, ApplicationPanel);

    return _possibleConstructorReturn(this, (ApplicationPanel.__proto__ || Object.getPrototypeOf(ApplicationPanel)).apply(this, arguments));
  }

  _createClass(ApplicationPanel, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: this.props.classNameExtension + ' application-panel' },
        _react2.default.createElement(
          'div',
          { className: 'application-panel-container' },
          _react2.default.createElement(
            'div',
            { className: 'application-panel-navigation' },
            _react2.default.createElement(
              'div',
              { className: 'application-panel-left-container' },
              this.props.title
            ),
            _react2.default.createElement(
              'div',
              { className: 'application-panel-right-container' },
              this.props.icon
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'application-panel-box' },
            _react2.default.createElement(
              'div',
              { className: 'application-panel-navigation' },
              _react2.default.createElement(
                'div',
                { className: 'application-panel-left-container' },
                this.props.primaryOption
              ),
              _react2.default.createElement(
                'div',
                { className: 'application-panel-right-container' },
                this.props.toolbar
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'application-panel-body' },
              _react2.default.createElement(
                'div',
                { className: 'application-panel-left-container' },
                this.props.navigation
              ),
              _react2.default.createElement(
                'div',
                { className: 'application-panel-right-container loader-empty' },
                this.props.children
              )
            )
          )
        )
      );
    }
  }]);

  return ApplicationPanel;
}(_react2.default.Component);

ApplicationPanel.propTypes = {
  classNameExtension: _propTypes2.default.string.isRequired,
  title: _propTypes2.default.element.isRequired,
  icon: _propTypes2.default.element.isRequired,
  primaryOption: _propTypes2.default.element.isRequired,
  toolbar: _propTypes2.default.element.isRequired,
  navigation: _propTypes2.default.element.isRequired,
  children: _propTypes2.default.element.isRequired
};
exports.default = ApplicationPanel;

},{"prop-types":40,"react":"react"}],23:[function(require,module,exports){
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

},{"./portal.jsx":30,"prop-types":40,"react":"react","react-dom":"react-dom"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _link = require('./link.jsx');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HoverButton = function (_React$Component) {
  _inherits(HoverButton, _React$Component);

  function HoverButton() {
    _classCallCheck(this, HoverButton);

    return _possibleConstructorReturn(this, (HoverButton.__proto__ || Object.getPrototypeOf(HoverButton)).apply(this, arguments));
  }

  _createClass(HoverButton, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _link2.default,
        { href: this.props.href, onClick: this.props.onClick,
          className: this.props.classNameExtension + ' button-pill button-pill-floating ' + this.props.classNameExtension + '-button-pill-' + this.props.classNameSuffix },
        _react2.default.createElement('span', { className: 'icon icon-' + this.props.icon })
      );
    }
  }]);

  return HoverButton;
}(_react2.default.Component);

HoverButton.propTypes = {
  onClick: _propTypes2.default.func,
  classNameExtension: _propTypes2.default.string.isRequired,
  classNameSuffix: _propTypes2.default.string.isRequired,
  icon: _propTypes2.default.string.isRequired,
  href: _propTypes2.default.string
};
exports.default = HoverButton;

},{"./link.jsx":25,"prop-types":40,"react":"react"}],25:[function(require,module,exports){
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

},{"prop-types":40,"react":"react"}],26:[function(require,module,exports){
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

},{"./navbar/language-picker.jsx":27,"./navbar/menu.jsx":28,"./navbar/profile-item.jsx":29,"prop-types":40,"react":"react"}],27:[function(require,module,exports){
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

},{"../../../actions/base/locales":1,"../dropdown.jsx":23,"prop-types":40,"react":"react","react-redux":"react-redux","redux":"redux"}],28:[function(require,module,exports){
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

},{"../../../actions/base/status":3,"../link.jsx":25,"prop-types":40,"react":"react","react-redux":"react-redux","redux":"redux"}],29:[function(require,module,exports){
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

},{"../../../actions/base/status":3,"../dropdown.jsx":23,"../link.jsx":25,"prop-types":40,"react":"react","react-redux":"react-redux","redux":"redux"}],30:[function(require,module,exports){
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

},{"prop-types":40,"react":"react","react-dom":"react-dom"}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notifications = require('../components/base/notifications.jsx');

var _notifications2 = _interopRequireDefault(_notifications);

var _body = require('../components/communicator/body.jsx');

var _body2 = _interopRequireDefault(_body);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Communicator = function (_React$Component) {
  _inherits(Communicator, _React$Component);

  function Communicator() {
    _classCallCheck(this, Communicator);

    return _possibleConstructorReturn(this, (Communicator.__proto__ || Object.getPrototypeOf(Communicator)).apply(this, arguments));
  }

  _createClass(Communicator, [{
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

  return Communicator;
}(_react2.default.Component);

exports.default = Communicator;

},{"../components/base/notifications.jsx":16,"../components/communicator/body.jsx":17,"react":"react"}],32:[function(require,module,exports){
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

},{"react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","redux-logger":42,"redux-thunk":"redux-thunk"}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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

},{"_process":36}],35:[function(require,module,exports){
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

},{"./emptyFunction":33,"_process":36}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":41,"_process":36,"fbjs/lib/invariant":34,"fbjs/lib/warning":35}],38:[function(require,module,exports){
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

},{"./lib/ReactPropTypesSecret":41,"fbjs/lib/emptyFunction":33,"fbjs/lib/invariant":34}],39:[function(require,module,exports){
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

},{"./checkPropTypes":37,"./lib/ReactPropTypesSecret":41,"_process":36,"fbjs/lib/emptyFunction":33,"fbjs/lib/invariant":34,"fbjs/lib/warning":35}],40:[function(require,module,exports){
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

},{"./factoryWithThrowingShims":38,"./factoryWithTypeCheckers":39,"_process":36}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
(function (global){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

var _messageCount = require('./main-function/message-count');

var _messageCount2 = _interopRequireDefault(_messageCount);

var _communicatorNavigation = require('./main-function/communicator/communicator-navigation');

var _communicatorNavigation2 = _interopRequireDefault(_communicatorNavigation);

var _communicatorMessages = require('./main-function/communicator/communicator-messages');

var _communicatorMessages2 = _interopRequireDefault(_communicatorMessages);

var _hash = require('./main-function/hash');

var _hash2 = _interopRequireDefault(_hash);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  notifications: _notifications2.default,
  i18n: _i18n2.default,
  locales: _locales2.default,
  status: _status2.default,
  messageCount: _messageCount2.default,
  communicatorNavigation: _communicatorNavigation2.default,
  communicatorMessages: _communicatorMessages2.default,
  hash: _hash2.default
});

},{"./base/i18n":43,"./base/locales":44,"./base/notifications":45,"./base/status":46,"./main-function/communicator/communicator-messages":48,"./main-function/communicator/communicator-navigation":49,"./main-function/hash":50,"./main-function/message-count":51,"redux":"redux"}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = communicatorMessages;
function communicatorMessages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    state: "WAIT",
    messages: [],
    selected: [],
    selectedIds: []
  };
  var action = arguments[1];

  if (action.type === "UPDATE_MESSAGES_STATE") {
    return Object.assign({}, state, { state: action.payload });
  } else if (action.type === "UPDATE_MESSAGES") {
    return Object.assign({}, state, { messages: action.payload });
  } else if (action.type === "UPDATE_SELECTED_MESSAGES") {
    return Object.assign({}, state, { selected: action.payload, selectedIds: action.payload.map(function (s) {
        return s.id;
      }) });
  } else if (action.type === "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES") {
    return Object.assign({}, state, { selected: state.selected.concat([action.payload]), selectedIds: state.selectedIds.concat([action.payload.id]) });
  } else if (action.type === "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES") {
    return Object.assign({}, state, { selected: state.selected.filter(function (selected) {
        return selected.id !== action.payload.id;
      }), selectedIds: state.selectedIds.filter(function (id) {
        return id !== action.payload.id;
      }) });
  }
  return state;
}

},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = communicatorNavigation;
var defaultNavigation = [{
  location: "inbox",
  type: "folder",
  id: "inbox",
  icon: "new-section",
  text: function text(i18n) {
    return i18n.text.get("plugin.communicator.category.title.inbox");
  }
}, {
  location: "unread",
  type: "folder",
  id: "unread",
  icon: "new-section",
  text: function text(i18n) {
    return i18n.text.get("plugin.communicator.category.title.unread");
  }
}, {
  location: "sent",
  type: "folder",
  id: "sent",
  icon: "new-section",
  text: function text(i18n) {
    return i18n.text.get("plugin.communicator.category.title.sent");
  }
}, {
  location: "trash",
  type: "folder",
  id: "trash",
  icon: "new-section",
  text: function text(i18n) {
    return i18n.text.get("plugin.communicator.category.title.trash");
  }
}];

function communicatorNavigation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultNavigation;
  var action = arguments[1];

  if (action.type === 'UPDATE_COMMUNICATOR_NAVIGATION_LABELS') {
    return defaultNavigation.concat(action.payload);
  } else if (action.type === 'ADD_COMMUNICATOR_NAVIGATION_LABEL') {
    return state.concat(action.payload);
  } else if (action.type === 'DELETE_COMMUNICATOR_NAVIGATION_LABEL') {
    return state.filter(function (item) {
      return item.location !== action.payload.location;
    });
  } else if (action.type === 'UPDATE_COMMUNICATOR_NAVIGATION_LABEL') {
    return state.map(function (item) {
      if (item.location !== action.payload.location) {
        return item;
      }
      return action.payload;
    });
  }
  return state;
}

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hash;
function hash() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var action = arguments[1];

  if (action.type === 'UPDATE_HASH') {
    return action.payload;
  }
  return state;
}

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterMatch = filterMatch;
exports.filterHighlight = filterHighlight;
exports.colorIntToHex = colorIntToHex;
exports.intersect = intersect;
exports.difference = difference;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function intersectTwo(a, b) {
  return a.filter(function (n) {
    return b.indexOf(n) > -1;
  });
}

function differenceTwo(a, b) {
  var inAButNotInB = a.filter(function (n) {
    return b.indexOf(n) === -1;
  });
  var inBButNotInA = b.filter(function (n) {
    return a.indexOf(n) === -1;
  });
  return inAButNotInB.concat(inBButNotInA);
}

function filterMatch(string, filter) {
  return string.match(new RegExp(escapeRegExp(filter), "i"));
}

function filterHighlight(string, filter) {
  return string.split(new RegExp("(" + escapeRegExp(filter) + ")", "i")).map(function (element, index) {
    if (index % 2 === 0) {
      return _react2.default.createElement(
        "span",
        { key: index },
        element
      );
    }
    return _react2.default.createElement(
      "b",
      { key: index },
      element
    );
  });
}

function colorIntToHex(color) {
  var b = (color & 255).toString(16);
  var g = (color >> 8 & 255).toString(16);
  var r = (color >> 16 & 255).toString(16);

  var rStr = r.length == 1 ? "0" + r : r;
  var gStr = g.length == 1 ? "0" + g : g;
  var bStr = b.length == 1 ? "0" + b : b;

  return "#" + rStr + gStr + bStr;
}

function intersect() {
  for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
    elements[_key] = arguments[_key];
  }

  if (elements.length === 1) {
    return elements[0];
  }

  return elements.reduce(intersectTwo);
}

function difference() {
  for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    elements[_key2] = arguments[_key2];
  }

  if (elements.length === 1) {
    return [];
  }

  return elements.reduce(differenceTwo);
}

},{"react":"react"}],53:[function(require,module,exports){
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

},{"../actions/base/notifications":2}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiYWN0aW9ucy9iYXNlL3N0YXR1cy5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9hbm5vdW5jZW1lbnRzLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbWVzc2FnZXMuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vY29tbXVuaWNhdG9yL2NvbW11bmljYXRvci1uYXZpZ2F0aW9uLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9pbmRleC5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9oYXNoLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2luZGV4LmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2xhc3QtbWVzc2FnZXMuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vbGFzdC13b3Jrc3BhY2UuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vbWVzc2FnZS1jb3VudC5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi93b3Jrc3BhY2VzLmpzIiwiY29tbXVuaWNhdG9yLmpzIiwiY29tcG9uZW50cy9iYXNlL21haW4tZnVuY3Rpb24vbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvYmFzZS9ub3RpZmljYXRpb25zLmpzeCIsImNvbXBvbmVudHMvY29tbXVuaWNhdG9yL2JvZHkuanN4IiwiY29tcG9uZW50cy9jb21tdW5pY2F0b3IvYm9keS9hcHBsaWNhdGlvbi5qc3giLCJjb21wb25lbnRzL2NvbW11bmljYXRvci9ib2R5L2FwcGxpY2F0aW9uL21lc3NhZ2VzLmpzeCIsImNvbXBvbmVudHMvY29tbXVuaWNhdG9yL2JvZHkvYXBwbGljYXRpb24vdG9vbGJhci5qc3giLCJjb21wb25lbnRzL2NvbW11bmljYXRvci9ib2R5L25hdmlnYXRpb24uanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2FwcGxpY2F0aW9uLXBhbmVsLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvaG92ZXItYnV0dG9uLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9tZW51LmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvcHJvZmlsZS1pdGVtLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9wb3J0YWwuanN4IiwiY29udGFpbmVycy9jb21tdW5pY2F0b3IuanN4IiwiZGVmYXVsdC5kZWJ1Zy5qc3giLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJub2RlX21vZHVsZXMvcmVkdXgtbG9nZ2VyL2Rpc3QvcmVkdXgtbG9nZ2VyLmpzIiwicmVkdWNlcnMvYmFzZS9pMThuLmpzIiwicmVkdWNlcnMvYmFzZS9sb2NhbGVzLmpzIiwicmVkdWNlcnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwicmVkdWNlcnMvYmFzZS9zdGF0dXMuanMiLCJyZWR1Y2Vycy9jb21tdW5pY2F0b3IuanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbWVzc2FnZXMuanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbmF2aWdhdGlvbi5qcyIsInJlZHVjZXJzL21haW4tZnVuY3Rpb24vaGFzaC5qcyIsInJlZHVjZXJzL21haW4tZnVuY3Rpb24vbWVzc2FnZS1jb3VudC5qcyIsInV0aWwvbW9kaWZpZXJzLmpzIiwidXRpbC93ZWJzb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNBZTtBQUNiLGFBQVcsbUJBQVMsTUFBVCxFQUFnQjtBQUN6QixXQUFPO0FBQ0wsY0FBUSxZQURIO0FBRUwsaUJBQVc7QUFGTixLQUFQO0FBSUQ7QUFOWSxDOzs7Ozs7OztrQkNBQTtBQUNiLHVCQUFxQiw2QkFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTJCO0FBQzlDLFdBQU87QUFDTCxjQUFRLGtCQURIO0FBRUwsaUJBQVc7QUFDVCxvQkFBWSxRQURIO0FBRVQsbUJBQVc7QUFGRjtBQUZOLEtBQVA7QUFPRCxHQVRZO0FBVWIsb0JBQWtCLDBCQUFTLFlBQVQsRUFBc0I7QUFDdEMsV0FBTztBQUNMLGNBQVEsbUJBREg7QUFFTCxpQkFBVztBQUZOLEtBQVA7QUFJRDtBQWZZLEM7Ozs7Ozs7O2tCQ0FBO0FBQ2IsUUFEYSxvQkFDTDtBQUNOLFdBQU87QUFDTCxjQUFRO0FBREgsS0FBUDtBQUdEO0FBTFksQzs7Ozs7Ozs7O0FDQWY7Ozs7OztrQkFFZTtBQUNiLHFCQURhLGlDQUN1RDtBQUFBLFFBQWhELE9BQWdELHVFQUF4QyxFQUFFLDRCQUE0QixPQUE5QixFQUF3Qzs7QUFDbEUsV0FBTyxVQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXNCO0FBQzNCLGFBQ0csU0FE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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5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QUFDdkIsY0FBSSxPQUFLLE1BQVQsRUFBaUI7QUFDZixtQkFBSyxhQUFMO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0Isd0JBQVEsbUJBQVIsQ0FBNEIscURBQTVCLEVBQW1GLE9BQW5GLENBQXBCO0FBQ0Q7QUFDRixTQU5EO0FBUUQsT0F0QnVCLEVBc0JyQixLQUFLLE9BQUwsQ0FBYSxpQkF0QlEsQ0FBeEI7QUF1QkQ7Ozt1Q0FFa0IsSyxFQUFPO0FBQ3hCLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxNQUFNLElBQWpCLENBQWQ7QUFDQSxVQUFJLFlBQVksUUFBUSxTQUF4Qjs7QUFFQSxVQUFJLGFBQWEsV0FBakIsRUFBOEI7QUFDNUIsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUssUUFBTCxHQUFnQixDQUFoQjtBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssT0FBTCxDQUFhLFNBQWIsRUFBd0IsUUFBUSxJQUFoQztBQUNEO0FBQ0Y7OzsyQ0FFc0I7QUFDckIsVUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsYUFBSyxTQUFMLENBQWUsU0FBZixHQUEyQixZQUFJLENBQUUsQ0FBakM7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLFlBQUksQ0FBRSxDQUEvQjtBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWYsR0FBeUIsWUFBSSxDQUFFLENBQS9CO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsZUFBSyxTQUFMLENBQWUsS0FBZjtBQUNEO0FBQ0Y7QUFDRjs7Ozs7O2tCQTFQa0IsZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCB7XG4gIHNldExvY2FsZTogZnVuY3Rpb24obG9jYWxlKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnU0VUX0xPQ0FMRScsXG4gICAgICAncGF5bG9hZCc6IGxvY2FsZVxuICAgIH1cbiAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gIGRpc3BsYXlOb3RpZmljYXRpb246IGZ1bmN0aW9uKG1lc3NhZ2UsIHNldmVyaXR5KXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnQUREX05PVElGSUNBVElPTicsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3NldmVyaXR5Jzogc2V2ZXJpdHksXG4gICAgICAgICdtZXNzYWdlJzogbWVzc2FnZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaGlkZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24obm90aWZpY2F0aW9uKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnSElERV9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiBub3RpZmljYXRpb25cbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBsb2dvdXQoKXtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnTE9HT1VUJ1xuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUFubm91bmNlbWVudHMob3B0aW9ucz17IGhpZGVXb3Jrc3BhY2VBbm5vdW5jZW1lbnRzOiBcImZhbHNlXCIgfSl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKClcbiAgICAgICAgLmFubm91bmNlclxuICAgICAgICAuYW5ub3VuY2VtZW50c1xuICAgICAgICAucmVhZChvcHRpb25zKVxuICAgICAgICAuY2FsbGJhY2soZnVuY3Rpb24oZXJyLCBhbm5vdW5jZW1lbnRzKSB7XG4gICAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ1VQREFURV9BTk5PVU5DRU1FTlRTJyxcbiAgICAgICAgICAgICAgcGF5bG9hZDogYW5ub3VuY2VtZW50c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcblxuZnVuY3Rpb24gcHJvY2Vzc01lc3NhZ2VzKGRpc3BhdGNoLCBlcnIsIG1lc3NhZ2VzKXtcbiAgaWYgKGVycil7XG4gICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgZGlzcGF0Y2goe1xuICBcdCAgdHlwZTogXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIixcbiAgXHQgIHBheWxvYWQ6IFwiRVJST1JcIlxuICBcdH0pO1xuICB9IGVsc2Uge1xuICBcdGRpc3BhdGNoKHtcbiAgXHQgIHR5cGU6IFwiVVBEQVRFX01FU1NBR0VTX1NUQVRFXCIsXG4gIFx0ICBwYXlsb2FkOiBcIlJFQURZXCJcbiAgXHR9KTtcbiAgXHRkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBcIlVQREFURV9TRUxFQ1RFRF9NRVNTQUdFU1wiLFxuICAgICAgcGF5bG9hZDogW11cbiAgICB9KTtcbiAgICBkaXNwYXRjaCh7XG4gIFx0ICB0eXBlOiBcIlVQREFURV9NRVNTQUdFU1wiLFxuICBcdCAgcGF5bG9hZDogbWVzc2FnZXNcbiAgXHR9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUNvbW11bmljYXRvck1lc3NhZ2VzRm9yTG9jYXRpb24obG9jYXRpb24sIHBhZ2Upe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcIlVQREFURV9NRVNTQUdFU19TVEFURVwiLFxuICAgICAgICBwYXlsb2FkOiBcIldBSVRcIlxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGxldCB7Y29tbXVuaWNhdG9yTmF2aWdhdGlvbn0gPSBnZXRTdGF0ZSgpO1xuICAgICAgbGV0IGl0ZW0gPSBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uLmZpbmQoKGl0ZW0pPT57XG4gICAgICAgIHJldHVybiBpdGVtLmxvY2F0aW9uID09PSBsb2NhdGlvbjtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFpdGVtKXtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICBcdCAgdHlwZTogXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIixcbiAgICBcdCAgcGF5bG9hZDogXCJFUlJPUlwiXG4gICAgXHR9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2ZvbGRlcicpe1xuICAgIFx0bGV0IHBhcmFtcyA9IHtcbiAgICAgICAgICBmaXJzdFJlc3VsdDogMCxcbiAgICBcdCAgbWF4UmVzdWx0czogMzFcbiAgICAgICAgfVxuICAgIFx0c3dpdGNoKGl0ZW0uaWQpe1xuICAgICAgICAgIGNhc2UgXCJpbmJveFwiOlxuICAgICAgICAgICAgcGFyYW1zLm9ubHlVbnJlYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3IuaXRlbXMucmVhZChwYXJhbXMpLmNhbGxiYWNrKHByb2Nlc3NNZXNzYWdlcy5iaW5kKHRoaXMsIGRpc3BhdGNoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidW5yZWFkXCI6XG4gICAgICAgICAgICBwYXJhbXMub25seVVucmVhZCA9IHRydWU7XG4gICAgICAgICAgICBtQXBpKCkuY29tbXVuaWNhdG9yLml0ZW1zLnJlYWQocGFyYW1zKS5jYWxsYmFjayhwcm9jZXNzTWVzc2FnZXMuYmluZCh0aGlzLCBkaXNwYXRjaCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInNlbnRcIjpcbiAgICAgICAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3Iuc2VudGl0ZW1zLnJlYWQocGFyYW1zKS5jYWxsYmFjayhwcm9jZXNzTWVzc2FnZXMuYmluZCh0aGlzLCBkaXNwYXRjaCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInRyYXNoXCI6XG4gICAgICAgICAgICBtQXBpKCkuY29tbXVuaWNhdG9yLnRyYXNoLnJlYWQocGFyYW1zKS5jYWxsYmFjayhwcm9jZXNzTWVzc2FnZXMuYmluZCh0aGlzLCBkaXNwYXRjaCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSAnbGFiZWwnKSB7XG4gICAgICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgICAgbGFiZWxJZDogaXRlbS5pZCxcbiAgICAgICAgICBmaXJzdFJlc3VsdDogMCxcbiAgICAgICAgICBtYXhSZXN1bHRzOiAzMVxuICAgICAgICB9XG4gICAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3IuaXRlbXMucmVhZChwYXJhbXMpLmNhbGxiYWNrKHByb2Nlc3NNZXNzYWdlcy5iaW5kKHRoaXMsIGRpc3BhdGNoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgIFx0cmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBcIlVQREFURV9NRVNTQUdFU19TVEFURVwiLFxuICAgICAgICAgIHBheWxvYWQ6IFwiRVJST1JcIlxuICAgIFx0fSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB1cGRhdGVDb21tdW5pY2F0b3JTZWxlY3RlZE1lc3NhZ2VzKG1lc3NhZ2VzKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogXCJVUERBVEVfU0VMRUNURURfTUVTU0FHRVNcIixcbiAgICAgIHBheWxvYWQ6IG1lc3NhZ2VzXG4gICAgfTtcbiAgfSxcbiAgYWRkVG9Db21tdW5pY2F0b3JTZWxlY3RlZE1lc3NhZ2VzKG1lc3NhZ2Upe1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcIkFERF9UT19DT01NVU5JQ0FUT1JfU0VMRUNURURfTUVTU0FHRVNcIixcbiAgICAgIHBheWxvYWQ6IG1lc3NhZ2VcbiAgICB9O1xuICB9LFxuICByZW1vdmVGcm9tQ29tbXVuaWNhdG9yU2VsZWN0ZWRNZXNzYWdlcyhtZXNzYWdlKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogXCJSRU1PVkVfRlJPTV9DT01NVU5JQ0FUT1JfU0VMRUNURURfTUVTU0FHRVNcIixcbiAgICAgIHBheWxvYWQ6IG1lc3NhZ2VcbiAgICB9O1xuICB9XG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQge2NvbG9ySW50VG9IZXh9IGZyb20gJ34vdXRpbC9tb2RpZmllcnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUNvbW11bmljYXRvck5hdmlnYXRpb25MYWJlbHMoKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3IudXNlckxhYmVscy5yZWFkKCkuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgbGFiZWxzKSB7XG4gICAgICAgIGlmIChlcnIpe1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfQ09NTVVOSUNBVE9SX05BVklHQVRJT05fTEFCRUxTJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IGxhYmVscy5tYXAoKGxhYmVsKT0+e1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcImxhYmVsLVwiICsgbGFiZWwuaWQsXG4gICAgICAgICAgICAgICAgaWQ6IGxhYmVsLmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGFiZWxcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcInRhZ1wiLFxuICAgICAgICAgICAgICAgIHRleHQoKXtyZXR1cm4gbGFiZWwubmFtZX0sXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9ySW50VG9IZXgobGFiZWwuY29sb3IpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uIGZyb20gJy4vY29tbXVuaWNhdG9yLW5hdmlnYXRpb24nO1xuaW1wb3J0IGNvbW11bmljYXRvck1lc3NhZ2VzIGZyb20gJy4vY29tbXVuaWNhdG9yLW1lc3NhZ2VzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uLFxuICBjb21tdW5pY2F0b3JNZXNzYWdlc1xufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlSGFzaChoYXNoKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogXCJVUERBVEVfSEFTSFwiLFxuICAgICAgcGF5bG9hZDogaGFzaFxuICAgIH1cbiAgfVxufSIsImltcG9ydCBhbm5vdW5jZW1lbnRzIGZyb20gJy4vYW5ub3VuY2VtZW50cyc7XG5pbXBvcnQgbWVzc2FnZUNvdW50IGZyb20gJy4vbWVzc2FnZS1jb3VudCc7XG5pbXBvcnQgbGFzdFdvcmtzcGFjZSBmcm9tICcuL2xhc3Qtd29ya3NwYWNlJztcbmltcG9ydCB3b3Jrc3BhY2VzIGZyb20gJy4vd29ya3NwYWNlcyc7XG5pbXBvcnQgbGFzdE1lc3NhZ2VzIGZyb20gJy4vbGFzdC1tZXNzYWdlcyc7XG5pbXBvcnQgaGFzaCBmcm9tICcuL2hhc2gnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFubm91bmNlbWVudHMsXG4gIG1lc3NhZ2VDb3VudCxcbiAgbGFzdFdvcmtzcGFjZSxcbiAgd29ya3NwYWNlcyxcbiAgbGFzdE1lc3NhZ2VzLFxuICBoYXNoXG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVMYXN0TWVzc2FnZXMobWF4UmVzdWx0cyl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKCkuY29tbXVuaWNhdG9yLml0ZW1zLnJlYWQoe1xuICAgICAgICAnZmlyc3RSZXN1bHQnOiAwLFxuICAgICAgICAnbWF4UmVzdWx0cyc6IG1heFJlc3VsdHNcbiAgICAgIH0pLmNhbGxiYWNrKGZ1bmN0aW9uIChlcnIsIG1lc3NhZ2VzKSB7XG4gICAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiAnVVBEQVRFX0xBU1RfTUVTU0FHRVMnLFxuICAgICAgICAgICAgcGF5bG9hZDogbWVzc2FnZXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVMYXN0V29ya3NwYWNlKCl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKCkudXNlci5wcm9wZXJ0eS5yZWFkKCdsYXN0LXdvcmtzcGFjZScpLmNhbGxiYWNrKGZ1bmN0aW9uKGVyciwgcHJvcGVydHkpIHtcbiAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfTEFTVF9XT1JLU1BBQ0UnLFxuICAgICAgICAgICAgcGF5bG9hZDogcHJvcGVydHkudmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZU1lc3NhZ2VDb3VudCgpe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgbUFwaSgpXG4gICAgICAgIC5jb21tdW5pY2F0b3JcbiAgICAgICAgLnJlY2VpdmVkaXRlbXNjb3VudFxuICAgICAgICAuY2FjaGVDbGVhcigpXG4gICAgICAgIC5yZWFkKClcbiAgICAgICAgLmNhbGxiYWNrKGZ1bmN0aW9uIChlcnIsIHJlc3VsdD0wKSB7XG4gICAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgdHlwZTogXCJVUERBVEVfTUVTU0FHRV9DT1VOVFwiLFxuICAgICAgICAgICAgICBwYXlsb2FkOiByZXN1bHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVXb3Jrc3BhY2VzKCl7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBsZXQgdXNlcklkID0gZ2V0U3RhdGUoKS5zdGF0dXMudXNlcklkO1xuICAgICAgbUFwaSgpLndvcmtzcGFjZS53b3Jrc3BhY2VzXG4gICAgICAgLnJlYWQoe3VzZXJJZH0pXG4gICAgICAgLmNhbGxiYWNrKGZ1bmN0aW9uIChlcnIsIHdvcmtzcGFjZXM9W10pIHtcbiAgICAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgdHlwZTogXCJVUERBVEVfV09SS1NQQUNFU1wiLFxuICAgICAgICAgICAgIHBheWxvYWQ6IHdvcmtzcGFjZXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgQXBwIGZyb20gJy4vY29udGFpbmVycy9jb21tdW5pY2F0b3IuanN4JztcbmltcG9ydCByZWR1Y2VyIGZyb20gJy4vcmVkdWNlcnMvY29tbXVuaWNhdG9yJztcbmltcG9ydCBydW5BcHAgZnJvbSAnLi9kZWZhdWx0LmRlYnVnLmpzeCc7XG5pbXBvcnQgV2Vic29ja2V0IGZyb20gJy4vdXRpbC93ZWJzb2NrZXQnO1xuXG5pbXBvcnQgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMvbWFpbi1mdW5jdGlvbic7XG5pbXBvcnQgY29tbXVuaWNhdG9yQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMvbWFpbi1mdW5jdGlvbi9jb21tdW5pY2F0b3InO1xuXG5ydW5BcHAocmVkdWNlciwgQXBwLCAoc3RvcmUpPT57XG4gIGxldCB3ZWJzb2NrZXQgPSBuZXcgV2Vic29ja2V0KHN0b3JlLCB7XG4gICAgXCJDb21tdW5pY2F0b3I6bmV3bWVzc2FnZXJlY2VpdmVkXCI6IHtcbiAgICAgIGFjdGlvbnM6IFthY3Rpb25zLnVwZGF0ZU1lc3NhZ2VDb3VudF0sXG4gICAgICBjYWxsYmFja3M6IFsoKT0+bUFwaSgpLmNvbW11bmljYXRvci5jYWNoZUNsZWFyXVxuICAgIH0sXG4gICAgXCJDb21tdW5pY2F0b3I6bWVzc2FnZXJlYWRcIjoge1xuICAgICAgYWN0aW9uczogW2FjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50XSxcbiAgICAgIGNhbGxiYWNrczogWygpPT5tQXBpKCkuY29tbXVuaWNhdG9yLmNhY2hlQ2xlYXJdXG4gICAgfSxcbiAgICBcIkNvbW11bmljYXRvcjp0aHJlYWRkZWxldGVkXCI6IHtcbiAgICAgIGFjdGlvbnM6IFthY3Rpb25zLnVwZGF0ZU1lc3NhZ2VDb3VudF0sXG4gICAgICBjYWxsYmFja3M6IFsoKT0+bUFwaSgpLmNvbW11bmljYXRvci5jYWNoZUNsZWFyXVxuICAgIH1cbiAgfSk7XG4gIHN0b3JlLmRpc3BhdGNoKGFjdGlvbnMubWVzc2FnZUNvdW50LnVwZGF0ZU1lc3NhZ2VDb3VudCgpKTtcbiAgc3RvcmUuZGlzcGF0Y2goY29tbXVuaWNhdG9yQWN0aW9ucy5jb21tdW5pY2F0b3JOYXZpZ2F0aW9uLnVwZGF0ZUNvbW11bmljYXRvck5hdmlnYXRpb25MYWJlbHMoKSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsICgpPT57XG4gICAgbGV0IG5ld0xvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcIiNcIixcIlwiKTtcbiAgICBzdG9yZS5kaXNwYXRjaChhY3Rpb25zLmhhc2gudXBkYXRlSGFzaChuZXdMb2NhdGlvbikpO1xuICAgIHN0b3JlLmRpc3BhdGNoKGNvbW11bmljYXRvckFjdGlvbnMuY29tbXVuaWNhdG9yTWVzc2FnZXMudXBkYXRlQ29tbXVuaWNhdG9yTWVzc2FnZXNGb3JMb2NhdGlvbihuZXdMb2NhdGlvbikpO1xuICB9LCBmYWxzZSk7XG4gIGlmICghd2luZG93LmxvY2F0aW9uLmhhc2gpe1xuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjaW5ib3hcIjtcbiAgfSBlbHNlIHtcbiAgICBsZXQgY3VycmVudExvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcIiNcIixcIlwiKTtcbiAgICBzdG9yZS5kaXNwYXRjaChhY3Rpb25zLmhhc2gudXBkYXRlSGFzaChjdXJyZW50TG9jYXRpb24pKTtcbiAgICBzdG9yZS5kaXNwYXRjaChjb21tdW5pY2F0b3JBY3Rpb25zLmNvbW11bmljYXRvck1lc3NhZ2VzLnVwZGF0ZUNvbW11bmljYXRvck1lc3NhZ2VzRm9yTG9jYXRpb24oY3VycmVudExvY2F0aW9uKSk7XG4gIH1cbn0pOyIsImltcG9ydCBOYXZiYXIgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIE1haW5GdW5jdGlvbk5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYWN0aXZlVHJhaWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gW3tcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJob21lXCIsXG4gICAgICB0cmFpbDogXCJpbmRleFwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ob21lLmhvbWUnLFxuICAgICAgaHJlZjogXCIvXCIsXG4gICAgICBpY29uOiBcImhvbWVcIixcbiAgICAgIGNvbmRpdGlvbjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJjb3Vyc2VwaWNrZXJcIixcbiAgICAgIHRyYWlsOiBcImNvdXJzZXBpY2tlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5jb3Vyc2VwaWNrZXIuY291cnNlcGlja2VyJyxcbiAgICAgIGhyZWY6IFwiL2NvdXJzZXBpY2tlclwiLFxuICAgICAgaWNvbjogXCJib29rc1wiLFxuICAgICAgY29uZGl0aW9uOiB0cnVlXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbW11bmljYXRvclwiLFxuICAgICAgdHJhaWw6IFwiY29tbXVuaWNhdG9yXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmNvbW11bmljYXRvci5jb21tdW5pY2F0b3InLFxuICAgICAgaHJlZjogXCIvY29tbXVuaWNhdG9yXCIsXG4gICAgICBpY29uOiBcImVudmVsb3BlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluLFxuICAgICAgYmFkZ2U6IHRoaXMucHJvcHMuc3RhdHVzLm1lc3NhZ2VDb3VudFxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJkaXNjdXNzaW9uXCIsXG4gICAgICB0cmFpbDogXCJkaXNjdXNzaW9uXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmZvcnVtLmZvcnVtJyxcbiAgICAgIGhyZWY6IFwiL2Rpc2N1c3Npb25cIixcbiAgICAgIGljb246IFwiYnViYmxlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluICYmIHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkZPUlVNX0FDQ0VTU0VOVklST05NRU5URk9SVU1cbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFwiZ3VpZGVyXCIsXG4gICAgICB0cmFpbDogXCJndWlkZXJcIixcbiAgICAgIHRleHQ6ICdwbHVnaW4uZ3VpZGVyLmd1aWRlcicsXG4gICAgICBocmVmOiBcIi9ndWlkZXJcIixcbiAgICAgIGljb246IFwibWVtYmVyc1wiLFxuICAgICAgY29uZGl0aW9uOiB0aGlzLnByb3BzLnN0YXR1cy5wZXJtaXNzaW9ucy5HVUlERVJfVklFV1xuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJyZWNvcmRzXCIsXG4gICAgICB0cmFpbDogXCJyZWNvcmRzXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLnJlY29yZHMucmVjb3JkcycsXG4gICAgICBocmVmOiBcIi9yZWNvcmRzXCIsXG4gICAgICBpY29uOiBcInByb2ZpbGVcIixcbiAgICAgIGNvbmRpdGlvbjogdGhpcy5wcm9wcy5zdGF0dXMucGVybWlzc2lvbnMuVFJBTlNDUklQVF9PRl9SRUNPUkRTX1ZJRVdcbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFwiZXZhbHVhdGlvblwiLFxuICAgICAgdHJhaWw6IFwiZXZhbHVhdGlvblwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ldmFsdWF0aW9uLmV2YWx1YXRpb24nLFxuICAgICAgaHJlZjogXCIvZXZhbHVhdGlvblwiLFxuICAgICAgaWNvbjogXCJldmFsdWF0ZVwiLFxuICAgICAgY29uZGl0aW9uOiB0aGlzLnByb3BzLnN0YXR1cy5wZXJtaXNzaW9ucy5FVkFMVUFUSU9OX1ZJRVdfSU5ERVhcbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFwiYW5ub3VuY2VyXCIsXG4gICAgICB0cmFpbDogXCJhbm5vdW5jZXJcIixcbiAgICAgIHRleHQ6ICdwbHVnaW4uYW5ub3VuY2VyLmFubm91bmNlcicsXG4gICAgICBocmVmOiBcIi9hbm5vdW5jZXJcIixcbiAgICAgIGljb246IFwiYW5ub3VuY2VyXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkFOTk9VTkNFUl9UT09MXG4gICAgfV07XG4gICAgXG4gICAgcmV0dXJuIDxOYXZiYXIgY2xhc3NOYW1lRXh0ZW5zaW9uPVwibWFpbi1mdW5jdGlvblwiIG5hdmlnYXRpb249e3RoaXMucHJvcHMubmF2aWdhdGlvbn0gbmF2YmFySXRlbXM9e2l0ZW1EYXRhLm1hcCgoaXRlbSk9PntcbiAgICAgIGlmICghaXRlbS5jb25kaXRpb24pe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNsYXNzTmFtZVN1ZmZpeDogaXRlbS5jbGFzc05hbWVTdWZmaXgsXG4gICAgICAgIGl0ZW06ICg8TGluayBocmVmPXtpdGVtLmhyZWZ9IGNsYXNzTmFtZT17YG1haW4tZnVuY3Rpb24gbGluayBsaW5rLWljb24gbGluay1mdWxsICR7dGhpcy5wcm9wcy5hY3RpdmVUcmFpbCA9PT0gaXRlbS50cmFpbCA/ICdhY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KGl0ZW0udGV4dCl9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gaWNvbi0ke2l0ZW0uaWNvbn1gfS8+XG4gICAgICAgICAge2l0ZW0uYmFkZ2UgPyA8c3BhbiBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGluZGljYXRvclwiPnsoaXRlbS5iYWRnZSA+PSAxMDAgPyBcIjk5K1wiIDogaXRlbS5iYWRnZSl9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgIDwvTGluaz4pXG4gICAgICB9XG4gICAgfSl9IGRlZmF1bHRPcHRpb25zPXtbXX0gbWVudUl0ZW1zPXtpdGVtRGF0YS5tYXAoKGl0ZW0pPT57XG4gICAgICBpZiAoIWl0ZW0uY29uZGl0aW9uKXtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gPExpbmsgaHJlZj17aXRlbS5ocmVmfSBjbGFzc05hbWU9e2BtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51ICR7dGhpcy5wcm9wcy5hY3RpdmVUcmFpbCA9PT0gaXRlbS50cmFpbCA/ICdhY3RpdmUnIDogJyd9YH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gaWNvbi0ke2l0ZW0uaWNvbn1gfS8+XG4gICAgICAgIHtpdGVtLmJhZGdlID8gPHNwYW4gY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBpbmRpY2F0b3JcIj57KGl0ZW0uYmFkZ2UgPj0gMTAwID8gXCI5OStcIiA6IGl0ZW0uYmFkZ2UpfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KGl0ZW0udGV4dCl9XG4gICAgICA8L0xpbms+XG4gICAgfSl9Lz5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXMsXG4gICAgbWVzc2FnZUNvdW50OiBzdGF0ZS5tZXNzYWdlQ291bnRcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShNYWluRnVuY3Rpb25OYXZiYXIpO1xuIiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5jbGFzcyBOb3RpZmljYXRpb25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uLXF1ZXVlLWl0ZW1zXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubm90aWZpY2F0aW9ucy5tYXAoKG5vdGlmaWNhdGlvbik9PntcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtub3RpZmljYXRpb24uaWR9IGNsYXNzTmFtZT17XCJub3RpZmljYXRpb24tcXVldWUtaXRlbSBub3RpZmljYXRpb24tcXVldWUtaXRlbS1cIiArIG5vdGlmaWNhdGlvbi5zZXZlcml0eX0+XG4gICAgICAgICAgICAgICAgPHNwYW4+e25vdGlmaWNhdGlvbi5tZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbS1jbG9zZVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuaGlkZU5vdGlmaWNhdGlvbi5iaW5kKHRoaXMsIG5vdGlmaWNhdGlvbil9PjwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiAgXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIG5vdGlmaWNhdGlvbnM6IHN0YXRlLm5vdGlmaWNhdGlvbnNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE5vdGlmaWNhdGlvbnMpOyIsImltcG9ydCBNYWluRnVuY3Rpb25OYXZiYXIgZnJvbSAnfi9jb21wb25lbnRzL2Jhc2UvbWFpbi1mdW5jdGlvbi9uYXZiYXIuanN4JztcbmltcG9ydCBBcHBsaWNhdGlvbiBmcm9tICcuL2JvZHkvYXBwbGljYXRpb24uanN4JztcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vYm9keS9uYXZpZ2F0aW9uLmpzeCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW11bmljYXRvckJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICBsZXQgbmF2aWdhdGlvbiA9IDxOYXZpZ2F0aW9uLz5cbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZW1iYmVkIGVtYmJlZC1mdWxsXCI+XG4gICAgICA8TWFpbkZ1bmN0aW9uTmF2YmFyIGFjdGl2ZVRyYWlsPVwiY29tbXVuaWNhdG9yXCIgbmF2aWdhdGlvbj17bmF2aWdhdGlvbn0vPlxuICAgICAgPEFwcGxpY2F0aW9uIG5hdmlnYXRpb249e25hdmlnYXRpb259Lz5cbiAgICA8L2Rpdj4pO1xuICB9XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IEFwcGxpY2F0aW9uUGFuZWwgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvYXBwbGljYXRpb24tcGFuZWwuanN4JztcbmltcG9ydCBIb3ZlckJ1dHRvbiBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9ob3Zlci1idXR0b24uanN4JztcblxuaW1wb3J0IFRvb2xiYXIgZnJvbSAnLi9hcHBsaWNhdGlvbi90b29sYmFyLmpzeCc7XG5pbXBvcnQgQ29tbXVuaWNhdG9yTWVzc2FnZXMgZnJvbSAnLi9hcHBsaWNhdGlvbi9tZXNzYWdlcy5qc3gnO1xuXG5jbGFzcyBDb21tdW5pY2F0b3JBcHBsaWNhdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbmF2aWdhdGlvbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGxldCB0aXRsZSA9IDxoMiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgdGV4dCB0ZXh0LXBhbmVsLWFwcGxpY2F0aW9uLXRpdGxlIGNvbW11bmljYXRvci10ZXh0LXRpdGxlXCI+e3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmNvbW11bmljYXRvci5wYWdlVGl0bGUnKX08L2gyPlxuICAgIGxldCBpY29uID0gPGEgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1zZXR0aW5nc1wiPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXNldHRpbmdzXCI+PC9zcGFuPlxuICAgIDwvYT5cbiAgICBsZXQgcHJpbWFyeU9wdGlvbiA9IDxhIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciBidXR0b24gY29tbXVuaWNhdG9yLWJ1dHRvbi1uZXctbWVzc2FnZVwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uY29tbXVuaWNhdG9yLm5ld01lc3NhZ2UnKX1cbiAgICA8L2E+XG4gICAgbGV0IHRvb2xiYXIgPSA8VG9vbGJhci8+XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtZnVsbFwiPlxuICAgICAgPEFwcGxpY2F0aW9uUGFuZWwgY2xhc3NOYW1lRXh0ZW5zaW9uPVwiY29tbXVuaWNhdG9yXCIgdG9vbGJhcj17dG9vbGJhcn0gdGl0bGU9e3RpdGxlfSBpY29uPXtpY29ufSBwcmltYXJ5T3B0aW9uPXtwcmltYXJ5T3B0aW9ufSBuYXZpZ2F0aW9uPXt0aGlzLnByb3BzLm5hdmlnYXRpb259PlxuICAgICAgICA8Q29tbXVuaWNhdG9yTWVzc2FnZXMvPlxuICAgICAgPC9BcHBsaWNhdGlvblBhbmVsPlxuICAgICAgPEhvdmVyQnV0dG9uIGljb249XCJlZGl0XCIgY2xhc3NOYW1lU3VmZml4PVwibmV3LW1lc3NhZ2VcIiBjbGFzc05hbWVFeHRlbnNpb249XCJjb21tdW5pY2F0b3JcIi8+XG4gICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4ge307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShDb21tdW5pY2F0b3JBcHBsaWNhdGlvbik7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB7Y29sb3JJbnRUb0hleH0gZnJvbSAnfi91dGlsL21vZGlmaWVycyc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJ34vYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbWVzc2FnZXMnO1xuXG5jbGFzcyBDb21tdW5pY2F0b3JNZXNzYWdlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy50b3VjaE1vZGVUaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHRvdWNoTW9kZTogZmFsc2VcbiAgICB9XG4gICAgXG4gICAgdGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uID0gdGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uLmJpbmQodGhpcyk7XG4gIH1cbiAgb25Ub3VjaFN0YXJ0TWVzc2FnZShtZXNzYWdlKXtcbiAgICBpZiAoIXRoaXMuc3RhdGUudG91Y2hNb2RlKXtcbiAgICAgIHRoaXMudG91Y2hNb2RlVGltZW91dCA9IHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgdGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgdG91Y2hNb2RlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSwgMzAwKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZE1lc3NhZ2UobWVzc2FnZSl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudG91Y2hNb2RlVGltZW91dCk7XG4gICAgaWYgKHRoaXMuc3RhdGUudG91Y2hNb2RlICYmICF0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkKXtcbiAgICAgIGxldCBpc1NlbGVjdGVkID0gdGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uKG1lc3NhZ2UpO1xuICAgICAgaWYgKGlzU2VsZWN0ZWQgJiYgdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZElkcy5sZW5ndGggPT09IDEpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICB0b3VjaE1vZGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5maXJzdFdhc0p1c3RTZWxlY3RlZCl7XG4gICAgICB0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHRvZ2dsZU1lc3NhZ2VTZWxlY3Rpb24obWVzc2FnZSl7XG4gICAgbGV0IGlzU2VsZWN0ZWQgPSB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkSWRzLmluY2x1ZGVzKG1lc3NhZ2UuaWQpO1xuICAgIGlmIChpc1NlbGVjdGVkKXtcbiAgICAgIHRoaXMucHJvcHMucmVtb3ZlRnJvbUNvbW11bmljYXRvclNlbGVjdGVkTWVzc2FnZXMobWVzc2FnZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5hZGRUb0NvbW11bmljYXRvclNlbGVjdGVkTWVzc2FnZXMobWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBpc1NlbGVjdGVkO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIGlmICh0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnN0YXRlID09PSBcIldBSVRcIil7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuc3RhdGUgPT09IFwiRVJST1JcIil7XG4gICAgICAvL1RPRE86IHB1dCBhIHRyYW5zbGF0aW9uIGhlcmUgcGxlYXNlISB0aGlzIGhhcHBlbnMgd2hlbiBtZXNzYWdlcyBmYWlsIHRvIGxvYWQsIGEgbm90aWZpY2F0aW9uIHNob3dzIHdpdGggdGhlIGVycm9yXG4gICAgICAvL21lc3NhZ2UgYnV0IGhlcmUgd2UgZ290IHRvIHB1dCBzb21ldGhpbmdcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImVtcHR5XCI+PHNwYW4+e1wiRVJST1JcIn08L3NwYW4+PC9kaXY+XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLm1lc3NhZ2VzLmxlbmd0aCA9PT0gMCl7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJlbXB0eVwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoXCJwbHVnaW4uY29tbXVuaWNhdG9yLmVtcHR5LnRvcGljXCIpfTwvc3Bhbj48L2Rpdj5cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgY29tbXVuaWNhdG9yIGFwcGxpY2F0aW9uLWxpc3QgJHt0aGlzLnN0YXRlLnRvdWNoTW9kZSA/IFwiYXBwbGljYXRpb24tbGlzdC1zZWxlY3QtbW9kZVwiIDogXCJcIn1gfT57XG4gICAgICB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSwgaW5kZXgpPT57XG4gICAgICAgIGxldCBpc1NlbGVjdGVkID0gdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZElkcy5pbmNsdWRlcyhtZXNzYWdlLmlkKTtcbiAgICAgICAgcmV0dXJuIDxkaXYga2V5PXttZXNzYWdlLmlkfVxuICAgICAgICAgIGNsYXNzTmFtZT17YGFwcGxpY2F0aW9uLWxpc3QtaXRlbSAke21lc3NhZ2UudW5yZWFkTWVzc2FnZXNJblRocmVhZCA/IFwiY29tbXVuaWNhdG9yLWFwcGxpY2F0aW9uLWxpc3QtaXRlbS11bnJlYWRcIiA6IFwiXCJ9ICR7aXNTZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCJ9YH1cbiAgICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0TWVzc2FnZS5iaW5kKHRoaXMsIG1lc3NhZ2UpfSBvblRvdWNoRW5kPXt0aGlzLm9uVG91Y2hFbmRNZXNzYWdlLmJpbmQodGhpcywgbWVzc2FnZSl9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tbGlzdC1pdGVtLWhlYWRlclwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2lzU2VsZWN0ZWR9IG9uQ2xpY2s9e3RoaXMudG9nZ2xlTWVzc2FnZVNlbGVjdGlvbi5iaW5kKHRoaXMsIG1lc3NhZ2UpfS8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgdGV4dCBjb21tdW5pY2F0b3ItdGV4dC11c2VybmFtZVwiPlxuICAgICAgICAgICAgICB7bWVzc2FnZS5zZW5kZXIuZmlyc3ROYW1lID8gbWVzc2FnZS5zZW5kZXIuZmlyc3ROYW1lICsgXCIgXCIgOiBcIlwifXttZXNzYWdlLnNlbmRlci5sYXN0TmFtZSA/IG1lc3NhZ2Uuc2VuZGVyLmxhc3ROYW1lIDogXCJcIn1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW11bmljYXRvci1hcHBsaWNhdGlvbi1saXN0LWl0ZW0tbGFiZWxzXCI+e21lc3NhZ2UubGFiZWxzLm1hcCgobGFiZWwpPT57XG4gICAgICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgdGV4dCBjb21tdW5pY2F0b3ItdGV4dC10YWdcIiBrZXk9e2xhYmVsLmlkfT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdGFnXCIgc3R5bGU9e3tjb2xvcjogY29sb3JJbnRUb0hleChsYWJlbC5sYWJlbENvbG9yKX19Pjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7bGFiZWwubGFiZWxOYW1lfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB9KX08L3NwYW4+XG4gICAgICAgICAgICB7bWVzc2FnZS5tZXNzYWdlQ291bnRJbnRocmVhZCA/IDxzcGFuIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IGNvbW11bmljYXRvci10ZXh0LWNvdW50ZXJcIj5cbiAgICAgICAgICAgICAge21lc3NhZ2UubWVzc2FnZUNvdW50SW50aHJlYWR9XG4gICAgICAgICAgICA8L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IGNvbW11bmljYXRvci10ZXh0LWRhdGVcIj5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50aW1lLmZvcm1hdChtZXNzYWdlLnRocmVhZExhdGVzdE1lc3NhZ2VEYXRlKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLWxpc3QtaXRlbS1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgdGV4dCBjb21tdW5pY2F0b3ItdGV4dC1ib2R5XCI+e21lc3NhZ2UuY2FwdGlvbn08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgfSlcbiAgICB9PC9kaXY+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBjb21tdW5pY2F0b3JNZXNzYWdlczogc3RhdGUuY29tbXVuaWNhdG9yTWVzc2FnZXMsXG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoQ29tbXVuaWNhdG9yTWVzc2FnZXMpOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBEcm9wZG93biBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3gnO1xuaW1wb3J0IExpbmsgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3gnO1xuaW1wb3J0IHtmaWx0ZXJNYXRjaCwgZmlsdGVySGlnaGxpZ2h0LCBpbnRlcnNlY3QsIGRpZmZlcmVuY2V9IGZyb20gJ34vdXRpbC9tb2RpZmllcnMnO1xuXG5jbGFzcyBDb21tdW5pY2F0b3JUb29sYmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLnVwZGF0ZUxhYmVsRmlsdGVyID0gdGhpcy51cGRhdGVMYWJlbEZpbHRlci5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBsYWJlbEZpbHRlcjogXCJcIlxuICAgIH1cbiAgfVxuICB1cGRhdGVMYWJlbEZpbHRlcihlKXtcbiAgICB0aGlzLnNldFN0YXRlKHtsYWJlbEZpbHRlcjogZS50YXJnZXQudmFsdWV9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICBsZXQgY3VycmVudExvY2F0aW9uID0gdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JOYXZpZ2F0aW9uLmZpbmQoKGl0ZW0pPT57XG4gICAgICByZXR1cm4gKGl0ZW0ubG9jYXRpb24gPT09IHRoaXMucHJvcHMuaGFzaCk7XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKCFjdXJyZW50TG9jYXRpb24pe1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnByb3BzLmluTWVzc2FnZSl7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3ItbmF2aWdhdGlvblwiPlxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1nby1iYWNrIGNvbW11bmljYXRvci1pbnRlcmFjdC1nby1iYWNrXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWdvYmFja1wiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgdGV4dCBjb21tdW5pY2F0b3ItdGV4dC1jdXJyZW50LWZvbGRlclwiPnt0aGlzLnByb3BzLmZvbGRlcn08L0xpbms+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciBidXR0b24gYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLWRlbGV0ZSBjb21tdW5pY2F0b3ItdG9vbGJhci1pbnRlcmFjdC1kZWxldGVcIj5cbiAgICAgICAgICB7LyogRklYTUUgdGhpcyBpcyBub3QgdGhlIHJpZ2h0IGljb24sIHRoZXJlIGFyZSBubyB0cmFzaCBiaW4gaW4gdGhlIGZpbGUgKi99XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWZvcmdvdHBhc3N3b3JkXCI+PC9zcGFuPlxuICAgICAgICA8L0xpbms+XG4gICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciBidXR0b24gYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLWxhYmVsIGNvbW11bmljYXRvci10b29sYmFyLWludGVyYWN0LWxhYmVsXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRhZ1wiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgICBcbiAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGJ1dHRvbiBidXR0b24tcGlsbCBjb21tdW5pY2F0b3ItYnV0dG9uLXBpbGwtdG9nZ2xlLXJlYWQgY29tbXVuaWNhdG9yLXRvb2xiYXItaW50ZXJhY3QtdG9nZ2xlLXJlYWRcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIHs/Y3VycmVudE1lc3NhZ2VIYXNVbnJlYWRNZXNzYWdlc31pY29uLW1lc3NhZ2UtcmVhZHs6ZWxzZX1pY29uLW1lc3NhZ2UtdW5yZWFkey9jdXJyZW50TWVzc2FnZUhhc1VucmVhZE1lc3NhZ2VzfVwiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1uZXh0LXBhZ2UgY29tbXVuaWNhdG9yLXRvb2xiYXItaW50ZXJhY3QtdG9nZ2xlLW5leHQtcGFnZVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1hcnJvdy1yaWdodFwiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1wcmV2LXBhZ2UgY29tbXVuaWNhdG9yLXRvb2xiYXItaW50ZXJhY3QtdG9nZ2xlLXByZXYtcGFnZVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICA8L0xpbms+XG4gICAgICA8L2Rpdj5cbiAgICB9XG4gICAgXG4gICAgbGV0IGFsbEluQ29tbW9uID0gW107XG4gICAgbGV0IG9ubHlJblNvbWUgPSBbXTtcbiAgICBsZXQgaXNBdExlYXN0T25lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkLmxlbmd0aCA+PSAxO1xuICAgIGlmIChpc0F0TGVhc3RPbmVTZWxlY3RlZCl7XG4gICAgICBsZXQgcGFydGlhbElkcyA9IHRoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuc2VsZWN0ZWQubWFwKChtZXNzYWdlKT0+e3JldHVybiBtZXNzYWdlLmxhYmVscy5tYXAobD0+bC5sYWJlbElkKX0pO1xuICAgICAgYWxsSW5Db21tb24gPSBpbnRlcnNlY3QoLi4ucGFydGlhbElkcyk7XG4gICAgICBvbmx5SW5Tb21lID0gZGlmZmVyZW5jZSguLi5wYXJ0aWFsSWRzKTtcbiAgICB9XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yLW5hdmlnYXRpb25cIj5cbiAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IGNvbW11bmljYXRvci10ZXh0LWN1cnJlbnQtZm9sZGVyXCI+e2N1cnJlbnRMb2NhdGlvbi50ZXh0KHRoaXMucHJvcHMuaTE4bil9PC9MaW5rPlxuICAgICAgICAgICAgICAgIFxuICAgICAgPExpbmsgY2xhc3NOYW1lPXtgY29tbXVuaWNhdG9yIGJ1dHRvbiBidXR0b24tcGlsbCBjb21tdW5pY2F0b3ItYnV0dG9uLXBpbGwtZGVsZXRlICR7dGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZC5sZW5ndGggPT0gMCA/IFwiZGlzYWJsZWRcIiA6IFwiXCJ9YH0+XG4gICAgICAgIHsvKiBGSVhNRSB0aGlzIGlzIG5vdCB0aGUgcmlnaHQgaWNvbiwgdGhlcmUgYXJlIG5vIHRyYXNoIGJpbiBpbiB0aGUgZmlsZSAqL31cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWZvcmdvdHBhc3N3b3JkXCI+PC9zcGFuPlxuICAgICAgPC9MaW5rPlxuICAgIFxuICAgICAgPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj1cImNvbW11bmljYXRvclwiIGNsYXNzTmFtZVN1ZmZpeD1cImxhYmVsc1wiIGl0ZW1zPXtcbiAgICAgICAgW1xuICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWZpZWxkXCIgaWQ9XCJjb21tdW5pY2F0b3ItdG9vbGJhci1sYWJlbHMtZHJvcGRvd24taW5wdXRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5sYWJlbEZpbHRlcn0gb25DaGFuZ2U9e3RoaXMudXBkYXRlTGFiZWxGaWx0ZXJ9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5jb21tdW5pY2F0b3IubGFiZWwuY3JlYXRlLnRleHRmaWVsZC5wbGFjZWhvbGRlcicpfSAvPixcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgbGluayBsaW5rLWZ1bGwgY29tbXVuaWNhdG9yLWxpbmstbmV3XCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KFwicGx1Z2luLmNvbW11bmljYXRvci5sYWJlbC5jcmVhdGVcIil9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICBdLmNvbmNhdCh0aGlzLnByb3BzLmNvbW11bmljYXRvck5hdmlnYXRpb24uZmlsdGVyKChpdGVtKT0+e1xuICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09IFwibGFiZWxcIiAmJiBmaWx0ZXJNYXRjaChpdGVtLnRleHQodGhpcy5wcm9wcy5pMThuKSwgdGhpcy5zdGF0ZS5sYWJlbEZpbHRlcik7XG4gICAgICAgIH0pLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICBsZXQgaXNTZWxlY3RlZCA9IGFsbEluQ29tbW9uLmluY2x1ZGVzKGl0ZW0uaWQpO1xuICAgICAgICAgIGxldCBpc1BhcnRpYWxseVNlbGVjdGVkID0gb25seUluU29tZS5pbmNsdWRlcyhpdGVtLmlkKTtcbiAgICAgICAgICByZXR1cm4gKDxMaW5rIGNsYXNzTmFtZT17YGNvbW11bmljYXRvciBsaW5rIGxpbmstZnVsbCBjb21tdW5pY2F0b3ItbGluay1sYWJlbCAke2lzU2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifSAke2lzUGFydGlhbGx5U2VsZWN0ZWQgPyBcInNlbWktc2VsZWN0ZWRcIiA6IFwiXCJ9ICR7aXNBdExlYXN0T25lU2VsZWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwifWB9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRhZ1wiIHN0eWxlPXt7Y29sb3I6IGl0ZW0uY29sb3J9fT48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0XCI+e2ZpbHRlckhpZ2hsaWdodChpdGVtLnRleHQodGhpcy5wcm9wcy5pMThuKSwgdGhpcy5zdGF0ZS5sYWJlbEZpbHRlcil9PC9zcGFuPlxuICAgICAgICAgIDwvTGluaz4pO1xuICAgICAgICB9KSlcbiAgICAgIH0+XG4gICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciBidXR0b24gYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLWxhYmVsXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRhZ1wiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgPC9Ecm9wZG93bj5cbiAgICAgIFxuICAgICAgPExpbmsgY2xhc3NOYW1lPXtgY29tbXVuaWNhdG9yIGJ1dHRvbiBidXR0b24tcGlsbCBjb21tdW5pY2F0b3ItYnV0dG9uLXBpbGwtdG9nZ2xlLXJlYWQgJHt0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkLmxlbmd0aCAhPT0gMSA/IFwiZGlzYWJsZWRcIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gaWNvbi1tZXNzYWdlLSR7dGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZC5sZW5ndGggPT09IDEgJiYgdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZFswXS51bnJlYWRNZXNzYWdlc0luVGhyZWFkID8gXCJ1blwiIDogXCJcIn1yZWFkYH0+PC9zcGFuPlxuICAgICAgPC9MaW5rPlxuICAgIDwvZGl2PlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgY29tbXVuaWNhdG9yTmF2aWdhdGlvbjogc3RhdGUuY29tbXVuaWNhdG9yTmF2aWdhdGlvbixcbiAgICBjb21tdW5pY2F0b3JNZXNzYWdlczogc3RhdGUuY29tbXVuaWNhdG9yTWVzc2FnZXMsXG4gICAgaGFzaDogc3RhdGUuaGFzaCxcbiAgICBpMThuOiBzdGF0ZS5pMThuXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoQ29tbXVuaWNhdG9yVG9vbGJhcik7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IExpbmsgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbGluay5qc3gnO1xuXG5jbGFzcyBOYXZpZ2F0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGl0ZW0tbGlzdCBjb21tdW5pY2F0b3ItaXRlbS1saXN0LW5hdmlnYXRpb25cIj5cbiAgICAgIHt0aGlzLnByb3BzLmNvbW11bmljYXRvck5hdmlnYXRpb24ubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgbGV0IHN0eWxlID0ge307XG4gICAgICAgIGlmIChpdGVtLmNvbG9yKXtcbiAgICAgICAgICBzdHlsZS5jb2xvciA9IGl0ZW0uY29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDxMaW5rIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YGl0ZW0tbGlzdC1pdGVtICR7dGhpcy5wcm9wcy5oYXNoID09PSBpdGVtLmxvY2F0aW9uID8gXCJhY3RpdmVcIiA6IFwiXCJ9YH0gaHJlZj17YCMke2l0ZW0ubG9jYXRpb259YH0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9IHN0eWxlPXtzdHlsZX0+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIml0ZW0tbGlzdC10ZXh0LWJvZHkgdGV4dFwiPlxuICAgICAgICAgICAge2l0ZW0udGV4dCh0aGlzLnByb3BzLmkxOG4pfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgfSl9XG4gICAgPC9kaXY+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBsYWJlbHM6IHN0YXRlLmxhYmVscyxcbiAgICBoYXNoOiBzdGF0ZS5oYXNoLFxuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgY29tbXVuaWNhdG9yTmF2aWdhdGlvbjogc3RhdGUuY29tbXVuaWNhdG9yTmF2aWdhdGlvblxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE5hdmlnYXRpb24pOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBsaWNhdGlvblBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB0aXRsZTogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBpY29uOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIHByaW1hcnlPcHRpb246IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgdG9vbGJhcjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGFwcGxpY2F0aW9uLXBhbmVsYH0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLW5hdmlnYXRpb25cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLWxlZnQtY29udGFpbmVyXCI+e3RoaXMucHJvcHMudGl0bGV9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBsaWNhdGlvbi1wYW5lbC1yaWdodC1jb250YWluZXJcIj57dGhpcy5wcm9wcy5pY29ufTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBsaWNhdGlvbi1wYW5lbC1ib3hcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLW5hdmlnYXRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtbGVmdC1jb250YWluZXJcIj57dGhpcy5wcm9wcy5wcmltYXJ5T3B0aW9ufTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBsaWNhdGlvbi1wYW5lbC1yaWdodC1jb250YWluZXJcIj57dGhpcy5wcm9wcy50b29sYmFyfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBsaWNhdGlvbi1wYW5lbC1sZWZ0LWNvbnRhaW5lclwiPnt0aGlzLnByb3BzLm5hdmlnYXRpb259PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLXJpZ2h0LWNvbnRhaW5lciBsb2FkZXItZW1wdHlcIj57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj4pO1xuICB9XG59XG5cbiIsImltcG9ydCBQb3J0YWwgZnJvbSAnLi9wb3J0YWwuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtmaW5kRE9NTm9kZX0gZnJvbSAncmVhY3QtZG9tJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSkuaXNSZXF1aXJlZFxuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbk9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmVmb3JlQ2xvc2UgPSB0aGlzLmJlZm9yZUNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG9wOiBudWxsLFxuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIGFycm93TGVmdDogbnVsbCxcbiAgICAgIGFycm93UmlnaHQ6IG51bGwsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH1cbiAgfVxuICBvbk9wZW4oRE9NTm9kZSl7XG4gICAgbGV0IGFjdGl2YXRvciA9IHRoaXMucmVmcy5hY3RpdmF0b3I7XG4gICAgaWYgKCEoYWN0aXZhdG9yIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKXtcbiAgICAgIGFjdGl2YXRvciA9IGZpbmRET01Ob2RlKGFjdGl2YXRvcik7XG4gICAgfVxuICAgIFxuICAgIGxldCAkdGFyZ2V0ID0gJChhY3RpdmF0b3IpO1xuICAgIGxldCAkYXJyb3cgPSAkKHRoaXMucmVmcy5hcnJvdyk7XG4gICAgbGV0ICRkcm9wZG93biA9ICQodGhpcy5yZWZzLmRyb3Bkb3duKTtcbiAgICAgIFxuICAgIGxldCBwb3NpdGlvbiA9ICR0YXJnZXQub2Zmc2V0KCk7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgbGV0IG1vcmVTcGFjZUluVGhlTGVmdFNpZGUgPSAod2luZG93V2lkdGggLSBwb3NpdGlvbi5sZWZ0KSA8IHBvc2l0aW9uLmxlZnQ7XG4gICAgXG4gICAgbGV0IGxlZnQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0IC0gJGRyb3Bkb3duLm91dGVyV2lkdGgoKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0ID0gcG9zaXRpb24ubGVmdDtcbiAgICB9XG4gICAgbGV0IHRvcCA9IHBvc2l0aW9uLnRvcCArICR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDU7XG4gICAgXG4gICAgbGV0IGFycm93TGVmdCA9IG51bGw7XG4gICAgbGV0IGFycm93UmlnaHQgPSBudWxsO1xuICAgIGlmIChtb3JlU3BhY2VJblRoZUxlZnRTaWRlKXtcbiAgICAgIGFycm93UmlnaHQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3dMZWZ0ID0gKCR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgKyAoJGFycm93LndpZHRoKCkvMik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe3RvcCwgbGVmdCwgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0LCB2aXNpYmxlOiB0cnVlfSk7XG4gIH1cbiAgYmVmb3JlQ2xvc2UoRE9NTm9kZSwgcmVtb3ZlRnJvbURPTSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocmVtb3ZlRnJvbURPTSwgMzAwKTtcbiAgfVxuICBjbG9zZSgpe1xuICAgIHRoaXMucmVmcy5wb3J0YWwuY2xvc2VQb3J0YWwoKTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPFBvcnRhbCByZWY9XCJwb3J0YWxcIiBvcGVuQnlDbGlja09uPXtSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jaGlsZHJlbiwgeyByZWY6IFwiYWN0aXZhdG9yXCIgfSl9XG4gICAgICBjbG9zZU9uRXNjIGNsb3NlT25PdXRzaWRlQ2xpY2sgY2xvc2VPblNjcm9sbCBvbk9wZW49e3RoaXMub25PcGVufSBiZWZvcmVDbG9zZT17dGhpcy5iZWZvcmVDbG9zZX0+XG4gICAgICA8ZGl2IHJlZj1cImRyb3Bkb3duXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubGVmdFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBkcm9wZG93biAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1kcm9wZG93bi0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXJyb3dcIiByZWY9XCJhcnJvd1wiIHN0eWxlPXt7bGVmdDogdGhpcy5zdGF0ZS5hcnJvd0xlZnQsIHJpZ2h0OiB0aGlzLnN0YXRlLmFycm93UmlnaHR9fT48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdHlwZW9mIGl0ZW0gPT09IFwiZnVuY3Rpb25cIiA/IGl0ZW0odGhpcy5jbG9zZSkgOiBpdGVtO1xuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAge2VsZW1lbnR9XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvUG9ydGFsPlxuICB9XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTGluayBmcm9tICcuL2xpbmsuanN4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG92ZXJCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVN1ZmZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGljb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBocmVmOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8TGluayBocmVmPXt0aGlzLnByb3BzLmhyZWZ9IG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBidXR0b24tcGlsbCBidXR0b24tcGlsbC1mbG9hdGluZyAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1idXR0b24tcGlsbC0ke3RoaXMucHJvcHMuY2xhc3NOYW1lU3VmZml4fWB9PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5pY29ufWB9Pjwvc3Bhbj5cbiAgICA8L0xpbms+KTtcbiAgfVxufSIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiBzY3JvbGxUb1NlY3Rpb24oYW5jaG9yKSB7XG4gIGlmICghJChhbmNob3IpLnNpemUoKSl7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhbmNob3I7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBsZXQgdG9wT2Zmc2V0ID0gOTA7XG4gIGxldCBzY3JvbGxUb3AgPSAkKGFuY2hvcikub2Zmc2V0KCkudG9wIC0gdG9wT2Zmc2V0O1xuXG4gICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgc2Nyb2xsVG9wIDogc2Nyb2xsVG9wXG4gIH0sIHtcbiAgICBkdXJhdGlvbiA6IDUwMCxcbiAgICBlYXNpbmcgOiBcImVhc2VJbk91dFF1YWRcIlxuICB9KTtcbiAgXG4gIHNldFRpbWVvdXQoKCk9PntcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFuY2hvcjtcbiAgfSwgNTAwKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5vbkNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhY3RpdmU6IGZhbHNlXG4gICAgfVxuICB9XG4gIG9uQ2xpY2soZSwgcmUpe1xuICAgIGlmICh0aGlzLnByb3BzLmhyZWYgJiYgdGhpcy5wcm9wcy5ocmVmWzBdID09PSAnIycpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2Nyb2xsVG9TZWN0aW9uKHRoaXMucHJvcHMuaHJlZik7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spe1xuICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrKGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaFN0YXJ0KGUsIHJlKXtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmU6IHRydWV9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vblRvdWNoU3RhcnQpe1xuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoU3RhcnQoZSwgcmUpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoRW5kKGUsIHJlKXtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmU6IGZhbHNlfSk7XG4gICAgdGhpcy5vbkNsaWNrKGUsIHJlKTtcbiAgICBpZiAodGhpcy5wcm9wcy5vblRvdWNoRW5kKXtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaEVuZChlLCByZSk7XG4gICAgfVxuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8YSB7Li4udGhpcy5wcm9wc31cbiAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWUgKyAodGhpcy5zdGF0ZS5hY3RpdmUgPyBcIiBhY3RpdmVcIiA6IFwiXCIpfVxuICAgICAgb25DbGljaz17dGhpcy5vbkNsaWNrfSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoRW5kPXt0aGlzLm9uVG91Y2hFbmR9Lz5cbiAgfVxufSIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTGFuZ3VhZ2VQaWNrZXIgZnJvbSAnLi9uYXZiYXIvbGFuZ3VhZ2UtcGlja2VyLmpzeCc7XG5pbXBvcnQgUHJvZmlsZUl0ZW0gZnJvbSAnLi9uYXZiYXIvcHJvZmlsZS1pdGVtLmpzeCc7XG5pbXBvcnQgTWVudSBmcm9tICcuL25hdmJhci9tZW51LmpzeCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub3Blbk1lbnUgPSB0aGlzLm9wZW5NZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZU1lbnUgPSB0aGlzLmNsb3NlTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc01lbnVPcGVuOiBmYWxzZVxuICAgIH1cbiAgfVxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG5hdmJhckl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgaXRlbTogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuICAgIG1lbnVJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgZGVmYXVsdE9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkLFxuICAgIG5hdmlnYXRpb246IFByb3BUeXBlcy5lbGVtZW50XG4gIH1cbiAgb3Blbk1lbnUoKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzTWVudU9wZW46IHRydWVcbiAgICB9KTtcbiAgfVxuICBjbG9zZU1lbnUoKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzTWVudU9wZW46IGZhbHNlXG4gICAgfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPXtgbmF2YmFyICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259YH0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2BuYXZiYXItaXRlbSAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1uYXZiYXItaXRlbS1tZW51LWJ1dHRvbmB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbGluayBsaW5rLWljb24gbGluay1mdWxsYH0gb25DbGljaz17dGhpcy5vcGVuTWVudX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1uYXZpY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMubmF2YmFySXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtgbmF2YmFyLWl0ZW0gJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbmF2YmFyLWl0ZW0tJHtpdGVtLmNsYXNzTmFtZVN1ZmZpeH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0uaXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoaXRlbT0+ISFpdGVtKX1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZGVmYXVsdC1vcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWRlZmF1bHQtb3B0aW9ucy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5kZWZhdWx0T3B0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICA8UHJvZmlsZUl0ZW0gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0vPlxuICAgICAgICAgICAgICAgICAgICAgIDxMYW5ndWFnZVBpY2tlciBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L25hdj5cbiAgICAgICAgICAgICAgPE1lbnUgb3Blbj17dGhpcy5zdGF0ZS5pc01lbnVPcGVufSBvbkNsb3NlPXt0aGlzLmNsb3NlTWVudX1cbiAgICAgICAgICAgICAgICBpdGVtcz17dGhpcy5wcm9wcy5tZW51SXRlbXN9IGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IG5hdmlnYXRpb249e3RoaXMucHJvcHMubmF2aWdhdGlvbn0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBhY3Rpb25zIGZyb20gJ34vYWN0aW9ucy9iYXNlL2xvY2FsZXMnO1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2Ryb3Bkb3duLmpzeCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5jbGFzcyBMYW5ndWFnZVBpY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxEcm9wZG93biBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBjbGFzc05hbWVTdWZmaXg9XCJsYW5ndWFnZS1waWNrZXJcIiBpdGVtcz17dGhpcy5wcm9wcy5sb2NhbGVzLmF2YWxpYWJsZS5tYXAoKGxvY2FsZSk9PntcbiAgICAgIHJldHVybiAoPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbGluayBsaW5rLWZ1bGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tbGluay1sYW5ndWFnZS1waWNrZXJgfSBvbkNsaWNrPXt0aGlzLnByb3BzLnNldExvY2FsZS5iaW5kKHRoaXMsIGxvY2FsZS5sb2NhbGUpfT5cbiAgICAgICAgPHNwYW4+e2xvY2FsZS5uYW1lfTwvc3Bhbj5cbiAgICAgIDwvYT4pO1xuICAgIH0pfT5cbiAgICAgIDxhIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGJ1dHRvbi1waWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1waWxsLWxhbmd1YWdlYH0+XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmxvY2FsZXMuY3VycmVudH08L3NwYW4+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGxvY2FsZXM6IHN0YXRlLmxvY2FsZXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKExhbmd1YWdlUGlja2VyKTsiLCJpbXBvcnQgTGluayBmcm9tICcuLi9saW5rLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2Uvc3RhdHVzJztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcblxuZnVuY3Rpb24gY2hlY2tMaW5rQ2xpY2tlZCh0YXJnZXQpe1xuICByZXR1cm4gdGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYVwiIHx8ICh0YXJnZXQucGFyZW50RWxlbWVudCA/IGNoZWNrTGlua0NsaWNrZWQodGFyZ2V0LnBhcmVudEVsZW1lbnQpIDogZmFsc2UpO1xufVxuXG5jbGFzcyBNZW51IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcGVuOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KS5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG5hdmlnYXRpb246IFByb3BUeXBlcy5lbGVtZW50XG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoTW92ZSA9IHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9wZW4gPSB0aGlzLm9wZW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VCeU92ZXJsYXkgPSB0aGlzLmNsb3NlQnlPdmVybGF5LmJpbmQodGhpcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRpc3BsYXllZDogcHJvcHMub3BlbixcbiAgICAgIHZpc2libGU6IHByb3BzLm9wZW4sXG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBkcmFnOiBudWxsLFxuICAgICAgb3BlbjogcHJvcHMub3BlblxuICAgIH1cbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyl7XG4gICAgaWYgKG5leHRQcm9wcy5vcGVuICYmICF0aGlzLnN0YXRlLm9wZW4pe1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSBlbHNlIGlmICghbmV4dFByb3BzLm9wZW4gJiYgdGhpcy5zdGF0ZS5vcGVuKXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaFN0YXJ0KGUpe1xuICAgIHRoaXMuc2V0U3RhdGUoeydkcmFnZ2luZyc6IHRydWV9KTtcbiAgICB0aGlzLnRvdWNoQ29yZFggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuICAgIHRoaXMudG91Y2hNb3ZlbWVudFggPSAwO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvblRvdWNoTW92ZShlKXtcbiAgICBsZXQgZGlmZlggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIC0gdGhpcy50b3VjaENvcmRYO1xuICAgIGxldCBhYnNvbHV0ZURpZmZlcmVuY2VYID0gTWF0aC5hYnMoZGlmZlggLSB0aGlzLnN0YXRlLmRyYWcpO1xuICAgIHRoaXMudG91Y2hNb3ZlbWVudFggKz0gYWJzb2x1dGVEaWZmZXJlbmNlWDtcblxuICAgIGlmIChkaWZmWCA+IDApIHtcbiAgICAgIGRpZmZYID0gMDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZzogZGlmZlh9KTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb25Ub3VjaEVuZChlKXtcbiAgICBsZXQgd2lkdGggPSAkKHRoaXMucmVmcy5tZW51Q29udGFpbmVyKS53aWR0aCgpO1xuICAgIGxldCBkaWZmID0gdGhpcy5zdGF0ZS5kcmFnO1xuICAgIGxldCBtb3ZlbWVudCA9IHRoaXMudG91Y2hNb3ZlbWVudFg7XG4gICAgXG4gICAgbGV0IG1lbnVIYXNTbGlkZWRFbm91Z2hGb3JDbG9zaW5nID0gTWF0aC5hYnMoZGlmZikgPj0gd2lkdGgqMC4zMztcbiAgICBsZXQgeW91SnVzdENsaWNrZWRUaGVPdmVybGF5ID0gZS50YXJnZXQgPT09IHRoaXMucmVmcy5tZW51ICYmIG1vdmVtZW50IDw9IDU7XG4gICAgbGV0IHlvdUp1c3RDbGlja2VkQUxpbmsgPSBjaGVja0xpbmtDbGlja2VkKGUudGFyZ2V0KSAmJiBtb3ZlbWVudCA8PSA1O1xuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnaW5nOiBmYWxzZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWc6IG51bGx9KTtcbiAgICAgIGlmIChtZW51SGFzU2xpZGVkRW5vdWdoRm9yQ2xvc2luZyB8fCB5b3VKdXN0Q2xpY2tlZFRoZU92ZXJsYXkgfHwgeW91SnVzdENsaWNrZWRBTGluayl7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9LCAxMCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9wZW4oKXtcbiAgICB0aGlzLnNldFN0YXRlKHtkaXNwbGF5ZWQ6IHRydWUsIG9wZW46IHRydWV9KTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHt2aXNpYmxlOiB0cnVlfSk7XG4gICAgfSwgMTApO1xuICAgICQoZG9jdW1lbnQuYm9keSkuY3NzKHsnb3ZlcmZsb3cnOiAnaGlkZGVuJ30pO1xuICB9XG4gIGNsb3NlQnlPdmVybGF5KGUpe1xuICAgIGxldCBpc092ZXJsYXkgPSBlLnRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0O1xuICAgIGxldCBpc0xpbmsgPSBjaGVja0xpbmtDbGlja2VkKGUudGFyZ2V0KTtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZHJhZ2dpbmcgJiYgKGlzT3ZlcmxheSB8fCBpc0xpbmspKXtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgY2xvc2UoKXtcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyh7J292ZXJmbG93JzogJyd9KTtcbiAgICB0aGlzLnNldFN0YXRlKHt2aXNpYmxlOiBmYWxzZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogZmFsc2UsIG9wZW46IGZhbHNlfSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9LCAzMDApO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBtZW51ICR7dGhpcy5zdGF0ZS5kaXNwbGF5ZWQgPyBcImRpc3BsYXllZFwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGVcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS5kcmFnZ2luZyA/IFwiZHJhZ2dpbmdcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jbG9zZUJ5T3ZlcmxheX0gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH0gb25Ub3VjaE1vdmU9e3RoaXMub25Ub3VjaE1vdmV9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0gcmVmPVwibWVudVwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1jb250YWluZXJcIiByZWY9XCJtZW51Q29udGFpbmVyXCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmRyYWd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtbG9nb1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWVudS1oZWFkZXItYnV0dG9uLWNsb3NlIGljb24gaWNvbi1hcnJvdy1sZWZ0XCI+PC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5uYXZpZ2F0aW9uID8gPGRpdiBjbGFzc05hbWU9XCJtZW51LWV4dHJhc1wiPnt0aGlzLnByb3BzLm5hdmlnYXRpb259PC9kaXY+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJtZW51LWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGtleT17aW5kZXh9PntpdGVtfTwvbGk+XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtIG1lbnUtaXRlbS1zcGFjZVwiPjwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtcHJvZmlsZVwiIGhyZWY9XCIvcHJvZmlsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9iamVjdCBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLXByb2ZpbGUtaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXtgL3Jlc3QvdXNlci9maWxlcy91c2VyLyR7dGhpcy5wcm9wcy5zdGF0dXMudXNlcklkfS9pZGVudGlmaWVyL3Byb2ZpbGUtaW1hZ2UtOTZgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiaW1hZ2UvanBlZ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdXNlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvb2JqZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLnByb2ZpbGUucHJvZmlsZScpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSBtYWluLWZ1bmN0aW9uLWxpbmstbWVudS1pbnN0cnVjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1mb3Jnb3RwYXNzd29yZFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5mb290ZXIuaW5zdHJ1Y3Rpb25zJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51IG1haW4tZnVuY3Rpb24tbGluay1tZW51LWhlbHBkZXNrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24taGVscGRlc2tcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uaG9tZS5oZWxwZGVzaycpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSBtYWluLWZ1bmN0aW9uLWxpbmstbWVudS1sb2dvdXRcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmxvZ291dH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tc2lnbm91dFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5sb2dvdXQubG9nb3V0Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuLFxuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShNZW51KTtcbiAgXG4iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2Ryb3Bkb3duLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5pbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9zdGF0dXMnO1xuXG5jbGFzcyBQcm9maWxlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgaWYgKCF0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbil7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIGljb246IFwidXNlclwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLnByb2ZpbGUubGlua3MucGVyc29uYWwnLFxuICAgICAgICBocmVmOiBcIi9wcm9maWxlXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwiZm9yZ290cGFzc3dvcmRcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5mb290ZXIuaW5zdHJ1Y3Rpb25zJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJoZWxwZGVza1wiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmhvbWUuaGVscGRlc2snXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcInNpZ25vdXRcIixcbiAgICAgICAgdGV4dDogJ3BsdWdpbi5sb2dvdXQubG9nb3V0JyxcbiAgICAgICAgb25DbGljazogdGhpcy5wcm9wcy5sb2dvdXRcbiAgICAgIH1cbiAgICBdXG4gICAgcmV0dXJuIDxEcm9wZG93biBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBjbGFzc05hbWVTdWZmaXg9XCJwcm9maWxlLW1lbnVcIiBpdGVtcz17aXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICByZXR1cm4gKGNsb3NlRHJvcGRvd24pPT57cmV0dXJuIDxMaW5rIGhyZWY9XCIvcHJvZmlsZVwiXG4gICAgICAgICBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstZnVsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1saW5rLXByb2ZpbGUtbWVudWB9XG4gICAgICAgICBvbkNsaWNrPXsoLi4uYXJncyk9PntjbG9zZURyb3Bkb3duKCk7aXRlbS5vbkNsaWNrICYmIGl0ZW0ub25DbGljayguLi5hcmdzKX19IGhyZWY9e2l0ZW0uaHJlZn0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9Pjwvc3Bhbj5cbiAgICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KGl0ZW0udGV4dCl9PC9zcGFuPlxuICAgICAgICA8L0xpbms+fVxuICAgICAgfSl9PlxuICAgICAgPGEgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBidXR0b24tcGlsbCBtYWluLWZ1bmN0aW9uLWJ1dHRvbi1waWxsLXByb2ZpbGVcIj5cbiAgICAgICAgPG9iamVjdCBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLWZ1bGxcIlxuICAgICAgICAgZGF0YT17YC9yZXN0L3VzZXIvZmlsZXMvdXNlci8ke3RoaXMucHJvcHMuc3RhdHVzLnVzZXJJZH0vaWRlbnRpZmllci9wcm9maWxlLWltYWdlLTk2YH1cbiAgICAgICAgIHR5cGU9XCJpbWFnZS9qcGVnXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXVzZXJcIj48L3NwYW4+XG4gICAgICAgIDwvb2JqZWN0PlxuICAgICAgPC9hPlxuICAgIDwvRHJvcGRvd24+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBpMThuOiBzdGF0ZS5pMThuLFxuICAgIHN0YXR1czogc3RhdGUuc3RhdHVzXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShQcm9maWxlSXRlbSk7IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3Vuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyLCB1bm1vdW50Q29tcG9uZW50QXROb2RlLCBmaW5kRE9NTm9kZX0gZnJvbSAncmVhY3QtZG9tJztcblxuY29uc3QgS0VZQ09ERVMgPSB7XG4gIEVTQ0FQRTogMjdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcnRhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHsgYWN0aXZlOiBmYWxzZSB9O1xuICAgIHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrID0gdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlUG9ydGFsID0gdGhpcy5jbG9zZVBvcnRhbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVLZXlkb3duID0gdGhpcy5oYW5kbGVLZXlkb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgIHRoaXMubm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uRXNjKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TY3JvbGwpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICBpZiAobmV4dFN0YXRlLmFjdGl2ZSl7XG4gICAgICB0aGlzLnJlbmRlclBvcnRhbChuZXh0UHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBvcnRhbCh0cnVlKTtcbiAgfVxuXG4gIGhhbmRsZVdyYXBwZXJDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMub3BlblBvcnRhbCgpO1xuICB9XG5cbiAgb3BlblBvcnRhbChwcm9wcyA9IHRoaXMucHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgIHRoaXMucmVuZGVyUG9ydGFsKHByb3BzLCB0cnVlKTtcbiAgfVxuXG4gIGNsb3NlUG9ydGFsKGlzVW5tb3VudGVkID0gZmFsc2UpIHtcbiAgICBjb25zdCByZXNldFBvcnRhbFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICB1bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMubm9kZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICBpZiAoaXNVbm1vdW50ZWQgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuYmVmb3JlQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5iZWZvcmVDbG9zZSh0aGlzLm5vZGUsIHJlc2V0UG9ydGFsU3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzZXRQb3J0YWxTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVPdXRzaWRlTW91c2VDbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSBmaW5kRE9NTm9kZSh0aGlzLnBvcnRhbCk7XG4gICAgaWYgKHJvb3QuY29udGFpbnMoZS50YXJnZXQpIHx8IChlLmJ1dHRvbiAmJiBlLmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwoKTtcbiAgfVxuXG4gIGhhbmRsZUtleWRvd24oZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IEtFWUNPREVTLkVTQ0FQRSAmJiB0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclBvcnRhbChwcm9wcywgaXNPcGVuaW5nKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2ppbWZiL2Q5OWUwNjc4ZTlkYTcxNWNjZjY0NTQ5NjFlZjA0ZDFiXG4gICAgaWYgKHR5cGVvZiBwcm9wcy5jaGlsZHJlbi50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjaGlsZHJlbiA9IFJlYWN0LmNsb25lRWxlbWVudChwcm9wcy5jaGlsZHJlbiwge1xuICAgICAgICBjbG9zZVBvcnRhbDogdGhpcy5jbG9zZVBvcnRhbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3J0YWwgPSB1bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcihcbiAgICAgIHRoaXMsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHRoaXMubm9kZSxcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGVcbiAgICApO1xuICAgIFxuICAgIGlmIChpc09wZW5pbmcpIHtcbiAgICAgIHRoaXMucHJvcHMub25PcGVuKHRoaXMubm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5vcGVuQnlDbGlja09uLCB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlV3JhcHBlckNsaWNrXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuUG9ydGFsLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIG9wZW5CeUNsaWNrT246IFByb3BUeXBlcy5lbGVtZW50LFxuICBjbG9zZU9uRXNjOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPbk91dHNpZGVDbGljazogUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25TY3JvbGw6IFByb3BUeXBlcy5ib29sLFxuICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgYmVmb3JlQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblVwZGF0ZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cblBvcnRhbC5kZWZhdWx0UHJvcHMgPSB7XG4gIG9uT3BlbjogKCkgPT4ge30sXG4gIG9uQ2xvc2U6ICgpID0+IHt9LFxuICBvblVwZGF0ZTogKCkgPT4ge31cbn07IiwiaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vY29tcG9uZW50cy9iYXNlL25vdGlmaWNhdGlvbnMuanN4JztcbmltcG9ydCBCb2R5IGZyb20gJy4uL2NvbXBvbmVudHMvY29tbXVuaWNhdG9yL2JvZHkuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW11bmljYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoPGRpdiBpZD1cInJvb3RcIj5cbiAgICAgIDxOb3RpZmljYXRpb25zPjwvTm90aWZpY2F0aW9ucz5cbiAgICAgIDxCb2R5PjwvQm9keT5cbiAgICA8L2Rpdj4pO1xuICB9XG59IiwiaW1wb3J0IHtsb2dnZXJ9IGZyb20gJ3JlZHV4LWxvZ2dlcic7XG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UHJvdmlkZXIsIGNvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7Y3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZX0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHtyZW5kZXJ9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJ1bkFwcChyZWR1Y2VyLCBBcHAsIGNhbGxiYWNrKXtcbiAgbGV0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKGxvZ2dlciwgdGh1bmspKTtcblxuICByZW5kZXIoPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgPEFwcC8+XG4gIDwvUHJvdmlkZXI+LCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FwcFwiKSk7XG4gIFxuICBsZXQgbmV3U3RvcmUgPSB7XG4gICAgZGlzcGF0Y2goYWN0aW9uKXtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24oc3RvcmUuZGlzcGF0Y2gsIHN0b3JlLmdldFN0YXRlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgfSxcbiAgICBzdWJzY3JpYmUoLi4uYXJncyl7XG4gICAgICByZXR1cm4gc3RvcmUuc3Vic2NyaWJlKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgZ2V0U3RhdGUoLi4uYXJncyl7XG4gICAgICByZXR1cm4gc3RvcmUuZ2V0U3RhdGUoLi4uYXJncyk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVkdWNlciguLi5hcmdzKXtcbiAgICAgIHJldHVybiBzdG9yZS5yZXBsYWNlUmVkdWNlciguLi5hcmdzKTtcbiAgICB9XG4gIH1cbiAgXG4vLyAgY29uc3Qgb0Nvbm5lY3QgPSBSZWFjdFJlZHV4LmNvbm5lY3Q7XG4vLyAgUmVhY3RSZWR1eC5jb25uZWN0ID0gZnVuY3Rpb24obWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpe1xuLy8gICAgcmV0dXJuIG9Db25uZWN0KChzdGF0ZSk9Pntcbi8vICAgICAgbGV0IHZhbHVlID0gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKTtcbi8vICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goKGtleSk9Pntcbi8vICAgICAgICBpZiAodHlwZW9mIHZhbHVlW2tleV0gPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBzdGF0ZSB2YWx1ZSBmb3Iga2V5IFwiICsga2V5ICsgXCIgeW91IG1vc3QgbGlrZWx5IGZvcmdvdCB0byBjb21iaW5lIHRoZSByZWR1Y2VycyB3aXRoaW4gdGhlIHJvb3QgcmVkdWNlciBmaWxlXCIpO1xuLy8gICAgICAgIH1cbi8vICAgICAgfSk7XG4vLyAgICB9LCBtYXBEaXNwYXRjaFRvUHJvcHMpO1xuLy8gIH1cbiAgXG4gIGNhbGxiYWNrICYmIGNhbGxiYWNrKG5ld1N0b3JlKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCk7XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9lbXB0eUZ1bmN0aW9uJyk7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZW1wdHlGdW5jdGlvbjtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgIHJldHVybjsgLy8gSWdub3JlIENvbXBvc2l0ZUNvbXBvbmVudCBwcm9wdHlwZSBjaGVjay5cbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbiAgdmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaW52YXJpYW50KHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSA9PT0gJ2Z1bmN0aW9uJywgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gJyArICdSZWFjdC5Qcm9wVHlwZXMuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lKTtcbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgJXMgdHlwZTogJXMlcycsIGxvY2F0aW9uLCBlcnJvci5tZXNzYWdlLCBzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzaGltKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgaWYgKHNlY3JldCA9PT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgIC8vIEl0IGlzIHN0aWxsIHNhZmUgd2hlbiBjYWxsZWQgZnJvbSBSZWFjdC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW52YXJpYW50KFxuICAgICAgZmFsc2UsXG4gICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAnVXNlIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICApO1xuICB9O1xuICBzaGltLmlzUmVxdWlyZWQgPSBzaGltO1xuICBmdW5jdGlvbiBnZXRTaGltKCkge1xuICAgIHJldHVybiBzaGltO1xuICB9O1xuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IHNoaW0sXG4gICAgYm9vbDogc2hpbSxcbiAgICBmdW5jOiBzaGltLFxuICAgIG51bWJlcjogc2hpbSxcbiAgICBvYmplY3Q6IHNoaW0sXG4gICAgc3RyaW5nOiBzaGltLFxuICAgIHN5bWJvbDogc2hpbSxcblxuICAgIGFueTogc2hpbSxcbiAgICBhcnJheU9mOiBnZXRTaGltLFxuICAgIGVsZW1lbnQ6IHNoaW0sXG4gICAgaW5zdGFuY2VPZjogZ2V0U2hpbSxcbiAgICBub2RlOiBzaGltLFxuICAgIG9iamVjdE9mOiBnZXRTaGltLFxuICAgIG9uZU9mOiBnZXRTaGltLFxuICAgIG9uZU9mVHlwZTogZ2V0U2hpbSxcbiAgICBzaGFwZTogZ2V0U2hpbVxuICB9O1xuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gZW1wdHlGdW5jdGlvbjtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vY2hlY2tQcm9wVHlwZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAvKiBnbG9iYWwgU3ltYm9sICovXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIG1ldGhvZCBmdW5jdGlvbiBjb250YWluZWQgb24gdGhlIGl0ZXJhYmxlIG9iamVjdC5cbiAgICpcbiAgICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gICAqXG4gICAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gICAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgKiAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobXlJdGVyYWJsZSk7XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICAgKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICAgKlxuICAgKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gICAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gICAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAgICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAgICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICAgKiAgICAgfSxcbiAgICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAgICpcbiAgICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gICAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICAgKlxuICAgKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gICAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAgICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICAgKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICogICAgICAgICAgKTtcbiAgICogICAgICAgIH1cbiAgICogICAgICB9XG4gICAqICAgIH0sXG4gICAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICAgKiAgfSk7XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICB2YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJXMgYXQgaW5kZXggJXMuJyxcbiAgICAgICAgICBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlciksXG4gICAgICAgICAgaVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9ICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmXG4gICAgU3ltYm9sLmZvciAmJlxuICAgIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSkgfHxcbiAgICAweGVhYzc7XG5cbiAgdmFyIGlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICBvYmplY3QgIT09IG51bGwgJiZcbiAgICAgIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICB9O1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5yZWR1eExvZ2dlcj1lLnJlZHV4TG9nZ2VyfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Uuc3VwZXJfPXQsZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmUsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSl9ZnVuY3Rpb24gcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwia2luZFwiLHt2YWx1ZTplLGVudW1lcmFibGU6ITB9KSx0JiZ0Lmxlbmd0aCYmT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJwYXRoXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG4oZSx0LHIpe24uc3VwZXJfLmNhbGwodGhpcyxcIkVcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInJoc1wiLHt2YWx1ZTpyLGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBvKGUsdCl7by5zdXBlcl8uY2FsbCh0aGlzLFwiTlwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGkoZSx0KXtpLnN1cGVyXy5jYWxsKHRoaXMsXCJEXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJsaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gYShlLHQscil7YS5zdXBlcl8uY2FsbCh0aGlzLFwiQVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaW5kZXhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpdGVtXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIGYoZSx0LHIpe3ZhciBuPWUuc2xpY2UoKHJ8fHQpKzF8fGUubGVuZ3RoKTtyZXR1cm4gZS5sZW5ndGg9dDwwP2UubGVuZ3RoK3Q6dCxlLnB1c2guYXBwbHkoZSxuKSxlfWZ1bmN0aW9uIHUoZSl7dmFyIHQ9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpO3JldHVyblwib2JqZWN0XCIhPT10P3Q6ZT09PU1hdGg/XCJtYXRoXCI6bnVsbD09PWU/XCJudWxsXCI6QXJyYXkuaXNBcnJheShlKT9cImFycmF5XCI6XCJbb2JqZWN0IERhdGVdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSk/XCJkYXRlXCI6XCJmdW5jdGlvblwiPT10eXBlb2YgZS50b1N0cmluZyYmL15cXC8uKlxcLy8udGVzdChlLnRvU3RyaW5nKCkpP1wicmVnZXhwXCI6XCJvYmplY3RcIn1mdW5jdGlvbiBsKGUsdCxyLGMscyxkLHApe3M9c3x8W10scD1wfHxbXTt2YXIgZz1zLnNsaWNlKDApO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkKXtpZihjKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBjJiZjKGcsZCkpcmV0dXJuO2lmKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGM/XCJ1bmRlZmluZWRcIjpOKGMpKSl7aWYoYy5wcmVmaWx0ZXImJmMucHJlZmlsdGVyKGcsZCkpcmV0dXJuO2lmKGMubm9ybWFsaXplKXt2YXIgaD1jLm5vcm1hbGl6ZShnLGQsZSx0KTtoJiYoZT1oWzBdLHQ9aFsxXSl9fX1nLnB1c2goZCl9XCJyZWdleHBcIj09PXUoZSkmJlwicmVnZXhwXCI9PT11KHQpJiYoZT1lLnRvU3RyaW5nKCksdD10LnRvU3RyaW5nKCkpO3ZhciB5PVwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6TihlKSx2PVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6Tih0KSxiPVwidW5kZWZpbmVkXCIhPT15fHxwJiZwW3AubGVuZ3RoLTFdLmxocyYmcFtwLmxlbmd0aC0xXS5saHMuaGFzT3duUHJvcGVydHkoZCksbT1cInVuZGVmaW5lZFwiIT09dnx8cCYmcFtwLmxlbmd0aC0xXS5yaHMmJnBbcC5sZW5ndGgtMV0ucmhzLmhhc093blByb3BlcnR5KGQpO2lmKCFiJiZtKXIobmV3IG8oZyx0KSk7ZWxzZSBpZighbSYmYilyKG5ldyBpKGcsZSkpO2Vsc2UgaWYodShlKSE9PXUodCkpcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJkYXRlXCI9PT11KGUpJiZlLXQhPT0wKXIobmV3IG4oZyxlLHQpKTtlbHNlIGlmKFwib2JqZWN0XCI9PT15JiZudWxsIT09ZSYmbnVsbCE9PXQpaWYocC5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHQubGhzPT09ZX0pLmxlbmd0aCllIT09dCYmcihuZXcgbihnLGUsdCkpO2Vsc2V7aWYocC5wdXNoKHtsaHM6ZSxyaHM6dH0pLEFycmF5LmlzQXJyYXkoZSkpe3ZhciB3O2UubGVuZ3RoO2Zvcih3PTA7dzxlLmxlbmd0aDt3Kyspdz49dC5sZW5ndGg/cihuZXcgYShnLHcsbmV3IGkodm9pZCAwLGVbd10pKSk6bChlW3ddLHRbd10scixjLGcsdyxwKTtmb3IoO3c8dC5sZW5ndGg7KXIobmV3IGEoZyx3LG5ldyBvKHZvaWQgMCx0W3crK10pKSl9ZWxzZXt2YXIgeD1PYmplY3Qua2V5cyhlKSxTPU9iamVjdC5rZXlzKHQpO3guZm9yRWFjaChmdW5jdGlvbihuLG8pe3ZhciBpPVMuaW5kZXhPZihuKTtpPj0wPyhsKGVbbl0sdFtuXSxyLGMsZyxuLHApLFM9ZihTLGkpKTpsKGVbbl0sdm9pZCAwLHIsYyxnLG4scCl9KSxTLmZvckVhY2goZnVuY3Rpb24oZSl7bCh2b2lkIDAsdFtlXSxyLGMsZyxlLHApfSl9cC5sZW5ndGg9cC5sZW5ndGgtMX1lbHNlIGUhPT10JiYoXCJudW1iZXJcIj09PXkmJmlzTmFOKGUpJiZpc05hTih0KXx8cihuZXcgbihnLGUsdCkpKX1mdW5jdGlvbiBjKGUsdCxyLG4pe3JldHVybiBuPW58fFtdLGwoZSx0LGZ1bmN0aW9uKGUpe2UmJm4ucHVzaChlKX0sciksbi5sZW5ndGg/bjp2b2lkIDB9ZnVuY3Rpb24gcyhlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpzKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmRlbGV0ZSBvW3IucGF0aFtuXV07YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjpvW3IucGF0aFtuXV09ci5yaHN9fWVsc2Ugc3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoZVt0XSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOmU9ZihlLHQpO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6ZVt0XT1yLnJoc31yZXR1cm4gZX1mdW5jdGlvbiBkKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe2Zvcih2YXIgbj1lLG89LTEsaT1yLnBhdGg/ci5wYXRoLmxlbmd0aC0xOjA7KytvPGk7KVwidW5kZWZpbmVkXCI9PXR5cGVvZiBuW3IucGF0aFtvXV0mJihuW3IucGF0aFtvXV09XCJudW1iZXJcIj09dHlwZW9mIHIucGF0aFtvXT9bXTp7fSksbj1uW3IucGF0aFtvXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMoci5wYXRoP25bci5wYXRoW29dXTpuLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG5bci5wYXRoW29dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm5bci5wYXRoW29dXT1yLnJoc319fWZ1bmN0aW9uIHAoZSx0LHIpe2lmKHIucGF0aCYmci5wYXRoLmxlbmd0aCl7dmFyIG4sbz1lW3RdLGk9ci5wYXRoLmxlbmd0aC0xO2ZvcihuPTA7bjxpO24rKylvPW9bci5wYXRoW25dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChvW3IucGF0aFtuXV0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpvW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiRVwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIG9bci5wYXRoW25dXX19ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZVt0XT1yLmxoczticmVhaztjYXNlXCJFXCI6ZVt0XT1yLmxoczticmVhaztjYXNlXCJOXCI6ZT1mKGUsdCl9cmV0dXJuIGV9ZnVuY3Rpb24gZyhlLHQscil7aWYoZSYmdCYmciYmci5raW5kKXt2YXIgbixvLGk9ZTtmb3Iobz1yLnBhdGgubGVuZ3RoLTEsbj0wO248bztuKyspXCJ1bmRlZmluZWRcIj09dHlwZW9mIGlbci5wYXRoW25dXSYmKGlbci5wYXRoW25dXT17fSksaT1pW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnAoaVtyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6aVtyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIkVcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiTlwiOmRlbGV0ZSBpW3IucGF0aFtuXV19fX1mdW5jdGlvbiBoKGUsdCxyKXtpZihlJiZ0KXt2YXIgbj1mdW5jdGlvbihuKXtyJiYhcihlLHQsbil8fGQoZSx0LG4pfTtsKGUsdCxuKX19ZnVuY3Rpb24geShlKXtyZXR1cm5cImNvbG9yOiBcIitGW2VdLmNvbG9yK1wiOyBmb250LXdlaWdodDogYm9sZFwifWZ1bmN0aW9uIHYoZSl7dmFyIHQ9ZS5raW5kLHI9ZS5wYXRoLG49ZS5saHMsbz1lLnJocyxpPWUuaW5kZXgsYT1lLml0ZW07c3dpdGNoKHQpe2Nhc2VcIkVcIjpyZXR1cm5bci5qb2luKFwiLlwiKSxuLFwi4oaSXCIsb107Y2FzZVwiTlwiOnJldHVybltyLmpvaW4oXCIuXCIpLG9dO2Nhc2VcIkRcIjpyZXR1cm5bci5qb2luKFwiLlwiKV07Y2FzZVwiQVwiOnJldHVybltyLmpvaW4oXCIuXCIpK1wiW1wiK2krXCJdXCIsYV07ZGVmYXVsdDpyZXR1cm5bXX19ZnVuY3Rpb24gYihlLHQscixuKXt2YXIgbz1jKGUsdCk7dHJ5e24/ci5ncm91cENvbGxhcHNlZChcImRpZmZcIik6ci5ncm91cChcImRpZmZcIil9Y2F0Y2goZSl7ci5sb2coXCJkaWZmXCIpfW8/by5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWUua2luZCxuPXYoZSk7ci5sb2cuYXBwbHkocixbXCIlYyBcIitGW3RdLnRleHQseSh0KV0uY29uY2F0KFAobikpKX0pOnIubG9nKFwi4oCU4oCUIG5vIGRpZmYg4oCU4oCUXCIpO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgZGlmZiBlbmQg4oCU4oCUIFwiKX19ZnVuY3Rpb24gbShlLHQscixuKXtzd2l0Y2goXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpKXtjYXNlXCJvYmplY3RcIjpyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlW25dP2Vbbl0uYXBwbHkoZSxQKHIpKTplW25dO2Nhc2VcImZ1bmN0aW9uXCI6cmV0dXJuIGUodCk7ZGVmYXVsdDpyZXR1cm4gZX19ZnVuY3Rpb24gdyhlKXt2YXIgdD1lLnRpbWVzdGFtcCxyPWUuZHVyYXRpb247cmV0dXJuIGZ1bmN0aW9uKGUsbixvKXt2YXIgaT1bXCJhY3Rpb25cIl07cmV0dXJuIGkucHVzaChcIiVjXCIrU3RyaW5nKGUudHlwZSkpLHQmJmkucHVzaChcIiVjQCBcIituKSxyJiZpLnB1c2goXCIlYyhpbiBcIitvLnRvRml4ZWQoMikrXCIgbXMpXCIpLGkuam9pbihcIiBcIil9fWZ1bmN0aW9uIHgoZSx0KXt2YXIgcj10LmxvZ2dlcixuPXQuYWN0aW9uVHJhbnNmb3JtZXIsbz10LnRpdGxlRm9ybWF0dGVyLGk9dm9pZCAwPT09bz93KHQpOm8sYT10LmNvbGxhcHNlZCxmPXQuY29sb3JzLHU9dC5sZXZlbCxsPXQuZGlmZixjPVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0LnRpdGxlRm9ybWF0dGVyO2UuZm9yRWFjaChmdW5jdGlvbihvLHMpe3ZhciBkPW8uc3RhcnRlZCxwPW8uc3RhcnRlZFRpbWUsZz1vLmFjdGlvbixoPW8ucHJldlN0YXRlLHk9by5lcnJvcix2PW8udG9vayx3PW8ubmV4dFN0YXRlLHg9ZVtzKzFdO3gmJih3PXgucHJldlN0YXRlLHY9eC5zdGFydGVkLWQpO3ZhciBTPW4oZyksaz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBhP2EoZnVuY3Rpb24oKXtyZXR1cm4gd30sZyxvKTphLGo9RChwKSxFPWYudGl0bGU/XCJjb2xvcjogXCIrZi50aXRsZShTKStcIjtcIjpcIlwiLEE9W1wiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiXTtBLnB1c2goRSksdC50aW1lc3RhbXAmJkEucHVzaChcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIiksdC5kdXJhdGlvbiYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKTt2YXIgTz1pKFMsaix2KTt0cnl7az9mLnRpdGxlJiZjP3IuZ3JvdXBDb2xsYXBzZWQuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXBDb2xsYXBzZWQoTyk6Zi50aXRsZSYmYz9yLmdyb3VwLmFwcGx5KHIsW1wiJWMgXCIrT10uY29uY2F0KEEpKTpyLmdyb3VwKE8pfWNhdGNoKGUpe3IubG9nKE8pfXZhciBOPW0odSxTLFtoXSxcInByZXZTdGF0ZVwiKSxQPW0odSxTLFtTXSxcImFjdGlvblwiKSxDPW0odSxTLFt5LGhdLFwiZXJyb3JcIiksRj1tKHUsUyxbd10sXCJuZXh0U3RhdGVcIik7aWYoTilpZihmLnByZXZTdGF0ZSl7dmFyIEw9XCJjb2xvcjogXCIrZi5wcmV2U3RhdGUoaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltOXShcIiVjIHByZXYgc3RhdGVcIixMLGgpfWVsc2UgcltOXShcInByZXYgc3RhdGVcIixoKTtpZihQKWlmKGYuYWN0aW9uKXt2YXIgVD1cImNvbG9yOiBcIitmLmFjdGlvbihTKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW1BdKFwiJWMgYWN0aW9uICAgIFwiLFQsUyl9ZWxzZSByW1BdKFwiYWN0aW9uICAgIFwiLFMpO2lmKHkmJkMpaWYoZi5lcnJvcil7dmFyIE09XCJjb2xvcjogXCIrZi5lcnJvcih5LGgpK1wiOyBmb250LXdlaWdodDogYm9sZDtcIjtyW0NdKFwiJWMgZXJyb3IgICAgIFwiLE0seSl9ZWxzZSByW0NdKFwiZXJyb3IgICAgIFwiLHkpO2lmKEYpaWYoZi5uZXh0U3RhdGUpe3ZhciBfPVwiY29sb3I6IFwiK2YubmV4dFN0YXRlKHcpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbRl0oXCIlYyBuZXh0IHN0YXRlXCIsXyx3KX1lbHNlIHJbRl0oXCJuZXh0IHN0YXRlXCIsdyk7bCYmYihoLHcscixrKTt0cnl7ci5ncm91cEVuZCgpfWNhdGNoKGUpe3IubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpfX0pfWZ1bmN0aW9uIFMoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sdD1PYmplY3QuYXNzaWduKHt9LEwsZSkscj10LmxvZ2dlcixuPXQuc3RhdGVUcmFuc2Zvcm1lcixvPXQuZXJyb3JUcmFuc2Zvcm1lcixpPXQucHJlZGljYXRlLGE9dC5sb2dFcnJvcnMsZj10LmRpZmZQcmVkaWNhdGU7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHIpcmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTtpZihlLmdldFN0YXRlJiZlLmRpc3BhdGNoKXJldHVybiBjb25zb2xlLmVycm9yKFwiW3JlZHV4LWxvZ2dlcl0gcmVkdXgtbG9nZ2VyIG5vdCBpbnN0YWxsZWQuIE1ha2Ugc3VyZSB0byBwYXNzIGxvZ2dlciBpbnN0YW5jZSBhcyBtaWRkbGV3YXJlOlxcbi8vIExvZ2dlciB3aXRoIGRlZmF1bHQgb3B0aW9uc1xcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxcbiAgcmVkdWNlcixcXG4gIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpXFxuKVxcbi8vIE9yIHlvdSBjYW4gY3JlYXRlIHlvdXIgb3duIGxvZ2dlciB3aXRoIGN1c3RvbSBvcHRpb25zIGh0dHA6Ly9iaXQubHkvcmVkdXgtbG9nZ2VyLW9wdGlvbnNcXG5pbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5jb25zdCBsb2dnZXIgPSBjcmVhdGVMb2dnZXIoe1xcbiAgLy8gLi4ub3B0aW9uc1xcbn0pO1xcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoXFxuICByZWR1Y2VyLFxcbiAgYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcilcXG4pXFxuXCIpLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gZSh0KX19fTt2YXIgdT1bXTtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIHI9ZS5nZXRTdGF0ZTtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKGwpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGkmJiFpKHIsbCkpcmV0dXJuIGUobCk7dmFyIGM9e307dS5wdXNoKGMpLGMuc3RhcnRlZD1PLm5vdygpLGMuc3RhcnRlZFRpbWU9bmV3IERhdGUsYy5wcmV2U3RhdGU9bihyKCkpLGMuYWN0aW9uPWw7dmFyIHM9dm9pZCAwO2lmKGEpdHJ5e3M9ZShsKX1jYXRjaChlKXtjLmVycm9yPW8oZSl9ZWxzZSBzPWUobCk7Yy50b29rPU8ubm93KCktYy5zdGFydGVkLGMubmV4dFN0YXRlPW4ocigpKTt2YXIgZD10LmRpZmYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGY/ZihyLGwpOnQuZGlmZjtpZih4KHUsT2JqZWN0LmFzc2lnbih7fSx0LHtkaWZmOmR9KSksdS5sZW5ndGg9MCxjLmVycm9yKXRocm93IGMuZXJyb3I7cmV0dXJuIHN9fX19dmFyIGssaixFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIG5ldyBBcnJheSh0KzEpLmpvaW4oZSl9LEE9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gRShcIjBcIix0LWUudG9TdHJpbmcoKS5sZW5ndGgpK2V9LEQ9ZnVuY3Rpb24oZSl7cmV0dXJuIEEoZS5nZXRIb3VycygpLDIpK1wiOlwiK0EoZS5nZXRNaW51dGVzKCksMikrXCI6XCIrQShlLmdldFNlY29uZHMoKSwyKStcIi5cIitBKGUuZ2V0TWlsbGlzZWNvbmRzKCksMyl9LE89XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHBlcmZvcm1hbmNlJiZudWxsIT09cGVyZm9ybWFuY2UmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHBlcmZvcm1hbmNlLm5vdz9wZXJmb3JtYW5jZTpEYXRlLE49XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX0sUD1mdW5jdGlvbihlKXtpZihBcnJheS5pc0FycmF5KGUpKXtmb3IodmFyIHQ9MCxyPUFycmF5KGUubGVuZ3RoKTt0PGUubGVuZ3RoO3QrKylyW3RdPWVbdF07cmV0dXJuIHJ9cmV0dXJuIEFycmF5LmZyb20oZSl9LEM9W107az1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBnbG9iYWw/XCJ1bmRlZmluZWRcIjpOKGdsb2JhbCkpJiZnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9LGo9ay5EZWVwRGlmZixqJiZDLnB1c2goZnVuY3Rpb24oKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgaiYmay5EZWVwRGlmZj09PWMmJihrLkRlZXBEaWZmPWosaj12b2lkIDApfSksdChuLHIpLHQobyxyKSx0KGksciksdChhLHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGMse2RpZmY6e3ZhbHVlOmMsZW51bWVyYWJsZTohMH0sb2JzZXJ2YWJsZURpZmY6e3ZhbHVlOmwsZW51bWVyYWJsZTohMH0sYXBwbHlEaWZmOnt2YWx1ZTpoLGVudW1lcmFibGU6ITB9LGFwcGx5Q2hhbmdlOnt2YWx1ZTpkLGVudW1lcmFibGU6ITB9LHJldmVydENoYW5nZTp7dmFsdWU6ZyxlbnVtZXJhYmxlOiEwfSxpc0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBqfSxlbnVtZXJhYmxlOiEwfSxub0NvbmZsaWN0Ont2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBDJiYoQy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UoKX0pLEM9bnVsbCksY30sZW51bWVyYWJsZTohMH19KTt2YXIgRj17RTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkNIQU5HRUQ6XCJ9LE46e2NvbG9yOlwiIzRDQUY1MFwiLHRleHQ6XCJBRERFRDpcIn0sRDp7Y29sb3I6XCIjRjQ0MzM2XCIsdGV4dDpcIkRFTEVURUQ6XCJ9LEE6e2NvbG9yOlwiIzIxOTZGM1wiLHRleHQ6XCJBUlJBWTpcIn19LEw9e2xldmVsOlwibG9nXCIsbG9nZ2VyOmNvbnNvbGUsbG9nRXJyb3JzOiEwLGNvbGxhcHNlZDp2b2lkIDAscHJlZGljYXRlOnZvaWQgMCxkdXJhdGlvbjohMSx0aW1lc3RhbXA6ITAsc3RhdGVUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sYWN0aW9uVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGVycm9yVHJhbnNmb3JtZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGNvbG9yczp7dGl0bGU6ZnVuY3Rpb24oKXtyZXR1cm5cImluaGVyaXRcIn0scHJldlN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuXCIjOUU5RTlFXCJ9LGFjdGlvbjpmdW5jdGlvbigpe3JldHVyblwiIzAzQTlGNFwifSxuZXh0U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM0Q0FGNTBcIn0sZXJyb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIiNGMjA0MDRcIn19LGRpZmY6ITEsZGlmZlByZWRpY2F0ZTp2b2lkIDAsdHJhbnNmb3JtZXI6dm9pZCAwfSxUPWZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9ZS5kaXNwYXRjaCxyPWUuZ2V0U3RhdGU7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2Ygcj9TKCkoe2Rpc3BhdGNoOnQsZ2V0U3RhdGU6cn0pOnZvaWQgY29uc29sZS5lcnJvcihcIlxcbltyZWR1eC1sb2dnZXIgdjNdIEJSRUFLSU5HIENIQU5HRVxcbltyZWR1eC1sb2dnZXIgdjNdIFNpbmNlIDMuMC4wIHJlZHV4LWxvZ2dlciBleHBvcnRzIGJ5IGRlZmF1bHQgbG9nZ2VyIHdpdGggZGVmYXVsdCBzZXR0aW5ncy5cXG5bcmVkdXgtbG9nZ2VyIHYzXSBDaGFuZ2VcXG5bcmVkdXgtbG9nZ2VyIHYzXSBpbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5bcmVkdXgtbG9nZ2VyIHYzXSB0b1xcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ3JlZHV4LWxvZ2dlcidcXG5cIil9O2UuZGVmYXVsdHM9TCxlLmNyZWF0ZUxvZ2dlcj1TLGUubG9nZ2VyPVQsZS5kZWZhdWx0PVQsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGkxOG4oc3RhdGU9e1xuICB0ZXh0OiB7XG4gICAgZ2V0KGtleSwgLi4uYXJncyl7XG4gICAgICBsZXQgdGV4dCA9IGdldExvY2FsZVRleHQoa2V5LCBhcmdzKTtcbiAgICAgIGlmICh0ZXh0KXtcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfSxcbiAgdGltZToge1xuICAgIGZvcm1hdChkYXRlPW5ldyBEYXRlKCksIGZvcm1hdD1cIkxcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9LFxuICAgIGZyb21Ob3coZGF0ZT1uZXcgRGF0ZSgpKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZyb21Ob3coKTtcbiAgICB9LFxuICAgIHN1YnRyYWN0KGRhdGU9bmV3IERhdGUoKSwgaW5wdXQ9MSwgdmFsdWU9XCJkYXlzXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuc3VidHJhY3QoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH0sXG4gICAgYWRkKGRhdGU9bmV3IERhdGUoKSwgaW5wdXQ9MSwgdmFsdWU9XCJkYXlzXCIpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuYWRkKGlucHV0LCB2YWx1ZSkuY2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cbn0sIGFjdGlvbil7XG4gIHJldHVybiBzdGF0ZTtcbn0iLCIvL1RPRE8gdGhpcyByZWR1Y2VyIHVzZXMgdGhlIGFwaSB0aGF0IGludGVyYWN0cyB3aXRoIHRoZSBET00gaW4gb3JkZXIgdG9cbi8vcmV0cmlldmUgZGF0YSwgcGxlYXNlIGZpeCBpbiBuZXh0IHZlcnNpb25zXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZXMoc3RhdGU9e1xuICBhdmFsaWFibGU6ICQubWFrZUFycmF5KCQoXCIjbGFuZ3VhZ2UtcGlja2VyIGFcIikubWFwKChpbmRleCwgZWxlbWVudCk9PntcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJChlbGVtZW50KS50ZXh0KCkudHJpbSgpLFxuICAgICAgbG9jYWxlOiAkKGVsZW1lbnQpLmRhdGEoJ2xvY2FsZScpXG4gICAgfVxuICB9KSksXG4gIGN1cnJlbnQ6ICQoXCIjbG9jYWxlXCIpLnRleHQoKVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0xPQ0FMRScpe1xuICAgICQoJyNsYW5ndWFnZS1waWNrZXIgYVtkYXRhLWxvY2FsZT1cIicgKyBhY3Rpb24ucGF5bG9hZCArICdcIl0nKS5jbGljaygpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge2N1cnJlbnQ6IGFjdGlvbi5wYXlsb2FkfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnMoc3RhdGU9W10sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0FERF9OT1RJRklDQVRJT04nKSB7XG4gICAgdmFyIGlkID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gc3RhdGUuY29uY2F0KE9iamVjdC5hc3NpZ24oe2lkOiBpZH0sIGFjdGlvbi5wYXlsb2FkKSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09ICdISURFX05PVElGSUNBVElPTicpIHtcbiAgICByZXR1cm4gc3RhdGUuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgcmV0dXJuIGVsZW1lbnQuaWQgIT09IGFjdGlvbi5wYXlsb2FkLmlkO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCIvL1RoaXMgb25lIGFsc28gdXNlcyBhIGhhY2sgdG8gYWNjZXNzIHRoZSBkYXRhIGluIHRoZSBkb21cbi8vcGxlYXNlIHJlcGxhY2UgaXQgd2l0aCB0aGUgZm9sbG93aW5nIHByb2NlZHVyZVxuLy8xLiBDcmVhdGUgYSByZXN0IGVuZHBvaW50IHRvIGdldCB0aGUgcGVybWlzc2lvbnMgbGlzdFxuLy8yLiBpbiB0aGUgbWFpbiBmaWxlIGdhdGhlciB0aG9zZSBwZXJtaXNzaW9ucy4uLiBldGMuLi4sIGVnLiBpbmRleC5qcyBtYWtlIGEgY2FsbFxuLy8zLiBkaXNwYXRjaCB0aGUgYWN0aW9uIHRvIHRoaXMgc2FtZSByZWR1Y2VyIGFuZCBnYXRoZXIgdGhlIGFjdGlvbiBoZXJlXG4vLzQuIGl0IHdvcmtzIDpEXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXR1cyhzdGF0ZT17XG4gIGxvZ2dlZEluOiAhIU1VSUtLVV9MT0dHRURfVVNFUl9JRCxcbiAgdXNlcklkOiBNVUlLS1VfTE9HR0VEX1VTRVJfSUQsXG4gIHBlcm1pc3Npb25zOiBNVUlLS1VfUEVSTUlTU0lPTlMsXG4gIGNvbnRleHRQYXRoOiBDT05URVhUUEFUSFxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBcIkxPR09VVFwiKXtcbiAgICAkKCcjbG9nb3V0JykuY2xpY2soKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBub3RpZmljYXRpb25zIGZyb20gJy4vYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vYmFzZS9sb2NhbGVzJztcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi9iYXNlL3N0YXR1cyc7XG5pbXBvcnQgaTE4biBmcm9tICcuL2Jhc2UvaTE4bic7XG5pbXBvcnQgbWVzc2FnZUNvdW50IGZyb20gJy4vbWFpbi1mdW5jdGlvbi9tZXNzYWdlLWNvdW50JztcbmltcG9ydCBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uIGZyb20gJy4vbWFpbi1mdW5jdGlvbi9jb21tdW5pY2F0b3IvY29tbXVuaWNhdG9yLW5hdmlnYXRpb24nO1xuaW1wb3J0IGNvbW11bmljYXRvck1lc3NhZ2VzIGZyb20gJy4vbWFpbi1mdW5jdGlvbi9jb21tdW5pY2F0b3IvY29tbXVuaWNhdG9yLW1lc3NhZ2VzJztcbmltcG9ydCBoYXNoIGZyb20gJy4vbWFpbi1mdW5jdGlvbi9oYXNoJztcblxuaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4JztcblxuZXhwb3J0IGRlZmF1bHQgY29tYmluZVJlZHVjZXJzKHtcbiAgbm90aWZpY2F0aW9ucyxcbiAgaTE4bixcbiAgbG9jYWxlcyxcbiAgc3RhdHVzLFxuICBtZXNzYWdlQ291bnQsXG4gIGNvbW11bmljYXRvck5hdmlnYXRpb24sXG4gIGNvbW11bmljYXRvck1lc3NhZ2VzLFxuICBoYXNoXG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21tdW5pY2F0b3JNZXNzYWdlcyhzdGF0ZT17XG4gIHN0YXRlOiBcIldBSVRcIixcbiAgbWVzc2FnZXM6IFtdLFxuICBzZWxlY3RlZDogW10sXG4gIHNlbGVjdGVkSWRzOiBbXVxufSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBcIlVQREFURV9NRVNTQUdFU19TVEFURVwiKXtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtzdGF0ZTogYWN0aW9uLnBheWxvYWR9KTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gXCJVUERBVEVfTUVTU0FHRVNcIil7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7bWVzc2FnZXM6IGFjdGlvbi5wYXlsb2FkfSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IFwiVVBEQVRFX1NFTEVDVEVEX01FU1NBR0VTXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3NlbGVjdGVkOiBhY3Rpb24ucGF5bG9hZCwgc2VsZWN0ZWRJZHM6IGFjdGlvbi5wYXlsb2FkLm1hcChzPT5zLmlkKX0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIkFERF9UT19DT01NVU5JQ0FUT1JfU0VMRUNURURfTUVTU0FHRVNcIil7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7c2VsZWN0ZWQ6IHN0YXRlLnNlbGVjdGVkLmNvbmNhdChbYWN0aW9uLnBheWxvYWRdKSwgc2VsZWN0ZWRJZHM6IHN0YXRlLnNlbGVjdGVkSWRzLmNvbmNhdChbYWN0aW9uLnBheWxvYWQuaWRdKX0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIlJFTU9WRV9GUk9NX0NPTU1VTklDQVRPUl9TRUxFQ1RFRF9NRVNTQUdFU1wiKXtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtzZWxlY3RlZDogc3RhdGUuc2VsZWN0ZWQuZmlsdGVyKChzZWxlY3RlZCk9PntcbiAgICAgIHJldHVybiBzZWxlY3RlZC5pZCAhPT0gYWN0aW9uLnBheWxvYWQuaWRcbiAgICB9KSwgc2VsZWN0ZWRJZHM6IHN0YXRlLnNlbGVjdGVkSWRzLmZpbHRlcigoaWQpPT57cmV0dXJuIGlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZH0pfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImNvbnN0IGRlZmF1bHROYXZpZ2F0aW9uID0gW1xuICB7XG4gICAgbG9jYXRpb246IFwiaW5ib3hcIixcbiAgICB0eXBlOiBcImZvbGRlclwiLFxuICAgIGlkOiBcImluYm94XCIsXG4gICAgaWNvbjogXCJuZXctc2VjdGlvblwiLFxuICAgIHRleHQoaTE4bil7cmV0dXJuIGkxOG4udGV4dC5nZXQoXCJwbHVnaW4uY29tbXVuaWNhdG9yLmNhdGVnb3J5LnRpdGxlLmluYm94XCIpfVxuICB9LFxuICB7XG4gICAgbG9jYXRpb246IFwidW5yZWFkXCIsXG4gICAgdHlwZTogXCJmb2xkZXJcIixcbiAgICBpZDogXCJ1bnJlYWRcIixcbiAgICBpY29uOiBcIm5ldy1zZWN0aW9uXCIsXG4gICAgdGV4dChpMThuKXtyZXR1cm4gaTE4bi50ZXh0LmdldChcInBsdWdpbi5jb21tdW5pY2F0b3IuY2F0ZWdvcnkudGl0bGUudW5yZWFkXCIpfVxuICB9LFxuICB7XG4gICAgbG9jYXRpb246IFwic2VudFwiLFxuICAgIHR5cGU6IFwiZm9sZGVyXCIsXG4gICAgaWQ6IFwic2VudFwiLFxuICAgIGljb246IFwibmV3LXNlY3Rpb25cIixcbiAgICB0ZXh0KGkxOG4pe3JldHVybiBpMThuLnRleHQuZ2V0KFwicGx1Z2luLmNvbW11bmljYXRvci5jYXRlZ29yeS50aXRsZS5zZW50XCIpfVxuICB9LFxuICB7XG4gICAgbG9jYXRpb246IFwidHJhc2hcIixcbiAgICB0eXBlOiBcImZvbGRlclwiLFxuICAgIGlkOiBcInRyYXNoXCIsXG4gICAgaWNvbjogXCJuZXctc2VjdGlvblwiLFxuICAgIHRleHQoaTE4bil7cmV0dXJuIGkxOG4udGV4dC5nZXQoXCJwbHVnaW4uY29tbXVuaWNhdG9yLmNhdGVnb3J5LnRpdGxlLnRyYXNoXCIpfVxuICB9XG5dXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbW11bmljYXRvck5hdmlnYXRpb24oc3RhdGU9ZGVmYXVsdE5hdmlnYXRpb24sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1VQREFURV9DT01NVU5JQ0FUT1JfTkFWSUdBVElPTl9MQUJFTFMnKXtcbiAgICByZXR1cm4gZGVmYXVsdE5hdmlnYXRpb24uY29uY2F0KGFjdGlvbi5wYXlsb2FkKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gJ0FERF9DT01NVU5JQ0FUT1JfTkFWSUdBVElPTl9MQUJFTCcpe1xuICAgIHJldHVybiBzdGF0ZS5jb25jYXQoYWN0aW9uLnBheWxvYWQpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnREVMRVRFX0NPTU1VTklDQVRPUl9OQVZJR0FUSU9OX0xBQkVMJyl7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcigoaXRlbSk9PntyZXR1cm4gaXRlbS5sb2NhdGlvbiAhPT0gYWN0aW9uLnBheWxvYWQubG9jYXRpb259KTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gJ1VQREFURV9DT01NVU5JQ0FUT1JfTkFWSUdBVElPTl9MQUJFTCcpe1xuICAgIHJldHVybiBzdGF0ZS5tYXAoKGl0ZW0pPT57XG4gICAgICBpZiAoaXRlbS5sb2NhdGlvbiAhPT0gYWN0aW9uLnBheWxvYWQubG9jYXRpb24pe1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFzaChzdGF0ZT1cIlwiLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdVUERBVEVfSEFTSCcpe1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVzc2FnZUNvdW50KHN0YXRlPTAsIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gXCJVUERBVEVfTUVTU0FHRV9DT1VOVFwiKXtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG59XG5cbmZ1bmN0aW9uIGludGVyc2VjdFR3byhhLCBiKXtcbiAgcmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gYi5pbmRleE9mKG4pID4gLTE7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaWZmZXJlbmNlVHdvKGEsIGIpe1xuICBsZXQgaW5BQnV0Tm90SW5CID0gYS5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgIHJldHVybiBiLmluZGV4T2YobikgPT09IC0xO1xuICB9KTtcbiAgbGV0IGluQkJ1dE5vdEluQSA9IGIuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gYS5pbmRleE9mKG4pID09PSAtMTtcbiAgfSk7XG4gIHJldHVybiBpbkFCdXROb3RJbkIuY29uY2F0KGluQkJ1dE5vdEluQSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNYXRjaChzdHJpbmcsIGZpbHRlcil7XG4gIHJldHVybiBzdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoZmlsdGVyKSwgXCJpXCIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhpZ2hsaWdodChzdHJpbmcsIGZpbHRlcil7XG4gIHJldHVybiBzdHJpbmcuc3BsaXQobmV3IFJlZ0V4cChcIihcIiArIGVzY2FwZVJlZ0V4cChmaWx0ZXIpICsgXCIpXCIsIFwiaVwiKSkubWFwKChlbGVtZW50LCBpbmRleCk9PntcbiAgICBpZiAoaW5kZXggJSAyID09PSAwKXtcbiAgICAgIHJldHVybiA8c3BhbiBrZXk9e2luZGV4fT57ZWxlbWVudH08L3NwYW4+XG4gICAgfVxuICAgIHJldHVybiA8YiBrZXk9e2luZGV4fT57ZWxlbWVudH08L2I+XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JJbnRUb0hleChjb2xvcikge1xuICBsZXQgYiA9IChjb2xvciAmIDI1NSkudG9TdHJpbmcoMTYpO1xuICBsZXQgZyA9ICgoY29sb3IgPj4gOCkgJiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgbGV0IHIgPSAoKGNvbG9yID4+IDE2KSAmIDI1NSkudG9TdHJpbmcoMTYpO1xuXG4gIGxldCByU3RyID0gci5sZW5ndGggPT0gMSA/IFwiMFwiICsgciA6IHI7XG4gIGxldCBnU3RyID0gZy5sZW5ndGggPT0gMSA/IFwiMFwiICsgZyA6IGc7XG4gIGxldCBiU3RyID0gYi5sZW5ndGggPT0gMSA/IFwiMFwiICsgYiA6IGI7XG5cdCAgICBcbiAgcmV0dXJuIFwiI1wiICsgclN0ciArIGdTdHIgKyBiU3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0KC4uLmVsZW1lbnRzKXtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgcmV0dXJuIGVsZW1lbnRzWzBdO1xuICB9XG4gIFxuICByZXR1cm4gZWxlbWVudHMucmVkdWNlKGludGVyc2VjdFR3byk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbmNlKC4uLmVsZW1lbnRzKXtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIFxuICByZXR1cm4gZWxlbWVudHMucmVkdWNlKGRpZmZlcmVuY2VUd28pO1xufSIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uL2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVpa2t1V2Vic29ja2V0IHtcbiAgY29uc3RydWN0b3Ioc3RvcmUsIGxpc3RlbmVycz1bXSwgb3B0aW9ucz17XG4gICAgcmVjb25uZWN0SW50ZXJ2YWw6IDIwMCxcbiAgICBwaW5nVGltZVN0ZXA6IDEwMDAsXG4gICAgcGluZ1RpbWVvdXQ6IDEwMDAwXG4gIH0pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMubGlzdGVuZXJzID0gbGlzdGVuZXJzO1xuICAgIFxuICAgIHRoaXMudGlja2V0ID0gbnVsbDtcbiAgICB0aGlzLndlYlNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5zb2NrZXRPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLnBpbmdIYW5kbGUgPSBudWxsO1xuICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMucGluZ1RpbWUgPSAwO1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIFxuICAgIHRoaXMuZ2V0VGlja2V0KCh0aWNrZXQpPT4ge1xuICAgICAgaWYgKHRoaXMudGlja2V0KSB7XG4gICAgICAgIHRoaXMub3BlbldlYlNvY2tldCgpO1xuICAgICAgICB0aGlzLnN0YXJ0UGluZ2luZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3Qgb3BlbiBXZWJTb2NrZXQgYmVjYXVzZSB0aWNrZXQgd2FzIG1pc3NpbmdcIiwgJ2Vycm9yJykpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9uKFwiYmVmb3JldW5sb2FkXCIsIHRoaXMub25CZWZvcmVXaW5kb3dVbmxvYWQuYmluZCh0aGlzKSk7XG4gIH1cbiAgc2VuZE1lc3NhZ2UoZXZlbnRUeXBlLCBkYXRhKXtcbiAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgIGV2ZW50VHlwZSxcbiAgICAgIGRhdGFcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuc29ja2V0T3Blbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy53ZWJTb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXNQZW5kaW5nLnB1c2goe1xuICAgICAgICAgIGV2ZW50VHlwZTogZXZlbnRUeXBlLFxuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWVzc2FnZXNQZW5kaW5nLnB1c2gobWVzc2FnZSk7XG4gICAgfVxuICB9XG4gIFxuICB0cmlnZ2VyKGV2ZW50LCBkYXRhPW51bGwpe1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgJ3R5cGUnOiAnV0VCU09DS0VUX0VWRU5UJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICBldmVudCxcbiAgICAgICAgZGF0YVxuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGlmICh0aGlzLmxpc3RlbmVyc1tldmVudF0pe1xuICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XSBpbnN0YW5jZW9mIEFycmF5ID8gdGhpcy5saXN0ZW5lcnNbZXZlbnRdIDogdGhpcy5saXN0ZW5lcnNbZXZlbnRdLmFjdGlvbnM7XG4gICAgICBpZiAobGlzdGVuZXJzKXtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoYWN0aW9uIG9mIGxpc3RlbmVycyl7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbigpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgb3RoZXJMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudF0uY2FsbGJhY2tzO1xuICAgICAgaWYgKG90aGVyTGlzdGVuZXJzKXtcbiAgICAgICAgZm9yIChjYWxsYmFjayBvZiBvdGhlckxpc3RlbmVycyl7XG4gICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIGdldFRpY2tldChjYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhIHRpY2tldCwgc28gd2UgbmVlZCB0byB2YWxpZGF0ZSBpdCBiZWZvcmUgdXNpbmcgaXRcbiAgICAgICAgbUFwaSgpLndlYnNvY2tldC5jYWNoZUNsZWFyKCkudGlja2V0LmNoZWNrLnJlYWQodGhpcy50aWNrZXQpLmNhbGxiYWNrKCQucHJveHkoZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAvLyBUaWNrZXQgZGlkIG5vdCBwYXNzIHZhbGlkYXRpb24sIHNvIHdlIG5lZWQgdG8gY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaWNrZXQoJC5wcm94eShmdW5jdGlvbiAodGlja2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMudGlja2V0ID0gdGlja2V0O1xuICAgICAgICAgICAgICBjYWxsYmFjayh0aWNrZXQpO1xuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaWNrZXQgcGFzc2VkIHZhbGlkYXRpb24sIHNvIHdlIHVzZSBpdFxuICAgICAgICAgICAgY2FsbGJhY2sodGhpcy50aWNrZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0aWNrZXRcbiAgICAgICAgdGhpcy5jcmVhdGVUaWNrZXQoKHRpY2tldCk9PntcbiAgICAgICAgICB0aGlzLnRpY2tldCA9IHRpY2tldDtcbiAgICAgICAgICBjYWxsYmFjayh0aWNrZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIlRpY2tldCBjcmVhdGlvbiBmYWlsZWQgb24gYW4gaW50ZXJuYWwgZXJyb3JcIiwgJ2Vycm9yJykpO1xuICAgIH1cbiAgfVxuICBcbiAgY3JlYXRlVGlja2V0KGNhbGxiYWNrKSB7XG4gICAgbUFwaSgpLndlYnNvY2tldC50aWNrZXQuY3JlYXRlKClcbiAgICAgIC5jYWxsYmFjaygoZXJyLCB0aWNrZXQpPT57XG4gICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgY2FsbGJhY2sodGlja2V0LnRpY2tldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3QgY3JlYXRlIFdlYlNvY2tldCB0aWNrZXRcIiwgJ2Vycm9yJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRDb25uZWN0ZWQoKSB7XG4gICAgdGhpcy5zb2NrZXRPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLnRyaWdnZXIoXCJ3ZWJTb2NrZXRDb25uZWN0ZWRcIik7IFxuICAgIFxuICAgIHdoaWxlICh0aGlzLnNvY2tldE9wZW4gJiYgdGhpcy5tZXNzYWdlc1BlbmRpbmcubGVuZ3RoKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWVzc2FnZXNQZW5kaW5nLnNoaWZ0KCk7XG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKG1lc3NhZ2UuZXZlbnRUeXBlLCBtZXNzYWdlLmRhdGEpO1xuICAgIH1cbiAgfVxuICBcbiAgb25XZWJTb2NrZXRFcnJvcigpIHtcbiAgICB0aGlzLnJlY29ubmVjdCgpO1xuICB9XG4gIFxuICBvbldlYlNvY2tldENsb3NlKCkge1xuICAgIHRoaXMudHJpZ2dlcihcIndlYlNvY2tldERpc2Nvbm5lY3RlZFwiKTsgXG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgfVxuICBcbiAgb3BlbldlYlNvY2tldCgpIHtcbiAgICBsZXQgaG9zdCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuICAgIGxldCBzZWN1cmUgPSBsb2NhdGlvbi5wcm90b2NvbCA9PSAnaHR0cHM6JztcbiAgICB0aGlzLndlYlNvY2tldCA9IHRoaXMuY3JlYXRlV2ViU29ja2V0KChzZWN1cmUgPyAnd3NzOi8vJyA6ICd3czovLycpICsgaG9zdCArICcvd3Mvc29ja2V0LycgKyB0aGlzLnRpY2tldCk7XG4gICAgXG4gICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLm9uV2ViU29ja2V0TWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9IHRoaXMub25XZWJTb2NrZXRFcnJvci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9IHRoaXMub25XZWJTb2NrZXRDbG9zZS5iaW5kKHRoaXMpO1xuICAgICAgc3dpdGNoICh0aGlzLndlYlNvY2tldC5yZWFkeVN0YXRlKSB7XG4gICAgICAgIGNhc2UgdGhpcy53ZWJTb2NrZXQuQ09OTkVDVElORzpcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbm9wZW4gPSB0aGlzLm9uV2ViU29ja2V0Q29ubmVjdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRoaXMud2ViU29ja2V0Lk9QRU46XG4gICAgICAgICAgdGhpcy5vbldlYlNvY2tldENvbm5lY3RlZCgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIldlYlNvY2tldCBjb25uZWN0aW9uIGZhaWxlZFwiLCAnZXJyb3InKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBjb25uZWN0aW9uXCIsICdlcnJvcicpKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNyZWF0ZVdlYlNvY2tldCh1cmwpIHtcbiAgICBpZiAoKHR5cGVvZiB3aW5kb3cuV2ViU29ja2V0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdy5Nb3pXZWJTb2NrZXQpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBNb3pXZWJTb2NrZXQodXJsKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIHN0YXJ0UGluZ2luZygpIHtcbiAgICB0aGlzLnBpbmdIYW5kbGUgPSBzZXRJbnRlcnZhbCgoKT0+e1xuICAgICAgaWYgKHRoaXMuc29ja2V0T3BlbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLnBpbmdpbmcpIHtcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShcInBpbmc6cGluZ1wiLCB7fSk7XG4gICAgICAgIHRoaXMucGluZ2luZyA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBpbmdUaW1lICs9IHRoaXMub3B0aW9ucy5waW5nVGltZVN0ZXA7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5waW5nVGltZSA+IHRoaXMub3B0aW9ucy5waW5nVGltZW91dCkge1xuICAgICAgICAgIGlmIChjb25zb2xlKSBjb25zb2xlLmxvZyhcInBpbmcgZmFpbGVkLCByZWNvbm5lY3RpbmcuLi5cIik7XG4gICAgICAgICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgICAgICAgXG4gICAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMub3B0aW9ucy5waW5nVGltZVN0ZXApO1xuICB9XG4gIFxuICByZWNvbm5lY3QoKSB7XG4gICAgdmFyIHdhc09wZW4gPSB0aGlzLnNvY2tldE9wZW47IFxuICAgIHRoaXMuc29ja2V0T3BlbiA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlY29ubmVjdFRpbWVvdXQpO1xuICAgIFxuICAgIHRoaXMucmVjb25uZWN0VGltZW91dCA9IHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgaWYgKHdhc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJlbGF0ZWQgdG8gZGlzY2FyZGluZyBhIFdlYlNvY2tldCBcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5nZXRUaWNrZXQoKHRpY2tldCk9PntcbiAgICAgICAgaWYgKHRoaXMudGlja2V0KSB7XG4gICAgICAgICAgdGhpcy5vcGVuV2ViU29ja2V0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3Qgb3BlbiBXZWJTb2NrZXQgYmVjYXVzZSB0aWNrZXQgd2FzIG1pc3NpbmdcIiwgJ2Vycm9yJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgIH0sIHRoaXMub3B0aW9ucy5yZWNvbm5lY3RJbnRlcnZhbCk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0TWVzc2FnZShldmVudCkge1xuICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICB2YXIgZXZlbnRUeXBlID0gbWVzc2FnZS5ldmVudFR5cGU7XG4gICAgXG4gICAgaWYgKGV2ZW50VHlwZSA9PSBcInBpbmc6cG9uZ1wiKSB7XG4gICAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucGluZ1RpbWUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXIoZXZlbnRUeXBlLCBtZXNzYWdlLmRhdGEpO1xuICAgIH1cbiAgfVxuICBcbiAgb25CZWZvcmVXaW5kb3dVbmxvYWQoKSB7XG4gICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSAoKT0+e307XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gKCk9Pnt9O1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9ICgpPT57fTtcbiAgICAgIGlmICh0aGlzLnNvY2tldE9wZW4pIHtcbiAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iXX0=
