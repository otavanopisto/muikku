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

var _messageCount = require('../message-count');

var _messageCount2 = _interopRequireDefault(_messageCount);

var _modifiers = require('../../../util/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_LOADED_AT_ONCE = 30;

function getApiId(item) {
  if (item.type === "folder") {
    switch (item.id) {
      case "inbox":
        return "items";
      case "unread":
        return "items";
      case "sent":
        return "sentitems";
      case "trash":
        return "trash";
    }
    if (console && console.warn) {
      console.warn("Invalid navigation item location", item);
    }
  } else {
    return "items";
  }
}

function processMessages(dispatch, communicatorMessages, location, pages, concat, err, messages) {
  if (err) {
    dispatch(_notifications2.default.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  } else {
    var hasMore = messages.length === MAX_LOADED_AT_ONCE + 1;
    if (hasMore) {
      messages.pop();
    }

    var payload = {
      state: "READY",
      messages: concat ? communicatorMessages.messages.concat(messages) : messages,
      pages: pages,
      hasMore: hasMore,
      location: location
    };
    if (!concat) {
      payload.selected = [];
      payload.selectedIds = [];
    }

    dispatch({
      type: "UPDATE_MESSAGES_ALL_PROPERTIES",
      payload: payload
    });
  }
}

function loadMessages(location, initial, dispatch, getState) {
  if (initial) {
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "LOADING"
    });
  } else {
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "LOADING_MORE"
    });
  }

  var _getState = getState(),
      communicatorNavigation = _getState.communicatorNavigation,
      communicatorMessages = _getState.communicatorMessages;

  var actualLocation = location || communicatorMessages.location;
  var item = communicatorNavigation.find(function (item) {
    return item.location === actualLocation;
  });
  if (!item) {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  }

  var firstResult = initial ? 0 : communicatorMessages.pages * MAX_LOADED_AT_ONCE;
  var pages = initial ? 1 : communicatorMessages.pages + 1;
  var args = [this, dispatch, communicatorMessages, actualLocation, pages, concat];
  var concat = !initial;
  if (item.type === 'folder') {
    var params = {
      firstResult: firstResult,
      maxResults: MAX_LOADED_AT_ONCE + 1
    };
    switch (item.id) {
      case "inbox":
        params.onlyUnread = false;
        break;
      case "unread":
        params.onlyUnread = true;
        break;
    }

    mApi().communicator[getApiId(item)].read(params).callback(processMessages.bind.apply(processMessages, args));
  } else if (item.type === 'label') {
    var _params = {
      labelId: item.id,
      firstResult: firstResult,
      maxResults: MAX_LOADED_AT_ONCE + 1
    };
    mApi().communicator[getApiId(item)].read(_params).callback(processMessages.bind.apply(processMessages, args));
  } else {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  }
}

