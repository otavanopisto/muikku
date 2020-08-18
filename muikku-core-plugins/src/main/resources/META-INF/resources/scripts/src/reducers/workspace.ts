import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';

import workspaces from './workspaces';
import announcements from './announcements';
import discussion from './discussion';
import userIndex from './user-index';

import {combineReducers} from 'redux';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  title,

  workspaces,
  announcements,
  discussion,
  userIndex
});
