import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messages from './main-function/messages';

import announcements from './main-function/announcer/announcements';
import announcerNavigation from './main-function/announcer/announcer-navigation';

import {combineReducers} from 'redux';
import userIndex from './main-function/user-index';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  messages,
  title,
  announcements,
  announcerNavigation,
  userIndex
});