function setLabelStatusSelectedMessages(label, isToAddLabel, dispatch, getState) {
  var _getState2 = getState(),
      communicatorNavigation = _getState2.communicatorNavigation,
      communicatorMessages = _getState2.communicatorMessages,
      i18n = _getState2.i18n;

  var item = communicatorNavigation.find(function (item) {
    return item.location === communicatorMessages.location;
  });
  if (!item) {
    //TODO translate this
    dispatch(_notifications2.default.displayNotification("Invalid navigation location", 'error'));
  }

  var callback = function callback(message, originalLabel, err, label) {
    if (err) {
      dispatch(_notifications2.default.displayNotification(err.message, 'error'));
    } else {
      dispatch({
        type: isToAddLabel ? "UPDATE_MESSAGE_ADD_LABEL" : "UPDATE_MESSAGE_DROP_LABEL",
        payload: {
          message: message,
          label: originalLabel || label
        }
      });
    }
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = communicatorMessages.selected[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var message = _step.value;

      var messageLabel = message.labels.find(function (mlabel) {
        return mlabel.labelId === label.id;
      });
      if (isToAddLabel && !messageLabel) {
        mApi().communicator.messages.labels.create(message.communicatorMessageId, { labelId: label.id }).callback(callback.bind(this, message, null));
      } else if (!isToAddLabel) {
        if (!messageLabel) {
          //TODO translate this
          dispatch(_notifications2.default.displayNotification("Label already does not exist", 'error'));
        } else {
          mApi().communicator.messages.labels.del(message.communicatorMessageId, messageLabel.id).callback(callback.bind(this, message, messageLabel));
        }
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

exports.default = {
  updateCommunicatorMessagesForLocation: function updateCommunicatorMessagesForLocation(location, page) {
    return loadMessages.bind(this, location, true);
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
  },
  loadMoreMessages: function loadMoreMessages() {
    return loadMessages.bind(this, null, false);
  },
  addLabelToSelectedMessages: function addLabelToSelectedMessages(label) {
    return setLabelStatusSelectedMessages.bind(this, label, true);
  },
  removeLabelFromSelectedMessages: function removeLabelFromSelectedMessages(label) {
    return setLabelStatusSelectedMessages.bind(this, label, false);
  },
  toggleMessagesReadStatus: function toggleMessagesReadStatus(message) {
    return function (dispatch, getState) {
      dispatch({
        type: "LOCK_TOOLBAR"
      });

      var _getState3 = getState(),
          communicatorNavigation = _getState3.communicatorNavigation,
          communicatorMessages = _getState3.communicatorMessages,
          messageCount = _getState3.messageCount;

      var item = communicatorNavigation.find(function (item) {
        return item.location === communicatorMessages.location;
      });
      if (!item) {
        //TODO translate this
        dispatch(_notifications2.default.displayNotification("Invalid navigation location", 'error'));
        dispatch({
          type: "UNLOCK_TOOLBAR"
        });
      }

      dispatch({
        type: "UPDATE_ONE_MESSAGE",
        payload: {
          message: message,
          update: {
            unreadMessagesInThread: !message.unreadMessagesInThread
          }
        }
      });

      function callback(err) {
        mApi().communicator[getApiId(item)].cacheClear();
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
          dispatch({
            type: "UPDATE_ONE_MESSAGE",
            payload: {
              message: message,
              update: {
                unreadMessagesInThread: message.unreadMessagesInThread
              }
            }
          });
          dispatch(_messageCount2.default.updateMessageCount(messageCount));
        }
        dispatch({
          type: "UNLOCK_TOOLBAR"
        });
      }

      if (message.unreadMessagesInThread) {
        dispatch(_messageCount2.default.updateMessageCount(messageCount - 1));
        mApi().communicator[getApiId(item)].markasread.create(message.communicatorMessageId).callback(callback);
      } else {
        dispatch(_messageCount2.default.updateMessageCount(messageCount + 1));
        mApi().communicator[getApiId(item)].markasunread.create(message.communicatorMessageId).callback(callback);
      }
    };
  }
};

},{"../../../util/modifiers":53,"../../base/notifications":2,"../message-count":12}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = require('../../base/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _modifiers = require('../../../util/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  updateCommunicatorNavigationLabels: function updateCommunicatorNavigationLabels(callback) {
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

          callback && callback();
        }
      });
    };
  },
  addCommunicatorLabel: function addCommunicatorLabel(name) {
    return function (dispatch, getState) {
      var color = Math.round(Math.random() * 16777215);
      var label = {
        name: name,
        color: color
      };

      mApi().communicator.userLabels.create(label).callback(function (err, label) {
        if (err) {
          dispatch(_notifications2.default.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: "ADD_COMMUNICATOR_NAVIGATION_LABEL",
            payload: {
              location: "label-" + label.id,
              id: label.id,
              type: "label",
              icon: "tag",
              text: function text() {
                return label.name;
              },

              color: (0, _modifiers.colorIntToHex)(label.color)
            }
          });
        }
      });
    };
  }
};

},{"../../../util/modifiers":53,"../../base/notifications":2}],7:[function(require,module,exports){
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
  var currentLocation = window.location.hash.replace("#", "").split("/");

  store.dispatch(_mainFunction2.default.messageCount.updateMessageCount());
  store.dispatch(_communicator6.default.communicatorNavigation.updateCommunicatorNavigationLabels(function () {
    if (currentLocation[0].includes("label")) {
      store.dispatch(_communicator6.default.communicatorMessages.updateCommunicatorMessagesForLocation(currentLocation[0]));
    }
  }));

  window.addEventListener("hashchange", function () {
    var newLocation = window.location.hash.replace("#", "").split("/");
    store.dispatch(_mainFunction2.default.hash.updateHash(newLocation));
    store.dispatch(_communicator6.default.communicatorMessages.updateCommunicatorMessagesForLocation(newLocation[0]));
  }, false);
  if (!window.location.hash) {
    window.location.hash = "#inbox";
  } else {
    store.dispatch(_mainFunction2.default.hash.updateHash(currentLocation));
    if (!currentLocation[0].includes("labels")) {
      store.dispatch(_communicator6.default.communicatorMessages.updateCommunicatorMessagesForLocation(currentLocation[0]));
    }
  }
});

},{"./actions/main-function":9,"./actions/main-function/communicator":7,"./containers/communicator.jsx":31,"./default.debug.jsx":32,"./reducers/communicator":48,"./util/websocket":54}],15:[function(require,module,exports){
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
    _this.onTouchStartMessage = _this.onTouchStartMessage.bind(_this);
    _this.onTouchEndMessage = _this.onTouchEndMessage.bind(_this);
    _this.onScroll = _this.onScroll.bind(_this);
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
      var isSelected = this.props.communicatorMessages.selectedIds.includes(message.communicatorMessageId);
      if (isSelected) {
        this.props.removeFromCommunicatorSelectedMessages(message);
      } else {
        this.props.addToCommunicatorSelectedMessages(message);
      }
      return isSelected;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.communicatorMessages.state === "LOADING") {
        this.setState({
          touchMode: false
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.communicatorMessages.state === "READY" && this.props.communicatorMessages.hasMore) {
        var list = this.refs.list;
        var doesNotHaveScrollBar = list.scrollHeight === list.offsetHeight;
        if (doesNotHaveScrollBar) {
          this.props.loadMoreMessages();
        }
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll(e) {
      if (this.props.communicatorMessages.state === "READY" && this.props.communicatorMessages.hasMore) {
        var list = this.refs.list;
        var scrollBottomRemaining = list.scrollHeight - (list.scrollTop + list.offsetHeight);
        if (scrollBottomRemaining <= 100) {
          this.props.loadMoreMessages();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.props.communicatorMessages.state === "LOADING") {
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
        { className: 'communicator application-list ' + (this.state.touchMode ? "application-list-select-mode" : ""),
          ref: 'list', onScroll: this.onScroll },
        this.props.communicatorMessages.messages.map(function (message, index) {
          var isSelected = _this3.props.communicatorMessages.selectedIds.includes(message.communicatorMessageId);
          return _react2.default.createElement(
            'div',
            { key: message.communicatorMessageId,
              className: 'application-list-item ' + (message.unreadMessagesInThread ? "communicator-application-list-item-unread" : "") + ' ' + (isSelected ? "selected" : ""),
              onTouchStart: _this3.onTouchStartMessage.bind(_this3, message), onTouchEnd: _this3.onTouchEndMessage.bind(_this3, message) },
            _react2.default.createElement(
              'div',
              { className: 'application-list-item-header' },
              _react2.default.createElement('input', { type: 'checkbox', checked: isSelected, onChange: _this3.toggleMessageSelection.bind(_this3, message) }),
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
        }),
        this.props.communicatorMessages.state === "LOADING_MORE" ? _react2.default.createElement('div', { className: 'application-list-item loader-empty' }) : null
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

},{"../../../../actions/main-function/communicator/communicator-messages":5,"../../../../util/modifiers":53,"react":"react","react-redux":"react-redux","redux":"redux"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _dropdown = require('../../../general/dropdown.jsx');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _link = require('../../../general/link.jsx');

var _link2 = _interopRequireDefault(_link);

var _communicatorMessages = require('../../../../actions/main-function/communicator/communicator-messages');

var _communicatorMessages2 = _interopRequireDefault(_communicatorMessages);

var _communicatorNavigation = require('../../../../actions/main-function/communicator/communicator-navigation');

var _communicatorNavigation2 = _interopRequireDefault(_communicatorNavigation);

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
        return item.location === _this2.props.hash[0];
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
              { className: 'communicator link link-full communicator-link-new', onClick: this.props.addCommunicatorLabel.bind(null, this.state.labelFilter) },
              this.props.i18n.text.get("plugin.communicator.label.create")
            )].concat(this.props.communicatorNavigation.filter(function (item) {
              return item.type === "label" && (0, _modifiers.filterMatch)(item.text(_this2.props.i18n), _this2.state.labelFilter);
            }).map(function (label) {
              var isSelected = allInCommon.includes(label.id);
              var isPartiallySelected = onlyInSome.includes(label.id);
              return _react2.default.createElement(
                _link2.default,
                { className: 'communicator link link-full communicator-link-label ' + (isSelected ? "selected" : "") + ' ' + (isPartiallySelected ? "semi-selected" : "") + ' ' + (isAtLeastOneSelected ? "" : "disabled"),
                  onClick: !isSelected || isPartiallySelected ? _this2.props.addLabelToSelectedMessages.bind(null, label) : _this2.props.removeLabelFromSelectedMessages.bind(null, label) },
                _react2.default.createElement('span', { className: 'icon icon-tag', style: { color: label.color } }),
                _react2.default.createElement(
                  'span',
                  { className: 'text' },
                  (0, _modifiers.filterHighlight)(label.text(_this2.props.i18n), _this2.state.labelFilter)
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
          { className: 'communicator button button-pill communicator-button-pill-toggle-read',
            disabled: this.props.communicatorMessages.selected.length !== 1,
            onClick: this.props.communicatorMessages.toolbarLock ? null : this.props.toggleMessagesReadStatus.bind(null, this.props.communicatorMessages.selected[0]) },
          _react2.default.createElement('span', { className: 'icon icon-message-' + (this.props.communicatorMessages.selected.length === 1 && !this.props.communicatorMessages.selected[0].unreadMessagesInThread ? "un" : "") + 'read' })
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
  return (0, _redux.bindActionCreators)(Object.assign({}, _communicatorMessages2.default, _communicatorNavigation2.default), dispatch);
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CommunicatorToolbar);

},{"../../../../actions/main-function/communicator/communicator-messages":5,"../../../../actions/main-function/communicator/communicator-navigation":6,"../../../../util/modifiers":53,"../../../general/dropdown.jsx":23,"../../../general/link.jsx":25,"react":"react","react-redux":"react-redux","redux":"redux"}],21:[function(require,module,exports){
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
            { key: index, className: 'item-list-item ' + (_this2.props.hash[0] === item.location ? "active" : ""), href: '#' + item.location },
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

},{"react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","redux-devtools-extension":42,"redux-logger":43,"redux-thunk":"redux-thunk"}],33:[function(require,module,exports){
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

},{"redux":"redux"}],43:[function(require,module,exports){
(function (global){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{"./base/i18n":44,"./base/locales":45,"./base/notifications":46,"./base/status":47,"./main-function/communicator/communicator-messages":49,"./main-function/communicator/communicator-navigation":50,"./main-function/hash":51,"./main-function/message-count":52,"redux":"redux"}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = communicatorMessages;
function communicatorMessages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    state: "LOADING",
    messages: [],
    selected: [],
    selectedIds: [],
    pages: 1,
    hasMore: false,
    location: "",
    toolbarLock: false
  };
  var action = arguments[1];

  if (action.type === "UPDATE_MESSAGES_STATE") {
    return Object.assign({}, state, { state: action.payload });
  } else if (action.type === "UPDATE_PAGES") {
    return Object.assign({}, state, { pages: action.payload });
  } else if (action.type === "UPDATE_HAS_MORE") {
    return Object.assign({}, state, { hasMore: action.payload });
  } else if (action.type === "UPDATE_MESSAGES_ALL_PROPERTIES") {
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_MESSAGES") {
    return Object.assign({}, state, { messages: action.payload });
  } else if (action.type === "UPDATE_SELECTED_MESSAGES") {
    return Object.assign({}, state, { selected: action.payload, selectedIds: action.payload.map(function (s) {
        return s.communicatorMessageId;
      }) });
  } else if (action.type === "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES") {
    return Object.assign({}, state, { selected: state.selected.concat([action.payload]), selectedIds: state.selectedIds.concat([action.payload.communicatorMessageId]) });
  } else if (action.type === "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES") {
    return Object.assign({}, state, { selected: state.selected.filter(function (selected) {
        return selected.communicatorMessageId !== action.payload.communicatorMessageId;
      }), selectedIds: state.selectedIds.filter(function (id) {
        return id !== action.payload.communicatorMessageId;
      }) });
  } else if (action.type === "UPDATE_ONE_MESSAGE") {
    var newMessage = Object.assign({}, action.payload.message, action.payload.update);
    return Object.assign({}, state, { selected: state.selected.map(function (selected) {
        if (selected.communicatorMessageId === action.payload.message.communicatorMessageId) {
          return newMessage;
        }
        return selected;
      }), messages: state.messages.map(function (message) {
        if (message.communicatorMessageId === action.payload.message.communicatorMessageId) {
          return newMessage;
        }
        return message;
      }) });
  } else if (action.type === "LOCK_TOOLBAR") {
    return Object.assign({}, state, { toolbarLock: true });
  } else if (action.type === "UNLOCK_TOOLBAR") {
    return Object.assign({}, state, { toolbarLock: false });
  } else if (action.type === "UPDATE_MESSAGE_ADD_LABEL") {
    var _newMessage = action.payload.message;
    if (!_newMessage.labels.find(function (label) {
      return label.labelId === action.payload.label.labelId;
    })) {
      _newMessage = Object.assign({}, _newMessage, {
        labels: _newMessage.labels.concat([action.payload.label])
      });
    }
    return Object.assign({}, state, { selected: state.selected.map(function (selected) {
        if (selected.communicatorMessageId === action.payload.message.communicatorMessageId) {
          return _newMessage;
        }
        return selected;
      }), messages: state.messages.map(function (message) {
        if (message.communicatorMessageId === action.payload.message.communicatorMessageId) {
          return _newMessage;
        }
        return message;
      }) });
  } else if (action.type === "UPDATE_MESSAGE_DROP_LABEL") {
    var _newMessage2 = Object.assign({}, action.payload.message, {
      labels: action.payload.message.labels.filter(function (label) {
        return label.labelId !== action.payload.label.labelId;
      })
    });
    return Object.assign({}, state, { selected: state.selected.map(function (selected) {
        if (selected.communicatorMessageId === action.payload.message.communicatorMessageId) {
          return _newMessage2;
        }
        return selected;
      }), messages: state.messages.map(function (message) {
        if (message.communicatorMessageId === action.payload.message.communicatorMessageId) {
          return _newMessage2;
        }
        return message;
      }) });
  }
  return state;
}

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hash;
function hash() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  if (action.type === 'UPDATE_HASH') {
    return action.payload;
  }
  return state;
}

},{}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterMatch = filterMatch;
exports.filterHighlight = filterHighlight;
exports.colorIntToHex = colorIntToHex;
exports.hexToColorInt = hexToColorInt;
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

function hexToColorInt(hexColor) {
  var r = 255;
  var g = 255;
  var b = 255;

  if (hexColor) {
    if (hexColor.length == 7) {
      hexColor = hexColor.slice(1);
    }

    r = parseInt(hexColor.slice(0, 2), 16);
    g = parseInt(hexColor.slice(2, 4), 16);
    b = parseInt(hexColor.slice(4, 6), 16);
  }

  return (r << 16) + (g << 8) + b;
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

},{"react":"react"}],54:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2Jhc2UvbG9jYWxlcy5qcyIsImFjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zLmpzIiwiYWN0aW9ucy9iYXNlL3N0YXR1cy5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9hbm5vdW5jZW1lbnRzLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbWVzc2FnZXMuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vY29tbXVuaWNhdG9yL2NvbW11bmljYXRvci1uYXZpZ2F0aW9uLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9pbmRleC5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi9oYXNoLmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2luZGV4LmpzIiwiYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2xhc3QtbWVzc2FnZXMuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vbGFzdC13b3Jrc3BhY2UuanMiLCJhY3Rpb25zL21haW4tZnVuY3Rpb24vbWVzc2FnZS1jb3VudC5qcyIsImFjdGlvbnMvbWFpbi1mdW5jdGlvbi93b3Jrc3BhY2VzLmpzIiwiY29tbXVuaWNhdG9yLmpzIiwiY29tcG9uZW50cy9iYXNlL21haW4tZnVuY3Rpb24vbmF2YmFyLmpzeCIsImNvbXBvbmVudHMvYmFzZS9ub3RpZmljYXRpb25zLmpzeCIsImNvbXBvbmVudHMvY29tbXVuaWNhdG9yL2JvZHkuanN4IiwiY29tcG9uZW50cy9jb21tdW5pY2F0b3IvYm9keS9hcHBsaWNhdGlvbi5qc3giLCJjb21wb25lbnRzL2NvbW11bmljYXRvci9ib2R5L2FwcGxpY2F0aW9uL21lc3NhZ2VzLmpzeCIsImNvbXBvbmVudHMvY29tbXVuaWNhdG9yL2JvZHkvYXBwbGljYXRpb24vdG9vbGJhci5qc3giLCJjb21wb25lbnRzL2NvbW11bmljYXRvci9ib2R5L25hdmlnYXRpb24uanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL2FwcGxpY2F0aW9uLXBhbmVsLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9kcm9wZG93bi5qc3giLCJjb21wb25lbnRzL2dlbmVyYWwvaG92ZXItYnV0dG9uLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4IiwiY29tcG9uZW50cy9nZW5lcmFsL25hdmJhci9tZW51LmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9uYXZiYXIvcHJvZmlsZS1pdGVtLmpzeCIsImNvbXBvbmVudHMvZ2VuZXJhbC9wb3J0YWwuanN4IiwiY29udGFpbmVycy9jb21tdW5pY2F0b3IuanN4IiwiZGVmYXVsdC5kZWJ1Zy5qc3giLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJub2RlX21vZHVsZXMvcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9kaXN0L3JlZHV4LWxvZ2dlci5qcyIsInJlZHVjZXJzL2Jhc2UvaTE4bi5qcyIsInJlZHVjZXJzL2Jhc2UvbG9jYWxlcy5qcyIsInJlZHVjZXJzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qcyIsInJlZHVjZXJzL2Jhc2Uvc3RhdHVzLmpzIiwicmVkdWNlcnMvY29tbXVuaWNhdG9yLmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi9jb21tdW5pY2F0b3IvY29tbXVuaWNhdG9yLW1lc3NhZ2VzLmpzIiwicmVkdWNlcnMvbWFpbi1mdW5jdGlvbi9jb21tdW5pY2F0b3IvY29tbXVuaWNhdG9yLW5hdmlnYXRpb24uanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL2hhc2guanMiLCJyZWR1Y2Vycy9tYWluLWZ1bmN0aW9uL21lc3NhZ2UtY291bnQuanMiLCJ1dGlsL21vZGlmaWVycy5qcyIsInV0aWwvd2Vic29ja2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7a0JDQWU7QUFDYixhQUFXLG1CQUFTLE1BQVQsRUFBZ0I7QUFDekIsV0FBTztBQUNMLGNBQVEsWUFESDtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBTlksQzs7Ozs7Ozs7a0JDQUE7QUFDYix1QkFBcUIsNkJBQVMsT0FBVCxFQUFrQixRQUFsQixFQUEyQjtBQUM5QyxXQUFPO0FBQ0wsY0FBUSxrQkFESDtBQUVMLGlCQUFXO0FBQ1Qsb0JBQVksUUFESDtBQUVULG1CQUFXO0FBRkY7QUFGTixLQUFQO0FBT0QsR0FUWTtBQVViLG9CQUFrQiwwQkFBUyxZQUFULEVBQXNCO0FBQ3RDLFdBQU87QUFDTCxjQUFRLG1CQURIO0FBRUwsaUJBQVc7QUFGTixLQUFQO0FBSUQ7QUFmWSxDOzs7Ozs7OztrQkNBQTtBQUNiLFFBRGEsb0JBQ0w7QUFDTixXQUFPO0FBQ0wsY0FBUTtBQURILEtBQVA7QUFHRDtBQUxZLEM7Ozs7Ozs7OztBQ0FmOzs7Ozs7a0JBRWU7QUFDYixxQkFEYSxpQ0FDdUQ7QUFBQSxRQUFoRCxPQUFnRCx1RUFBeEMsRUFBRSw0QkFBNEIsT0FBOUIsRUFBd0M7O0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QWpCLEVBQThCO0FBQzVCLGFBQUssT0FBTCxHQUFlLEtBQWY7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLFFBQVEsSUFBaEM7QUFDRDtBQUNGOzs7MkNBRXNCO0FBQ3JCLFVBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLGFBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsWUFBSSxDQUFFLENBQWpDO0FBQ0EsYUFBSyxTQUFMLENBQWUsT0FBZixHQUF5QixZQUFJLENBQUUsQ0FBL0I7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLFlBQUksQ0FBRSxDQUEvQjtBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGVBQUssU0FBTCxDQUFlLEtBQWY7QUFDRDtBQUNGO0FBQ0Y7Ozs7OztrQkExUGtCLGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQge1xuICBzZXRMb2NhbGU6IGZ1bmN0aW9uKGxvY2FsZSl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ1NFVF9MT0NBTEUnLFxuICAgICAgJ3BheWxvYWQnOiBsb2NhbGVcbiAgICB9XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICBkaXNwbGF5Tm90aWZpY2F0aW9uOiBmdW5jdGlvbihtZXNzYWdlLCBzZXZlcml0eSl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0FERF9OT1RJRklDQVRJT04nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICdzZXZlcml0eSc6IHNldmVyaXR5LFxuICAgICAgICAnbWVzc2FnZSc6IG1lc3NhZ2VcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGhpZGVOb3RpZmljYXRpb246IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbil7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0hJREVfTk9USUZJQ0FUSU9OJyxcbiAgICAgICdwYXlsb2FkJzogbm90aWZpY2F0aW9uXG4gICAgfVxuICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgbG9nb3V0KCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ0xPR09VVCdcbiAgICB9XG4gIH1cbn07IiwiaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVBbm5vdW5jZW1lbnRzKG9wdGlvbnM9eyBoaWRlV29ya3NwYWNlQW5ub3VuY2VtZW50czogXCJmYWxzZVwiIH0pe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgbUFwaSgpXG4gICAgICAgIC5hbm5vdW5jZXJcbiAgICAgICAgLmFubm91bmNlbWVudHNcbiAgICAgICAgLnJlYWQob3B0aW9ucylcbiAgICAgICAgLmNhbGxiYWNrKGZ1bmN0aW9uKGVyciwgYW5ub3VuY2VtZW50cykge1xuICAgICAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfQU5OT1VOQ0VNRU5UUycsXG4gICAgICAgICAgICAgIHBheWxvYWQ6IGFubm91bmNlbWVudHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IG5vdGlmaWNhdGlvbkFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgbWVzc2FnZUNvdW50QWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvbWFpbi1mdW5jdGlvbi9tZXNzYWdlLWNvdW50JztcblxuaW1wb3J0IHtoZXhUb0NvbG9ySW50fSBmcm9tICd+L3V0aWwvbW9kaWZpZXJzJztcblxuY29uc3QgTUFYX0xPQURFRF9BVF9PTkNFID0gMzA7XG5cbmZ1bmN0aW9uIGdldEFwaUlkKGl0ZW0pe1xuICBpZiAoaXRlbS50eXBlID09PSBcImZvbGRlclwiKXtcbiAgICBzd2l0Y2goaXRlbS5pZCl7XG4gICAgY2FzZSBcImluYm94XCI6XG4gICAgICByZXR1cm4gXCJpdGVtc1wiO1xuICAgIGNhc2UgXCJ1bnJlYWRcIjpcbiAgICAgIHJldHVybiBcIml0ZW1zXCI7XG4gICAgY2FzZSBcInNlbnRcIjpcbiAgICAgIHJldHVybiBcInNlbnRpdGVtc1wiO1xuICAgIGNhc2UgXCJ0cmFzaFwiOlxuICAgICAgcmV0dXJuIFwidHJhc2hcIjtcbiAgICB9XG4gICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKXtcbiAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgbmF2aWdhdGlvbiBpdGVtIGxvY2F0aW9uXCIsaXRlbSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIml0ZW1zXCI7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvY2Vzc01lc3NhZ2VzKGRpc3BhdGNoLCBjb21tdW5pY2F0b3JNZXNzYWdlcywgbG9jYXRpb24sIHBhZ2VzLCBjb25jYXQsIGVyciwgbWVzc2FnZXMpe1xuICBpZiAoZXJyKXtcbiAgICBkaXNwYXRjaChub3RpZmljYXRpb25BY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBcIlVQREFURV9NRVNTQUdFU19TVEFURVwiLFxuICAgICAgcGF5bG9hZDogXCJFUlJPUlwiXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGhhc01vcmUgPSBtZXNzYWdlcy5sZW5ndGggPT09IE1BWF9MT0FERURfQVRfT05DRSArIDE7XG4gICAgaWYgKGhhc01vcmUpe1xuICAgICAgbWVzc2FnZXMucG9wKCk7XG4gICAgfVxuICAgIFxuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgc3RhdGU6IFwiUkVBRFlcIixcbiAgICAgIG1lc3NhZ2VzOiAoY29uY2F0ID8gY29tbXVuaWNhdG9yTWVzc2FnZXMubWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSA6IG1lc3NhZ2VzKSxcbiAgICAgIHBhZ2VzOiBwYWdlcyxcbiAgICAgIGhhc01vcmUsXG4gICAgICBsb2NhdGlvblxuICAgIH1cbiAgICBpZiAoIWNvbmNhdCl7XG4gICAgICBwYXlsb2FkLnNlbGVjdGVkID0gW107XG4gICAgICBwYXlsb2FkLnNlbGVjdGVkSWRzID0gW107XG4gICAgfVxuICAgIFxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFwiVVBEQVRFX01FU1NBR0VTX0FMTF9QUk9QRVJUSUVTXCIsXG4gICAgICBwYXlsb2FkXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKGxvY2F0aW9uLCBpbml0aWFsLCBkaXNwYXRjaCwgZ2V0U3RhdGUpe1xuICBpZiAoaW5pdGlhbCl7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIixcbiAgICAgIHBheWxvYWQ6IFwiTE9BRElOR1wiXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIixcbiAgICAgIHBheWxvYWQ6IFwiTE9BRElOR19NT1JFXCJcbiAgICB9KTtcbiAgfVxuICBcbiAgbGV0IHtjb21tdW5pY2F0b3JOYXZpZ2F0aW9uLCBjb21tdW5pY2F0b3JNZXNzYWdlc30gPSBnZXRTdGF0ZSgpO1xuICBsZXQgYWN0dWFsTG9jYXRpb24gPSBsb2NhdGlvbiB8fCBjb21tdW5pY2F0b3JNZXNzYWdlcy5sb2NhdGlvbjtcbiAgbGV0IGl0ZW0gPSBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uLmZpbmQoKGl0ZW0pPT57XG4gICAgcmV0dXJuIGl0ZW0ubG9jYXRpb24gPT09IGFjdHVhbExvY2F0aW9uO1xuICB9KTtcbiAgaWYgKCFpdGVtKXtcbiAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIixcbiAgICAgIHBheWxvYWQ6IFwiRVJST1JcIlxuICAgIH0pO1xuICB9XG4gIFxuICBsZXQgZmlyc3RSZXN1bHQgPSBpbml0aWFsID8gMCA6IGNvbW11bmljYXRvck1lc3NhZ2VzLnBhZ2VzKk1BWF9MT0FERURfQVRfT05DRTtcbiAgbGV0IHBhZ2VzID0gaW5pdGlhbCA/IDEgOiBjb21tdW5pY2F0b3JNZXNzYWdlcy5wYWdlcyArIDE7XG4gIGxldCBhcmdzID0gW3RoaXMsIGRpc3BhdGNoLCBjb21tdW5pY2F0b3JNZXNzYWdlcywgYWN0dWFsTG9jYXRpb24sIHBhZ2VzLCBjb25jYXRdO1xuICBsZXQgY29uY2F0ID0gIWluaXRpYWw7XG4gIGlmIChpdGVtLnR5cGUgPT09ICdmb2xkZXInKXtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBmaXJzdFJlc3VsdCxcbiAgICAgICAgbWF4UmVzdWx0czogTUFYX0xPQURFRF9BVF9PTkNFICsgMVxuICAgIH1cbiAgICBzd2l0Y2goaXRlbS5pZCl7XG4gICAgY2FzZSBcImluYm94XCI6XG4gICAgICBwYXJhbXMub25seVVucmVhZCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInVucmVhZFwiOlxuICAgICAgcGFyYW1zLm9ubHlVbnJlYWQgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIG1BcGkoKS5jb21tdW5pY2F0b3JbZ2V0QXBpSWQoaXRlbSldLnJlYWQocGFyYW1zKS5jYWxsYmFjayhwcm9jZXNzTWVzc2FnZXMuYmluZCguLi5hcmdzKSk7XG4gIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSAnbGFiZWwnKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbGFiZWxJZDogaXRlbS5pZCxcbiAgICAgICAgZmlyc3RSZXN1bHQsXG4gICAgICAgIG1heFJlc3VsdHM6IE1BWF9MT0FERURfQVRfT05DRSArIDFcbiAgICB9XG4gICAgbUFwaSgpLmNvbW11bmljYXRvcltnZXRBcGlJZChpdGVtKV0ucmVhZChwYXJhbXMpLmNhbGxiYWNrKHByb2Nlc3NNZXNzYWdlcy5iaW5kKC4uLmFyZ3MpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIixcbiAgICAgIHBheWxvYWQ6IFwiRVJST1JcIlxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldExhYmVsU3RhdHVzU2VsZWN0ZWRNZXNzYWdlcyhsYWJlbCwgaXNUb0FkZExhYmVsLCBkaXNwYXRjaCwgZ2V0U3RhdGUpe1xuICBsZXQge2NvbW11bmljYXRvck5hdmlnYXRpb24sIGNvbW11bmljYXRvck1lc3NhZ2VzLCBpMThufSA9IGdldFN0YXRlKCk7XG4gIGxldCBpdGVtID0gY29tbXVuaWNhdG9yTmF2aWdhdGlvbi5maW5kKChpdGVtKT0+e1xuICAgIHJldHVybiBpdGVtLmxvY2F0aW9uID09PSBjb21tdW5pY2F0b3JNZXNzYWdlcy5sb2NhdGlvbjtcbiAgfSk7XG4gIGlmICghaXRlbSl7XG4gICAgLy9UT0RPIHRyYW5zbGF0ZSB0aGlzXG4gICAgZGlzcGF0Y2gobm90aWZpY2F0aW9uQWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiSW52YWxpZCBuYXZpZ2F0aW9uIGxvY2F0aW9uXCIsICdlcnJvcicpKTtcbiAgfVxuICBcbiAgbGV0IGNhbGxiYWNrID0gKG1lc3NhZ2UsIG9yaWdpbmFsTGFiZWwsIGVyciwgbGFiZWwpPT57XG4gICAgaWYgKGVycil7XG4gICAgICBkaXNwYXRjaChub3RpZmljYXRpb25BY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBpc1RvQWRkTGFiZWwgPyBcIlVQREFURV9NRVNTQUdFX0FERF9MQUJFTFwiIDogXCJVUERBVEVfTUVTU0FHRV9EUk9QX0xBQkVMXCIsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIGxhYmVsOiBvcmlnaW5hbExhYmVsIHx8IGxhYmVsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBcbiAgZm9yIChsZXQgbWVzc2FnZSBvZiBjb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZCl7XG4gICAgbGV0IG1lc3NhZ2VMYWJlbCA9IG1lc3NhZ2UubGFiZWxzLmZpbmQobWxhYmVsPT5tbGFiZWwubGFiZWxJZCA9PT0gbGFiZWwuaWQpO1xuICAgIGlmIChpc1RvQWRkTGFiZWwgJiYgIW1lc3NhZ2VMYWJlbCl7XG4gICAgICBtQXBpKCkuY29tbXVuaWNhdG9yLm1lc3NhZ2VzLmxhYmVscy5jcmVhdGUobWVzc2FnZS5jb21tdW5pY2F0b3JNZXNzYWdlSWQsIHsgbGFiZWxJZDogbGFiZWwuaWQgfSkuY2FsbGJhY2soY2FsbGJhY2suYmluZCh0aGlzLCBtZXNzYWdlLCBudWxsKSk7XG4gICAgfSBlbHNlIGlmICghaXNUb0FkZExhYmVsKXtcbiAgICAgIGlmICghbWVzc2FnZUxhYmVsKXtcbiAgICAgICAgLy9UT0RPIHRyYW5zbGF0ZSB0aGlzXG4gICAgICAgIGRpc3BhdGNoKG5vdGlmaWNhdGlvbkFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkxhYmVsIGFscmVhZHkgZG9lcyBub3QgZXhpc3RcIiwgJ2Vycm9yJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbUFwaSgpLmNvbW11bmljYXRvci5tZXNzYWdlcy5sYWJlbHMuZGVsKG1lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkLCBtZXNzYWdlTGFiZWwuaWQpLmNhbGxiYWNrKGNhbGxiYWNrLmJpbmQodGhpcywgbWVzc2FnZSwgbWVzc2FnZUxhYmVsKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlQ29tbXVuaWNhdG9yTWVzc2FnZXNGb3JMb2NhdGlvbihsb2NhdGlvbiwgcGFnZSl7XG4gICAgcmV0dXJuIGxvYWRNZXNzYWdlcy5iaW5kKHRoaXMsIGxvY2F0aW9uLCB0cnVlKTtcbiAgfSxcbiAgdXBkYXRlQ29tbXVuaWNhdG9yU2VsZWN0ZWRNZXNzYWdlcyhtZXNzYWdlcyl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IFwiVVBEQVRFX1NFTEVDVEVEX01FU1NBR0VTXCIsXG4gICAgICBwYXlsb2FkOiBtZXNzYWdlc1xuICAgIH07XG4gIH0sXG4gIGFkZFRvQ29tbXVuaWNhdG9yU2VsZWN0ZWRNZXNzYWdlcyhtZXNzYWdlKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogXCJBRERfVE9fQ09NTVVOSUNBVE9SX1NFTEVDVEVEX01FU1NBR0VTXCIsXG4gICAgICBwYXlsb2FkOiBtZXNzYWdlXG4gICAgfTtcbiAgfSxcbiAgcmVtb3ZlRnJvbUNvbW11bmljYXRvclNlbGVjdGVkTWVzc2FnZXMobWVzc2FnZSl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IFwiUkVNT1ZFX0ZST01fQ09NTVVOSUNBVE9SX1NFTEVDVEVEX01FU1NBR0VTXCIsXG4gICAgICBwYXlsb2FkOiBtZXNzYWdlXG4gICAgfTtcbiAgfSxcbiAgbG9hZE1vcmVNZXNzYWdlcygpe1xuICAgIHJldHVybiBsb2FkTWVzc2FnZXMuYmluZCh0aGlzLCBudWxsLCBmYWxzZSk7XG4gIH0sXG4gIGFkZExhYmVsVG9TZWxlY3RlZE1lc3NhZ2VzKGxhYmVsKXtcbiAgICByZXR1cm4gc2V0TGFiZWxTdGF0dXNTZWxlY3RlZE1lc3NhZ2VzLmJpbmQodGhpcywgbGFiZWwsIHRydWUpO1xuICB9LFxuICByZW1vdmVMYWJlbEZyb21TZWxlY3RlZE1lc3NhZ2VzKGxhYmVsKXtcbiAgICByZXR1cm4gc2V0TGFiZWxTdGF0dXNTZWxlY3RlZE1lc3NhZ2VzLmJpbmQodGhpcywgbGFiZWwsIGZhbHNlKTtcbiAgfSxcbiAgdG9nZ2xlTWVzc2FnZXNSZWFkU3RhdHVzKG1lc3NhZ2Upe1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKT0+e1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcIkxPQ0tfVE9PTEJBUlwiXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgbGV0IHtjb21tdW5pY2F0b3JOYXZpZ2F0aW9uLCBjb21tdW5pY2F0b3JNZXNzYWdlcywgbWVzc2FnZUNvdW50fSA9IGdldFN0YXRlKCk7XG4gICAgICBsZXQgaXRlbSA9IGNvbW11bmljYXRvck5hdmlnYXRpb24uZmluZCgoaXRlbSk9PntcbiAgICAgICAgcmV0dXJuIGl0ZW0ubG9jYXRpb24gPT09IGNvbW11bmljYXRvck1lc3NhZ2VzLmxvY2F0aW9uO1xuICAgICAgfSk7XG4gICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAvL1RPRE8gdHJhbnNsYXRlIHRoaXNcbiAgICAgICAgZGlzcGF0Y2gobm90aWZpY2F0aW9uQWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKFwiSW52YWxpZCBuYXZpZ2F0aW9uIGxvY2F0aW9uXCIsICdlcnJvcicpKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFwiVU5MT0NLX1RPT0xCQVJcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcIlVQREFURV9PTkVfTUVTU0FHRVwiLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgIHVucmVhZE1lc3NhZ2VzSW5UaHJlYWQ6ICFtZXNzYWdlLnVucmVhZE1lc3NhZ2VzSW5UaHJlYWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBjYWxsYmFjayhlcnIpe1xuICAgICAgICBtQXBpKCkuY29tbXVuaWNhdG9yW2dldEFwaUlkKGl0ZW0pXS5jYWNoZUNsZWFyKCk7XG4gICAgICAgIGlmIChlcnIpe1xuICAgICAgICAgIGRpc3BhdGNoKG5vdGlmaWNhdGlvbkFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwiVVBEQVRFX09ORV9NRVNTQUdFXCIsXG4gICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgICAgICAgIHVucmVhZE1lc3NhZ2VzSW5UaHJlYWQ6IG1lc3NhZ2UudW5yZWFkTWVzc2FnZXNJblRocmVhZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGlzcGF0Y2gobWVzc2FnZUNvdW50QWN0aW9ucy51cGRhdGVNZXNzYWdlQ291bnQobWVzc2FnZUNvdW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFwiVU5MT0NLX1RPT0xCQVJcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG1lc3NhZ2UudW5yZWFkTWVzc2FnZXNJblRocmVhZCl7XG4gICAgICAgIGRpc3BhdGNoKG1lc3NhZ2VDb3VudEFjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50KG1lc3NhZ2VDb3VudCAtIDEpKTtcbiAgICAgICAgbUFwaSgpLmNvbW11bmljYXRvcltnZXRBcGlJZChpdGVtKV0ubWFya2FzcmVhZC5jcmVhdGUobWVzc2FnZS5jb21tdW5pY2F0b3JNZXNzYWdlSWQpLmNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BhdGNoKG1lc3NhZ2VDb3VudEFjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50KG1lc3NhZ2VDb3VudCArIDEpKTtcbiAgICAgICAgbUFwaSgpLmNvbW11bmljYXRvcltnZXRBcGlJZChpdGVtKV0ubWFya2FzdW5yZWFkLmNyZWF0ZShtZXNzYWdlLmNvbW11bmljYXRvck1lc3NhZ2VJZCkuY2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBhY3Rpb25zIGZyb20gJ34vYWN0aW9ucy9iYXNlL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IHtjb2xvckludFRvSGV4fSBmcm9tICd+L3V0aWwvbW9kaWZpZXJzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVDb21tdW5pY2F0b3JOYXZpZ2F0aW9uTGFiZWxzKGNhbGxiYWNrKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3IudXNlckxhYmVscy5yZWFkKCkuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgbGFiZWxzKSB7XG4gICAgICAgIGlmIChlcnIpe1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfQ09NTVVOSUNBVE9SX05BVklHQVRJT05fTEFCRUxTJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IGxhYmVscy5tYXAoKGxhYmVsKT0+e1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcImxhYmVsLVwiICsgbGFiZWwuaWQsXG4gICAgICAgICAgICAgICAgaWQ6IGxhYmVsLmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGFiZWxcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcInRhZ1wiLFxuICAgICAgICAgICAgICAgIHRleHQoKXtyZXR1cm4gbGFiZWwubmFtZX0sXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9ySW50VG9IZXgobGFiZWwuY29sb3IpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBhZGRDb21tdW5pY2F0b3JMYWJlbChuYW1lKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIGxldCBjb2xvciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KTtcbiAgICAgIGxldCBsYWJlbCA9IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgY29sb3JcbiAgICAgIH07XG4gICAgICAgIFxuICAgICAgbUFwaSgpLmNvbW11bmljYXRvci51c2VyTGFiZWxzLmNyZWF0ZShsYWJlbCkuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgbGFiZWwpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwiQUREX0NPTU1VTklDQVRPUl9OQVZJR0FUSU9OX0xBQkVMXCIsXG4gICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgIGxvY2F0aW9uOiBcImxhYmVsLVwiICsgbGFiZWwuaWQsXG4gICAgICAgICAgICAgIGlkOiBsYWJlbC5pZCxcbiAgICAgICAgICAgICAgdHlwZTogXCJsYWJlbFwiLFxuICAgICAgICAgICAgICBpY29uOiBcInRhZ1wiLFxuICAgICAgICAgICAgICB0ZXh0KCl7cmV0dXJuIGxhYmVsLm5hbWV9LFxuICAgICAgICAgICAgICBjb2xvcjogY29sb3JJbnRUb0hleChsYWJlbC5jb2xvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGNvbW11bmljYXRvck5hdmlnYXRpb24gZnJvbSAnLi9jb21tdW5pY2F0b3ItbmF2aWdhdGlvbic7XG5pbXBvcnQgY29tbXVuaWNhdG9yTWVzc2FnZXMgZnJvbSAnLi9jb21tdW5pY2F0b3ItbWVzc2FnZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbW11bmljYXRvck5hdmlnYXRpb24sXG4gIGNvbW11bmljYXRvck1lc3NhZ2VzXG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGVIYXNoKGhhc2gpe1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcIlVQREFURV9IQVNIXCIsXG4gICAgICBwYXlsb2FkOiBoYXNoXG4gICAgfVxuICB9XG59IiwiaW1wb3J0IGFubm91bmNlbWVudHMgZnJvbSAnLi9hbm5vdW5jZW1lbnRzJztcbmltcG9ydCBtZXNzYWdlQ291bnQgZnJvbSAnLi9tZXNzYWdlLWNvdW50JztcbmltcG9ydCBsYXN0V29ya3NwYWNlIGZyb20gJy4vbGFzdC13b3Jrc3BhY2UnO1xuaW1wb3J0IHdvcmtzcGFjZXMgZnJvbSAnLi93b3Jrc3BhY2VzJztcbmltcG9ydCBsYXN0TWVzc2FnZXMgZnJvbSAnLi9sYXN0LW1lc3NhZ2VzJztcbmltcG9ydCBoYXNoIGZyb20gJy4vaGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYW5ub3VuY2VtZW50cyxcbiAgbWVzc2FnZUNvdW50LFxuICBsYXN0V29ya3NwYWNlLFxuICB3b3Jrc3BhY2VzLFxuICBsYXN0TWVzc2FnZXMsXG4gIGhhc2hcbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUxhc3RNZXNzYWdlcyhtYXhSZXN1bHRzKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIG1BcGkoKS5jb21tdW5pY2F0b3IuaXRlbXMucmVhZCh7XG4gICAgICAgICdmaXJzdFJlc3VsdCc6IDAsXG4gICAgICAgICdtYXhSZXN1bHRzJzogbWF4UmVzdWx0c1xuICAgICAgfSkuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihlcnIubWVzc2FnZSwgJ2Vycm9yJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfTEFTVF9NRVNTQUdFUycsXG4gICAgICAgICAgICBwYXlsb2FkOiBtZXNzYWdlc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZUxhc3RXb3Jrc3BhY2UoKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIG1BcGkoKS51c2VyLnByb3BlcnR5LnJlYWQoJ2xhc3Qtd29ya3NwYWNlJykuY2FsbGJhY2soZnVuY3Rpb24oZXJyLCBwcm9wZXJ0eSkge1xuICAgICAgICBpZiggZXJyICl7XG4gICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kaXNwbGF5Tm90aWZpY2F0aW9uKGVyci5tZXNzYWdlLCAnZXJyb3InKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogJ1VQREFURV9MQVNUX1dPUktTUEFDRScsXG4gICAgICAgICAgICBwYXlsb2FkOiBwcm9wZXJ0eS52YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uL2Jhc2Uvbm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlTWVzc2FnZUNvdW50KHZhbHVlKXtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwiVVBEQVRFX01FU1NBR0VfQ09VTlRcIixcbiAgICAgICAgcGF5bG9hZDogdmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpPT57XG4gICAgICBtQXBpKClcbiAgICAgICAgLmNvbW11bmljYXRvclxuICAgICAgICAucmVjZWl2ZWRpdGVtc2NvdW50XG4gICAgICAgIC5jYWNoZUNsZWFyKClcbiAgICAgICAgLnJlYWQoKVxuICAgICAgICAuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgcmVzdWx0PTApIHtcbiAgICAgICAgICBpZiggZXJyICl7XG4gICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICB0eXBlOiBcIlVQREFURV9NRVNTQUdFX0NPVU5UXCIsXG4gICAgICAgICAgICAgIHBheWxvYWQ6IHJlc3VsdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICcuLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZVdvcmtzcGFjZXMoKXtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSk9PntcbiAgICAgIGxldCB1c2VySWQgPSBnZXRTdGF0ZSgpLnN0YXR1cy51c2VySWQ7XG4gICAgICBtQXBpKCkud29ya3NwYWNlLndvcmtzcGFjZXNcbiAgICAgICAucmVhZCh7dXNlcklkfSlcbiAgICAgICAuY2FsbGJhY2soZnVuY3Rpb24gKGVyciwgd29ya3NwYWNlcz1bXSkge1xuICAgICAgICAgaWYoIGVyciApe1xuICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oZXJyLm1lc3NhZ2UsICdlcnJvcicpKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICB0eXBlOiBcIlVQREFURV9XT1JLU1BBQ0VTXCIsXG4gICAgICAgICAgICAgcGF5bG9hZDogd29ya3NwYWNlc1xuICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCBBcHAgZnJvbSAnLi9jb250YWluZXJzL2NvbW11bmljYXRvci5qc3gnO1xuaW1wb3J0IHJlZHVjZXIgZnJvbSAnLi9yZWR1Y2Vycy9jb21tdW5pY2F0b3InO1xuaW1wb3J0IHJ1bkFwcCBmcm9tICcuL2RlZmF1bHQuZGVidWcuanN4JztcbmltcG9ydCBXZWJzb2NrZXQgZnJvbSAnLi91dGlsL3dlYnNvY2tldCc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucy9tYWluLWZ1bmN0aW9uJztcbmltcG9ydCBjb21tdW5pY2F0b3JBY3Rpb25zIGZyb20gJy4vYWN0aW9ucy9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvcic7XG5cbnJ1bkFwcChyZWR1Y2VyLCBBcHAsIChzdG9yZSk9PntcbiAgbGV0IHdlYnNvY2tldCA9IG5ldyBXZWJzb2NrZXQoc3RvcmUsIHtcbiAgICBcIkNvbW11bmljYXRvcjpuZXdtZXNzYWdlcmVjZWl2ZWRcIjoge1xuICAgICAgYWN0aW9uczogW2FjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50XSxcbiAgICAgIGNhbGxiYWNrczogWygpPT5tQXBpKCkuY29tbXVuaWNhdG9yLmNhY2hlQ2xlYXJdXG4gICAgfSxcbiAgICBcIkNvbW11bmljYXRvcjptZXNzYWdlcmVhZFwiOiB7XG4gICAgICBhY3Rpb25zOiBbYWN0aW9ucy51cGRhdGVNZXNzYWdlQ291bnRdLFxuICAgICAgY2FsbGJhY2tzOiBbKCk9Pm1BcGkoKS5jb21tdW5pY2F0b3IuY2FjaGVDbGVhcl1cbiAgICB9LFxuICAgIFwiQ29tbXVuaWNhdG9yOnRocmVhZGRlbGV0ZWRcIjoge1xuICAgICAgYWN0aW9uczogW2FjdGlvbnMudXBkYXRlTWVzc2FnZUNvdW50XSxcbiAgICAgIGNhbGxiYWNrczogWygpPT5tQXBpKCkuY29tbXVuaWNhdG9yLmNhY2hlQ2xlYXJdXG4gICAgfVxuICB9KTtcbiAgbGV0IGN1cnJlbnRMb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCIjXCIsXCJcIikuc3BsaXQoXCIvXCIpO1xuICBcbiAgc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5tZXNzYWdlQ291bnQudXBkYXRlTWVzc2FnZUNvdW50KCkpO1xuICBzdG9yZS5kaXNwYXRjaChjb21tdW5pY2F0b3JBY3Rpb25zLmNvbW11bmljYXRvck5hdmlnYXRpb24udXBkYXRlQ29tbXVuaWNhdG9yTmF2aWdhdGlvbkxhYmVscygoKT0+e1xuICAgIGlmIChjdXJyZW50TG9jYXRpb25bMF0uaW5jbHVkZXMoXCJsYWJlbFwiKSl7XG4gICAgICBzdG9yZS5kaXNwYXRjaChjb21tdW5pY2F0b3JBY3Rpb25zLmNvbW11bmljYXRvck1lc3NhZ2VzLnVwZGF0ZUNvbW11bmljYXRvck1lc3NhZ2VzRm9yTG9jYXRpb24oY3VycmVudExvY2F0aW9uWzBdKSk7XG4gICAgfVxuICB9KSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsICgpPT57XG4gICAgbGV0IG5ld0xvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcIiNcIixcIlwiKS5zcGxpdChcIi9cIik7XG4gICAgc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5oYXNoLnVwZGF0ZUhhc2gobmV3TG9jYXRpb24pKTtcbiAgICBzdG9yZS5kaXNwYXRjaChjb21tdW5pY2F0b3JBY3Rpb25zLmNvbW11bmljYXRvck1lc3NhZ2VzLnVwZGF0ZUNvbW11bmljYXRvck1lc3NhZ2VzRm9yTG9jYXRpb24obmV3TG9jYXRpb25bMF0pKTtcbiAgfSwgZmFsc2UpO1xuICBpZiAoIXdpbmRvdy5sb2NhdGlvbi5oYXNoKXtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiI2luYm94XCI7XG4gIH0gZWxzZSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goYWN0aW9ucy5oYXNoLnVwZGF0ZUhhc2goY3VycmVudExvY2F0aW9uKSk7XG4gICAgaWYgKCFjdXJyZW50TG9jYXRpb25bMF0uaW5jbHVkZXMoXCJsYWJlbHNcIikpIHtcbiAgICAgIHN0b3JlLmRpc3BhdGNoKGNvbW11bmljYXRvckFjdGlvbnMuY29tbXVuaWNhdG9yTWVzc2FnZXMudXBkYXRlQ29tbXVuaWNhdG9yTWVzc2FnZXNGb3JMb2NhdGlvbihjdXJyZW50TG9jYXRpb25bMF0pKTtcbiAgICB9XG4gIH1cbn0pOyIsImltcG9ydCBOYXZiYXIgZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvbmF2YmFyLmpzeCc7XG5pbXBvcnQgTGluayBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIE1haW5GdW5jdGlvbk5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYWN0aXZlVHJhaWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudFxuICB9XG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gW3tcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJob21lXCIsXG4gICAgICB0cmFpbDogXCJpbmRleFwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ob21lLmhvbWUnLFxuICAgICAgaHJlZjogXCIvXCIsXG4gICAgICBpY29uOiBcImhvbWVcIixcbiAgICAgIGNvbmRpdGlvbjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJjb3Vyc2VwaWNrZXJcIixcbiAgICAgIHRyYWlsOiBcImNvdXJzZXBpY2tlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5jb3Vyc2VwaWNrZXIuY291cnNlcGlja2VyJyxcbiAgICAgIGhyZWY6IFwiL2NvdXJzZXBpY2tlclwiLFxuICAgICAgaWNvbjogXCJib29rc1wiLFxuICAgICAgY29uZGl0aW9uOiB0cnVlXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImNvbW11bmljYXRvclwiLFxuICAgICAgdHJhaWw6IFwiY29tbXVuaWNhdG9yXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmNvbW11bmljYXRvci5jb21tdW5pY2F0b3InLFxuICAgICAgaHJlZjogXCIvY29tbXVuaWNhdG9yXCIsXG4gICAgICBpY29uOiBcImVudmVsb3BlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluLFxuICAgICAgYmFkZ2U6IHRoaXMucHJvcHMubWVzc2FnZUNvdW50XG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcImRpc2N1c3Npb25cIixcbiAgICAgIHRyYWlsOiBcImRpc2N1c3Npb25cIixcbiAgICAgIHRleHQ6ICdwbHVnaW4uZm9ydW0uZm9ydW0nLFxuICAgICAgaHJlZjogXCIvZGlzY3Vzc2lvblwiLFxuICAgICAgaWNvbjogXCJidWJibGVcIixcbiAgICAgIGNvbmRpdGlvbjogdGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gJiYgdGhpcy5wcm9wcy5zdGF0dXMucGVybWlzc2lvbnMuRk9SVU1fQUNDRVNTRU5WSVJPTk1FTlRGT1JVTVxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJndWlkZXJcIixcbiAgICAgIHRyYWlsOiBcImd1aWRlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5ndWlkZXIuZ3VpZGVyJyxcbiAgICAgIGhyZWY6IFwiL2d1aWRlclwiLFxuICAgICAgaWNvbjogXCJtZW1iZXJzXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkdVSURFUl9WSUVXXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lU3VmZml4OiBcInJlY29yZHNcIixcbiAgICAgIHRyYWlsOiBcInJlY29yZHNcIixcbiAgICAgIHRleHQ6ICdwbHVnaW4ucmVjb3Jkcy5yZWNvcmRzJyxcbiAgICAgIGhyZWY6IFwiL3JlY29yZHNcIixcbiAgICAgIGljb246IFwicHJvZmlsZVwiLFxuICAgICAgY29uZGl0aW9uOiB0aGlzLnByb3BzLnN0YXR1cy5wZXJtaXNzaW9ucy5UUkFOU0NSSVBUX09GX1JFQ09SRFNfVklFV1xuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJldmFsdWF0aW9uXCIsXG4gICAgICB0cmFpbDogXCJldmFsdWF0aW9uXCIsXG4gICAgICB0ZXh0OiAncGx1Z2luLmV2YWx1YXRpb24uZXZhbHVhdGlvbicsXG4gICAgICBocmVmOiBcIi9ldmFsdWF0aW9uXCIsXG4gICAgICBpY29uOiBcImV2YWx1YXRlXCIsXG4gICAgICBjb25kaXRpb246IHRoaXMucHJvcHMuc3RhdHVzLnBlcm1pc3Npb25zLkVWQUxVQVRJT05fVklFV19JTkRFWFxuICAgIH0sIHtcbiAgICAgIGNsYXNzTmFtZVN1ZmZpeDogXCJhbm5vdW5jZXJcIixcbiAgICAgIHRyYWlsOiBcImFubm91bmNlclwiLFxuICAgICAgdGV4dDogJ3BsdWdpbi5hbm5vdW5jZXIuYW5ub3VuY2VyJyxcbiAgICAgIGhyZWY6IFwiL2Fubm91bmNlclwiLFxuICAgICAgaWNvbjogXCJhbm5vdW5jZXJcIixcbiAgICAgIGNvbmRpdGlvbjogdGhpcy5wcm9wcy5zdGF0dXMucGVybWlzc2lvbnMuQU5OT1VOQ0VSX1RPT0xcbiAgICB9XTtcbiAgICBcbiAgICByZXR1cm4gPE5hdmJhciBjbGFzc05hbWVFeHRlbnNpb249XCJtYWluLWZ1bmN0aW9uXCIgbmF2aWdhdGlvbj17dGhpcy5wcm9wcy5uYXZpZ2F0aW9ufSBuYXZiYXJJdGVtcz17aXRlbURhdGEubWFwKChpdGVtKT0+e1xuICAgICAgaWYgKCFpdGVtLmNvbmRpdGlvbil7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2xhc3NOYW1lU3VmZml4OiBpdGVtLmNsYXNzTmFtZVN1ZmZpeCxcbiAgICAgICAgaXRlbTogKDxMaW5rIGhyZWY9e2l0ZW0uaHJlZn0gY2xhc3NOYW1lPXtgbWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstaWNvbiBsaW5rLWZ1bGwgJHt0aGlzLnByb3BzLmFjdGl2ZVRyYWlsID09PSBpdGVtLnRyYWlsID8gJ2FjdGl2ZScgOiAnJ31gfVxuICAgICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9Lz5cbiAgICAgICAgICB7aXRlbS5iYWRnZSA/IDxzcGFuIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gaW5kaWNhdG9yXCI+eyhpdGVtLmJhZGdlID49IDEwMCA/IFwiOTkrXCIgOiBpdGVtLmJhZGdlKX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgPC9MaW5rPilcbiAgICAgIH1cbiAgICB9KX0gZGVmYXVsdE9wdGlvbnM9e1tdfSBtZW51SXRlbXM9e2l0ZW1EYXRhLm1hcCgoaXRlbSk9PntcbiAgICAgIGlmICghaXRlbS5jb25kaXRpb24pe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiA8TGluayBocmVmPXtpdGVtLmhyZWZ9IGNsYXNzTmFtZT17YG1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgJHt0aGlzLnByb3BzLmFjdGl2ZVRyYWlsID09PSBpdGVtLnRyYWlsID8gJ2FjdGl2ZScgOiAnJ31gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7aXRlbS5pY29ufWB9Lz5cbiAgICAgICAge2l0ZW0uYmFkZ2UgPyA8c3BhbiBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGluZGljYXRvclwiPnsoaXRlbS5iYWRnZSA+PSAxMDAgPyBcIjk5K1wiIDogaXRlbS5iYWRnZSl9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX1cbiAgICAgIDwvTGluaz5cbiAgICB9KX0vPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4bixcbiAgICBzdGF0dXM6IHN0YXRlLnN0YXR1cyxcbiAgICBtZXNzYWdlQ291bnQ6IHN0YXRlLm1lc3NhZ2VDb3VudFxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE1haW5GdW5jdGlvbk5hdmJhcik7XG4iLCJpbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmNsYXNzIE5vdGlmaWNhdGlvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcXVldWUtaXRlbXNcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5ub3RpZmljYXRpb25zLm1hcCgobm90aWZpY2F0aW9uKT0+e1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e25vdGlmaWNhdGlvbi5pZH0gY2xhc3NOYW1lPXtcIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtIG5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLVwiICsgbm90aWZpY2F0aW9uLnNldmVyaXR5fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57bm90aWZpY2F0aW9uLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1xdWV1ZS1pdGVtLWNsb3NlXCIgb25DbGljaz17dGhpcy5wcm9wcy5oaWRlTm90aWZpY2F0aW9uLmJpbmQodGhpcywgbm90aWZpY2F0aW9uKX0+PC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuICBcbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbm90aWZpY2F0aW9uczogc3RhdGUubm90aWZpY2F0aW9uc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTm90aWZpY2F0aW9ucyk7IiwiaW1wb3J0IE1haW5GdW5jdGlvbk5hdmJhciBmcm9tICd+L2NvbXBvbmVudHMvYmFzZS9tYWluLWZ1bmN0aW9uL25hdmJhci5qc3gnO1xuaW1wb3J0IEFwcGxpY2F0aW9uIGZyb20gJy4vYm9keS9hcHBsaWNhdGlvbi5qc3gnO1xuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9ib2R5L25hdmlnYXRpb24uanN4JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbXVuaWNhdG9yQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIGxldCBuYXZpZ2F0aW9uID0gPE5hdmlnYXRpb24vPlxuICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJlbWJiZWQgZW1iYmVkLWZ1bGxcIj5cbiAgICAgIDxNYWluRnVuY3Rpb25OYXZiYXIgYWN0aXZlVHJhaWw9XCJjb21tdW5pY2F0b3JcIiBuYXZpZ2F0aW9uPXtuYXZpZ2F0aW9ufS8+XG4gICAgICA8QXBwbGljYXRpb24gbmF2aWdhdGlvbj17bmF2aWdhdGlvbn0vPlxuICAgIDwvZGl2Pik7XG4gIH1cbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgQXBwbGljYXRpb25QYW5lbCBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9hcHBsaWNhdGlvbi1wYW5lbC5qc3gnO1xuaW1wb3J0IEhvdmVyQnV0dG9uIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2hvdmVyLWJ1dHRvbi5qc3gnO1xuXG5pbXBvcnQgVG9vbGJhciBmcm9tICcuL2FwcGxpY2F0aW9uL3Rvb2xiYXIuanN4JztcbmltcG9ydCBDb21tdW5pY2F0b3JNZXNzYWdlcyBmcm9tICcuL2FwcGxpY2F0aW9uL21lc3NhZ2VzLmpzeCc7XG5cbmNsYXNzIENvbW11bmljYXRvckFwcGxpY2F0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBuYXZpZ2F0aW9uOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgbGV0IHRpdGxlID0gPGgyIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IHRleHQtcGFuZWwtYXBwbGljYXRpb24tdGl0bGUgY29tbXVuaWNhdG9yLXRleHQtdGl0bGVcIj57dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uY29tbXVuaWNhdG9yLnBhZ2VUaXRsZScpfTwvaDI+XG4gICAgbGV0IGljb24gPSA8YSBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLXNldHRpbmdzXCI+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tc2V0dGluZ3NcIj48L3NwYW4+XG4gICAgPC9hPlxuICAgIGxldCBwcmltYXJ5T3B0aW9uID0gPGEgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGJ1dHRvbiBjb21tdW5pY2F0b3ItYnV0dG9uLW5ldy1tZXNzYWdlXCI+XG4gICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5jb21tdW5pY2F0b3IubmV3TWVzc2FnZScpfVxuICAgIDwvYT5cbiAgICBsZXQgdG9vbGJhciA9IDxUb29sYmFyLz5cbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZW1iYmVkIGVtYmJlZC1mdWxsXCI+XG4gICAgICA8QXBwbGljYXRpb25QYW5lbCBjbGFzc05hbWVFeHRlbnNpb249XCJjb21tdW5pY2F0b3JcIiB0b29sYmFyPXt0b29sYmFyfSB0aXRsZT17dGl0bGV9IGljb249e2ljb259IHByaW1hcnlPcHRpb249e3ByaW1hcnlPcHRpb259IG5hdmlnYXRpb249e3RoaXMucHJvcHMubmF2aWdhdGlvbn0+XG4gICAgICAgIDxDb21tdW5pY2F0b3JNZXNzYWdlcy8+XG4gICAgICA8L0FwcGxpY2F0aW9uUGFuZWw+XG4gICAgICA8SG92ZXJCdXR0b24gaWNvbj1cImVkaXRcIiBjbGFzc05hbWVTdWZmaXg9XCJuZXctbWVzc2FnZVwiIGNsYXNzTmFtZUV4dGVuc2lvbj1cImNvbW11bmljYXRvclwiLz5cbiAgICA8L2Rpdj4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKENvbW11bmljYXRvckFwcGxpY2F0aW9uKTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHtjb2xvckludFRvSGV4fSBmcm9tICd+L3V0aWwvbW9kaWZpZXJzJztcblxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL21haW4tZnVuY3Rpb24vY29tbXVuaWNhdG9yL2NvbW11bmljYXRvci1tZXNzYWdlcyc7XG5cbmNsYXNzIENvbW11bmljYXRvck1lc3NhZ2VzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLnRvdWNoTW9kZVRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuZmlyc3RXYXNKdXN0U2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdG91Y2hNb2RlOiBmYWxzZVxuICAgIH1cbiAgICBcbiAgICB0aGlzLnRvZ2dsZU1lc3NhZ2VTZWxlY3Rpb24gPSB0aGlzLnRvZ2dsZU1lc3NhZ2VTZWxlY3Rpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hTdGFydE1lc3NhZ2UgPSB0aGlzLm9uVG91Y2hTdGFydE1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmRNZXNzYWdlID0gdGhpcy5vblRvdWNoRW5kTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25TY3JvbGwgPSB0aGlzLm9uU2Nyb2xsLmJpbmQodGhpcyk7XG4gIH1cbiAgb25Ub3VjaFN0YXJ0TWVzc2FnZShtZXNzYWdlKXtcbiAgICBpZiAoIXRoaXMuc3RhdGUudG91Y2hNb2RlKXtcbiAgICAgIHRoaXMudG91Y2hNb2RlVGltZW91dCA9IHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgdGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgdG91Y2hNb2RlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSwgMzAwKTtcbiAgICB9XG4gIH1cbiAgb25Ub3VjaEVuZE1lc3NhZ2UobWVzc2FnZSl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudG91Y2hNb2RlVGltZW91dCk7XG4gICAgaWYgKHRoaXMuc3RhdGUudG91Y2hNb2RlICYmICF0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkKXtcbiAgICAgIGxldCBpc1NlbGVjdGVkID0gdGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uKG1lc3NhZ2UpO1xuICAgICAgaWYgKGlzU2VsZWN0ZWQgJiYgdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZElkcy5sZW5ndGggPT09IDEpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICB0b3VjaE1vZGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5maXJzdFdhc0p1c3RTZWxlY3RlZCl7XG4gICAgICB0aGlzLmZpcnN0V2FzSnVzdFNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHRvZ2dsZU1lc3NhZ2VTZWxlY3Rpb24obWVzc2FnZSl7XG4gICAgbGV0IGlzU2VsZWN0ZWQgPSB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkSWRzLmluY2x1ZGVzKG1lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkKTtcbiAgICBpZiAoaXNTZWxlY3RlZCl7XG4gICAgICB0aGlzLnByb3BzLnJlbW92ZUZyb21Db21tdW5pY2F0b3JTZWxlY3RlZE1lc3NhZ2VzKG1lc3NhZ2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMuYWRkVG9Db21tdW5pY2F0b3JTZWxlY3RlZE1lc3NhZ2VzKG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gaXNTZWxlY3RlZDtcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyl7XG4gICAgaWYgKG5leHRQcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zdGF0ZSA9PT0gXCJMT0FESU5HXCIpe1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHRvdWNoTW9kZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBjb21wb25lbnREaWRVcGRhdGUoKXtcbiAgICBpZiAodGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zdGF0ZSA9PT0gXCJSRUFEWVwiICYmIHRoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuaGFzTW9yZSl7XG4gICAgICBsZXQgbGlzdCA9IHRoaXMucmVmcy5saXN0O1xuICAgICAgbGV0IGRvZXNOb3RIYXZlU2Nyb2xsQmFyID0gbGlzdC5zY3JvbGxIZWlnaHQgPT09IGxpc3Qub2Zmc2V0SGVpZ2h0O1xuICAgICAgaWYgKGRvZXNOb3RIYXZlU2Nyb2xsQmFyKXtcbiAgICAgICAgdGhpcy5wcm9wcy5sb2FkTW9yZU1lc3NhZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIG9uU2Nyb2xsKGUpe1xuICAgIGlmICh0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnN0YXRlID09PSBcIlJFQURZXCIgJiYgdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5oYXNNb3JlKXtcbiAgICAgIGxldCBsaXN0ID0gdGhpcy5yZWZzLmxpc3Q7XG4gICAgICBsZXQgc2Nyb2xsQm90dG9tUmVtYWluaW5nID0gbGlzdC5zY3JvbGxIZWlnaHQgLSAobGlzdC5zY3JvbGxUb3AgKyBsaXN0Lm9mZnNldEhlaWdodClcbiAgICAgIGlmIChzY3JvbGxCb3R0b21SZW1haW5pbmcgPD0gMTAwKXtcbiAgICAgICAgdGhpcy5wcm9wcy5sb2FkTW9yZU1lc3NhZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJlbmRlcigpe1xuICAgIGlmICh0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnN0YXRlID09PSBcIkxPQURJTkdcIil7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuc3RhdGUgPT09IFwiRVJST1JcIil7XG4gICAgICAvL1RPRE86IHB1dCBhIHRyYW5zbGF0aW9uIGhlcmUgcGxlYXNlISB0aGlzIGhhcHBlbnMgd2hlbiBtZXNzYWdlcyBmYWlsIHRvIGxvYWQsIGEgbm90aWZpY2F0aW9uIHNob3dzIHdpdGggdGhlIGVycm9yXG4gICAgICAvL21lc3NhZ2UgYnV0IGhlcmUgd2UgZ290IHRvIHB1dCBzb21ldGhpbmdcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImVtcHR5XCI+PHNwYW4+e1wiRVJST1JcIn08L3NwYW4+PC9kaXY+XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLm1lc3NhZ2VzLmxlbmd0aCA9PT0gMCl7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJlbXB0eVwiPjxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoXCJwbHVnaW4uY29tbXVuaWNhdG9yLmVtcHR5LnRvcGljXCIpfTwvc3Bhbj48L2Rpdj5cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgY29tbXVuaWNhdG9yIGFwcGxpY2F0aW9uLWxpc3QgJHt0aGlzLnN0YXRlLnRvdWNoTW9kZSA/IFwiYXBwbGljYXRpb24tbGlzdC1zZWxlY3QtbW9kZVwiIDogXCJcIn1gfVxuICAgICByZWY9XCJsaXN0XCIgb25TY3JvbGw9e3RoaXMub25TY3JvbGx9PntcbiAgICAgIHRoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMubWVzc2FnZXMubWFwKChtZXNzYWdlLCBpbmRleCk9PntcbiAgICAgICAgbGV0IGlzU2VsZWN0ZWQgPSB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkSWRzLmluY2x1ZGVzKG1lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkKTtcbiAgICAgICAgcmV0dXJuIDxkaXYga2V5PXttZXNzYWdlLmNvbW11bmljYXRvck1lc3NhZ2VJZH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BhcHBsaWNhdGlvbi1saXN0LWl0ZW0gJHttZXNzYWdlLnVucmVhZE1lc3NhZ2VzSW5UaHJlYWQgPyBcImNvbW11bmljYXRvci1hcHBsaWNhdGlvbi1saXN0LWl0ZW0tdW5yZWFkXCIgOiBcIlwifSAke2lzU2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifWB9XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydE1lc3NhZ2UuYmluZCh0aGlzLCBtZXNzYWdlKX0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kTWVzc2FnZS5iaW5kKHRoaXMsIG1lc3NhZ2UpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLWxpc3QtaXRlbS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtpc1NlbGVjdGVkfSBvbkNoYW5nZT17dGhpcy50b2dnbGVNZXNzYWdlU2VsZWN0aW9uLmJpbmQodGhpcywgbWVzc2FnZSl9Lz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IGNvbW11bmljYXRvci10ZXh0LXVzZXJuYW1lXCI+XG4gICAgICAgICAgICAgIHttZXNzYWdlLnNlbmRlci5maXJzdE5hbWUgPyBtZXNzYWdlLnNlbmRlci5maXJzdE5hbWUgKyBcIiBcIiA6IFwiXCJ9e21lc3NhZ2Uuc2VuZGVyLmxhc3ROYW1lID8gbWVzc2FnZS5zZW5kZXIubGFzdE5hbWUgOiBcIlwifVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yLWFwcGxpY2F0aW9uLWxpc3QtaXRlbS1sYWJlbHNcIj57bWVzc2FnZS5sYWJlbHMubWFwKChsYWJlbCk9PntcbiAgICAgICAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IGNvbW11bmljYXRvci10ZXh0LXRhZ1wiIGtleT17bGFiZWwuaWR9PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi10YWdcIiBzdHlsZT17e2NvbG9yOiBjb2xvckludFRvSGV4KGxhYmVsLmxhYmVsQ29sb3IpfX0+PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtsYWJlbC5sYWJlbE5hbWV9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgIHttZXNzYWdlLm1lc3NhZ2VDb3VudEludGhyZWFkID8gPHNwYW4gY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIHRleHQgY29tbXVuaWNhdG9yLXRleHQtY291bnRlclwiPlxuICAgICAgICAgICAgICB7bWVzc2FnZS5tZXNzYWdlQ291bnRJbnRocmVhZH1cbiAgICAgICAgICAgIDwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIHRleHQgY29tbXVuaWNhdG9yLXRleHQtZGF0ZVwiPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRpbWUuZm9ybWF0KG1lc3NhZ2UudGhyZWFkTGF0ZXN0TWVzc2FnZURhdGUpfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tbGlzdC1pdGVtLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciB0ZXh0IGNvbW11bmljYXRvci10ZXh0LWJvZHlcIj57bWVzc2FnZS5jYXB0aW9ufTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICB9KVxuICAgIH17XG4gICAgICB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnN0YXRlID09PSBcIkxPQURJTkdfTU9SRVwiID8gXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tbGlzdC1pdGVtIGxvYWRlci1lbXB0eVwiLz5cbiAgICA6IG51bGx9PC9kaXY+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBjb21tdW5pY2F0b3JNZXNzYWdlczogc3RhdGUuY29tbXVuaWNhdG9yTWVzc2FnZXMsXG4gICAgaTE4bjogc3RhdGUuaTE4blxuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoQ29tbXVuaWNhdG9yTWVzc2FnZXMpOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvZHJvcGRvd24uanN4JztcbmltcG9ydCBMaW5rIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2xpbmsuanN4JztcbmltcG9ydCBjb21tdW5pY2F0b3JNZXNzYWdlc0FjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL21haW4tZnVuY3Rpb24vY29tbXVuaWNhdG9yL2NvbW11bmljYXRvci1tZXNzYWdlcyc7XG5pbXBvcnQgY29tbXVuaWNhdG9yTmF2aWdhdGlvbkFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL21haW4tZnVuY3Rpb24vY29tbXVuaWNhdG9yL2NvbW11bmljYXRvci1uYXZpZ2F0aW9uJztcbmltcG9ydCB7ZmlsdGVyTWF0Y2gsIGZpbHRlckhpZ2hsaWdodCwgaW50ZXJzZWN0LCBkaWZmZXJlbmNlfSBmcm9tICd+L3V0aWwvbW9kaWZpZXJzJztcblxuY2xhc3MgQ29tbXVuaWNhdG9yVG9vbGJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy51cGRhdGVMYWJlbEZpbHRlciA9IHRoaXMudXBkYXRlTGFiZWxGaWx0ZXIuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbGFiZWxGaWx0ZXI6IFwiXCJcbiAgICB9XG4gIH1cbiAgdXBkYXRlTGFiZWxGaWx0ZXIoZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bGFiZWxGaWx0ZXI6IGUudGFyZ2V0LnZhbHVlfSk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgbGV0IGN1cnJlbnRMb2NhdGlvbiA9IHRoaXMucHJvcHMuY29tbXVuaWNhdG9yTmF2aWdhdGlvbi5maW5kKChpdGVtKT0+e1xuICAgICAgcmV0dXJuIChpdGVtLmxvY2F0aW9uID09PSB0aGlzLnByb3BzLmhhc2hbMF0pO1xuICAgIH0pO1xuICAgIFxuICAgIGlmICghY3VycmVudExvY2F0aW9uKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5pbk1lc3NhZ2Upe1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yLW5hdmlnYXRpb25cIj5cbiAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGJ1dHRvbiBidXR0b24tcGlsbCBjb21tdW5pY2F0b3ItYnV0dG9uLXBpbGwtZ28tYmFjayBjb21tdW5pY2F0b3ItaW50ZXJhY3QtZ28tYmFja1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1nb2JhY2tcIj48L3NwYW4+XG4gICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIHRleHQgY29tbXVuaWNhdG9yLXRleHQtY3VycmVudC1mb2xkZXJcIj57dGhpcy5wcm9wcy5mb2xkZXJ9PC9MaW5rPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1kZWxldGUgY29tbXVuaWNhdG9yLXRvb2xiYXItaW50ZXJhY3QtZGVsZXRlXCI+XG4gICAgICAgICAgey8qIEZJWE1FIHRoaXMgaXMgbm90IHRoZSByaWdodCBpY29uLCB0aGVyZSBhcmUgbm8gdHJhc2ggYmluIGluIHRoZSBmaWxlICovfVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1mb3Jnb3RwYXNzd29yZFwiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1sYWJlbCBjb21tdW5pY2F0b3ItdG9vbGJhci1pbnRlcmFjdC1sYWJlbFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi10YWdcIj48L3NwYW4+XG4gICAgICAgIDwvTGluaz5cbiAgICAgICAgXG4gICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciBidXR0b24gYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLXRvZ2dsZS1yZWFkIGNvbW11bmljYXRvci10b29sYmFyLWludGVyYWN0LXRvZ2dsZS1yZWFkXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiB7P2N1cnJlbnRNZXNzYWdlSGFzVW5yZWFkTWVzc2FnZXN9aWNvbi1tZXNzYWdlLXJlYWR7OmVsc2V9aWNvbi1tZXNzYWdlLXVucmVhZHsvY3VycmVudE1lc3NhZ2VIYXNVbnJlYWRNZXNzYWdlc31cIj48L3NwYW4+XG4gICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGJ1dHRvbiBidXR0b24tcGlsbCBjb21tdW5pY2F0b3ItYnV0dG9uLXBpbGwtbmV4dC1wYWdlIGNvbW11bmljYXRvci10b29sYmFyLWludGVyYWN0LXRvZ2dsZS1uZXh0LXBhZ2VcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tYXJyb3ctcmlnaHRcIj48L3NwYW4+XG4gICAgICAgIDwvTGluaz5cbiAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGJ1dHRvbiBidXR0b24tcGlsbCBjb21tdW5pY2F0b3ItYnV0dG9uLXBpbGwtcHJldi1wYWdlIGNvbW11bmljYXRvci10b29sYmFyLWludGVyYWN0LXRvZ2dsZS1wcmV2LXBhZ2VcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgPC9kaXY+XG4gICAgfVxuICAgIFxuICAgIGxldCBhbGxJbkNvbW1vbiA9IFtdO1xuICAgIGxldCBvbmx5SW5Tb21lID0gW107XG4gICAgbGV0IGlzQXRMZWFzdE9uZVNlbGVjdGVkID0gdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZC5sZW5ndGggPj0gMTtcbiAgICBpZiAoaXNBdExlYXN0T25lU2VsZWN0ZWQpe1xuICAgICAgbGV0IHBhcnRpYWxJZHMgPSB0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkLm1hcCgobWVzc2FnZSk9PntyZXR1cm4gbWVzc2FnZS5sYWJlbHMubWFwKGw9PmwubGFiZWxJZCl9KTtcbiAgICAgIGFsbEluQ29tbW9uID0gaW50ZXJzZWN0KC4uLnBhcnRpYWxJZHMpO1xuICAgICAgb25seUluU29tZSA9IGRpZmZlcmVuY2UoLi4ucGFydGlhbElkcyk7XG4gICAgfVxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbW11bmljYXRvci1uYXZpZ2F0aW9uXCI+XG4gICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgdGV4dCBjb21tdW5pY2F0b3ItdGV4dC1jdXJyZW50LWZvbGRlclwiPntjdXJyZW50TG9jYXRpb24udGV4dCh0aGlzLnByb3BzLmkxOG4pfTwvTGluaz5cbiAgICAgICAgICAgICAgICBcbiAgICAgIDxMaW5rIGNsYXNzTmFtZT17YGNvbW11bmljYXRvciBidXR0b24gYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLWRlbGV0ZSAke3RoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuc2VsZWN0ZWQubGVuZ3RoID09IDAgPyBcImRpc2FibGVkXCIgOiBcIlwifWB9PlxuICAgICAgICB7LyogRklYTUUgdGhpcyBpcyBub3QgdGhlIHJpZ2h0IGljb24sIHRoZXJlIGFyZSBubyB0cmFzaCBiaW4gaW4gdGhlIGZpbGUgKi99XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1mb3Jnb3RwYXNzd29yZFwiPjwvc3Bhbj5cbiAgICAgIDwvTGluaz5cbiAgICBcbiAgICAgIDxEcm9wZG93biBjbGFzc05hbWVFeHRlbnNpb249XCJjb21tdW5pY2F0b3JcIiBjbGFzc05hbWVTdWZmaXg9XCJsYWJlbHNcIiBpdGVtcz17XG4gICAgICAgIFtcbiAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1maWVsZFwiIGlkPVwiY29tbXVuaWNhdG9yLXRvb2xiYXItbGFiZWxzLWRyb3Bkb3duLWlucHV0XCIgdmFsdWU9e3RoaXMuc3RhdGUubGFiZWxGaWx0ZXJ9IG9uQ2hhbmdlPXt0aGlzLnVwZGF0ZUxhYmVsRmlsdGVyfVxuICAgICAgICAgICAgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4uY29tbXVuaWNhdG9yLmxhYmVsLmNyZWF0ZS50ZXh0ZmllbGQucGxhY2Vob2xkZXInKX0gLz4sXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbXVuaWNhdG9yIGxpbmsgbGluay1mdWxsIGNvbW11bmljYXRvci1saW5rLW5ld1wiIG9uQ2xpY2s9e3RoaXMucHJvcHMuYWRkQ29tbXVuaWNhdG9yTGFiZWwuYmluZChudWxsLCB0aGlzLnN0YXRlLmxhYmVsRmlsdGVyKX0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KFwicGx1Z2luLmNvbW11bmljYXRvci5sYWJlbC5jcmVhdGVcIil9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICBdLmNvbmNhdCh0aGlzLnByb3BzLmNvbW11bmljYXRvck5hdmlnYXRpb24uZmlsdGVyKChpdGVtKT0+e1xuICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09IFwibGFiZWxcIiAmJiBmaWx0ZXJNYXRjaChpdGVtLnRleHQodGhpcy5wcm9wcy5pMThuKSwgdGhpcy5zdGF0ZS5sYWJlbEZpbHRlcik7XG4gICAgICAgIH0pLm1hcCgobGFiZWwpPT57XG4gICAgICAgICAgbGV0IGlzU2VsZWN0ZWQgPSBhbGxJbkNvbW1vbi5pbmNsdWRlcyhsYWJlbC5pZCk7XG4gICAgICAgICAgbGV0IGlzUGFydGlhbGx5U2VsZWN0ZWQgPSBvbmx5SW5Tb21lLmluY2x1ZGVzKGxhYmVsLmlkKTtcbiAgICAgICAgICByZXR1cm4gKDxMaW5rIGNsYXNzTmFtZT17YGNvbW11bmljYXRvciBsaW5rIGxpbmstZnVsbCBjb21tdW5pY2F0b3ItbGluay1sYWJlbCAke2lzU2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifSAke2lzUGFydGlhbGx5U2VsZWN0ZWQgPyBcInNlbWktc2VsZWN0ZWRcIiA6IFwiXCJ9ICR7aXNBdExlYXN0T25lU2VsZWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwifWB9XG4gICAgICAgICAgICBvbkNsaWNrPXshaXNTZWxlY3RlZCB8fCBpc1BhcnRpYWxseVNlbGVjdGVkID8gdGhpcy5wcm9wcy5hZGRMYWJlbFRvU2VsZWN0ZWRNZXNzYWdlcy5iaW5kKG51bGwsIGxhYmVsKSA6IHRoaXMucHJvcHMucmVtb3ZlTGFiZWxGcm9tU2VsZWN0ZWRNZXNzYWdlcy5iaW5kKG51bGwsIGxhYmVsKX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdGFnXCIgc3R5bGU9e3tjb2xvcjogbGFiZWwuY29sb3J9fT48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0XCI+e2ZpbHRlckhpZ2hsaWdodChsYWJlbC50ZXh0KHRoaXMucHJvcHMuaTE4biksIHRoaXMuc3RhdGUubGFiZWxGaWx0ZXIpfTwvc3Bhbj5cbiAgICAgICAgICA8L0xpbms+KTtcbiAgICAgICAgfSkpXG4gICAgICB9PlxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgYnV0dG9uIGJ1dHRvbi1waWxsIGNvbW11bmljYXRvci1idXR0b24tcGlsbC1sYWJlbFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi10YWdcIj48L3NwYW4+XG4gICAgICAgIDwvTGluaz5cbiAgICAgIDwvRHJvcGRvd24+XG4gICAgICBcbiAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImNvbW11bmljYXRvciBidXR0b24gYnV0dG9uLXBpbGwgY29tbXVuaWNhdG9yLWJ1dHRvbi1waWxsLXRvZ2dsZS1yZWFkXCJcbiAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuc2VsZWN0ZWQubGVuZ3RoICE9PSAxfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnRvb2xiYXJMb2NrID8gbnVsbCA6IHRoaXMucHJvcHMudG9nZ2xlTWVzc2FnZXNSZWFkU3RhdHVzLmJpbmQobnVsbCwgdGhpcy5wcm9wcy5jb21tdW5pY2F0b3JNZXNzYWdlcy5zZWxlY3RlZFswXSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tbWVzc2FnZS0ke3RoaXMucHJvcHMuY29tbXVuaWNhdG9yTWVzc2FnZXMuc2VsZWN0ZWQubGVuZ3RoID09PSAxICYmICF0aGlzLnByb3BzLmNvbW11bmljYXRvck1lc3NhZ2VzLnNlbGVjdGVkWzBdLnVucmVhZE1lc3NhZ2VzSW5UaHJlYWQgPyBcInVuXCIgOiBcIlwifXJlYWRgfT48L3NwYW4+XG4gICAgICA8L0xpbms+XG4gICAgPC9kaXY+XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKXtcbiAgcmV0dXJuIHtcbiAgICBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uOiBzdGF0ZS5jb21tdW5pY2F0b3JOYXZpZ2F0aW9uLFxuICAgIGNvbW11bmljYXRvck1lc3NhZ2VzOiBzdGF0ZS5jb21tdW5pY2F0b3JNZXNzYWdlcyxcbiAgICBoYXNoOiBzdGF0ZS5oYXNoLFxuICAgIGkxOG46IHN0YXRlLmkxOG5cbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKE9iamVjdC5hc3NpZ24oe30sIGNvbW11bmljYXRvck1lc3NhZ2VzQWN0aW9ucywgY29tbXVuaWNhdG9yTmF2aWdhdGlvbkFjdGlvbnMpLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShDb21tdW5pY2F0b3JUb29sYmFyKTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgTGluayBmcm9tICd+L2NvbXBvbmVudHMvZ2VuZXJhbC9saW5rLmpzeCc7XG5cbmNsYXNzIE5hdmlnYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb21tdW5pY2F0b3IgaXRlbS1saXN0IGNvbW11bmljYXRvci1pdGVtLWxpc3QtbmF2aWdhdGlvblwiPlxuICAgICAge3RoaXMucHJvcHMuY29tbXVuaWNhdG9yTmF2aWdhdGlvbi5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICBsZXQgc3R5bGUgPSB7fTtcbiAgICAgICAgaWYgKGl0ZW0uY29sb3Ipe1xuICAgICAgICAgIHN0eWxlLmNvbG9yID0gaXRlbS5jb2xvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gPExpbmsga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtgaXRlbS1saXN0LWl0ZW0gJHt0aGlzLnByb3BzLmhhc2hbMF0gPT09IGl0ZW0ubG9jYXRpb24gPyBcImFjdGl2ZVwiIDogXCJcIn1gfSBocmVmPXtgIyR7aXRlbS5sb2NhdGlvbn1gfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0gc3R5bGU9e3N0eWxlfT48L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaXRlbS1saXN0LXRleHQtYm9keSB0ZXh0XCI+XG4gICAgICAgICAgICB7aXRlbS50ZXh0KHRoaXMucHJvcHMuaTE4bil9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L0xpbms+XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGxhYmVsczogc3RhdGUubGFiZWxzLFxuICAgIGhhc2g6IHN0YXRlLmhhc2gsXG4gICAgaTE4bjogc3RhdGUuaTE4bixcbiAgICBjb21tdW5pY2F0b3JOYXZpZ2F0aW9uOiBzdGF0ZS5jb21tdW5pY2F0b3JOYXZpZ2F0aW9uXG4gIH1cbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCk9PntcbiAgcmV0dXJuIHt9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTmF2aWdhdGlvbik7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcGxpY2F0aW9uUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZUV4dGVuc2lvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRpdGxlOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGljb246IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgcHJpbWFyeU9wdGlvbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICB0b29sYmFyOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIG5hdmlnYXRpb246IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWRcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYXBwbGljYXRpb24tcGFuZWxgfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtbmF2aWdhdGlvblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtbGVmdC1jb250YWluZXJcIj57dGhpcy5wcm9wcy50aXRsZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLXJpZ2h0LWNvbnRhaW5lclwiPnt0aGlzLnByb3BzLmljb259PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLWJveFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtbmF2aWdhdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBsaWNhdGlvbi1wYW5lbC1sZWZ0LWNvbnRhaW5lclwiPnt0aGlzLnByb3BzLnByaW1hcnlPcHRpb259PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLXJpZ2h0LWNvbnRhaW5lclwiPnt0aGlzLnByb3BzLnRvb2xiYXJ9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBsaWNhdGlvbi1wYW5lbC1ib2R5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcGxpY2F0aW9uLXBhbmVsLWxlZnQtY29udGFpbmVyXCI+e3RoaXMucHJvcHMubmF2aWdhdGlvbn08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwbGljYXRpb24tcGFuZWwtcmlnaHQtY29udGFpbmVyIGxvYWRlci1lbXB0eVwiPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2Pik7XG4gIH1cbn1cblxuIiwiaW1wb3J0IFBvcnRhbCBmcm9tICcuL3BvcnRhbC5qc3gnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2ZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcm9wZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pKS5pc1JlcXVpcmVkXG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9uT3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iZWZvcmVDbG9zZSA9IHRoaXMuYmVmb3JlQ2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB0b3A6IG51bGwsXG4gICAgICBsZWZ0OiBudWxsLFxuICAgICAgYXJyb3dMZWZ0OiBudWxsLFxuICAgICAgYXJyb3dSaWdodDogbnVsbCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfVxuICB9XG4gIG9uT3BlbihET01Ob2RlKXtcbiAgICBsZXQgYWN0aXZhdG9yID0gdGhpcy5yZWZzLmFjdGl2YXRvcjtcbiAgICBpZiAoIShhY3RpdmF0b3IgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpe1xuICAgICAgYWN0aXZhdG9yID0gZmluZERPTU5vZGUoYWN0aXZhdG9yKTtcbiAgICB9XG4gICAgXG4gICAgbGV0ICR0YXJnZXQgPSAkKGFjdGl2YXRvcik7XG4gICAgbGV0ICRhcnJvdyA9ICQodGhpcy5yZWZzLmFycm93KTtcbiAgICBsZXQgJGRyb3Bkb3duID0gJCh0aGlzLnJlZnMuZHJvcGRvd24pO1xuICAgICAgXG4gICAgbGV0IHBvc2l0aW9uID0gJHRhcmdldC5vZmZzZXQoKTtcbiAgICBsZXQgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICBsZXQgbW9yZVNwYWNlSW5UaGVMZWZ0U2lkZSA9ICh3aW5kb3dXaWR0aCAtIHBvc2l0aW9uLmxlZnQpIDwgcG9zaXRpb24ubGVmdDtcbiAgICBcbiAgICBsZXQgbGVmdCA9IG51bGw7XG4gICAgaWYgKG1vcmVTcGFjZUluVGhlTGVmdFNpZGUpe1xuICAgICAgbGVmdCA9IHBvc2l0aW9uLmxlZnQgLSAkZHJvcGRvd24ub3V0ZXJXaWR0aCgpICsgJHRhcmdldC5vdXRlcldpZHRoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnQgPSBwb3NpdGlvbi5sZWZ0O1xuICAgIH1cbiAgICBsZXQgdG9wID0gcG9zaXRpb24udG9wICsgJHRhcmdldC5vdXRlckhlaWdodCgpICsgNTtcbiAgICBcbiAgICBsZXQgYXJyb3dMZWZ0ID0gbnVsbDtcbiAgICBsZXQgYXJyb3dSaWdodCA9IG51bGw7XG4gICAgaWYgKG1vcmVTcGFjZUluVGhlTGVmdFNpZGUpe1xuICAgICAgYXJyb3dSaWdodCA9ICgkdGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDIpICsgKCRhcnJvdy53aWR0aCgpLzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJvd0xlZnQgPSAoJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyKSArICgkYXJyb3cud2lkdGgoKS8yKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7dG9wLCBsZWZ0LCBhcnJvd0xlZnQsIGFycm93UmlnaHQsIHZpc2libGU6IHRydWV9KTtcbiAgfVxuICBiZWZvcmVDbG9zZShET01Ob2RlLCByZW1vdmVGcm9tRE9NKXtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChyZW1vdmVGcm9tRE9NLCAzMDApO1xuICB9XG4gIGNsb3NlKCl7XG4gICAgdGhpcy5yZWZzLnBvcnRhbC5jbG9zZVBvcnRhbCgpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8UG9ydGFsIHJlZj1cInBvcnRhbFwiIG9wZW5CeUNsaWNrT249e1JlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLmNoaWxkcmVuLCB7IHJlZjogXCJhY3RpdmF0b3JcIiB9KX1cbiAgICAgIGNsb3NlT25Fc2MgY2xvc2VPbk91dHNpZGVDbGljayBjbG9zZU9uU2Nyb2xsIG9uT3Blbj17dGhpcy5vbk9wZW59IGJlZm9yZUNsb3NlPXt0aGlzLmJlZm9yZUNsb3NlfT5cbiAgICAgIDxkaXYgcmVmPVwiZHJvcGRvd25cIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS50b3AsXG4gICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5sZWZ0XG4gICAgICAgIH19XG4gICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGRyb3Bkb3duICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWRyb3Bkb3duLSR7dGhpcy5wcm9wcy5jbGFzc05hbWVTdWZmaXh9ICR7dGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlXCIgOiBcIlwifWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhcnJvd1wiIHJlZj1cImFycm93XCIgc3R5bGU9e3tsZWZ0OiB0aGlzLnN0YXRlLmFycm93TGVmdCwgcmlnaHQ6IHRoaXMuc3RhdGUuYXJyb3dSaWdodH19Pjwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0eXBlb2YgaXRlbSA9PT0gXCJmdW5jdGlvblwiID8gaXRlbSh0aGlzLmNsb3NlKSA6IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICB7ZWxlbWVudH1cbiAgICAgICAgICAgIDwvZGl2Pik7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9Qb3J0YWw+XG4gIH1cbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMaW5rIGZyb20gJy4vbGluay5qc3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3ZlckJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lU3VmZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgaWNvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGhyZWY6IFByb3BUeXBlcy5zdHJpbmdcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKDxMaW5rIGhyZWY9e3RoaXMucHJvcHMuaHJlZn0gb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrfVxuICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGJ1dHRvbi1waWxsIGJ1dHRvbi1waWxsLWZsb2F0aW5nICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWJ1dHRvbi1waWxsLSR7dGhpcy5wcm9wcy5jbGFzc05hbWVTdWZmaXh9YH0+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHt0aGlzLnByb3BzLmljb259YH0+PC9zcGFuPlxuICAgIDwvTGluaz4pO1xuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIHNjcm9sbFRvU2VjdGlvbihhbmNob3IpIHtcbiAgaWYgKCEkKGFuY2hvcikuc2l6ZSgpKXtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFuY2hvcjtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGxldCB0b3BPZmZzZXQgPSA5MDtcbiAgbGV0IHNjcm9sbFRvcCA9ICQoYW5jaG9yKS5vZmZzZXQoKS50b3AgLSB0b3BPZmZzZXQ7XG5cbiAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICBzY3JvbGxUb3AgOiBzY3JvbGxUb3BcbiAgfSwge1xuICAgIGR1cmF0aW9uIDogNTAwLFxuICAgIGVhc2luZyA6IFwiZWFzZUluT3V0UXVhZFwiXG4gIH0pO1xuICBcbiAgc2V0VGltZW91dCgoKT0+e1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYW5jaG9yO1xuICB9LCA1MDApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICB0aGlzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgb25DbGljayhlLCByZSl7XG4gICAgaWYgKHRoaXMucHJvcHMuaHJlZiAmJiB0aGlzLnByb3BzLmhyZWZbMF0gPT09ICcjJyl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzY3JvbGxUb1NlY3Rpb24odGhpcy5wcm9wcy5ocmVmKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMub25DbGljayl7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2soZSwgcmUpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSwgcmUpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uVG91Y2hTdGFydCl7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hTdGFydChlLCByZSk7XG4gICAgfVxuICB9XG4gIG9uVG91Y2hFbmQoZSwgcmUpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogZmFsc2V9KTtcbiAgICB0aGlzLm9uQ2xpY2soZSwgcmUpO1xuICAgIGlmICh0aGlzLnByb3BzLm9uVG91Y2hFbmQpe1xuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoRW5kKGUsIHJlKTtcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIDxhIHsuLi50aGlzLnByb3BzfVxuICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZSArICh0aGlzLnN0YXRlLmFjdGl2ZSA/IFwiIGFjdGl2ZVwiIDogXCJcIil9XG4gICAgICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9IG9uVG91Y2hFbmQ9e3RoaXMub25Ub3VjaEVuZH0vPlxuICB9XG59IiwiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMYW5ndWFnZVBpY2tlciBmcm9tICcuL25hdmJhci9sYW5ndWFnZS1waWNrZXIuanN4JztcbmltcG9ydCBQcm9maWxlSXRlbSBmcm9tICcuL25hdmJhci9wcm9maWxlLWl0ZW0uanN4JztcbmltcG9ydCBNZW51IGZyb20gJy4vbmF2YmFyL21lbnUuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vcGVuTWVudSA9IHRoaXMub3Blbk1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlTWVudSA9IHRoaXMuY2xvc2VNZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzTWVudU9wZW46IGZhbHNlXG4gICAgfVxuICB9XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbmF2YmFySXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjbGFzc05hbWVTdWZmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBpdGVtOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG4gICAgfSkpLmlzUmVxdWlyZWQsXG4gICAgbWVudUl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuZWxlbWVudCkuaXNSZXF1aXJlZCxcbiAgICBkZWZhdWx0T3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgbmF2aWdhdGlvbjogUHJvcFR5cGVzLmVsZW1lbnRcbiAgfVxuICBvcGVuTWVudSgpe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNNZW51T3BlbjogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGNsb3NlTWVudSgpe1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNNZW51T3BlbjogZmFsc2VcbiAgICB9KTtcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9e2BuYXZiYXIgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn1gfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItaXRlbXMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17YG5hdmJhci1pdGVtICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LW5hdmJhci1pdGVtLW1lbnUtYnV0dG9uYH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstaWNvbiBsaW5rLWZ1bGxgfSBvbkNsaWNrPXt0aGlzLm9wZW5NZW51fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLW5hdmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5uYXZiYXJJdGVtcy5tYXAoKGl0ZW0sIGluZGV4KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSBrZXk9e2luZGV4fSBjbGFzc05hbWU9e2BuYXZiYXItaXRlbSAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1uYXZiYXItaXRlbS0ke2l0ZW0uY2xhc3NOYW1lU3VmZml4fWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5pdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pLmZpbHRlcihpdGVtPT4hIWl0ZW0pfVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kZWZhdWx0LW9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZGVmYXVsdC1vcHRpb25zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmRlZmF1bHRPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgICAgIDxQcm9maWxlSXRlbSBjbGFzc05hbWVFeHRlbnNpb249e3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS8+XG4gICAgICAgICAgICAgICAgICAgICAgPExhbmd1YWdlUGlja2VyIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgICAgICA8TWVudSBvcGVuPXt0aGlzLnN0YXRlLmlzTWVudU9wZW59IG9uQ2xvc2U9e3RoaXMuY2xvc2VNZW51fVxuICAgICAgICAgICAgICAgIGl0ZW1zPXt0aGlzLnByb3BzLm1lbnVJdGVtc30gY2xhc3NOYW1lRXh0ZW5zaW9uPXt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gbmF2aWdhdGlvbj17dGhpcy5wcm9wcy5uYXZpZ2F0aW9ufS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gIH1cbn0iLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGFjdGlvbnMgZnJvbSAnfi9hY3Rpb25zL2Jhc2UvbG9jYWxlcyc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvZHJvcGRvd24uanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmNsYXNzIExhbmd1YWdlUGlja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cImxhbmd1YWdlLXBpY2tlclwiIGl0ZW1zPXt0aGlzLnByb3BzLmxvY2FsZXMuYXZhbGlhYmxlLm1hcCgobG9jYWxlKT0+e1xuICAgICAgcmV0dXJuICg8YSBjbGFzc05hbWU9e2Ake3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufSBsaW5rIGxpbmstZnVsbCAke3RoaXMucHJvcHMuY2xhc3NOYW1lRXh0ZW5zaW9ufS1saW5rLWxhbmd1YWdlLXBpY2tlcmB9IG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0TG9jYWxlLmJpbmQodGhpcywgbG9jYWxlLmxvY2FsZSl9PlxuICAgICAgICA8c3Bhbj57bG9jYWxlLm5hbWV9PC9zcGFuPlxuICAgICAgPC9hPik7XG4gICAgfSl9PlxuICAgICAgPGEgY2xhc3NOYW1lPXtgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0gYnV0dG9uLXBpbGwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZUV4dGVuc2lvbn0tYnV0dG9uLXBpbGwtbGFuZ3VhZ2VgfT5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMubG9jYWxlcy5jdXJyZW50fTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L0Ryb3Bkb3duPlxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSl7XG4gIHJldHVybiB7XG4gICAgbG9jYWxlczogc3RhdGUubG9jYWxlc1xuICB9XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpPT57XG4gIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTGFuZ3VhZ2VQaWNrZXIpOyIsImltcG9ydCBMaW5rIGZyb20gJy4uL2xpbmsuanN4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgYWN0aW9ucyBmcm9tICd+L2FjdGlvbnMvYmFzZS9zdGF0dXMnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuXG5mdW5jdGlvbiBjaGVja0xpbmtDbGlja2VkKHRhcmdldCl7XG4gIHJldHVybiB0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIgfHwgKHRhcmdldC5wYXJlbnRFbGVtZW50ID8gY2hlY2tMaW5rQ2xpY2tlZCh0YXJnZXQucGFyZW50RWxlbWVudCkgOiBmYWxzZSk7XG59XG5cbmNsYXNzIE1lbnUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmVsZW1lbnQpLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lRXh0ZW5zaW9uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbmF2aWdhdGlvbjogUHJvcFR5cGVzLmVsZW1lbnRcbiAgfVxuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub3BlbiA9IHRoaXMub3Blbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZUJ5T3ZlcmxheSA9IHRoaXMuY2xvc2VCeU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlzcGxheWVkOiBwcm9wcy5vcGVuLFxuICAgICAgdmlzaWJsZTogcHJvcHMub3BlbixcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWc6IG51bGwsXG4gICAgICBvcGVuOiBwcm9wcy5vcGVuXG4gICAgfVxuICB9XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKXtcbiAgICBpZiAobmV4dFByb3BzLm9wZW4gJiYgIXRoaXMuc3RhdGUub3Blbil7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMub3BlbiAmJiB0aGlzLnN0YXRlLm9wZW4pe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBvblRvdWNoU3RhcnQoZSl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7J2RyYWdnaW5nJzogdHJ1ZX0pO1xuICAgIHRoaXMudG91Y2hDb3JkWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCA9IDA7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIG9uVG91Y2hNb3ZlKGUpe1xuICAgIGxldCBkaWZmWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoQ29yZFg7XG4gICAgbGV0IGFic29sdXRlRGlmZmVyZW5jZVggPSBNYXRoLmFicyhkaWZmWCAtIHRoaXMuc3RhdGUuZHJhZyk7XG4gICAgdGhpcy50b3VjaE1vdmVtZW50WCArPSBhYnNvbHV0ZURpZmZlcmVuY2VYO1xuXG4gICAgaWYgKGRpZmZYID4gMCkge1xuICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnOiBkaWZmWH0pO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuICBvblRvdWNoRW5kKGUpe1xuICAgIGxldCB3aWR0aCA9ICQodGhpcy5yZWZzLm1lbnVDb250YWluZXIpLndpZHRoKCk7XG4gICAgbGV0IGRpZmYgPSB0aGlzLnN0YXRlLmRyYWc7XG4gICAgbGV0IG1vdmVtZW50ID0gdGhpcy50b3VjaE1vdmVtZW50WDtcbiAgICBcbiAgICBsZXQgbWVudUhhc1NsaWRlZEVub3VnaEZvckNsb3NpbmcgPSBNYXRoLmFicyhkaWZmKSA+PSB3aWR0aCowLjMzO1xuICAgIGxldCB5b3VKdXN0Q2xpY2tlZFRoZU92ZXJsYXkgPSBlLnRhcmdldCA9PT0gdGhpcy5yZWZzLm1lbnUgJiYgbW92ZW1lbnQgPD0gNTtcbiAgICBsZXQgeW91SnVzdENsaWNrZWRBTGluayA9IGNoZWNrTGlua0NsaWNrZWQoZS50YXJnZXQpICYmIG1vdmVtZW50IDw9IDU7XG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ2dpbmc6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZzogbnVsbH0pO1xuICAgICAgaWYgKG1lbnVIYXNTbGlkZWRFbm91Z2hGb3JDbG9zaW5nIHx8IHlvdUp1c3RDbGlja2VkVGhlT3ZlcmxheSB8fCB5b3VKdXN0Q2xpY2tlZEFMaW5rKXtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sIDEwKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgb3Blbigpe1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rpc3BsYXllZDogdHJ1ZSwgb3BlbjogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IHRydWV9KTtcbiAgICB9LCAxMCk7XG4gICAgJChkb2N1bWVudC5ib2R5KS5jc3MoeydvdmVyZmxvdyc6ICdoaWRkZW4nfSk7XG4gIH1cbiAgY2xvc2VCeU92ZXJsYXkoZSl7XG4gICAgbGV0IGlzT3ZlcmxheSA9IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGlzTGluayA9IGNoZWNrTGlua0NsaWNrZWQoZS50YXJnZXQpO1xuICAgIGlmICghdGhpcy5zdGF0ZS5kcmFnZ2luZyAmJiAoaXNPdmVybGF5IHx8IGlzTGluaykpe1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBjbG9zZSgpe1xuICAgICQoZG9jdW1lbnQuYm9keSkuY3NzKHsnb3ZlcmZsb3cnOiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Zpc2libGU6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlzcGxheWVkOiBmYWxzZSwgb3BlbjogZmFsc2V9KTtcbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH0sIDMwMCk7XG4gIH1cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IG1lbnUgJHt0aGlzLnN0YXRlLmRpc3BsYXllZCA/IFwiZGlzcGxheWVkXCIgOiBcIlwifSAke3RoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZVwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLmRyYWdnaW5nID8gXCJkcmFnZ2luZ1wiIDogXCJcIn1gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNsb3NlQnlPdmVybGF5fSBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fSBvblRvdWNoTW92ZT17dGhpcy5vblRvdWNoTW92ZX0gb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfSByZWY9XCJtZW51XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWNvbnRhaW5lclwiIHJlZj1cIm1lbnVDb250YWluZXJcIiBzdHlsZT17e2xlZnQ6IHRoaXMuc3RhdGUuZHJhZ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudS1sb2dvXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtZW51LWhlYWRlci1idXR0b24tY2xvc2UgaWNvbiBpY29uLWFycm93LWxlZnRcIj48L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5hdmlnYXRpb24gPyA8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtZXh0cmFzXCI+e3RoaXMucHJvcHMubmF2aWdhdGlvbn08L2Rpdj4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm1lbnUtaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtLCBpbmRleCk9PntcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIga2V5PXtpbmRleH0+e2l0ZW19PC9saT5cbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW0gbWVudS1pdGVtLXNwYWNlXCI+PC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zdGF0dXMubG9nZ2VkSW4gPyA8bGkgY2xhc3NOYW1lPVwibWVudS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibWFpbi1mdW5jdGlvbiBsaW5rIGxpbmstZnVsbCBtYWluLWZ1bmN0aW9uLWxpbmstbWVudSBtYWluLWZ1bmN0aW9uLWxpbmstbWVudS1wcm9maWxlXCIgaHJlZj1cIi9wcm9maWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b2JqZWN0IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtcHJvZmlsZS1pbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE9e2AvcmVzdC91c2VyL2ZpbGVzL3VzZXIvJHt0aGlzLnByb3BzLnN0YXR1cy51c2VySWR9L2lkZW50aWZpZXIvcHJvZmlsZS1pbWFnZS05NmB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJpbWFnZS9qcGVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi11c2VyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9vYmplY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnRleHQuZ2V0KCdwbHVnaW4ucHJvZmlsZS5wcm9maWxlJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51IG1haW4tZnVuY3Rpb24tbGluay1tZW51LWluc3RydWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWZvcmdvdHBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmZvb3Rlci5pbnN0cnVjdGlvbnMnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluID8gPGxpIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm1haW4tZnVuY3Rpb24gbGluayBsaW5rLWZ1bGwgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUgbWFpbi1mdW5jdGlvbi1saW5rLW1lbnUtaGVscGRlc2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1oZWxwZGVza1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoJ3BsdWdpbi5ob21lLmhlbHBkZXNrJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXR1cy5sb2dnZWRJbiA/IDxsaSBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGxpbmsgbGluay1mdWxsIG1haW4tZnVuY3Rpb24tbGluay1tZW51IG1haW4tZnVuY3Rpb24tbGluay1tZW51LWxvZ291dFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMubG9nb3V0fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1zaWdub3V0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi50ZXh0LmdldCgncGx1Z2luLmxvZ291dC5sb2dvdXQnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKE1lbnUpO1xuICBcbiIsImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnfi9jb21wb25lbnRzL2dlbmVyYWwvZHJvcGRvd24uanN4JztcbmltcG9ydCBMaW5rIGZyb20gJ34vY29tcG9uZW50cy9nZW5lcmFsL2xpbmsuanN4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5cbmltcG9ydCBhY3Rpb25zIGZyb20gJ34vYWN0aW9ucy9iYXNlL3N0YXR1cyc7XG5cbmNsYXNzIFByb2ZpbGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWVFeHRlbnNpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuICByZW5kZXIoKXtcbiAgICBpZiAoIXRoaXMucHJvcHMuc3RhdHVzLmxvZ2dlZEluKXtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJ1c2VyXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4ucHJvZmlsZS5saW5rcy5wZXJzb25hbCcsXG4gICAgICAgIGhyZWY6IFwiL3Byb2ZpbGVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJmb3Jnb3RwYXNzd29yZFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmZvb3Rlci5pbnN0cnVjdGlvbnMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiBcImhlbHBkZXNrXCIsXG4gICAgICAgIHRleHQ6ICdwbHVnaW4uaG9tZS5oZWxwZGVzaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwic2lnbm91dFwiLFxuICAgICAgICB0ZXh0OiAncGx1Z2luLmxvZ291dC5sb2dvdXQnLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLmxvZ291dFxuICAgICAgfVxuICAgIF1cbiAgICByZXR1cm4gPERyb3Bkb3duIGNsYXNzTmFtZUV4dGVuc2lvbj17dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGNsYXNzTmFtZVN1ZmZpeD1cInByb2ZpbGUtbWVudVwiIGl0ZW1zPXtpdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgIHJldHVybiAoY2xvc2VEcm9wZG93bik9PntyZXR1cm4gPExpbmsgaHJlZj1cIi9wcm9maWxlXCJcbiAgICAgICAgIGNsYXNzTmFtZT17YCR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259IGxpbmsgbGluay1mdWxsICR7dGhpcy5wcm9wcy5jbGFzc05hbWVFeHRlbnNpb259LWxpbmstcHJvZmlsZS1tZW51YH1cbiAgICAgICAgIG9uQ2xpY2s9eyguLi5hcmdzKT0+e2Nsb3NlRHJvcGRvd24oKTtpdGVtLm9uQ2xpY2sgJiYgaXRlbS5vbkNsaWNrKC4uLmFyZ3MpfX0gaHJlZj17aXRlbS5ocmVmfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtpdGVtLmljb259YH0+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmkxOG4udGV4dC5nZXQoaXRlbS50ZXh0KX08L3NwYW4+XG4gICAgICAgIDwvTGluaz59XG4gICAgICB9KX0+XG4gICAgICA8YSBjbGFzc05hbWU9XCJtYWluLWZ1bmN0aW9uIGJ1dHRvbi1waWxsIG1haW4tZnVuY3Rpb24tYnV0dG9uLXBpbGwtcHJvZmlsZVwiPlxuICAgICAgICA8b2JqZWN0IGNsYXNzTmFtZT1cImVtYmJlZCBlbWJiZWQtZnVsbFwiXG4gICAgICAgICBkYXRhPXtgL3Jlc3QvdXNlci9maWxlcy91c2VyLyR7dGhpcy5wcm9wcy5zdGF0dXMudXNlcklkfS9pZGVudGlmaWVyL3Byb2ZpbGUtaW1hZ2UtOTZgfVxuICAgICAgICAgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdXNlclwiPjwvc3Bhbj5cbiAgICAgICAgPC9vYmplY3Q+XG4gICAgICA8L2E+XG4gICAgPC9Ecm9wZG93bj5cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpe1xuICByZXR1cm4ge1xuICAgIGkxOG46IHN0YXRlLmkxOG4sXG4gICAgc3RhdHVzOiBzdGF0ZS5zdGF0dXNcbiAgfVxufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKT0+e1xuICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKFByb2ZpbGVJdGVtKTsiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7dW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIsIHVubW91bnRDb21wb25lbnRBdE5vZGUsIGZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nO1xuXG5jb25zdCBLRVlDT0RFUyA9IHtcbiAgRVNDQVBFOiAyN1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0geyBhY3RpdmU6IGZhbHNlIH07XG4gICAgdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2sgPSB0aGlzLmhhbmRsZVdyYXBwZXJDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2VQb3J0YWwgPSB0aGlzLmNsb3NlUG9ydGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayA9IHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleWRvd24gPSB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25Fc2MpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVPdXRzaWRlTW91c2VDbGljayk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmIChuZXh0U3RhdGUuYWN0aXZlKXtcbiAgICAgIHRoaXMucmVuZGVyUG9ydGFsKG5leHRQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbkVzYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlT3V0c2lkZU1vdXNlQ2xpY2spO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2Nyb2xsKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUG9ydGFsKHRydWUpO1xuICB9XG5cbiAgaGFuZGxlV3JhcHBlckNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5vcGVuUG9ydGFsKCk7XG4gIH1cblxuICBvcGVuUG9ydGFsKHByb3BzID0gdGhpcy5wcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IHRydWUgfSk7XG4gICAgdGhpcy5yZW5kZXJQb3J0YWwocHJvcHMsIHRydWUpO1xuICB9XG5cbiAgY2xvc2VQb3J0YWwoaXNVbm1vdW50ZWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHJlc2V0UG9ydGFsU3RhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICAgIHVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5ub2RlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChpc1VubW91bnRlZCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5iZWZvcmVDbG9zZSkge1xuICAgICAgICB0aGlzLnByb3BzLmJlZm9yZUNsb3NlKHRoaXMubm9kZSwgcmVzZXRQb3J0YWxTdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNldFBvcnRhbFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU91dHNpZGVNb3VzZUNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IGZpbmRET01Ob2RlKHRoaXMucG9ydGFsKTtcbiAgICBpZiAocm9vdC5jb250YWlucyhlLnRhcmdldCkgfHwgKGUuYnV0dG9uICYmIGUuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5jbG9zZVBvcnRhbCgpO1xuICB9XG5cbiAgaGFuZGxlS2V5ZG93bihlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gS0VZQ09ERVMuRVNDQVBFICYmIHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLmNsb3NlUG9ydGFsKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyUG9ydGFsKHByb3BzLCBpc09wZW5pbmcpIHtcbiAgICBpZiAoIXRoaXMubm9kZSkge1xuICAgICAgdGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamltZmIvZDk5ZTA2NzhlOWRhNzE1Y2NmNjQ1NDk2MWVmMDRkMWJcbiAgICBpZiAodHlwZW9mIHByb3BzLmNoaWxkcmVuLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNoaWxkcmVuID0gUmVhY3QuY2xvbmVFbGVtZW50KHByb3BzLmNoaWxkcmVuLCB7XG4gICAgICAgIGNsb3NlUG9ydGFsOiB0aGlzLmNsb3NlUG9ydGFsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcnRhbCA9IHVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKFxuICAgICAgdGhpcyxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgdGhpcy5ub2RlLFxuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVxuICAgICk7XG4gICAgXG4gICAgaWYgKGlzT3BlbmluZykge1xuICAgICAgdGhpcy5wcm9wcy5vbk9wZW4odGhpcy5ub2RlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub3BlbkJ5Q2xpY2tPbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnByb3BzLm9wZW5CeUNsaWNrT24sIHtcbiAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVXcmFwcGVyQ2xpY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5Qb3J0YWwucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgb3BlbkJ5Q2xpY2tPbjogUHJvcFR5cGVzLmVsZW1lbnQsXG4gIGNsb3NlT25Fc2M6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPblNjcm9sbDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBiZWZvcmVDbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXBkYXRlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuUG9ydGFsLmRlZmF1bHRQcm9wcyA9IHtcbiAgb25PcGVuOiAoKSA9PiB7fSxcbiAgb25DbG9zZTogKCkgPT4ge30sXG4gIG9uVXBkYXRlOiAoKSA9PiB7fVxufTsiLCJpbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tICcuLi9jb21wb25lbnRzL2Jhc2Uvbm90aWZpY2F0aW9ucy5qc3gnO1xuaW1wb3J0IEJvZHkgZnJvbSAnLi4vY29tcG9uZW50cy9jb21tdW5pY2F0b3IvYm9keS5qc3gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbXVuaWNhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuICg8ZGl2IGlkPVwicm9vdFwiPlxuICAgICAgPE5vdGlmaWNhdGlvbnM+PC9Ob3RpZmljYXRpb25zPlxuICAgICAgPEJvZHk+PC9Cb2R5PlxuICAgIDwvZGl2Pik7XG4gIH1cbn0iLCJpbXBvcnQge2xvZ2dlcn0gZnJvbSAncmVkdXgtbG9nZ2VyJztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQcm92aWRlciwgY29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgeyBjb21wb3NlV2l0aERldlRvb2xzIH0gZnJvbSAncmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uJztcbmltcG9ydCB7cmVuZGVyfSBmcm9tICdyZWFjdC1kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBydW5BcHAocmVkdWNlciwgQXBwLCBjYWxsYmFjayl7XG4gIGxldCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGNvbXBvc2VXaXRoRGV2VG9vbHMoYXBwbHlNaWRkbGV3YXJlKHRodW5rLCBsb2dnZXIpKSk7XG5cbiAgcmVuZGVyKDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICAgIDxBcHAvPlxuICA8L1Byb3ZpZGVyPiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcHBcIikpO1xuICBcbiAgbGV0IG5ld1N0b3JlID0ge1xuICAgIGRpc3BhdGNoKGFjdGlvbil7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gYWN0aW9uKHN0b3JlLmRpc3BhdGNoLCBzdG9yZS5nZXRTdGF0ZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBzdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLnN1YnNjcmliZSguLi5hcmdzKTtcbiAgICB9LFxuICAgIGdldFN0YXRlKC4uLmFyZ3Mpe1xuICAgICAgcmV0dXJuIHN0b3JlLmdldFN0YXRlKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlZHVjZXIoLi4uYXJncyl7XG4gICAgICByZXR1cm4gc3RvcmUucmVwbGFjZVJlZHVjZXIoLi4uYXJncyk7XG4gICAgfVxuICB9XG4gIFxuLy8gIGNvbnN0IG9Db25uZWN0ID0gUmVhY3RSZWR1eC5jb25uZWN0O1xuLy8gIFJlYWN0UmVkdXguY29ubmVjdCA9IGZ1bmN0aW9uKG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKXtcbi8vICAgIHJldHVybiBvQ29ubmVjdCgoc3RhdGUpPT57XG4vLyAgICAgIGxldCB2YWx1ZSA9IG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSk7XG4vLyAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKChrZXkpPT57XG4vLyAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZVtrZXldID09PSBcInVuZGVmaW5lZFwiKXtcbi8vICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3Npbmcgc3RhdGUgdmFsdWUgZm9yIGtleSBcIiArIGtleSArIFwiIHlvdSBtb3N0IGxpa2VseSBmb3Jnb3QgdG8gY29tYmluZSB0aGUgcmVkdWNlcnMgd2l0aGluIHRoZSByb290IHJlZHVjZXIgZmlsZVwiKTtcbi8vICAgICAgICB9XG4vLyAgICAgIH0pO1xuLy8gICAgfSwgbWFwRGlzcGF0Y2hUb1Byb3BzKTtcbi8vICB9XG4gIFxuICB3aW5kb3cuU1RPUkVfREVCVUcgPSBuZXdTdG9yZTtcbiAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobmV3U3RvcmUpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuZnVuY3Rpb24gbWFrZUVtcHR5RnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFyZztcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGFjY2VwdHMgYW5kIGRpc2NhcmRzIGlucHV0czsgaXQgaGFzIG5vIHNpZGUgZWZmZWN0cy4gVGhpcyBpc1xuICogcHJpbWFyaWx5IHVzZWZ1bCBpZGlvbWF0aWNhbGx5IGZvciBvdmVycmlkYWJsZSBmdW5jdGlvbiBlbmRwb2ludHMgd2hpY2hcbiAqIGFsd2F5cyBuZWVkIHRvIGJlIGNhbGxhYmxlLCBzaW5jZSBKUyBsYWNrcyBhIG51bGwtY2FsbCBpZGlvbSBhbGEgQ29jb2EuXG4gKi9cbnZhciBlbXB0eUZ1bmN0aW9uID0gZnVuY3Rpb24gZW1wdHlGdW5jdGlvbigpIHt9O1xuXG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zID0gbWFrZUVtcHR5RnVuY3Rpb247XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zRmFsc2UgPSBtYWtlRW1wdHlGdW5jdGlvbihmYWxzZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVHJ1ZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKHRydWUpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwgPSBtYWtlRW1wdHlGdW5jdGlvbihudWxsKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUaGlzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gIHJldHVybiBhcmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVtcHR5RnVuY3Rpb247IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCcuL2VtcHR5RnVuY3Rpb24nKTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBlbXB0eUZ1bmN0aW9uO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGZvcm1hdCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG5cbiAgd2FybmluZyA9IGZ1bmN0aW9uIHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5pbmRleE9mKCdGYWlsZWQgQ29tcG9zaXRlIHByb3BUeXBlOiAnKSA9PT0gMCkge1xuICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgQ29tcG9zaXRlQ29tcG9uZW50IHByb3B0eXBlIGNoZWNrLlxuICAgIH1cblxuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIgLSAyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHByaW50V2FybmluZy5hcHBseSh1bmRlZmluZWQsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuICB2YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmICh0eXBlU3BlY3MuaGFzT3duUHJvcGVydHkodHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpbnZhcmlhbnQodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ1JlYWN0LlByb3BUeXBlcy4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUpO1xuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICB3YXJuaW5nKCFlcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIEVycm9yLCAnJXM6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAlcyBgJXNgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAlcy4gJyArICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICsgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHNoaW0ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICBpZiAoc2VjcmV0ID09PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgLy8gSXQgaXMgc3RpbGwgc2FmZSB3aGVuIGNhbGxlZCBmcm9tIFJlYWN0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoXG4gICAgICBmYWxzZSxcbiAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICdVc2UgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKCkgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICk7XG4gIH07XG4gIHNoaW0uaXNSZXF1aXJlZCA9IHNoaW07XG4gIGZ1bmN0aW9uIGdldFNoaW0oKSB7XG4gICAgcmV0dXJuIHNoaW07XG4gIH07XG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogc2hpbSxcbiAgICBib29sOiBzaGltLFxuICAgIGZ1bmM6IHNoaW0sXG4gICAgbnVtYmVyOiBzaGltLFxuICAgIG9iamVjdDogc2hpbSxcbiAgICBzdHJpbmc6IHNoaW0sXG4gICAgc3ltYm9sOiBzaGltLFxuXG4gICAgYW55OiBzaGltLFxuICAgIGFycmF5T2Y6IGdldFNoaW0sXG4gICAgZWxlbWVudDogc2hpbSxcbiAgICBpbnN0YW5jZU9mOiBnZXRTaGltLFxuICAgIG5vZGU6IHNoaW0sXG4gICAgb2JqZWN0T2Y6IGdldFNoaW0sXG4gICAgb25lT2Y6IGdldFNoaW0sXG4gICAgb25lT2ZUeXBlOiBnZXRTaGltLFxuICAgIHNoYXBlOiBnZXRTaGltXG4gIH07XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBlbXB0eUZ1bmN0aW9uO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBPbGQgYmVoYXZpb3IgZm9yIHBlb3BsZSB1c2luZyBSZWFjdC5Qcm9wVHlwZXNcbiAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJlxuICAgICAgICAgICAgLy8gQXZvaWQgc3BhbW1pbmcgdGhlIGNvbnNvbGUgYmVjYXVzZSB0aGV5IGFyZSBvZnRlbiBub3QgYWN0aW9uYWJsZSBleGNlcHQgZm9yIGxpYiBhdXRob3JzXG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDNcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAlc2AgcHJvcCBvbiBgJXNgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJyxcbiAgICAgICAgICAgICAgcHJvcEZ1bGxOYW1lLFxuICAgICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgaW4gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzKHByb3BWYWx1ZSwgZXhwZWN0ZWRWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzKTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3BWYWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0ICcgK1xuICAgICAgICAgICdyZWNlaXZlZCAlcyBhdCBpbmRleCAlcy4nLFxuICAgICAgICAgIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSxcbiAgICAgICAgICBpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICAgIGlmIChjaGVja2VyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ10gPT09ICdTeW1ib2wnXG4gICAgaWYgKHByb3BWYWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgZm9yIG5vbi1zcGVjIGNvbXBsaWFudCBTeW1ib2xzIHdoaWNoIGFyZSBwb2x5ZmlsbGVkLlxuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXF1aXZhbGVudCBvZiBgdHlwZW9mYCBidXQgd2l0aCBzcGVjaWFsIGhhbmRsaW5nIGZvciBhcnJheSBhbmQgcmVnZXhwLlxuICBmdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2JqZWN0JyBmb3IgdHlwZW9mIGEgUmVnRXhwLiBXZSdsbCBub3JtYWxpemUgdGhpcyBoZXJlIHNvIHRoYXQgL2JsYS9cbiAgICAgIC8vIHBhc3NlcyBQcm9wVHlwZXMub2JqZWN0LlxuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gVGhpcyBoYW5kbGVzIG1vcmUgdHlwZXMgdGhhbiBgZ2V0UHJvcFR5cGVgLiBPbmx5IHVzZWQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICAvLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cbiAgZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHByb3BWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnICsgcHJvcFZhbHVlO1xuICAgIH1cbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBwb3N0Zml4ZWQgdG8gYSB3YXJuaW5nIGFib3V0IGFuIGludmFsaWQgdHlwZS5cbiAgLy8gRm9yIGV4YW1wbGUsIFwidW5kZWZpbmVkXCIgb3IgXCJvZiB0eXBlIGFycmF5XCJcbiAgZnVuY3Rpb24gZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICByZXR1cm4gJ2FuICcgKyB0eXBlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgIGNhc2UgJ3JlZ2V4cCc6XG4gICAgICAgIHJldHVybiAnYSAnICsgdHlwZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG4gIGZ1bmN0aW9uIGdldENsYXNzTmFtZShwcm9wVmFsdWUpIHtcbiAgICBpZiAoIXByb3BWYWx1ZS5jb25zdHJ1Y3RvciB8fCAhcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIHJldHVybiBBTk9OWU1PVVM7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gY2hlY2tQcm9wVHlwZXM7XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiZcbiAgICBTeW1ib2wuZm9yICYmXG4gICAgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAgIDB4ZWFjNztcblxuICB2YXIgaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH07XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb21wb3NlID0gcmVxdWlyZSgncmVkdXgnKS5jb21wb3NlO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jb21wb3NlV2l0aERldlRvb2xzID0gKFxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fID9cbiAgICB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fIDpcbiAgICBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSByZXR1cm4gY29tcG9zZTtcbiAgICAgIHJldHVybiBjb21wb3NlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuKTtcblxuZXhwb3J0cy5kZXZUb29sc0VuaGFuY2VyID0gKFxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyA/XG4gICAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gOlxuICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gZnVuY3Rpb24obm9vcCkgeyByZXR1cm4gbm9vcDsgfSB9XG4pO1xuIiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLnJlZHV4TG9nZ2VyPWUucmVkdXhMb2dnZXJ8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZS5zdXBlcl89dCxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6ZSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KX1mdW5jdGlvbiByKGUsdCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJraW5kXCIse3ZhbHVlOmUsZW51bWVyYWJsZTohMH0pLHQmJnQubGVuZ3RoJiZPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInBhdGhcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gbihlLHQscil7bi5zdXBlcl8uY2FsbCh0aGlzLFwiRVwiLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwibGhzXCIse3ZhbHVlOnQsZW51bWVyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicmhzXCIse3ZhbHVlOnIsZW51bWVyYWJsZTohMH0pfWZ1bmN0aW9uIG8oZSx0KXtvLnN1cGVyXy5jYWxsKHRoaXMsXCJOXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJyaHNcIix7dmFsdWU6dCxlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gaShlLHQpe2kuc3VwZXJfLmNhbGwodGhpcyxcIkRcIixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImxoc1wiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KX1mdW5jdGlvbiBhKGUsdCxyKXthLnN1cGVyXy5jYWxsKHRoaXMsXCJBXCIsZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJpbmRleFwiLHt2YWx1ZTp0LGVudW1lcmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcIml0ZW1cIix7dmFsdWU6cixlbnVtZXJhYmxlOiEwfSl9ZnVuY3Rpb24gZihlLHQscil7dmFyIG49ZS5zbGljZSgocnx8dCkrMXx8ZS5sZW5ndGgpO3JldHVybiBlLmxlbmd0aD10PDA/ZS5sZW5ndGgrdDp0LGUucHVzaC5hcHBseShlLG4pLGV9ZnVuY3Rpb24gdShlKXt2YXIgdD1cInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOk4oZSk7cmV0dXJuXCJvYmplY3RcIiE9PXQ/dDplPT09TWF0aD9cIm1hdGhcIjpudWxsPT09ZT9cIm51bGxcIjpBcnJheS5pc0FycmF5KGUpP1wiYXJyYXlcIjpcIltvYmplY3QgRGF0ZV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKT9cImRhdGVcIjpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvU3RyaW5nJiYvXlxcLy4qXFwvLy50ZXN0KGUudG9TdHJpbmcoKSk/XCJyZWdleHBcIjpcIm9iamVjdFwifWZ1bmN0aW9uIGwoZSx0LHIsYyxzLGQscCl7cz1zfHxbXSxwPXB8fFtdO3ZhciBnPXMuc2xpY2UoMCk7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGQpe2lmKGMpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGMmJmMoZyxkKSlyZXR1cm47aWYoXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgYz9cInVuZGVmaW5lZFwiOk4oYykpKXtpZihjLnByZWZpbHRlciYmYy5wcmVmaWx0ZXIoZyxkKSlyZXR1cm47aWYoYy5ub3JtYWxpemUpe3ZhciBoPWMubm9ybWFsaXplKGcsZCxlLHQpO2gmJihlPWhbMF0sdD1oWzFdKX19fWcucHVzaChkKX1cInJlZ2V4cFwiPT09dShlKSYmXCJyZWdleHBcIj09PXUodCkmJihlPWUudG9TdHJpbmcoKSx0PXQudG9TdHJpbmcoKSk7dmFyIHk9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjpOKGUpLHY9XCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpOKHQpLGI9XCJ1bmRlZmluZWRcIiE9PXl8fHAmJnBbcC5sZW5ndGgtMV0ubGhzJiZwW3AubGVuZ3RoLTFdLmxocy5oYXNPd25Qcm9wZXJ0eShkKSxtPVwidW5kZWZpbmVkXCIhPT12fHxwJiZwW3AubGVuZ3RoLTFdLnJocyYmcFtwLmxlbmd0aC0xXS5yaHMuaGFzT3duUHJvcGVydHkoZCk7aWYoIWImJm0pcihuZXcgbyhnLHQpKTtlbHNlIGlmKCFtJiZiKXIobmV3IGkoZyxlKSk7ZWxzZSBpZih1KGUpIT09dSh0KSlyKG5ldyBuKGcsZSx0KSk7ZWxzZSBpZihcImRhdGVcIj09PXUoZSkmJmUtdCE9PTApcihuZXcgbihnLGUsdCkpO2Vsc2UgaWYoXCJvYmplY3RcIj09PXkmJm51bGwhPT1lJiZudWxsIT09dClpZihwLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdC5saHM9PT1lfSkubGVuZ3RoKWUhPT10JiZyKG5ldyBuKGcsZSx0KSk7ZWxzZXtpZihwLnB1c2goe2xoczplLHJoczp0fSksQXJyYXkuaXNBcnJheShlKSl7dmFyIHc7ZS5sZW5ndGg7Zm9yKHc9MDt3PGUubGVuZ3RoO3crKyl3Pj10Lmxlbmd0aD9yKG5ldyBhKGcsdyxuZXcgaSh2b2lkIDAsZVt3XSkpKTpsKGVbd10sdFt3XSxyLGMsZyx3LHApO2Zvcig7dzx0Lmxlbmd0aDspcihuZXcgYShnLHcsbmV3IG8odm9pZCAwLHRbdysrXSkpKX1lbHNle3ZhciB4PU9iamVjdC5rZXlzKGUpLFM9T2JqZWN0LmtleXModCk7eC5mb3JFYWNoKGZ1bmN0aW9uKG4sbyl7dmFyIGk9Uy5pbmRleE9mKG4pO2k+PTA/KGwoZVtuXSx0W25dLHIsYyxnLG4scCksUz1mKFMsaSkpOmwoZVtuXSx2b2lkIDAscixjLGcsbixwKX0pLFMuZm9yRWFjaChmdW5jdGlvbihlKXtsKHZvaWQgMCx0W2VdLHIsYyxnLGUscCl9KX1wLmxlbmd0aD1wLmxlbmd0aC0xfWVsc2UgZSE9PXQmJihcIm51bWJlclwiPT09eSYmaXNOYU4oZSkmJmlzTmFOKHQpfHxyKG5ldyBuKGcsZSx0KSkpfWZ1bmN0aW9uIGMoZSx0LHIsbil7cmV0dXJuIG49bnx8W10sbChlLHQsZnVuY3Rpb24oZSl7ZSYmbi5wdXNoKGUpfSxyKSxuLmxlbmd0aD9uOnZvaWQgMH1mdW5jdGlvbiBzKGUsdCxyKXtpZihyLnBhdGgmJnIucGF0aC5sZW5ndGgpe3ZhciBuLG89ZVt0XSxpPXIucGF0aC5sZW5ndGgtMTtmb3Iobj0wO248aTtuKyspbz1vW3IucGF0aFtuXV07c3dpdGNoKHIua2luZCl7Y2FzZVwiQVwiOnMob1tyLnBhdGhbbl1dLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZGVsZXRlIG9bci5wYXRoW25dXTticmVhaztjYXNlXCJFXCI6Y2FzZVwiTlwiOm9bci5wYXRoW25dXT1yLnJoc319ZWxzZSBzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhlW3RdLHIuaW5kZXgsci5pdGVtKTticmVhaztjYXNlXCJEXCI6ZT1mKGUsdCk7YnJlYWs7Y2FzZVwiRVwiOmNhc2VcIk5cIjplW3RdPXIucmhzfXJldHVybiBlfWZ1bmN0aW9uIGQoZSx0LHIpe2lmKGUmJnQmJnImJnIua2luZCl7Zm9yKHZhciBuPWUsbz0tMSxpPXIucGF0aD9yLnBhdGgubGVuZ3RoLTE6MDsrK288aTspXCJ1bmRlZmluZWRcIj09dHlwZW9mIG5bci5wYXRoW29dXSYmKG5bci5wYXRoW29dXT1cIm51bWJlclwiPT10eXBlb2Ygci5wYXRoW29dP1tdOnt9KSxuPW5bci5wYXRoW29dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cyhyLnBhdGg/bltyLnBhdGhbb11dOm4sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjpkZWxldGUgbltyLnBhdGhbb11dO2JyZWFrO2Nhc2VcIkVcIjpjYXNlXCJOXCI6bltyLnBhdGhbb11dPXIucmhzfX19ZnVuY3Rpb24gcChlLHQscil7aWYoci5wYXRoJiZyLnBhdGgubGVuZ3RoKXt2YXIgbixvPWVbdF0saT1yLnBhdGgubGVuZ3RoLTE7Zm9yKG49MDtuPGk7bisrKW89b1tyLnBhdGhbbl1dO3N3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKG9bci5wYXRoW25dXSxyLmluZGV4LHIuaXRlbSk7YnJlYWs7Y2FzZVwiRFwiOm9bci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJFXCI6b1tyLnBhdGhbbl1dPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjpkZWxldGUgb1tyLnBhdGhbbl1dfX1lbHNlIHN3aXRjaChyLmtpbmQpe2Nhc2VcIkFcIjpwKGVbdF0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjplW3RdPXIubGhzO2JyZWFrO2Nhc2VcIkVcIjplW3RdPXIubGhzO2JyZWFrO2Nhc2VcIk5cIjplPWYoZSx0KX1yZXR1cm4gZX1mdW5jdGlvbiBnKGUsdCxyKXtpZihlJiZ0JiZyJiZyLmtpbmQpe3ZhciBuLG8saT1lO2ZvcihvPXIucGF0aC5sZW5ndGgtMSxuPTA7bjxvO24rKylcInVuZGVmaW5lZFwiPT10eXBlb2YgaVtyLnBhdGhbbl1dJiYoaVtyLnBhdGhbbl1dPXt9KSxpPWlbci5wYXRoW25dXTtzd2l0Y2goci5raW5kKXtjYXNlXCJBXCI6cChpW3IucGF0aFtuXV0sci5pbmRleCxyLml0ZW0pO2JyZWFrO2Nhc2VcIkRcIjppW3IucGF0aFtuXV09ci5saHM7YnJlYWs7Y2FzZVwiRVwiOmlbci5wYXRoW25dXT1yLmxoczticmVhaztjYXNlXCJOXCI6ZGVsZXRlIGlbci5wYXRoW25dXX19fWZ1bmN0aW9uIGgoZSx0LHIpe2lmKGUmJnQpe3ZhciBuPWZ1bmN0aW9uKG4pe3ImJiFyKGUsdCxuKXx8ZChlLHQsbil9O2woZSx0LG4pfX1mdW5jdGlvbiB5KGUpe3JldHVyblwiY29sb3I6IFwiK0ZbZV0uY29sb3IrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCJ9ZnVuY3Rpb24gdihlKXt2YXIgdD1lLmtpbmQscj1lLnBhdGgsbj1lLmxocyxvPWUucmhzLGk9ZS5pbmRleCxhPWUuaXRlbTtzd2l0Y2godCl7Y2FzZVwiRVwiOnJldHVybltyLmpvaW4oXCIuXCIpLG4sXCLihpJcIixvXTtjYXNlXCJOXCI6cmV0dXJuW3Iuam9pbihcIi5cIiksb107Y2FzZVwiRFwiOnJldHVybltyLmpvaW4oXCIuXCIpXTtjYXNlXCJBXCI6cmV0dXJuW3Iuam9pbihcIi5cIikrXCJbXCIraStcIl1cIixhXTtkZWZhdWx0OnJldHVybltdfX1mdW5jdGlvbiBiKGUsdCxyLG4pe3ZhciBvPWMoZSx0KTt0cnl7bj9yLmdyb3VwQ29sbGFwc2VkKFwiZGlmZlwiKTpyLmdyb3VwKFwiZGlmZlwiKX1jYXRjaChlKXtyLmxvZyhcImRpZmZcIil9bz9vLmZvckVhY2goZnVuY3Rpb24oZSl7dmFyIHQ9ZS5raW5kLG49dihlKTtyLmxvZy5hcHBseShyLFtcIiVjIFwiK0ZbdF0udGV4dCx5KHQpXS5jb25jYXQoUChuKSkpfSk6ci5sb2coXCLigJTigJQgbm8gZGlmZiDigJTigJRcIik7dHJ5e3IuZ3JvdXBFbmQoKX1jYXRjaChlKXtyLmxvZyhcIuKAlOKAlCBkaWZmIGVuZCDigJTigJQgXCIpfX1mdW5jdGlvbiBtKGUsdCxyLG4pe3N3aXRjaChcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOk4oZSkpe2Nhc2VcIm9iamVjdFwiOnJldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGVbbl0/ZVtuXS5hcHBseShlLFAocikpOmVbbl07Y2FzZVwiZnVuY3Rpb25cIjpyZXR1cm4gZSh0KTtkZWZhdWx0OnJldHVybiBlfX1mdW5jdGlvbiB3KGUpe3ZhciB0PWUudGltZXN0YW1wLHI9ZS5kdXJhdGlvbjtyZXR1cm4gZnVuY3Rpb24oZSxuLG8pe3ZhciBpPVtcImFjdGlvblwiXTtyZXR1cm4gaS5wdXNoKFwiJWNcIitTdHJpbmcoZS50eXBlKSksdCYmaS5wdXNoKFwiJWNAIFwiK24pLHImJmkucHVzaChcIiVjKGluIFwiK28udG9GaXhlZCgyKStcIiBtcylcIiksaS5qb2luKFwiIFwiKX19ZnVuY3Rpb24geChlLHQpe3ZhciByPXQubG9nZ2VyLG49dC5hY3Rpb25UcmFuc2Zvcm1lcixvPXQudGl0bGVGb3JtYXR0ZXIsaT12b2lkIDA9PT1vP3codCk6byxhPXQuY29sbGFwc2VkLGY9dC5jb2xvcnMsdT10LmxldmVsLGw9dC5kaWZmLGM9XCJ1bmRlZmluZWRcIj09dHlwZW9mIHQudGl0bGVGb3JtYXR0ZXI7ZS5mb3JFYWNoKGZ1bmN0aW9uKG8scyl7dmFyIGQ9by5zdGFydGVkLHA9by5zdGFydGVkVGltZSxnPW8uYWN0aW9uLGg9by5wcmV2U3RhdGUseT1vLmVycm9yLHY9by50b29rLHc9by5uZXh0U3RhdGUseD1lW3MrMV07eCYmKHc9eC5wcmV2U3RhdGUsdj14LnN0YXJ0ZWQtZCk7dmFyIFM9bihnKSxrPVwiZnVuY3Rpb25cIj09dHlwZW9mIGE/YShmdW5jdGlvbigpe3JldHVybiB3fSxnLG8pOmEsaj1EKHApLEU9Zi50aXRsZT9cImNvbG9yOiBcIitmLnRpdGxlKFMpK1wiO1wiOlwiXCIsQT1bXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCJdO0EucHVzaChFKSx0LnRpbWVzdGFtcCYmQS5wdXNoKFwiY29sb3I6IGdyYXk7IGZvbnQtd2VpZ2h0OiBsaWdodGVyO1wiKSx0LmR1cmF0aW9uJiZBLnB1c2goXCJjb2xvcjogZ3JheTsgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XCIpO3ZhciBPPWkoUyxqLHYpO3RyeXtrP2YudGl0bGUmJmM/ci5ncm91cENvbGxhcHNlZC5hcHBseShyLFtcIiVjIFwiK09dLmNvbmNhdChBKSk6ci5ncm91cENvbGxhcHNlZChPKTpmLnRpdGxlJiZjP3IuZ3JvdXAuYXBwbHkocixbXCIlYyBcIitPXS5jb25jYXQoQSkpOnIuZ3JvdXAoTyl9Y2F0Y2goZSl7ci5sb2coTyl9dmFyIE49bSh1LFMsW2hdLFwicHJldlN0YXRlXCIpLFA9bSh1LFMsW1NdLFwiYWN0aW9uXCIpLEM9bSh1LFMsW3ksaF0sXCJlcnJvclwiKSxGPW0odSxTLFt3XSxcIm5leHRTdGF0ZVwiKTtpZihOKWlmKGYucHJldlN0YXRlKXt2YXIgTD1cImNvbG9yOiBcIitmLnByZXZTdGF0ZShoKStcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIjtyW05dKFwiJWMgcHJldiBzdGF0ZVwiLEwsaCl9ZWxzZSByW05dKFwicHJldiBzdGF0ZVwiLGgpO2lmKFApaWYoZi5hY3Rpb24pe3ZhciBUPVwiY29sb3I6IFwiK2YuYWN0aW9uKFMpK1wiOyBmb250LXdlaWdodDogYm9sZFwiO3JbUF0oXCIlYyBhY3Rpb24gICAgXCIsVCxTKX1lbHNlIHJbUF0oXCJhY3Rpb24gICAgXCIsUyk7aWYoeSYmQylpZihmLmVycm9yKXt2YXIgTT1cImNvbG9yOiBcIitmLmVycm9yKHksaCkrXCI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiO3JbQ10oXCIlYyBlcnJvciAgICAgXCIsTSx5KX1lbHNlIHJbQ10oXCJlcnJvciAgICAgXCIseSk7aWYoRilpZihmLm5leHRTdGF0ZSl7dmFyIF89XCJjb2xvcjogXCIrZi5uZXh0U3RhdGUodykrXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCI7cltGXShcIiVjIG5leHQgc3RhdGVcIixfLHcpfWVsc2UgcltGXShcIm5leHQgc3RhdGVcIix3KTtsJiZiKGgsdyxyLGspO3RyeXtyLmdyb3VwRW5kKCl9Y2F0Y2goZSl7ci5sb2coXCLigJTigJQgbG9nIGVuZCDigJTigJRcIil9fSl9ZnVuY3Rpb24gUygpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSx0PU9iamVjdC5hc3NpZ24oe30sTCxlKSxyPXQubG9nZ2VyLG49dC5zdGF0ZVRyYW5zZm9ybWVyLG89dC5lcnJvclRyYW5zZm9ybWVyLGk9dC5wcmVkaWNhdGUsYT10LmxvZ0Vycm9ycyxmPXQuZGlmZlByZWRpY2F0ZTtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgcilyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBlKHQpfX19O2lmKGUuZ2V0U3RhdGUmJmUuZGlzcGF0Y2gpcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJbcmVkdXgtbG9nZ2VyXSByZWR1eC1sb2dnZXIgbm90IGluc3RhbGxlZC4gTWFrZSBzdXJlIHRvIHBhc3MgbG9nZ2VyIGluc3RhbmNlIGFzIG1pZGRsZXdhcmU6XFxuLy8gTG9nZ2VyIHdpdGggZGVmYXVsdCBvcHRpb25zXFxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoXFxuICByZWR1Y2VyLFxcbiAgYXBwbHlNaWRkbGV3YXJlKGxvZ2dlcilcXG4pXFxuLy8gT3IgeW91IGNhbiBjcmVhdGUgeW91ciBvd24gbG9nZ2VyIHdpdGggY3VzdG9tIG9wdGlvbnMgaHR0cDovL2JpdC5seS9yZWR1eC1sb2dnZXItb3B0aW9uc1xcbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbmNvbnN0IGxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XFxuICAvLyAuLi5vcHRpb25zXFxufSk7XFxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcXG4gIHJlZHVjZXIsXFxuICBhcHBseU1pZGRsZXdhcmUobG9nZ2VyKVxcbilcXG5cIiksZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBlKHQpfX19O3ZhciB1PVtdO3JldHVybiBmdW5jdGlvbihlKXt2YXIgcj1lLmdldFN0YXRlO3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24obCl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgaSYmIWkocixsKSlyZXR1cm4gZShsKTt2YXIgYz17fTt1LnB1c2goYyksYy5zdGFydGVkPU8ubm93KCksYy5zdGFydGVkVGltZT1uZXcgRGF0ZSxjLnByZXZTdGF0ZT1uKHIoKSksYy5hY3Rpb249bDt2YXIgcz12b2lkIDA7aWYoYSl0cnl7cz1lKGwpfWNhdGNoKGUpe2MuZXJyb3I9byhlKX1lbHNlIHM9ZShsKTtjLnRvb2s9Ty5ub3coKS1jLnN0YXJ0ZWQsYy5uZXh0U3RhdGU9bihyKCkpO3ZhciBkPXQuZGlmZiYmXCJmdW5jdGlvblwiPT10eXBlb2YgZj9mKHIsbCk6dC5kaWZmO2lmKHgodSxPYmplY3QuYXNzaWduKHt9LHQse2RpZmY6ZH0pKSx1Lmxlbmd0aD0wLGMuZXJyb3IpdGhyb3cgYy5lcnJvcjtyZXR1cm4gc319fX12YXIgayxqLEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gbmV3IEFycmF5KHQrMSkuam9pbihlKX0sQT1mdW5jdGlvbihlLHQpe3JldHVybiBFKFwiMFwiLHQtZS50b1N0cmluZygpLmxlbmd0aCkrZX0sRD1mdW5jdGlvbihlKXtyZXR1cm4gQShlLmdldEhvdXJzKCksMikrXCI6XCIrQShlLmdldE1pbnV0ZXMoKSwyKStcIjpcIitBKGUuZ2V0U2Vjb25kcygpLDIpK1wiLlwiK0EoZS5nZXRNaWxsaXNlY29uZHMoKSwzKX0sTz1cInVuZGVmaW5lZFwiIT10eXBlb2YgcGVyZm9ybWFuY2UmJm51bGwhPT1wZXJmb3JtYW5jZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgcGVyZm9ybWFuY2Uubm93P3BlcmZvcm1hbmNlOkRhdGUsTj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfSxQPWZ1bmN0aW9uKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpe2Zvcih2YXIgdD0wLHI9QXJyYXkoZS5sZW5ndGgpO3Q8ZS5sZW5ndGg7dCsrKXJbdF09ZVt0XTtyZXR1cm4gcn1yZXR1cm4gQXJyYXkuZnJvbShlKX0sQz1bXTtrPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGdsb2JhbD9cInVuZGVmaW5lZFwiOk4oZ2xvYmFsKSkmJmdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30saj1rLkRlZXBEaWZmLGomJkMucHVzaChmdW5jdGlvbigpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBqJiZrLkRlZXBEaWZmPT09YyYmKGsuRGVlcERpZmY9aixqPXZvaWQgMCl9KSx0KG4sciksdChvLHIpLHQoaSxyKSx0KGEsciksT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYyx7ZGlmZjp7dmFsdWU6YyxlbnVtZXJhYmxlOiEwfSxvYnNlcnZhYmxlRGlmZjp7dmFsdWU6bCxlbnVtZXJhYmxlOiEwfSxhcHBseURpZmY6e3ZhbHVlOmgsZW51bWVyYWJsZTohMH0sYXBwbHlDaGFuZ2U6e3ZhbHVlOmQsZW51bWVyYWJsZTohMH0scmV2ZXJ0Q2hhbmdlOnt2YWx1ZTpnLGVudW1lcmFibGU6ITB9LGlzQ29uZmxpY3Q6e3ZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGp9LGVudW1lcmFibGU6ITB9LG5vQ29uZmxpY3Q6e3ZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIEMmJihDLmZvckVhY2goZnVuY3Rpb24oZSl7ZSgpfSksQz1udWxsKSxjfSxlbnVtZXJhYmxlOiEwfX0pO3ZhciBGPXtFOntjb2xvcjpcIiMyMTk2RjNcIix0ZXh0OlwiQ0hBTkdFRDpcIn0sTjp7Y29sb3I6XCIjNENBRjUwXCIsdGV4dDpcIkFEREVEOlwifSxEOntjb2xvcjpcIiNGNDQzMzZcIix0ZXh0OlwiREVMRVRFRDpcIn0sQTp7Y29sb3I6XCIjMjE5NkYzXCIsdGV4dDpcIkFSUkFZOlwifX0sTD17bGV2ZWw6XCJsb2dcIixsb2dnZXI6Y29uc29sZSxsb2dFcnJvcnM6ITAsY29sbGFwc2VkOnZvaWQgMCxwcmVkaWNhdGU6dm9pZCAwLGR1cmF0aW9uOiExLHRpbWVzdGFtcDohMCxzdGF0ZVRyYW5zZm9ybWVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxhY3Rpb25UcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sZXJyb3JUcmFuc2Zvcm1lcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sY29sb3JzOnt0aXRsZTpmdW5jdGlvbigpe3JldHVyblwiaW5oZXJpdFwifSxwcmV2U3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm5cIiM5RTlFOUVcIn0sYWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuXCIjMDNBOUY0XCJ9LG5leHRTdGF0ZTpmdW5jdGlvbigpe3JldHVyblwiIzRDQUY1MFwifSxlcnJvcjpmdW5jdGlvbigpe3JldHVyblwiI0YyMDQwNFwifX0sZGlmZjohMSxkaWZmUHJlZGljYXRlOnZvaWQgMCx0cmFuc2Zvcm1lcjp2b2lkIDB9LFQ9ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sdD1lLmRpc3BhdGNoLHI9ZS5nZXRTdGF0ZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiByP1MoKSh7ZGlzcGF0Y2g6dCxnZXRTdGF0ZTpyfSk6dm9pZCBjb25zb2xlLmVycm9yKFwiXFxuW3JlZHV4LWxvZ2dlciB2M10gQlJFQUtJTkcgQ0hBTkdFXFxuW3JlZHV4LWxvZ2dlciB2M10gU2luY2UgMy4wLjAgcmVkdXgtbG9nZ2VyIGV4cG9ydHMgYnkgZGVmYXVsdCBsb2dnZXIgd2l0aCBkZWZhdWx0IHNldHRpbmdzLlxcbltyZWR1eC1sb2dnZXIgdjNdIENoYW5nZVxcbltyZWR1eC1sb2dnZXIgdjNdIGltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJ1xcbltyZWR1eC1sb2dnZXIgdjNdIHRvXFxuW3JlZHV4LWxvZ2dlciB2M10gaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAncmVkdXgtbG9nZ2VyJ1xcblwiKX07ZS5kZWZhdWx0cz1MLGUuY3JlYXRlTG9nZ2VyPVMsZS5sb2dnZXI9VCxlLmRlZmF1bHQ9VCxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaTE4bihzdGF0ZT17XG4gIHRleHQ6IHtcbiAgICBnZXQoa2V5LCAuLi5hcmdzKXtcbiAgICAgIGxldCB0ZXh0ID0gZ2V0TG9jYWxlVGV4dChrZXksIGFyZ3MpO1xuICAgICAgaWYgKHRleHQpe1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9ybWF0KGRhdGU9bmV3IERhdGUoKSwgZm9ybWF0PVwiTFwiKXtcbiAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUoZGF0ZSkpLmZvcm1hdChmb3JtYXQpO1xuICAgIH0sXG4gICAgZnJvbU5vdyhkYXRlPW5ldyBEYXRlKCkpe1xuICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZShkYXRlKSkuZnJvbU5vdygpO1xuICAgIH0sXG4gICAgc3VidHJhY3QoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5zdWJ0cmFjdChpbnB1dCwgdmFsdWUpLmNhbGVuZGFyKCk7XG4gICAgfSxcbiAgICBhZGQoZGF0ZT1uZXcgRGF0ZSgpLCBpbnB1dD0xLCB2YWx1ZT1cImRheXNcIil7XG4gICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKGRhdGUpKS5hZGQoaW5wdXQsIHZhbHVlKS5jYWxlbmRhcigpO1xuICAgIH1cbiAgfVxufSwgYWN0aW9uKXtcbiAgcmV0dXJuIHN0YXRlO1xufSIsIi8vVE9ETyB0aGlzIHJlZHVjZXIgdXNlcyB0aGUgYXBpIHRoYXQgaW50ZXJhY3RzIHdpdGggdGhlIERPTSBpbiBvcmRlciB0b1xuLy9yZXRyaWV2ZSBkYXRhLCBwbGVhc2UgZml4IGluIG5leHQgdmVyc2lvbnNcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlcyhzdGF0ZT17XG4gIGF2YWxpYWJsZTogJC5tYWtlQXJyYXkoJChcIiNsYW5ndWFnZS1waWNrZXIgYVwiKS5tYXAoKGluZGV4LCBlbGVtZW50KT0+e1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAkKGVsZW1lbnQpLnRleHQoKS50cmltKCksXG4gICAgICBsb2NhbGU6ICQoZWxlbWVudCkuZGF0YSgnbG9jYWxlJylcbiAgICB9XG4gIH0pKSxcbiAgY3VycmVudDogJChcIiNsb2NhbGVcIikudGV4dCgpXG59LCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRVRfTE9DQUxFJyl7XG4gICAgJCgnI2xhbmd1YWdlLXBpY2tlciBhW2RhdGEtbG9jYWxlPVwiJyArIGFjdGlvbi5wYXlsb2FkICsgJ1wiXScpLmNsaWNrKCk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7Y3VycmVudDogYWN0aW9uLnBheWxvYWR9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm90aWZpY2F0aW9ucyhzdGF0ZT1bXSwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQUREX05PVElGSUNBVElPTicpIHtcbiAgICB2YXIgaWQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgIHJldHVybiBzdGF0ZS5jb25jYXQoT2JqZWN0LmFzc2lnbih7aWQ6IGlkfSwgYWN0aW9uLnBheWxvYWQpKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gJ0hJREVfTk9USUZJQ0FUSU9OJykge1xuICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICByZXR1cm4gZWxlbWVudC5pZCAhPT0gYWN0aW9uLnBheWxvYWQuaWQ7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsIi8vVGhpcyBvbmUgYWxzbyB1c2VzIGEgaGFjayB0byBhY2Nlc3MgdGhlIGRhdGEgaW4gdGhlIGRvbVxuLy9wbGVhc2UgcmVwbGFjZSBpdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvY2VkdXJlXG4vLzEuIENyZWF0ZSBhIHJlc3QgZW5kcG9pbnQgdG8gZ2V0IHRoZSBwZXJtaXNzaW9ucyBsaXN0XG4vLzIuIGluIHRoZSBtYWluIGZpbGUgZ2F0aGVyIHRob3NlIHBlcm1pc3Npb25zLi4uIGV0Yy4uLiwgZWcuIGluZGV4LmpzIG1ha2UgYSBjYWxsXG4vLzMuIGRpc3BhdGNoIHRoZSBhY3Rpb24gdG8gdGhpcyBzYW1lIHJlZHVjZXIgYW5kIGdhdGhlciB0aGUgYWN0aW9uIGhlcmVcbi8vNC4gaXQgd29ya3MgOkRcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhdHVzKHN0YXRlPXtcbiAgbG9nZ2VkSW46ICEhTVVJS0tVX0xPR0dFRF9VU0VSX0lELFxuICB1c2VySWQ6IE1VSUtLVV9MT0dHRURfVVNFUl9JRCxcbiAgcGVybWlzc2lvbnM6IE1VSUtLVV9QRVJNSVNTSU9OUyxcbiAgY29udGV4dFBhdGg6IENPTlRFWFRQQVRIXG59LCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09IFwiTE9HT1VUXCIpe1xuICAgICQoJyNsb2dvdXQnKS5jbGljaygpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiaW1wb3J0IG5vdGlmaWNhdGlvbnMgZnJvbSAnLi9iYXNlL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IGxvY2FsZXMgZnJvbSAnLi9iYXNlL2xvY2FsZXMnO1xuaW1wb3J0IHN0YXR1cyBmcm9tICcuL2Jhc2Uvc3RhdHVzJztcbmltcG9ydCBpMThuIGZyb20gJy4vYmFzZS9pMThuJztcbmltcG9ydCBtZXNzYWdlQ291bnQgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL21lc3NhZ2UtY291bnQnO1xuaW1wb3J0IGNvbW11bmljYXRvck5hdmlnYXRpb24gZnJvbSAnLi9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbmF2aWdhdGlvbic7XG5pbXBvcnQgY29tbXVuaWNhdG9yTWVzc2FnZXMgZnJvbSAnLi9tYWluLWZ1bmN0aW9uL2NvbW11bmljYXRvci9jb21tdW5pY2F0b3ItbWVzc2FnZXMnO1xuaW1wb3J0IGhhc2ggZnJvbSAnLi9tYWluLWZ1bmN0aW9uL2hhc2gnO1xuXG5pbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnO1xuXG5leHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICBub3RpZmljYXRpb25zLFxuICBpMThuLFxuICBsb2NhbGVzLFxuICBzdGF0dXMsXG4gIG1lc3NhZ2VDb3VudCxcbiAgY29tbXVuaWNhdG9yTmF2aWdhdGlvbixcbiAgY29tbXVuaWNhdG9yTWVzc2FnZXMsXG4gIGhhc2hcbn0pOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbW11bmljYXRvck1lc3NhZ2VzKHN0YXRlPXtcbiAgc3RhdGU6IFwiTE9BRElOR1wiLFxuICBtZXNzYWdlczogW10sXG4gIHNlbGVjdGVkOiBbXSxcbiAgc2VsZWN0ZWRJZHM6IFtdLFxuICBwYWdlczogMSxcbiAgaGFzTW9yZTogZmFsc2UsXG4gIGxvY2F0aW9uOiBcIlwiLFxuICB0b29sYmFyTG9jazogZmFsc2Vcbn0sIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gXCJVUERBVEVfTUVTU0FHRVNfU1RBVEVcIil7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7c3RhdGU6IGFjdGlvbi5wYXlsb2FkfSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IFwiVVBEQVRFX1BBR0VTXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3BhZ2VzOiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIlVQREFURV9IQVNfTU9SRVwiKXtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtoYXNNb3JlOiBhY3Rpb24ucGF5bG9hZH0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIlVQREFURV9NRVNTQUdFU19BTExfUFJPUEVSVElFU1wiKXtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIGFjdGlvbi5wYXlsb2FkKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gXCJVUERBVEVfTUVTU0FHRVNcIil7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7bWVzc2FnZXM6IGFjdGlvbi5wYXlsb2FkfSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IFwiVVBEQVRFX1NFTEVDVEVEX01FU1NBR0VTXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3NlbGVjdGVkOiBhY3Rpb24ucGF5bG9hZCwgc2VsZWN0ZWRJZHM6IGFjdGlvbi5wYXlsb2FkLm1hcChzPT5zLmNvbW11bmljYXRvck1lc3NhZ2VJZCl9KTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gXCJBRERfVE9fQ09NTVVOSUNBVE9SX1NFTEVDVEVEX01FU1NBR0VTXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3NlbGVjdGVkOiBzdGF0ZS5zZWxlY3RlZC5jb25jYXQoW2FjdGlvbi5wYXlsb2FkXSksIHNlbGVjdGVkSWRzOiBzdGF0ZS5zZWxlY3RlZElkcy5jb25jYXQoW2FjdGlvbi5wYXlsb2FkLmNvbW11bmljYXRvck1lc3NhZ2VJZF0pfSk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IFwiUkVNT1ZFX0ZST01fQ09NTVVOSUNBVE9SX1NFTEVDVEVEX01FU1NBR0VTXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3NlbGVjdGVkOiBzdGF0ZS5zZWxlY3RlZC5maWx0ZXIoKHNlbGVjdGVkKT0+e1xuICAgICAgcmV0dXJuIHNlbGVjdGVkLmNvbW11bmljYXRvck1lc3NhZ2VJZCAhPT0gYWN0aW9uLnBheWxvYWQuY29tbXVuaWNhdG9yTWVzc2FnZUlkXG4gICAgfSksIHNlbGVjdGVkSWRzOiBzdGF0ZS5zZWxlY3RlZElkcy5maWx0ZXIoKGlkKT0+e3JldHVybiBpZCAhPT0gYWN0aW9uLnBheWxvYWQuY29tbXVuaWNhdG9yTWVzc2FnZUlkfSl9KTtcbiAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gXCJVUERBVEVfT05FX01FU1NBR0VcIil7XG4gICAgbGV0IG5ld01lc3NhZ2UgPSBPYmplY3QuYXNzaWduKHt9LCBhY3Rpb24ucGF5bG9hZC5tZXNzYWdlLCBhY3Rpb24ucGF5bG9hZC51cGRhdGUpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3NlbGVjdGVkOiBzdGF0ZS5zZWxlY3RlZC5tYXAoKHNlbGVjdGVkKT0+e1xuICAgICAgaWYgKHNlbGVjdGVkLmNvbW11bmljYXRvck1lc3NhZ2VJZCA9PT0gYWN0aW9uLnBheWxvYWQubWVzc2FnZS5jb21tdW5pY2F0b3JNZXNzYWdlSWQpe1xuICAgICAgICByZXR1cm4gbmV3TWVzc2FnZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdGVkO1xuICAgIH0pLCBtZXNzYWdlczogc3RhdGUubWVzc2FnZXMubWFwKChtZXNzYWdlKT0+e1xuICAgICAgaWYgKG1lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkID09PSBhY3Rpb24ucGF5bG9hZC5tZXNzYWdlLmNvbW11bmljYXRvck1lc3NhZ2VJZCl7XG4gICAgICAgIHJldHVybiBuZXdNZXNzYWdlXG4gICAgICB9XG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9KX0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIkxPQ0tfVE9PTEJBUlwiKXtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHt0b29sYmFyTG9jazogdHJ1ZX0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIlVOTE9DS19UT09MQkFSXCIpe1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3Rvb2xiYXJMb2NrOiBmYWxzZX0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIlVQREFURV9NRVNTQUdFX0FERF9MQUJFTFwiKXtcbiAgICBsZXQgbmV3TWVzc2FnZSA9IGFjdGlvbi5wYXlsb2FkLm1lc3NhZ2U7XG4gICAgaWYgKCFuZXdNZXNzYWdlLmxhYmVscy5maW5kKGxhYmVsPT5sYWJlbC5sYWJlbElkID09PSBhY3Rpb24ucGF5bG9hZC5sYWJlbC5sYWJlbElkKSl7XG4gICAgICBuZXdNZXNzYWdlID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3TWVzc2FnZSwge1xuICAgICAgICBsYWJlbHM6IG5ld01lc3NhZ2UubGFiZWxzLmNvbmNhdChbYWN0aW9uLnBheWxvYWQubGFiZWxdKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge3NlbGVjdGVkOiBzdGF0ZS5zZWxlY3RlZC5tYXAoKHNlbGVjdGVkKT0+e1xuICAgICAgaWYgKHNlbGVjdGVkLmNvbW11bmljYXRvck1lc3NhZ2VJZCA9PT0gYWN0aW9uLnBheWxvYWQubWVzc2FnZS5jb21tdW5pY2F0b3JNZXNzYWdlSWQpe1xuICAgICAgICByZXR1cm4gbmV3TWVzc2FnZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdGVkO1xuICAgIH0pLCBtZXNzYWdlczogc3RhdGUubWVzc2FnZXMubWFwKChtZXNzYWdlKT0+e1xuICAgICAgaWYgKG1lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkID09PSBhY3Rpb24ucGF5bG9hZC5tZXNzYWdlLmNvbW11bmljYXRvck1lc3NhZ2VJZCl7XG4gICAgICAgIHJldHVybiBuZXdNZXNzYWdlXG4gICAgICB9XG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9KX0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcIlVQREFURV9NRVNTQUdFX0RST1BfTEFCRUxcIil7XG4gICAgbGV0IG5ld01lc3NhZ2UgPSBPYmplY3QuYXNzaWduKHt9LCBhY3Rpb24ucGF5bG9hZC5tZXNzYWdlLCB7XG4gICAgICBsYWJlbHM6IGFjdGlvbi5wYXlsb2FkLm1lc3NhZ2UubGFiZWxzLmZpbHRlcihsYWJlbD0+bGFiZWwubGFiZWxJZCAhPT0gYWN0aW9uLnBheWxvYWQubGFiZWwubGFiZWxJZClcbiAgICB9KTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtzZWxlY3RlZDogc3RhdGUuc2VsZWN0ZWQubWFwKChzZWxlY3RlZCk9PntcbiAgICAgIGlmIChzZWxlY3RlZC5jb21tdW5pY2F0b3JNZXNzYWdlSWQgPT09IGFjdGlvbi5wYXlsb2FkLm1lc3NhZ2UuY29tbXVuaWNhdG9yTWVzc2FnZUlkKXtcbiAgICAgICAgcmV0dXJuIG5ld01lc3NhZ2VcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RlZDtcbiAgICB9KSwgbWVzc2FnZXM6IHN0YXRlLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSk9PntcbiAgICAgIGlmIChtZXNzYWdlLmNvbW11bmljYXRvck1lc3NhZ2VJZCA9PT0gYWN0aW9uLnBheWxvYWQubWVzc2FnZS5jb21tdW5pY2F0b3JNZXNzYWdlSWQpe1xuICAgICAgICByZXR1cm4gbmV3TWVzc2FnZVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSl9KTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiY29uc3QgZGVmYXVsdE5hdmlnYXRpb24gPSBbXG4gIHtcbiAgICBsb2NhdGlvbjogXCJpbmJveFwiLFxuICAgIHR5cGU6IFwiZm9sZGVyXCIsXG4gICAgaWQ6IFwiaW5ib3hcIixcbiAgICBpY29uOiBcIm5ldy1zZWN0aW9uXCIsXG4gICAgdGV4dChpMThuKXtyZXR1cm4gaTE4bi50ZXh0LmdldChcInBsdWdpbi5jb21tdW5pY2F0b3IuY2F0ZWdvcnkudGl0bGUuaW5ib3hcIil9XG4gIH0sXG4gIHtcbiAgICBsb2NhdGlvbjogXCJ1bnJlYWRcIixcbiAgICB0eXBlOiBcImZvbGRlclwiLFxuICAgIGlkOiBcInVucmVhZFwiLFxuICAgIGljb246IFwibmV3LXNlY3Rpb25cIixcbiAgICB0ZXh0KGkxOG4pe3JldHVybiBpMThuLnRleHQuZ2V0KFwicGx1Z2luLmNvbW11bmljYXRvci5jYXRlZ29yeS50aXRsZS51bnJlYWRcIil9XG4gIH0sXG4gIHtcbiAgICBsb2NhdGlvbjogXCJzZW50XCIsXG4gICAgdHlwZTogXCJmb2xkZXJcIixcbiAgICBpZDogXCJzZW50XCIsXG4gICAgaWNvbjogXCJuZXctc2VjdGlvblwiLFxuICAgIHRleHQoaTE4bil7cmV0dXJuIGkxOG4udGV4dC5nZXQoXCJwbHVnaW4uY29tbXVuaWNhdG9yLmNhdGVnb3J5LnRpdGxlLnNlbnRcIil9XG4gIH0sXG4gIHtcbiAgICBsb2NhdGlvbjogXCJ0cmFzaFwiLFxuICAgIHR5cGU6IFwiZm9sZGVyXCIsXG4gICAgaWQ6IFwidHJhc2hcIixcbiAgICBpY29uOiBcIm5ldy1zZWN0aW9uXCIsXG4gICAgdGV4dChpMThuKXtyZXR1cm4gaTE4bi50ZXh0LmdldChcInBsdWdpbi5jb21tdW5pY2F0b3IuY2F0ZWdvcnkudGl0bGUudHJhc2hcIil9XG4gIH1cbl1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tbXVuaWNhdG9yTmF2aWdhdGlvbihzdGF0ZT1kZWZhdWx0TmF2aWdhdGlvbiwgYWN0aW9uKXtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnVVBEQVRFX0NPTU1VTklDQVRPUl9OQVZJR0FUSU9OX0xBQkVMUycpe1xuICAgIHJldHVybiBkZWZhdWx0TmF2aWdhdGlvbi5jb25jYXQoYWN0aW9uLnBheWxvYWQpO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnQUREX0NPTU1VTklDQVRPUl9OQVZJR0FUSU9OX0xBQkVMJyl7XG4gICAgcmV0dXJuIHN0YXRlLmNvbmNhdChhY3Rpb24ucGF5bG9hZCk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09ICdERUxFVEVfQ09NTVVOSUNBVE9SX05BVklHQVRJT05fTEFCRUwnKXtcbiAgICByZXR1cm4gc3RhdGUuZmlsdGVyKChpdGVtKT0+e3JldHVybiBpdGVtLmxvY2F0aW9uICE9PSBhY3Rpb24ucGF5bG9hZC5sb2NhdGlvbn0pO1xuICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnVVBEQVRFX0NPTU1VTklDQVRPUl9OQVZJR0FUSU9OX0xBQkVMJyl7XG4gICAgcmV0dXJuIHN0YXRlLm1hcCgoaXRlbSk9PntcbiAgICAgIGlmIChpdGVtLmxvY2F0aW9uICE9PSBhY3Rpb24ucGF5bG9hZC5sb2NhdGlvbil7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYXNoKHN0YXRlPVtdLCBhY3Rpb24pe1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdVUERBVEVfSEFTSCcpe1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVzc2FnZUNvdW50KHN0YXRlPTAsIGFjdGlvbil7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gXCJVUERBVEVfTUVTU0FHRV9DT1VOVFwiKXtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG59XG5cbmZ1bmN0aW9uIGludGVyc2VjdFR3byhhLCBiKXtcbiAgcmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gYi5pbmRleE9mKG4pID4gLTE7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaWZmZXJlbmNlVHdvKGEsIGIpe1xuICBsZXQgaW5BQnV0Tm90SW5CID0gYS5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgIHJldHVybiBiLmluZGV4T2YobikgPT09IC0xO1xuICB9KTtcbiAgbGV0IGluQkJ1dE5vdEluQSA9IGIuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gYS5pbmRleE9mKG4pID09PSAtMTtcbiAgfSk7XG4gIHJldHVybiBpbkFCdXROb3RJbkIuY29uY2F0KGluQkJ1dE5vdEluQSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNYXRjaChzdHJpbmcsIGZpbHRlcil7XG4gIHJldHVybiBzdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoZmlsdGVyKSwgXCJpXCIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhpZ2hsaWdodChzdHJpbmcsIGZpbHRlcil7XG4gIHJldHVybiBzdHJpbmcuc3BsaXQobmV3IFJlZ0V4cChcIihcIiArIGVzY2FwZVJlZ0V4cChmaWx0ZXIpICsgXCIpXCIsIFwiaVwiKSkubWFwKChlbGVtZW50LCBpbmRleCk9PntcbiAgICBpZiAoaW5kZXggJSAyID09PSAwKXtcbiAgICAgIHJldHVybiA8c3BhbiBrZXk9e2luZGV4fT57ZWxlbWVudH08L3NwYW4+XG4gICAgfVxuICAgIHJldHVybiA8YiBrZXk9e2luZGV4fT57ZWxlbWVudH08L2I+XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JJbnRUb0hleChjb2xvcikge1xuICBsZXQgYiA9IChjb2xvciAmIDI1NSkudG9TdHJpbmcoMTYpO1xuICBsZXQgZyA9ICgoY29sb3IgPj4gOCkgJiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgbGV0IHIgPSAoKGNvbG9yID4+IDE2KSAmIDI1NSkudG9TdHJpbmcoMTYpO1xuXG4gIGxldCByU3RyID0gci5sZW5ndGggPT0gMSA/IFwiMFwiICsgciA6IHI7XG4gIGxldCBnU3RyID0gZy5sZW5ndGggPT0gMSA/IFwiMFwiICsgZyA6IGc7XG4gIGxldCBiU3RyID0gYi5sZW5ndGggPT0gMSA/IFwiMFwiICsgYiA6IGI7XG5cdCAgICBcbiAgcmV0dXJuIFwiI1wiICsgclN0ciArIGdTdHIgKyBiU3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9Db2xvckludChoZXhDb2xvcikge1xuICBsZXQgciA9IDI1NTtcbiAgbGV0IGcgPSAyNTU7XG4gIGxldCBiID0gMjU1O1xuXG4gIGlmIChoZXhDb2xvcikge1xuICAgIGlmIChoZXhDb2xvci5sZW5ndGggPT0gNyl7XG4gICAgICBoZXhDb2xvciA9IGhleENvbG9yLnNsaWNlKDEpO1xuICAgIH1cbiAgICBcbiAgICByID0gcGFyc2VJbnQoaGV4Q29sb3Iuc2xpY2UoMCwgMiksIDE2KTtcbiAgICBnID0gcGFyc2VJbnQoaGV4Q29sb3Iuc2xpY2UoMiwgNCksIDE2KTtcbiAgICBiID0gcGFyc2VJbnQoaGV4Q29sb3Iuc2xpY2UoNCwgNiksIDE2KTtcbiAgfVxuICAgIFxuICByZXR1cm4gKHIgPDwgMTYpICsgKGcgPDwgOCkgKyBiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0KC4uLmVsZW1lbnRzKXtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgcmV0dXJuIGVsZW1lbnRzWzBdO1xuICB9XG4gIFxuICByZXR1cm4gZWxlbWVudHMucmVkdWNlKGludGVyc2VjdFR3byk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbmNlKC4uLmVsZW1lbnRzKXtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIFxuICByZXR1cm4gZWxlbWVudHMucmVkdWNlKGRpZmZlcmVuY2VUd28pO1xufSIsImltcG9ydCBhY3Rpb25zIGZyb20gJy4uL2FjdGlvbnMvYmFzZS9ub3RpZmljYXRpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVpa2t1V2Vic29ja2V0IHtcbiAgY29uc3RydWN0b3Ioc3RvcmUsIGxpc3RlbmVycz1bXSwgb3B0aW9ucz17XG4gICAgcmVjb25uZWN0SW50ZXJ2YWw6IDIwMCxcbiAgICBwaW5nVGltZVN0ZXA6IDEwMDAsXG4gICAgcGluZ1RpbWVvdXQ6IDEwMDAwXG4gIH0pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMubGlzdGVuZXJzID0gbGlzdGVuZXJzO1xuICAgIFxuICAgIHRoaXMudGlja2V0ID0gbnVsbDtcbiAgICB0aGlzLndlYlNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5zb2NrZXRPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5tZXNzYWdlc1BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLnBpbmdIYW5kbGUgPSBudWxsO1xuICAgIHRoaXMucGluZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMucGluZ1RpbWUgPSAwO1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIFxuICAgIHRoaXMuZ2V0VGlja2V0KCh0aWNrZXQpPT4ge1xuICAgICAgaWYgKHRoaXMudGlja2V0KSB7XG4gICAgICAgIHRoaXMub3BlbldlYlNvY2tldCgpO1xuICAgICAgICB0aGlzLnN0YXJ0UGluZ2luZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3Qgb3BlbiBXZWJTb2NrZXQgYmVjYXVzZSB0aWNrZXQgd2FzIG1pc3NpbmdcIiwgJ2Vycm9yJykpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9uKFwiYmVmb3JldW5sb2FkXCIsIHRoaXMub25CZWZvcmVXaW5kb3dVbmxvYWQuYmluZCh0aGlzKSk7XG4gIH1cbiAgc2VuZE1lc3NhZ2UoZXZlbnRUeXBlLCBkYXRhKXtcbiAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgIGV2ZW50VHlwZSxcbiAgICAgIGRhdGFcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuc29ja2V0T3Blbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy53ZWJTb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXNQZW5kaW5nLnB1c2goe1xuICAgICAgICAgIGV2ZW50VHlwZTogZXZlbnRUeXBlLFxuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWVzc2FnZXNQZW5kaW5nLnB1c2gobWVzc2FnZSk7XG4gICAgfVxuICB9XG4gIFxuICB0cmlnZ2VyKGV2ZW50LCBkYXRhPW51bGwpe1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgJ3R5cGUnOiAnV0VCU09DS0VUX0VWRU5UJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICBldmVudCxcbiAgICAgICAgZGF0YVxuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGlmICh0aGlzLmxpc3RlbmVyc1tldmVudF0pe1xuICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XSBpbnN0YW5jZW9mIEFycmF5ID8gdGhpcy5saXN0ZW5lcnNbZXZlbnRdIDogdGhpcy5saXN0ZW5lcnNbZXZlbnRdLmFjdGlvbnM7XG4gICAgICBpZiAobGlzdGVuZXJzKXtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoYWN0aW9uIG9mIGxpc3RlbmVycyl7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbigpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgb3RoZXJMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudF0uY2FsbGJhY2tzO1xuICAgICAgaWYgKG90aGVyTGlzdGVuZXJzKXtcbiAgICAgICAgZm9yIChjYWxsYmFjayBvZiBvdGhlckxpc3RlbmVycyl7XG4gICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIGdldFRpY2tldChjYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy50aWNrZXQpIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhIHRpY2tldCwgc28gd2UgbmVlZCB0byB2YWxpZGF0ZSBpdCBiZWZvcmUgdXNpbmcgaXRcbiAgICAgICAgbUFwaSgpLndlYnNvY2tldC5jYWNoZUNsZWFyKCkudGlja2V0LmNoZWNrLnJlYWQodGhpcy50aWNrZXQpLmNhbGxiYWNrKCQucHJveHkoZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAvLyBUaWNrZXQgZGlkIG5vdCBwYXNzIHZhbGlkYXRpb24sIHNvIHdlIG5lZWQgdG8gY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaWNrZXQoJC5wcm94eShmdW5jdGlvbiAodGlja2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMudGlja2V0ID0gdGlja2V0O1xuICAgICAgICAgICAgICBjYWxsYmFjayh0aWNrZXQpO1xuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaWNrZXQgcGFzc2VkIHZhbGlkYXRpb24sIHNvIHdlIHVzZSBpdFxuICAgICAgICAgICAgY2FsbGJhY2sodGhpcy50aWNrZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0aWNrZXRcbiAgICAgICAgdGhpcy5jcmVhdGVUaWNrZXQoKHRpY2tldCk9PntcbiAgICAgICAgICB0aGlzLnRpY2tldCA9IHRpY2tldDtcbiAgICAgICAgICBjYWxsYmFjayh0aWNrZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIlRpY2tldCBjcmVhdGlvbiBmYWlsZWQgb24gYW4gaW50ZXJuYWwgZXJyb3JcIiwgJ2Vycm9yJykpO1xuICAgIH1cbiAgfVxuICBcbiAgY3JlYXRlVGlja2V0KGNhbGxiYWNrKSB7XG4gICAgbUFwaSgpLndlYnNvY2tldC50aWNrZXQuY3JlYXRlKClcbiAgICAgIC5jYWxsYmFjaygoZXJyLCB0aWNrZXQpPT57XG4gICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgY2FsbGJhY2sodGlja2V0LnRpY2tldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3QgY3JlYXRlIFdlYlNvY2tldCB0aWNrZXRcIiwgJ2Vycm9yJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuICBcbiAgb25XZWJTb2NrZXRDb25uZWN0ZWQoKSB7XG4gICAgdGhpcy5zb2NrZXRPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLnRyaWdnZXIoXCJ3ZWJTb2NrZXRDb25uZWN0ZWRcIik7IFxuICAgIFxuICAgIHdoaWxlICh0aGlzLnNvY2tldE9wZW4gJiYgdGhpcy5tZXNzYWdlc1BlbmRpbmcubGVuZ3RoKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWVzc2FnZXNQZW5kaW5nLnNoaWZ0KCk7XG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKG1lc3NhZ2UuZXZlbnRUeXBlLCBtZXNzYWdlLmRhdGEpO1xuICAgIH1cbiAgfVxuICBcbiAgb25XZWJTb2NrZXRFcnJvcigpIHtcbiAgICB0aGlzLnJlY29ubmVjdCgpO1xuICB9XG4gIFxuICBvbldlYlNvY2tldENsb3NlKCkge1xuICAgIHRoaXMudHJpZ2dlcihcIndlYlNvY2tldERpc2Nvbm5lY3RlZFwiKTsgXG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgfVxuICBcbiAgb3BlbldlYlNvY2tldCgpIHtcbiAgICBsZXQgaG9zdCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuICAgIGxldCBzZWN1cmUgPSBsb2NhdGlvbi5wcm90b2NvbCA9PSAnaHR0cHM6JztcbiAgICB0aGlzLndlYlNvY2tldCA9IHRoaXMuY3JlYXRlV2ViU29ja2V0KChzZWN1cmUgPyAnd3NzOi8vJyA6ICd3czovLycpICsgaG9zdCArICcvd3Mvc29ja2V0LycgKyB0aGlzLnRpY2tldCk7XG4gICAgXG4gICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLm9uV2ViU29ja2V0TWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25lcnJvciA9IHRoaXMub25XZWJTb2NrZXRFcnJvci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9IHRoaXMub25XZWJTb2NrZXRDbG9zZS5iaW5kKHRoaXMpO1xuICAgICAgc3dpdGNoICh0aGlzLndlYlNvY2tldC5yZWFkeVN0YXRlKSB7XG4gICAgICAgIGNhc2UgdGhpcy53ZWJTb2NrZXQuQ09OTkVDVElORzpcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbm9wZW4gPSB0aGlzLm9uV2ViU29ja2V0Q29ubmVjdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRoaXMud2ViU29ja2V0Lk9QRU46XG4gICAgICAgICAgdGhpcy5vbldlYlNvY2tldENvbm5lY3RlZCgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIldlYlNvY2tldCBjb25uZWN0aW9uIGZhaWxlZFwiLCAnZXJyb3InKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbnMuZGlzcGxheU5vdGlmaWNhdGlvbihcIkNvdWxkIG5vdCBvcGVuIFdlYlNvY2tldCBjb25uZWN0aW9uXCIsICdlcnJvcicpKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNyZWF0ZVdlYlNvY2tldCh1cmwpIHtcbiAgICBpZiAoKHR5cGVvZiB3aW5kb3cuV2ViU29ja2V0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdy5Nb3pXZWJTb2NrZXQpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBNb3pXZWJTb2NrZXQodXJsKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIHN0YXJ0UGluZ2luZygpIHtcbiAgICB0aGlzLnBpbmdIYW5kbGUgPSBzZXRJbnRlcnZhbCgoKT0+e1xuICAgICAgaWYgKHRoaXMuc29ja2V0T3BlbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLnBpbmdpbmcpIHtcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShcInBpbmc6cGluZ1wiLCB7fSk7XG4gICAgICAgIHRoaXMucGluZ2luZyA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBpbmdUaW1lICs9IHRoaXMub3B0aW9ucy5waW5nVGltZVN0ZXA7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5waW5nVGltZSA+IHRoaXMub3B0aW9ucy5waW5nVGltZW91dCkge1xuICAgICAgICAgIGlmIChjb25zb2xlKSBjb25zb2xlLmxvZyhcInBpbmcgZmFpbGVkLCByZWNvbm5lY3RpbmcuLi5cIik7XG4gICAgICAgICAgdGhpcy5waW5naW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5waW5nVGltZSA9IDA7XG4gICAgICAgICAgXG4gICAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMub3B0aW9ucy5waW5nVGltZVN0ZXApO1xuICB9XG4gIFxuICByZWNvbm5lY3QoKSB7XG4gICAgdmFyIHdhc09wZW4gPSB0aGlzLnNvY2tldE9wZW47IFxuICAgIHRoaXMuc29ja2V0T3BlbiA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlY29ubmVjdFRpbWVvdXQpO1xuICAgIFxuICAgIHRoaXMucmVjb25uZWN0VGltZW91dCA9IHNldFRpbWVvdXQoKCk9PntcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICB0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgaWYgKHdhc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJlbGF0ZWQgdG8gZGlzY2FyZGluZyBhIFdlYlNvY2tldCBcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5nZXRUaWNrZXQoKHRpY2tldCk9PntcbiAgICAgICAgaWYgKHRoaXMudGlja2V0KSB7XG4gICAgICAgICAgdGhpcy5vcGVuV2ViU29ja2V0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb25zLmRpc3BsYXlOb3RpZmljYXRpb24oXCJDb3VsZCBub3Qgb3BlbiBXZWJTb2NrZXQgYmVjYXVzZSB0aWNrZXQgd2FzIG1pc3NpbmdcIiwgJ2Vycm9yJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgIH0sIHRoaXMub3B0aW9ucy5yZWNvbm5lY3RJbnRlcnZhbCk7XG4gIH1cbiAgXG4gIG9uV2ViU29ja2V0TWVzc2FnZShldmVudCkge1xuICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICB2YXIgZXZlbnRUeXBlID0gbWVzc2FnZS5ldmVudFR5cGU7XG4gICAgXG4gICAgaWYgKGV2ZW50VHlwZSA9PSBcInBpbmc6cG9uZ1wiKSB7XG4gICAgICB0aGlzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucGluZ1RpbWUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXIoZXZlbnRUeXBlLCBtZXNzYWdlLmRhdGEpO1xuICAgIH1cbiAgfVxuICBcbiAgb25CZWZvcmVXaW5kb3dVbmxvYWQoKSB7XG4gICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICB0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSAoKT0+e307XG4gICAgICB0aGlzLndlYlNvY2tldC5vbmVycm9yID0gKCk9Pnt9O1xuICAgICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9ICgpPT57fTtcbiAgICAgIGlmICh0aGlzLnNvY2tldE9wZW4pIHtcbiAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iXX0=
