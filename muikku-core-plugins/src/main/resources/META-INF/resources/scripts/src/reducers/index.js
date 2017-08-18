import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import websocket from './util/websocket';
import messageCount from './main-function/message-count';
import announcements from './main-function/announcements';
import lastWorkspace from './main-function/last-workspace';
import lastMessages from './main-function/last-messages';
import workspaces from './main-function/workspaces';

import {combineReducers} from 'redux';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  announcements,
  lastWorkspace,
  workspaces,
  lastMessages,
  messageCount
});