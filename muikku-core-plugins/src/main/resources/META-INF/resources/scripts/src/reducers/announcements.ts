import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messageCount from './main-function/message-count';
import currentAnnouncement from './main-function/announcements/current-announcement';
import announcements from './main-function/index/announcements';
import {combineReducers} from 'redux';
import userIndex from './main-function/user-index';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  messageCount,
  title,
  announcements,
  currentAnnouncement,
  userIndex
});