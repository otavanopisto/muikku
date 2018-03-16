import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messages from './main-function/messages';
import userIndex from './main-function/user-index';

import {combineReducers} from 'redux';
import areas from '~/reducers/main-function/discussion/discussion-areas';
import discussionThreads from '~/reducers/main-function/discussion/discussion-threads'

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  messages,
  title,
  areas,
  discussionThreads,
  userIndex
});