import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';

import messages from './main-function/messages';
import announcements from './announcements';
import workspaces from './workspaces';
import userIndex from './user-index';

import discussion from '~/reducers/discussion';
import guider from './main-function/guider';

import profile from './main-function/profile';

import records from '~/reducers/main-function/records';
import vops from '~/reducers/main-function/vops';
import hops from '~/reducers/main-function/hops';

import {combineReducers} from 'redux';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  title,
  userIndex,
  records,
  vops,
  hops,
  announcements,
  workspaces,
  messages,
  discussion,
  guider,
  profile
});
